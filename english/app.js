(() => {
  const STATE_KEY = "english.state";
  const THEME_KEY = "cooking.theme";            // 요리 섹션과 테마를 공유한다
  const INTERVALS = [1, 3, 7, 14, 30];          // 복습 주기(일) — '잘 됨' 한 번마다 다음 칸으로
  const STATUS_LABEL = { NEW: "NEW", LEARNING: "LEARNING", WEAK: "WEAK", MASTERED: "MASTERED" };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // 일러스트 img/<name>.jpg (2026-10-05 Kling) — 파일이 없으면 img 를 지워 이모지·배경이 그대로 보이게
  const pic = (name, cls = "") => `<img class="${cls}" src="img/${name}.jpg" alt="" loading="lazy" decoding="async" onerror="this.remove()">`;

  // localStorage 는 사생활 보호 모드 등에서 실패할 수 있으므로 모두 try/catch.
  const store = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
  };

  const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = () => ymd(new Date());
  const addDays = (s, n) => { const d = new Date(s + "T00:00:00"); d.setDate(d.getDate() + n); return ymd(d); };
  const daysBetween = (a, b) => Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);

  const defaults = () => ({
    settings: { name: "", startDate: today(), dailyGoal: 20, rate: 0.9, voice: "" },
    lessons: {}, cards: {}, log: {}, activity: [], roleplays: [], extra: {}
  });
  function load() {
    const s = store.get(STATE_KEY, null), d = defaults();
    if (!s || typeof s !== "object") return d;
    return { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) } };
  }
  let S = load();
  const save = () => store.set(STATE_KEY, S);

  // ── 콘텐츠 인덱스 ──
  const CAT = Object.fromEntries(EN_CATEGORIES.map(c => [c.id, c]));
  const SENT = {};
  EN_LESSONS.forEach(l => l.sentences.forEach((s, i) => { const id = `${l.id}#${i + 1}`; SENT[id] = { ...s, id, lesson: l }; }));
  const sentence = id => SENT[id] || (S.extra[id] ? { ...S.extra[id], id, lesson: null, expr: [] } : null);
  const lessonState = id => S.lessons[id] || { status: "new", step: 0, variation: "" };

  // ── 학습 기록 ──
  function bump(key, n = 1) {
    const d = today();
    S.log[d] = S.log[d] || { minutes: 0, sentences: 0, lessons: 0, reviews: 0, roleplays: 0 };
    S.log[d][key] = (S.log[d][key] || 0) + n;
  }
  function act(icon, text) {
    S.activity.unshift({ d: today(), t: Date.now(), icon, text });
    S.activity = S.activity.slice(0, 30);
  }

  // ── 문장 카드(간격 복습) ──
  const card = id => S.cards[id] || { status: "NEW", box: 0, due: null, reviews: 0, fav: false };
  function touchCard(id) {
    const c = card(id);
    if (c.status === "NEW") { c.status = "LEARNING"; c.due = addDays(today(), 1); bump("sentences"); }
    S.cards[id] = c;
    return c;
  }
  function rateCard(id, r, fromReview) {
    const c = touchCard(id);
    c.reviews++; c.last = today(); c.lastRating = r;
    if (r === "good") {
      c.due = addDays(today(), INTERVALS[Math.min(c.box, INTERVALS.length - 1)]);
      c.box = Math.min(c.box + 1, INTERVALS.length);
      c.status = c.box >= INTERVALS.length ? "MASTERED" : "LEARNING";
    } else if (r === "ok") {
      c.due = addDays(today(), 1);
      if (c.status !== "WEAK") c.status = "LEARNING";
    } else {
      c.box = 0; c.due = addDays(today(), 1); c.status = "WEAK";
    }
    if (fromReview) bump("reviews");
    S.cards[id] = c;
    save();
  }
  const dueIds = () => Object.keys(S.cards).filter(id => sentence(id) && S.cards[id].status !== "NEW" && S.cards[id].due && S.cards[id].due <= today());
  const idsBy = pred => Object.keys(S.cards).filter(id => sentence(id) && pred(S.cards[id]));

  // ── 통계 ──
  function stats() {
    const days = Object.keys(S.log).filter(d => { const l = S.log[d]; return l.minutes || l.sentences || l.lessons || l.reviews || l.roleplays; }).sort();
    let streak = 0, cur = today();
    if (!days.includes(cur)) cur = addDays(cur, -1);
    while (days.includes(cur)) { streak++; cur = addDays(cur, -1); }
    const learned = Object.keys(SENT).filter(id => card(id).status !== "NEW").length;
    const done = EN_LESSONS.filter(l => lessonState(l.id).status === "done").length;
    const minutes = Object.values(S.log).reduce((a, l) => a + (l.minutes || 0), 0);
    return { days: days.length, streak, learned, done, total: EN_LESSONS.length, rp: S.roleplays.length, minutes };
  }
  const todayLog = () => S.log[today()] || { minutes: 0, sentences: 0, lessons: 0, reviews: 0, roleplays: 0 };
  const monthIndex = () => Math.max(1, Math.floor(Math.max(0, daysBetween(S.settings.startDate, today())) / 30.44) + 1);
  const nextLesson = () => EN_LESSONS.find(l => lessonState(l.id).status !== "done");
  const catProgress = id => { const ls = EN_LESSONS.filter(l => l.category === id); return { done: ls.filter(l => lessonState(l.id).status === "done").length, total: ls.length }; };

  // ── 음성: 저장소 추상화 (tts → git 파일 → 향후 gdrive) ──
  const Voice = {
    voices: [],
    init() {
      if (!("speechSynthesis" in window)) return;
      const refresh = () => { this.voices = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang)); };
      refresh();
      speechSynthesis.addEventListener?.("voiceschanged", refresh);
    },
    current: null,
    stop() {
      if (this.current) { this.current.pause(); this.current = null; }
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    },
    // 생성된 mp3(audio/manifest.js 의 EN_AUDIO)는 문장이 manifest 와 똑같을 때만 쓰고, 아니면 TTS 로 대체한다.
    say(key, text, rate) {
      const m = typeof EN_AUDIO !== "undefined" && EN_AUDIO[key];
      return m && m.text === text ? this.file(m.src, text, rate) : this.speak(text, rate);
    },
    file(src, text, rate) {
      this.stop();
      const el = new Audio(src);
      el.playbackRate = rate || S.settings.rate;
      this.current = el;
      // 다른 음성으로 넘어가며 멈춘 경우(AbortError)는 실패가 아니다. 파일이 없거나 깨졌을 때만 TTS 로 대체.
      return el.play().catch(e => { if (this.current === el && e.name !== "AbortError") this.speak(text, rate); });
    },
    play(s, rate) {
      if (s.audio?.storage_type === "git" && s.audio.path) return this.file(s.audio.path, s.en, rate);
      // storage_type "gdrive" 는 서버리스 프록시(file_id → 스트림) 도입 후 연결. 그 전까지 manifest/TTS.
      const key = /@\d+$/.test(s.id) ? `rp:${s.id}:model` : s.id;   // Role Play 복습 카드 = 모범답안 음성
      return this.say(key, s.en, rate);
    },
    speak(text, rate) {
      if (!("speechSynthesis" in window)) { toast("이 브라우저는 음성 재생을 지원하지 않아요"); return Promise.resolve(); }
      this.stop();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US"; u.rate = rate || S.settings.rate;
      const v = this.voices.find(x => x.voiceURI === S.settings.voice) || this.voices.find(x => /en-US/i.test(x.lang));
      if (v) u.voice = v;
      return new Promise(res => { u.onend = u.onerror = () => res(); speechSynthesis.speak(u); });
    }
  };

  // ── 녹음 (MediaRecorder, 메모리에만 보관) ──
  const Rec = {
    mr: null, urls: {},
    supported: () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder),
    recording: () => Rec.mr?.state === "recording",
    async toggle(id, onChange) {
      if (this.recording()) { this.mr.stop(); return; }
      if (!this.supported()) { toast("이 브라우저는 녹음을 지원하지 않아요"); return; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const chunks = [];
        this.mr = new MediaRecorder(stream);
        this.mr.ondataavailable = e => chunks.push(e.data);
        this.mr.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          if (this.urls[id]) URL.revokeObjectURL(this.urls[id]);
          this.urls[id] = URL.createObjectURL(new Blob(chunks, { type: this.mr.mimeType }));
          onChange();
        };
        this.mr.start();
        onChange();
      } catch { toast("마이크 권한이 필요해요"); }
    },
    stop() { if (this.recording()) this.mr.stop(); },
    play(id) { if (this.urls[id]) new Audio(this.urls[id]).play(); }
  };

  // ── 공통 UI ──
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.hidden = true, 2200);
  }
  const statusBadge = st => `<span class="badge st-${st.toLowerCase()}">${STATUS_LABEL[st]}</span>`;
  const lessonBadge = st => st === "done" ? `<span class="badge st-mastered">완료</span>` : st === "learning" ? `<span class="badge st-learning">학습중</span>` : `<span class="badge">미학습</span>`;
  const bar = (v, max) => `<div class="bar"><i style="width:${max ? Math.round(v / max * 100) : 0}%"></i></div>`;
  const speakBtn = (id, label = "🔊") => `<button class="play" data-speak="${esc(id)}" aria-label="듣기">${label}</button>`;
  const phaseOf = m => EN_PHASES.find(p => m >= p.months[0] && m <= p.months[1]) || EN_PHASES[EN_PHASES.length - 1];

  // ── 화면: 홈 ──
  function viewHome() {
    const st = stats(), tl = todayLog(), due = dueIds().length, next = nextLesson();
    const goal = S.settings.dailyGoal, mins = Math.round(tl.minutes);
    const pct = Math.min(100, Math.round(mins / goal * 100));
    const m = monthIndex(), ph = phaseOf(m);
    const name = S.settings.name ? `${esc(S.settings.name)}님, ` : "";
    const recent = S.activity.slice(0, 6);
    return `
      <section class="hello">${pic("hero", "hello-bg")}
        <p class="eyebrow">Day ${daysBetween(S.settings.startDate, today()) + 1} · ${m}개월차 · Phase ${ph.phase} ${esc(ph.title)}</p>
        <h1>${name}오늘도 20분, 입으로 나오는 영어.</h1>
      </section>

      <section class="hero-card">
        <div class="ring" style="--p:${pct}"><div><b>${mins}</b><small>/ ${goal}분</small></div></div>
        <div class="mission">
          <p class="eyebrow">오늘의 Mission</p>
          <ol>
            <li class="${due === 0 ? "ok" : ""}">🔁 복습 ${due ? `<b>${due}문장</b>` : "완료"}</li>
            <li class="${!next || tl.lessons ? "ok" : ""}">📚 Lesson ${!next ? "전체 완료 🎉" : tl.lessons ? `오늘 ${tl.lessons}개 완료 <small>· 다음 ${esc(next.title)}</small>` : `<b>${esc(next.title)}</b>`}</li>
            <li class="${tl.roleplays ? "ok" : ""}">🎭 Role Play 1회 <small>(선택)</small></li>
          </ol>
          <div class="btn-row">
            ${next ? `<button class="primary" data-open-lesson="${next.id}">▶ Lesson 시작</button>` : ""}
            <a class="secondary" href="#review">🔁 복습 ${due}</a>
          </div>
        </div>
      </section>

      <section class="tiles">
        <div class="tile"><span>🗓 학습일</span><b>${st.days}<small>일</small></b><em>연속 ${st.streak}일</em></div>
        <div class="tile"><span>💬 학습 문장</span><b>${st.learned}<small>/${Object.keys(SENT).length}</small></b><em>오늘 +${tl.sentences}</em></div>
        <div class="tile"><span>🎭 Role Play</span><b>${st.rp}<small>회</small></b><em>오늘 ${tl.roleplays}회</em></div>
        <div class="tile"><span>📈 전체 진행률</span><b>${Math.round(st.done / st.total * 100)}<small>%</small></b><em>Lesson ${st.done}/${st.total}</em></div>
      </section>

      <div class="two-col">
        <section class="panel">
          <h2>영역별 진행률</h2>
          ${EN_CATEGORIES.map(c => { const p = catProgress(c.id); return `
            <div class="area"><span>${c.emoji} ${esc(c.label)}</span><small>${p.done}/${p.total}</small></div>${bar(p.done, p.total)}`; }).join("")}
          <p class="fine">권장 비중 · 기초·일상 30% / 업무영어 70%</p>
        </section>
        <section class="panel">
          <h2>최근 학습</h2>
          ${recent.length ? `<ul class="recent">${recent.map(a => `<li><span>${a.icon}</span><p>${esc(a.text)}</p><small>${a.d.slice(5).replace("-", "/")}</small></li>`).join("")}</ul>`
            : `<p class="empty-note">아직 기록이 없어요. 첫 Lesson을 시작해 보세요!</p>`}
        </section>
      </div>

      <section class="panel">
        <h2>12개월 Roadmap</h2>
        <div class="roadmap">
          ${EN_PHASES.map(p => {
            const ls = EN_LESSONS.filter(l => l.phase === p.phase), d = ls.filter(l => lessonState(l.id).status === "done").length;
            const state = d === ls.length ? "done" : p === ph ? "now" : m > p.months[1] ? "late" : "next";
            const label = { done: "완료", now: "진행 중", late: "보충 필요", next: "예정" }[state];
            return `<button class="phase ${state}" data-goto-phase="${p.phase}">${pic("phase-" + p.phase, "phase-img")}
              <small>${p.months[0]}~${p.months[1]}개월 · ${label}</small>
              <b>Phase ${p.phase}. ${esc(p.title)}</b>
              <span>${esc(p.goal)}</span>
              ${bar(d, ls.length)}<em>${d}/${ls.length} Lesson</em>
            </button>`; }).join("")}
        </div>
      </section>`;
  }

  // ── 화면: 학습 (Lesson 목록 / 표현 사전) ──
  let learnTab = "lessons", learnCat = "all", learnPhase = 0, exprQuery = "";
  function viewLearn() {
    const chips = [["all", "전체"], ...EN_CATEGORIES.map(c => [c.id, `${c.emoji} ${c.label}`])];
    const head = `
      <section class="view-head">
        <h1>학습</h1>
        <div class="seg"><button data-learn-tab="lessons" aria-pressed="${learnTab === "lessons"}">Lesson</button><button data-learn-tab="expr" aria-pressed="${learnTab === "expr"}">표현 사전</button></div>
      </section>
      <nav class="chips">${chips.map(([id, label]) => `<button class="chip" data-learn-cat="${id}" aria-pressed="${learnCat === id}">${esc(label)}</button>`).join("")}</nav>`;
    if (learnTab === "expr") return head + viewExpr();
    const phases = learnPhase ? EN_PHASES.filter(p => p.phase === learnPhase) : EN_PHASES;
    return head + (learnPhase ? `<p class="count">Phase ${learnPhase}만 보는 중 · <button class="link" data-goto-phase="0">전체 보기</button></p>` : "") +
      phases.map(p => {
        const ls = EN_LESSONS.filter(l => l.phase === p.phase && (learnCat === "all" || l.category === learnCat));
        if (!ls.length) return "";
        return `<h2 class="phase-title">Phase ${p.phase} · ${esc(p.title)} <small>${p.months[0]}~${p.months[1]}개월</small></h2>
          <div class="lesson-grid">${ls.map(lessonCard).join("")}</div>`;
      }).join("");
  }
  function lessonCard(l) {
    const st = lessonState(l.id).status;
    const ids = l.sentences.map((_, i) => `${l.id}#${i + 1}`);
    const mastered = ids.filter(id => card(id).status === "MASTERED").length;
    return `<button class="lesson-card ${st}" data-open-lesson="${l.id}">
      <span class="lc-emoji">${l.emoji}${pic(l.id)}</span>
      <span class="lc-body">
        <small>${CAT[l.category].emoji} ${esc(CAT[l.category].label)} · ${esc(l.level)}</small>
        <b>${esc(l.title)}</b>
        <span class="lc-sit">${esc(l.situation)}</span>
        <span class="lc-meta">${lessonBadge(st)} <small>문장 ${ids.length} · 숙달 ${mastered}</small></span>
      </span>
    </button>`;
  }
  function viewExpr() {
    const q = exprQuery.trim().toLowerCase();
    const rows = [];
    EN_LESSONS.forEach(l => {
      if (learnCat !== "all" && l.category !== learnCat) return;
      l.sentences.forEach((s, i) => (s.expr || []).forEach(([en, ko]) => {
        if (!q || (en + " " + ko + " " + l.title).toLowerCase().includes(q)) rows.push({ en, ko, l, sid: `${l.id}#${i + 1}` });
      }));
    });
    return `<input id="exprSearch" class="search" type="search" placeholder="표현·뜻·레슨명 검색 (예: funding, 동의)" value="${esc(exprQuery)}" autocomplete="off">
      <p class="count">표현 ${rows.length}개</p>
      <div class="expr-list">${rows.map(r => `
        <div class="expr-row">
          ${speakBtn("x:" + r.en)}
          <div><b>${esc(r.en)}</b><span>${esc(r.ko)}</span></div>
          <button class="link" data-open-lesson="${r.l.id}">${r.l.emoji} ${esc(r.l.title)}</button>
        </div>`).join("") || `<p class="empty-note">찾는 표현이 없어요.</p>`}</div>`;
  }

  // ── Lesson 화면 (상황 → 핵심 문장 → Shadowing → 업무 변형 → 완료) ──
  const STEPS = ["상황", "핵심 문장", "Shadowing", "업무 변형", "완료"];
  const SHADOW_MODES = [["script", "스크립트 보기"], ["hidden", "스크립트 숨기기"], ["korean", "한국어만"], ["situation", "상황만"]];
  let L = null; // { lesson, step, idx, mode, reveal, rate, showKo }

  function openLesson(id) {
    const lesson = EN_LESSONS.find(l => l.id === id);
    if (!lesson) return;
    const ls = lessonState(id);
    if (ls.status === "new") { S.lessons[id] = { ...ls, status: "learning" }; act("📖", `Lesson 시작 · ${lesson.title}`); save(); }
    L = { lesson, step: ls.status === "done" ? 1 : Math.min(ls.step || 0, 3), idx: 0, mode: "script", reveal: false, rate: S.settings.rate, showKo: true };
    renderLesson();
    const dlg = $("#lessonDlg");
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }
  function setStep(n) {
    L.step = Math.max(0, Math.min(STEPS.length - 1, n));
    L.idx = 0; L.reveal = false;
    Rec.stop();
    if (L.step >= 1) L.lesson.sentences.forEach((_, i) => touchCard(`${L.lesson.id}#${i + 1}`));
    const ls = lessonState(L.lesson.id);
    if (ls.status !== "done") S.lessons[L.lesson.id] = { ...ls, step: Math.max(ls.step || 0, L.step) };
    save();
    renderLesson();
    $("#lessonDlg").scrollTop = 0;
  }
  function renderLesson() {
    const { lesson: l, step } = L;
    const ids = l.sentences.map((_, i) => `${l.id}#${i + 1}`);
    let body = "";
    if (step === 0) {
      body = `<figure class="sit-pic">${pic(l.id)}</figure><div class="situation"><p class="eyebrow">Situation</p><p class="sit-text">${esc(l.situation)}</p></div>
        <ul class="plan">${STEPS.slice(1).map((s, i) => `<li><b>${i + 1}</b>${s}</li>`).join("")}</ul>
        <p class="fine">핵심 문장 ${ids.length}개 · 예상 ${ids.length * 5 + 5}분</p>`;
    } else if (step === 1) {
      body = `<label class="toggle"><input type="checkbox" id="koToggle" ${L.showKo ? "checked" : ""}> 한국어 번역 보기</label>` +
        l.sentences.map((s, i) => { const id = ids[i], c = card(id); return `
        <div class="sent-card">
          <div class="sent-top"><small>문장 ${i + 1}</small>${statusBadge(c.status)}
            <button class="fav-btn" data-fav="${id}" aria-label="즐겨찾기">${c.fav ? "⭐" : "☆"}</button></div>
          <p class="en-text">${esc(s.en)}</p>
          <p class="ko-text" ${L.showKo ? "" : "hidden"}>${esc(s.ko)}</p>
          <div class="expr-chips">${(s.expr || []).map(([e, k]) => `<span><b>${esc(e)}</b> ${esc(k)}</span>`).join("")}</div>
          ${s.note ? `<p class="note">💡 ${esc(s.note)}</p>` : ""}
          <div class="audio-row">${speakBtn(id, "🔊 듣기")}</div>
        </div>`; }).join("");
    } else if (step === 2) {
      const i = L.idx, s = l.sentences[i], id = ids[i];
      const showEn = L.mode === "script" || L.reveal;
      const prompt = L.mode === "korean" ? `<p class="ko-text big">${esc(s.ko)}</p>`
        : L.mode === "situation" ? `<p class="sit-text">${esc(l.situation)}</p><p class="fine">힌트: ${esc(s.expr?.[0]?.[1] || "")}</p>` : "";
      body = `<nav class="chips small">${SHADOW_MODES.map(([k, v]) => `<button class="chip" data-mode="${k}" aria-pressed="${L.mode === k}">${v}</button>`).join("")}</nav>
        <div class="shadow-card">
          <p class="eyebrow">${i + 1} / ${ids.length}</p>
          ${prompt}
          ${showEn ? `<p class="en-text big">${esc(s.en)}</p>` : `<button class="reveal" data-reveal>👀 정답 보기</button>`}
          <div class="big-btns">
            <button class="bigbtn" data-speak="${id}"><b>🔊</b><span>듣기</span></button>
            <button class="bigbtn rec ${Rec.recording() ? "on" : ""}" data-rec="${id}"><b>${Rec.recording() ? "⏹" : "🎙"}</b><span>${Rec.recording() ? "정지" : "녹음"}</span></button>
            <button class="bigbtn" data-myrec="${id}" ${Rec.urls[id] ? "" : "disabled"}><b>▶</b><span>내 녹음</span></button>
          </div>
          <p class="fine">원문을 듣고 → 녹음하고 → 내 녹음과 비교해 보세요.</p>
          <p class="rate-q">방금 문장, 입으로 잘 나왔나요?</p>
          <div class="rate-row">
            <button data-rate="good">😀 잘 됨</button><button data-rate="ok">🤔 헷갈림</button><button data-rate="hard">😣 어려움</button>
          </div>
        </div>`;
    } else if (step === 3) {
      const v = lessonState(l.id).variation || "";
      body = `<div class="situation"><p class="eyebrow">내 업무에 맞게 바꿔 말하기</p>
          <p class="en-text">${esc(l.variation.template)}</p><p class="fine">${esc(l.variation.hint)}</p></div>
        <textarea id="variation" rows="4" placeholder="${esc(l.variation.template)}">${esc(v)}</textarea>
        <div class="audio-row">${speakBtn("var", "🔊 내 문장 듣기")}<span class="fine">입력 내용은 자동 저장됩니다.</span></div>
        <details class="ref"><summary>참고 문장 보기</summary>${l.sentences.map(s => `<p>• ${esc(s.en)}</p>`).join("")}</details>`;
    } else {
      const done = lessonState(l.id).status === "done";
      body = `<div class="finish">
          <div class="finish-emoji">${done ? "🏅" : "🎯"}</div>
          <h3>${done ? "완료한 Lesson이에요" : "마지막 단계예요!"}</h3>
          <ul class="finish-list">${ids.map((id, i) => `<li>${statusBadge(card(id).status)} ${esc(l.sentences[i].en)}</li>`).join("")}</ul>
          <p class="fine">문장은 복습 목록에 자동 등록됩니다. (1일 → 3일 → 7일 → 14일 → 30일)</p>
          ${done ? "" : `<button class="primary wide" data-complete>✅ Lesson 완료</button>`}
          ${nextAfter(l) ? `<button class="secondary wide" data-open-lesson="${nextAfter(l).id}">다음 Lesson · ${esc(nextAfter(l).title)} →</button>` : ""}
        </div>`;
    }
    $("#lessonBody").innerHTML = `
      <header class="sheet-head">
        <button class="ghost icon close" data-close aria-label="닫기">✕</button>
        <p class="eyebrow">${CAT[l.category].emoji} ${esc(CAT[l.category].label)} · Phase ${l.phase} · ${esc(l.level)}</p>
        <h2>${l.emoji} ${esc(l.title)}</h2>
        <nav class="stepper">${STEPS.map((s, i) => `<button data-step="${i}" class="${i === step ? "on" : i < step ? "past" : ""}"><i>${i + 1}</i><span>${s}</span></button>`).join("")}</nav>
        <div class="speed">속도 ${[0.7, 0.85, 1, 1.2].map(r => `<button data-speed="${r}" aria-pressed="${L.rate === r}">${r}x</button>`).join("")}</div>
      </header>
      <div class="sheet-body">${body}</div>
      <footer class="sheet-foot">
        <button class="secondary" data-step="${step - 1}" ${step === 0 ? "disabled" : ""}>← 이전</button>
        ${step < STEPS.length - 1 ? `<button class="primary" data-step="${step + 1}">${step === 0 ? "시작하기" : "다음"} →</button>` : ""}
      </footer>`;
  }
  const nextAfter = l => EN_LESSONS.slice(EN_LESSONS.indexOf(l) + 1).find(x => lessonState(x.id).status !== "done");
  function completeLesson() {
    const l = L.lesson;
    S.lessons[l.id] = { ...lessonState(l.id), status: "done", completedAt: today(), step: STEPS.length - 1 };
    bump("lessons"); act("✅", `Lesson 완료 · ${l.title}`); save();
    toast("Lesson 완료! 🎉");
    renderLesson(); route();
  }

  // ── 화면: 복습 ──
  let reviewTab = "due", R = null; // R = { queue, i, reveal, done }
  function viewReview() {
    const due = dueIds(), weak = idsBy(c => c.status === "WEAK"), fav = idsBy(c => c.fav), all = idsBy(c => c.status !== "NEW");
    const tabs = [["due", `오늘 복습 ${due.length}`], ["weak", `취약 ${weak.length}`], ["fav", `⭐ 즐겨찾기 ${fav.length}`], ["all", `전체 ${all.length}`]];
    const head = `<section class="view-head"><h1>복습</h1><p class="fine">1일 → 3일 → 7일 → 14일 → 30일 간격으로 다시 만나요.</p></section>
      <nav class="chips">${tabs.map(([k, v]) => `<button class="chip" data-review-tab="${k}" aria-pressed="${reviewTab === k}">${v}</button>`).join("")}</nav>`;
    if (reviewTab === "due") {
      if (!R || R.src !== "due") R = { src: "due", queue: due, i: 0, reveal: false, done: 0 };
      return head + flashcard();
    }
    if (R && R.src === reviewTab && R.queue.length) return head + flashcard();
    const list = { weak, fav, all }[reviewTab];
    return head + (list.length ? `<button class="primary" data-start-list>▶ 이 목록 복습하기 (${list.length})</button>
      <div class="expr-list">${list.map(id => { const s = sentence(id), c = card(id); return `
        <div class="expr-row">${speakBtn(id)}<div><b>${esc(s.en)}</b><span>${esc(s.ko)}</span></div>
        <span class="row-meta">${statusBadge(c.status)}<small>${c.due ? "다음 " + c.due.slice(5).replace("-", "/") : ""}</small></span></div>`; }).join("")}</div>`
      : `<p class="empty-note">${reviewTab === "fav" ? "Lesson에서 ☆를 눌러 즐겨찾기를 추가해 보세요." : reviewTab === "weak" ? "취약 문장이 없어요. 👍" : "아직 학습한 문장이 없어요."}</p>`);
  }
  function flashcard() {
    if (!R.queue.length || R.i >= R.queue.length) {
      const upcoming = Object.values(S.cards).filter(c => c.due && c.due > today()).map(c => c.due).sort()[0];
      return `<div class="done-card"><div class="finish-emoji">🎉</div><h3>${R.done ? `${R.done}문장 복습 완료!` : "지금 복습할 문장이 없어요"}</h3>
        <p class="fine">${upcoming ? `다음 복습 예정일 · ${upcoming}` : "Lesson을 학습하면 문장이 복습 목록에 쌓여요."}</p>
        ${R.src !== "due" ? `<button class="secondary" data-end-list>목록으로</button>` : `<a class="secondary" href="#learn">📚 Lesson 보러 가기</a>`}</div>`;
    }
    const id = R.queue[R.i], s = sentence(id), c = card(id);
    return `<div class="shadow-card flash">
      <p class="eyebrow">${R.i + 1} / ${R.queue.length} · ${statusBadge(c.status)}</p>
      <p class="fine">${s.lesson ? `${s.lesson.emoji} ${esc(s.lesson.title)}` : `🎭 ${esc(s.situation || "Role Play")}`}</p>
      <p class="ko-text big">${esc(s.ko)}</p>
      ${R.reveal ? `<p class="en-text big">${esc(s.en)}</p>` : `<p class="fine">영어로 먼저 소리 내어 말해 본 뒤 정답을 확인하세요.</p><button class="reveal" data-flip>👀 정답 보기</button>`}
      <div class="big-btns">
        <button class="bigbtn" data-speak="${id}"><b>🔊</b><span>듣기</span></button>
        <button class="bigbtn rec ${Rec.recording() ? "on" : ""}" data-rec="${id}"><b>${Rec.recording() ? "⏹" : "🎙"}</b><span>${Rec.recording() ? "정지" : "녹음"}</span></button>
        <button class="bigbtn" data-myrec="${id}" ${Rec.urls[id] ? "" : "disabled"}><b>▶</b><span>내 녹음</span></button>
      </div>
      ${R.reveal ? `<div class="rate-row"><button data-rrate="good">😀 잘 됨</button><button data-rrate="ok">🤔 헷갈림</button><button data-rrate="hard">😣 어려움</button></div>` : ""}
    </div>`;
  }

  // ── 화면: Role Play ──
  function viewRoleplay() {
    return `<section class="view-head"><h1>Role Play</h1>
        <p class="fine">상대방 대사를 듣고 영어로 답해 보세요. 답변은 모범답안의 핵심 표현과 비교해 피드백합니다. <span class="badge">AI 연동 전 · 모범답안 비교 모드</span></p></section>
      <div class="lesson-grid">${EN_ROLEPLAYS.map(rp => {
        const hist = S.roleplays.filter(h => h.id === rp.id), best = hist.length ? Math.max(...hist.map(h => h.score)) : null;
        return `<button class="lesson-card" data-open-rp="${rp.id}">
          <span class="lc-emoji">${rp.emoji}${pic(rp.id)}</span>
          <span class="lc-body"><small>Phase ${rp.phase} · ${rp.turns.length}턴</small><b>${esc(rp.title)}</b>
            <span class="lc-sit">상대: ${esc(rp.partner)}</span>
            <span class="lc-meta">${best == null ? `<span class="badge">도전 전</span>` : `<span class="badge st-learning">최고 ${best}점</span>`} <small>${hist.length}회</small></span></span>
        </button>`; }).join("")}</div>`;
  }
  let P = null; // { rp, turn, answers: [{text, score, hits}], hint, submitted }
  const norm = t => " " + String(t).toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim() + " ";
  function scoreAnswer(text, keywords) {
    // 단어 시작 기준 부분일치: "deposit" 은 "deposits" 도 인정한다.
    const t = norm(text);
    const hits = keywords.map(k => k.split("|").some(alt => { const a = norm(alt).trim(); return a && t.includes(" " + a); }));
    return { hits, score: Math.round(hits.filter(Boolean).length / keywords.length * 100) };
  }
  function openRoleplay(id) {
    const rp = EN_ROLEPLAYS.find(r => r.id === id);
    if (!rp) return;
    P = { rp, turn: 0, answers: [], hint: false, submitted: false };
    renderRp();
    if (!$("#rpDlg").open) $("#rpDlg").showModal();
    Voice.say(`rp:${rp.id}@1:say`, rp.turns[0].say, S.settings.rate);
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function renderRp() {
    const { rp, turn } = P, finished = turn >= rp.turns.length;
    const bubbles = rp.turns.slice(0, Math.min(turn + 1, rp.turns.length)).map((t, i) => {
      const a = P.answers[i];
      return `<div class="bubble them"><b>${rp.emoji}</b><div><p>${esc(t.say)} ${speakBtn("rp:" + i)}</p><small>${esc(t.ko)}</small></div></div>
        ${a ? `<div class="bubble me"><div><p>${esc(a.text)}</p></div></div>
          <div class="feedback"><p class="fb-score">핵심 표현 ${a.score}점</p>
            <div class="kw">${t.keywords.map((k, j) => `<span class="${a.hits[j] ? "hit" : "miss"}">${a.hits[j] ? "✓" : "✗"} ${esc(k.split("|").join(" / "))}</span>`).join("")}</div>
            <p class="model">모범답안 ${speakBtn("rpm:" + i)}<br><b>${esc(t.model)}</b></p></div>` : ""}`;
    }).join("");
    let foot;
    if (finished) {
      const avg = Math.round(P.answers.reduce((x, a) => x + a.score, 0) / P.answers.length);
      const weak = P.answers.map((a, i) => ({ a, i })).filter(x => x.a.score < 60);
      foot = `<div class="finish"><div class="finish-emoji">${avg >= 80 ? "🏆" : avg >= 50 ? "👏" : "💪"}</div>
        <h3>종합 ${avg}점</h3>
        <p class="fine">${avg >= 80 ? "핵심 표현을 잘 썼어요. 다음엔 모범답안을 보지 않고 음성으로 도전해 보세요." : "모범답안을 소리 내어 3번 읽고 다시 도전해 보세요."}</p>
        ${weak.length ? `<p class="fine">60점 미만 ${weak.length}턴의 모범답안을 복습 목록에 등록했어요.</p>` : ""}
        <div class="btn-row center"><button class="primary" data-rp-retry>🔄 다시 하기</button><button class="secondary" data-close>닫기</button></div></div>`;
    } else {
      const t = rp.turns[turn];
      foot = P.submitted
        ? `<button class="primary wide" data-rp-next>${turn + 1 < rp.turns.length ? "다음 대사 →" : "결과 보기"}</button>`
        : `<button class="link" data-rp-hint>${P.hint ? "💡 " + esc(t.hint) : "💡 한국어 힌트 보기"}</button>
          <textarea id="rpInput" rows="3" placeholder="영어로 답해 보세요"></textarea>
          <div class="btn-row">${SR ? `<button class="secondary" data-rp-mic>🎤 말하기</button>` : ""}<button class="primary" data-rp-submit>제출</button></div>`;
    }
    $("#rpBody").innerHTML = `
      <header class="sheet-head">${pic(rp.id, "head-bg")}<button class="ghost icon close" data-close aria-label="닫기">✕</button>
        <p class="eyebrow">Role Play · ${Math.min(turn + 1, rp.turns.length)}/${rp.turns.length}턴 · ${esc(rp.partner)}</p><h2>${rp.emoji} ${esc(rp.title)}</h2></header>
      <div class="sheet-body chat">${bubbles}</div>
      <footer class="sheet-foot column">${foot}</footer>`;
    const chat = $("#rpBody .chat"); chat.scrollTop = chat.scrollHeight;
  }
  function submitRp() {
    const text = $("#rpInput").value.trim();
    if (!text) { toast("답변을 입력하거나 말해 주세요"); return; }
    const t = P.rp.turns[P.turn];
    P.answers[P.turn] = { text, ...scoreAnswer(text, t.keywords) };
    P.submitted = true;
    renderRp();
  }
  function nextRp() {
    P.turn++; P.submitted = false; P.hint = false;
    if (P.turn >= P.rp.turns.length) finishRp();
    renderRp();
    if (P.turn < P.rp.turns.length) Voice.say(`rp:${P.rp.id}@${P.turn + 1}:say`, P.rp.turns[P.turn].say, S.settings.rate);
  }
  function finishRp() {
    const avg = Math.round(P.answers.reduce((x, a) => x + a.score, 0) / P.answers.length);
    P.answers.forEach((a, i) => {
      if (a.score >= 60) return;
      const t = P.rp.turns[i], id = `${P.rp.id}@${i + 1}`;
      S.extra[id] = { en: t.model, ko: t.hint, situation: P.rp.title };
      const c = touchCard(id); c.status = "WEAK"; c.due = today(); S.cards[id] = c;
    });
    S.roleplays.push({ id: P.rp.id, date: today(), score: avg, turns: P.answers.length });
    bump("roleplays"); act("🎭", `Role Play · ${P.rp.title} ${avg}점`); save();
  }

  // ── 화면: 통계 ──
  function viewStats() {
    const st = stats();
    const days = Array.from({ length: 14 }, (_, i) => addDays(today(), i - 13));
    const vals = days.map(d => Math.round(S.log[d]?.minutes || 0));
    const max = Math.max(S.settings.dailyGoal, ...vals);
    const counts = { NEW: Object.keys(SENT).length, LEARNING: 0, WEAK: 0, MASTERED: 0 };
    Object.keys(SENT).forEach(id => { const s = card(id).status; if (s !== "NEW") { counts[s]++; counts.NEW--; } });
    const total = Object.keys(SENT).length;
    const hist = S.roleplays.slice(-8).reverse();
    return `<section class="view-head"><h1>학습 통계</h1></section>
      <section class="tiles">
        <div class="tile"><span>🗓 총 학습일</span><b>${st.days}<small>일</small></b><em>연속 ${st.streak}일</em></div>
        <div class="tile"><span>⏱ 누적 학습</span><b>${Math.round(st.minutes)}<small>분</small></b><em>하루 목표 ${S.settings.dailyGoal}분</em></div>
        <div class="tile"><span>💬 학습 문장</span><b>${st.learned}<small>/${total}</small></b><em>숙달 ${counts.MASTERED}</em></div>
        <div class="tile"><span>🎭 Role Play</span><b>${st.rp}<small>회</small></b><em>${S.roleplays.length ? "평균 " + Math.round(S.roleplays.reduce((a, r) => a + r.score, 0) / S.roleplays.length) + "점" : "기록 없음"}</em></div>
      </section>
      <section class="panel">
        <h2>최근 14일 학습 시간 <small>(분)</small></h2>
        <div class="chart14" style="--goal-n:${(S.settings.dailyGoal / max).toFixed(3)}">
          ${days.map((d, i) => `<div class="col" title="${d} · ${vals[i]}분"><i style="height:${Math.round(vals[i] / max * 100)}%" class="${vals[i] >= S.settings.dailyGoal ? "met" : ""}"></i><small>${d.slice(8)}</small></div>`).join("")}
        </div>
        <p class="fine">점선 = 하루 목표 ${S.settings.dailyGoal}분 · 학습 시간은 Lesson·복습·Role Play 화면을 연 동안 15초 단위로 기록됩니다.</p>
      </section>
      <div class="two-col">
        <section class="panel">
          <h2>문장 상태</h2>
          <div class="stack">${["MASTERED", "LEARNING", "WEAK", "NEW"].map(k => `<i class="st-${k.toLowerCase()}" style="width:${counts[k] / total * 100}%"></i>`).join("")}</div>
          <ul class="legend">${["NEW", "LEARNING", "WEAK", "MASTERED"].map(k => `<li>${statusBadge(k)} <b>${counts[k]}</b></li>`).join("")}</ul>
          <p class="fine">NEW 처음 · LEARNING 학습 중 · WEAK 반복 오류 · MASTERED 30일 주기까지 통과</p>
        </section>
        <section class="panel">
          <h2>영역별 진행률</h2>
          ${EN_CATEGORIES.map(c => { const p = catProgress(c.id); return `<div class="area"><span>${c.emoji} ${esc(c.label)}</span><small>${p.done}/${p.total}</small></div>${bar(p.done, p.total)}`; }).join("")}
        </section>
      </div>
      <section class="panel">
        <h2>Role Play 기록</h2>
        ${hist.length ? `<ul class="recent">${hist.map(h => { const rp = EN_ROLEPLAYS.find(r => r.id === h.id); return `<li><span>${rp?.emoji || "🎭"}</span><p>${esc(rp?.title || h.id)}</p><small>${h.score}점 · ${h.date.slice(5).replace("-", "/")}</small></li>`; }).join("")}</ul>`
          : `<p class="empty-note">아직 Role Play 기록이 없어요.</p>`}
      </section>`;
  }

  // ── 설정 ──
  function openSettings() {
    const s = S.settings;
    $("#settingsBody").innerHTML = `
      <header class="sheet-head"><button class="ghost icon close" data-close aria-label="닫기">✕</button><h2>⚙️ 설정</h2></header>
      <div class="sheet-body form">
        <label>이름(호칭)<input id="setName" value="${esc(s.name)}" placeholder="예: 지훈"></label>
        <label>학습 시작일<input id="setStart" type="date" value="${esc(s.startDate)}"></label>
        <label>하루 학습 목표<select id="setGoal">${[10, 20, 30, 40].map(v => `<option value="${v}" ${v === s.dailyGoal ? "selected" : ""}>${v}분</option>`).join("")}</select></label>
        <label>기본 음성 속도 <b id="rateVal">${s.rate}x</b><input id="setRate" type="range" min="0.6" max="1.2" step="0.05" value="${s.rate}"></label>
        <label>음성<select id="setVoice"><option value="">자동 (en-US)</option>${Voice.voices.map(v => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === s.voice ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})</option>`).join("")}</select></label>
        <button class="secondary" data-test-voice>🔊 음성 테스트</button>
        <hr>
        <p class="fine">학습 기록은 이 브라우저에만 저장됩니다. 다른 기기로 옮기거나 보관하려면 백업하세요.</p>
        <div class="btn-row"><button class="secondary" data-export>⬇ 백업 내보내기</button><label class="secondary file-btn">⬆ 백업 가져오기<input id="importFile" type="file" accept="application/json" hidden></label></div>
      </div>
      <footer class="sheet-foot"><button class="primary wide" data-save-settings>저장</button></footer>`;
    $("#settingsDlg").showModal();
  }
  function saveSettings() {
    const s = S.settings;
    s.name = $("#setName").value.trim();
    s.startDate = $("#setStart").value || s.startDate;
    s.dailyGoal = Number($("#setGoal").value);
    s.rate = Number($("#setRate").value);
    s.voice = $("#setVoice").value;
    save(); $("#settingsDlg").close(); toast("설정을 저장했어요"); route();
  }
  function exportData() {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `english-coach-backup-${today()}.json`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== "object" || !data.settings || !data.cards) throw new Error();
        store.set(STATE_KEY, data); S = load();
        $("#settingsDlg").close(); toast("백업을 불러왔어요"); route();
      } catch { toast("백업 파일 형식이 올바르지 않아요"); }
    };
    reader.readAsText(file);
  }

  // ── 라우팅 ──
  const VIEWS = { home: viewHome, learn: viewLearn, review: viewReview, roleplay: viewRoleplay, stats: viewStats };
  let currentView = "home";
  function route() {
    const v = location.hash.slice(1);
    currentView = VIEWS[v] ? v : "home";
    $("#view").innerHTML = VIEWS[currentView]();
    $$(".tabbar a").forEach(a => a.toggleAttribute("aria-current", a.dataset.view === currentView));
    const due = dueIds().length, badge = $("#dueBadge");
    badge.hidden = !due; badge.textContent = due;
  }

  // ── 음성 재생 대상 해석 ──
  function speakTarget(key) {
    if (key.startsWith("x:")) return Voice.speak(key.slice(2), L?.rate || S.settings.rate);
    if (key === "var") { const t = $("#variation")?.value.trim(); return t ? Voice.speak(t, L.rate) : toast("먼저 문장을 입력해 보세요"); }
    if (key.startsWith("rp:")) { const i = Number(key.slice(3)); return Voice.say(`rp:${P.rp.id}@${i + 1}:say`, P.rp.turns[i].say, S.settings.rate); }
    if (key.startsWith("rpm:")) { const i = Number(key.slice(4)); return Voice.say(`rp:${P.rp.id}@${i + 1}:model`, P.rp.turns[i].model, S.settings.rate); }
    const s = sentence(key);
    if (s) Voice.play(s, $("#lessonDlg").open ? L.rate : S.settings.rate);
  }

  // ── 이벤트 (위임) ──
  document.addEventListener("click", e => {
    const t = e.target.closest("button, a");
    if (!t) return;
    const d = t.dataset;
    if (d.speak) return speakTarget(d.speak);
    if (d.openLesson) { $("#rpDlg").open && $("#rpDlg").close(); return openLesson(d.openLesson); }
    if (d.openRp) return openRoleplay(d.openRp);
    if ("close" in d) return t.closest("dialog").close();
    if (d.gotoPhase !== undefined) { learnPhase = Number(d.gotoPhase); learnTab = "lessons"; learnCat = "all"; location.hash === "#learn" ? route() : (location.hash = "#learn"); return; }
    if (d.learnTab) { learnTab = d.learnTab; return route(); }
    if (d.learnCat) { learnCat = d.learnCat; return route(); }
    if (d.reviewTab) { reviewTab = d.reviewTab; R = null; return route(); }
    if ("startList" in d) {
      const list = { weak: idsBy(c => c.status === "WEAK"), fav: idsBy(c => c.fav), all: idsBy(c => c.status !== "NEW") }[reviewTab];
      R = { src: reviewTab, queue: list, i: 0, reveal: false, done: 0 }; return route();
    }
    if ("endList" in d) { R = null; return route(); }
    if ("flip" in d) { R.reveal = true; return route(); }
    if (d.rrate) {
      rateCard(R.queue[R.i], d.rrate, true);
      R.i++; R.done++; R.reveal = false; Rec.stop();
      if (R.i >= R.queue.length) { act("🔁", `복습 ${R.done}문장`); save(); }
      return route();
    }
    if (d.rec) return Rec.toggle(d.rec, () => $("#lessonDlg").open ? renderLesson() : route());
    if (d.myrec) return Rec.play(d.myrec);
    if (d.fav) { const c = touchCard(d.fav); c.fav = !c.fav; S.cards[d.fav] = c; save(); return renderLesson(); }
    // Lesson
    if (d.step !== undefined && L) return setStep(Number(d.step));
    if (d.speed) { L.rate = Number(d.speed); return renderLesson(); }
    if (d.mode) { L.mode = d.mode; L.reveal = false; return renderLesson(); }
    if ("reveal" in d) { L.reveal = true; return renderLesson(); }
    if (d.rate) {
      rateCard(`${L.lesson.id}#${L.idx + 1}`, d.rate, false);
      Rec.stop(); L.reveal = false;
      if (L.idx + 1 < L.lesson.sentences.length) { L.idx++; renderLesson(); } else setStep(3);
      return;
    }
    if ("complete" in d) return completeLesson();
    // Role Play
    if ("rpHint" in d) { P.hint = true; const v = $("#rpInput").value; renderRp(); $("#rpInput").value = v; return; }
    if ("rpSubmit" in d) return submitRp();
    if ("rpNext" in d) return nextRp();
    if ("rpRetry" in d) return openRoleplay(P.rp.id);
    if ("rpMic" in d) {
      const rec = new SR(); rec.lang = "en-US"; rec.interimResults = false;
      t.textContent = "🎤 듣는 중…";
      rec.onresult = ev => { $("#rpInput").value = ev.results[0][0].transcript; };
      rec.onerror = () => toast("음성 인식에 실패했어요. 입력으로 답해 주세요");
      rec.onend = () => { t.textContent = "🎤 말하기"; };
      rec.start(); return;
    }
    // 설정
    if ("saveSettings" in d) return saveSettings();
    if ("export" in d) return exportData();
    if ("testVoice" in d) { S.settings.voice = $("#setVoice").value; return Voice.speak("Hello, nice to meet you. Shall we get started?", Number($("#setRate").value)); }
  });
  document.addEventListener("input", e => {
    if (e.target.id === "variation" && L) { S.lessons[L.lesson.id] = { ...lessonState(L.lesson.id), variation: e.target.value }; save(); }
    if (e.target.id === "exprSearch") { exprQuery = e.target.value; const pos = e.target.selectionStart; route(); const el = $("#exprSearch"); el.focus(); el.setSelectionRange(pos, pos); }
    if (e.target.id === "setRate") $("#rateVal").textContent = e.target.value + "x";
    if (e.target.id === "koToggle") { L.showKo = e.target.checked; renderLesson(); }
  });
  document.addEventListener("change", e => { if (e.target.id === "importFile" && e.target.files[0]) importData(e.target.files[0]); });
  $$("dialog").forEach(dlg => {
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", () => { Rec.stop(); Voice.stop(); if (dlg.id !== "settingsDlg") route(); });
  });
  window.addEventListener("hashchange", () => { if (location.hash !== "#review") R = null; route(); window.scrollTo(0, 0); });
  $("#settingsBtn").onclick = openSettings;

  // 학습 시간: 학습 화면이 열려 있고 탭이 보이는 동안 15초마다 적립
  setInterval(() => {
    const studying = $("#lessonDlg").open || $("#rpDlg").open || (currentView === "review" && R && R.i < R.queue.length);
    if (studying && !document.hidden) { bump("minutes", 0.25); save(); }
  }, 15000);

  // 테마 (요리 섹션과 같은 키)
  function applyTheme(theme) {
    if (theme) document.documentElement.dataset.theme = theme;
    const dark = theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    $("#themeBtn").textContent = dark ? "☀️" : "🌙";
  }
  $("#themeBtn").onclick = () => {
    const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    store.set(THEME_KEY, next); applyTheme(next);
  };

  applyTheme(store.get(THEME_KEY, null));
  Voice.init();
  route();
})();
