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
    const hay = [r.title, r.desc, r.category, r.chef || "", ...r.ingredients.map(i => i.name)].join(" ").toLowerCase();
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
        <div class="card-photo">
          ${r.img ? `<img src="${r.img}" alt="${escapeHtml(r.title)}" loading="lazy" onerror="this.remove()">` : ""}
          <span class="emoji-fallback" aria-hidden="true">${r.img ? "" : r.emoji}</span>
          <span class="cat-badge">${escapeHtml(r.category)}</span>
          ${r.chef ? `<span class="chef">👨‍🍳 ${escapeHtml(r.chef)}</span>` : ""}
        </div>
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
          <div class="meta"><span>⏱ ${r.time}분</span><span>📶 ${r.level}</span><span>🏷 ${escapeHtml(r.category)}</span></div>
        </div>
      </div>
      <div class="detail-content">
        ${r.source ? `<p class="src">👨‍🍳 ${escapeHtml(r.chef || "")} · <a href="${escapeHtml(r.source.url)}" target="_blank" rel="noopener">${escapeHtml(r.source.title)}</a></p>` : ""}
        <p class="lead">${escapeHtml(r.desc)}</p>
        <h3>재료
          <span class="servings" style="float:right;font-weight:400">
            <button data-s="-1" aria-label="인분 줄이기">−</button>
            <span id="servingsLabel">${servings}인분</span>
            <button data-s="1" aria-label="인분 늘리기">＋</button>
          </span>
        </h3>
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
    search.placeholder = m === "market" ? "예: 대파, 두부, 돼지" : "예: 김치, 달걀, 백종원";
    if (m === "market") renderMarket();
  }
  document.querySelector(".mode").addEventListener("click", e => {
    const b = e.target.closest("[data-mode]");
    if (b) { setMode(b.dataset.mode); history.replaceState(null, "", b.dataset.mode === "market" ? "#market" : location.pathname); }
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
  search.addEventListener("input", () => mode === "market" ? renderMarket() : renderGrid());
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
  if (location.hash === "#market") setMode("market");
})();
