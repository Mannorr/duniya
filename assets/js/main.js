/* DÚNÍYÀ — shared site script */

/* Set the WhatsApp Business number here, digits only with country code (e.g. "2348012345678").
   While empty, the site shows a placeholder and the buttons scroll to the order section. */
const WHATSAPP_NUMBER = "2348159019324";

/* Paste the Google Apps Script Web app URL here (ends in /exec). See apps-script/README.md. */
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbzrWMj3V9RbHdR59i9sV_Fo5OOWrcMYxI0w2K0JbP2zN8GOHXRNvcK93bIL374xRwg0Zw/exec";

const IMG = "assets/img/photos/";
const CUTS = "assets/img/cutouts/cut-";
const SITE_URL = "https://duniya-pearl.vercel.app/";

/* ------------------------------------------------------------------
   THE CATALOGUE
   status:  "ready"   = shown, with its approved price
            "enquiry" = shown; customer enquires for price / fabric / feasibility
            "hidden"  = not published anywhere on the site
   (status labels are internal and never shown to customers)
   fabric:  only what is documented. null = "confirmed when you enquire"
   colour:  as photographed
   price:   only an approved selling price, e.g. "₦85,000". null = price on enquiry
   with:    ids of other products shown in the same photographs
   ------------------------------------------------------------------ */
const CATEGORIES = {
  women: { label: "Women’s Wear", subs: ["Dresses", "Tops", "Trousers", "Two-piece sets"] },
  men:   { label: "Men’s Wear",   subs: ["Shirts", "Trousers", "Shorts", "Two-piece sets"] },
  commission: { label: "Traditional Wear & Custom Commissions", subs: [] }
};

