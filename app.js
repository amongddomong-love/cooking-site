(() => {
  const FAV_KEY = "cooking.favorites";
  const THEME_KEY = "cooking.theme";
  const CATEGORIES = ["전체", "즐겨찾기", ...new Set(RECIPES.map(r => r.category))];

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
    const hay = [r.title, r.desc, r.category, ...r.ingredients.map(i => i.name)].join(" ").toLowerCase();
    return q.toLowerCase().split(/\s+/).every(word => hay.includes(word));
  }

  function renderChips() {
    chips.innerHTML = CATEGORIES.map(c =>
      `<button class="chip" aria-pressed="${c === activeCategory}" data-cat="${escapeHtml(c)}">${c === "즐겨찾기" ? "❤️ " : ""}${escapeHtml(c)}</button>`
    ).join("");
  }

  function renderGrid() {
    const q = search.value.trim();
    const list = RECIPES.filter(r =>
      (activeCategory === "전체" || (activeCategory === "즐겨찾기" ? favorites.has(r.id) : r.category === activeCategory)) && matches(r, q)
    );
    count.textContent = `레시피 ${list.length}개`;
    empty.hidden = list.length > 0;
    grid.innerHTML = list.map(r => `
      <div class="card" role="button" tabindex="0" data-id="${r.id}">
        <div class="card-thumb" aria-hidden="true">${r.emoji}</div>
        <div class="card-body">
          <h3>${escapeHtml(r.title)}</h3>
          <p>${escapeHtml(r.desc)}</p>
          <div class="meta"><span>⏱ ${r.time}분</span><span>📶 ${r.level}</span><span>👥 ${r.servings}인분</span></div>
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
      return `<li><span>${escapeHtml(i.name)}</span><span class="amt">${escapeHtml(amt)}</span></li>`;
    }).join("");

    detailBody.innerHTML = `
      <div class="detail-head">
        <button class="ghost icon close" aria-label="닫기">✕</button>
        <div class="emoji" aria-hidden="true">${r.emoji}</div>
        <h2>${escapeHtml(r.title)}</h2>
        <p>${escapeHtml(r.desc)}</p>
        <div class="meta" style="margin-top:8px"><span>⏱ ${r.time}분</span><span>📶 ${r.level}</span><span>🏷 ${escapeHtml(r.category)}</span></div>
      </div>
      <div class="detail-content">
        <h3>재료
          <span class="servings" style="float:right;font-weight:400">
            <button data-s="-1" aria-label="인분 줄이기">−</button>
            <span id="servingsLabel">${servings}인분</span>
            <button data-s="1" aria-label="인분 늘리기">＋</button>
          </span>
        </h3>
        <ul class="ing-list" id="ingList">${ingHtml()}</ul>
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

    dialog.showModal();
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
  search.addEventListener("input", renderGrid);
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
  renderChips();
  renderGrid();
})();
