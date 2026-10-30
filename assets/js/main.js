/* DÚNÍYÀ — shared site script */

/* Set the WhatsApp Business number here, digits only with country code (e.g. "2348012345678").
   While empty, the site shows a placeholder and the buttons scroll to the order section. */
const WHATSAPP_NUMBER = "2348159019324";

/* Paste the Google Apps Script Web app URL here (ends in /exec). See apps-script/README.md. */
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbzrWMj3V9RbHdR59i9sV_Fo5OOWrcMYxI0w2K0JbP2zN8GOHXRNvcK93bIL374xRwg0Zw/exec";

const IMG = "assets/img/photos/";

/* The collection. `img` is the main photo; `alt` images show on hover and in the detail view. */
const LAYOUT = {"platinum": "6", "ember": "3", "moss": "3 drop", "cafe": "4 drop", "lumen": "6 drop", "tide": "4", "harvest": "4 drop", "onyx": "6", "stillwater": "4", "vine": "4 drop", "noir": "4", "olive-slide": "6", "stripe-thong": "6 drop"};

const LOOKS = [
  { id:"platinum", n:"06", name:"Platinum", g:"women", img:"plat_front", alt:["plat6","plat3","plat4","plat5"],
    d:"A sleeveless shift with a single centre seam, falling straight to mid-calf. Side pockets sit where the hands rest.",
    pieces:"Sleeveless dress", fabric:"Platinum hessian-linen" },
  { id:"ember", n:"07", name:"Ember", g:"women", img:"ember", alt:["d_drape"],
    d:"A loose coral dress with cape sleeves that move with the arm and a side slit for an easy stride.",
    pieces:"Dress", fabric:"Coral-red linen" },
  { id:"moss", n:"09", name:"Moss", g:"women", img:"moss", alt:["moss2","d_waist"],
    d:"A cropped sleeveless top with side vents over wide ¾ trousers. Worn together or apart.",
    pieces:"Sleeveless top + ¾ pants", fabric:"Dark moss-green cotton" },
  { id:"cafe", n:"02", name:"Café", g:"women", img:"cafe", alt:["cafe2","cafe_pocket"],
    d:"A boxy top with dropped shoulders and two deep patch pockets, worn over straight, wide trousers.",
    pieces:"Two-pocket top + trousers", fabric:"Café-au-lait cotton · platinum hessian-linen" },
  { id:"tide", n:"01", name:"Tide", g:"women", img:"tide", alt:[],
    d:"A striped top with a shaped V-neck facing and a single button. Cap sleeves, relaxed through the body.",
    pieces:"V-neck top", fabric:"Sky-blue & white striped linen" },
  { id:"harvest", n:"11", name:"Harvest", g:"women", img:"harvest_seated", alt:["lime_sandal"],
    d:"An oversized collared shirt with a V-placket and wide sleeves, over full-length wide-leg trousers.",
    pieces:"V-neck collared shirt + wide pants", fabric:"Mustard cotton · lime-green linen" },
  { id:"lumen", n:"08", name:"Lumen", g:"women", img:"lumen", alt:[],
    d:"A clean white shift with a deep notch neckline and two welt pockets. Above the knee.",
    pieces:"Two-pocket dress", fabric:"White linen" },
  { id:"onyx", n:"M1", name:"Onyx", g:"men", img:"onyx", alt:["noir_neck"],
    d:"A long-sleeved tunic with a notch neck and side slits, over relaxed drawstring trousers in the same black cloth.",
    pieces:"Tunic + trousers", fabric:"Black cotton" },
  { id:"stillwater", n:"M2", name:"Stillwater", g:"men", img:"white", alt:["d_placket"],
    d:"A short-sleeved stand-collar shirt with a half placket, worn with pressed straight trousers.",
    pieces:"Stand-collar shirt + trousers", fabric:"White linen" },
  { id:"vine", n:"M3", name:"Vine", g:"men", img:"olive2", alt:["olive"],
    d:"A camp-collar shirt with turned-up sleeves in an olive cloth printed with a looping vine.",
    pieces:"Camp-collar shirt", fabric:"Olive printed cloth" },
  { id:"noir", n:"M4", name:"Noir", g:"men", img:"noir_shirt", alt:["trio"],
    d:"A camp-collar shirt in a textured black weave, open at the neck and relaxed through the body.",
    pieces:"Camp-collar shirt", fabric:"Black textured weave" },
  { id:"olive-slide", n:"F1", name:"Olive cut-out", g:"footwear", img:"sandal_olive", alt:["lime_sandal"],
    d:"A flat leather slide with a sweeping cut-out upper and a toe loop.",
    pieces:"Sandal", fabric:"Olive leather" },
  { id:"stripe-thong", n:"F2", name:"Stripe thong", g:"footwear", img:"wine_sandal", alt:[],
    d:"A flat thong sandal with a red-and-cream webbing strap on a dark leather sole.",
    pieces:"Sandal", fabric:"Webbing · leather" }
];

