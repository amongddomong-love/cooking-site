// ⛳ AI Golf Coach — 골프 탭 (2026-10-05)
// 서버: chartup Netlify 함수 golf-api(기록·사진·스윙 세션) · golf-swing-background(AI 분석). 기록 원본은 비밀번호로 잠긴 구글 드라이브.
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
  const CLUBS = ["Driver", "Wood", "Hybrid", "Iron", "Wedge", "Putter"];
  const ANGLES = [["Face On", "정면 (Face On)"], ["Down The Line", "후방 (Down The Line)"], ["Unknown", "모름"]];
  const SHAPES = ["Straight", "Fade", "Slice", "Draw", "Hook", "Push", "Pull", "Unknown"];
  const GOALS = [["full", "전체 스윙 분석"], ["distance", "비거리 향상"], ["slice", "슬라이스 교정"], ["hook", "훅 교정"], ["direction", "방향성 개선"], ["impact", "임팩트 개선"], ["tempo", "스윙 템포 개선"]];
  const PHASES = ["address", "takeaway", "early_backswing", "top", "transition", "downswing", "pre_impact", "impact", "follow_through", "finish"];
  const PHASE_KO = { address: "어드레스", takeaway: "테이크어웨이", early_backswing: "얼리 백스윙", top: "탑", transition: "트랜지션", downswing: "다운스윙", pre_impact: "임팩트 직전", impact: "임팩트", follow_through: "팔로스루", finish: "피니시" };
  const KEY_PHASES = ["address", "top", "transition", "impact", "finish"];
  const RATING = { good: ["좋음", "ok"], ok: ["보통", "medium"], needs_work: ["교정 필요", "high"], unclear: ["확인 어려움", "gray"] };
  const SEV = { high: "HIGH", medium: "MEDIUM", low: "LOW" };
  const SHAPE_KO = { straight: "스트레이트", fade: "페이드", slice: "슬라이스", draw: "드로우", hook: "훅", push: "푸시", pull: "풀", unknown: "판단 어려움" };
  const DIR_KO = { left: "왼쪽", straight: "가운데", right: "오른쪽", unknown: "판단 어려움" };
  const OV_COLOR = { spine: "#ffd54a", shoulder: "#4fc3f7", hip: "#81c784", knee: "#ba68c8", shaft: "#ff8a65", head: "#fff176", ball: "#ffffff", body: "#90caf9" };
  const OV_KO = { spine: "척추", shoulder: "어깨", hip: "골반", knee: "무릎", shaft: "샤프트", head: "머리", ball: "볼", body: "몸" };
  const PRACTICE_KINDS = ["연습장", "스크린", "퍼팅", "숏게임", "레슨", "필드 연습"];
  const MAX_VIDEO = 500 * 1048576, MAX_DURATION = 120;

  // ---------- 상태 ----------
  let auth = store.get(AUTH_KEY, null);
  let data = null;                 // golf-data.json (메모리에만)
  let job = null;                  // 지금 진행 중인 스윙 분석
  let draft = null;                // 업로드 화면 {file, url, video:{...}, club, angle, shape, goal}
  const reports = new Map();       // swingId → swing.get 결과
  const photoCache = new Map();    // fileId → dataURL
  const phaseSel = new Map();      // swingId → 선택한 단계
  let showOverlay = true;
  let pollTimer = null, pollId = null;

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
  function lock() { auth = null; data = null; reports.clear(); photoCache.clear(); store.del(AUTH_KEY); render(); }
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
    const swings = (data.swings || []).filter(s => s.status === "done");
    const lastSwing = swings[0];
    const pr = (data.practices || []).filter(p => p.date >= new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10));
    const trend = st.avg5 != null && st.prev5 != null ? st.avg5 - st.prev5 : null;
    return `
      <section class="g-hero">
        <p class="eyebrow">AI GOLF COACH</p>
        <h1>Upload your swing.<br>Get professional-level feedback.</h1>
        <p>스윙 영상을 올리면 AI가 단계별로 분석하고, 지금 딱 하나 고칠 것을 알려 드려요.</p>
        <div class="row-btns"><a class="btn lg" href="#swing">🎥 Upload Swing</a><a class="btn ghostw" href="#rounds/new">⛳ 라운드 기록</a></div>
      </section>
      <div class="tiles">
        <div class="tile"><span>최근 5라운드 평균</span><b>${st.avg5 != null ? st.avg5.toFixed(1) : "–"}<small>타</small></b>
          <em class="${trend == null ? "" : trend <= 0 ? "up" : "down"}">${trend == null ? `라운드 ${st.count}회` : `이전 5회 대비 ${trend <= 0 ? "▼" : "▲"} ${Math.abs(trend).toFixed(1)}`}</em></div>
        <div class="tile"><span>베스트 스코어</span><b>${st.best ?? "–"}<small>타</small></b><em>${st.bestRound ? `${fmtDate(st.bestRound.date)} · ${esc(st.bestRound.course)}` : "기록 없음"}</em></div>
        <div class="tile"><span>평균 퍼트 (최근 5)</span><b>${st.putts != null ? st.putts.toFixed(1) : "–"}<small>개</small></b><em>${st.overPar != null ? `평균 +${st.overPar.toFixed(1)} 오버` : "퍼트를 기록해 보세요"}</em></div>
        <div class="tile"><span>최근 스윙 점수</span><b>${lastSwing ? lastSwing.score : "–"}<small>/100</small></b><em>${lastSwing ? `${fmtDate(lastSwing.date)} · ${esc(lastSwing.club)}` : `30일 연습 ${pr.length}회`}</em></div>
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
    return `<h1 class="g-h">연습</h1><p class="g-sub">무엇을 연습했는지 남기면, 스윙 분석의 드릴과 이어서 볼 수 있어요.</p>
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
    const swings = (data.swings || []).filter(s => s.status === "done");
    sheet(p.id ? "연습 수정" : "연습 기록", `
      <form class="form" id="practiceForm" data-id="${esc(p.id || "")}">
        <label>날짜<input name="date" type="date" value="${esc(p.date || today())}" required></label>
        <label>종류<select name="kind">${PRACTICE_KINDS.map(k => `<option ${k === (p.kind || "연습장") ? "selected" : ""}>${k}</option>`).join("")}</select></label>
        <label>장소<input name="place" value="${esc(p.place || "")}" placeholder="예: OO 골프연습장"></label>
        <label>시간(분)<input name="minutes" type="number" inputmode="numeric" value="${p.minutes ?? ""}"></label>
        <label>친 공(개)<input name="balls" type="number" inputmode="numeric" value="${p.balls ?? ""}"></label>
        <label>연결한 스윙 분석<select name="swingId"><option value="">없음</option>${swings.map(s => `<option value="${s.id}" ${s.id === p.swingId ? "selected" : ""}>${fmtDate(s.date)} ${esc(s.club)} · ${s.score}점</option>`).join("")}</select></label>
        <label class="full">집중한 것<input name="focus" value="${esc(p.focus || "")}" placeholder="예: 트랜지션에서 하체 리드"></label>
        <label class="full">메모<textarea name="notes">${esc(p.notes || "")}</textarea></label>
        <div class="full row-btns" style="margin:0"><button class="btn primary" type="submit">저장</button>${p.id ? `<button class="btn danger" type="button" data-practice-del="${p.id}">삭제</button>` : ""}<button class="btn" type="button" data-close>취소</button></div>
      </form>`);
  }

  // ---------- 화면: 스윙 업로드 ----------
  const segBtns = (key, opts, cur) => `<div class="seg" role="group">${opts.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<button type="button" data-opt="${key}" data-val="${esc(v)}" aria-pressed="${cur === v}">${esc(l)}</button>`; }).join("")}</div>`;
  function viewSwing(sub) {
    if (sub) return viewSwingSession(sub);
    if (job && !["done", "error"].includes(job.stage)) return viewProgress();
    if (!draft) return `<h1 class="g-h">스윙 분석</h1><p class="g-sub">스윙 영상 하나로 단계별 진단과 교정 드릴까지.</p>
      <label class="drop" id="drop"><input type="file" accept="video/mp4,video/quicktime,video/*" hidden id="videoIn">
        <div class="ic">🎥</div><b>스윙 영상 올리기</b><span class="muted">MP4 · MOV · 휴대폰 촬영 영상 · ${MAX_DURATION}초 · 500MB 이하</span></label>
      <div class="notice">📌 잘 나오는 영상: 스윙 1번이 처음부터 피니시까지 담기게 · 몸 전체와 클럽이 화면 안에 · 삼각대로 흔들림 없이 · 정면(Face On) 또는 후방(Down The Line).<br>
        🔒 영상은 개인 구글 드라이브에 저장되고, 분석에는 대표 프레임 10장만 AI(Anthropic Claude)로 보내집니다.</div>`;
    const v = draft.video;
    return `<h1 class="g-h">Your Swing</h1><p class="g-sub">영상을 확인하고 정보를 고른 뒤 분석을 시작하세요.</p>
      <div class="preview">
        <div><div class="vbox"><video src="${draft.url}" controls playsinline muted preload="metadata"></video></div>
          <div class="vmeta"><span>⏱ ${v.duration ? secs(v.duration) : "길이 확인 중"}</span><span>💾 ${mb(draft.file.size)}</span>${v.width ? `<span>🖥 ${v.width}×${v.height}</span>` : ""}<span>📄 ${esc(draft.file.name)}</span></div>
          <div class="row-btns"><button class="btn sm" data-reupload>🔄 다시 업로드</button><button class="btn sm danger" data-clear-video>🗑 영상 삭제</button></div></div>
        <div class="card">
          <div class="optgroup"><span>클럽</span>${segBtns("club", CLUBS, draft.club)}</div>
          <div class="optgroup"><span>촬영 방향</span>${segBtns("angle", ANGLES, draft.angle)}</div>
          <div class="optgroup"><span>평소 구질</span>${segBtns("shape", SHAPES, draft.shape)}</div>
          <div class="optgroup"><span>분석 목적</span>${segBtns("goal", GOALS, draft.goal)}</div>
          <button class="btn primary lg" style="width:100%" data-analyze ${v.duration ? "" : "disabled"}>✨ AI 스윙 분석 시작</button>
          <p class="fine">분석에는 1~3분 정도 걸려요. 원본 영상은 드라이브로 함께 올라가고, 창을 닫아도 분석 기록에서 결과를 볼 수 있어요.</p>
        </div>
      </div><input type="file" accept="video/mp4,video/quicktime,video/*" hidden id="videoIn">`;
  }
  async function pickVideo(file) {
    if (!file) return;
    if (!/^video\//.test(file.type) && !/\.(mp4|mov|m4v|webm|3gp)$/i.test(file.name)) return toast("영상 파일(MP4·MOV)을 골라 주세요.");
    if (file.size > MAX_VIDEO) return toast("500MB 이하 영상만 올릴 수 있어요.");
    if (draft?.url) URL.revokeObjectURL(draft.url);
    draft = { file, url: URL.createObjectURL(file), video: {}, club: draft?.club || "Driver", angle: draft?.angle || "Face On", shape: draft?.shape || "Unknown", goal: draft?.goal || "full" };
    render();
    try {
      const vid = await openVideo(draft.url);
      draft.video = { duration: vid.duration, width: vid.videoWidth, height: vid.videoHeight };
      if (vid.duration > MAX_DURATION) { toast(`${MAX_DURATION}초 이하로 잘라서 올려 주세요.`); draft.video.duration = 0; }
    } catch { toast("이 영상은 브라우저에서 열 수 없어요. MP4로 다시 저장해 주세요."); draft.video = {}; }
    render();
  }

  // ---------- 영상 처리 (브라우저) ----------
  function openVideo(url) {
    return new Promise((resolve, reject) => {
      const v = document.createElement("video");
      v.muted = true; v.playsInline = true; v.preload = "auto"; v.crossOrigin = "anonymous"; v.src = url;
      const t = setTimeout(() => reject(new Error("timeout")), 20000);
      v.onloadedmetadata = async () => {
        if (!Number.isFinite(v.duration)) {             // 일부 MOV/WEBM 은 길이가 Infinity → 끝으로 한 번 이동해 확정
          v.currentTime = 1e7; await new Promise(r => (v.ondurationchange = r)); v.currentTime = 0;
        }
        clearTimeout(t); resolve(v);
      };
      v.onerror = () => { clearTimeout(t); reject(new Error("decode")); };
    });
  }
  function seek(v, t) {
    return new Promise(res => {
      const done = () => { clearTimeout(to); v.removeEventListener("seeked", done); res(); };
      const to = setTimeout(done, 3000);
      v.addEventListener("seeked", done);
      v.currentTime = Math.min(Math.max(0, t), Math.max(0, v.duration - 0.01));
    });
  }
  async function estimateFps(v) {
    if (!("requestVideoFrameCallback" in HTMLVideoElement.prototype)) return null;
    try {
      const times = [];
      await seek(v, 0);
      await v.play();
      await new Promise(res => {
        const end = setTimeout(res, 900);
        const cb = (_, m) => { times.push(m.mediaTime); if (times.length < 24) v.requestVideoFrameCallback(cb); else { clearTimeout(end); res(); } };
        v.requestVideoFrameCallback(cb);
      });
      v.pause();
      const ds = times.slice(1).map((t, i) => t - times[i]).filter(d => d > 0.001).sort((a, b) => a - b);
      if (ds.length < 5) return null;
      return Math.round(1 / ds[Math.floor(ds.length / 2)]);
    } catch { try { v.pause(); } catch {} return null; }
  }
  function grayFrame(v, ctx, w, h) {
    ctx.drawImage(v, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h).data, g = new Uint8Array(w * h);
    for (let i = 0, j = 0; j < g.length; i += 4, j++) g[j] = (d[i] * 3 + d[i + 1] * 6 + d[i + 2]) / 10;
    return g;
  }
  async function motionCurve(v, times, onStep) {
    const w = 96, h = Math.max(32, Math.round(96 * (v.videoHeight || 16) / (v.videoWidth || 9)));
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    const m = []; let prev = null;
    for (let i = 0; i < times.length; i++) {
      await seek(v, times[i]);
      const g = grayFrame(v, ctx, w, h);
      let s = 0; if (prev) for (let k = 0; k < g.length; k++) s += Math.abs(g[k] - prev[k]);
      m.push(prev ? s / g.length : 0); prev = g;
      if (onStep && i % 4 === 0) onStep(i / times.length);
    }
    m[0] = m[1] || 0;
    return m.map((x, i) => (m[i - 1] ?? x) * 0.25 + x * 0.5 + (m[i + 1] ?? x) * 0.25);   // 살짝 부드럽게
  }
  // 1차: 영상 전체를 성기게 훑어 움직임이 가장 큰 구간(스윙)을 찾는다
  async function detectSegment(v, onStep) {
    const D = v.duration, n = Math.max(24, Math.min(240, Math.round(D * 6)));
    const times = Array.from({ length: n }, (_, i) => (i / (n - 1)) * D);
    const m = await motionCurve(v, times, onStep);
    const peak = Math.max(...m), p = m.indexOf(peak);
    if (peak < 1.2) return null;                                 // 움직임이 거의 없음 → 전체 사용
    const thr = peak * 0.16;
    let l = p, r = p, gap = 0;
    while (l > 0 && (m[l - 1] > thr || (gap++ < 2))) { l--; if (m[l] > thr) gap = 0; }
    gap = 0;
    while (r < n - 1 && (m[r + 1] > thr || (gap++ < 2))) { r++; if (m[r] > thr) gap = 0; }
    let start = Math.max(0, times[l] - 0.4), end = Math.min(D, times[r] + 0.5);
    if (end - start > 5) { start = Math.max(0, times[p] - 2.6); end = Math.min(D, times[p] + 2.2); }   // 스윙은 보통 1.5~3초
    if (end - start < 1.2) { start = Math.max(0, times[p] - 1.2); end = Math.min(D, times[p] + 1); }
    return { start, end, peakT: times[p] };
  }
  // 2차: 스윙 구간을 촘촘히 훑어 10단계 후보 시각을 고른다(AI 가 실제 프레임을 보고 다시 맞춤)
  async function pickKeyTimes(v, seg, onStep) {
    const n = Math.max(30, Math.min(120, Math.round((seg.end - seg.start) * 24)));
    const T = Array.from({ length: n }, (_, i) => seg.start + (i / (n - 1)) * (seg.end - seg.start));
    const m = await motionCurve(v, T, onStep);
    const peak = Math.max(...m.slice(Math.floor(n * 0.15)));
    const iImp = m.indexOf(peak, Math.floor(n * 0.15));
    let iMove = m.findIndex(x => x > peak * 0.25); if (iMove < 1 || iMove >= iImp) iMove = Math.max(1, Math.floor(iImp * 0.3));
    let iTop = -1, lo = Infinity;
    for (let i = iMove + 2; i < iImp - 1; i++) if (m[i] < lo) { lo = m[i]; iTop = i; }
    if (iTop < 0) iTop = Math.floor((iMove + iImp) / 2);
    const tS = T[iMove], tTop = T[iTop], tImp = T[iImp], tEnd = seg.end;
    const raw = {
      address: seg.start + 0.05, takeaway: tS + (tTop - tS) * 0.25, early_backswing: tS + (tTop - tS) * 0.6, top: tTop,
      transition: tTop + (tImp - tTop) * 0.3, downswing: tTop + (tImp - tTop) * 0.65, pre_impact: tImp - Math.min(0.06, (tImp - tTop) * 0.15),
      impact: tImp, follow_through: tImp + (tEnd - tImp) * 0.35, finish: tEnd - 0.05,
    };
    let last = -1;
    return PHASES.map(ph => { const t = Math.max(raw[ph], last + 0.01); last = t; return { t: Math.min(t, v.duration - 0.02), hint: PHASE_KO[ph] }; });
  }
  async function captureFrames(v, picks, onStep) {
    const max = 640, s = Math.min(1, max / Math.max(v.videoWidth, v.videoHeight));
    const c = document.createElement("canvas"); c.width = Math.round(v.videoWidth * s); c.height = Math.round(v.videoHeight * s);
    const ctx = c.getContext("2d");
    const out = [];
    for (let i = 0; i < picks.length; i++) {
      await seek(v, picks[i].t);
      ctx.drawImage(v, 0, 0, c.width, c.height);
      out.push({ t: +picks[i].t.toFixed(3), hint: picks[i].hint, b64: c.toDataURL("image/jpeg", 0.8).split(",")[1] });
      onStep && onStep((i + 1) / picks.length);
    }
    return out;
  }
  function uploadVideo(url, file, onProgress) {
    return new Promise((resolve, reject) => {
      const x = new XMLHttpRequest();
      x.open("PUT", url);
      x.setRequestHeader("Content-Type", file.type || "video/mp4");
      x.upload.onprogress = e => e.lengthComputable && onProgress(e.loaded / e.total);
      x.onload = () => { if (x.status === 200 || x.status === 201) { try { resolve(JSON.parse(x.responseText).id); } catch { resolve(null); } } else reject(new Error(`업로드 실패 (${x.status})`)); };
      x.onerror = () => reject(new Error("업로드 중 연결이 끊겼어요."));
      x.send(file);
    });
  }

  // ---------- 분석 실행 ----------
  const STEP_DEF = [["quality", "영상 품질 확인"], ["segment", "스윙 구간 탐색"], ["frames", "주요 프레임 추출"], ["upload", "원본 영상 업로드"], ["ai", "AI 스윙 단계 분석"], ["report", "코칭 리포트 생성"]];
  function newJob(dr = null) {
    return { id: null, stage: "client", pct: 0, now: "준비 중", steps: Object.fromEntries(STEP_DEF.map(([k]) => [k, { s: "wait", d: "" }])), frames: [], error: "", draft: dr };
  }
  function setStep(k, s, d = "") { job.steps[k] = { s, d }; paintProgress(); }
  function setPct(p, now) { job.pct = Math.max(job.pct, Math.min(100, p)); if (now) job.now = now; paintProgress(); }

  async function startAnalysis() {
    if (!draft?.video?.duration) return;
    job = newJob(draft);
    const d = draft;
    draft = null;                             // 업로드 화면은 비우고, 진행 중 영상은 job.draft 로 계속 씀
    location.hash = "#swing"; render();
    let v;
    try {
      setStep("quality", "run"); setPct(2, "영상 품질을 확인하고 있어요");
      v = await openVideo(d.url);
      const fps = await estimateFps(v);
      d.video = { ...d.video, fps, duration: v.duration, width: v.videoWidth, height: v.videoHeight };
      const warn = Math.min(v.videoWidth, v.videoHeight) < 360 ? " · 해상도가 낮아 정확도가 떨어질 수 있어요" : "";
      setStep("quality", "done", `${v.videoWidth}×${v.videoHeight} · ${fps ? fps + "fps · 약 " + Math.round(fps * v.duration) + "프레임" : "FPS 확인 불가"} · ${secs(v.duration)}${warn}`);
      setPct(6);

      setStep("segment", "run"); setPct(8, "스윙이 일어나는 구간을 찾고 있어요");
      const seg = await detectSegment(v, f => setPct(8 + f * 14));
      const useSeg = seg || { start: 0, end: v.duration };
      setStep("segment", "done", seg ? `${useSeg.start.toFixed(1)}초 ~ ${useSeg.end.toFixed(1)}초` : "뚜렷한 구간을 못 찾아 영상 전체를 사용");

      setStep("frames", "run"); setPct(23, "스윙 단계별 대표 프레임을 고르고 있어요");
      const picks = await pickKeyTimes(v, useSeg, f => setPct(23 + f * 8));
      job.frames = await captureFrames(v, picks, f => setPct(31 + f * 6));
      setStep("frames", "done", `${job.frames.length}장 (어드레스~피니시)`);

      const created = await api("swing.create", { meta: { club: d.club, angle: d.angle, shape: d.shape, goal: d.goal, video: { name: d.file.name, size: d.file.size, type: d.file.type, ...d.video } } });
      job.id = created.id;
      reports.delete(job.id);
      // 원본 업로드와 AI 분석을 동시에
      if (created.uploadUrl) {
        setStep("upload", "run", "0%");
        uploadVideo(created.uploadUrl, d.file, f => setStep("upload", "run", `${Math.round(f * 100)}% · ${mb(d.file.size * f)} / ${mb(d.file.size)}`))
          .then(async fileId => { if (fileId) await api("swing.video", { id: created.id, fileId }); setStep("upload", "done", `드라이브 저장 완료 · ${mb(d.file.size)}`); })
          .catch(e => setStep("upload", "err", `${e.message} — 분석은 계속돼요`));
      } else setStep("upload", "done", "건너뜀");
      setStep("ai", "run", "AI에 프레임을 보내는 중");
      setPct(40, "AI가 스윙 단계를 분석하고 있어요");
      await api("swing.start", { id: job.id, frames: job.frames, segment: useSeg });
      job.stage = "queued";
      location.hash = `#swing/${job.id}`;
      poll(job.id);
    } catch (e) {
      job.stage = "error"; job.error = e.message || "분석을 시작하지 못했어요.";
      const run = STEP_DEF.find(([k]) => job.steps[k].s === "run");
      if (run) setStep(run[0], "err", job.error);
      paintProgress(); render();
    } finally { if (v) { v.removeAttribute("src"); v.load(); } }
  }
  const SERVER_PCT = { created: 40, queued: 42, loading: 48, analyzing: 55, saving: 92, done: 100 };
  function poll(id) {
    if (pollId === id) return;              // 같은 세션을 이미 지켜보는 중
    pollId = id;
    clearTimeout(pollTimer);
    const tick = async () => {
      if (!job || job.id !== id || pollId !== id) { if (pollId === id) pollId = null; return; }
      try {
        const s = await api("swing.status", { id });
        job.stage = s.stage;
        if (s.stage === "error") {
          job.error = s.message || "분석 중 문제가 생겼어요."; setStep("ai", "err", job.error); reports.delete(id); pollId = null; render(); return;
        }
        if (s.stage === "done") {
          setStep("ai", "done", "10단계 분석 완료"); setStep("report", "done"); setPct(100, "리포트가 준비됐어요");
          reports.delete(id); pollId = null;
          await loadData(true); render(); return;
        }
        const base = SERVER_PCT[s.stage] ?? 45;
        const creep = s.stage === "analyzing" ? Math.min(30, (Date.now() - Date.parse(s.updatedAt)) / 4000) : 0;   // AI 응답 대기 중 천천히 진행(단계 표시는 서버 실제값)
        setStep("ai", s.stage === "saving" ? "done" : "run", s.label + (s.stage === "analyzing" && s.frames ? ` · 프레임 ${s.frames}장` : ""));
        if (s.stage === "saving") setStep("report", "run", "리포트 저장 중");
        setPct(base + creep, s.stage === "analyzing" ? "AI가 임팩트와 트랜지션을 집중해서 보고 있어요" : s.label);
      } catch (e) { if (e.status === 401) return; job.now = "연결 확인 중…"; paintProgress(); }
      pollTimer = setTimeout(tick, 3000);
    };
    tick();
  }
  function progressHTML() {
    const ic = { wait: "○", run: "◐", done: "✓", err: "!" }, label = { wait: "대기", run: "진행 중", done: "완료", err: "오류" };
    return `<ul class="steps">${STEP_DEF.map(([k, l]) => { const s = job.steps[k]; return `<li class="${s.s === "wait" ? "" : s.s}"><span class="ic">${ic[s.s]}</span>${l}<span class="dots"></span><span class="st">${s.d ? esc(s.d) : label[s.s]}</span></li>`; }).join("")}</ul>
      <div class="bar"><i style="width:${job.pct}%"></i></div><div class="pct"><span>${esc(job.now)}</span><b>${Math.round(job.pct)}%</b></div>
      ${job.frames.length ? `<div class="strip">${job.frames.map(f => `<img src="data:image/jpeg;base64,${f.b64}" alt="${esc(f.hint)}" title="${esc(f.hint)} ${f.t}s">`).join("")}</div>` : ""}`;
  }
  function viewProgress() {
    return `<section class="prog"><h1 class="g-h">영상 분석 중</h1><p class="g-sub">이 화면을 닫아도 분석은 서버에서 계속돼요. 결과는 '분석 기록'에 저장됩니다.</p>
      <div class="card" id="progCard">${progressHTML()}</div>
      ${job.stage === "error" ? `<div class="row-btns">${job.id ? `<button class="btn primary" data-retry="${job.id}">다시 분석</button>` : ""}<button class="btn" data-new-swing>새 영상으로</button></div>` : ""}</section>`;
  }
  function paintProgress() { const c = $("#progCard"); if (c && job) c.innerHTML = progressHTML(); }

  // ---------- 화면: 결과 ----------
  function viewSwingSession(id) {
    if (job && job.id === id && !["done"].includes(job.stage)) return viewProgress();
    const rep = reports.get(id);
    if (!rep) { fetchReport(id); return `<p class="empty">리포트를 불러오는 중…</p>`; }
    if (rep.error) return `<p class="empty">${esc(rep.error)} <a class="link" href="#history">분석 기록으로</a></p>`;
    if (!rep.analysis) {
      const s = rep.status || {};
      if (s.stage === "error") return `<section class="prog"><div class="card"><h2>분석하지 못했어요</h2><p>${esc(s.message || "")}</p>
        <div class="row-btns"><button class="btn primary" data-retry="${id}">다시 분석</button><button class="btn danger" data-swing-del="${id}">삭제</button></div></div></section>`;
      job = job && job.id === id ? job : { ...newJob(), id, stage: s.stage, frames: rep.frames || [] };
      ["quality", "segment", "frames"].forEach(k => (job.steps[k] = { s: "done", d: "" }));
      job.steps.upload = { s: rep.meta?.videoFileId ? "done" : "wait", d: rep.meta?.videoFileId ? "드라이브 저장됨" : "" };
      poll(id); return viewProgress();
    }
    return reportHTML(id, rep);
  }
  async function fetchReport(id) {
    try { reports.set(id, await api("swing.get", { id })); }
    catch (e) { if (e.status === 401) return; reports.set(id, { error: e.message }); }
    if (route()[0] === "swing" && route()[1] === id) render();
  }
  function frameView(id, rep, ph) {
    const a = rep.analysis, p = a.phases.find(x => x.phase === ph) || {};
    const fi = p.frame_index >= 0 ? p.frame_index : -1;
    const f = fi >= 0 ? rep.frames[fi] : null;
    const ovs = showOverlay && fi >= 0 ? a.overlays.filter(o => o.frame_index === fi && o.confidence >= 0.7) : [];
    const local = job && job.id === id && job.draft?.url;   // 방금 분석한 영상이면 원본에서 그 순간을 보여 줌
    return `<div>
        <div class="frame">${f ? `<div class="fm">` + (local ? `<video src="${job.draft.url}#t=${f.t}" muted playsinline preload="auto" data-seek="${f.t}"></video>` : `<img src="data:image/jpeg;base64,${f.b64}" alt="${PHASE_KO[ph]} 프레임">`)
          + (ovs.length ? `<svg viewBox="0 0 1 1" preserveAspectRatio="none">${ovs.map(o => `<line x1="${o.x1}" y1="${o.y1}" x2="${o.x2}" y2="${o.y2}" stroke="${OV_COLOR[o.kind]}"><title>${OV_KO[o.kind]} (신뢰도 ${Math.round(o.confidence * 100)}%)</title></line>`).join("")}</svg>` : "") + `</div>`
          : `<div class="nf">이 단계는 프레임에서 확인하기 어려웠어요.</div>`}</div>
        ${f ? `<label class="ov-toggle"><input type="checkbox" data-ov ${showOverlay ? "checked" : ""}> 분석 선 보기 ${ovs.length ? `· ${ovs.map(o => OV_KO[o.kind]).join("·")}` : "· 신뢰도 70% 이상 선만 표시(이 프레임은 없음)"}</label>` : ""}
      </div>
      <div><h3>${PHASE_KO[ph]} <span class="badge ${RATING[p.rating]?.[1] || "gray"}">${RATING[p.rating]?.[0] || "–"}</span></h3>
        ${f ? `<p class="fine">프레임 ${fi + 1} · ${f.t.toFixed(2)}초</p>` : ""}
        ${p.comment ? `<p>${esc(p.comment)}</p>` : ""}
        ${p.observed?.length ? `<b>영상에서 보이는 것</b><ul>${p.observed.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        ${p.estimated?.length ? `<b>추정</b><ul>${p.estimated.map(x => `<li><span class="est">추정</span>${esc(x)}</li>`).join("")}</ul>` : ""}
      </div>`;
  }
  function reportHTML(id, rep) {
    const a = rep.analysis, m = rep.meta || {};
    const sel = phaseSel.get(id) || a.phases.find(p => p.phase === "impact" && p.frame_index >= 0)?.phase || "address";
    const prev = (data?.swings || []).filter(s => s.status === "done" && s.club === m.club && s.id !== id && (s.createdAt || s.date) < (m.createdAt || "")).at(0);
    const bf = a.ball_flight || {};
    const conf = c => (c >= 0.75 ? "가능성이 높음" : c >= 0.45 ? "가능성이 있음" : "영상만으로 판단하기 어려움");
    return `
      <div class="row-btns" style="margin:0 0 14px"><button class="btn sm" data-go="history">← 분석 기록</button></div>
      <section class="card"><div class="report-head">
        <div class="ring" style="--p:${a.overall_score}"><div><b>${a.overall_score}</b><small>/ 100</small></div></div>
        <div><p class="label">${esc(a.score_label || "")}</p><h1>Your Swing Report</h1>
          <p class="muted" style="margin:4px 0 0">${fmtDate((m.createdAt || "").slice(0, 10))} · ${esc(m.club || "")} · ${esc(m.angle || "")} · 분석 신뢰도 ${Math.round(a.confidence * 100)}%${prev ? ` · 이전 ${prev.score}점 대비 <b style="color:var(${a.overall_score >= prev.score ? "--turf" : "--bad"})">${a.overall_score >= prev.score ? "+" : ""}${a.overall_score - prev.score}</b>` : ""}</p>
          <p style="margin:10px 0 0">${esc(a.summary)}</p>
          <div class="prio">${a.top_priorities.map((p, i) => `<div><i>0${i + 1}</i>${esc(p.title)} <span class="muted" style="font-weight:500">· ${PHASE_KO[p.phase] || ""}</span></div>`).join("")}</div>
        </div></div>
        ${a.one_focus ? `<div class="focus"><span>이번 연습에서는 딱 하나만</span><p>→ ${esc(a.one_focus)}</p></div>` : ""}
      </section>

      <h2 class="g-sec">Swing Timeline <small>단계를 누르면 그 순간의 프레임과 분석이 나와요</small></h2>
      <div class="timeline" role="tablist">${a.phases.map(p => `<button class="r-${p.rating}" data-phase="${p.phase}" aria-pressed="${p.phase === sel}">${KEY_PHASES.includes(p.phase) ? "★ " : ""}${PHASE_KO[p.phase]}<i>${RATING[p.rating]?.[0] || ""}</i></button>`).join("")}</div>
      <div class="card"><div class="phase-view" id="phaseView">${frameView(id, rep, sel)}</div></div>

      <h2 class="g-sec">코치의 한마디</h2>
      <div class="card"><p class="coach">${esc(a.coaching_message)}</p></div>

      <h2 class="g-sec">교정 포인트 <small>최대 3개 · 우선순위 순</small></h2>
      <div class="issues">${a.issues.map((x, i) => `<div class="card issue"><div class="no">0${i + 1}</div><div>
        <h3>${esc(x.title)}</h3>
        <dl><dt>SEVERITY</dt><dd><span class="badge ${x.severity}">${SEV[x.severity] || x.severity}</span> <span class="fine">${PHASE_KO[x.phase] || ""} · 신뢰도 ${Math.round(x.confidence * 100)}%</span></dd>
          <dt>WHAT</dt><dd>${esc(x.description)}</dd><dt>IMPACT</dt><dd>${esc(x.possible_effect)}</dd><dt>CORRECTION</dt><dd><b>${esc(x.correction)}</b></dd></dl></div></div>`).join("") || `<p class="empty">큰 문제를 찾지 못했어요.</p>`}</div>

      <h2 class="g-sec">예상 구질 <small>볼 데이터 없이 영상으로만 본 추정</small></h2>
      <div class="card">
        <div class="chain">${(bf.cause_chain || []).map(c => `<span>${esc(c)}</span><i>→</i>`).join("")}<span class="res">${SHAPE_KO[bf.shape] || "판단 어려움"} · ${DIR_KO[bf.direction] || ""}</span></div>
        <p class="fine">${conf(bf.confidence || 0)} (신뢰도 ${Math.round((bf.confidence || 0) * 100)}%)${bf.note ? ` · ${esc(bf.note)}` : ""}</p>
      </div>

      <h2 class="g-sec">YOUR PRACTICE PLAN</h2>
      ${a.drills.map((d, i) => `<div class="card drill"><h3>${i + 1}. ${esc(d.name)}</h3>
        <div class="meta"><span class="badge">${PHASE_KO[d.target_phase] || ""}</span><span class="badge ok">${{ beginner: "초급", intermediate: "중급", advanced: "상급" }[d.difficulty] || d.difficulty}</span><span class="badge gray">${esc(d.repetitions)}</span></div>
        <p style="margin:6px 0">${esc(d.description)}</p>${d.why ? `<p class="fine">왜? ${esc(d.why)}</p>` : ""}</div>`).join("")}
      ${a.practice_plan?.length ? `<div class="card"><p class="plan">하루 ${a.practice_plan.reduce((s, p) => s + (p.duration_minutes || 0), 0)}분 · ${a.practice_plan.map(p => `${esc(p.drill)} ${p.duration_minutes}분`).join(" + ")}</p>
        <div class="row-btns"><button class="btn turf" data-plan-log="${id}">✅ 오늘 연습으로 기록</button></div></div>` : ""}

      ${a.strengths?.length ? `<h2 class="g-sec">잘하고 있는 점</h2><div class="chips2">${a.strengths.map(s => `<span>👍 ${esc(s)}</span>`).join("")}</div>` : ""}
      <h2 class="g-sec">분석의 한계</h2>
      <div class="card"><ul class="fine" style="margin:0;padding-left:18px">${(a.limitations || []).map(x => `<li>${esc(x)}</li>`).join("")}<li>각도·수치는 영상 대표 프레임으로 본 추정이며, 실제 클럽 데이터(론치 모니터)와 다를 수 있어요.</li></ul>
        <p class="fine" style="margin:8px 0 0">분석: ${esc(a._meta?.provider || "")} ${esc(a._meta?.model || "")} · ${a._meta?.seconds ?? "–"}초 · 프레임 ${rep.frames.length}장</p></div>
      <div class="row-btns">${m.videoFileId ? `<button class="btn" data-video-link="${id}">🎬 원본 영상 (드라이브)</button>` : ""}<button class="btn" data-retry="${id}">🔁 다시 분석</button><button class="btn danger" data-swing-del="${id}">🗑 이 분석 삭제</button></div>`;
  }

  // ---------- 화면: 분석 기록 ----------
  function viewHistory() {
    const ss = data.swings || [];
    const done = ss.filter(s => s.status === "done").slice().reverse();
    const stTxt = { done: "", analyzing: "분석 중", created: "업로드 중단", error: "오류" };
    return `<h1 class="g-h">분석 기록</h1><p class="g-sub">지난 스윙과 비교하며 좋아지는 걸 확인하세요.</p>
      <div class="card">${trendChart(done.slice(-20).map(s => ({ v: s.score, label: fmtDate(s.date).slice(2) })), { invert: false, unit: "" })}</div>
      <div class="row-btns" style="margin:14px 0"><a class="btn primary" href="#swing">🎥 새 스윙 분석</a></div>
      <div class="list">${ss.map(s => `<button class="item" data-go="swing/${s.id}">
        <span class="big">${s.status === "done" ? s.score : "…"}<small>${s.status === "done" ? "/100" : ""}</small></span>
        <span class="body"><b>${esc(s.club || "클럽 미선택")} · ${esc(s.angle || "")}</b><p>${s.status === "done" ? esc((s.top || []).join(" · ") || s.summary || "") : stTxt[s.status] || s.status}</p></span>
        <span class="side">${fmtDate(s.date)}${s.videoFileId ? "<br>🎬" : ""}</span></button>`).join("") || `<p class="empty">아직 분석한 스윙이 없어요.</p>`}</div>`;
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
  const VIEWS = { home: viewHome, rounds: viewRounds, practice: viewPractice, swing: viewSwing, history: viewHistory };
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
    seekFrameVideo();
  }
  function seekFrameVideo() { const fv = $(".frame video[data-seek]"); if (fv) fv.addEventListener("loadeddata", () => { fv.currentTime = +fv.dataset.seek; }, { once: true }); }

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
    // 스윙
    if (t.closest("#drop") && !t.closest("input")) return;     // label 이 input 을 연다
    if (t.closest("[data-reupload]")) { $("#videoIn").click(); return; }
    if (t.closest("[data-clear-video]")) { if (draft?.url) URL.revokeObjectURL(draft.url); draft = null; render(); return; }
    const op = t.closest("[data-opt]"); if (op) { draft[op.dataset.opt] = op.dataset.val; $$(`[data-opt="${op.dataset.opt}"]`).forEach(b => b.setAttribute("aria-pressed", b === op)); return; }
    if (t.closest("[data-analyze]")) { startAnalysis(); return; }
    if (t.closest("[data-new-swing]")) { job = null; draft = null; location.hash = "#swing"; render(); return; }
    const ph = t.closest("[data-phase]");
    if (ph) { const id = route()[1]; phaseSel.set(id, ph.dataset.phase); $$("[data-phase]").forEach(b => b.setAttribute("aria-pressed", b === ph)); $("#phaseView").innerHTML = frameView(id, reports.get(id), ph.dataset.phase); seekFrameVideo(); return; }
    const rt = t.closest("[data-retry]");
    if (rt) { const id = rt.dataset.retry; try { await api("swing.retry", { id }); reports.delete(id); job = { ...newJob(), id, stage: "queued", draft: job?.id === id ? job.draft : null }; ["quality", "segment", "frames"].forEach(k => (job.steps[k] = { s: "done", d: "" })); job.steps.upload = { s: "done", d: "" }; job.pct = 40; location.hash = `#swing/${id}`; render(); poll(id); } catch (err) { toast(err.message); } return; }
    const sd = t.closest("[data-swing-del]");
    if (sd) { if (!confirm("이 스윙 분석(영상·프레임·리포트)을 지울까요? 드라이브 휴지통으로 이동해 30일 안에는 되살릴 수 있어요.")) return;
      try { const id = sd.dataset.swingDel; setData((await api("swing.delete", { id })).data); reports.delete(id); if (job?.id === id) job = null; location.hash = "#history"; } catch (err) { toast(err.message); } return; }
    const vl = t.closest("[data-video-link]");
    if (vl) { const w = window.open("about:blank", "_blank"); try { const r = await api("swing.videoLink", { id: vl.dataset.videoLink }); if (w) w.location = r.url; else location.href = r.url; } catch (err) { if (w) w.close(); toast(err.message); } return; }
    const pl = t.closest("[data-plan-log]");
    if (pl) { const a = reports.get(pl.dataset.planLog).analysis; openPracticeForm({ date: today(), kind: "연습장", minutes: a.practice_plan.reduce((s, p) => s + (p.duration_minutes || 0), 0), focus: a.one_focus, swingId: pl.dataset.planLog, notes: a.drills.map(d => `${d.name} (${d.repetitions})`).join(", ") }); return; }
  });
  document.addEventListener("change", e => {
    const t = e.target;
    if (t.id === "videoIn") { pickVideo(t.files[0]); t.value = ""; }
    if (t.matches("[data-ov]")) { showOverlay = t.checked; const id = route()[1]; $("#phaseView").innerHTML = frameView(id, reports.get(id), phaseSel.get(id) || $("[data-phase][aria-pressed=true]").dataset.phase); seekFrameVideo(); }
    if (t.dataset.photoAdd) { addPhotos(t.dataset.photoAdd, t.files); t.value = ""; }
  });
  document.addEventListener("dragover", e => { const d = e.target.closest?.("#drop"); if (d) { e.preventDefault(); d.classList.add("over"); } });
  document.addEventListener("dragleave", e => e.target.closest?.("#drop")?.classList.remove("over"));
  document.addEventListener("drop", e => { const d = e.target.closest?.("#drop"); if (d) { e.preventDefault(); pickVideo(e.dataTransfer.files[0]); } });
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
