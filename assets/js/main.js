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
   status:  "ready"   = shown with its price
            "hidden"  = not published anywhere on the site
   (status labels are internal and never shown to customers)
   fabric:  only what is documented. null = "confirmed when you enquire"
   colour:  as photographed
   price:   set by garment type in PRICES below (approved by DÚNÍYÀ, November 2026)
   parts:   the garments in the design, for measurements: "top", "trousers", "dress"
   sleeves: false when the top or dress has no sleeve (no sleeve-length measurement)
   with:    ids of other products shown in the same photographs
   ------------------------------------------------------------------ */
const CATEGORIES = {
  women: { label: "Women’s Wear", subs: ["Dresses", "Tops", "Trousers", "Two-piece sets"] },
  men:   { label: "Men’s Wear",   subs: ["Shirts", "Trousers", "Shorts", "Two-piece sets"] },
  commission: { label: "Traditional Wear & Custom Commissions", subs: [] }
};

/* Approved selling prices. Tops and tunics are priced as shirts.
   Any two pieces ordered together (e.g. a shirt with trousers) are PAIR_PRICE. */
const PRICES = { top: 20000, trousers: 20000, dress: 35000, set: 40000 };
const PAIR_PRICE = 40000;
const SUB_TYPE = { "Dresses":"dress", "Tops":"top", "Shirts":"top", "Trousers":"trousers", "Shorts":"trousers", "Two-piece sets":"set" };

