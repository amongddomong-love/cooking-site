(() => {
  const THEME_KEY = "cooking.theme";          // 요리·영어와 공유
  const PREF_KEY = "startup.prefs";
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, f) { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  // 컨셉별 공간 조건(기본값 — 화면에서 조정) · 층 가중치 · 경쟁 포화 기준(같은 법정동 업소 수)
  const RULES = {
    study: { area: [30, 120], floor: { "1": .7, "2": 1, "3": 1, "4": 1, "5": .9, "지1": .6 }, other: .6, k: 2 },
    cafe:  { area: [8, 25],   floor: { "1": 1, "2": .5, "지1": .3 }, other: .2, k: 15 },
    photo: { area: [5, 15],   floor: { "1": 1, "2": .7, "지1": .6 }, other: .4, k: 5 },
    comic: { area: [30, 80],  floor: { "1": .7, "2": 1, "3": 1, "4": .9, "지1": .8 }, other: .6, k: 1 }
  };
  const W = { floor: 25, price: 25, comp: 30, area: 20 };   // 점수 가중치 (합 100)
  const REGIONS = {
    all: { label: "전체", test: () => true },
    near: { label: "송파 인근", test: x => /^(서울 (송파|강동|강남|서초|광진)구|경기 (하남|성남|광주))/.test(x.gu) },
    seoul: { label: "서울", test: x => x.sido === "서울" },
    gg: { label: "경기", test: x => x.sido === "경기" }
  };
  const BUDGETS = [0, 1e8, 2e8, 3e8, 5e8, 10e8];

  let D = null, cdist = [];
  let pref = Object.assign({ concept: "study", region: "near", budget: 0, areas: {} }, store.get(PREF_KEY, {}));
  let sortKey = "score", sortDir = -1, shown = 60;

  // ---------- 포맷 ----------
  const won = n => {
    if (n == null) return "-";
    if (n >= 1e8) return (n / 1e8).toFixed(n >= 1e9 ? 1 : 2).replace(/\.?0+$/, "") + "억";
    return Math.round(n / 1e4).toLocaleString("ko-KR") + "만";
  };
  const num = n => n == null ? "-" : n.toLocaleString("ko-KR");
  const qLabel = q => `${q.slice(2, 4)}.${q.slice(4)}Q`;
  const dday = d => {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    const v = Math.round((new Date(d + "T00:00:00") - t) / 864e5);
    return v === 0 ? "D-day" : v > 0 ? `D-${v}` : `D+${-v}`;
  };

  // ---------- 점수 ----------
  const areaOf = cid => pref.areas[cid] || RULES[cid].area;
  function pctRank(sorted, v) {          // 동별 카페 수 분포에서의 백분위 (0~1)
    let lo = 0, hi = sorted.length;
    while (lo < hi) { const m = (lo + hi) >> 1; sorted[m] < v ? lo = m + 1 : hi = m; }
    return sorted.length ? lo / sorted.length : 0;
  }
  function scoreOf(x, cid) {
    const R = RULES[cid];
    const f = x.floor == null ? .5 : (R.floor[x.floor] ?? R.other);
    // 가격: 최저율 51%(통상 3회 유찰)까지 비례, 20% 미만은 과다 유찰(권리·하자 가능성) → 감점
    const r = x.min_rate;
    const p = r == null ? .5 : r < 20 ? .4 : r <= 51 ? 1 : Math.max(0, (100 - r) / 49);
    const a = x.dong_seen ? pctRank(cdist, x.comp.cafe) : .5;     // 상권 활력 = 같은 동 카페 수 백분위
    // 경쟁: 동종이 적을수록 높되, 상권이 죽은 곳의 '경쟁 없음'은 덜 친다
    const c = x.dong_seen ? (1 / (1 + x.comp[cid] / R.k)) * (.4 + .6 * a) : .5;
    const parts = { floor: f, price: p, comp: c, area: a };
    const total = Math.round(Object.keys(W).reduce((s, k) => s + W[k] * parts[k], 0));
    return { total, parts };
  }
  function fits(cid) {
    const [lo, hi] = areaOf(cid), reg = REGIONS[pref.region].test;
    return D.auction.listings.filter(x => x.bld_py >= lo && x.bld_py <= hi && reg(x) && (!pref.budget || x.min_price <= pref.budget))
      .map(x => ({ ...x, sc: scoreOf(x, cid) }));
  }
  const median = a => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

  // ---------- 서울 추이 요약 ----------
  function trendSum(cid, area = "서울") {
    const c = D.concepts.find(k => k.id === cid);
    const s = D.trend.series[c.trend]?.[area] || [];
    if (s.length < 5) return null;
    const last = s[s.length - 1], yago = s[s.length - 5], l4 = s.slice(-4);
    const op = l4.reduce((a, r) => a + r.open, 0), cl = l4.reduce((a, r) => a + r.close, 0);
    return { s, last, yoy: (last.stores / yago.stores - 1) * 100, net4: op - cl, open4: op, close4: cl,
             fr: last.franchise / last.stores * 100 };
  }

  // ---------- 조건 바 ----------
  function renderFilters() {
    const [lo, hi] = areaOf(pref.concept);
    $("#filters").innerHTML = `
      <div class="grp"><label>컨셉</label><div class="seg">${D.concepts.map(c =>
        `<button data-concept="${c.id}" aria-pressed="${c.id === pref.concept}">${c.icon} ${esc(c.name)}</button>`).join("")}</div></div>
      <div class="grp"><label>지역</label><div class="seg">${Object.entries(REGIONS).map(([k, r]) =>
        `<button data-region="${k}" aria-pressed="${k === pref.region}">${r.label}</button>`).join("")}</div></div>
      <div class="grp"><label for="budget">예산</label><select id="budget">${BUDGETS.map(b =>
        `<option value="${b}" ${b === pref.budget ? "selected" : ""}>${b ? won(b) + " 이하" : "제한 없음"}</option>`).join("")}</select></div>
      <div class="grp"><label>면적(평)</label><input id="aLo" type="number" min="1" value="${lo}" aria-label="최소 면적"> ~ <input id="aHi" type="number" min="1" value="${hi}" aria-label="최대 면적">
        <button class="ghost" id="aReset" title="기본값">↺</button></div>`;
  }
  function onFilter(e) {
    const b = e.target.closest("button");
    if (b?.dataset.concept) pref.concept = b.dataset.concept;
    else if (b?.dataset.region) pref.region = b.dataset.region;
    else if (b?.id === "aReset") delete pref.areas[pref.concept];
    else return;
    shown = 60; save(); renderFilters(); render();
  }
  function onFilterInput(e) {
    if (e.target.id === "budget") pref.budget = Number(e.target.value);
    else if (e.target.id === "aLo" || e.target.id === "aHi") {
      const lo = Number($("#aLo").value) || 1, hi = Number($("#aHi").value) || 999;
      pref.areas[pref.concept] = [Math.min(lo, hi), Math.max(lo, hi)];
    } else return;
    shown = 60; save(); render();
  }
  const save = () => store.set(PREF_KEY, pref);

  // ---------- 추천 ----------
  function pickCard(x) {
    const p = x.sc.parts, cid = pref.concept;
    const floorTxt = x.floor == null ? "층 미표기" : (x.floor.startsWith("지") ? "지하 " + x.floor.slice(1) + "층" : x.floor + "층");
    return `<article class="pick">
      <div class="pick-top">
        <div class="score" style="--p:${x.sc.total}" title="적합 점수">${x.sc.total}</div>
        <div><h4>${esc(x.building || x.dong)} ${esc(x.unit ? x.unit + "호" : "")}</h4><p class="addr">${esc(x.gu)} ${esc(x.dong)}</p></div>
      </div>
      <div class="price"><b>${won(x.min_price)}</b><s>${won(x.appraisal)}</s><span class="tag hot">최저 ${x.min_rate ?? "-"}%</span></div>
      <div class="tags">
        <span class="tag">${x.bld_py}평</span><span class="tag">${floorTxt}</span>
        <span class="tag">${esc(x.status || "")}</span><span class="tag">${x.sale_date.slice(5).replace("-", "/")} ${dday(x.sale_date)}</span>
        <span class="tag">같은 동 ${esc(D.concepts.find(c => c.id === cid).name)} ${x.dong_seen ? x.comp[cid] + "곳" : "-"}</span>
      </div>
      <div class="parts">
        <span><i style="--v:${p.floor}"></i>층</span><span><i style="--v:${p.price}"></i>가격</span>
        <span><i style="--v:${p.comp}"></i>경쟁</span><span><i style="--v:${p.area}"></i>상권</span>
      </div>
      <div class="links">
        <a href="${esc(x.src_url)}" target="_blank" rel="noopener">물건 정보 ↗</a>
        <a href="https://map.kakao.com/?q=${encodeURIComponent(x.address.split(/ \d+층| 지\d층|,/)[0])}" target="_blank" rel="noopener">지도 ↗</a>
        <span class="sub" style="color:var(--muted)">${esc(x.court)} ${esc(x.case)}</span>
      </div>
    </article>`;
  }
  function viewHome() {
    const stats = D.concepts.map(c => {
      const f = fits(c.id).sort((a, b) => b.sc.total - a.sc.total);
      const top = f.slice(0, 5);
      return { c, n: f.length, best: top[0]?.sc.total ?? 0, avg: top.length ? top.reduce((s, x) => s + x.sc.total, 0) / top.length : 0,
               med: median(f.map(x => x.min_price)), t: trendSum(c.id), st: D.stores.concepts[c.id], list: f };
    });
    const rank = [...stats].sort((a, b) => b.avg - a.avg).map(s => s.c.id);
    const cur = stats.find(s => s.c.id === pref.concept);
    return `
      <h2 class="sec">컨셉 비교 <small>현재 조건 · 상위 5개 물건 평균 점수 순위</small></h2>
      <div class="concepts">${stats.map(s => {
        const r = rank.indexOf(s.c.id) + 1, t = s.t;
        return `<button class="concept" data-concept="${s.c.id}" aria-pressed="${s.c.id === pref.concept}">
          <span class="rank ${r === 1 ? "" : "other"}">${r}위</span>
          <span class="ic">${s.c.icon}</span><h3>${esc(s.c.name)}</h3>
          <dl class="kv">
            <dt>조건 맞는 물건</dt><dd>${num(s.n)}건</dd>
            <dt>상위 5 평균 점수</dt><dd>${s.avg ? s.avg.toFixed(0) : "-"}</dd>
            <dt>최저가 중앙값</dt><dd>${won(s.med)}</dd>
            <dt>서울·경기 업소</dt><dd>${num(s.st.seoul + s.st.gyeonggi)}</dd>
            ${t ? `<dt>서울 점포 1년</dt><dd class="${t.yoy >= 0 ? "up" : "down"}">${t.yoy >= 0 ? "+" : ""}${t.yoy.toFixed(1)}%</dd>
            <dt>최근 4분기 순증</dt><dd class="${t.net4 >= 0 ? "up" : "down"}">${t.net4 >= 0 ? "+" : ""}${num(t.net4)}</dd>` : ""}
          </dl></button>`;
      }).join("")}</div>
      <h2 class="sec">${cur.c.icon} ${esc(cur.c.name)} 추천 물건 <small>${num(cur.n)}건 중 상위 · 점수 = 층 ${W.floor} + 가격 ${W.price} + 경쟁 ${W.comp} + 상권 ${W.area}</small></h2>
      ${cur.list.length ? `<div class="picks">${cur.list.slice(0, 9).map(pickCard).join("")}</div>
        <button class="ghost more" data-go="items">전체 ${num(cur.n)}건 보기 →</button>` : `<p class="empty">조건에 맞는 물건이 없어요. 면적·예산·지역을 넓혀 보세요.</p>`}`;
  }

  // ---------- 물건 표 ----------
  const COLS = [
    ["score", "점수", x => x.sc.total], ["l:name", "물건", null], ["bld_py", "면적(평)", x => x.bld_py],
    ["floor", "층", x => x.floor == null ? -99 : x.floor.startsWith("지") ? -Number(x.floor.slice(1)) : Number(x.floor)],
    ["min_price", "최저가", x => x.min_price], ["min_rate", "최저율", x => x.min_rate], ["min_per_py", "평당 최저가", x => x.min_per_py],
    ["comp", "같은 동 동종", x => x.dong_seen ? x.comp[pref.concept] : 1e9], ["sale_date", "기일", x => x.sale_date]
  ];
  function viewItems() {
    const list = fits(pref.concept);
    const col = COLS.find(c => c[0] === sortKey);
    if (col?.[2]) list.sort((a, b) => ((col[2](a) ?? -1e15) > (col[2](b) ?? -1e15) ? 1 : -1) * sortDir);
    const rows = list.slice(0, shown);
    return `<h2 class="sec">${esc(D.concepts.find(c => c.id === pref.concept).name)} 조건 물건 <small>${num(list.length)}건 · 머리글을 눌러 정렬</small></h2>
      <div class="tbl-wrap"><table class="tbl">
        <thead><tr>${COLS.map(([k, l]) => `<th class="${k.startsWith("l:") ? "l" : ""}" data-sort="${k}" ${k === sortKey ? `aria-sort="${sortDir > 0 ? "ascending" : "descending"}"` : ""}>${l}${k === sortKey ? (sortDir > 0 ? " ▲" : " ▼") : ""}</th>`).join("")}</tr></thead>
        <tbody>${rows.map(x => `<tr>
          <td><b>${x.sc.total}</b></td>
          <td class="l"><a href="${esc(x.src_url)}" target="_blank" rel="noopener">${esc(x.building || x.dong)} ${esc(x.unit || "")}</a><div class="sub">${esc(x.gu)} ${esc(x.dong)} · ${esc(x.status || "")}</div></td>
          <td>${x.bld_py}</td><td>${esc(x.floor ?? "-")}</td><td>${won(x.min_price)}</td><td>${x.min_rate ?? "-"}%</td>
          <td>${won(x.min_per_py)}</td><td>${x.dong_seen ? x.comp[pref.concept] : "-"}</td><td>${x.sale_date.slice(5)} <span class="sub">${dday(x.sale_date)}</span></td>
        </tr>`).join("")}</tbody></table></div>
      ${list.length > shown ? `<button class="ghost more" data-more>더 보기 (${num(list.length - shown)}건)</button>` : ""}`;
  }

  // ---------- 시장 ----------
  function lineChart(id, quarters, series, fmt) {
    const w = 560, h = 210, m = { l: 46, r: 64, t: 10, b: 24 };
    const all = series.flatMap(s => s.values).filter(v => v != null);
    let lo = Math.min(...all), hi = Math.max(...all);
    const pad = (hi - lo) * .12 || 1; lo -= pad; hi += pad;
    const x = i => m.l + i * (w - m.l - m.r) / (quarters.length - 1);
    const y = v => m.t + (hi - v) * (h - m.t - m.b) / (hi - lo);
    const ticks = [0, 1, 2, 3].map(i => lo + (hi - lo) * i / 3);
    const xt = quarters.map((q, i) => [q, i]).filter(([q]) => q.endsWith("1"));
    return `<svg id="${id}" viewBox="0 0 ${w} ${h}" role="img" data-q='${JSON.stringify(quarters)}'>
      <g class="grid">${ticks.map(t => `<line x1="${m.l}" x2="${w - m.r}" y1="${y(t)}" y2="${y(t)}"/>`).join("")}</g>
      <g class="ax">${ticks.map(t => `<text x="${m.l - 6}" y="${y(t) + 4}" text-anchor="end">${fmt(t)}</text>`).join("")}
        ${xt.map(([q, i]) => `<text x="${x(i)}" y="${h - 6}" text-anchor="middle">${q.slice(0, 4)}</text>`).join("")}</g>
      ${series.map(s => `<path d="${s.values.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join("")}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="${x(s.values.length - 1)}" cy="${y(s.values.at(-1))}" r="4" fill="${s.color}" stroke="var(--surface)" stroke-width="2"/>
        <text class="lbl" x="${x(s.values.length - 1) + 8}" y="${y(s.values.at(-1)) + 4}">${fmt(s.values.at(-1))}</text>`).join("")}
      <line class="cross" x1="0" x2="0" y1="${m.t}" y2="${h - m.b}" visibility="hidden"/>
      <rect x="${m.l}" y="0" width="${w - m.l - m.r}" height="${h}" fill="transparent" data-hit
        data-x0="${m.l}" data-step="${(w - m.l - m.r) / (quarters.length - 1)}"/>
    </svg>`;
  }
  const chartData = {};
  function viewMarket() {
    const c = D.concepts.find(k => k.id === pref.concept), st = D.stores.concepts[c.id];
    const t = trendSum(c.id), q = D.trend.quarters;
    let charts = "";
    if (t) {
      chartData.cs = { q, series: [{ name: "점포 수", color: "var(--accent)", values: t.s.map(r => r.stores) }], fmt: v => num(Math.round(v)) };
      chartData.cr = { q, series: [
        { name: "개업률", color: "var(--s-open)", values: t.s.map(r => +(r.open / r.stores * 100).toFixed(2)) },
        { name: "폐업률", color: "var(--s-close)", values: t.s.map(r => +(r.close / r.stores * 100).toFixed(2)) }], fmt: v => v.toFixed(1) + "%" };
      charts = `<div class="charts">
        <div class="chart"><h3>서울 ${esc(c.trend_name)} 점포 수</h3>${lineChart("cs", q, chartData.cs.series, chartData.cs.fmt)}</div>
        <div class="chart"><h3>서울 ${esc(c.trend_name)} 분기 개업률·폐업률</h3>
          <div class="legend"><span><i style="background:var(--s-open)"></i>개업률</span><span><i style="background:var(--s-close)"></i>폐업률</span></div>
          ${lineChart("cr", q, chartData.cr.series, chartData.cr.fmt)}</div></div>`;
    }
    const gus = Object.keys(D.trend.series[c.trend] || {}).filter(g => g !== "서울").map(g => ({ g, t: trendSum(c.id, g) })).filter(r => r.t)
      .sort((a, b) => b.t.last.stores - a.t.last.stores);
    const ggTop = Object.entries(st.by_gu).filter(([k]) => k.startsWith("경기")).slice(0, 10);
    return `
      <h2 class="sec">${c.icon} ${esc(c.name)} 경쟁 현황 <small>상가업소 ${esc(D.stores.stdrYm.slice(0, 4))}.${esc(D.stores.stdrYm.slice(4))} 기준 · ${esc(c.sdsc_name)}</small></h2>
      <div class="tiles">
        <div class="tile"><span>서울 업소</span><b>${num(st.seoul)}</b></div>
        <div class="tile"><span>경기 업소</span><b>${num(st.gyeonggi)}</b></div>
        <div class="tile"><span>송파구 업소</span><b>${num(st.by_gu["서울 송파구"] || 0)}</b></div>
        ${t ? `<div class="tile"><span>서울 점포 ${qLabel(t.last.q)}</span><b>${num(t.last.stores)}</b><em class="${t.yoy >= 0 ? "up" : "down"}">1년 ${t.yoy >= 0 ? "+" : ""}${t.yoy.toFixed(1)}%</em></div>
        <div class="tile"><span>최근 4분기 개업 − 폐업</span><b class="${t.net4 >= 0 ? "up" : "down"}">${t.net4 >= 0 ? "+" : ""}${num(t.net4)}</b><em>개업 ${num(t.open4)} · 폐업 ${num(t.close4)}</em></div>
        <div class="tile"><span>프랜차이즈 비중</span><b>${t.fr.toFixed(1)}%</b><em>${qLabel(t.last.q)}</em></div>` : ""}
      </div>
      ${charts}
      ${st.top_brands.length ? `<h2 class="sec">다점포 브랜드 <small>서울·경기 지점 수</small></h2><div class="brands">${st.top_brands.map(([n, k]) => `<span class="tag">${esc(n)} ${k}</span>`).join("")}</div>` : ""}
      ${gus.length ? `<h2 class="sec">서울 자치구별 ${esc(c.trend_name)} <small>${qLabel(t.last.q)} · 1년 증감 · 최근 4분기 개·폐업</small></h2>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">자치구</th><th>점포</th><th>1년 증감</th><th>개업(4Q)</th><th>폐업(4Q)</th><th>순증</th><th>상가업소</th></tr></thead>
      <tbody>${gus.map(({ g, t: r }) => `<tr class="${g === "송파구" ? "me" : ""}"><td class="l">${esc(g)}</td><td>${num(r.last.stores)}</td>
        <td class="${r.yoy >= 0 ? "up" : "down"}">${r.yoy >= 0 ? "+" : ""}${r.yoy.toFixed(1)}%</td><td>${num(r.open4)}</td><td>${num(r.close4)}</td>
        <td class="${r.net4 >= 0 ? "up" : "down"}">${r.net4 >= 0 ? "+" : ""}${r.net4}</td><td>${num(st.by_gu["서울 " + g] || 0)}</td></tr>`).join("")}</tbody></table></div>` : ""}
      <h2 class="sec">경기 업소 많은 시군구 <small>상가업소 기준</small></h2>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">시군구</th><th>업소</th></tr></thead>
      <tbody>${ggTop.map(([g, n]) => `<tr><td class="l">${esc(g)}</td><td>${num(n)}</td></tr>`).join("")}</tbody></table></div>`;
  }

  // ---------- 뉴스 ----------
  function viewNews() {
    const c = D.concepts.find(k => k.id === pref.concept), list = D.news[c.id] || [];
    return `<h2 class="sec">${c.icon} ${esc(c.name)} 최근 기사 <small>네이버 뉴스 · ${esc(D.built.slice(0, 10))} 수집</small></h2>
      ${list.length ? `<ul class="news">${list.map(n => `<li><time>${esc(n.d)}</time><br><a href="${esc(n.u)}" target="_blank" rel="noopener">${esc(n.t)}</a><p>${esc(n.s)}</p></li>`).join("")}</ul>` : `<p class="empty">기사가 없어요.</p>`}`;
  }

  // ---------- 라우팅·렌더 ----------
  const VIEWS = { home: viewHome, items: viewItems, market: viewMarket, news: viewNews };
  const cur = () => VIEWS[location.hash.slice(1)] ? location.hash.slice(1) : "home";
  function render() {
    const v = cur();
    document.querySelectorAll(".su-tabs a").forEach(a => a.toggleAttribute("aria-current", a.dataset.view === v));
    $("#view").innerHTML = VIEWS[v]();
  }

  // 차트 호버 (크로스헤어 + 툴팁)
  const tip = $("#tip");
  document.addEventListener("pointermove", e => {
    const hit = e.target.closest?.("[data-hit]");
    if (!hit) { if (!tip.hidden) { tip.hidden = true; document.querySelectorAll(".cross").forEach(l => l.setAttribute("visibility", "hidden")); } return; }
    const svg = hit.ownerSVGElement, cd = chartData[svg.id], pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    const i = Math.max(0, Math.min(cd.q.length - 1, Math.round((p.x - hit.dataset.x0) / hit.dataset.step)));
    const cx = Number(hit.dataset.x0) + i * hit.dataset.step, cross = svg.querySelector(".cross");
    cross.setAttribute("x1", cx); cross.setAttribute("x2", cx); cross.setAttribute("visibility", "visible");
    tip.innerHTML = `<b>${qLabel(cd.q[i])}</b>${cd.series.map(s => `${esc(s.name)} ${cd.fmt(s.values[i])}`).join("<br>")}`;
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    tip.style.left = Math.min(innerWidth - r.width - 8, e.clientX + 14) + "px";
    tip.style.top = Math.max(8, e.clientY - r.height - 10) + "px";
  });

  $("#filters").addEventListener("click", onFilter);
  $("#filters").addEventListener("change", onFilterInput);
  $("#view").addEventListener("click", e => {
    const c = e.target.closest("[data-concept]");
    if (c) { pref.concept = c.dataset.concept; shown = 60; save(); renderFilters(); render(); return; }
    const th = e.target.closest("[data-sort]");
    if (th && !th.dataset.sort.startsWith("l:")) { sortDir = sortKey === th.dataset.sort ? -sortDir : -1; sortKey = th.dataset.sort; render(); return; }
    if (e.target.closest("[data-more]")) { shown += 60; render(); return; }
    const go = e.target.closest("[data-go]");
    if (go) location.hash = go.dataset.go;
  });
  addEventListener("hashchange", () => { render(); scrollTo(0, 0); });

  function applyTheme(theme) {
    if (theme) document.documentElement.dataset.theme = theme;
    const dark = theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    $("#themeBtn").textContent = dark ? "☀️" : "🌙";
  }
  $("#themeBtn").onclick = () => {
    const c = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const n = c === "dark" ? "light" : "dark";
    store.set(THEME_KEY, n); applyTheme(n);
  };
  applyTheme(store.get(THEME_KEY, null));

  fetch("data/startup.json?v=" + Date.now().toString().slice(0, 7))
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(d => {
      D = d; cdist = d.cafe_dong_dist;
      if (!RULES[pref.concept]) pref.concept = "study";
      $("#srcFoot").innerHTML = `경매 ${esc(d.auction.updated)} · 상가업소 ${esc(d.stores.stdrYm)} (${esc(d.stores.source)}) · 서울 개·폐업 ${qLabel(d.trend.quarters.at(-1))} (<a href="${esc(d.trend.source.url)}" target="_blank" rel="noopener">${esc(d.trend.source.name)}</a>) · 갱신 ${esc(d.built)}`;
      renderFilters(); render();
    })
    .catch(err => { $("#view").innerHTML = `<p class="empty">데이터를 불러오지 못했어요 (${esc(err.message)}).</p>`; });
})();