(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  /* menu overlay */
  const ov = $("#overlay");
  if (ov){
    const open = () => { ov.hidden = false; document.body.style.overflow = "hidden"; $("#menuClose").focus(); };
    const close = () => { ov.hidden = true; document.body.style.overflow = ""; };
    $("#menuOpen").addEventListener("click", open);
    $("#menuClose").addEventListener("click", close);
    $$("nav a", ov).forEach(a => a.addEventListener("click", close));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !ov.hidden) close(); });
  }

  /* marquee band */
  $$(".band-track").forEach(t => { t.innerHTML += t.innerHTML; });

  /* horizontal rails with arrow controls */
  $$("[data-rail]").forEach(ctrl => {
    const rail = document.getElementById(ctrl.dataset.rail);
    if (!rail) return;
    const step = () => rail.clientWidth * 0.8;
    $("[data-dir='prev']", ctrl).addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: "smooth" }));
    $("[data-dir='next']", ctrl).addEventListener("click", () => rail.scrollBy({ left: step(), behavior: "smooth" }));
  });

  /* home rail filled from the collection */
  const homeRail = $("#homeRail");
  if (homeRail){
    homeRail.innerHTML = LOOKS.filter(l => l.g !== "footwear").map(l => `
      <a href="collection.html#${l.id}">
        <img src="${IMG}${l.img}.jpg" alt="${l.name}: ${l.pieces}" loading="lazy">
        <span class="label">Look ${l.n} · ${l.g === "men" ? "Men" : "Women"}</span>
        <h3>${l.name}</h3>
      </a>`).join("");
  }

  /* collection grid + lightbox */
  const grid = $("#lookgrid");
  if (grid){
    let filter = "all", current = 0, visible = LOOKS;
    const layoutSpan = l => "--span:" + (LAYOUT[l.id] || "4").split(" ")[0];
    const layoutCls = l => { const [s, d] = (LAYOUT[l.id] || "4").split(" "); return (+s >= 6 ? "lg " : "") + (d ? "drop" : ""); };
    const render = () => {
      visible = LOOKS.filter(l => filter === "all" || l.g === filter);
      grid.innerHTML = visible.map((l, i) => `
        <a class="card ${filter === "all" ? layoutCls(l) : ""} rv" data-i="${i}" id="${l.id}" href="#${l.id}" style="${filter === "all" ? layoutSpan(l) : ""}">
          <span class="photo">
            <img src="${IMG}${l.img}.jpg" alt="${l.name}: ${l.d}" loading="lazy">
            ${l.alt[0] ? `<img class="alt" src="${IMG}${l.alt[0]}.jpg" alt="" loading="lazy">` : ""}
            <span class="tag">${l.g === "men" ? "Men" : l.g === "women" ? "Women" : "Footwear"}</span>
            <span class="view">View look</span>
          </span>
          <span class="meta"><span class="label">Look ${l.n}</span><span class="label">${l.pieces}</span></span>
          <h3>${l.name}</h3>
          <p>${l.fabric}</p>
        </a>`).join("");
      $$(".card", grid).forEach(c => c.addEventListener("click", e => { e.preventDefault(); openLB(+c.dataset.i); }));
      grid.classList.toggle("filtered", filter !== "all");
      $("#countShown").textContent = visible.length;
    };
    $$(".chip[data-f]").forEach(c => c.addEventListener("click", () => {
      $$(".chip[data-f]").forEach(x => x.setAttribute("aria-pressed", x === c));
      filter = c.dataset.f; render();
    }));
    $$(".chip[data-view]").forEach(c => c.addEventListener("click", () => {
      $$(".chip[data-view]").forEach(x => x.setAttribute("aria-pressed", x === c));
      grid.classList.toggle("compact", c.dataset.view === "compact");
    }));

    const lb = $("#lb");
    const show = (src) => { $("#lbImg").src = IMG + src + ".jpg"; $$("#lbThumbs button").forEach(b => b.setAttribute("aria-pressed", b.dataset.src === src)); };
    function openLB(i){
      current = i; const l = visible[i];
      const all = [l.img, ...l.alt];
      $("#lbThumbs").innerHTML = all.length > 1 ? all.map(s => `<button data-src="${s}" aria-label="Show another view"><img src="${IMG}${s}.jpg" alt=""></button>`).join("") : "";
      $$("#lbThumbs button").forEach(b => b.addEventListener("click", () => show(b.dataset.src)));
      show(l.img);
      $("#lbImg").alt = `${l.name}: ${l.d}`;
      $("#lbNum").textContent = `Look ${l.n} · ${l.g === "men" ? "Men" : l.g === "women" ? "Women" : "Footwear"}`;
      $("#lbName").textContent = l.name;
      $("#lbDesc").textContent = l.d;
      $("#lbPieces").textContent = l.pieces;
      $("#lbFabric").textContent = l.fabric;
      $("#lbEnquire").href = "order.html?look=" + encodeURIComponent(l.name) + "#enquire";
      lb.hidden = false; document.body.style.overflow = "hidden";
      history.replaceState(null, "", "#" + l.id);
      $("#lbClose").focus();
    }
    const closeLB = () => { lb.hidden = true; document.body.style.overflow = ""; history.replaceState(null, "", location.pathname); };
    $("#lbClose").addEventListener("click", closeLB);
    $("#lbPrev").addEventListener("click", () => openLB((current - 1 + visible.length) % visible.length));
    $("#lbNext").addEventListener("click", () => openLB((current + 1) % visible.length));
    document.addEventListener("keydown", e => {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowRight") $("#lbNext").click();
      if (e.key === "ArrowLeft") $("#lbPrev").click();
    });
    render();
    const hash = location.hash.slice(1);
    const idx = visible.findIndex(l => l.id === hash);
    if (idx > -1) openLB(idx);
  }

  /* craft hotspots */
  $$(".hot").forEach(h => {
    const notes = document.getElementById(h.dataset.notes);
    $$(".pin", h).forEach(p => p.addEventListener("click", () => {
      $$(".pin", h).forEach(x => x.setAttribute("aria-pressed", x === p));
      $$("li", notes).forEach(li => li.classList.toggle("on", li.dataset.k === p.dataset.k));
      const li = $(`li[data-k="${p.dataset.k}"]`, notes);
      if (li && window.innerWidth < 760) li.scrollIntoView({ behavior: "smooth", block: "center" });
    }));
  });

  /* WhatsApp */
  function enquireHref(lookName){
    if (!WHATSAPP_NUMBER) return "order.html" + (lookName ? "?look=" + encodeURIComponent(lookName) : "") + "#enquire";
    const msg = lookName ? `Hello DÚNÍYÀ, I'd like to order the ${lookName} look.` : "Hello DÚNÍYÀ, I'd like to place an order.";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }
  $$("[data-wa]").forEach(a => { a.href = enquireHref(a.dataset.wa || ""); if (WHATSAPP_NUMBER) a.target = "_blank"; });
  const waNum = $("#waNum");
  if (waNum && WHATSAPP_NUMBER) waNum.textContent = "+" + WHATSAPP_NUMBER.replace(/^(\d{3})(\d{3})(\d{3})(\d+)$/, "$1 $2 $3 $4");
  const look = new URLSearchParams(location.search).get("look");
  const enq = $("#enquiry");
  if (enq && look){ enq.textContent = `You're enquiring about the ${look} look.`; enq.classList.add("on"); }
  const copyBtn = $("#copyBtn"), toast = $("#toast");
  if (copyBtn){
    copyBtn.addEventListener("click", () => {
      const txt = waNum.textContent;
      const fallback = () => { const r = document.createRange(); r.selectNodeContents(waNum); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast.textContent = "Selected. Copy with your keyboard."; };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast.textContent = "Copied", fallback); else fallback();
    });
  }

  /* enquiry form → Google Sheet via Apps Script */
  const form = $("#eform");
  if (form){
    const wanted = (new URLSearchParams(location.search).get("look") || "").toLowerCase();
    $("#f-looks").innerHTML = LOOKS.filter(l => l.g !== "footwear").map(l =>
      `<label class="opt"><input type="checkbox" name="look" value="${l.name}"${l.name.toLowerCase() === wanted ? " checked" : ""}><span>${l.name}</span></label>`).join("")
      + `<label class="opt"><input type="checkbox" name="look" value="Footwear"><span>Footwear</span></label>`
      + `<label class="opt"><input type="checkbox" name="look" value="Not sure yet"><span>Help me choose</span></label>`;

    const status = $("#f-status"), btn = $("#f-submit");
    const setErr = (id, msg) => { const f = $("#f-" + id).closest(".field"); f.classList.toggle("bad", !!msg); $("#e-" + id).textContent = msg || ""; };
    const validate = () => {
      const v = id => $("#f-" + id).value.trim();
      const digits = v("phone").replace(/\D/g, "");
      const errs = {
        name: v("name").length < 2 ? "Please add your name." : "",
        phone: digits.length < 10 ? "Please add a phone number we can reach, e.g. 0803 000 0000." : "",
        email: v("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")) ? "Please check this email address." : "",
        city: v("city").length < 2 ? "Please add your city." : ""
      };
      Object.entries(errs).forEach(([k, m]) => setErr(k, m));
      const first = Object.keys(errs).find(k => errs[k]);
      if (first) $("#f-" + first).focus();
      return !first;
    };
    ["name","phone","email","city"].forEach(id => $("#f-" + id).addEventListener("input", () => setErr(id, "")));

    form.addEventListener("submit", async e => {
      e.preventDefault();
      status.textContent = "";
      if (!validate()) return;
      if (!FORM_ENDPOINT){
        status.textContent = "The form isn’t connected yet. Please message us on WhatsApp below.";
        return;
      }
      const fd = new FormData(form);
      const body = new URLSearchParams();
      for (const [k, v] of fd) if (k !== "look") body.append(k, v);
      body.append("looks", fd.getAll("look").join(", "));
      body.append("page", "order.html" + (wanted ? "?look=" + wanted : ""));

      btn.disabled = true; btn.textContent = "Sending…";
      let result = null;
      try {
        const res = await fetch(FORM_ENDPOINT, { method: "POST", body });
        result = await res.json();
      } catch (err) {
        try { await fetch(FORM_ENDPOINT, { method: "POST", body, mode: "no-cors" }); result = { ok: true, ref: "" }; }
        catch (err2) { result = { ok: false, error: "We couldn’t send your enquiry. Check your connection and try again, or message us on WhatsApp." }; }
      }
      btn.disabled = false; btn.textContent = "Send enquiry";
      if (!result || !result.ok){ status.textContent = (result && result.error) || "Something went wrong. Please try again."; return; }

      const name = $("#f-name").value.trim().split(" ")[0];
      const how = (fd.get("contact") === "Call") ? "call you" : (fd.get("contact") === "Either" ? "call or WhatsApp you" : "WhatsApp you");
      $("#d-title").textContent = `Thank you, ${name}.`;
      $("#d-text").textContent = `A person from the house will ${how} on ${$("#f-phone").value.trim()}.` + ($("#f-email").value.trim() ? " We’ve also sent a confirmation to your email." : "");
      $("#d-ref").textContent = result.ref ? `Your reference: ${result.ref}` : "";
      form.hidden = true; $("#f-done").hidden = false; $("#f-done").focus();
    });
  }

  /* gentle reveal; content is visible at rest */
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches){
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.remove("pre"); io.unobserve(e.target); } }), { threshold: .1 });
    const arm = () => $$(".rv:not(.armed)").forEach(el => {
      el.classList.add("armed");
      if (el.getBoundingClientRect().top > innerHeight){ el.classList.add("pre"); io.observe(el); }
    });
    arm();
    new MutationObserver(arm).observe(document.body, { childList: true, subtree: true });
  }
})();