const PRODUCTS = [
  /* Women’s Wear: garments documented for the October 2026 shoot */
  { id:"platinum-dress", status:"ready", parts:["dress"], sleeves:false, cat:"women", sub:"Dresses", name:"Platinum Sleeveless Dress",
    img:"plat_front", alt:["plat6","plat3","plat4"], fabric:"Hessian-linen", colour:"Platinum",
    d:"A sleeveless dress with a single centre seam, falling straight to mid-calf, with pockets at the sides." },
  { id:"coral-dress", status:"ready", parts:["dress"], cat:"women", sub:"Dresses", name:"Coral-Red Linen Dress",
    img:"ember", alt:["d_drape"], fabric:"Linen", colour:"Coral red",
    d:"A loose dress with wide cape sleeves and side slits, falling below the knee." },
  { id:"white-dress", status:"ready", parts:["dress"], sleeves:false, cat:"women", sub:"Dresses", name:"White Two-Pocket Dress",
    img:"lumen", alt:[], fabric:"Linen", colour:"White",
    d:"A sleeveless dress with a notch neckline and two front pockets, finishing above the knee." },
  { id:"moss-set", status:"ready", parts:["top","trousers"], sleeves:false, cat:"women", sub:"Two-piece sets", name:"Moss-Green Two-Piece",
    img:"moss", alt:["moss2","d_waist"], fabric:null, colour:"Dark moss green",
    d:"A sleeveless top with side vents, worn with matching three-quarter trousers." },
  { id:"cafe-shirt", status:"ready", parts:["top"], cat:"women", sub:"Tops", name:"Café-au-Lait Two-Pocket Shirt",
    img:"cafe", alt:["cafe_pocket"], fabric:"Cotton", colour:"Café au lait", with:["platinum-trousers"],
    d:"A boxy short-sleeved top with dropped shoulders and two deep patch pockets." },
  { id:"carmine-top", status:"ready", parts:["top"], cat:"women", sub:"Tops", name:"Japanese Carmine V-Neck Top",
    img:"pair", pos:"18% 22%", zoom:1.6, alt:[], fabric:"Cotton", colour:"Japanese carmine", with:["platinum-trousers"],
    d:"A boxy cap-sleeve top with a V-neck." },
  { id:"mustard-shirt", status:"ready", parts:["top"], cat:"women", sub:"Tops", name:"Mustard V-Neck Collared Shirt",
    img:"harvest_seated", alt:[], fabric:"Cotton", colour:"Mustard", with:["lime-trousers"],
    d:"An oversized collared shirt with a V-placket and wide elbow-length sleeves." },
  { id:"striped-top", status:"ready", parts:["top"], cat:"women", sub:"Tops", name:"Sky-Blue Striped V-Neck Top",
    img:"tide", alt:[], fabric:"Linen", colour:"Sky blue and white stripe",
    d:"A V-neck top with a shaped facing, a single button and cap sleeves." },
  { id:"platinum-trousers", status:"ready", parts:["trousers"], cat:"women", sub:"Trousers", name:"Platinum Hessian-Linen Trousers",
    img:"cafe2", pos:"50% 80%", alt:[], fabric:"Hessian-linen", colour:"Platinum", with:["cafe-shirt","carmine-top"],
    d:"Wide, straight-leg trousers with a full-length fall." },
  { id:"lime-trousers", status:"ready", parts:["trousers"], cat:"women", sub:"Trousers", name:"Lime-Green Linen Trousers",
    img:"lime_sandal", alt:[], fabric:"Linen", colour:"Lime green", with:["mustard-shirt"],
    d:"Full-length wide-leg trousers with a pressed front crease." },
  /* Documented, but the only photograph is a rear view of a cutout: not published until a suitable photo exists */
  { id:"white-trousers", status:"hidden", parts:["trousers"], cat:"women", sub:"Trousers", name:"White ¾ Linen Trousers",
    img:null, alt:[], fabric:"Linen", colour:"White",
    d:"Wide trousers cut to three-quarter length." },

  /* Men’s Wear: photographed in October 2026; garment details still to be confirmed by DÚNÍYÀ */
  { id:"black-set", status:"ready", parts:["top","trousers"], cat:"men", sub:"Two-piece sets", name:"Black Notch-Neck Two-Piece",
    img:"onyx", alt:["noir_neck"], fabric:null, colour:"Black",
    d:"A long-sleeved tunic with a notch neck and side slits, worn with relaxed drawstring trousers in the same colour." },
  { id:"white-set", status:"ready", parts:["top","trousers"], cat:"men", sub:"Two-piece sets", name:"White Stand-Collar Two-Piece",
    img:"white", alt:["d_placket"], fabric:null, colour:"White",
    d:"A short-sleeved shirt with a stand collar and half placket, worn with straight trousers in the same colour." },
  { id:"olive-shirt", status:"ready", parts:["top"], cat:"men", sub:"Shirts", name:"Olive Printed Camp-Collar Shirt",
    img:"olive2", alt:["olive"], fabric:null, colour:"Olive with a cream print", with:["cream-trousers"],
    d:"A short-sleeved camp-collar shirt with turned-up cuffs, printed with a looping line motif." },
  { id:"black-shirt", status:"ready", parts:["top"], cat:"men", sub:"Shirts", name:"Black Textured Camp-Collar Shirt",
    img:"noir_shirt", alt:[], fabric:null, colour:"Black", with:["cream-trousers"],
    d:"A short-sleeved camp-collar shirt in a textured cloth, worn open at the neck." },
  { id:"orange-tunic", status:"ready", parts:["top"], cat:"men", sub:"Shirts", name:"Burnt-Orange Notch-Neck Tunic",
    img:"pair", pos:"80% 22%", zoom:1.6, alt:[], fabric:null, colour:"Burnt orange", with:["cream-trousers"],
    d:"A loose short-sleeved tunic with a notch neck and dropped shoulders." },
  { id:"cream-trousers", status:"ready", parts:["trousers"], cat:"men", sub:"Trousers", name:"Cream Textured Trousers",
    img:"trio", pos:"82% 75%", alt:[], fabric:null, colour:"Cream",
    d:"Wide, relaxed trousers in a textured cream cloth." }
];

const PUBLISHED = PRODUCTS.filter(p => p.status !== "hidden");
const productById = id => PUBLISHED.find(p => p.id === id);
const catLabel = p => `${CATEGORIES[p.cat].label} · ${p.sub}`;
const naira = n => "₦" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const priceOf = p => PRICES[SUB_TYPE[p.sub]];
const pieceCount = p => p.parts.length;
const priceText = p => naira(priceOf(p));
/* price of what the customer has chosen: one design, or a design plus one more piece */
function orderPrice(list){
  const ps = list.filter(Boolean);
  if (!ps.length) return null;
  const pieces = ps.reduce((n, p) => n + pieceCount(p), 0);
  if (ps.length > 1 && pieces === 2) return PAIR_PRICE;
  return ps.reduce((n, p) => n + priceOf(p), 0);
}
const fabricText = p => p.fabric || "Confirmed when you enquire";

