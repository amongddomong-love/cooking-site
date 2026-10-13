// ⛳ AI Golf Coach — 골프 탭 (2026-10-05)
// 서버: chartup Netlify 함수 golf-api(기록·사진). 기록 원본은 비밀번호로 잠긴 구글 드라이브.
// 2026-10-06 스윙 분석·분석 기록 탭은 개인 PC 로컬 도우미로 옮김(Chart Update\COOKING\local_ai) — 이 화면에서는 제거.
// 이 파일에는 개인 기록을 두지 않는다. 브라우저에는 잠금 토큰(golf.auth)과 테마만 저장한다.
(() => {
  const API = "https://chartupndown.com/.netlify/functions/golf-api";
  const AUTH_KEY = "golf.auth";            // {token, exp}
  const THEME_KEY = "cooking.theme";       // 요리·영어·창업·철학과 공유
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, f) { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} },
  };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const fmtDate = d => String(d || "").replace(/-/g, ".");
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const mb = n => (n < 1048576 ? Math.max(1, Math.round(n / 1024)) + " KB" : (n / 1048576).toFixed(n > 104857600 ? 0 : 1) + " MB");
  const secs = n => (n >= 60 ? `${Math.floor(n / 60)}분 ${Math.round(n % 60)}초` : `${n.toFixed(1)}초`);

  // ---------- 상수 ----------
  const PRACTICE_KINDS = ["연습장", "스크린", "퍼팅", "숏게임", "레슨", "필드 연습"];

  // ---------- 상태 ----------
  let auth = store.get(AUTH_KEY, null);
  let data = null;                 // golf-data.json (메모리에만)
  const photoCache = new Map();    // fileId → dataURL

  // ---------- API ----------
  class ApiError extends Error { constructor(status, msg) { super(msg); this.status = status; } }
  async function api(action, body = {}) {
    const headers = { "Content-Type": "application/json" };
    if (action !== "auth") headers.Authorization = `Bearer ${auth?.token || ""}`;
    let r;
    try { r = await fetch(API, { method: "POST", headers, body: JSON.stringify({ action, ...body }) }); }
    catch { throw new ApiError(0, "서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요."); }
    const d = await r.json().catch(() => ({}));
    if (r.status === 401 && action !== "auth") { lock(); throw new ApiError(401, d.error || "다시 잠금 해제해 주세요."); }
    if (!r.ok) throw new ApiError(r.status, d.error || `요청 실패 (${r.status})`);
    return d;
  }
  const authed = () => auth && auth.exp > Date.now();
  function lock() { auth = null; data = null; photoCache.clear(); store.del(AUTH_KEY); render(); }
  async function loadData(force = false) {
    if (data && !force) return data;
    data = await api("data.get");
    return data;
  }
  const setData = d => { if (d) data = d; };

  function toast(msg, ms = 2600) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), ms);
  }

  // ---------- 통계 ----------
  function roundStats() {
    const rs = (data?.rounds || []).filter(r => Number.isFinite(r.score)).sort((a, b) => a.date.localeCompare(b.date));
    const last = rs.slice(-5), prev = rs.slice(-10, -5);
    const avg = a => (a.length ? a.reduce((s, r) => s + r.score, 0) / a.length : null);
    const putts = rs.filter(r => Number.isFinite(r.putts)).slice(-5);
    return {
      rounds: rs, count: rs.length, avg5: avg(last), prev5: avg(prev),
      best: rs.length ? Math.min(...rs.map(r => r.score)) : null,
      bestRound: rs.length ? rs.reduce((b, r) => (r.score < b.score ? r : b)) : null,
      putts: putts.length ? putts.reduce((s, r) => s + r.putts, 0) / putts.length : null,
      overPar: last.length ? last.reduce((s, r) => s + (r.score - (r.par || 72)), 0) / last.length : null,
    };
  }
  function trendChart(points, { h = 190, avgLine = null, invert = true, unit = "" } = {}) {
    if (points.length < 2) return `<p class="empty">기록이 2개 이상이면 추이 그래프가 나와요.</p>`;
    const W = 640, H = h, P = { l: 34, r: 12, t: 14, b: 26 };
    const vs = points.map(p => p.v), lo = Math.min(...vs) - 2, hi = Math.max(...vs) + 2;
    const x = i => P.l + (i / (points.length - 1)) * (W - P.l - P.r);
    const y = v => invert ? P.t + ((v - lo) / (hi - lo)) * (H - P.t - P.b) : P.t + ((hi - v) / (hi - lo)) * (H - P.t - P.b);
    const d = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join("");
    const ticks = [lo + 2, (lo + hi) / 2, hi - 2].map(v => Math.round(v));
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="추이 그래프">
      ${ticks.map(t => `<line class="grid" x1="${P.l}" x2="${W - P.r}" y1="${y(t)}" y2="${y(t)}"/><text x="4" y="${y(t) + 4}">${t}${unit}</text>`).join("")}
      ${avgLine != null ? `<line class="avg" x1="${P.l}" x2="${W - P.r}" y1="${y(avgLine)}" y2="${y(avgLine)}"/>` : ""}
      <path class="area" d="${d}L${x(points.length - 1)},${H - P.b}L${x(0)},${H - P.b}Z"/>
      <path class="line" d="${d}"/>
      ${points.map((p, i) => `<circle class="dot" cx="${x(i)}" cy="${y(p.v)}" r="4"><title>${esc(p.label)} · ${p.v}${unit}</title></circle>`).join("")}
      <text x="${P.l}" y="${H - 6}">${esc(points[0].label)}</text><text x="${W - P.r}" y="${H - 6}" text-anchor="end">${esc(points.at(-1).label)}</text>
    </svg>`;
  }

  // ---------- 화면: 잠금 ----------
  function viewLock() {
    return `<section class="lock"><div class="card">
      <div class="logo">⛳</div>
      <h1>AI Golf Coach</h1>
      <p class="muted">개인 골프 기록과 스윙 분석은 잠겨 있어요.<br>비밀번호를 입력해 주세요.</p>
      <form id="lockForm"><input id="pass" type="password" autocomplete="current-password" placeholder="비밀번호" aria-label="비밀번호" required>
        <button class="btn primary" type="submit">열기</button></form>
      <p class="err" id="lockErr"></p>
    </div></section>`;
  }

  // ---------- 화면: 홈 ----------
  function viewHome() {
    const st = roundStats();
    const pr = (data.practices || []).filter(p => p.date >= new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10));
    const trend = st.avg5 != null && st.prev5 != null ? st.avg5 - st.prev5 : null;
    return `
      <section class="g-hero">
        <p class="eyebrow">MY GOLF NOTE</p>
        <h1>라운드와 연습을 기록하고<br>내 골프의 흐름을 봐요.</h1>
        <p>스코어·퍼트·연습을 쌓으면 추이와 베스트가 한눈에 보여요.</p>
        <div class="row-btns"><a class="btn lg" href="#rounds/new">⛳ 라운드 기록</a><a class="btn ghostw" href="#practice">🏌️ 연습 기록</a></div>
      </section>
      <div class="tiles">
        <div class="tile"><span>최근 5라운드 평균</span><b>${st.avg5 != null ? st.avg5.toFixed(1) : "–"}<small>타</small></b>
          <em class="${trend == null ? "" : trend <= 0 ? "up" : "down"}">${trend == null ? `라운드 ${st.count}회` : `이전 5회 대비 ${trend <= 0 ? "▼" : "▲"} ${Math.abs(trend).toFixed(1)}`}</em></div>
        <div class="tile"><span>베스트 스코어</span><b>${st.best ?? "–"}<small>타</small></b><em>${st.bestRound ? `${fmtDate(st.bestRound.date)} · ${esc(st.bestRound.course)}` : "기록 없음"}</em></div>
        <div class="tile"><span>평균 퍼트 (최근 5)</span><b>${st.putts != null ? st.putts.toFixed(1) : "–"}<small>개</small></b><em>${st.overPar != null ? `평균 +${st.overPar.toFixed(1)} 오버` : "퍼트를 기록해 보세요"}</em></div>
        <div class="tile"><span>최근 30일 연습</span><b>${pr.length}<small>회</small></b><em>${pr.reduce((s, p) => s + (p.minutes || 0), 0)}분 연습</em></div>
      </div>
      <h2 class="g-sec">스코어 추이 <small>점선 = 최근 5라운드 평균 · 아래로 갈수록 좋아요</small></h2>
      <div class="card">${trendChart(st.rounds.slice(-20).map(r => ({ v: r.score, label: fmtDate(r.date).slice(2) })), { avgLine: st.avg5 })}</div>
      <div class="grid2">
        <section><h2 class="g-sec">최근 라운드 <a class="link" href="#rounds">전체 보기</a></h2>
          <div class="list">${(data.rounds || []).slice(0, 3).map(roundItem).join("") || `<p class="empty">아직 라운드 기록이 없어요.</p>`}</div></section>
        <section><h2 class="g-sec">최근 연습 <a class="link" href="#practice">전체 보기</a></h2>
          <div class="list">${(data.practices || []).slice(0, 3).map(practiceItem).join("") || `<p class="empty">연습을 기록하면 여기에 쌓여요.</p>`}</div></section>
      </div>`;
  }

  // ---------- 화면: 라운드 ----------
  const roundItem = r => `<button class="item" data-go="rounds/${r.id}">
      <span class="big">${r.score ?? "–"}<small>${r.score != null ? (r.score - (r.par || 72) >= 0 ? "+" : "") + (r.score - (r.par || 72)) : ""}</small></span>
      <span class="body"><b>${esc(r.course)}</b><p>${r.companions?.length ? "👥 " + esc(r.companions.join(", ")) : "동반자 미기록"}${r.putts != null ? ` · 퍼트 ${r.putts}` : ""}</p></span>
      <span class="side">${fmtDate(r.date)}${r.photos?.length ? `<br>📷 ${r.photos.length}` : ""}</span></button>`;
  function viewRounds(sub) {
    if (sub === "new") { setTimeout(() => openRoundForm(), 0); location.replace("#rounds"); return ""; }
    if (sub) return viewRound(sub);
    const rs = data.rounds || [];
    return `<h1 class="g-h">라운드</h1><p class="g-sub">언제, 어디서, 누구와, 몇 타 — 사진까지 한곳에.</p>
      <div class="row-btns" style="margin:0 0 16px"><button class="btn primary" data-round-new>＋ 라운드 기록</button></div>
      <div class="list">${rs.map(roundItem).join("") || `<p class="empty">첫 라운드를 기록해 보세요.</p>`}</div>`;
  }
  function viewRound(id) {
    const r = (data.rounds || []).find(x => x.id === id);
    if (!r) return `<p class="empty">라운드를 찾지 못했어요. <a class="link" href="#rounds">목록으로</a></p>`;
    const over = r.score != null ? r.score - (r.par || 72) : null;
    const stat = (label, v, unit = "") => `<div class="stat"><span>${label}</span><b>${v ?? "–"}${v != null ? unit : ""}</b></div>`;
    return `<button class="btn sm" data-go="rounds">← 라운드 목록</button>
      <h1 class="g-h" style="margin-top:14px">${esc(r.course)}</h1>
      <p class="g-sub">${fmtDate(r.date)}${r.tee ? ` · ${esc(r.tee)} 티` : ""}${r.weather ? ` · ${esc(r.weather)}` : ""}${r.companions?.length ? ` · 👥 ${esc(r.companions.join(", "))}` : ""}</p>
      <div class="card"><div class="stat-row">
        ${stat("스코어", r.score)}${stat("오버", over != null ? (over >= 0 ? "+" : "") + over : null)}${stat("퍼트", r.putts)}${stat("페어웨이", r.fairways, "/14")}${stat("그린 적중", r.gir, "/18")}
      </div>${r.penalties != null ? `<p class="fine" style="margin:10px 0 0">벌타 ${r.penalties}</p>` : ""}
      ${r.notes ? `<p style="white-space:pre-wrap;margin:12px 0 0">${esc(r.notes)}</p>` : ""}
      <div class="row-btns"><button class="btn sm" data-round-edit="${r.id}">✏️ 수정</button><button class="btn sm danger" data-round-del="${r.id}">기록 삭제</button></div></div>
      <h2 class="g-sec">사진 <small>구글 드라이브 rounds/${esc(r.id)}/ 에 저장</small></h2>
      <div class="gallery">${(r.photos || []).map(p => `<div class="ph loading" data-photo="${esc(p.fileId)}" data-round="${r.id}"><button class="x" data-photo-del="${esc(p.fileId)}" aria-label="사진 삭제">✕</button></div>`).join("")}
        <label class="ph" style="display:grid;place-items:center;cursor:pointer;background:var(--accent-soft);color:var(--accent);font-weight:800">＋ 사진<input type="file" accept="image/*" multiple hidden data-photo-add="${r.id}"></label></div>`;
  }
  function openRoundForm(r = {}) {
    sheet(r.id ? "라운드 수정" : "라운드 기록", `
      <form class="form" id="roundForm" data-id="${esc(r.id || "")}">
        <label>날짜<input name="date" type="date" value="${esc(r.date || today())}" required></label>
        <label>골프장<input name="course" value="${esc(r.course || "")}" placeholder="예: OO CC" required></label>
        <label class="full">동반자 <span class="hint">쉼표로 구분</span><input name="companions" value="${esc((r.companions || []).join(", "))}" placeholder="예: 김OO, 이OO"></label>
        <label>스코어<input name="score" type="number" inputmode="numeric" value="${r.score ?? ""}" placeholder="예: 92"></label>
        <label>파<input name="par" type="number" inputmode="numeric" value="${r.par ?? 72}"></label>
        <label>퍼트<input name="putts" type="number" inputmode="numeric" value="${r.putts ?? ""}"></label>
        <label>페어웨이 안착 <span class="hint">/14</span><input name="fairways" type="number" inputmode="numeric" value="${r.fairways ?? ""}"></label>
        <label>그린 적중 <span class="hint">/18</span><input name="gir" type="number" inputmode="numeric" value="${r.gir ?? ""}"></label>
        <label>벌타<input name="penalties" type="number" inputmode="numeric" value="${r.penalties ?? ""}"></label>
        <label>티<input name="tee" value="${esc(r.tee || "")}" placeholder="화이트 / 블루"></label>
        <label>날씨<input name="weather" value="${esc(r.weather || "")}" placeholder="맑음, 바람 강함"></label>
        <label class="full">메모<textarea name="notes" placeholder="잘된 점, 아쉬운 홀, 다음에 시도할 것">${esc(r.notes || "")}</textarea></label>
        <div class="full row-btns" style="margin:0"><button class="btn primary" type="submit">저장</button><button class="btn" type="button" data-close>취소</button></div>
      </form>`);
  }

  // ---------- 화면: 연습 ----------
  const practiceItem = p => `<button class="item" data-practice-edit="${p.id}">
      <span class="big turf">${p.minutes ?? "–"}<small>${p.minutes != null ? "분" : ""}</small></span>
      <span class="body"><b>${esc(p.kind)}${p.place ? ` · ${esc(p.place)}` : ""}</b><p>${p.focus ? "🎯 " + esc(p.focus) : esc(p.notes || "메모 없음")}</p></span>
      <span class="side">${fmtDate(p.date)}${p.balls ? `<br>${p.balls}구` : ""}</span></button>`;
  function viewPractice() {
    const ps = data.practices || [];
    const month = ps.filter(p => p.date >= new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10));
    const mins = month.reduce((s, p) => s + (p.minutes || 0), 0), balls = month.reduce((s, p) => s + (p.balls || 0), 0);
    return `<h1 class="g-h">연습</h1><p class="g-sub">무엇을 연습했는지 남기면 30일 연습량과 함께 볼 수 있어요.</p>
      <div class="tiles" style="margin-top:0">
        <div class="tile"><span>최근 30일 연습</span><b>${month.length}<small>회</small></b></div>
        <div class="tile"><span>연습 시간</span><b>${Math.round(mins / 6) / 10}<small>시간</small></b></div>
        <div class="tile"><span>친 공</span><b>${balls}<small>구</small></b></div>
        <div class="tile"><span>전체 기록</span><b>${ps.length}<small>회</small></b></div>
      </div>
      <div class="row-btns" style="margin:16px 0"><button class="btn primary" data-practice-new>＋ 연습 기록</button></div>
      <div class="list">${ps.map(practiceItem).join("") || `<p class="empty">첫 연습을 기록해 보세요.</p>`}</div>`;
  }
  function openPracticeForm(p = {}) {
    sheet(p.id ? "연습 수정" : "연습 기록", `
      <form class="form" id="practiceForm" data-id="${esc(p.id || "")}">
        <label>날짜<input name="date" type="date" value="${esc(p.date || today())}" required></label>
        <label>종류<select name="kind">${PRACTICE_KINDS.map(k => `<option ${k === (p.kind || "연습장") ? "selected" : ""}>${k}</option>`).join("")}</select></label>
        <label>장소<input name="place" value="${esc(p.place || "")}" placeholder="예: OO 골프연습장"></label>
        <label>시간(분)<input name="minutes" type="number" inputmode="numeric" value="${p.minutes ?? ""}"></label>
        <label>친 공(개)<input name="balls" type="number" inputmode="numeric" value="${p.balls ?? ""}"></label>
        <label class="full">집중한 것<input name="focus" value="${esc(p.focus || "")}" placeholder="예: 트랜지션에서 하체 리드"></label>
        <label class="full">메모<textarea name="notes">${esc(p.notes || "")}</textarea></label>
        <div class="full row-btns" style="margin:0"><button class="btn primary" type="submit">저장</button>${p.id ? `<button class="btn danger" type="button" data-practice-del="${p.id}">삭제</button>` : ""}<button class="btn" type="button" data-close>취소</button></div>
      </form>`);
  }

  // ---------- 시트 ----------
  function sheet(title, body) {
    $("#sheetBody").innerHTML = `<header><h2>${esc(title)}</h2><button class="ghost icon" data-close aria-label="닫기">✕</button></header><div class="sheet-body">${body}</div>`;
    const d = $("#sheet"); if (!d.open) d.showModal();
  }
  const closeSheet = () => { const d = $("#sheet"); if (d.open) d.close(); };
  function formObj(form) {
    const o = Object.fromEntries(new FormData(form).entries());
    for (const k of ["score", "par", "putts", "fairways", "gir", "penalties", "minutes", "balls"]) if (k in o) o[k] = o[k] === "" ? null : Number(o[k]);
    return o;
  }

  // ---------- 사진 ----------
  async function resizeImage(file, max = 1600) {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => null);
    const src = bmp || await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
    const w = src.width, h = src.height, s = Math.min(1, max / Math.max(w, h));
    const c = document.createElement("canvas"); c.width = Math.round(w * s); c.height = Math.round(h * s);
    c.getContext("2d").drawImage(src, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.85).split(",")[1];
  }
  async function addPhotos(roundId, files) {
    const list = [...files].filter(f => /^image\//.test(f.type));
    for (let i = 0; i < list.length; i++) {
      toast(`사진 올리는 중 ${i + 1}/${list.length}`, 60000);
      try { const b64 = await resizeImage(list[i]); const r = await api("photo.upload", { roundId, name: list[i].name, b64 }); setData(r.data); }
      catch (e) { toast(e.message); return render(); }
    }
    toast("사진을 저장했어요."); render();
  }
  async function hydratePhotos() {
    for (const el of $$(".ph[data-photo]")) {
      const id = el.dataset.photo;
      if (el.querySelector("img")) continue;
      try {
        if (!photoCache.has(id)) { const r = await api("file.get", { fileId: id }); photoCache.set(id, `data:${r.type};base64,${r.b64}`); }
        if (!document.body.contains(el)) return;
        el.insertAdjacentHTML("afterbegin", `<img src="${photoCache.get(id)}" alt="라운드 사진" data-zoom="${id}">`);
      } catch { el.insertAdjacentHTML("afterbegin", `<p class="fine" style="padding:10px">불러오지 못함</p>`); }
      el.classList.remove("loading");
    }
  }

  // ---------- 라우팅·렌더 ----------
  const VIEWS = { home: viewHome, rounds: viewRounds, practice: viewPractice };
  const route = () => { const [v, sub] = location.hash.slice(1).split("/"); return VIEWS[v] ? [v, sub] : ["home"]; };
  async function render() {
    const nav = $(".g-tabs"), lockBtn = $("#lockBtn");
    if (!authed()) {
      nav.hidden = true; lockBtn.hidden = true;
      $("#view").innerHTML = viewLock();
      setTimeout(() => $("#pass")?.focus(), 0);
      return;
    }
    nav.hidden = false; lockBtn.hidden = false;
    if (!data) {
      $("#view").innerHTML = `<p class="empty">기록을 불러오는 중…</p>`;
      try { await loadData(); } catch (e) { if (e.status !== 401) $("#view").innerHTML = `<p class="empty">${esc(e.message)} <button class="link" data-reload>다시 시도</button></p>`; return; }
    }
    const [v, sub] = route();
    $$(".g-tabs a").forEach(a => a.toggleAttribute("aria-current", a.dataset.view === v));
    $("#view").innerHTML = VIEWS[v](sub);
    if (v === "rounds" && sub) hydratePhotos();
  }

  // ---------- 이벤트 ----------
  document.addEventListener("submit", async e => {
    const f = e.target;
    if (f.id === "lockForm") {
      e.preventDefault();
      const btn = f.querySelector("button"); btn.disabled = true; $("#lockErr").textContent = "";
      try { auth = await api("auth", { passcode: $("#pass").value }); store.set(AUTH_KEY, auth); data = null; render(); }
      catch (err) { $("#lockErr").textContent = err.message; btn.disabled = false; }
      return;
    }
    if (f.id === "roundForm" || f.id === "practiceForm") {
      e.preventDefault();
      const btn = f.querySelector("[type=submit]"); btn.disabled = true;
      const o = formObj(f); if (f.dataset.id) o.id = f.dataset.id;
      const isRound = f.id === "roundForm";
      if (isRound) o.companions = String(o.companions || "").split(",").map(s => s.trim()).filter(Boolean);
      try {
        const r = await api(isRound ? "round.save" : "practice.save", isRound ? { round: { ...((data.rounds || []).find(x => x.id === o.id) || {}), ...o } } : { practice: o });
        setData(r.data); closeSheet(); toast("저장했어요.");
        if (isRound && !f.dataset.id) location.hash = `#rounds/${r.id}`; else render();
      } catch (err) { toast(err.message); btn.disabled = false; }
    }
  });
  document.addEventListener("click", async e => {
    const t = e.target;
    const go = t.closest("[data-go]"); if (go) { location.hash = go.dataset.go; return; }
    if (t.closest("[data-close]")) { closeSheet(); return; }
    if (t.closest("[data-reload]")) { data = null; render(); return; }
    if (t.closest("[data-round-new]")) { openRoundForm(); return; }
    const re = t.closest("[data-round-edit]"); if (re) { openRoundForm(data.rounds.find(x => x.id === re.dataset.roundEdit)); return; }
    const rd = t.closest("[data-round-del]");
    if (rd) { if (!confirm("이 라운드 기록을 지울까요? (사진 파일은 드라이브에 남아요)")) return; try { setData((await api("round.delete", { id: rd.dataset.roundDel })).data); location.hash = "#rounds"; } catch (err) { toast(err.message); } return; }
    const pd = t.closest("[data-photo-del]");
    if (pd) { e.stopPropagation(); if (!confirm("이 사진을 지울까요? (드라이브 휴지통으로 이동)")) return; const roundId = pd.closest("[data-round]").dataset.round;
      try { setData((await api("photo.delete", { roundId, fileId: pd.dataset.photoDel })).data); render(); } catch (err) { toast(err.message); } return; }
    const zm = t.closest("[data-zoom]");
    if (zm) { sheet("사진", `<img src="${photoCache.get(zm.dataset.zoom)}" alt="" style="width:100%;border-radius:12px">`); return; }
    if (t.closest("[data-practice-new]")) { openPracticeForm(); return; }
    const pe = t.closest("[data-practice-edit]"); if (pe) { openPracticeForm(data.practices.find(x => x.id === pe.dataset.practiceEdit)); return; }
    const pdl = t.closest("[data-practice-del]");
    if (pdl) { if (!confirm("이 연습 기록을 지울까요?")) return; try { setData((await api("practice.delete", { id: pdl.dataset.practiceDel })).data); closeSheet(); render(); } catch (err) { toast(err.message); } return; }
  });
  document.addEventListener("change", e => {
    const t = e.target;
    if (t.dataset.photoAdd) { addPhotos(t.dataset.photoAdd, t.files); t.value = ""; }
  });
  $("#sheet").addEventListener("click", e => { if (e.target === $("#sheet")) closeSheet(); });
  $("#lockBtn").onclick = () => { if (confirm("골프 탭을 잠글까요?")) lock(); };
  addEventListener("hashchange", () => { render(); scrollTo(0, 0); });

  function applyTheme(theme) {
    if (theme) document.documentElement.dataset.theme = theme;
    const dark = theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    $("#themeBtn").textContent = dark ? "☀️" : "🌙";
  }
  $("#themeBtn").onclick = () => {
    const c = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const n = c === "dark" ? "light" : "dark"; store.set(THEME_KEY, n); applyTheme(n);
  };
  applyTheme(store.get(THEME_KEY, null));
  if (auth && !authed()) store.del(AUTH_KEY);
  render();
})();
