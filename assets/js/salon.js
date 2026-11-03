/* DÚNÍYÀ — the Salon
   A field of cutout figures at three depths. Drag (or swipe, or use the arrow keys) to wander;
   select a figure in the sharp middle row to step closer to that look.
   Needs PUBLISHED and helpers from main.js (load this file after it). */

(function(){
  const root = document.querySelector("[data-salon]");
  if (!root || typeof PUBLISHED === "undefined") return;

  const CUT = "assets/img/cutouts/cut-";
  /* cutout id → relative height (1 = tallest standing figure) */
  const H = { 2:.878, 3:.973, 6:.862, 7:.993, 8:1, 14:.982, 16:.928, 18:.981, 19:.932, 23:.953,
              28:.975, 29:.91, 30:.904, 35:.911, 38:.913, 46:.901, 47:.881, 51:.928, 55:.858, 64:.939, 75:.672 };

  /* Each figure in the middle row, and the catalogue products it shows (ids from PRODUCTS in main.js).
     Hidden products are left out automatically; a figure with no published products is skipped. */
  const ENTRIES = [
    { ids:["platinum-dress"], cuts:[8, 2, 3, 6, 7] },
    { ids:["black-set"], cuts:[35] },
    { ids:["coral-dress"], cuts:[19, 18, 23] },
    { ids:["olive-shirt", "cream-trousers"], cuts:[64] },
    { ids:["cafe-shirt", "platinum-trousers"], cuts:[29, 28, 30] },
    { ids:["white-dress", "white-set"], cuts:[55] },
    { ids:["moss-set"], cuts:[14, 16] },
    { ids:["mustard-shirt", "lime-trousers"], cuts:[46, 47, 75] },
    { ids:["carmine-top", "platinum-trousers", "orange-tunic", "cream-trousers"], cuts:[38] },
    { ids:["striped-top", "white-trousers"], cuts:[51] }
  ]
    .map(e => ({ ...e, data: e.ids.map(productById).filter(Boolean) }))
    .filter(e => e.data.length);
  ENTRIES.forEach(e => {
    const n = e.data.map(p => p.name);
    e.title = n.length === 1 ? n[0] : n.length === 2 ? `${n[0]} with ${n[1]}` : "Shown together";
    e.line = n.length === 1 ? e.data[0].d : n.length === 2 ? e.data[0].d : n.join(", ") + ".";
  });
  const BACK = [2, 16, 28, 6, 23, 47, 30, 18, 7, 3, 75, 29, 14, 19];
  const FRONT = [3, 47, 23, 30, 16];

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = root.querySelector(".sl-stage");
  const layers = {
    back:  { el: root.querySelector(".sl-layer.back"),  speed: .35, items: [] },
    mid:   { el: root.querySelector(".sl-layer.mid"),   speed: 1,   items: [] },
    front: { el: root.querySelector(".sl-layer.front"), speed: 2.1, items: [] }
  };

  /* ---------- build ---------- */
  const img = (id, cls) => `<img class="${cls || ""}" src="${CUT}${id}.webp" alt="" draggable="false" decoding="async" loading="lazy">`;

  function build(){
    const vw = root.clientWidth;
    const S = stage.clientHeight;
    root.style.setProperty("--S", S + "px");
    const mobile = vw < 760;

    // middle row: one button per look, repeated to fill the loop
    const midGap = mobile ? S * .36 : Math.max(S * .34, vw / 7.2);
    const backGap = midGap * .52;
    const frontGap = mobile ? vw * 1.8 : vw * .95;

    fill(layers.mid, ENTRIES.map((e, i) => ({
      html: `<button class="sl-fig" type="button" data-e="${i}" aria-label="Step closer: ${e.title}" style="--r:${H[e.cuts[0]]}">${img(e.cuts[0])}<span class="sl-shadow"></span><span class="sl-name">${e.data.length === 1 ? e.title : e.data[0].name}</span></button>`
    })), midGap, vw);

    fill(layers.back, BACK.map(id => ({ html: `<div class="sl-fig" style="--r:${H[id]}">${img(id)}<span class="sl-shadow"></span></div>` })), backGap, vw);
    fill(layers.front, FRONT.map(id => ({ html: `<div class="sl-fig" style="--r:${H[id]}">${img(id)}</div>` })), frontGap, vw);

    layers.mid.el.querySelectorAll(".sl-fig").forEach(b => {
      b.addEventListener("click", ev => { if (moved) { ev.preventDefault(); return; } open(+b.dataset.e, b); });
      b.addEventListener("focus", () => centreOn(b));
    });
    render();
  }

  // Lay items out on a loop at least one screen wider than the viewport.
  function fill(layer, list, gap, vw){
    let seq = [];
    while (seq.length * gap < vw + gap * 3) seq = seq.concat(list);
    layer.gap = gap;
    layer.width = seq.length * gap;
    layer.el.innerHTML = seq.map((it, i) => `<div class="sl-slot" style="--i:${i}">${it.html}</div>`).join("");
    layer.items = [...layer.el.children];
    layer.items.forEach((el, i) => { el.base = i * gap + (layer === layers.back ? gap * .4 : 0); });
    // only the first copy of each middle figure is reachable by keyboard
    if (layer === layers.mid) layer.items.forEach((el, i) => { const b = el.querySelector("button"); if (b && i >= list.length) b.tabIndex = -1; });
  }

  /* ---------- motion ---------- */
  let offset = 0, vel = 0, raf = 0, dragging = false, moved = false, startX = 0, lastX = 0, lastT = 0, visible = true, pid = null, touched = 0;
  const mod = (a, n) => ((a % n) + n) % n;

  function render(){
    for (const k in layers){
      const L = layers[k]; if (!L.width) continue;
      const shift = offset * L.speed;
      for (const el of L.items){
        const x = mod(el.base + shift, L.width) - L.gap;
        el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      }
    }
  }

  function loop(){
    raf = 0;
    if (!dragging){
      if (Math.abs(vel) > .05){ offset += vel; vel *= .94; }
      else vel = 0;
    }
    render();
    if (dragging || Math.abs(vel) > .05) raf = requestAnimationFrame(loop);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  stage.addEventListener("pointerdown", e => {
    if (e.button !== 0 || closer.open) return;
    touched = performance.now();
    dragging = true; moved = false; startX = lastX = e.clientX; lastT = performance.now(); vel = 0; pid = e.pointerId;
    kick();
  });
  stage.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - lastX, now = performance.now();
    offset += dx; vel = dx / Math.max(1, now - lastT) * 16;
    lastX = e.clientX; lastT = now;
    if (!moved && Math.abs(e.clientX - startX) > 6){
      moved = true; root.classList.add("dragging");
      try { stage.setPointerCapture(pid); } catch (err) {}
    }
  });
  const end = () => { if (!dragging) return; dragging = false; touched = performance.now(); root.classList.remove("dragging"); kick(); setTimeout(() => moved = false, 0); };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);
  stage.addEventListener("wheel", e => {
    if (closer.open || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault(); offset -= e.deltaX; vel = -e.deltaX * .3; kick();
  }, { passive: false });
  root.addEventListener("keydown", e => {
    if (closer.open) return;
    if (e.key === "ArrowRight"){ vel = -14; kick(); }
    if (e.key === "ArrowLeft"){ vel = 14; kick(); }
  });

  function centreOn(b){
    const r = b.getBoundingClientRect(), rr = root.getBoundingClientRect();
    if (r.left < rr.left + 40 || r.right > rr.right - 40){
      offset += (rr.left + rr.width / 2) - (r.left + r.width / 2); vel = 0; render();
    }
  }

  if ("IntersectionObserver" in window){
    new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }).observe(root);
  }

  /* ---------- step closer ---------- */
  const closer = root.querySelector(".sl-closer");
  const q = s => closer.querySelector(s);
  let cur = 0, opener = null;

  function open(i, from){
    cur = (i + ENTRIES.length) % ENTRIES.length;
    const e = ENTRIES[cur];
    opener = from || opener;
    q(".slc-count").textContent = `${String(cur + 1).padStart(2, "0")} / ${String(ENTRIES.length).padStart(2, "0")}`;
    q(".slc-label").textContent = [...new Set(e.data.map(p => CATEGORIES[p.cat].label))].join(" · ");
    q("h2").textContent = e.title;
    q(".slc-line").textContent = e.line;
    const prev = ENTRIES[(cur - 1 + ENTRIES.length) % ENTRIES.length], next = ENTRIES[(cur + 1) % ENTRIES.length];
    q(".slc-prev span").textContent = prev.title; q(".slc-next span").textContent = next.title;
    q(".slc-view").href = "collection#" + e.data[0].id;
    q(".slc-view").textContent = e.data.length === 1 ? "View in the collection" : "View the first design";

    // figure + angles
    showCut(e.cuts[0]);
    q(".slc-angles").innerHTML = e.cuts.length > 1
      ? e.cuts.map((c, k) => `<button type="button" data-c="${c}" aria-label="View angle ${k + 1}" aria-pressed="${k === 0}">${img(c)}</button>`).join("")
      : "";
    q(".slc-angles").querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      q(".slc-angles").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
      showCut(+b.dataset.c);
    }));

    // panel
    q(".slc-count-pieces").textContent = e.data.length === 1 ? "One design" : `${e.data.length} designs shown`;
    q(".slc-list").innerHTML = e.data.map(p => `
      <li><span class="lbl">${catLabel(p)}</span><a href="collection#${p.id}"><b>${p.name}</b></a><i>Fabric: ${fabricText(p)}</i><i>${priceText(p)}</i></li>`).join("");
    q(".slc-enquire").href = waProduct(e.data);

    if (!closer.open){
      closer.open = true; closer.hidden = false;
      root.classList.add("closer-open");
      requestAnimationFrame(() => closer.classList.add("in"));
      document.addEventListener("keydown", keys);
      if (innerWidth < 760) document.body.style.overflow = "hidden";
    } else {
      const f = q(".slc-fig"); f.classList.remove("swap"); void f.offsetWidth; f.classList.add("swap");
    }
    q(".slc-close").focus({ preventScroll: true });
  }

  function showCut(c){
    const im = q(".slc-fig img");
    im.src = CUT + c + ".webp";
    im.alt = ENTRIES[cur].title + ": " + ENTRIES[cur].data.map(p => p.d).join(" ");
    q(".slc-fig").style.setProperty("--r", H[c]);
  }

  function close(){
    closer.classList.remove("in");
    root.classList.remove("closer-open");
    document.removeEventListener("keydown", keys);
    document.body.style.overflow = "";
    setTimeout(() => { closer.hidden = true; closer.open = false; kick(); }, reduce ? 0 : 380);
    if (opener) opener.focus({ preventScroll: true });
  }
  function keys(e){
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") open(cur + 1);
    if (e.key === "ArrowLeft") open(cur - 1);
  }
  closer.open = false;
  q(".slc-close").addEventListener("click", close);
  q(".slc-prev").addEventListener("click", () => open(cur - 1));
  q(".slc-next").addEventListener("click", () => open(cur + 1));
  closer.addEventListener("click", e => { if (e.target === closer) close(); });

  /* ---------- start ---------- */
  let rw = 0;
  const resize = () => { if (root.clientWidth !== rw){ rw = root.clientWidth; build(); } };
  addEventListener("resize", () => { clearTimeout(resize.t); resize.t = setTimeout(resize, 150); });
  resize();
  kick();
})();