const PRODUCTS = [
  /* Women’s Wear: garments documented for the October 2026 shoot */
  { id:"platinum-dress", status:"enquiry", cat:"women", sub:"Dresses", name:"Platinum Sleeveless Dress",
    img:"plat_front", alt:["plat6","plat3","plat4"], fabric:"Hessian-linen", colour:"Platinum", price:null,
    d:"A sleeveless dress with a single centre seam, falling straight to mid-calf, with pockets at the sides." },
  { id:"coral-dress", status:"enquiry", cat:"women", sub:"Dresses", name:"Coral-Red Linen Dress",
    img:"ember", alt:["d_drape"], fabric:"Linen", colour:"Coral red", price:null,
    d:"A loose dress with wide cape sleeves and side slits, falling below the knee." },
  { id:"white-dress", status:"enquiry", cat:"women", sub:"Dresses", name:"White Two-Pocket Dress",
    img:"lumen", alt:[], fabric:"Linen", colour:"White", price:null,
    d:"A sleeveless dress with a notch neckline and two front pockets, finishing above the knee." },
  { id:"moss-set", status:"enquiry", cat:"women", sub:"Two-piece sets", name:"Moss-Green Two-Piece",
    img:"moss", alt:["moss2","d_waist"], fabric:null, colour:"Dark moss green", price:null,
    d:"A sleeveless top with side vents, worn with matching three-quarter trousers." },
  { id:"cafe-shirt", status:"enquiry", cat:"women", sub:"Tops", name:"Café-au-Lait Two-Pocket Shirt",
    img:"cafe", alt:["cafe_pocket"], fabric:"Cotton", colour:"Café au lait", price:null, with:["platinum-trousers"],
    d:"A boxy short-sleeved top with dropped shoulders and two deep patch pockets." },
  { id:"carmine-top", status:"enquiry", cat:"women", sub:"Tops", name:"Japanese Carmine V-Neck Top",
    img:"pair", pos:"18% 22%", zoom:1.6, alt:[], fabric:"Cotton", colour:"Japanese carmine", price:null, with:["platinum-trousers"],
    d:"A boxy cap-sleeve top with a V-neck." },
  { id:"mustard-shirt", status:"enquiry", cat:"women", sub:"Tops", name:"Mustard V-Neck Collared Shirt",
    img:"harvest_seated", alt:[], fabric:"Cotton", colour:"Mustard", price:null, with:["lime-trousers"],
    d:"An oversized collared shirt with a V-placket and wide elbow-length sleeves." },
  { id:"striped-top", status:"enquiry", cat:"women", sub:"Tops", name:"Sky-Blue Striped V-Neck Top",
    img:"tide", alt:[], fabric:"Linen", colour:"Sky blue and white stripe", price:null,
    d:"A V-neck top with a shaped facing, a single button and cap sleeves." },
  { id:"platinum-trousers", status:"enquiry", cat:"women", sub:"Trousers", name:"Platinum Hessian-Linen Trousers",
    img:"cafe2", pos:"50% 80%", alt:[], fabric:"Hessian-linen", colour:"Platinum", price:null, with:["cafe-shirt","carmine-top"],
    d:"Wide, straight-leg trousers with a full-length fall." },
  { id:"lime-trousers", status:"enquiry", cat:"women", sub:"Trousers", name:"Lime-Green Linen Trousers",
    img:"lime_sandal", alt:[], fabric:"Linen", colour:"Lime green", price:null, with:["mustard-shirt"],
    d:"Full-length wide-leg trousers with a pressed front crease." },
  /* Documented, but the only photograph is a rear view of a cutout: not published until a suitable photo exists */
  { id:"white-trousers", status:"hidden", cat:"women", sub:"Trousers", name:"White ¾ Linen Trousers",
    img:null, alt:[], fabric:"Linen", colour:"White", price:null,
    d:"Wide trousers cut to three-quarter length." },

  /* Men’s Wear: photographed in October 2026; garment details still to be confirmed by DÚNÍYÀ */
  { id:"black-set", status:"enquiry", cat:"men", sub:"Two-piece sets", name:"Black Notch-Neck Two-Piece",
    img:"onyx", alt:["noir_neck"], fabric:null, colour:"Black", price:null,
    d:"A long-sleeved tunic with a notch neck and side slits, worn with relaxed drawstring trousers in the same colour." },
  { id:"white-set", status:"enquiry", cat:"men", sub:"Two-piece sets", name:"White Stand-Collar Two-Piece",
    img:"white", alt:["d_placket"], fabric:null, colour:"White", price:null,
    d:"A short-sleeved shirt with a stand collar and half placket, worn with straight trousers in the same colour." },
  { id:"olive-shirt", status:"enquiry", cat:"men", sub:"Shirts", name:"Olive Printed Camp-Collar Shirt",
    img:"olive2", alt:["olive"], fabric:null, colour:"Olive with a cream print", price:null, with:["cream-trousers"],
    d:"A short-sleeved camp-collar shirt with turned-up cuffs, printed with a looping line motif." },
  { id:"black-shirt", status:"enquiry", cat:"men", sub:"Shirts", name:"Black Textured Camp-Collar Shirt",
    img:"noir_shirt", alt:[], fabric:null, colour:"Black", price:null, with:["cream-trousers"],
    d:"A short-sleeved camp-collar shirt in a textured cloth, worn open at the neck." },
  { id:"orange-tunic", status:"enquiry", cat:"men", sub:"Shirts", name:"Burnt-Orange Notch-Neck Tunic",
    img:"pair", pos:"80% 22%", zoom:1.6, alt:[], fabric:null, colour:"Burnt orange", price:null, with:["cream-trousers"],
    d:"A loose short-sleeved tunic with a notch neck and dropped shoulders." },
  { id:"cream-trousers", status:"enquiry", cat:"men", sub:"Trousers", name:"Cream Textured Trousers",
    img:"trio", pos:"82% 75%", alt:[], fabric:null, colour:"Cream", price:null,
    d:"Wide, relaxed trousers in a textured cream cloth." }
];