/* WhatsApp links. Every message names what the customer is asking about. */
function waLink(text){ return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`; }
function waProduct(list){
  const ps = [].concat(list);
  const names = ps.map(p => `${p.name} (${CATEGORIES[p.cat].label}, ${priceText(p)})`).join(" and ");
  const url = SITE_URL + "collection#" + ps[0].id;
  const pair = ps.length === 2 && orderPrice(ps) === PAIR_PRICE ? ` together (two pieces, ${naira(PAIR_PRICE)})` : "";
  return waLink(`Hello DÚNÍYÀ, I'd like to order the ${names}${pair} from your website.\n${url}`);
}
/* Measurement fields for each kind of garment. Only the fields for the chosen garment are shown. */
const MEASURE = {
  top:      { label: "Top / shirt", fields: [["chest","Chest"],["shoulder","Shoulder"],["sleeve","Sleeve length"],["length","Top length"]] },
  dress:    { label: "Dress",       fields: [["bust","Bust"],["waist","Waist"],["hip","Hip"],["sleeve","Sleeve length"],["length","Dress length"]] },
  trousers: { label: "Trousers",    fields: [["waist","Waist"],["hip","Hip"],["length","Trouser length"]] }
};
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
          <button class="btn pc-open" type="button" data-i="${i}">View &amp; order</button>
          <a class="pc-more pc-wa" href="${waProduct(p)}" target="_blank" rel="noopener">Order on WhatsApp</a>
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
      $("#countShown").parentElement.hidden = cat === "commission";
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
      $("#lbPair").textContent = pieceCount(p) === 1
        ? `Order it with a second piece, such as ${p.parts[0] === "trousers" ? "a shirt or top" : "trousers"}, and the two pieces together are ${naira(PAIR_PRICE)}.`
        : "Price for the full two-piece outfit.";
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

  /* order form: design → price → measurements → customisation → form (Google Sheet) or WhatsApp */
  const form = $("#eform");
  if (form){
    const qs = new URLSearchParams(location.search);
    const ids = (qs.get("product") || "").split(",").filter(id => productById(id));
    const dSel = $("#f-design"), pSel = $("#f-pair");
    const optHtml = (filter, label) => ["women", "men"].map(c => {
      const ps = PUBLISHED.filter(p => p.cat === c && filter(p));
      return ps.length ? `<optgroup label="${CATEGORIES[c].label}">${ps.map(p => `<option value="${p.id}">${label(p)}</option>`).join("")}</optgroup>` : "";
    }).join("");
    dSel.innerHTML = `<option value="">Choose a design…</option>` + optHtml(() => true, p => `${p.name}, ${priceText(p)}`)
      + `<optgroup label="${CATEGORIES.commission.label}"><option value="commission">Something not in the collection (custom commission)</option></optgroup>`;

    const design = () => productById(dSel.value);
    const pair = () => productById(pSel.value);
    const chosen = () => [design(), pair()].filter(Boolean);
    const mode = () => (form.querySelector('input[name="measure"]:checked') || {}).value;
    const unit = () => (form.querySelector('input[name="unit"]:checked') || {}).value || "inches";

    function fillPair(){
      const d = design(), keep = pSel.value;
      const show = d && pieceCount(d) === 1;
      $("#pairField").hidden = !show;
      if (!show){ pSel.value = ""; return; }
      pSel.innerHTML = `<option value="">No, just this piece</option>` + optHtml(p => pieceCount(p) === 1 && p.id !== d.id, p => p.name);
      if (keep && keep !== d.id && productById(keep)) pSel.value = keep;
    }

    function measureParts(){
      // one block per garment: {key, label, sleeves}
      const out = [];
      chosen().forEach(p => p.parts.forEach(part => out.push({ part, label: MEASURE[part].label + (chosen().length > 1 ? ` · ${p.name}` : ""), sleeves: p.sleeves !== false, key: `${p.id}-${part}` })));
      return out;
    }
    function renderMeasure(){
      const box = $("#f-meas"), saved = {};
      $$("input", box).forEach(i => saved[i.name] = i.value);
      const blocks = measureParts();
      box.innerHTML = blocks.map(b => `
        <div class="m-block"><span class="opt-group">${b.label}</span><div class="m-grid">
        ${MEASURE[b.part].fields.filter(([k]) => k !== "sleeve" || b.sleeves).map(([k, l]) =>
          `<label class="m-f"><span>${l}</span><input name="m:${b.key}:${k}" data-label="${l}" inputmode="decimal" maxlength="6" autocomplete="off" value="${saved[`m:${b.key}:${k}`] || ""}"></label>`).join("")}
        </div></div>`).join("");
      $("#measWrap").hidden = !blocks.length || mode() !== "enter";
    }

    function update(){
      const d = design(), com = dSel.value === "commission";
      fillPair();
      const list = chosen(), price = orderPrice(list);
      const box = $("#f-price");
      if (com) box.innerHTML = `<b>Custom commission</b><span>We look at your idea first and confirm whether it can be made and what it will cost.</span>`;
      else if (!d) box.innerHTML = `<b>Prices</b><span>Shirts and tops ${naira(PRICES.top)} · Trousers ${naira(PRICES.trousers)} · Dresses ${naira(PRICES.dress)} · Any two pieces together ${naira(PAIR_PRICE)}</span>`;
      else if (list.length > 1) box.innerHTML = `<b>${naira(price)}</b><span>${list.map(p => p.name).join(" with ")}: any two pieces together are ${naira(PAIR_PRICE)}.</span>`;
      else box.innerHTML = `<b>${naira(price)}</b><span>${d.name}${pieceCount(d) === 2 ? ", full two-piece outfit" : ""}.</span>`;
      $("#sizeField").hidden = com || !d;
      renderMeasure();
      $("#enquiry").hidden = !list.length;
      $("#enquiry").textContent = list.length ? `You’re ordering: ${list.map(p => p.name).join(" with ")}.` : "";
    }
    dSel.addEventListener("change", update);
    pSel.addEventListener("change", update);
    $$('input[name="measure"]').forEach(r => r.addEventListener("change", renderMeasure));

    if (ids[0]) dSel.value = ids[0];
    else if (qs.get("request") === "commission") dSel.value = "commission";
    update();
    if (ids[1] && !$("#pairField").hidden){ pSel.value = ids[1]; update(); }

    // everything the customer chose, as lines for WhatsApp and the Sheet
    function summary(){
      const list = chosen(), lines = [];
      if (dSel.value === "commission") lines.push("Custom commission (not in the collection)");
      else if (list.length){
        lines.push(`Design: ${list.map(p => `${p.name} (${CATEGORIES[p.cat].label})`).join(" with ")}`);
        lines.push(`Price: ${naira(orderPrice(list))}${list.length > 1 ? " (two pieces together)" : ""}`);
        lines.push(`Link: ${SITE_URL}collection#${list[0].id}`);
        if (mode() === "help") lines.push("Measurements: please help me measure");
        else {
          const ms = measureParts().map(b => {
            const vals = $$(`#f-meas input[name^="m:${b.key}:"]`).filter(i => i.value.trim()).map(i => `${i.dataset.label} ${i.value.trim()}`);
            return vals.length ? `${b.label}: ${vals.join(", ")}` : "";
          }).filter(Boolean);
          if (ms.length) lines.push(`Measurements (${unit()}): ${ms.join("; ")}`);
        }
      }
      const cz = $$('input[name="custom"]:checked').map(i => i.value);
      const czText = $("#f-custom").value.trim();
      if (cz.length || czText) lines.push(`Customisation: ${[cz.join(", "), czText].filter(Boolean).join(". ")}`);
      if ($("#f-needby").value) lines.push(`Needed by: ${$("#f-needby").value}`);
      if ($("#f-message").value.trim()) lines.push(`Notes: ${$("#f-message").value.trim()}`);
      return lines;
    }

    const status = $("#f-status"), btn = $("#f-submit");
    let formStart = performance.now();
    const setErr = (id, msg) => { const f = $("#f-" + id).closest(".field"); f.classList.toggle("bad", !!msg); $("#e-" + id).textContent = msg || ""; };
    function checkOrder(){
      let err = "";
      if (!dSel.value) err = "Please choose a design, or choose a custom commission.";
      setErr("design", err);
      let merr = "";
      if (!err && dSel.value !== "commission"){
        const ins = $$("#f-meas input");
        if (!mode()) merr = "Please choose how you’ll give your measurements.";
        else if (mode() === "enter"){
          const bad = ins.find(i => i.value.trim() && !/^\d{1,3}([.,]\d{1,2})?$/.test(i.value.trim()));
          if (bad) merr = `Please enter ${bad.dataset.label.toLowerCase()} as a number, e.g. 38 or 38.5.`;
          else if (!ins.some(i => i.value.trim())) merr = "Please add your measurements, or choose “Please help me measure”.";
        }
      }
      $("#e-measure").textContent = merr; $("#sizeField").classList.toggle("bad", !!merr);
      if (err){ dSel.focus(); return false; }
      if (merr){ ( $$("#f-meas input").find(i => !i.value.trim()) || $('input[name="measure"]') ).focus(); return false; }
      return true;
    }
    const validate = () => {
      if (!checkOrder()) return false;
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
    dSel.addEventListener("change", () => setErr("design", ""));

    // continue on WhatsApp with everything filled in so far
    $("#f-wa").addEventListener("click", e => {
      e.preventDefault();
      if (!checkOrder()) return;
      const who = [$("#f-name").value.trim(), $("#f-city").value.trim()].filter(Boolean).join(", ");
      const text = `Hello DÚNÍYÀ, I'd like to place an order${who ? ` (${who})` : ""}.\n` + summary().join("\n");
      window.open(waLink(text), "_blank", "noopener");
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      status.textContent = "";
      if (!validate()) return;
      if (!FORM_ENDPOINT){
        status.textContent = "The form isn’t connected yet. Please use “Continue on WhatsApp”.";
        return;
      }
      const list = chosen();
      const com = dSel.value === "commission";
      const custom = $$('input[name="custom"]:checked').length || $("#f-custom").value.trim();
      const body = new URLSearchParams();
      ["name","phone","email","city","needby","website"].forEach(k => body.append(k, $("#f-" + k).value));
      body.append("contact", (form.querySelector('input[name="contact"]:checked') || {}).value || "WhatsApp");
      body.append("looks", com ? "Custom commission" : list.map(p => p.name).join(" + "));
      body.append("fitting", com ? "" : mode() === "help" ? "Help with measurements" : `Measurements given (${unit()})`);
      body.append("message", `Request: ${com ? "Custom commission" : custom ? "Order with customisation" : "Order"} | ` + summary().join(" | "));
      body.append("page", "order" + (list.length ? "?product=" + list.map(p => p.id).join(",") : ""));
      body.append("t", String(Math.round(performance.now() - formStart)));

      btn.disabled = true; btn.textContent = "Sending…";
      let result = null;
      try {
        const res = await fetch(FORM_ENDPOINT, { method: "POST", body });
        result = await res.json();
      } catch (err) {
        try { await fetch(FORM_ENDPOINT, { method: "POST", body, mode: "no-cors" }); result = { ok: true, ref: "" }; }
        catch (err2) { result = { ok: false, error: "We couldn’t send your order. Check your connection and try again, or use “Continue on WhatsApp”." }; }
      }
      btn.disabled = false; btn.textContent = "Send order";
      if (!result || !result.ok){ status.textContent = (result && result.error) || "Something went wrong. Please try again."; return; }

      const name = $("#f-name").value.trim().split(" ")[0];
      const c = (form.querySelector('input[name="contact"]:checked') || {}).value;
      const how = c === "Call" ? "call you" : (c === "Either" ? "call or WhatsApp you" : "WhatsApp you");
      $("#d-title").textContent = `Thank you, ${name}.`;
      $("#d-text").textContent = `A person from the house will ${how} on ${$("#f-phone").value.trim()} to confirm your order.` + ($("#f-email").value.trim() ? " We’ve also sent a confirmation to your email." : "");
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
