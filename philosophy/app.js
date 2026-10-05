(() => {
  const THEME_KEY = "cooking.theme";      // 요리·영어·창업과 공유
  const PATH_KEY = "philo.path";          // {stageId: [듣기, 숙고, 명상]}
  const NOTE_KEY = "philo.notes";         // {stageId: text, free: text}
  const MARK_KEY = "philo.marks";         // 책갈피 verse id 배열
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, f) { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  const V = Object.fromEntries(VERSES.map(v => [v.id, v]));
  const U = Object.fromEntries(UPA.map(u => [u.id, u]));
  const STEPS = [
    { k: "듣기", sa: "śravaṇa", ic: "👂" },
    { k: "숙고", sa: "manana", ic: "✍️" },
    { k: "명상", sa: "nididhyāsana", ic: "🕯" }
  ];
  let prog = store.get(PATH_KEY, {});
  let notes = store.get(NOTE_KEY, {});
  let marks = store.get(MARK_KEY, []);
  // 상담 테이블: 나 + 상담사 3명. {seats: [id×3], log: [{role: user|assistant|note, content, speaker?, to?, target?}]} — 이 브라우저에만
  const TABLE_KEY = "philo.table";
  const OLD_COUNSEL_KEY = "philo.counsel"; // 2026-10-05 1차(상담사 1명) 대화 배열 → 붓다가 앉은 테이블로 옮겨 읽음(원본 키는 그대로 둠)
  const COUNSEL_API = "https://chartupndown.com/.netlify/functions/dharma-counsel";   // chartup Netlify → Claude, 실패 시 Gemini (키는 서버 환경변수)
  const CRISIS = /자살|죽고\s*싶|죽어\s*버리|자해|목숨을|사라지고\s*싶|극단적\s*선택|살기\s*싫/;
  const C = Object.fromEntries(COUNSELORS.map(c => [c.id, c]));
  const pickSeats = (keep = []) => {
    const pool = COUNSELORS.map(c => c.id).filter(id => !keep.includes(id));
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    return [...keep, ...pool].slice(0, 3);
  };
  let table = (() => {
    const t = store.get(TABLE_KEY, null);
    if (t && Array.isArray(t.seats) && t.seats.length === 3 && t.seats.every(id => C[id]) && Array.isArray(t.log)) return t;
    const old = store.get(OLD_COUNSEL_KEY, []);
    if (Array.isArray(old) && old.length)
      return { seats: pickSeats(["buddha"]), log: old.map(m => m.role === "assistant" ? { ...m, speaker: "buddha", to: "me" } : m) };
    return { seats: pickSeats(), log: [] };
  })();
  const saveTable = () => store.set(TABLE_KEY, table);
  let target = null;                       // 다음 질문을 받을 상담사 id (null = 모두에게)
  let busy = false, chatErr = "", lastSend = 0, lastReq = null;
  let vf = { q: "", upa: "all", theme: "all", marked: false };
  let mood = null;

  const checksOf = id => prog[id] || [false, false, false];
  const doneCount = () => PATH.filter(p => checksOf(p.id).every(Boolean)).length;
  const setCheck = (id, i, v) => { const c = checksOf(id).slice(); c[i] = v; prog[id] = c; store.set(PATH_KEY, prog); };
  const dayIndex = () => { const d = new Date(); return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5); };
  const todayVerse = () => VERSES[dayIndex() % VERSES.length];
  const stageOfVerse = id => PATH.find(p => p.verses.includes(id));

  // ---------- 조각 ----------
  const verseBlock = (v, opt = {}) => `
    <div class="verse">
      <span class="ref">${esc(v.ref)}</span>
      <p class="verse-ko">${esc(v.ko)}</p>
      ${opt.sa !== false ? `<p class="verse-sa">${esc(v.sa)}</p>` : ""}
      ${opt.note ? `<p class="lead" style="margin:0">${esc(v.note)}</p>` : ""}
      ${opt.schop && v.schop ? `<div class="schop-box"><b>쇼펜하우어와 함께 · </b>${esc(v.schop)}</div>` : ""}
      ${opt.btns !== false ? `<div class="row-btns" style="margin-bottom:0">
        <button class="btn sm" data-calm-open="${v.id}">🕯 고요히 읽기</button>
        <button class="btn sm" data-verse="${v.id}">자세히</button>
      </div>` : ""}
    </div>`;

  const vcard = v => `
    <button class="vcard" data-verse="${v.id}">
      ${marks.includes(v.id) ? `<span class="mark" aria-label="책갈피">🔖</span>` : ""}
      <span class="ref">${esc(v.ref)}</span>
      <p class="verse-ko">${esc(v.ko)}</p>
      <div class="vtags">${v.themes.map(t => `<span class="vtag">${esc(THEMES[t])}</span>`).join("")}${v.schop ? `<span class="vtag">🕯 쇼펜하우어</span>` : ""}</div>
    </button>`;

  function vlist() {
    const q = vf.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const list = VERSES.filter(v =>
      (vf.upa === "all" || v.upa === vf.upa) &&
      (vf.theme === "all" || v.themes.includes(vf.theme)) &&
      (!vf.marked || marks.includes(v.id)) &&
      q.every(w => (v.ko + v.ref + v.note + (v.schop || "") + v.sa + U[v.upa].name).toLowerCase().includes(w)));
    return `<p class="count" id="vcount">${list.length}개 구절</p>
      <div class="vgrid">${list.map(vcard).join("")}</div>
      ${list.length ? "" : `<p class="empty">맞는 구절이 없습니다</p>`}`;
  }

  // ---------- 상담 ----------
  function md(text) {            // 상담 답변용 아주 작은 마크다운: ### · 목록 · **굵게**
    const inline = t => esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    let html = "", list = null;
    const close = () => { if (list) { html += `</${list}>`; list = null; } };
    for (const raw of String(text).split("\n")) {
      const l = raw.trim();
      let m;
      if (!l) { close(); continue; }
      if ((m = l.match(/^#{1,4}\s+(.*)/))) { close(); html += `<h4>${inline(m[1])}</h4>`; }
      else if ((m = l.match(/^[-*•]\s+(.*)/))) { if (list !== "ul") { close(); html += "<ul>"; list = "ul"; } html += `<li>${inline(m[1])}</li>`; }
      else if ((m = l.match(/^\d+[.)]\s+(.*)/))) { if (list !== "ol") { close(); html += "<ol>"; list = "ol"; } html += `<li>${inline(m[1])}</li>`; }
      else { close(); html += `<p>${inline(l)}</p>`; }
    }
    close();
    return html;
  }
  const av = (id, cls = "") => { const c = C[id]; return `<span class="av ${cls}" style="--h:${c.hue}" aria-hidden="true">${c.emoji}</span>`; };
  const nameOf = id => C[id] ? C[id].name : "";
  const kindLabel = c => c.kind === "figure" ? "인물 AI" : "가상 상담사";
  function seatsHTML() {
    return `<div class="table-seats" role="group" aria-label="테이블에 앉은 상담사 — 누르면 그 상담사에게 질문">
      <div class="seat me"><span class="av" aria-hidden="true">🙂</span><b>나</b><small>오늘의 이야기</small></div>
      ${table.seats.map(id => { const c = C[id]; return `
      <button class="seat" data-target="${id}" aria-pressed="${target === id}">
        ${av(id)}<b>${esc(c.name)}</b><small>${esc(c.tag)}</small><i class="kind">${kindLabel(c)}</i>
      </button>`; }).join("")}
    </div>`;
  }
  function chatHTML() {
    const log = table.log;
    const intro = table.seats.map(id => `<div class="msg bot intro">${av(id)}<div class="body"><span class="who">${esc(nameOf(id))}</span><div class="bubble"><p>${esc(C[id].hello)}</p></div></div></div>`).join("");
    const items = log.map((m, i) => {
      if (m.role === "user") return `<div class="msg me">${m.target ? `<span class="to">→ ${esc(nameOf(m.target))}에게</span>` : ""}<div class="bubble">${esc(m.content)}</div></div>`;
      if (m.role === "note") return `<div class="msg note"><span>${esc(m.content)}</span></div>`;
      const to = m.to === "me" ? "" : C[m.to] ? `<span class="to">→ ${esc(nameOf(m.to))}</span>` : m.to === "all" ? `<span class="to">→ 모두</span>` : "";
      const lastOf = !log.slice(i + 1).some(x => x.role === "assistant" && x.speaker === m.speaker);
      return `<div class="msg bot${C[m.to] ? " cross" : ""}">${av(m.speaker)}<div class="body"><span class="who">${esc(nameOf(m.speaker))} ${to}</span><div class="bubble">${md(m.content)}</div>
        ${lastOf && table.seats.includes(m.speaker) ? `<div class="msg-acts"><button class="link" data-more="${m.speaker}">💡 이 이야기 더 듣기</button><button class="link" data-target="${m.speaker}">✋ ${esc(nameOf(m.speaker))}에게 묻기</button></div>` : ""}</div></div>`;
    }).join("");
    const waiting = busy ? `<div class="msg bot">${av(lastReq?.target || table.seats[0])}<div class="body"><span class="who">${lastReq?.mode === "discuss" ? "상담사들이 이야기 나누는 중" : lastReq?.target ? esc(nameOf(lastReq.target)) + " 생각 중" : "세 상담사가 생각을 모으는 중"}</span><div class="bubble typing"><i>●</i><i>●</i><i>●</i></div></div></div>` : "";
    const err = chatErr ? `<div class="msg sys"><div class="bubble">${esc(chatErr)} <button class="btn sm" data-chat-retry>다시 보내기</button></div></div>` : "";
    return intro + items + waiting + err;
  }
  function paintChat() {
    const log = $("#chatLog");
    if (!log) return;
    log.innerHTML = chatHTML();
    const b = $("#chatSend"); if (b) b.disabled = busy;
    const cr = $("#crisis"); if (cr) cr.hidden = !table.log.some(m => m.role === "user" && CRISIS.test(m.content));
    log.lastElementChild?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  async function askCounsel(mode, tgt) {
    lastReq = { mode, target: tgt || null };
    busy = true; chatErr = ""; lastSend = Date.now(); paintChat();
    try {
      const r = await fetch(COUNSEL_API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seats: table.seats, mode, target: tgt || undefined,
          messages: table.log.filter(m => m.role === "user" || m.role === "assistant").slice(-30)
            .map(m => ({ role: m.role, content: m.content, speaker: m.speaker, to: m.to }))
        })
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !Array.isArray(d.turns) || !d.turns.length) throw new Error(d.error || `연결 실패 (${r.status})`);
      d.turns.filter(t => table.seats.includes(t.speaker)).forEach(t => table.log.push({ role: "assistant", speaker: t.speaker, to: t.to, content: t.text }));
      saveTable();
    } catch (e) {
      chatErr = /Failed to fetch|NetworkError|Load failed/i.test(e.message) ? "상담사들에게 연결하지 못했어요. 인터넷 연결을 확인해 주세요." : e.message;
    } finally {
      busy = false;
      if (route()[0] === "counsel") {
        const draft = $("#chatIn")?.value || "";
        render();
        if (draft) $("#chatIn").value = draft;
        const firstNew = document.querySelectorAll("#chatLog .msg")[document.querySelectorAll("#chatLog .msg").length - 1];
        firstNew?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }
  function sendCounsel(text, tgt = target) {
    text = String(text || "").trim();
    if (busy || text.length < 2) return;
    if (Date.now() - lastSend < 3000) return;
    table.log.push({ role: "user", content: text.slice(0, 3000), ...(tgt ? { target: tgt } : {}) });
    saveTable();
    const inp = $("#chatIn"); if (inp) inp.value = "";
    askCounsel(tgt ? "ask" : "round", tgt);
  }
  function discussCounsel() {
    if (busy || !table.log.some(m => m.role === "assistant")) return;
    if (Date.now() - lastSend < 3000) return;
    table.log.push({ role: "note", content: "💬 상담사들이 서로의 생각을 나눕니다" });
    saveTable();
    askCounsel("discuss");
  }
  function saveCounselToNote() {
    const d = new Date().toLocaleDateString("ko-KR");
    const txt = table.log.map(m => m.role === "user" ? `🙋 나${m.target ? ` → ${nameOf(m.target)}` : ""}: ${m.content.trim()}`
      : m.role === "note" ? m.content
      : `${C[m.speaker]?.emoji || "💬"} ${nameOf(m.speaker)}${C[m.to] ? ` → ${nameOf(m.to)}` : ""}:\n${m.content.trim()}`).join("\n\n");
    notes.free = ((notes.free || "").trim() ? notes.free.trim() + "\n\n" : "") + `── 마음 상담 테이블 (${d}) · ${table.seats.map(nameOf).join(" · ")} ──\n${txt}`;
    store.set(NOTE_KEY, notes);
  }

  // ---------- 화면 ----------
  const VIEWS = {
    home() {
      const v = todayVerse(), done = doneCount(), next = PATH.find(p => !checksOf(p.id).every(Boolean));
      const m = MOODS.find(x => x.id === mood);
      return `
      <section class="ph-hero">
        <p class="eyebrow">쇼펜하우어의 머리맡 책 · 우프넥하트</p>
        <blockquote>“그것은 내 삶의 위안이었고,<br><em>내 죽음의 위안</em>이 될 것이다.”</blockquote>
        <cite>— 아르투어 쇼펜하우어, 『소품과 부록』 2권 §185 (1851)<i>Sie ist der Trost meines Lebens gewesen und wird der meines Sterbens sein.</i></cite>
        <div class="hero-btns">
          <button class="btn primary" data-calm-open="${v.id}">🕯 오늘의 구절 고요히 읽기</button>
          <button class="btn" data-go="${next ? "path/" + next.id : "path"}">🧭 ${done ? "여정 이어가기" : "여정 시작하기"}</button>
        </div>
      </section>

      <div class="today">
        <article class="panel">
          <h3>🌅 오늘의 구절</h3>
          ${verseBlock(v, { note: true, schop: true })}
        </article>
        <aside class="panel">
          <h3>🧭 나의 여정</h3>
          <div class="prog-ring"><div class="ring" style="--p:${Math.round(done / PATH.length * 100)}">${done}/${PATH.length}</div>
            <div><b>${next ? `다음: ${next.no}. ${esc(next.title)}` : "여정을 모두 걸었습니다"}</b>
            <p class="lead" style="margin:2px 0 0;font-size:.86rem">한 단계 = 듣기 · 숙고 · 명상.<br>야갸발키야가 마이트레이에게 준 순서 그대로.</p></div></div>
          <div class="row-btns" style="margin-bottom:0"><button class="btn sm" data-go="${next ? "path/" + next.id : "path"}">${next ? "이어서 걷기 →" : "다시 보기"}</button></div>
        </aside>
      </div>

      <h2 class="sec">🚪 위안의 문 <small>지금 마음은 어떤가요? 고르면 그 마음에 닿는 구절을 엽니다</small></h2>
      <div class="moods">${MOODS.map(x => `<button class="mood" data-mood="${x.id}" aria-pressed="${x.id === mood}">${x.emoji} ${esc(x.label)}</button>`).join("")}</div>
      ${m ? `<div class="mood-out">
        <div class="panel"><div class="schop-box" style="margin:0"><b>쇼펜하우어라면 · </b>${esc(m.schop)}</div></div>
        ${m.verses.map(id => `<div class="panel">${verseBlock(V[id], { note: true })}</div>`).join("")}
      </div>` : ""}

      <h2 class="sec">🌙 쇼펜하우어처럼 읽는 법</h2>
      <div class="panel"><ol class="howto">
        <li><b>하루 한 구절.</b> 많이 읽기보다 한 문장을 여러 번. 그는 같은 책을 평생 되풀이해 읽었다.</li>
        <li><b>잠들기 전에.</b> 하루의 소음이 가라앉은 밤, ‘고요히 읽기’로 한 구절과 함께 몇 분 머무르기.</li>
        <li><b>해석은 나중에.</b> 이해하려 애쓰기 전에 먼저 소리 내어 읽고 느낌을 지켜보기.</li>
        <li><b>타인을 보며 확인하기.</b> 낮에 만난 누군가를 떠올리며 ‘그것이 너다’ — 철학은 책상이 아니라 연민에서 완성된다.</li>
      </ol></div>`;
    },

    path(sub) {
      const p = PATH.find(x => x.id === sub);
      if (p) return stageView(p);
      return `
      <h2 class="sec" style="margin-top:6px">🧭 탐구 여정 12단계 <small>${doneCount()}/${PATH.length} 완료</small></h2>
      <p class="lead">“자기를 들어야 하고, 숙고해야 하고, 깊이 명상해야 한다.” (브리하드아란야카 2.4.5)<br>각 단계는 <b>👂 듣기</b>(구절 읽기) · <b>✍️ 숙고</b>(질문에 답 쓰기) · <b>🕯 명상</b>(짧은 머무르기) 세 걸음으로 걷습니다.</p>
      <div class="path">${PATH.map(x => {
        const c = checksOf(x.id), all = c.every(Boolean);
        return `<button class="stage${all ? " done" : ""}" data-go="path/${x.id}">
          <span class="no">${all ? "✓" : x.emoji}</span>
          <span><h3>${x.no}. ${esc(x.title)}</h3><p>${x.verses.map(id => esc(V[id].ref)).join(" · ")}</p>
          <span class="dots">${c.map(b => `<i class="${b ? "on" : ""}"></i>`).join("")}</span></span>
        </button>`;
      }).join("")}</div>`;
    },

    verses() {
      const u = U[vf.upa];
      const chip = (k, val, label, cur) => `<button class="chip" data-${k}="${val}" aria-pressed="${cur === val}">${label}</button>`;
      return `
      <div class="filters">
        <input type="search" id="vq" placeholder="검색 — 소금, 죽음, 새, 그것이 너다" value="${esc(vf.q)}" aria-label="구절 검색">
        <nav class="chips" aria-label="경전">${chip("upa", "all", "모든 경전", vf.upa)}${UPA.filter(x => VERSES.some(v => v.upa === x.id)).map(x => chip("upa", x.id, x.name, vf.upa)).join("")}</nav>
        <nav class="chips" aria-label="주제">${chip("th", "all", "모든 주제", vf.theme)}${Object.entries(THEMES).map(([k, l]) => chip("th", k, l, vf.theme)).join("")}
          <button class="chip" data-marked="1" aria-pressed="${vf.marked}">🔖 책갈피 ${marks.length}</button></nav>
      </div>
      ${u ? `<p class="upa-info"><b>${esc(u.name)} 우파니샤드</b> (${esc(u.sa)}) · ${esc(u.veda)} · ${esc(u.size)}<br>${esc(u.one)}</p>` : ""}
      <div id="vlist">${vlist()}</div>`;
    },

    schop() {
      return `
      <h2 class="sec" style="margin-top:6px">🕯 쇼펜하우어와 우파니샤드</h2>
      <div class="panel">
        <p class="solace">“그것(우프넥하트)은 원전을 빼면 이 세상에서 가능한 가장 보람 있고 가장 마음을 높여 주는 읽을거리다. 그것은 내 삶의 위안이었고, 내 죽음의 위안이 될 것이다.”
          <span class="de">Es ist die belohnendste und erhebendste Lektüre, die (den Urtext ausgenommen) auf der Welt möglich ist: sie ist der Trost meines Lebens gewesen und wird der meines Sterbens sein. — Parerga und Paralipomena II, §185</span></p>
        <p class="lead" style="margin:10px 0 0">비관주의 철학자로 알려진 그가 ‘위안’이라는 말을 쓴 거의 유일한 책. 그에게 우파니샤드는 세계의 고통을 부정하는 위로가 아니라, 고통받는 ‘나’가 전부가 아니라는 것을 보여 주는 위로였다.</p>
      </div>

      <h2 class="sec">📅 한 권의 책이 그에게 오기까지</h2>
      <ol class="tl">${TIMELINE.map(t => `<li class="${/1813|1851/.test(t.y) ? "key" : ""}"><span class="y">${esc(t.y)}</span><h4>${esc(t.t)}</h4><p>${esc(t.d)}</p></li>`).join("")}</ol>
      <p class="lead" style="font-size:.86rem">그가 읽은 것은 산스크리트 원전이 아니라 페르시아어를 거친 라틴어 번역이었다 — 두 번의 번역과 다라 시코의 신비주의적 해석을 지나온 우파니샤드. 그래서 ‘원전을 빼면’이라는 단서를 붙였다.</p>

      <h2 class="sec">🌉 이어지는 곳, 갈라지는 곳 <small>우파니샤드 ↔ 쇼펜하우어</small></h2>
      <div class="bridge">${BRIDGE.map(b => `<div class="br">
        <div class="br-top"><span>${esc(b.upa)}</span><i>⟷</i><span>${esc(b.schop)}</span></div>
        <dl><dt>만남</dt><dd>${esc(b.meet)}</dd><dt>차이</dt><dd>${esc(b.part)}</dd></dl>
      </div>`).join("")}</div>

      <h2 class="sec">🔖 쇼펜하우어가 비춘 구절</h2>
      <div class="vgrid">${VERSES.filter(v => v.schop).map(vcard).join("")}</div>`;
    },

    counsel() {
      const started = table.log.some(m => m.role === "user");
      const hasTalk = table.log.some(m => m.role === "assistant");
      const groups = [["figure", "철학자·위인"], ["persona", "요즘 상담사"]];
      return `
      <section class="cs-hero">
        <h2>💬 마음 상담 테이블</h2>
        <p>오늘 나와 함께 앉은 세 상담사가 내 이야기를 듣고, 서로 생각도 나눠요. 마음에 와닿는 상담사를 눌러 따로 더 물어볼 수 있어요.</p>
      </section>
      ${seatsHTML()}
      <div class="chat" id="chatLog">${chatHTML()}</div>
      <div class="crisis" id="crisis" ${table.log.some(m => m.role === "user" && CRISIS.test(m.content)) ? "" : "hidden"}>
        <b>지금 많이 힘드신가요?</b> 혼자 견디지 않으셔도 돼요. 지금 바로 이야기할 수 있는 곳이 있어요.<br>
        📞 <a href="tel:109">자살예방상담전화 109</a> (24시간) · <a href="tel:15770199">정신건강위기상담 1577-0199</a> · 긴급 시 <a href="tel:112">112</a>·<a href="tel:119">119</a>
      </div>
      <div class="composer">
        <div class="aim">
          ${target ? `<span class="aim-chip">${av(target, "sm")} ${esc(nameOf(target))}에게 질문 <button class="link" data-target-clear aria-label="모두에게로 바꾸기">✕ 모두에게</button></span>`
                   : `<span class="aim-chip all">👥 세 상담사 모두에게</span>`}
          <button class="btn sm" data-discuss ${hasTalk && !busy ? "" : "disabled"} title="상담사들끼리 서로의 생각을 나눕니다">💬 서로 의견 나누기</button>
        </div>
        <form class="chat-form" id="chatForm">
          <textarea id="chatIn" rows="3" maxlength="3000" placeholder="${target ? `${esc(nameOf(target))}에게 묻고 싶은 것을 적어 주세요` : started ? "이어서 이야기해 주세요" : "요즘 마음을 무겁게 하는 일을 편하게 적어 주세요"}" aria-label="상담 내용"></textarea>
          <button class="btn primary" id="chatSend" type="submit" ${busy ? "disabled" : ""}>보내기</button>
        </form>
      </div>
      ${started ? "" : `<div class="examples">${COUNSEL_EXAMPLES.map(x => `<button class="chip" data-ex="${esc(x)}">${esc(x)}</button>`).join("")}</div>`}
      <div class="row-btns">
        <button class="btn sm" data-chat-reset>🎲 다른 상담사들과 새로 앉기</button>
        <button class="btn sm" data-chat-save ${hasTalk ? "" : "disabled"}>📓 노트에 저장</button>
      </div>
      <details class="roster"><summary>상담사 ${COUNSELORS.length}명 둘러보기 <small>새로 앉을 때 이 중 세 명이 무작위로 함께해요</small></summary>
        ${groups.map(([k, label]) => `<h4>${label}</h4><div class="roster-grid">${COUNSELORS.filter(c => c.kind === k).map(c => `
          <div class="rc${table.seats.includes(c.id) ? " on" : ""}">${av(c.id)}<div><b>${esc(c.name)}</b><p>${esc(c.tag)}</p><small>${c.topics.map(esc).join(" · ")}</small></div></div>`).join("")}</div>`).join("")}
      </details>
      <p class="cs-note">상담사는 모두 AI입니다. 철학자·위인 상담사는 그 인물의 알려진 생각을 바탕으로 AI가 연기하는 것이며 본인의 말이 아니고, 요즘 상담사는 실존하지 않는 가상 인물입니다. 입력한 내용은 답변을 만들기 위해 AI 서비스(Anthropic Claude, 연결이 안 되면 Google Gemini)로 전송되며 서버에 저장하지 않습니다(대화는 이 브라우저에만 저장). 이름·연락처 같은 개인정보는 적지 마세요.<br>
      마음을 살피는 도구일 뿐 전문 상담·치료를 대신하지 않습니다. 힘든 마음이 2주 넘게 이어지면 정신건강의학과나 상담센터를 찾아 주세요.</p>`;
    },

    notes() {
      const items = PATH.filter(p => (notes[p.id] || "").trim());
      return `
      <h2 class="sec" style="margin-top:6px">📓 사색 노트 <small>숙고 단계에서 쓴 글이 모입니다</small></h2>
      <div class="row-btns">
        <button class="btn sm" data-export="1" ${items.length || (notes.free || "").trim() ? "" : "disabled"}>⬇ 텍스트로 저장</button>
        <button class="btn sm" data-go="path">🧭 여정으로</button>
      </div>
      ${items.length ? items.map(p => `<div class="note-item">
        <h4>${p.emoji} ${p.no}. ${esc(p.title)} <button class="btn sm" data-go="path/${p.id}" style="margin-left:6px">열기</button></h4>
        <p class="q">${esc(p.question)}</p>
        <p class="body">${esc(notes[p.id])}</p>
      </div>`).join("") : `<p class="empty-note">아직 쓴 노트가 없습니다. 여정의 ✍️ 숙고 단계에서 첫 글을 남겨 보세요.</p>`}
      <h2 class="sec">✒️ 자유 노트</h2>
      <textarea class="note" data-note="free" placeholder="떠오른 생각, 마음에 남은 구절, 오늘 만난 사람…">${esc(notes.free || "")}</textarea>
      <p class="saved" data-saved="free"></p>`;
    }
  };

  function stageView(p) {
    const c = checksOf(p.id), i = PATH.indexOf(p), prev = PATH[i - 1], nxt = PATH[i + 1];
    const chk = n => `<button class="check" data-check="${p.id}:${n}" aria-pressed="${c[n]}">${c[n] ? "✓ 완료" : "완료 표시"}</button>`;
    return `<div class="stage-view">
      <button class="btn sm back" data-go="path">← 여정 목록</button>
      <div class="stage-head"><span class="no">${p.emoji}</span><div><small>${p.no} / ${PATH.length} 단계</small><h2>${esc(p.title)}</h2></div></div>
      <p class="lead">${esc(p.intro)}</p>
      <div class="steps3">
        <section class="step3"><header><h3>👂 듣기<small>śravaṇa · 소리 내어 천천히</small></h3>${chk(0)}</header>
          ${p.verses.map(id => verseBlock(V[id], { note: true })).join("")}
        </section>
        <section class="step3"><header><h3>✍️ 숙고<small>manana · 쇼펜하우어와 함께 생각하기</small></h3>${chk(1)}</header>
          <div class="schop-box" style="margin:0 0 12px"><b>쇼펜하우어 · </b>${esc(p.schop)}</div>
          <p style="margin:0 0 8px"><b>질문</b> ${esc(p.question)}</p>
          <textarea class="note" data-note="${p.id}" placeholder="정답은 없습니다. 떠오르는 대로.">${esc(notes[p.id] || "")}</textarea>
          <p class="saved" data-saved="${p.id}"></p>
        </section>
        <section class="step3"><header><h3>🕯 명상<small>nididhyāsana · ${p.practice.min}분 머무르기</small></h3>${chk(2)}</header>
          <p style="margin:0 0 10px">${esc(p.practice.text)}</p>
          <button class="btn primary" data-practice="${p.id}">🕯 ${p.practice.min}분 머무르기 시작</button>
        </section>
      </div>
      <div class="stage-nav">
        ${prev ? `<button class="btn sm" data-go="path/${prev.id}">← ${prev.no}. ${esc(prev.title)}</button>` : "<span></span>"}
        ${nxt ? `<button class="btn sm" data-go="path/${nxt.id}">${nxt.no}. ${esc(nxt.title)} →</button>` : `<button class="btn sm" data-go="notes">📓 노트 모아 보기 →</button>`}
      </div>
    </div>`;
  }

  // ---------- 렌더·라우팅 ----------
  const route = () => { const [v, sub] = location.hash.slice(1).split("/"); return VIEWS[v] ? [v, sub] : ["home"]; };
  function render() {
    const [v, sub] = route();
    $("#view").innerHTML = VIEWS[v](sub);
    document.querySelectorAll(".ph-tabs a").forEach(a => a.toggleAttribute("aria-current", a.dataset.view === v));
    if (v === "path" && sub) {
      const p = PATH.find(x => x.id === sub);
      if (p) document.title = `${p.no}. ${p.title} · 우파니샤드 산책`;
    } else document.title = "우파니샤드 산책";
  }

  // ---------- 구절 상세 ----------
  function openDetail(id) {
    const v = V[id], u = U[v.upa], st = stageOfVerse(id), mk = marks.includes(id);
    $("#detailBody").innerHTML = `
      <div class="detail-head">
        <button class="ghost icon close" data-close aria-label="닫기">✕</button>
        <span class="ref">${esc(v.ref)}</span>
        <h2 style="font-size:1.05rem;margin:8px 0 0">${esc(u.name)} 우파니샤드 <small style="color:var(--muted);font-weight:400">${esc(u.veda)}</small></h2>
      </div>
      <div class="detail-content">
        <p class="verse-ko">${esc(v.ko)}</p>
        <p class="verse-sa">${esc(v.sa)}</p>
        <p>${esc(v.note)}</p>
        ${v.schop ? `<div class="schop-box"><b>쇼펜하우어와 함께 · </b>${esc(v.schop)}</div>` : ""}
        <div class="vtags">${v.themes.map(t => `<span class="vtag">${esc(THEMES[t])}</span>`).join("")}</div>
        <div class="row-btns">
          <button class="btn primary sm" data-calm-open="${v.id}">🕯 고요히 읽기</button>
          <button class="btn sm" data-mark="${v.id}">${mk ? "🔖 책갈피 해제" : "🔖 책갈피"}</button>
          ${st ? `<button class="btn sm" data-go="path/${st.id}">🧭 여정 ${st.no}단계로</button>` : ""}
        </div>
      </div>`;
    const d = $("#detail");
    if (!d.open) d.showModal();
  }

  // ---------- 고요히 읽기 ----------
  const calm = { id: null, stage: null, mins: 3, left: 0, timer: null, cue: null };
  const MINS = [1, 3, 5, 10];
  function calmPaint() {
    const v = V[calm.id];
    $("#calmRef").textContent = v.ref;
    const lines = v.ko.split("\n");
    $("#calmText").innerHTML = lines.map((l, i) => l.trim()
      ? `<span style="animation-delay:${(i * 0.9).toFixed(1)}s">${esc(l)}</span>` : `<span class="gap"></span>`).join("")
      + (calm.stage ? `<span class="gap"></span><span class="calm-practice" style="animation-delay:${(lines.length * 0.9).toFixed(1)}s">${esc(calm.stage.practice.text)}</span>` : "");
    $("#calmMins").innerHTML = MINS.map(m => `<button data-mins="${m}" aria-pressed="${m === calm.mins}">${m}분</button>`).join("");
    $("#calmGo").textContent = "▶ 머무르기";
    $("#calmGo").classList.remove("running");
  }
  function openCalm(id, stage) {
    calmStop();
    calm.id = id; calm.stage = stage || null;
    calm.mins = stage ? stage.practice.min : 3;
    calmPaint();
    $("#calmCue").textContent = "들이쉬고";
    const d = $("#calm");
    if ($("#detail").open) $("#detail").close();
    if (!d.open) d.showModal();
  }
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  function cueLoop() {
    const t0 = Date.now();
    const tick = () => {
      const s = ((Date.now() - t0) / 1000) % 12;
      $("#calmCue").textContent = s < 4 ? "들이쉬고" : s < 6 ? "머무르고" : "내쉬고";
    };
    tick(); calm.cue = setInterval(tick, 250);
  }
  function calmStart() {
    calm.left = calm.mins * 60;
    $("#calm").classList.add("on");
    $("#calmGo").classList.add("running");
    $("#calmGo").textContent = "⏸ " + fmt(calm.left);
    cueLoop();
    calm.timer = setInterval(() => {
      calm.left--;
      $("#calmGo").textContent = "⏸ " + fmt(calm.left);
      if (calm.left <= 0) calmDone();
    }, 1000);
  }
  function calmStop() {
    clearInterval(calm.timer); clearInterval(calm.cue); calm.timer = calm.cue = null;
    $("#calm").classList.remove("on");
    $("#calmGo").classList.remove("running");
    $("#calmGo").textContent = "▶ 머무르기";
  }
  function chime() {
    try {
      const A = new (window.AudioContext || window.webkitAudioContext)();
      [0, 1.4].forEach(t => {
        const o = A.createOscillator(), g = A.createGain();
        o.type = "sine"; o.frequency.value = t ? 528 : 396;
        g.gain.setValueAtTime(0.0001, A.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.25, A.currentTime + t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + t + 3.5);
        o.connect(g).connect(A.destination); o.start(A.currentTime + t); o.stop(A.currentTime + t + 3.6);
      });
    } catch {}
  }
  function calmDone() {
    calmStop(); chime();
    $("#calmCue").textContent = "고요가 함께하기를 · 샨티 샨티 샨티";
    $("#calm").classList.add("on");
    $("#calmGo").textContent = "✓ 마쳤습니다";
    if (calm.stage) { setCheck(calm.stage.id, 2, true); render(); }
  }

  // ---------- 이벤트 ----------
  document.addEventListener("click", e => {
    const t = e.target;
    const go = t.closest("[data-go]");
    if (go) { if ($("#detail").open) $("#detail").close(); location.hash = go.dataset.go; return; }
    const co = t.closest("[data-calm-open]");
    if (co) { openCalm(co.dataset.calmOpen); return; }
    const pr = t.closest("[data-practice]");
    if (pr) { const p = PATH.find(x => x.id === pr.dataset.practice); openCalm(p.verses[0], p); return; }
    const vb = t.closest("[data-verse]");
    if (vb) { openDetail(vb.dataset.verse); return; }
    if (t.closest("[data-close]")) { $("#detail").close(); return; }
    const mk = t.closest("[data-mark]");
    if (mk) {
      const id = mk.dataset.mark;
      marks = marks.includes(id) ? marks.filter(x => x !== id) : [...marks, id];
      store.set(MARK_KEY, marks); openDetail(id); render(); return;
    }
    const md = t.closest("[data-mood]");
    if (md) { mood = mood === md.dataset.mood ? null : md.dataset.mood; render(); return; }
    const up = t.closest("[data-upa]");
    if (up) { vf.upa = up.dataset.upa; render(); return; }
    const th = t.closest("[data-th]");
    if (th) { vf.theme = th.dataset.th; render(); return; }
    if (t.closest("[data-marked]")) { vf.marked = !vf.marked; render(); return; }
    const ck = t.closest("[data-check]");
    if (ck) { const [id, n] = ck.dataset.check.split(":"); setCheck(id, +n, !checksOf(id)[+n]); render(); return; }
    if (t.closest("[data-export]")) { exportNotes(); return; }
    const ex = t.closest("[data-ex]");
    if (ex) { sendCounsel(ex.dataset.ex); return; }
    const tg = t.closest("[data-target]");
    if (tg) {
      target = target === tg.dataset.target && tg.classList.contains("seat") ? null : tg.dataset.target;
      render(); $("#chatIn")?.focus(); return;
    }
    if (t.closest("[data-target-clear]")) { target = null; render(); $("#chatIn")?.focus(); return; }
    const mo = t.closest("[data-more]");
    if (mo) { target = mo.dataset.more; sendCounsel(`${nameOf(target)}님 이야기를 조금 더 자세히 듣고 싶어요.`, target); return; }
    if (t.closest("[data-discuss]")) { discussCounsel(); return; }
    if (t.closest("[data-chat-retry]")) { if (!busy && lastReq) askCounsel(lastReq.mode, lastReq.target); return; }
    if (t.closest("[data-chat-reset]")) {
      if (table.log.length && !confirm("지금 테이블의 대화를 지우고 다른 상담사들과 새로 앉을까요? (노트에 저장한 내용은 남습니다)")) return;
      table = { seats: pickSeats(), log: [] }; target = null; chatErr = ""; lastReq = null; saveTable(); render(); return;
    }
    if (t.closest("[data-chat-save]")) { saveCounselToNote(); t.closest("[data-chat-save]").textContent = "✓ 노트에 저장됨"; return; }
    // 고요히 읽기 안
    const mi = t.closest("[data-mins]");
    if (mi) { calm.mins = +mi.dataset.mins; calmStop(); calmPaint(); return; }
    const ca = t.closest("[data-calm]");
    if (ca) {
      const a = ca.dataset.calm;
      if (a === "close") { calmStop(); $("#calm").close(); }
      else if (a === "toggle") { calm.timer ? calmStop() : calmStart(); }
      else if (a === "next") {
        const pool = calm.stage ? calm.stage.verses : VERSES.map(v => v.id);
        const i = pool.indexOf(calm.id);
        calm.id = pool[(i + 1 + (calm.stage ? 0 : Math.floor(Math.random() * (pool.length - 1)))) % pool.length];
        calmStop(); calmPaint();
      }
    }
  });
  document.addEventListener("submit", e => {
    if (e.target.id !== "chatForm") return;
    e.preventDefault(); sendCounsel($("#chatIn").value);
  });
  document.addEventListener("keydown", e => {
    if (e.target.id === "chatIn" && e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendCounsel(e.target.value); }
  });
  $("#detail").addEventListener("click", e => { if (e.target === $("#detail")) $("#detail").close(); });
  $("#calm").addEventListener("close", calmStop);

  let saveT = null;
  document.addEventListener("input", e => {
    if (e.target.id === "vq") {
      vf.q = e.target.value;
      $("#vlist").innerHTML = vlist();
      return;
    }
    const n = e.target.dataset.note;
    if (!n) return;
    notes[n] = e.target.value;
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      store.set(NOTE_KEY, notes);
      const s = document.querySelector(`[data-saved="${n}"]`);
      if (s) s.textContent = "저장됨 · " + new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
      if (n !== "free") {
        const has = notes[n].trim().length >= 10;
        if (has && !checksOf(n)[1]) {
          setCheck(n, 1, true);
          const b = document.querySelector(`[data-check="${n}:1"]`);
          if (b) { b.setAttribute("aria-pressed", "true"); b.textContent = "✓ 완료"; }
        }
      }
    }, 500);
  });

  function exportNotes() {
    const d = new Date(), ymd = d.toISOString().slice(0, 10).replace(/-/g, "");
    const parts = PATH.filter(p => (notes[p.id] || "").trim()).map(p => `■ ${p.no}. ${p.title}\n질문: ${p.question}\n\n${notes[p.id].trim()}\n`);
    if ((notes.free || "").trim()) parts.push(`■ 자유 노트\n\n${notes.free.trim()}\n`);
    const txt = `우파니샤드 산책 — 사색 노트 (${d.toLocaleDateString("ko-KR")})\n\n` + parts.join("\n────────\n\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain;charset=utf-8" }));
    a.download = `우파니샤드_노트_${ymd}.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

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
  render();
})();