const PUBLISHED = PRODUCTS.filter(p => p.status !== "hidden");
const productById = id => PUBLISHED.find(p => p.id === id);
const catLabel = p => `${CATEGORIES[p.cat].label} · ${p.sub}`;
const priceText = p => p.price ? p.price : "Price on enquiry";
const fabricText = p => p.fabric || "Confirmed when you enquire";

/* WhatsApp links. Every message names what the customer is asking about. */
function waLink(text){ return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`; }
function waProduct(list){
  const ps = [].concat(list);
  const names = ps.map(p => `${p.name} (${CATEGORIES[p.cat].label})`).join(" and ");
  const url = SITE_URL + "collection#" + ps[0].id;
  return waLink(`Hello DÚNÍYÀ, I'd like to enquire about the ${names} from your website.\n${url}`);
}
const WA_TOPICS = {
  general: "Hello DÚNÍYÀ, I have a question about your clothing.",
  product: "Hello DÚNÍYÀ, I have a question about one of your designs.",
  fabric: "Hello DÚNÍYÀ, I'd like to ask about a fabric or colour variation of one of your designs.",
  measure: "Hello DÚNÍYÀ, I have a question about measurements for an order.",
  commission: "Hello DÚNÍYÀ, I'd like to discuss a custom commission. I can send a reference photo or describe my idea."
};

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

  /* collection: grouped catalogue, filters, product detail */
  const grid = $("#catalogue");
  if (grid){
    let cat = "all", sub = "all", current = 0, visible = [];
    const subBar = $("#subfilters");

    const card = (p, i) => `
      <article class="pcard rv" id="${p.id}">
        <button class="pc-open" type="button" data-i="${i}" aria-label="View details: ${p.name}">
          <span class="photo">${photo(p, "lazy")}${p.alt[0] ? `<img class="alt" src="${IMG}${p.alt[0]}.jpg" alt="" loading="lazy">` : ""}</span>
        </button>
        <span class="pc-cat label">${catLabel(p)}</span>
        <h3><button class="pc-open pc-name" type="button" data-i="${i}">${p.name}</button></h3>
        <p class="pc-desc">${p.d}</p>
        <p class="pc-price">${priceText(p)}</p>
        <div class="pc-actions">
          <a class="btn pc-wa" href="${waProduct(p)}" target="_blank" rel="noopener">Enquire on WhatsApp</a>
          <button class="pc-more pc-open" type="button" data-i="${i}">Details</button>
        </div>
      </article>`;

    const commissionCard = `
      <article class="pcard commission rv" id="custom-commissions">
        <div class="cm-inner">
          <img src="assets/img/logo/seal-cream.png" alt="" width="64" height="64">
          <span class="label">Traditional Wear &amp; Custom Commissions</span>
          <h3>Have something particular in mind?</h3>
          <p>Ask for a variation of a design you see here, or send us a reference or an idea for something new. We look at each request, confirm whether it can be made and which fabrics are available, and quote before anything is agreed.</p>
          <a class="btn" href="${waLink(WA_TOPICS.commission)}" target="_blank" rel="noopener">Start a commission on WhatsApp</a>
          <a class="arrow" href="order?request=commission#enquire">Or send an enquiry form</a>
        </div>
      </article>`;

    function photo(p, loading){
      const st = (p.pos ? `object-position:${p.pos};` : "") + (p.zoom ? `transform:scale(${p.zoom});transform-origin:${p.pos};` : "");
      return `<img src="${IMG}${p.img}.jpg" alt="${p.name}: ${p.d}" loading="${loading}" style="${st}">`;
    }

    function render(){
      visible = PUBLISHED.filter(p => (cat === "all" || p.cat === cat) && (sub === "all" || p.sub === sub));
      const groups = cat === "all" ? ["women", "men", "commission"] : [cat];
      let html = "", i = 0;
      for (const g of groups){
        const items = visible.filter(p => p.cat === g);
        if (g === "commission"){
          html += `<section class="cat-group"><div class="cat-head"><h2>${CATEGORIES.commission.label}</h2></div><div class="pgrid one">${commissionCard}</div></section>`;
          continue;
        }
        if (!items.length) continue;
        html += `<section class="cat-group"><div class="cat-head"><h2>${CATEGORIES[g].label}</h2><span class="label">${items.length} design${items.length === 1 ? "" : "s"}</span></div>
          <div class="pgrid">${items.map(p => card(p, visible.indexOf(p))).join("")}</div></section>`;
      }
      grid.innerHTML = html;
      $$(".pc-open", grid).forEach(b => b.addEventListener("click", () => openLB(+b.dataset.i)));
      $("#countShown").textContent = visible.length;
    }

    function renderSubs(){
      if (cat === "all" || cat === "commission"){ subBar.hidden = true; subBar.innerHTML = ""; return; }
      const subs = CATEGORIES[cat].subs.filter(sname => PUBLISHED.some(p => p.cat === cat && p.sub === sname));
      subBar.hidden = false;
      subBar.innerHTML = [`<button class="chip sm" data-s="all" aria-pressed="true">All ${CATEGORIES[cat].label}</button>`]
        .concat(subs.map(sname => `<button class="chip sm" data-s="${sname}" aria-pressed="false">${sname}</button>`)).join("");
      $$(".chip", subBar).forEach(c => c.addEventListener("click", () => {
        $$(".chip", subBar).forEach(x => x.setAttribute("aria-pressed", x === c));
        sub = c.dataset.s; render();
      }));
    }

    function setCat(c){
      cat = c; sub = "all";
      $$(".chip[data-f]").forEach(x => x.setAttribute("aria-pressed", x.dataset.f === c));
      renderSubs(); render();
    }
    $$(".chip[data-f]").forEach(c => c.addEventListener("click", () => setCat(c.dataset.f)));

    const lb = $("#lb");
    const show = (src) => {
      $("#lbImg").src = IMG + src + ".jpg";
      $$("#lbThumbs button").forEach(b => b.setAttribute("aria-pressed", b.dataset.src === src));
    };
    function openLB(i){
      current = i; const p = visible[i];
      const all = [p.img, ...p.alt];
      $("#lbThumbs").innerHTML = all.length > 1 ? all.map(sr => `<button data-src="${sr}" aria-label="Show another photograph"><img src="${IMG}${sr}.jpg" alt=""></button>`).join("") : "";
      $$("#lbThumbs button").forEach(b => b.addEventListener("click", () => show(b.dataset.src)));
      show(p.img);
      $("#lbImg").alt = `${p.name}: ${p.d}`;
      $("#lbCat").textContent = catLabel(p);
      $("#lbName").textContent = p.name;
      $("#lbDesc").textContent = p.d;
      $("#lbFabric").textContent = fabricText(p);
      $("#lbColour").textContent = p.colour + " (as photographed)";
      $("#lbPrice").textContent = priceText(p);
      const others = (p.with || []).map(productById).filter(Boolean);
      $("#lbWithRow").hidden = !others.length; $("#lbWith").hidden = !others.length;
      $("#lbWith").innerHTML = others.map(o => `<a href="#${o.id}" data-goto="${o.id}">${o.name}</a>`).join(", ");
      $$("#lbWith a").forEach(a => a.addEventListener("click", e => {
        e.preventDefault();
        if (cat !== "all") setCat("all");
        const j = visible.findIndex(v => v.id === a.dataset.goto); if (j > -1) openLB(j);
      }));
      $("#lbWa").href = waProduct(p);
      $("#lbForm").href = "order?product=" + encodeURIComponent(p.id) + "#enquire";
      lb.hidden = false; document.body.style.overflow = "hidden";
      history.replaceState(null, "", "#" + p.id);
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

    const fromHash = () => {
      const h = location.hash.slice(1);
      if (h === "women" || h === "men"){ setCat(h); return; }
      if (h === "custom-commissions"){ setCat("all"); setTimeout(() => document.getElementById(h)?.scrollIntoView(), 50); return; }
      const j = visible.findIndex(p => p.id === h);
      if (j > -1) openLB(j);
    };
    setCat("all");
    fromHash();
    window.addEventListener("hashchange", fromHash);
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

  /* WhatsApp: [data-wa="general|product|fabric|measure|commission"] */
  $$("[data-wa]").forEach(a => {
    a.href = waLink(WA_TOPICS[a.dataset.wa] || WA_TOPICS.general);
    a.target = "_blank"; a.rel = "noopener";
  });
  const waNum = $("#waNum");
  if (waNum) waNum.textContent = "+" + WHATSAPP_NUMBER.replace(/^(\d{3})(\d{3})(\d{3})(\d+)$/, "$1 $2 $3 $4");
  const copyBtn = $("#copyBtn"), toast = $("#toast");
  if (copyBtn){
    copyBtn.addEventListener("click", () => {
      const txt = waNum.textContent;
      const fallback = () => { const r = document.createRange(); r.selectNodeContents(waNum); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); toast.textContent = "Selected. Copy with your keyboard."; };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast.textContent = "Copied", fallback); else fallback();
    });
  }

  /* enquiry form → Google Sheet via Apps Script */
  const form = $("#eform");
  if (form){
    const qs = new URLSearchParams(location.search);
    const wantedIds = new Set((qs.get("product") || "").split(",").filter(Boolean));
    const wantedNames = new Set((qs.get("look") || "").toLowerCase().split(",").map(w => w.trim()).filter(Boolean));
    const wanted = [...wantedIds].join(",");
    const opt = p => `<label class="opt"><input type="checkbox" name="look" value="${p.name}"${wantedIds.has(p.id) || wantedNames.has(p.name.toLowerCase()) ? " checked" : ""}><span>${p.name}</span></label>`;
    $("#f-looks").innerHTML = ["women", "men"].map(c => `
      <span class="opt-group">${CATEGORIES[c].label}</span>${PUBLISHED.filter(p => p.cat === c).map(opt).join("")}`).join("")
      + `<span class="opt-group">Other</span><label class="opt"><input type="checkbox" name="look" value="Not sure yet"><span>Not sure yet</span></label>`;
    const req = qs.get("request");
    if (req === "commission"){ const r = $('input[name="request"][value="Custom commission"]'); if (r) r.checked = true; }
    else if (wantedIds.size || wantedNames.size){ const r = $('input[name="request"][value="An existing design"]'); if (r) r.checked = true; }
    const enq = $("#enquiry");
    const chosen = [...wantedIds].map(productById).filter(Boolean);
    if (enq && chosen.length){ enq.textContent = `You’re enquiring about: ${chosen.map(p => p.name).join(", ")}.`; enq.hidden = false; }

    const status = $("#f-status"), btn = $("#f-submit");
    let formStart = performance.now();
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
      for (const [k, v] of fd) if (k !== "look" && k !== "message") body.append(k, v);
      body.append("message", `Request: ${fd.get("request") || "Not stated"}` + (fd.get("message") ? `. ${fd.get("message")}` : ""));
      body.append("looks", fd.getAll("look").join(", "));
      body.append("page", "order" + (wanted ? "?product=" + wanted : ""));
      body.append("t", String(Math.round(performance.now() - formStart)));

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

  /* Vercel Web Analytics: cookie-free, served from this site's own domain.
     Only loads on Vercel (the script does not exist on GitHub Pages or locally). */
  const host = location.hostname;
  if (host && !host.endsWith("github.io") && host !== "localhost" && host !== "127.0.0.1" && location.protocol === "https:"){
    window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };
    const va = document.createElement("script");
    va.defer = true; va.src = "/_vercel/insights/script.js";
    document.head.appendChild(va);
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
