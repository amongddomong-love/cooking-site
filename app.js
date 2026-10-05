(() => {
  const FAV_KEY = "cooking.favorites";
  const THEME_KEY = "cooking.theme";
  const MISSION_KEY = "cooking.missions";
  const tagged = t => r => (r.tags || []).includes(t);
  // 메뉴 분류 탭: 종류(cuisine) 3개 + 컬렉션 3개(밑반찬=반찬 카테고리, 초등=tags kids, 야식=tags night)
  const COLLS = [
    { key: "전체", icon: "🍽", f: () => true },
    { key: "한식", icon: "🍚", f: r => r.cuisine === "한식" },
    { key: "양식", icon: "🍝", f: r => r.cuisine === "양식" },
    { key: "이색", icon: "🌏", f: r => r.cuisine === "이색" },
    { key: "밑반찬", icon: "🥢", f: r => r.category === "반찬", img: "img/sigeumchi-namul.jpg", sub: "매일 꺼내 먹는" },
    { key: "초등", icon: "🧒", f: tagged("kids"), img: "img/gyeran-mari.jpg", sub: "아이가 좋아하는", label: "초등 메뉴" },
    { key: "야식", icon: "🌙", f: tagged("night"), img: "img/tteokbokki.jpg", sub: "늦은 밤 한 그릇" }
  ];
  const SK = typeof SKILLS === "object" ? SKILLS : [];

  const $ = sel => document.querySelector(sel);
  const grid = $("#grid"), chips = $("#chips"), search = $("#search");
  const count = $("#count"), empty = $("#empty");
  const dialog = $("#detail"), detailBody = $("#detailBody");

  // localStorage 는 사생활 보호 모드 등에서 실패할 수 있으므로 모두 try/catch.
  const store = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
  };

  let favorites = new Set(store.get(FAV_KEY, []));
  let activeCategory = "전체";
  let activeCuisine = "전체";
  let timers = [];

  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function formatAmount(n) {
    if (n >= 10) return String(Math.round(n));
    const r = Math.round(n * 10) / 10;
    const fractions = { 0.3: "⅓", 0.5: "½", 0.7: "⅔" };
    const whole = Math.floor(r), frac = Math.round((r - whole) * 10) / 10;
    if (fractions[frac]) return (whole ? whole : "") + fractions[frac];
    return String(r);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function matches(r, q) {
    if (!q) return true;
    const hay = [r.title, r.desc, r.cuisine, r.category, ...r.ingredients.map(i => i.name)].join(" ").toLowerCase();
    return q.toLowerCase().split(/\s+/).every(word => hay.includes(word));
  }

  const coll = key => COLLS.find(c => c.key === key);
  const inCuisine = r => coll(activeCuisine).f(r);
  function renderCuisines() {
    $("#cuisines").innerHTML = COLLS.map(c =>
      `<button data-coll="${c.key}" aria-pressed="${c.key === activeCuisine}">${c.icon} ${c.label || c.key} <small>${RECIPES.filter(c.f).length}</small></button>`
    ).join("");
  }
  function setColl(key) {
    activeCuisine = key; activeCategory = "전체";
    renderCuisines(); renderChips(); renderGrid();
  }
  // 칩: 종류 탭은 카테고리, 컬렉션 탭(초등·야식)은 종류별(밑반찬은 모두 한식 반찬이라 생략)
  const chipKey = r => (activeCuisine === "초등" || activeCuisine === "야식") ? r.cuisine : r.category;
  function renderChips() {
    const keys = activeCuisine === "밑반찬" ? [] : [...new Set(RECIPES.filter(inCuisine).map(chipKey))];
    const cats = ["전체", "즐겨찾기", ...keys];
    if (!cats.includes(activeCategory)) activeCategory = "전체";
    chips.innerHTML = cats.map(c =>
      `<button class="chip" aria-pressed="${c === activeCategory}" data-cat="${escapeHtml(c)}">${c === "즐겨찾기" ? "❤️ " : ""}${escapeHtml(c)}</button>`
    ).join("");
  }

  function renderGrid() {
    const q = search.value.trim();
    const list = RECIPES.filter(r => inCuisine(r) &&
      (activeCategory === "전체" || (activeCategory === "즐겨찾기" ? favorites.has(r.id) : chipKey(r) === activeCategory)) && matches(r, q)
    );
    count.textContent = `레시피 ${list.length}개`;
    empty.hidden = list.length > 0;
    grid.innerHTML = list.map(r => `
      <div class="card" role="button" tabindex="0" data-id="${r.id}">
        <div class="card-photo">
          ${r.img ? `<img src="${r.img}" alt="${escapeHtml(r.title)}" loading="lazy" onerror="this.remove()">` : ""}
          <span class="emoji-fallback" aria-hidden="true">${r.img ? "" : r.emoji}</span>
          <span class="cat-badge">${escapeHtml(r.cuisine === "이색" ? r.category : r.cuisine + " · " + r.category)}</span>
          <span class="tag-row">${(r.tags || []).map(t => `<i>${t === "kids" ? "🧒 초등" : "🌙 야식"}</i>`).join("")}</span>
        </div>
        <div class="card-body">
          <h3>${escapeHtml(r.title)}</h3>
          <div class="meta"><span>${r.time}분</span><span>${r.level}</span><span>${r.servings}인분</span></div>
        </div>
        <button class="fav" data-fav="${r.id}" aria-label="즐겨찾기">${favorites.has(r.id) ? "❤️" : "🤍"}</button>
      </div>`).join("");
  }

  function toggleFav(id) {
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    store.set(FAV_KEY, [...favorites]);
    renderGrid();
  }

  function clearTimers() {
    timers.forEach(t => clearInterval(t));
    timers = [];
  }

  function openDetail(id) {
    const r = RECIPES.find(x => x.id === id);
    if (!r) return;
    let servings = r.servings;
    clearTimers();

    const ingHtml = () => r.ingredients.map(i => {
      const amt = i.amount == null ? i.note : formatAmount(i.amount * servings / r.servings) + " " + i.unit;
      const note = i.amount != null && i.note ? ` <span class="note">(${escapeHtml(i.note)})</span>` : "";
      const pr = priceOf(i.name);
      return `<li><span class="nm">${escapeHtml(i.name)}${note}${pr ? `<span class="pr">🛒 ${escapeHtml(pr)}</span>` : ""}</span><span class="amt">${escapeHtml(amt)}</span></li>`;
    }).join("");

    detailBody.innerHTML = `
      <div class="detail-photo">
        <button class="ghost icon close" aria-label="닫기">✕</button>
        ${r.img ? `<img src="${r.img}" alt="">` : `<span class="emoji-fallback" aria-hidden="true">${r.emoji}</span>`}
        <div class="cap">
          <h2>${escapeHtml(r.title)}</h2>
          <div class="meta"><span>⏱ ${r.time}분</span><span>📶 ${r.level}</span><span>🏷 ${escapeHtml(r.cuisine)} · ${escapeHtml(r.category)}</span></div>
        </div>
      </div>
      <div class="detail-content">
        ${r.source ? `<p class="src">📖 참고 · <a href="${escapeHtml(r.source.url)}" target="_blank" rel="noopener">${escapeHtml(r.source.title)}</a></p>` : ""}
        <p class="lead">${escapeHtml(r.desc)}</p>
        <h3>재료
          <span class="servings" style="float:right;font-weight:400">
            <button data-s="-1" aria-label="인분 줄이기">−</button>
            <span id="servingsLabel">${servings}인분</span>
            <button data-s="1" aria-label="인분 늘리기">＋</button>
          </span>
        </h3>
        ${skillLinks(r)}
        <ul class="ing-list" id="ingList">${ingHtml()}</ul>
        ${r.servingsNote ? `<p class="serv-note">※ ${escapeHtml(r.servingsNote)}</p>` : ""}
        <h3>만드는 법</h3>
        <ol class="steps">
          ${r.steps.map((s, idx) => `
            <li>
              <input type="checkbox" aria-label="${idx + 1}단계 완료">
              <span class="step-text"><b>${idx + 1}.</b> ${escapeHtml(s.text)}</span>
              ${s.timer ? `<button class="timer" data-sec="${Math.round(s.timer * 60)}">⏲ ${formatTime(Math.round(s.timer * 60))}</button>` : ""}
            </li>`).join("")}
        </ol>
        ${r.tip ? `<div class="tip">💡 ${escapeHtml(r.tip)}</div>` : ""}
      </div>`;

    detailBody.querySelector(".close").onclick = () => dialog.close();
    detailBody.querySelectorAll("[data-s]").forEach(b => b.onclick = () => {
      servings = Math.min(12, Math.max(1, servings + Number(b.dataset.s)));
      $("#servingsLabel").textContent = `${servings}인분`;
      $("#ingList").innerHTML = ingHtml();
    });
    detailBody.querySelectorAll(".steps input").forEach(cb =>
      cb.onchange = () => cb.closest("li").classList.toggle("done", cb.checked));
    detailBody.querySelectorAll(".timer").forEach(setupTimer);
    bindJumps(id);

    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  }

  // ---------- 요리 기초 (skills.js) ----------
  const skillById = id => SK.find(k => k.id === id);
  const recipesFor = sid => RECIPES.filter(r => (r.skills || []).includes(sid));
  function skillLinks(r) {
    const list = (r.skills || []).map(skillById).filter(Boolean);
    if (!list.length) return "";
    return `<div class="skill-links"><b>필요한 기초</b>${list.map(k =>
      `<button class="jump ${isDone(k) ? "ok" : ""}" data-skill="${k.id}">${isDone(k) ? "✅" : k.emoji} ${escapeHtml(k.title)}</button>`).join("")}</div>`;
  }
  function bindJumps(fromRecipe) {
    detailBody.querySelectorAll("[data-skill]").forEach(b => b.onclick = () => openSkill(b.dataset.skill, fromRecipe));
    detailBody.querySelectorAll("[data-recipe]").forEach(b => b.onclick = () => openDetail(b.dataset.recipe));
  }
  // 미션 진행: { skillId: [true, false, true] } — 체크 3개 모두면 완료
  let missions = store.get(MISSION_KEY, {});
  const checksOf = k => missions[k.id] || [];
  const isDone = k => k.checks.every((_, i) => checksOf(k)[i]);
  const doneCount = () => SK.filter(isDone).length;
  const nextSkill = () => SK.find(k => !isDone(k));
  function level(n) {
    if (n >= SK.length) return { icon: "🏅", name: "집밥 마스터" };
    if (n >= 10) return { icon: "🧑‍🍳", name: "집밥 요리사" };
    if (n >= 5) return { icon: "🍳", name: "주방 견습생" };
    return { icon: "🌱", name: "새싹 요리사" };
  }
  function renderSkills() {
    const box = $("#skillsView");
    const q = search.value.trim().toLowerCase();
    const hit = k => !q || [k.title, k.summary, k.mission, k.group, ...k.checks, ...k.sections.flatMap(s => [s.h, ...s.items])].join(" ").toLowerCase().includes(q);
    const n = doneCount(), lv = level(n), nx = nextSkill();
    const top = `<div class="quest-top">
      <div class="q-level">
        <span class="q-badge">${lv.icon}</span>
        <div><p class="q-kicker">내 레벨</p><b>${lv.name}</b>
          <div class="q-bar"><i style="width:${Math.round(n / SK.length * 100)}%"></i></div>
          <p class="q-count">${n} / ${SK.length} 미션 완료</p></div>
      </div>
      ${nx ? `<button class="q-next" data-skill="${nx.id}">
        <span class="q-kicker">다음 미션 · ${String(nx.no).padStart(2, "0")}</span>
        <b>${nx.emoji} ${escapeHtml(nx.mission)}</b>
        <span class="q-go">시작하기 →</span></button>`
      : `<div class="q-next done"><b>🎉 15단계 완주!</b><span class="q-go">이제 어떤 레시피든 도전해 보세요</span></div>`}
    </div>`;
    const groups = [...new Set(SK.map(k => k.group))];
    const path = groups.map(g => {
      const ks = SK.filter(k => k.group === g && hit(k));
      if (!ks.length) return "";
      return `<h2 class="sk-group">${escapeHtml(g)}</h2><ol class="q-path">${ks.map(k => {
        const c = checksOf(k).filter(Boolean).length, done = isDone(k), cur = nx && nx.id === k.id;
        return `<li><button class="q-step ${done ? "done" : ""} ${cur ? "cur" : ""}" data-skill="${k.id}">
          <span class="q-node">${done ? "✓" : k.no}</span>
          <span class="q-txt"><b>${k.emoji} ${escapeHtml(k.title)}</b><span>${escapeHtml(k.mission)}</span></span>
          <span class="q-prog">${done ? "완료" : cur ? "진행" : c + "/3"}</span>
        </button></li>`;
      }).join("")}</ol>`;
    }).join("");
    box.innerHTML = top + (path || `<p class="empty">검색 결과 없음</p>`);
  }
  function refreshProgress() {
    renderHeroStats(); renderCollections();
    if (mode === "skills") renderSkills();
  }
  function openSkill(sid, fromRecipe) {
    const k = skillById(sid);
    if (!k) return;
    clearTimers();
    const rel = recipesFor(sid);
    const missionHtml = () => {
      const ch = checksOf(k), done = isDone(k), nx = nextSkill();
      return `<p class="m-label">🎯 미션 ${String(k.no).padStart(2, "0")}</p><b class="m-title">${escapeHtml(k.mission)}</b>
        <ul class="m-checks">${k.checks.map((c, i) => `<li><label><input type="checkbox" data-mi="${i}" ${ch[i] ? "checked" : ""}><span>${escapeHtml(c)}</span></label></li>`).join("")}</ul>
        ${done ? `<div class="m-done">🎉 미션 완료!${nx ? ` <button class="jump" data-skill="${nx.id}">다음: ${nx.emoji} ${escapeHtml(nx.title)} →</button>` : " 15단계 완주"}</div>` : ""}`;
    };
    detailBody.innerHTML = `
      <div class="sk-head">
        <button class="ghost icon close" aria-label="닫기">✕</button>
        ${fromRecipe ? `<button class="ghost back" data-recipe="${fromRecipe}">← 레시피</button>` : ""}
        <span class="sk-emoji big" aria-hidden="true">${k.emoji}</span>
        <p class="sk-kicker">STEP ${String(k.no).padStart(2, "0")} · ${escapeHtml(k.group)}</p>
        <h2>${escapeHtml(k.title)}</h2>
        <p class="lead">${escapeHtml(k.summary)}</p>
      </div>
      <div class="detail-content">
        <div class="mission" id="missionBox">${missionHtml()}</div>
        ${k.sections.map(s => `<h3>${escapeHtml(s.h)}</h3><ul class="sk-list">${s.items.map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`).join("")}
        ${k.table ? `<h3>${escapeHtml(k.table.caption)}</h3><div class="tbl-wrap"><table class="sk-tbl">
          <thead><tr>${k.table.head.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>
          <tbody>${k.table.rows.map(row => `<tr>${row.map(c => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("")}</tbody>
        </table></div>` : ""}
        ${k.mistakes?.length ? `<div class="tip warn"><b>⚠️ 자주 하는 실수</b><ul>${k.mistakes.map(m => `<li>${escapeHtml(m)}</li>`).join("")}</ul></div>` : ""}
        ${rel.length ? `<h3>연습 레시피</h3><div class="skill-links">${rel.map(r =>
          `<button class="jump" data-recipe="${r.id}">${r.emoji} ${escapeHtml(r.title)}</button>`).join("")}</div>` : ""}
      </div>`;
    detailBody.querySelector(".close").onclick = () => dialog.close();
    const box = detailBody.querySelector("#missionBox");
    box.addEventListener("change", e => {
      const cb = e.target.closest("[data-mi]");
      if (!cb) return;
      const arr = k.checks.map((_, i) => !!checksOf(k)[i]);
      arr[Number(cb.dataset.mi)] = cb.checked;
      missions = { ...missions, [k.id]: arr };
      store.set(MISSION_KEY, missions);
      box.innerHTML = missionHtml();
      bindJumps(null);
      refreshProgress();
    });
    bindJumps(null);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  }

  function setupTimer(btn) {
    const total = Number(btn.dataset.sec);
    let left = total, handle = null;
    btn.onclick = () => {
      if (btn.classList.contains("finished")) {            // 완료 상태 → 리셋
        btn.classList.remove("finished");
        left = total; btn.textContent = `⏲ ${formatTime(left)}`;
        return;
      }
      if (handle) {                                          // 실행 중 → 일시정지
        clearInterval(handle); handle = null;
        btn.classList.remove("running");
        return;
      }
      btn.classList.add("running");
      handle = setInterval(() => {
        left--;
        btn.textContent = `⏲ ${formatTime(left)}`;
        if (left <= 0) {
          clearInterval(handle); handle = null;
          btn.classList.remove("running"); btn.classList.add("finished");
          btn.textContent = "✅ 완료!";
          try { navigator.vibrate?.(300); } catch {}
        }
      }, 1000);
      timers.push(handle);
    };
  }

  // ---------- 장보기 시세 (prices.js) ----------
  const P = typeof PRICES === "object" ? PRICES : null;
  const won = n => n == null ? "-" : n.toLocaleString("ko-KR") + "원";
  function cheapest(name) {
    const it = P.kca.items[name];
    if (!it) return null;
    const list = Object.entries(it.stores).filter(([, v]) => v.p).sort((a, b) => a[1].p - b[1].p);
    return list.length ? { store: list[0][0], p: list[0][1].p } : null;
  }
  function priceOf(ingName) {
    if (!P || !P.ing[ingName]) return "";
    const ref = P.ing[ingName][0];
    if (ref.startsWith("k:")) {
      const it = P.kamis.items[ref.slice(2)];
      return it && it.p ? `서울 소매 ${won(it.p)} / ${it.unit}` : "";
    }
    const c = cheapest(ref.slice(2));
    return c ? `${ref.slice(2)} ${won(c.p)} · ${c.store}` : "";
  }
  function pct(now, before) {
    if (!now || !before) return `<span class="z">-</span>`;
    const v = (now / before - 1) * 100;
    const cls = Math.abs(v) < 0.05 ? "z" : v > 0 ? "u" : "d";
    return `<span class="${cls}">${v > 0 ? "▲" : v < 0 ? "▼" : ""}${Math.abs(v).toFixed(1)}%</span>`;
  }
  let marketCat = "레시피 재료";
  function renderMarket() {
    const box = $("#marketView");
    if (!P) { box.innerHTML = `<p class="empty">시세 데이터가 없어요.</p>`; return; }
    const usedK = new Set(Object.values(P.ing).flat().filter(r => r.startsWith("k:")).map(r => r.slice(2)));
    const usedC = Object.values(P.ing).flat().filter(r => r.startsWith("c:")).map(r => r.slice(2));
    const q = search.value.trim().toLowerCase();
    const cats = ["레시피 재료", ...new Set(Object.values(P.kamis.items).map(i => i.cat))];
    const kItems = Object.entries(P.kamis.items).filter(([k, i]) =>
      i.p && (marketCat === "레시피 재료" ? usedK.has(k) : i.cat === marketCat) && (!q || k.toLowerCase().includes(q)));
    const stores = P.kca.stores;
    const cRows = [...new Set(usedC)].filter(n => P.kca.items[n] && (!q || n.toLowerCase().includes(q)));
    box.innerHTML = `<div class="mkt">
      <h2>🏬 ${escapeHtml(P.base.name)} 인근 마트 <small>직선거리 · 가까운 순</small></h2>
      <div class="marts">${P.marts.map(m => `
        <a class="mart" href="${escapeHtml(m.url)}" target="_blank" rel="noopener">
          <div class="top"><b>${escapeHtml(m.name)}</b><span class="km">${m.km.toFixed(2)}km</span></div>
          <span><i class="type ${m.type === "대형마트" ? "big" : ""}">${escapeHtml(m.type)}</i>${escapeHtml(m.addr)}</span>
          <span>🕙 ${escapeHtml(m.hours || "영업시간 미확인")} · 휴무 ${escapeHtml(m.closed || "미확인")}</span>
        </a>`).join("")}</div>

      <h2>🥬 서울 소매 시세 <small>KAMIS · ${escapeHtml(P.kamis.day)} 기준 · 전주·전월·전년 대비</small></h2>
      <nav class="chips">${cats.map(c => `<button class="chip" data-mcat="${escapeHtml(c)}" aria-pressed="${c === marketCat}">${escapeHtml(c)}</button>`).join("")}</nav>
      <div class="kgrid">${kItems.map(([k, i]) => `
        <div class="kitem ${usedK.has(k) ? "used" : ""}">
          <div class="n">${escapeHtml(i.item)}</div>
          <div class="k">${escapeHtml(i.kind)}${i.rank && i.rank !== "-" ? " · " + escapeHtml(i.rank) : ""}</div>
          <div class="p">${won(i.p)} <small>/ ${escapeHtml(i.unit)}</small></div>
          <div class="chg">주 ${pct(i.p, i.w1)} 월 ${pct(i.p, i.m1)} 년 ${pct(i.p, i.y1)}</div>
        </div>`).join("") || `<p class="empty">해당 품목이 없어요.</p>`}</div>

      <h2>🏷 가공식품 점포별 가격 <small>한국소비자원 참가격 · ${escapeHtml(P.kca.day)} 조사 · 가장 싼 곳 강조</small></h2>
      <div class="tbl-wrap"><table class="ptbl">
        <thead><tr><th>상품</th>${stores.map(s => `<th>${escapeHtml(s)}</th>`).join("")}</tr></thead>
        <tbody>${cRows.map(n => {
          const it = P.kca.items[n], best = cheapest(n);
          return `<tr><td>${escapeHtml(n)}</td>${stores.map(s => {
            const v = it.stores[s];
            if (!v || !v.p) return `<td class="z">-</td>`;
            return `<td class="${best && v.p === best.p ? "best" : ""}">${v.p.toLocaleString("ko-KR")}${v.sale ? `<i class="tag">세일</i>` : ""}${v.opo ? `<i class="tag">1+1</i>` : ""}</td>`;
          }).join("")}</tr>`;
        }).join("")}</tbody>
      </table></div>
      <p class="srcline">출처: <a href="${escapeHtml(P.kamis.url)}" target="_blank" rel="noopener">${escapeHtml(P.kamis.source)}</a> · <a href="${escapeHtml(P.kca.url)}" target="_blank" rel="noopener">${escapeHtml(P.kca.source)}</a> · 마트 정보는 각 사 점포 안내·카카오맵 · 갱신 ${escapeHtml(P.built)}</p>
    </div>`;
  }
  let mode = "recipes";
  function setMode(m) {
    mode = m;
    document.querySelectorAll(".mode button").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === m));
    $("#recipesView").hidden = m !== "recipes";
    $("#marketView").hidden = m !== "market";
    $("#skillsView").hidden = m !== "skills";
    search.placeholder = { market: "대파, 두부, 돼지", skills: "계량, 달걀, 해동" }[m] || "김치, 계란, 파스타";
    if (m === "market") renderMarket();
    if (m === "skills") renderSkills();
  }
  document.querySelector(".mode").addEventListener("click", e => {
    const b = e.target.closest("[data-mode]");
    if (b) { setMode(b.dataset.mode); history.replaceState(null, "", b.dataset.mode === "recipes" ? location.pathname : "#" + b.dataset.mode); }
  });
  $("#marketView").addEventListener("click", e => {
    const b = e.target.closest("[data-mcat]");
    if (b) { marketCat = b.dataset.mcat; renderMarket(); }
  });

  function applyTheme(theme) {
    if (theme) document.documentElement.dataset.theme = theme;
    const dark = theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    $("#themeBtn").textContent = dark ? "☀️" : "🌙";
  }

  // 이벤트
  chips.addEventListener("click", e => {
    const b = e.target.closest(".chip");
    if (!b) return;
    activeCategory = b.dataset.cat;
    renderChips(); renderGrid();
  });
  grid.addEventListener("click", e => {
    const fav = e.target.closest("[data-fav]");
    if (fav) { e.stopPropagation(); toggleFav(fav.dataset.fav); return; }
    const card = e.target.closest(".card");
    if (card) openDetail(card.dataset.id);
  });
  grid.addEventListener("keydown", e => {
    const card = e.target.closest(".card");
    if (card && e.target === card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openDetail(card.dataset.id); }
  });
  search.addEventListener("input", () => mode === "market" ? renderMarket() : mode === "skills" ? renderSkills() : renderGrid());
  $("#cuisines").addEventListener("click", e => {
    const b = e.target.closest("[data-coll]");
    if (b) setColl(b.dataset.coll);
  });
  $("#collections").addEventListener("click", e => {
    const b = e.target.closest("[data-go]");
    if (!b) return;
    if (b.dataset.go === "skills") setMode("skills");
    else { setMode("recipes"); setColl(b.dataset.go); }
    document.querySelector(".mode").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#skillsView").addEventListener("click", e => {
    const b = e.target.closest("[data-skill]");
    if (b) openSkill(b.dataset.skill, null);
  });
  dialog.addEventListener("close", clearTimers);
  dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
  $("#randomBtn").onclick = () => openDetail(RECIPES[Math.floor(Math.random() * RECIPES.length)].id);
  $("#themeBtn").onclick = () => {
    const cur = document.documentElement.dataset.theme ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    store.set(THEME_KEY, next);
    applyTheme(next);
  };

  applyTheme(store.get(THEME_KEY, null));
  function renderHeroStats() {
    const n = doneCount();
    $("#heroStats").innerHTML = `
      <div><b>${RECIPES.length}</b><span>레시피</span></div>
      <div><b>${SK.length}</b><span>기초 미션</span></div>
      <div><b>${n}<small>/${SK.length}</small></b><span>내 진행</span></div>`;
  }
  function renderCollections() {
    const nx = nextSkill();
    $("#collections").innerHTML = COLLS.filter(c => c.img).map(c => `
      <button class="coll" data-go="${c.key}" style="--bg:url('${c.img}')">
        <span class="coll-sub">${c.sub}</span><b>${c.icon} ${c.label || c.key}</b><span class="coll-n">${RECIPES.filter(c.f).length}개 메뉴 →</span>
      </button>`).join("") + `
      <button class="coll quest" data-go="skills">
        <span class="coll-sub">왕초보 15단계</span><b>🎯 기초 미션</b>
        <span class="coll-n">${nx ? `다음: ${escapeHtml(nx.title)} →` : "완주 🎉"}</span>
      </button>`;
  }
  renderHeroStats();
  renderCollections();
  renderCuisines();
  renderChips();
  renderGrid();
  if (location.hash === "#market") setMode("market");
  if (location.hash === "#skills") setMode("skills");
})();
