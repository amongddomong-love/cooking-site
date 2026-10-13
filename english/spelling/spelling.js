// Spelling Bee — 초등 저학년 주간 스펠링테스트 준비 (2026-10-14)
// 사진(OCR, 브라우저 안에서만) 또는 직접 입력으로 단어장을 만들고, 카드·퍼즐·빠진 글자·듣고 쓰기·실전 테스트로 연습한다.
(() => {
  "use strict";
  const STATE_KEY = "spelling.state";
  const THEME_KEY = "cooking.theme";            // 요리·영어 섹션과 테마를 공유한다
  const TESSERACT_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const norm = s => String(s).toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, " ").trim();

  const AVATARS = ["🐰", "🐻", "🦊", "🐼", "🐯", "🐶", "🐱", "🦄", "🐸", "🐧"];
  const STICKERS = ["🦁", "🐯", "🐼", "🐨", "🐸", "🐵", "🦊", "🐰", "🐻", "🐷", "🐮", "🐔", "🐧", "🦄", "🐙", "🦖", "🐳", "🦋", "🐞", "🐢", "🦒", "🐘", "🦉", "🐬"];
  const CHEERS = ["멋져요! 🎉", "Great job! ⭐", "최고예요! 👍", "Awesome! 🌟", "와, 천재다! 🧠", "Perfect! 💯", "잘했어요! 🐝"];
  const TRY = ["괜찮아요, 다시 해 봐요! 💪", "거의 다 왔어요! 🙂", "천천히 한 번 더! 🐢", "Oops! 한 번 더 해 볼까요?"];

  // ── 저장 ──
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* 저장 불가(시크릿 창 등) — 화면은 그대로 동작 */ } },
    raw(k) { try { return localStorage.getItem(k); } catch { return null; } },
    rawSet(k, v) { try { localStorage.setItem(k, v); } catch { } },
  };
  const defaults = () => ({
    settings: { rate: 0.8, sayTwice: true },
    kids: [],          // [{id, name, avatar}]
    kid: null,         // 현재 아이 id
    lists: [],         // [{id, kid, title, date, testDate, words:[{w, ko}]}]
    prog: {},          // {kidId: {listId: {word: {ok, bad, lvl}}}}
    stars: {},         // {kidId: n}
    stickers: {},      // {kidId: [emoji]}
    days: {},          // {kidId: {date: 1}}
    tests: [],         // [{kid, list, date, score, total, wrong:[...]}]
  });
  function load() {
    const d = defaults(), s = store.get(STATE_KEY);
    if (!s || typeof s !== "object") return d;
    return { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) } };
  }
  let S = load();
  const save = () => store.set(STATE_KEY, S);

  const kid = () => S.kids.find(k => k.id === S.kid) || null;
  const kidLists = () => S.lists.filter(l => l.kid === S.kid).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const listById = id => S.lists.find(l => l.id === id);
  const wp = (listId, w) => (((S.prog[S.kid] ||= {})[listId] ||= {})[norm(w)] ||= { ok: 0, bad: 0, lvl: 0 });
  const listMastery = l => l.words.length ? Math.round(l.words.reduce((a, x) => a + Math.min(3, wp(l.id, x.w).lvl), 0) / (l.words.length * 3) * 100) : 0;
  function addStars(n) { S.stars[S.kid] = (S.stars[S.kid] || 0) + n; (S.days[S.kid] ||= {})[today()] = 1; save(); updateStarBadge(); }
  function streak() {
    const days = S.days[S.kid] || {}; let n = 0; const d = new Date();
    if (!days[today()]) d.setDate(d.getDate() - 1);   // 오늘 아직 안 했으면 어제부터 센다
    for (;;) { const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; if (!days[k]) break; n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function giveStickers(n) {
    const got = [];
    for (let i = 0; i < n; i++) got.push(pick(STICKERS));
    (S.stickers[S.kid] ||= []).push(...got); save();
    return got;
  }
  function dday(date) {
    if (!date) return "";
    const diff = Math.round((new Date(date + "T00:00") - new Date(today() + "T00:00")) / 86400000);
    return diff > 0 ? `테스트 D-${diff}` : diff === 0 ? "오늘 테스트! 🔥" : "테스트 끝";
  }

  // ── 소리 (효과음은 WebAudio, 단어는 브라우저 TTS) ──
  let AC = null;
  function tone(freqs, dur = 0.12, type = "sine", gap = 0.09) {
    try {
      AC ||= new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + i * gap;
        o.type = type; o.frequency.value = f; o.connect(g); g.connect(AC.destination);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.start(t); o.stop(t + dur + 0.02);
      });
    } catch { /* 소리 없이 진행 */ }
  }
  const sfx = {
    ok: () => tone([660, 880]), tap: () => tone([520], 0.06),
    bad: () => tone([180, 150], 0.18, "square", 0.12),
    win: () => tone([523, 659, 784, 1047], 0.18, "triangle", 0.12),
  };
  let voices = [];
  const loadVoices = () => { try { voices = speechSynthesis.getVoices(); } catch { } };
  if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function enVoice() {
    const en = voices.filter(v => /^en[-_]US/i.test(v.lang)), any = voices.filter(v => /^en/i.test(v.lang));
    const pref = [/Samantha/i, /Google US English/i, /Jenny|Aria|Ava|Zira/i];
    for (const p of pref) { const v = en.find(x => p.test(x.name)); if (v) return v; }
    return en[0] || any[0] || null;
  }
  function speak(text, rate) {
    if (!("speechSynthesis" in window)) { toast("이 브라우저는 소리 읽기를 지원하지 않아요"); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text), v = enVoice();
      if (v) u.voice = v;
      u.lang = v?.lang || "en-US"; u.rate = rate || S.settings.rate; u.pitch = 1.05;
      speechSynthesis.speak(u);
    } catch { }
  }
  const sayWord = w => speak(S.settings.sayTwice ? `${w}. ... ${w}.` : w);
  const sayLetters = w => speak(w.replace(/\s/g, "").split("").join(", "), 0.7);

  // ── 공통 UI ──
  let toastT;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2200); }
  function confetti(n = 40) {
    const box = $("#confetti"), cols = ["#ffc93c", "#ff6f91", "#5ac8fa", "#7ed957", "#b28dff", "#ff9f43"];
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "vw"; p.style.background = pick(cols);
      p.style.animationDelay = Math.random() * 0.4 + "s"; p.style.transform = `rotate(${Math.random() * 360}deg)`;
      box.appendChild(p); setTimeout(() => p.remove(), 2200);
    }
  }
  function updateStarBadge() { const b = $("#starNow"); if (b) b.textContent = S.stars[S.kid] || 0; }
  function bee(msg, mood = "") { return `<div class="buzzy ${mood}"><span class="buzzy-face">🐝</span><p>${msg}</p></div>`; }
  function openDlg(html) { $("#dlgBody").innerHTML = html; const d = $("#dlg"); if (!d.open) d.showModal(); }
  const closeDlg = () => $("#dlg").close();

  // ── 화면: 홈 ──
  function viewHome() {
    const k = kid();
    if (!k) return `<section class="welcome">${bee("안녕! 나는 버지(Buzzy)야. 같이 스펠링 연습하자! 먼저 이름을 알려줘 🐝")}
      <button class="big primary" data-act="kid-new">👧 이름 등록하기</button></section>`;
    const lists = kidLists(), st = streak();
    const cur = lists[0];
    return `
      <section class="hello-kid">
        <div class="kid-avatar">${k.avatar}</div>
        <div><h1>${esc(k.name)}, 안녕! 👋</h1>
          <div class="kid-stats"><span>⭐ <b id="starNow">${S.stars[S.kid] || 0}</b></span><span>🔥 ${st}일 연속</span><a href="#stickers">🎁 스티커 ${(S.stickers[S.kid] || []).length}개</a></div></div>
      </section>
      ${cur ? `<a class="this-week" href="#list/${cur.id}">
          <div><small>이번 주 단어</small><b>${esc(cur.title)}</b><span>${cur.words.length}개 단어 · ${dday(cur.testDate) || esc(cur.date)}</span></div>
          <div class="mini-ring" style="--p:${listMastery(cur)}"><span>${listMastery(cur)}%</span></div></a>
        ${recommend(cur)}`
        : bee("아직 단어장이 없어요. 엄마·아빠가 이번 주 스펠링 단어 사진을 올려 주면 바로 시작할 수 있어요! 📷")}
      <div class="add-row">
        <button class="big primary" data-act="add-photo">📷 단어 사진 올리기</button>
        <button class="big" data-act="add-type">⌨️ 직접 입력</button>
      </div>
      ${lists.length > 1 ? `<h2 class="sec">📚 지난 단어장</h2><div class="lists">${lists.slice(1).map(l => `
        <a class="list-card" href="#list/${l.id}"><b>${esc(l.title)}</b><span>${l.words.length}개 · ${esc(l.date)}</span><i style="--p:${listMastery(l)}"></i></a>`).join("")}</div>` : ""}`;
  }

  // 숙련도에 맞춰 오늘 할 연습을 하나 골라 준다: 보기 → 퍼즐 → 듣고 쓰기 → 실전
  function recommend(l) {
    const p = listMastery(l);
    const [mode, msg] = p < 25 ? ["card", "먼저 단어랑 친해지자! 👀 보고 듣기부터 해 볼까?"]
      : p < 50 ? ["puzzle", "좋아! 이제 🧩 글자 퍼즐로 순서를 익혀 보자!"]
      : p < 80 ? ["listen", "많이 늘었어! 🎧 듣고 쓰기로 직접 써 보자!"]
      : ["test", "거의 다 외웠네! 🏆 실전 테스트로 확인해 볼까?"];
    const m = MODES.find(x => x.id === mode);
    return `${bee(msg)}<a class="big primary go" href="#play/${mode}/${l.id}">${m.emoji} ${m.name} 시작!</a>`;
  }

  // ── 화면: 단어장 ──
  const MODES = [
    { id: "card", emoji: "👀", name: "보고 듣기", desc: "단어를 보고 소리 듣기" },
    { id: "puzzle", emoji: "🧩", name: "글자 퍼즐", desc: "섞인 글자 순서 맞추기" },
    { id: "missing", emoji: "🔍", name: "빠진 글자", desc: "숨은 글자 찾기" },
    { id: "listen", emoji: "🎧", name: "듣고 쓰기", desc: "힌트 있는 받아쓰기" },
    { id: "test", emoji: "🏆", name: "실전 테스트", desc: "진짜 시험처럼!" },
  ];
  function viewList(id) {
    const l = listById(id);
    if (!l) { location.hash = "#home"; return ""; }
    const tests = S.tests.filter(t => t.list === l.id && t.kid === S.kid).slice(-3).reverse();
    return `
      <div class="list-head"><a class="back" href="#home">‹ 홈</a>
        <h1>${esc(l.title)}</h1><p class="muted">${l.words.length}개 단어 · ${esc(l.date)}${l.testDate ? ` · <b>${dday(l.testDate)}</b>` : ""}</p></div>
      <div class="modes">${MODES.map(m => `<a class="mode m-${m.id}" href="#play/${m.id}/${l.id}"><b>${m.emoji}</b><span>${m.name}</span><small>${m.desc}</small></a>`).join("")}</div>
      ${tests.length ? `<div class="test-log">${tests.map(t => `<span>${t.date.slice(5)} 🏆 ${t.score}/${t.total}</span>`).join("")}</div>` : ""}
      <h2 class="sec">단어 ${l.words.length}개 <small class="muted">— 누르면 소리가 나와요</small></h2>
      <div class="words">${l.words.map(x => { const p = wp(l.id, x.w); return `
        <button class="word-chip" data-say="${esc(x.w)}"><b>${esc(x.w)}</b>${x.ko ? `<small>${esc(x.ko)}</small>` : ""}<i>${"★".repeat(Math.min(3, p.lvl))}${"☆".repeat(3 - Math.min(3, p.lvl))}</i></button>`; }).join("")}</div>
      <div class="list-tools"><button class="ghost" data-act="edit-list" data-id="${l.id}">✏️ 단어 고치기</button></div>`;
  }

  // ── 화면: 스티커북 ──
  function viewStickers() {
    const mine = S.stickers[S.kid] || [], cnt = {};
    mine.forEach(e => cnt[e] = (cnt[e] || 0) + 1);
    return `<div class="list-head"><a class="back" href="#home">‹ 홈</a><h1>🎁 ${esc(kid()?.name || "")}의 스티커북</h1>
      <p class="muted">${Object.keys(cnt).length} / ${STICKERS.length} 종류 모았어요 · 연습을 끝내거나 테스트를 잘 보면 스티커가 생겨요!</p></div>
      <div class="sticker-book">${STICKERS.map(e => `<div class="slot ${cnt[e] ? "got" : ""}">${cnt[e] ? `${e}${cnt[e] > 1 ? `<small>×${cnt[e]}</small>` : ""}` : "?"}</div>`).join("")}</div>`;
  }

  // ── 게임 ──
  let G = null;
  function startGame(mode, listId, only) {
    const l = listById(listId);
    if (!l || !l.words.length) { location.hash = "#home"; return ""; }
    const words = only ? l.words.filter(x => only.includes(x.w)) : l.words;
    G = { mode, list: l, queue: mode === "card" ? [...words] : shuffle(words), i: 0, right: 0, wrong: [], typed: "", tries: 0, hints: 0, done: false };
    return renderGame(true);
  }
  const cur = () => G.queue[G.i];
  function gameFrame(inner) {
    const n = G.queue.length, pct = Math.round(G.i / n * 100), m = MODES.find(x => x.id === G.mode);
    return `<div class="game g-${G.mode}">
      <div class="game-top"><a class="back" href="#list/${G.list.id}">✕</a><b>${m.emoji} ${m.name}</b><span>${Math.min(G.i + 1, n)} / ${n}</span></div>
      <div class="track"><i style="width:${pct}%"></i><span style="left:${pct}%">🐝</span><em>🌼</em></div>
      ${inner}</div>`;
  }
  function renderGame(first) {
    if (G.done) return renderResult();
    const x = cur(), w = x.w;
    let inner = "";
    if (G.mode === "card") {
      inner = `<div class="flash">
          <div class="flash-word ${G.cover ? "covered" : ""}">${G.cover ? "🙈 ? ? ?" : [...w].map((c, i) => `<span class="c${i % 5}">${esc(c)}</span>`).join("")}</div>
          ${x.ko ? `<p class="flash-ko">${esc(x.ko)}</p>` : ""}
          <div class="say-row"><button class="round" data-say="${esc(w)}">🔊</button><button class="round" data-slow="${esc(w)}">🐢</button><button class="round" data-letters="${esc(w)}">🔤</button></div>
          <p class="muted small">🔊 듣기 · 🐢 천천히 · 🔤 한 글자씩</p>
          <button class="ghost" data-act="cover">${G.cover ? "👀 다시 보기" : "🙈 가리고 말해 보기"}</button>
        </div>
        <div class="nav-row"><button class="big" data-act="prev" ${G.i ? "" : "disabled"}>‹ 이전</button><button class="big primary" data-act="next">${G.i === G.queue.length - 1 ? "다 봤어요! 🎉" : "다음 ›"}</button></div>`;
    } else if (G.mode === "puzzle") {
      if (first || !G.tiles) { G.tiles = shuffle([...w].map((c, i) => ({ c, i })).filter(t => t.c !== " ")); G.fill = [...w].map(c => c === " " ? " " : ""); G.pos = 0; skipSpaces(); if (G.tiles.length > 1 && G.tiles.every((t, k) => t.c === [...w.replace(/ /g, "")][k])) G.tiles.reverse(); }
      inner = `${x.ko ? `<p class="flash-ko">${esc(x.ko)}</p>` : ""}
        <div class="say-row"><button class="round" data-say="${esc(w)}">🔊</button></div>
        <div class="slots">${G.fill.map((c, i) => `<span class="${c === " " ? "space" : c ? "on" : i === G.pos ? "next" : ""}">${esc(c.trim())}</span>`).join("")}</div>
        <div class="tiles">${G.tiles.map((t, k) => `<button class="tile ${t.used ? "used" : ""}" data-tile="${k}" ${t.used ? "disabled" : ""}>${esc(t.c)}</button>`).join("")}</div>`;
    } else if (G.mode === "missing") {
      if (first || !G.blanks) {
        const idx = [...w].map((c, i) => i).filter(i => /[a-z]/i.test(w[i]));
        G.blanks = shuffle(idx).slice(0, w.length >= 6 ? 2 : 1).sort((a, b) => a - b); G.bpos = 0; G.opts = optionsFor(w[G.blanks[0]]);
      }
      const shown = [...w].map((c, i) => { const b = G.blanks.indexOf(i); return b < 0 ? `<span>${esc(c)}</span>` : b < G.bpos ? `<span class="found">${esc(c)}</span>` : `<span class="hole ${b === G.bpos ? "next" : ""}">?</span>`; });
      inner = `${x.ko ? `<p class="flash-ko">${esc(x.ko)}</p>` : ""}
        <div class="say-row"><button class="round" data-say="${esc(w)}">🔊</button></div>
        <div class="flash-word miss">${shown.join("")}</div>
        <p class="muted">물음표에 들어갈 글자를 골라요!</p>
        <div class="tiles opts">${G.opts.map(c => `<button class="tile" data-opt="${esc(c)}">${esc(c)}</button>`).join("")}</div>`;
    } else {   // listen · test
      const test = G.mode === "test";
      inner = `<div class="say-row big-say"><button class="round huge" data-say="${esc(w)}">🔊</button>${test ? "" : `<button class="round" data-slow="${esc(w)}">🐢</button>`}</div>
        ${!test && x.ko ? `<p class="flash-ko">${esc(x.ko)}</p>` : ""}
        <p class="muted">${test ? "잘 듣고 스펠링을 써 보세요. 한 번만 기회가 있어요!" : "잘 듣고 써 보세요! 모르면 💡 힌트"}</p>
        ${test ? `<div class="answer-line">${esc(G.typed) || "&nbsp;"}<i class="caret"></i></div>`
          : `<div class="slots">${[...w].map((c, i) => `<span class="${c === " " ? "space" : G.typed[i] ? "on" : i === G.typed.length ? "next" : ""}">${esc((G.typed[i] || "").trim())}</span>`).join("")}</div>`}
        ${fbBox()}
        ${keyboard(test)}`;
    }
    const html = gameFrame(inner);
    if (first) setTimeout(() => { if (G && G.mode !== "card") sayWord(cur().w); }, 350);
    return html;
  }
  function skipSpaces() { while (G.fill[G.pos] === " ") G.pos++; }
  function optionsFor(c) {
    const lower = c.toLowerCase(), pool = "abcdefghijklmnopqrstuvwxyz".split("").filter(x => x !== lower);
    const near = { a: "eo", e: "ai", i: "ey", o: "au", u: "oa", b: "dp", d: "bt", p: "bq", m: "n", n: "m", c: "ks", k: "c", s: "cz", g: "j", j: "g", v: "f", f: "v", y: "i" }[lower] || "";
    const opts = new Set([lower, ...near.split("").slice(0, 2)]);
    for (const x of shuffle(pool)) { if (opts.size >= 4) break; opts.add(x); }
    return shuffle([...opts]).map(x => c === c.toUpperCase() && /[A-Z]/.test(c) ? x.toUpperCase() : x);
  }
  function keyboard(test) {
    const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    const extra = G.list.words.some(x => /[ '\-]/.test(x.w));
    return `<div class="kb">${rows.map((r, i) => `<div class="kb-row">${i === 2 ? (extra ? `<button class="key fn" data-key="'">'</button>` : "") : ""}${r.split("").map(c => `<button class="key" data-key="${c}">${c}</button>`).join("")}${i === 2 ? `<button class="key fn" data-key="⌫" aria-label="지우기">⌫</button>` : ""}</div>`).join("")}
      <div class="kb-row">${extra ? `<button class="key fn" data-key="-">-</button><button class="key space" data-key=" ">space</button>` : ""}
        ${test ? "" : `<button class="key fn hint" data-act="hint">💡 힌트</button>`}
        <button class="key enter" data-act="check">✔ 확인</button></div></div>`;
  }
  function rerender() { $("#view").innerHTML = renderGame(false); }
  function next() {
    G.i++; G.tiles = null; G.blanks = null; G.typed = ""; G.tries = 0; G.hints = 0; G.cover = false; G.fb = null;
    if (G.i >= G.queue.length) finish();
    rerender();
    if (!G.done && G.mode !== "card") setTimeout(() => sayWord(cur().w), 300);
  }
  function mark(ok) {
    const p = wp(G.list.id, cur().w);
    if (ok) { p.ok++; p.lvl = Math.min(3, p.lvl + 1); } else { p.bad++; p.lvl = Math.max(0, p.lvl - 1); }
    save();
  }
  function finish() {
    G.done = true;
    const total = G.queue.length;
    if (G.mode === "test") {
      const score = G.right;
      S.tests.push({ kid: S.kid, list: G.list.id, date: today(), score, total, wrong: G.wrong });
      G.stickers = score === total ? giveStickers(3) : score / total >= 0.8 ? giveStickers(2) : score / total >= 0.5 ? giveStickers(1) : [];
    } else if (G.mode === "card") { addStars(1); G.stickers = []; }
    else G.stickers = giveStickers(1);
    (S.days[S.kid] ||= {})[today()] = 1; save();
    sfx.win(); confetti(G.mode === "test" && G.right === total ? 90 : 50);
  }
  function renderResult() {
    const total = G.queue.length, m = MODES.find(x => x.id === G.mode);
    const sticky = G.stickers?.length ? `<p class="sticker-got">새 스티커! ${G.stickers.map(e => `<span>${e}</span>`).join("")}</p>` : "";
    if (G.mode === "test") {
      const pct = Math.round(G.right / total * 100);
      const msg = pct === 100 ? "만점이에요!!! 진짜 시험도 문제없어요! 🏆" : pct >= 80 ? "아주 잘했어요! 틀린 것만 한 번 더 보면 완벽해요!" : pct >= 50 ? "좋아요! 틀린 단어를 연습하면 금방 늘어요 💪" : "괜찮아요! 퍼즐이랑 듣고 쓰기로 먼저 연습해 볼까요? 🐝";
      return gameFrame(`<div class="result">
        <div class="score-big">${G.right}<small> / ${total}</small></div>
        <div class="stars-row">${[1, 2, 3].map(n => `<span class="${pct >= [50, 80, 100][n - 1] ? "on" : ""}">⭐</span>`).join("")}</div>
        ${bee(msg, pct >= 80 ? "happy" : "")}${sticky}
        ${G.wrong.length ? `<div class="wrong-list"><b>다시 볼 단어</b>${G.wrong.map(w => `<button class="word-chip bad" data-say="${esc(w.w)}"><b>${esc(w.w)}</b><small>내 답: ${esc(w.typed || "(빈칸)")}</small></button>`).join("")}</div>
          <button class="big primary" data-act="retry-wrong">🎧 틀린 단어만 연습하기</button>` : ""}
        <div class="nav-row"><a class="big" href="#list/${G.list.id}">단어장으로</a><button class="big" data-act="again">🔁 다시 하기</button></div></div>`);
    }
    return gameFrame(`<div class="result">
      <div class="score-big">🎉</div><h2>${m.name} 끝!</h2>
      ${G.mode === "card" ? bee("단어를 다 봤어요! 이제 🧩 퍼즐이나 🎧 듣고 쓰기로 연습해 봐요!", "happy") : bee(`${total}개 중 한 번에 맞힌 단어 ${G.right}개! ⭐ 별을 모았어요!`, "happy")}
      ${sticky}
      <div class="nav-row"><a class="big" href="#list/${G.list.id}">단어장으로</a><button class="big primary" data-act="again">🔁 다시 하기</button></div></div>`);
  }
  function feedback(html, cls) { const f = $("#fb"); if (f) { f.className = cls; f.innerHTML = html; } }
  const fbBox = () => `<div id="fb" class="${G.fb?.[1] || ""}">${G.fb?.[0] || ""}</div>`;   // 다시 그려도 남아야 하는 안내(정답 따라 쓰기)
  function diffHtml(typed, w) {
    return [...w].map((c, i) => `<span class="${norm(typed[i] || "") === norm(c) ? "g" : "r"}">${esc(c)}</span>`).join("");
  }
  function onKey(k) {
    if (!G || G.done || !["listen", "test"].includes(G.mode) || G.locked) return;
    const w = cur().w;
    if (k === "⌫") G.typed = G.typed.slice(0, -1);
    else if (k === "enter") return check();
    else if (G.mode === "test" ? G.typed.length < 30 : G.typed.length < w.length) G.typed += k;
    sfx.tap(); rerender();
    if (G.mode === "listen" && G.typed.length === w.length) setTimeout(check, 250);
  }
  function check() {
    if (!G.typed.trim()) { toast("먼저 글자를 눌러 써 보세요!"); return; }
    const w = cur().w, ok = norm(G.typed) === norm(w);
    if (G.mode === "test") {
      if (ok) G.right++; else G.wrong.push({ w, typed: G.typed });
      mark(ok); G.locked = true;
      ok ? sfx.ok() : sfx.bad();
      feedback(ok ? "⭕ 맞았어요!" : `❌ 정답은 <b>${esc(w)}</b>`, ok ? "fb ok" : "fb bad");
      if (ok) addStars(1);
      setTimeout(() => { G.locked = false; next(); }, ok ? 900 : 1900);
      return;
    }
    // listen
    if (ok) {
      const first = G.tries === 0 && G.hints === 0;
      if (first) G.right++;
      mark(first); addStars(first ? 2 : 1); sfx.ok(); G.locked = true;
      feedback(`${pick(CHEERS)} ${first ? "⭐⭐" : "⭐"}`, "fb ok");
      setTimeout(() => { G.locked = false; next(); }, 1000);
    } else {
      G.tries++; sfx.bad();
      const typed = G.typed;
      if (G.tries >= 2) { G.locked = true; feedback(`정답은 <span class="diff">${diffHtml(typed, w)}</span> — 같이 한 번 더 써 봐요!`, "fb bad"); sayLetters(w); setTimeout(() => { G.locked = false; G.typed = ""; G.fb = [`정답 <b>${esc(w)}</b> — 보고 따라 써 봐요!`, "fb"]; rerender(); }, 2600); }
      else {   // 첫 실수: 정답은 숨기고 내가 쓴 글자만 맞음(초록)/틀림(빨강)으로 보여 준 뒤, 맞은 앞부분은 남겨 둔다
        G.locked = true; feedback(`<span class="diff">${[...typed].map((c, i) => `<span class="${norm(c) === norm(w[i] || "") ? "g" : "r"}">${esc(c)}</span>`).join("")}</span><br>${pick(TRY)}`, "fb bad");
        let n = 0; while (n < typed.length && norm(typed[n]) === norm(w[n])) n++;
        setTimeout(() => { if (!G) return; G.locked = false; G.typed = typed.slice(0, n); rerender(); sayWord(w); }, 1600);
      }
    }
  }
  function hint() {
    const w = cur().w; G.hints++;
    let n = 0; while (n < G.typed.length && norm(G.typed[n]) === norm(w[n])) n++;
    G.typed = w.slice(0, n + 1); sfx.tap(); rerender();
    if (G.typed.length === w.length) setTimeout(check, 250);
  }
  function tapTile(k) {
    const t = G.tiles[k], w = cur().w;
    if (t.used) return;
    if (norm(t.c) === norm(w[G.pos])) {
      t.used = true; G.fill[G.pos] = w[G.pos]; G.pos++; skipSpaces(); sfx.tap();
      if (G.pos >= w.length) { const first = !G.tries; if (first) G.right++; mark(first); addStars(1); sfx.ok(); toast(pick(CHEERS)); speak(w); rerender(); setTimeout(next, 1100); return; }
      rerender();
    } else {
      G.tries++; sfx.bad();
      const b = $(`[data-tile="${k}"]`); b?.classList.add("shake"); setTimeout(() => b?.classList.remove("shake"), 400);
    }
  }
  function tapOpt(c, btn) {
    const w = cur().w, at = G.blanks[G.bpos];
    if (norm(c) === norm(w[at])) {
      G.bpos++; sfx.tap();
      if (G.bpos >= G.blanks.length) { const first = !G.tries; if (first) G.right++; mark(first); addStars(1); sfx.ok(); toast(pick(CHEERS)); speak(w); rerender(); setTimeout(next, 1100); return; }
      G.opts = optionsFor(w[G.blanks[G.bpos]]); rerender();
    } else { G.tries++; sfx.bad(); btn.classList.add("shake", "dim"); btn.disabled = true; }
  }

  // ── 단어장 만들기: 사진(OCR) / 직접 입력 → 확인·수정 → 저장 ──
  const STOP = new Set("name date class grade week weekly spelling spell test tests words word list no number score teacher homework the of and day month year page unit lesson".split(" "));
  const PROPER = new Set("monday tuesday wednesday thursday friday saturday sunday january february march april may june july august september october november december".split(" "));
  function cleanWord(w) {
    w = w.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "");
    if (!w) return "";
    if (PROPER.has(w.toLowerCase())) return w[0].toUpperCase() + w.slice(1).toLowerCase();
    return w === "I" ? w : w.toLowerCase();
  }
  // OCR/붙여넣기 텍스트 → 후보 [{w, ko, on, low}]
  function parseWords(text, lowConf = new Set()) {
    const out = [], seen = new Set();
    let lineHits = 0;
    const add = (w, ko) => {
      w = w.split(" ").map(cleanWord).filter(Boolean).join(" ");
      if (!w || seen.has(norm(w))) return; seen.add(norm(w));
      const single = !w.includes(" "), low = w.split(" ").some(x => lowConf.has(x.toLowerCase()));
      // 같은 줄 두 번째 이후의 흐릿한 단어는 한글 뜻이 영어로 잘못 읽힌 경우가 많아 기본 제외(⚠ 표시, 눌러서 넣을 수 있음)
      const on = !(single && (STOP.has(w.toLowerCase()) || (w.length < 2 && !/^(a|I)$/.test(w)))) && !(low && lineHits > 0);
      if (on) lineHits++;
      out.push({ w, ko: joinHangul(ko || ""), on, low });
    };
    for (let line of String(text).split(/\r?\n/)) {
      lineHits = 0;
      line =line.replace(/^\s*[\(\[]?\d{1,2}\s*[\.\)\]:-]?\s*/, "").trim();
      if (!line) continue;
      // 한 줄에 '영어 - 한글' 이 여러 쌍일 수 있다(표 형태): 영어 덩어리 + 바로 뒤 한글 덩어리로 묶는다
      const pairs = [...line.matchAll(/([A-Za-z][A-Za-z'’\- ]*[A-Za-z]|[A-Za-z])\s*[:\-=–~]?\s*([가-힣][가-힣 ,·~()\/]*)?/g)];
      for (const m of pairs) {
        const en = m[1].replace(/’/g, "'").trim(), ko = (m[2] || "").replace(/[\s,·]+$/, "").trim();
        if (ko && en.split(/\s+/).length <= 4) add(en, ko);              // 뜻이 붙어 있으면 구(phrase)로 본다
        else en.split(/[\s\-]+(?=[A-Za-z])/).forEach((t, i, arr) => add(t, i === arr.length - 1 ? ko : ""));
      }
    }
    return out;
  }
  // OCR 이 한글을 '점 프 하 다' 처럼 글자마다 띄우면 붙인다(한 글자 덩어리가 대부분일 때만)
  function joinHangul(ko) {
    const parts = ko.split(/\s+/).filter(Boolean);
    return parts.length > 1 && parts.filter(x => x.length === 1).length >= parts.length - 1 ? parts.join("") : ko;
  }
  let draft = null;   // {id?, title, date, testDate, words:[{w,ko,on,low}]}
  function newDraft(src) {
    const n = kidLists().length + 1;
    draft = { title: `Week ${n} 단어`, date: today(), testDate: "", words: [], src };
  }
  function openAdd(src) {
    if (!kid()) return openKidNew();
    newDraft(src);
    if (src === "type") return renderDraft();
    openDlg(`<div class="dlg-head"><h2>📷 단어 사진 올리기</h2><button class="ghost icon" data-act="close">✕</button></div>
      <p class="muted">학교에서 받은 스펠링 단어 종이를 <b>밝은 곳에서 똑바로</b> 찍어 주세요. 글자 읽기는 이 기기 안에서만 해요.</p>
      <label class="drop"><input type="file" id="photo" accept="image/*" hidden><span>📸</span><b>사진 찍기 / 고르기</b><small>여러 장이면 한 장씩 차례로 올리면 단어가 더해져요</small></label>
      <label class="check"><input type="checkbox" id="withKo" checked> 한글 뜻도 같이 읽기</label>
      <div id="ocrState"></div>`);
  }
  function loadScript(src) {
    return new Promise((res, rej) => { if (window.Tesseract) return res(); const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("load")); document.head.appendChild(s); });
  }
  async function prepImage(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
      const max = 2200, sc = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth * sc); c.height = Math.round(img.naturalHeight * sc);
      const x = c.getContext("2d"); x.drawImage(img, 0, 0, c.width, c.height);
      const d = x.getImageData(0, 0, c.width, c.height), p = d.data;
      let lo = 255, hi = 0;
      for (let i = 0; i < p.length; i += 4) { const g = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]; p[i] = g; if (g < lo) lo = g; if (g > hi) hi = g; }
      const span = Math.max(1, hi - lo);
      for (let i = 0; i < p.length; i += 4) { const g = Math.max(0, Math.min(255, (p[i] - lo) / span * 255)); p[i] = p[i + 1] = p[i + 2] = g; }
      x.putImageData(d, 0, 0);
      return { canvas: c, preview: url };
    } catch (e) { URL.revokeObjectURL(url); throw e; }
  }
  async function runOcr(file) {
    const st = $("#ocrState"), withKo = $("#withKo")?.checked;
    const show = (pct, msg) => { st.innerHTML = `<div class="ocr-run"><div class="track"><i style="width:${pct}%"></i><span style="left:${pct}%">🐝</span><em>🌼</em></div><p>${msg}</p></div>`; };
    show(3, "버지가 사진을 보고 있어요…");
    let worker;
    try {
      const { canvas, preview } = await prepImage(file);
      show(8, "글자 읽기 도구를 불러오는 중… (처음 한 번은 조금 걸려요)");
      await loadScript(TESSERACT_URL);
      worker = await Tesseract.createWorker(withKo ? "eng+kor" : "eng", 1, {
        logger: m => { if (m.status === "recognizing text") show(30 + Math.round(m.progress * 65), `단어를 읽는 중… ${Math.round(m.progress * 100)}%`); else if (/load/i.test(m.status)) show(15, "글자 읽기 도구 준비 중…"); },
      });
      const { data } = await worker.recognize(canvas);
      const low = new Set((data.words || []).filter(x => x.confidence < 60).map(x => x.text.replace(/[^A-Za-z]/g, "").toLowerCase()).filter(Boolean));
      const found = parseWords(data.text || "", low);
      const before = draft.words.length;
      for (const f of found) if (!draft.words.some(x => norm(x.w) === norm(f.w))) draft.words.push(f);
      draft.preview = preview;
      const added = draft.words.length - before;
      if (!added) { st.innerHTML = bee("앗, 단어를 못 찾았어요 😢 더 밝은 곳에서 종이를 화면 가득 다시 찍어 주세요. 아니면 ⌨️ 직접 입력도 돼요!"); return; }
      toast(`단어 ${added}개를 찾았어요!`);
      renderDraft();
    } catch (e) {
      st.innerHTML = bee(e?.message === "load" ? "글자 읽기 도구를 불러오지 못했어요. 인터넷 연결을 확인하거나 ⌨️ 직접 입력으로 만들어 주세요." : "사진을 읽지 못했어요. 다른 사진으로 다시 해 보거나 ⌨️ 직접 입력으로 만들어 주세요.");
    } finally { try { await worker?.terminate(); } catch { } }
  }
  function renderDraft() {
    const d = draft, on = d.words.filter(x => x.on).length;
    openDlg(`<div class="dlg-head"><h2>${d.id ? "✏️ 단어 고치기" : "✅ 단어 확인하기"}</h2><button class="ghost icon" data-act="close">✕</button></div>
      ${d.preview ? `<details class="preview"><summary>📷 올린 사진 보기</summary><img src="${d.preview}" alt="올린 단어 사진"></details>` : ""}
      ${d.words.length ? `<p class="muted small">${d.src === "photo" ? "사진에서 읽은 단어예요. <b>틀린 글자는 꼭 고쳐 주세요</b> (⚠ 는 읽기가 흐릿했던 단어). 회색은 제외된 단어 — 누르면 다시 넣어요." : "단어와 뜻을 확인하세요."}</p>` : ""}
      <div class="draft">${d.words.map((x, i) => `<div class="draft-row ${x.on ? "" : "off"}">
          <button class="tog" data-tog="${i}" aria-label="${x.on ? "빼기" : "넣기"}">${x.on ? "✅" : "⬜"}</button>
          <input data-w="${i}" value="${esc(x.w)}" autocapitalize="off" autocomplete="off" spellcheck="false" aria-label="단어">
          <input data-ko="${i}" value="${esc(x.ko)}" placeholder="뜻(선택)" aria-label="뜻">
          ${x.low ? `<span class="warn" title="흐릿하게 읽힌 단어">⚠</span>` : ""}
        </div>`).join("")}</div>
      <label class="paste"><span>⌨️ 단어 더 넣기 <small class="muted">— 한 줄에 하나씩, 뜻은 띄우고 적기 (예: apple 사과)</small></span>
        <textarea id="pasteBox" rows="3" placeholder="apple 사과&#10;banana 바나나" autocapitalize="off" spellcheck="false"></textarea>
        <button class="ghost" data-act="paste-add">＋ 넣기</button></label>
      ${d.src === "photo" && !d.id ? `<label class="ghost file-more"><input type="file" id="photo" accept="image/*" hidden>📷 사진 한 장 더</label><div id="ocrState"></div><input type="checkbox" id="withKo" checked hidden>` : ""}
      <div class="meta-row">
        <label>단어장 이름<input id="dTitle" value="${esc(d.title)}"></label>
        <label>시험 보는 날<input id="dTest" type="date" value="${esc(d.testDate)}"></label>
      </div>
      <div class="dlg-foot"><span class="muted">${on}개 단어</span><button class="big primary" data-act="save-list" ${on ? "" : "disabled"}>💾 저장하고 연습 시작</button></div>`);
  }
  function syncDraftInputs() {
    if (!draft) return;
    $$("[data-w]").forEach(el => { const x = draft.words[+el.dataset.w]; if (x) x.w = el.value.trim(); });
    $$("[data-ko]").forEach(el => { const x = draft.words[+el.dataset.ko]; if (x) x.ko = el.value.trim(); });
    const t = $("#dTitle"), dt = $("#dTest");
    if (t) draft.title = t.value.trim() || draft.title; if (dt) draft.testDate = dt.value;
  }
  function saveDraft() {
    syncDraftInputs();
    const seen = new Set(), words = [];
    for (const x of draft.words) { const w = x.w.replace(/\s+/g, " ").trim(); if (!x.on || !w || seen.has(norm(w))) continue; seen.add(norm(w)); words.push({ w, ko: x.ko }); }
    if (!words.length) { toast("단어가 하나 이상 있어야 해요"); return; }
    let l = draft.id && listById(draft.id);
    if (l) Object.assign(l, { title: draft.title, testDate: draft.testDate, words });
    else { l = { id: uid(), kid: S.kid, title: draft.title, date: draft.date, testDate: draft.testDate, words }; S.lists.push(l); }
    save(); closeDlg(); draft = null;
    toast("단어장을 저장했어요! 🐝"); location.hash = `#list/${l.id}`;
  }
  function editList(id) {
    const l = listById(id); if (!l) return;
    draft = { id, title: l.title, date: l.date, testDate: l.testDate || "", words: l.words.map(x => ({ ...x, on: true })), src: "edit" };
    renderDraft();
  }

  // ── 아이 등록·바꾸기 ──
  function openKidNew() {
    openDlg(`<div class="dlg-head"><h2>👧 누가 연습하나요?</h2>${S.kids.length ? `<button class="ghost icon" data-act="close">✕</button>` : ""}</div>
      ${S.kids.length ? `<div class="kids">${S.kids.map(k => `<button class="kid-pick ${k.id === S.kid ? "on" : ""}" data-kid="${k.id}"><b>${k.avatar}</b>${esc(k.name)}</button>`).join("")}</div><h3>＋ 새로 등록</h3>` : ""}
      <label class="meta-row one"><span>이름 (별명도 좋아요)</span><input id="kidName" maxlength="12" placeholder="예: 하늘"></label>
      <div class="avatars">${AVATARS.map((a, i) => `<button class="av ${i ? "" : "on"}" data-av="${a}">${a}</button>`).join("")}</div>
      <div class="dlg-foot"><span></span><button class="big primary" data-act="kid-save">등록하기</button></div>
      <div class="settings"><h3>⚙️ 설정</h3>
        <label>말하기 속도 <input type="range" id="rate" min="0.5" max="1.1" step="0.1" value="${S.settings.rate}"> <output>${S.settings.rate}</output></label>
        <label class="check"><input type="checkbox" id="twice" ${S.settings.sayTwice ? "checked" : ""}> 단어를 두 번씩 읽어 주기</label>
        <div class="row"><button class="ghost" data-act="backup">💾 기록 저장(파일)</button><label class="ghost">📂 기록 불러오기<input type="file" id="restore" accept="application/json" hidden></label></div>
      </div>`);
  }
  function saveKid() {
    const name = $("#kidName").value.trim();
    if (!name) { toast("이름을 적어 주세요"); return; }
    const k = { id: uid(), name, avatar: $(".av.on")?.dataset.av || "🐰" };
    S.kids.push(k); S.kid = k.id; save(); closeDlg(); updateKidBtn(); route();
    toast(`${name}, 반가워! 🐝`);
  }
  function updateKidBtn() { const k = kid(); $("#kidBtn").innerHTML = k ? `${k.avatar}<span class="label"> ${esc(k.name)}</span>` : `👧<span class="label"> 아이</span>`; }

  // ── 라우팅 ──
  function route() {
    const [v, a, b] = location.hash.slice(1).split("/");
    if (v !== "play") G = null;
    let html;
    if (v === "list") html = viewList(a);
    else if (v === "stickers") html = viewStickers();
    else if (v === "play" && MODES.some(m => m.id === a)) html = startGame(a, b, null);
    else html = viewHome();
    $("#view").innerHTML = html;
  }

  // ── 이벤트 ──
  document.addEventListener("click", e => {
    const t = e.target.closest("button, a, label");
    if (!t) return;
    const d = t.dataset;
    if (d.say) return speak(d.say);
    if (d.slow) return speak(d.slow, 0.5);
    if (d.letters) return sayLetters(d.letters);
    if (d.key) return onKey(d.key);
    if (d.tile) return tapTile(+d.tile);
    if (d.opt) return tapOpt(d.opt, t);
    if (d.tog) { syncDraftInputs(); const x = draft.words[+d.tog]; x.on = !x.on; return renderDraft(); }
    if (d.kid) { S.kid = d.kid; save(); closeDlg(); updateKidBtn(); location.hash = "#home"; return route(); }
    if (d.av) { $$(".av").forEach(x => x.classList.toggle("on", x === t)); return; }
    switch (d.act) {
      case "close": draft = null; return closeDlg();
      case "kid-new": return openKidNew();
      case "kid-save": return saveKid();
      case "add-photo": return openAdd("photo");
      case "add-type": return openAdd("type");
      case "paste-add": {
        syncDraftInputs();
        const found = parseWords($("#pasteBox").value);
        for (const f of found) if (!draft.words.some(x => norm(x.w) === norm(f.w))) draft.words.push({ ...f, on: true });
        return renderDraft();
      }
      case "save-list": return saveDraft();
      case "edit-list": return editList(d.id);
      case "cover": G.cover = !G.cover; return rerender();
      case "prev": G.i = Math.max(0, G.i - 1); G.cover = false; rerender(); return speak(cur().w);
      case "next": if (G.i === G.queue.length - 1) { G.i++; finish(); return rerender(); } G.i++; G.cover = false; rerender(); return speak(cur().w);
      case "check": return check();
      case "hint": return hint();
      case "again": $("#view").innerHTML = startGame(G.mode, G.list.id, null); return;
      case "retry-wrong": { const only = G.wrong.map(x => x.w); $("#view").innerHTML = startGame("listen", G.list.id, only); return; }
      case "backup": {
        const blob = new Blob([JSON.stringify(S, null, 1)], { type: "application/json" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `spelling-backup-${today()}.json`; a.click();
        return;
      }
    }
  });
  document.addEventListener("change", e => {
    const t = e.target;
    if (t.id === "photo" && t.files?.[0]) { if ($(".draft")) syncDraftInputs(); const f = t.files[0]; t.value = ""; runOcr(f); }
    if (t.id === "twice") { S.settings.sayTwice = t.checked; save(); }
    if (t.id === "restore" && t.files?.[0]) {
      const r = new FileReader();
      r.onload = () => { try { const s = JSON.parse(r.result); if (!s || !Array.isArray(s.lists) || !Array.isArray(s.kids)) throw 0; S = { ...defaults(), ...s }; save(); closeDlg(); updateKidBtn(); route(); toast("기록을 불러왔어요"); } catch { toast("백업 파일 형식이 올바르지 않아요"); } };
      r.readAsText(t.files[0]);
    }
  });
  document.addEventListener("input", e => {
    if (e.target.id === "rate") { S.settings.rate = +e.target.value; e.target.nextElementSibling.textContent = e.target.value; save(); }
  });
  document.addEventListener("keydown", e => {
    if (!G || !["listen", "test"].includes(G.mode) || $("#dlg").open || e.target.matches("input, textarea")) return;
    if (e.key === "Enter") { e.preventDefault(); onKey("enter"); }
    else if (e.key === "Backspace") { e.preventDefault(); onKey("⌫"); }
    else if (/^[a-zA-Z' \-]$/.test(e.key)) { e.preventDefault(); onKey(e.key === " " ? " " : e.key); }
  });
  $("#kidBtn").onclick = openKidNew;
  window.addEventListener("hashchange", () => { route(); window.scrollTo(0, 0); });

  // ── 테마 ──
  function applyTheme(theme) {
    if (theme) document.documentElement.dataset.theme = theme;
    const dark = theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    $("#themeBtn").textContent = dark ? "☀️" : "🌙";
  }
  $("#themeBtn").onclick = () => {
    const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark"; store.rawSet(THEME_KEY, next); applyTheme(next);
  };
  applyTheme(store.raw(THEME_KEY));
  updateKidBtn();
  route();
  window.__spelling = { parseWords, get state() { return S; }, get game() { return G; } };   // 검증용
})();
