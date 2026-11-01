/* Arze Media — site behaviour. All content comes from js/config.js */
(() => {
  "use strict";
  const C = window.ARZE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const money = (n) => "$" + Math.round(n).toLocaleString("en-CA");
  const get = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), C);
  const vid = (name) => `assets/video/${name}.mp4`;
  const poster = (name) => `assets/video/${name}.webp`;
  const waLink = (msg) => `https://wa.me/${C.contact.whatsapp}?text=${encodeURIComponent(msg || C.whatsappMessage)}`;
  let setBa = () => {};
  const pkgById = (id) => C.packages.find((p) => p.id === id) || C.packages[0];

  /* ---------- Copy + links ---------- */
  $$("[data-copy]").forEach((el) => { const v = get(el.dataset.copy); if (v != null) el.textContent = v; });
  const setWa = (el, msg) => { el.href = waLink(msg); el.target = "_blank"; el.rel = "noopener"; };
  $$("[data-wa]").forEach((el) => setWa(el));
  $("#year").textContent = new Date().getFullYear();
  const page = document.body.dataset.page || "home";
  const has = (s) => !!document.querySelector(s);
  $$("[data-mail]").forEach((el) => { el.href = "mailto:" + C.contact.email; });
  if (!C.contact.formEndpoint && has("#fSubmit")) { ($("#fSubmitTxt") || $("#fSubmit")).textContent = "Send on WhatsApp"; $("#formNote").textContent = "Opens WhatsApp with your details filled in."; }
  $$("[data-count]").forEach((el) => { const v = get(el.dataset.count); if (Array.isArray(v)) el.textContent = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"][v.length] || v.length; });

  const title = $("#heroTitle");
  if (title) {
  title.innerHTML = C.hero.title.map((t) => `<span class="line"><span>${t}</span></span>`).join("");
  title.setAttribute("aria-label", C.hero.title.join(" "));
  }

  if (has("#heroProof")) {
    const ini = (n) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    $("#heroProof").innerHTML = `<span class="hp__marks" aria-hidden="true">${C.clients.map((n, i) => `<span class="hp__m hp__m--${i % 4}">${ini(n)}</span>`).join("")}</span><span class="hp__txt">${C.hero.proof}</span>`;
    $("#heroProof").setAttribute("aria-label", `${C.hero.proof}: ${C.clients.join(", ")}`);
  }

  const social = $("#social");
  if (social) {
  const socials = [["Instagram", C.contact.instagram], ["TikTok", C.contact.tiktok]].filter(([, u]) => u);
  if (socials.length) social.innerHTML = socials.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join(" · ");
  else social.remove();
  }

  /* ---------- Nav ---------- */
  const nav = $("#nav");
  const burger = $("#burger");
  const drawer = $("#drawer");
  const fab = $(".fab");
  const setDrawer = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    drawer.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
    ["main", "footer", ".fab"].forEach((s) => { const n = $(s); if (n) n.inert = open; });
    if (open) $("#drawer a").focus(); else burger.focus({ preventScroll: true });
  };
  burger.addEventListener("click", () => setDrawer(drawer.hidden));
  $$("#drawer a").forEach((a) => a.addEventListener("click", () => { burger.setAttribute("aria-expanded", "false"); drawer.hidden = true; document.body.style.overflow = ""; ["main", "footer", ".fab"].forEach((s) => { const n = $(s); if (n) n.inert = false; }); }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) setDrawer(false); });

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-solid", y > 40 || page !== "home");
    const ctEl = $("#contact, .faq__back");
    const ct = ctEl ? ctEl.getBoundingClientRect() : { top: 1e9, bottom: -1 };
    const ft = $(".foot"), footIn = ft && ft.getBoundingClientRect().top < window.innerHeight;
    fab.classList.toggle("is-on", page !== "contact" && !footIn && (y > window.innerHeight * 0.7 || page !== "home") && !(ct.top < window.innerHeight && ct.bottom > 0));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (page === "home") {
    const navLinks = $$(".nav__links a");
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["top", "proof", "cut", "contact", "work", "how", "menu", "math"].forEach((id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Lazy videos ---------- */
  const loadVideo = (v) => { if (v.dataset.src && !v.src) { v.src = v.dataset.src; v.load(); } };
  const safePlay = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };

  const bg = $(".hero__bgvid");
  if (bg && !reduce && window.innerWidth > 640) { loadVideo(bg); safePlay(bg); }

  /* ---------- Phones: moving wall of reels behind the hero ---------- */
  const heroWall = $("#heroWall");
  if (heroWall) { // built always; CSS shows it only below 960px
    const pool = [...new Set([...C.formats.map((f) => f.src), ...C.reels.map((r) => r.src)])];
    const col = (k) => { const items = pool.filter((_, i) => i % 4 === k); return [...items, ...items].map((n, i) => `<div class="hw__tile">${i === 1 && (k === 1 || k === 2) ? `<video muted loop playsinline preload="none" data-src="${vid(n)}" poster="${poster(n)}"></video>` : `<img src="${poster(n)}" alt="" loading="lazy">`}</div>`).join(""); };
    heroWall.innerHTML = [0, 1, 2, 3].map((k) => `<div class="hw__col hw__col--${k}">${col(k)}</div>`).join("");
    const mqWall = window.matchMedia("(max-width: 959px)");
    const wallVids = () => { if (!reduce && mqWall.matches) $$("video", heroWall).forEach((v) => { loadVideo(v); safePlay(v); }); };
    setTimeout(wallVids, 600); mqWall.addEventListener("change", wallVids);
  }

  /* ---------- Phone reels ---------- */
  if (has("#phone")) {
  const track = $("#phoneTrack");
  const bars = $("#phoneBars");
  const count = $("#phoneCount");
  const hint = $("#phoneHint");
  const reels = C.reels;
  let idx = 0, muted = true, paused = false, phoneVisible = true, timer = null, startedAt = 0;
  const HOLD = 7000;

  track.innerHTML = reels.map((r, i) => `
    <article class="reel" style="top:${i * 100}%" aria-label="Reel ${i + 1} of ${reels.length}: ${r.caption}">
      <img class="poster" src="${poster(r.src)}" alt="" ${i > 1 ? 'loading="lazy"' : ""}>
      <video muted playsinline loop preload="none" data-src="${vid(r.src)}" poster="${poster(r.src)}"></video>
      <svg class="reel__burst" aria-hidden="true"><use href="#i-heart"/></svg>
      <div class="reel__rail" aria-hidden="true">
        <span class="reel__avatar"></span>
        <span class="heart"><svg class="ico"><use href="#i-heart"/></svg>Like</span>
        <span><svg class="ico"><use href="#i-chat"/></svg>Chat</span>
        <span><svg class="ico"><use href="#i-save"/></svg>Save</span>
        <span><svg class="ico"><use href="#i-share"/></svg>Share</span>
      </div>
      <div class="reel__meta">
        <div class="reel__handle">${r.handle} <i>Sample</i></div>
        <p class="reel__cap">${r.caption}</p>
        <p class="reel__sound"><svg class="ico"><use href="#i-note"/></svg>${r.sound}</p>
      </div>
    </article>`).join("");
  bars.innerHTML = reels.map(() => "<span><i></i></span>").join("");
  const slides = $$(".reel", track);
  const barEls = $$("span", bars);

  const setBars = () => barEls.forEach((b, i) => { b.classList.toggle("done", i < idx); if (i !== idx) b.firstChild.style.width = i < idx ? "100%" : "0"; });

  const playActive = () => {
    slides.forEach((s, i) => {
      const v = $("video", s);
      if (i === idx) {
        loadVideo(v); v.muted = muted;
        if (!paused && phoneVisible) safePlay(v); else v.pause();
      } else { v.pause(); }
      if (i === idx + 1) loadVideo($("video", s)); // preload next
    });
  };

  const tick = () => {
    if (!paused && phoneVisible && !reduce) {
      const p = Math.min(1, (performance.now() - startedAt) / HOLD);
      barEls[idx].firstChild.style.width = (p * 100) + "%";
      if (p >= 1) { go(idx + 1); return; }
    }
    timer = requestAnimationFrame(tick);
  };

  function go(n, user = false) {
    idx = (n + reels.length) % reels.length;
    track.style.transform = `translateY(${-idx * 100}%)`;
    count.textContent = `${idx + 1} / ${reels.length}`;
    startedAt = performance.now();
    setBars(); playActive();
    cancelAnimationFrame(timer); timer = requestAnimationFrame(tick);
    if (user) hint.classList.add("is-gone");
  }

  $("#phoneNext").addEventListener("click", () => go(idx + 1, true));
  $("#phonePrev").addEventListener("click", () => go(idx - 1, true));
  const phone = $("#phone");
  phone.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); go(idx + 1, true); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1, true); }
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); togglePause(); }
  });
  const togglePause = () => {
    paused = !paused;
    $("#phonePaused").classList.toggle("is-on", paused);
    if (!paused) startedAt = performance.now() - (parseFloat(barEls[idx].firstChild.style.width) || 0) / 100 * HOLD;
    playActive();
  };
  const like = () => {
    const s = slides[idx];
    const burst = $(".reel__burst", s); burst.classList.remove("go"); void burst.offsetWidth; burst.classList.add("go");
    $(".heart", s).classList.add("is-on");
  };

  // Drag / swipe (pointer events). Vertical swipe changes reel, tap pauses, double tap likes.
  let sy = 0, sx = 0, dy = 0, dx = 0, dragging = false, moved = false, lastTap = 0, ptype = "mouse";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse) $("#hintTxt").textContent = "Swipe sideways";
  const screenH = () => $("#phoneScreen").clientHeight;
  phone.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    dragging = true; moved = false; sy = e.clientY; sx = e.clientX; dy = 0; dx = 0; ptype = e.pointerType;
    if (ptype === "mouse") { track.classList.add("is-dragging"); try { phone.setPointerCapture(e.pointerId); } catch (_) {} }
  });
  phone.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    dy = e.clientY - sy; dx = e.clientX - sx;
    if (Math.abs(dy) > 6 || Math.abs(dx) > 6) moved = true;
    if (ptype === "mouse") track.style.transform = `translateY(${-idx * 100 + (dy / screenH()) * 100}%)`;
  });
  const end = () => {
    if (!dragging) return;
    dragging = false; track.classList.remove("is-dragging");
    const th = screenH() * 0.16;
    const horiz = ptype !== "mouse" && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2;
    if (horiz) go(dx < 0 ? idx + 1 : idx - 1, true);
    else if (ptype === "mouse" && dy < -th) go(idx + 1, true);
    else if (ptype === "mouse" && dy > th) go(idx - 1, true);
    else {
      track.style.transform = `translateY(${-idx * 100}%)`;
      if (!moved) {
        const now = Date.now();
        if (now - lastTap < 300) { like(); lastTap = 0; }
        else { lastTap = now; setTimeout(() => { if (lastTap === now) togglePause(); }, 300); }
      }
    }
  };
  phone.addEventListener("pointerup", end);
  phone.addEventListener("pointercancel", () => { moved = true; end(); });

  new IntersectionObserver(([en]) => { phoneVisible = en.isIntersecting; playActive(); if (phoneVisible) startedAt = performance.now() - (parseFloat(barEls[idx].firstChild.style.width) || 0) / 100 * HOLD; }, { threshold: 0.25 }).observe(phone);
  go(0);
  }

  /* ---------- Video wall ---------- */
  if (has("#wall")) {
  const wall = $("#wall");
  wall.innerHTML = C.formats.map((f, i) => `
    <button class="tile${i % 2 === 1 ? " col-shift" : ""}" type="button" data-src="${f.src}" data-name="${f.name}" aria-label="Play ${f.name}">
      <img src="${poster(f.src)}" alt="" loading="lazy">
      <video muted playsinline loop preload="none" data-src="${vid(f.src)}"></video>
      <span class="tile__rec"><span class="rec"></span>REC</span>
      <span class="tile__play" aria-hidden="true"><svg class="ico"><use href="#i-play"/></svg></span>
      <span class="tile__txt"><span class="tile__name">${f.name}</span><span class="tile__note">${f.note}</span></span>
    </button>`).join("");
  if (!reduce) {
    const wallIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = $("video", en.target);
        if (en.isIntersecting) { loadVideo(v); safePlay(v); } else v.pause();
      });
    }, { threshold: 0.6 });
    $$(".tile", wall).forEach((t) => wallIO.observe(t));
  }

  // Lightbox
  const lb = $("#lightbox"), lbV = $("#lbVideo"), lbCap = $("#lbCap");
  let lastFocus = null;
  const openLb = (src, name) => {
    lastFocus = document.activeElement;
    lbV.src = vid(src); lbV.poster = poster(src); lbV.muted = false; lbCap.textContent = name;
    lb.hidden = false; document.body.style.overflow = "hidden";
    safePlay(lbV); $("#lbClose").focus();
  };
  const closeLb = () => { lbV.pause(); lbV.removeAttribute("src"); lbV.load(); lb.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
  wall.addEventListener("click", (e) => { const t = e.target.closest(".tile"); if (t) openLb(t.dataset.src, t.dataset.name); });
  $("#lbClose").addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "Tab") { e.preventDefault(); (document.activeElement === lbV ? $("#lbClose") : lbV).focus(); }
  });
  }

  /* ---------- Before / After ---------- */
  if (has("#ba")) {
  const ba = $("#ba"), baH = $("#baHandle");
  let baPos = 50;
  setBa = (p) => { baPos = Math.max(0, Math.min(100, p)); ba.style.setProperty("--pos", baPos + "%"); baH.setAttribute("aria-valuenow", Math.round(baPos)); baH.setAttribute("aria-valuetext", `${Math.round(baPos)}% before`); };
  const fromX = (x) => { const r = ba.getBoundingClientRect(); return ((x - r.left) / r.width) * 100; };
  let baDrag = false;
  ba.addEventListener("pointerdown", (e) => { baDrag = true; try { ba.setPointerCapture(e.pointerId); } catch (_) {} setBa(fromX(e.clientX)); });
  ba.addEventListener("pointermove", (e) => { if (baDrag) setBa(fromX(e.clientX)); });
  ba.addEventListener("pointerup", () => (baDrag = false));
  ba.addEventListener("pointercancel", () => (baDrag = false));
  baH.addEventListener("keydown", (e) => {
    const k = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, Home: -100, End: 100 }[e.key];
    if (k != null) { e.preventDefault(); setBa(baPos + k); }
  });
  setBa(50);
  }

  /* ---------- How it works ---------- */
  if (has("#howTrack")) {
  const howTrack = $("#howTrack");
  howTrack.innerHTML = C.steps.map((s, i) => `
    <article class="step">
      <img src="assets/img/${s.img}-sm.webp" alt="" loading="lazy">
      <div class="step__body">
        <div class="step__n" aria-hidden="true">0${i + 1}</div>
        <h3 class="step__t">${s.title}</h3>
        <p class="step__p">${s.text}</p>
      </div>
    </article>`).join("");
  const dots = $("#howDots");
  dots.innerHTML = C.steps.map(() => "<span></span>").join("");
  const dotEls = $$("span", dots);
  const updDots = () => {
    const steps = $$(".step", howTrack);
    const mid = howTrack.scrollLeft + howTrack.clientWidth / 2;
    let best = 0, bd = Infinity;
    steps.forEach((s, i) => { const c = s.offsetLeft + s.offsetWidth / 2; const d = Math.abs(c - mid); if (d < bd) { bd = d; best = i; } });
    dotEls.forEach((d, i) => d.classList.toggle("is-on", i === best));
  };
  howTrack.addEventListener("scroll", updDots, { passive: true });
  updDots();
  }

  /* ---------- Menu board ---------- */
  if (has("#menuList")) {
  const list = $("#menuList"), detail = $("#menuDetail");
  const detailHTML = (p) => {
    const each = p.price / p.count;
    const msg = `Hi Arze Media! I'd like ${p.name} (${p.count} video${p.count > 1 ? "s" : ""}${p.billing === "per month" ? " a month" : ""}) for my restaurant. Can we talk?`;
    return `
      <div class="detail">
        <div class="detail__top">
          <div class="detail__media"><img src="${poster(p.preview)}" alt=""><video muted playsinline loop preload="none" data-src="${vid(p.preview)}"></video></div>
          <div>
            <div class="detail__count">${p.count}<small>video${p.count > 1 ? "s" : ""} ${p.billing === "per month" ? "a month" : "one-time"}</small></div>
            <p class="detail__tag">${p.tagline}</p>
            <p class="detail__each">${money(each)} per video</p>
          </div>
        </div>
        <ul>${p.includes.map((t) => `<li><svg class="ico" aria-hidden="true"><use href="#i-check"/></svg>${t}</li>`).join("")}</ul>
        <a class="btn btn--rosa btn--lg btn--block" href="${waLink(msg)}" target="_blank" rel="noopener"><svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg>Order this on WhatsApp</a>
      </div>`;
  };
  list.innerHTML = C.packages.map((p) => `
    <li class="dish" role="presentation">
      <button class="dish__btn" role="tab" id="tab-${p.id}" aria-selected="false" tabindex="-1" aria-controls="menuDetail" data-id="${p.id}">
        <span class="dish__row"><span class="dish__name">${p.name}</span><span class="dish__leader"></span><span class="dish__price">${money(p.price)}<small>${p.billing === "per month" ? "/mo" : "/video"}</small></span></span>
        <span class="dish__sub"><span>${p.count} video${p.count > 1 ? "s" : ""}${p.billing === "per month" ? " a month" : ""}</span>${p.featured ? '<span class="dish__tag">House favourite</span>' : ""}</span>
      </button>
      <div class="dish__panel" hidden></div>
    </li>`).join("");
  const mqDesk = window.matchMedia("(min-width: 900px)");
  const playIn = (root) => { const v = $("video", root); if (v && !reduce) { loadVideo(v); safePlay(v); } };
  const selectDish = (id, focus = false) => {
    const p = pkgById(id);
    $$(".dish__btn", list).forEach((b) => { const on = b.dataset.id === p.id; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
    $$(".dish__panel", list).forEach((pnl) => { pnl.hidden = true; pnl.innerHTML = ""; });
    if (mqDesk.matches) {
      detail.innerHTML = detailHTML(p); detail.setAttribute("aria-labelledby", "tab-" + p.id); playIn(detail);
    } else {
      detail.innerHTML = "";
      const pnl = $(`#tab-${p.id}`).nextElementSibling;
      pnl.innerHTML = detailHTML(p); pnl.hidden = false; playIn(pnl);
    }
    if (focus) $(`#tab-${p.id}`).focus();
  };
  let currentDish = (C.packages.find((p) => p.featured) || C.packages[0]).id;
  list.addEventListener("click", (e) => {
    const b = e.target.closest(".dish__btn"); if (!b) return;
    if (!mqDesk.matches && b.getAttribute("aria-selected") === "true") { // tap again to collapse on mobile
      b.setAttribute("aria-selected", "false"); const pnl = b.nextElementSibling; pnl.hidden = true; pnl.innerHTML = ""; return;
    }
    currentDish = b.dataset.id; selectDish(currentDish);
  });
  list.addEventListener("keydown", (e) => {
    const ids = C.packages.map((p) => p.id); const i = ids.indexOf(currentDish);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); currentDish = ids[(i + 1) % ids.length]; selectDish(currentDish, true); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); currentDish = ids[(i - 1 + ids.length) % ids.length]; selectDish(currentDish, true); }
  });
  selectDish(currentDish);
  mqDesk.addEventListener("change", () => selectDish(currentDish));
  }

  /* ---------- Simulator ---------- */
  if (has("#simPkgs")) {
  const S = { ticket: C.simulator.ticket, margin: C.simulator.margin, pkg: C.simulator.package };
  const chips = $("#simPkgs");
  chips.innerHTML = C.packages.map((p) => `<button type="button" class="chip" data-id="${p.id}" aria-pressed="false">${p.name}<span>${money(p.price)}</span></button>`).join("");
  const tR = $("#simTicket"), tN = $("#simTicketN"), mR = $("#simMargin"), mN = $("#simMarginN");
  const big = $("#simBig"), plates = $("#simPlates"), formula = $("#simFormula");
  let shown = 0; const numState = { v: 0 };
  const fill = (r) => r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min)) * 100 + "%");
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const animateNum = (to) => {
    if (reduce || !hasGsap) { big.textContent = to; shown = to; return; }
    gsap.killTweensOf(numState);
    const o = numState; o.v = shown;
    gsap.to(o, { v: to, duration: 0.5, ease: "power2.out", onUpdate: () => (big.textContent = Math.round(o.v)) });
    shown = to;
    setTimeout(() => { if (shown === to) big.textContent = to; }, 700); // in case animation frames are paused
  };
  const calc = () => {
    const p = pkgById(S.pkg);
    const profit = S.ticket * (S.margin / 100);
    const need = Math.max(1, Math.ceil(Math.round(p.price * 10000) / Math.round(S.ticket * S.margin * 100) - 1e-9));
    const perWeek = need / 4.33;
    const pv = (need / p.count).toFixed(need / p.count < 10 ? 1 : 0).replace(/\.0$/, "");
    animateNum(need);
    $("#simMini").textContent = need;
    if (p.billing === "per month") {
      $("#simLabel").innerHTML = "New customers per month to cover&nbsp;it";
      $("#simWeekLine").innerHTML = `That's about <b id="simWeek">${perWeek < 1 ? "less than 1" : perWeek.toFixed(perWeek < 10 ? 1 : 0).replace(/\.0$/, "")}</b> a week, or <b id="simPerVideo">${pv}</b> per video.`;
    } else {
      $("#simLabel").innerHTML = "New customers to cover&nbsp;it";
      $("#simWeekLine").innerHTML = `One-time cost. That's <b id="simPerVideo">${pv}</b> customer${pv === "1" ? "" : "s"} for the video, once.`;
    }
    const shownPlates = Math.min(need, 48);
    plates.innerHTML = Array.from({ length: shownPlates }, (_, i) => `<svg class="ico" style="animation-delay:${Math.min(i * 12, 400)}ms"><use href="#i-plate"/></svg>`).join("") + (need > 48 ? `<span class="more">+${need - 48}</span>` : "");
    formula.innerHTML = `${p.name}: ${money(p.price)} ÷ (${money(S.ticket)} spend × ${S.margin}% kept after food cost = $${profit.toFixed(2)} per customer) = <b>${need}</b> customers.<br>Assumes each new customer visits once. Regulars make the real money.`;
    $$(".chip", chips).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.id === S.pkg)));
  };
  const syncT = (v) => { S.ticket = clamp(Math.round(+v || 0), 5, 150); tR.value = S.ticket; tN.value = S.ticket; fill(tR); calc(); };
  const syncM = (v) => { S.margin = clamp(Math.round(+v || 0), 5, 90); mR.value = S.margin; mN.value = S.margin; fill(mR); calc(); };
  tR.addEventListener("input", () => syncT(tR.value));
  mR.addEventListener("input", () => syncM(mR.value));
  tN.addEventListener("change", () => syncT(tN.value));
  mN.addEventListener("change", () => syncM(mN.value));
  tN.addEventListener("input", () => { if (tN.value !== "" && +tN.value >= 5 && +tN.value <= 150) syncT(tN.value); });
  mN.addEventListener("input", () => { if (mN.value !== "" && +mN.value >= 5 && +mN.value <= 90) syncM(mN.value); });
  chips.addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) { S.pkg = c.dataset.id; calc(); } });
  syncT(S.ticket); syncM(S.margin);
  const simHow = $("#simHow"); if (simHow && window.matchMedia("(min-width: 900px)").matches) simHow.open = true;
  }

  /* ---------- Clients + testimonials (home) ---------- */
  if (has("#logosTrack")) {
    const initials = (n) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const logo = (n, i) => `<li class="lg lg--${i % 3}"><span class="lg__mark">${initials(n)}</span><span class="lg__name">${n}</span></li>`;
    const set = [...C.clients, ...C.clients, ...C.clients].map(logo).join("");
    $("#logosTrack").innerHTML = set + set.replace(/<li /g, '<li aria-hidden="true" ');
    const card = (t) => `<figure class="tq"><img src="assets/img/${t.img}.webp" alt="" width="56" height="56" loading="lazy"><blockquote>${t.quote}</blockquote><figcaption><b>${t.name}</b> · ${t.role}${t.sample ? ' <i class="tq__sample">Sample</i>' : ""}</figcaption></figure>`;
    const qs = [...C.testimonials, ...C.testimonials].map(card).join("");
    $("#quotesTrack").innerHTML = qs + qs.replace(/<figure /g, '<figure aria-hidden="true" ');
  }

  /* ---------- FAQ ---------- */
  if (has("#faqList")) {
  const two = (n) => String(n).padStart(2, "0");
  $("#faqList").innerHTML = C.faq.map((f, i) => `<details class="qa" data-i="${i}" style="--acc: var(${i % 2 ? "--rosa" : "--maiz"})"${i === 0 ? " open" : ""}><summary><span class="qa__n">${two(i + 1)}</span><span class="qa__q">${f.q}</span></summary><p>${f.a}</p></details>`).join("");
  const scr = $(".fq__screen");
  const fqVids = scr ? $$("video", scr) : [];
  let fqCur = 0, fqIdx = -1;
  const fqShow = (i) => {
    if (!scr || !scr.offsetParent || i === fqIdx) return; // hidden on phones, or already showing
    fqIdx = i;
    const f = C.faq[i], next = fqVids[1 - fqCur], prev = fqVids[fqCur];
    if (!f.clip) return;
    next.poster = poster(f.clip);
    if (!reduce) { next.src = vid(f.clip); safePlay(next); }
    next.classList.add("is-on"); prev.classList.remove("is-on");
    setTimeout(() => prev.pause(), 600);
    fqCur = 1 - fqCur;
    $("#fqTag").textContent = f.tag || ""; $("#fqNum").textContent = two(i + 1);
    scr.classList.remove("is-cut"); void scr.offsetWidth; scr.classList.add("is-cut");
  };
  $$(".qa").forEach((d) => d.addEventListener("toggle", () => {
    if (!d.open) return;
    $$(".qa").forEach((o) => { if (o !== d) o.open = false; });
    fqShow(+d.dataset.i);
  }));
  if (scr) { fqCur = 1; fqShow(0); }
  const strip = $$(".strip video");
  if (strip.length && !reduce) {
    const sIO = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { loadVideo(e.target); safePlay(e.target); } else e.target.pause(); }), { threshold: 0.3 });
    strip.forEach((v) => sIO.observe(v));
  }
  }

  /* ---------- Contact form ---------- */
  if (has("#form")) {
  const form = $("#form"), status = $("#formStatus");
  const wanted = new URLSearchParams(location.search).get("package");
  $("#fPkgs").innerHTML = [...C.packages.map((p) => [p.id, p.name, `${p.count} video${p.count > 1 ? "s" : ""}`]), ["unsure", "Not sure yet", "Help me pick"]]
    .map(([id, name, sub]) => `<label class="pk"><input type="radio" name="package" value="${name}"${(wanted ? wanted === id : id === "unsure") ? " checked" : ""}><span><b>${name}</b><small>${sub}</small></span></label>`).join("");
  const sendTxt = $("#fSubmitTxt") || $("#fSubmit");
  const clap = () => { form.classList.remove("is-clap"); void form.offsetWidth; form.classList.add("is-clap"); };
  const showErr = (input, msg) => {
    const ff = input.closest(".ff"); ff.classList.toggle("is-invalid", !!msg);
    let e = $(".err", ff);
    if (msg) { if (!e) { e = document.createElement("span"); e.className = "err"; e.id = input.id + "Err"; ff.appendChild(e); } e.textContent = msg; input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", e.id); }
    else { if (e) e.remove(); input.removeAttribute("aria-invalid"); input.removeAttribute("aria-describedby"); }
  };
  const validate = () => {
    let ok = true;
    const name = $("#fName"), place = $("#fPlace"), contact = $("#fContact");
    if (name.value.trim().length < 2) { showErr(name, "Please add your name."); ok = false; } else showErr(name);
    if (place.value.trim().length < 2) { showErr(place, "Which restaurant is it?"); ok = false; } else showErr(place);
    const c = contact.value.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);
    const isPhone = (c.match(/\d/g) || []).length >= 7 && /^[\d\s()+.-]+$/.test(c);
    if (!isEmail && !isPhone) { showErr(contact, "Add an email or a phone number we can reach."); ok = false; } else showErr(contact);
    return ok;
  };
  $$("#form input").forEach((i) => i.addEventListener("blur", () => { if (i.closest(".ff").classList.contains("is-invalid")) validate(); }));
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form__status"; status.textContent = "";
    if (!validate()) { const bad = $(".ff.is-invalid input", form); if (bad) bad.focus(); return; }
    const data = Object.fromEntries(new FormData(form).entries());
    if (data._honey) return; // bots fill the hidden field
    delete data._honey;
    const btn = $("#fSubmit");
    if (C.contact.formEndpoint) {
      btn.disabled = true; sendTxt.textContent = "Rolling…"; clap();
      try {
        const body = { ...data, _subject: `New request from ${data.restaurant} (arze site)`, _template: "table", _replyto: /@/.test(data.contact) ? data.contact : undefined };
        const r = await fetch(C.contact.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || String(j.success) === "false") throw new Error(j.message || r.status);
        form.reset(); form.classList.add("is-wrap");
        status.classList.add("ok"); status.textContent = "That's a wrap! We'll get back to you within one business day.";
      } catch (err) {
        status.classList.add("bad");
        status.innerHTML = `That didn't go through. Message us on <a href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a> instead.`;
      } finally { btn.disabled = false; sendTxt.textContent = "Action!"; }
    } else {
      const msg = `Hi Arze Media! I'm ${data.name} from ${data.restaurant}.\nInterested in: ${data.package}\nReach me at: ${data.contact}${data.message ? "\n\n" + data.message : ""}`;
      const url = waLink(msg);
      const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove();
      status.classList.add("ok");
      status.innerHTML = `Opening WhatsApp with your message. Didn't open? <a href="${url}" target="_blank" rel="noopener">Tap here</a>.`;
    }
  });

  }

  /* ---------- Contact page: background video + running timecode ---------- */
  const cxv = $(".cx__vid");
  if (cxv && !reduce && window.innerWidth > 640) { loadVideo(cxv); safePlay(cxv); }
  const tc = $("#tc");
  if (tc && !reduce) {
    const t0 = performance.now(), pad = (n) => String(n).padStart(2, "0");
    setInterval(() => { const f = Math.floor((performance.now() - t0) / (1000 / 24)); tc.textContent = `${pad(Math.floor(f / 86400))}:${pad(Math.floor(f / 1440) % 60)}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`; }, 42);
  }

  /* ---------- Motion (GSAP) ---------- */
  if (!hasGsap || reduce) return;
  gsap.registerPlugin(ScrollTrigger);

  if (has("#heroTitle")) {
  gsap.from("#heroTitle .line > span", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.12, delay: 0.1 });
  gsap.from([".kicker", ".hero__sub", ".hero__ctas", ".hero__facts"], { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.45 });
  gsap.from(".phone", { y: 80, rotate: 6, opacity: 0, duration: 1.3, ease: "power4.out", delay: 0.25 });
  gsap.from(".sticker", { scale: 0, duration: 0.8, ease: "back.out(2)", delay: 1.1 });
  }


  $$(".head, .quote .wrap > *, .ba__copy > *, .faq__back .wrap > *").forEach((el) => {
    gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  if (has("#wall")) gsap.from(".tile", { scale: 0.94, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.06, scrollTrigger: { trigger: "#wall", start: "top 80%", once: true } });
  if (has(".board")) gsap.from(".board", { y: 60, rotate: -1.5, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".board", start: "top 85%", once: true } });
  if (has(".sim")) gsap.from(".sim > *", { y: 50, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: ".sim", start: "top 85%", once: true } });
  if (has(".fq")) {
    gsap.from(".fq__side > .eyebrow, .fq__title", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 });
    gsap.from(".fq__screen", { y: 60, rotate: 6, opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.15 });
    gsap.from(".qa", { x: 40, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.07, delay: 0.2 });
    gsap.from(".strip__tile", { y: 80, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: ".strip", start: "top 90%", once: true } });
  }
  if (has(".cx")) { gsap.from(".cx__copy > *", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.1 }); gsap.from(".slate", { y: 60, rotate: 3, opacity: 0, duration: 1.1, ease: "power4.out", delay: 0.25 }); gsap.from(".slate__stick", { rotate: 0, duration: 0.5, ease: "back.out(3)", delay: 1 }); }
  else if (has(".form")) gsap.from(".form", { y: 50, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".form", start: "top 90%", once: true } });

  // Quote text scales slightly with scroll
  if (has(".quote")) gsap.fromTo(".quote__text", { scale: 0.92 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".quote", start: "top bottom", end: "center center", scrub: true } });

  // Before/after: one hint sweep the first time it shows up
  if (has("#ba")) ScrollTrigger.create({ trigger: "#ba", start: "top 70%", once: true, onEnter: () => {
    const o = { v: 50 };
    gsap.timeline().to(o, { v: 22, duration: 0.7, ease: "power2.inOut", onUpdate: () => setBa(o.v) }).to(o, { v: 74, duration: 0.9, ease: "power2.inOut", onUpdate: () => setBa(o.v) }).to(o, { v: 50, duration: 0.6, ease: "power2.inOut", onUpdate: () => setBa(o.v) });
  } });

  // How it works: horizontal scroll pinned on desktop
  const mm = gsap.matchMedia();
  const howTrack = $("#howTrack"), wall = $("#wall");
  if (howTrack) mm.add("(min-width: 900px)", () => {
    const dist = () => Math.max(0, howTrack.scrollWidth - window.innerWidth);
    const tw = gsap.to(howTrack, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: "#how", pin: ".how__pin", scrub: 0.8, start: "top top", end: () => "+=" + dist(), invalidateOnRefresh: true, anticipatePin: 1 }
    });
    return () => tw.scrollTrigger && tw.scrollTrigger.kill();
  });

  // Video wall columns drift at different speeds on desktop
  if (wall) mm.add("(min-width: 1024px)", () => {
    const tws = $$(".tile", wall).map((t, i) => gsap.to(t, { y: (i % 2 === 1 ? -30 : 0), ease: "none", scrollTrigger: { trigger: wall, start: "top bottom", end: "bottom top", scrub: true } }));
    return () => tws.forEach((t) => t.scrollTrigger && t.scrollTrigger.kill());
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
