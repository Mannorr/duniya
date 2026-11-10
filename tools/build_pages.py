"""Builds every page of the DÚNÍYÀ site from shared parts.
Run from anywhere:  python3 tools/build_pages.py
Product data lives in assets/js/main.js (PRODUCTS); this file holds page layout and copy."""
import os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
P = 'assets/img/photos/'
L = 'assets/img/logo/'

def head(title, desc, og='hero'):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://script.google.com https://script.googleusercontent.com; form-action 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0A1F1B">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{P}{og}.jpg">
<link rel="icon" type="image/png" href="{L}seal-cream.png">
<link rel="preload" href="assets/fonts/gloock-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/jost-latin-300-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>'''

PAGES = [('house','The House'),('collection','Collection'),('lookbook','Lookbook'),('craft','Craft'),('order','Order')]

def nav(cur):
    def a(href, label):
        slug = './' if cur == 'index.html' else cur[:-5]
        c = ' aria-current="page"' if href == slug else ''
        return f'<a href="{href}"{c}>{label}</a>'
    return f'''
<header class="nav">
  <div class="wrap">
    <nav class="nav-links nav-left label" aria-label="Primary">
      {a('collection','Collection')}
      {a('order','How to Order')}
    </nav>
    <a class="brand" href="./" aria-label="Dúníyà home"><img src="{L}seal-cream.png" alt="Dúníyà"></a>
    <div class="nav-right">
      <nav class="nav-links label" aria-label="Secondary">
        {a('house','The House')}
      </nav>
      <a class="btn" data-wa="general" href="order#whatsapp">WhatsApp</a>
      <button class="menu-btn" id="menuOpen" aria-label="Open menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>

<div class="overlay" id="overlay" hidden role="dialog" aria-label="Menu">
  <div class="overlay-top">
    <img src="{L}monogram-copper.png" alt="Dúníyà" style="width:auto">
    <button class="close" id="menuClose" aria-label="Close menu">×</button>
  </div>
  <nav>
    {a('./','Home')}
    {a('collection','Collection')}
    {a('order','How to Order')}
    {a('house','The House')}
  </nav>
  <div class="overlay-foot label"><span>Lagos, Nigeria</span><a data-wa="general" href="order#whatsapp">WhatsApp us</a></div>
</div>
'''

FOOT = f'''
<footer>
  <div class="wrap">
    <div class="foot-top">
      <img class="seal" src="{L}seal-cream.png" alt="">
      <nav class="foot-nav" aria-label="Footer">
        <a href="collection">Collection</a><a href="order">How to Order</a>
        <a href="house">The House</a><a href="lookbook">Lookbook</a>
        <a href="craft">Craft</a><a href="collection#custom-commissions">Custom commissions</a>
      </nav>
      <div class="foot-contact">
        <span class="label" style="color:var(--copper-soft)">Lagos, Nigeria</span>
        <a data-wa="general" href="order#whatsapp">WhatsApp · +234 815 901 9324</a>
        <span>Made to order</span>
      </div>
    </div>
    <img class="foot-wm" src="{L}wordmark-copper.png" alt="Dúníyà">
    <div class="foot-row label">
      <span>A clothing house · Lagos</span>
      <span>© 2026 DÚNÍYÀ</span>
    </div>
  </div>
</footer>
<a class="btn wa-float" data-wa="general" href="order#whatsapp">WhatsApp</a>
<script src="assets/js/main.js"></script>
</body>
</html>
'''

def fig(src, alt, cap=None, cls='', lazy=True):
    c = f' class="{cls}"' if cls else ''
    l = ' loading="lazy"' if lazy else ''
    cp = f'<figcaption class="cap">{cap}</figcaption>' if cap else ''
    return f'<figure{c}><img src="{P}{src}.jpg" alt="{alt}"{l}>{cp}</figure>'

def write(name, title, desc, body, og='hero'):
    foot = FOOT
    if name == 'order.html':  # the order page has its own WhatsApp buttons
        foot = foot.replace('<a class="btn wa-float" data-wa="general" href="order#whatsapp">WhatsApp</a>\n', '')
    if 'data-salon' in body:
        foot = foot.replace('<script src="assets/js/main.js"></script>', '<script src="assets/js/main.js"></script>\n<script src="assets/js/salon.js"></script>')
    open(name, 'w').write(head(title, desc, og) + nav(name) + body + foot)

def salon(top):
    return f'''
<section class="salon" data-salon aria-label="The collection. Drag to browse, select a figure to see the design.">
  <div class="sl-stage">
    <div class="sl-floor"></div>
    <div class="sl-layer back" aria-hidden="true"></div>
    <div class="sl-layer mid"></div>
    <div class="sl-layer front" aria-hidden="true"></div>
  </div>
  <div class="sl-top">{top}</div>
  <p class="sl-hint">Drag to browse · Select a figure to see the design</p>
  <div class="sl-closer" hidden role="dialog" aria-modal="true" aria-labelledby="slc-title">
    <div class="slc-text">
      <span class="label slc-label"></span>
      <h2 id="slc-title"></h2>
      <p class="slc-line"></p>
      <a class="arrow slc-view" href="collection">View in the collection</a>
      <div class="slc-angles"></div>
      <nav class="slc-nav" aria-label="Other designs"><button class="slc-prev" type="button">← <span></span></button><span class="slc-count"></span><button class="slc-next" type="button"><span></span> →</button></nav>
    </div>
    <figure class="slc-fig"><img src="" alt=""><span class="sl-shadow"></span></figure>
    <aside class="slc-panel">
      <div class="slc-head"><span class="slc-count-pieces"></span><button class="slc-close" type="button">Close ×</button></div>
      <ul class="slc-list"></ul>
      <p class="slc-together" hidden></p>
      <a class="btn slc-enquire" href="order#whatsapp" target="_blank" rel="noopener">Order on WhatsApp</a>
      <a class="arrow slc-order" href="order#enquire">Order with your measurements</a>
      <p class="slc-note">Made to order from your measurements. Fabric availability and any changes are confirmed with you before production.</p>
    </aside>
  </div>
</section>'''

BAND = ''

# ---------------- HOME ----------------
home = f'''
<main>
<section class="hero" aria-label="Dúníyà">
  <img src="{P}hero.jpg" alt="Model in a moss-green sleeveless top against a copper backdrop, half her face dissolving into a soft blur">
  <div class="hero-copy">
    <h1><img src="{L}wordmark-cream.png" alt="Dúníyà"></h1>
    <p>The whole world</p>
  </div>
</section>

<section class="day sec">
  <div class="wrap statement">
    <div class="st-text rv">
      <span class="label">A clothing house · Lagos</span>
      <h2>Clothing for those who inhabit the world <em class="c">on purpose.</em></h2>
      <div class="prose">
        <p>DÚNÍYÀ means “the world”. We design modern, minimal clothing for women and men, and make each piece to order.</p>
        <p>Choose a design from the collection, give us your measurements, and order on WhatsApp or through the order form.</p>
      </div>
      <span style="display:flex;gap:26px;flex-wrap:wrap"><a class="arrow" href="collection">See the collection</a><a class="arrow" href="order">How to order</a></span>
    </div>
    {fig('plat4','Portrait of a model in the platinum sleeveless dress, arms folded', 'Platinum Sleeveless Dress', 'st-a rv zoom')}
    {fig('noir_shirt','Close view of a man adjusting the collar of a black textured camp-collar shirt', None, 'st-b rv')}
  </div>
</section>

{salon('<span class="label">The collection</span><a class="arrow" href="collection" style="color:var(--forest)">View all designs</a>')}

<section class="feature forest grain">
  <div class="f-img">{fig('trio','Three models: a man in a wine two-piece, a woman in a mustard shirt with lime-green trousers, and a man in a black camp-collar shirt with cream trousers', None, '', True)}</div>
  <div class="f-text rv">
    <span class="label">Together</span>
    <h2>Same house.<br><em class="c">Different expression.</em></h2>
    <p style="color:var(--mute-light);max-width:44ch">Women’s and men’s designs come from the same house and the same approach: considered shapes, clear proportions and nothing added without a reason.</p>
    <img class="inset" src="{P}pair.jpg" alt="A woman in a carmine top and a man in a burnt-orange tunic standing together" loading="lazy">
    <a class="arrow" href="lookbook">Open the lookbook</a>
  </div>
</section>

<section class="day sec">
  <div class="wrap two" style="align-items:center">
    <div class="rv" style="display:grid;gap:26px">
      <span class="label">Craft</span>
      <h2 class="pull">Made, <em>not</em> merely styled.</h2>
      <p style="color:var(--mute-dark);max-width:44ch">Patch pockets, shaped facings, notch necklines. The details you notice up close.</p>
      <a class="arrow" href="craft">See the details</a>
    </div>
    <div class="mosaic rv">
      {fig('cafe_pocket','Close-up of a topstitched patch pocket on the café top', None, 'm1 zoom')}
      {fig('tide','Striped top with shaped V-neck facing and button', None, 'm2 zoom')}
      {fig('noir_neck','Notch neckline on a black top', None, 'm3 zoom')}
      {fig('d_drape','Cape sleeve on the coral dress', None, 'm4 zoom')}
      {fig('d_placket','Stand collar and half placket on a white shirt', None, 'm5 zoom')}
    </div>
  </div>
</section>
{BAND}
<section class="feature flip stone">
  <div class="f-img">{fig('harvest_seated','Model in a mustard collared shirt and lime-green linen trousers, seated', None)}</div>
  <div class="f-text rv">
    <span class="label">Prices · made to order</span>
    <h2 style="color:var(--forest)">Simple <em class="c">prices.</em></h2>
    <dl class="prices">
      <div><dt>Shirt or top</dt><dd>₦20,000</dd></div>
      <div><dt>Trousers</dt><dd>₦20,000</dd></div>
      <div><dt>Dress</dt><dd>₦35,000</dd></div>
      <div><dt>Any two-piece outfit</dt><dd>₦40,000</dd></div>
    </dl>
    <p style="color:var(--mute-dark);max-width:46ch">The two-piece price applies to any two pieces ordered together. Each piece is made to your measurements. If you ask for a change that affects the price, we confirm the extra cost with you before production.</p>
    <span style="display:flex;gap:14px;flex-wrap:wrap"><a class="btn" href="collection">Choose a design</a><a class="btn ghost" href="order" style="color:var(--forest)">How to order</a></span>
  </div>
</section>

<section class="night sec">
  <div class="wrap">
    <div class="doors">
      <a class="door rv" href="collection#women"><img src="{P}plat_front.jpg" alt="" loading="lazy"><span><span class="label">I</span><h3>Women’s Wear</h3></span></a>
      <a class="door rv" href="collection#men"><img src="{P}onyx.jpg" alt="" loading="lazy"><span><span class="label">II</span><h3>Men’s Wear</h3></span></a>
      <a class="door rv" href="order"><img src="{P}moss.jpg" alt="" loading="lazy"><span><span class="label">III</span><h3>How to Order</h3></span></a>
      <a class="door rv" href="house"><img src="{P}lumen.jpg" alt="" loading="lazy"><span><span class="label">IV</span><h3>The House</h3></span></a>
    </div>
  </div>
</section>

<section class="forest sec grain">
  <div class="wrap cta-band">
    <h2>Made for you,<br><em class="c">to order.</em></h2>
    <span style="display:flex;gap:14px;flex-wrap:wrap"><a class="btn" href="collection">Choose a design</a><a class="btn ghost" data-wa="general" href="order#whatsapp">WhatsApp us</a></span>
  </div>
</section>
</main>'''
write('index.html','DÚNÍYÀ','DÚNÍYÀ is a clothing house in Lagos making modern, minimal clothing for women and men to order. Shirts and trousers from ₦20,000. Order on WhatsApp.', home)

# ---------------- HOUSE ----------------
house = f'''
<main>
<section class="ph ph-split day">
  <div class="ph-img"><img src="{P}plat4.jpg" alt="Portrait of a model in the platinum sleeveless dress, arms folded, looking away"></div>
  <div class="ph-text">
    <span class="label">The House</span>
    <h1 class="ph-title" style="color:var(--forest)">The whole <em>world.</em></h1>
    <p class="ph-lede">Dúníyà means “the world”. We are a clothing house in Lagos, designing modern, minimal clothing for women and men and making each piece to order.</p>
  </div>
</section>

<section class="day sec" style="padding-top:clamp(40px,6vw,80px)">
  <div class="wrap two">
    <h2 class="pull rv">Clothing chosen <em>with care.</em></h2>
    <div class="prose rv">
      <p>We design for people who think about what they wear. Our garments are relaxed but deliberate: clear shapes, considered proportions, and details that each have a reason to be there.</p>
      <p>The collection has women’s and men’s shirts, tops, trousers, dresses and two-piece outfits. Each piece is made to your measurements after you order.</p>
    </div>
  </div>
</section>

<section class="day" style="padding-bottom:clamp(72px,10vw,140px)">
  <div class="wide triptych">
    {fig('onyx','Man in the black notch-neck tunic and trousers', 'Black Notch-Neck Two-Piece', 'rv zoom')}
    {fig('plat_front','Woman in the platinum sleeveless dress with hands in its pockets', 'Platinum Sleeveless Dress', 'rv zoom')}
    {fig('lumen','Woman in the white two-pocket dress', 'White Two-Pocket Dress', 'rv zoom')}
  </div>
</section>

<section class="day sec">
  <div class="wrap cta-band">
    <h2 style="color:var(--forest)">See what the house <em class="c">makes.</em></h2>
    <span style="display:flex;gap:14px;flex-wrap:wrap"><a class="btn" href="collection">View the collection</a><a class="btn ghost" href="order" style="color:var(--forest)">How to order</a></span>
  </div>
</section>
</main>'''
write('house.html','The House · DÚNÍYÀ','DÚNÍYÀ is a clothing house in Lagos designing modern, minimal clothing for women and men, made to order.', house, 'plat4')

# ---------------- COLLECTION ----------------
coll = f'''
<main>
{salon('<h1 class="sl-title">Collection</h1><span class="label">Women’s &amp; Men’s Wear · made to order</span>')}
<section class="col-hero night grain">
  <div class="wrap">
    <div>
      <span class="label">The catalogue</span>
      <h2 class="ph-title" style="margin-top:18px">Every <em>design.</em></h2>
    </div>
    <div style="display:grid;gap:18px">
      <p class="ph-lede">Every design is made to order, to your measurements. Shirts, tops and trousers ₦20,000 · Dresses ₦35,000 · Any two pieces together ₦40,000.</p>
      <p class="ph-lede" style="font-size:15px">Open a design to see its details, then order on WhatsApp or with the order form.</p>
    </div>
  </div>
</section>

<div class="toolbar">
  <div class="wrap">
    <div class="filters" role="group" aria-label="Show category">
      <button class="chip" id="f-all" data-f="all" aria-pressed="true">All</button>
      <button class="chip" id="f-women" data-f="women" aria-pressed="false">Women’s Wear</button>
      <button class="chip" id="f-men" data-f="men" aria-pressed="false">Men’s Wear</button>
      <button class="chip" id="f-com" data-f="commission" aria-pressed="false">Custom Commissions</button>
    </div>
    <span class="label" style="color:var(--mute-light)"><span id="countShown">0</span> designs shown</span>
  </div>
  <div class="wrap subwrap"><div class="filters" id="subfilters" role="group" aria-label="Show type" hidden></div></div>
</div>

<section class="night catalogue-wrap">
  <div class="wrap" id="catalogue"></div>
</section>

<section class="day sec">
  <div class="wrap cta-band">
    <div style="display:grid;gap:14px">
      <h2 style="color:var(--forest)">Not sure which piece? <em class="c">Ask us.</em></h2>
      <p style="color:var(--mute-dark);max-width:52ch">Send a message with a question about any design, a fabric or colour you have in mind, or measurements.</p>
    </div>
    <a class="btn" data-wa="product" href="order#whatsapp">Ask on WhatsApp</a>
  </div>
</section>

<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-labelledby="lbName">
  <button class="lb-close" id="lbClose" aria-label="Close">×</button>
  <div class="lb-media">
    <div class="lb-main"><img id="lbImg" src="" alt=""></div>
    <div class="lb-thumbs" id="lbThumbs"></div>
  </div>
  <div class="lb-info">
    <span class="label" id="lbCat"></span>
    <h2 id="lbName"></h2>
    <p id="lbDesc"></p>
    <dl>
      <dt>Fabric</dt><dd id="lbFabric"></dd>
      <dt>Colour</dt><dd id="lbColour"></dd>
      <dt>Price</dt><dd id="lbPrice" class="lb-price"></dd>
      <dt id="lbWithRow">Shown with</dt><dd id="lbWith"></dd>
    </dl>
    <div class="lb-note">
      <p id="lbPair"></p>
      <b>Made to order.</b> This design is made to your measurements after you order. If the photographed fabric or colour is no longer available, we will tell you. Changes to fabric, length or fit are subject to confirmation, and any extra cost is agreed with you before production.
    </div>
    <div class="lb-cta">
      <a class="btn" id="lbForm" href="order#enquire">Order this design</a>
      <a class="btn ghost" id="lbWa" href="order#whatsapp" target="_blank" rel="noopener">Order on WhatsApp</a>
    </div>
    <p class="lb-how">“Order this design” lets you add your measurements and any changes. “Order on WhatsApp” opens a message that already names this design and its price.</p>
    <div class="lb-nav"><button id="lbPrev">← Previous</button><button id="lbNext">Next →</button></div>
  </div>
</div>
</main>'''
write('collection.html','Collection · DÚNÍYÀ','Women’s and men’s designs from DÚNÍYÀ, made to order. Shirts and trousers ₦20,000, dresses ₦35,000, two-piece outfits ₦40,000.', coll, 'plat_front')

# ---------------- LOOKBOOK ----------------
look = f'''
<main>
<section class="ph ph-bleed">
  <img src="{P}plat3.jpg" alt="Model in the platinum dress, one foot forward, against a copper backdrop" style="object-position:50% 30%">
  <div class="wrap">
    <span class="label" style="color:var(--copper-soft)">Lookbook · October 2026</span>
    <h1 class="ph-title">In six <em>acts.</em></h1>
    <p class="ph-lede">Arrival, presence, craft, connection, movement and an opening. The October 2026 shoot, in the order it was made. Captions link to each design in the collection.</p>
  </div>
</section>

<section class="day sec">
  <div class="wrap">
    <div class="act-head rv"><span class="act-num">I</span><div><span class="label">Arrival</span><h2 style="color:var(--forest);margin-top:12px">A person enters the space.</h2><p>Fragments first. The world before the clothes are fully shown.</p></div></div>
    <div class="arrival">
      {fig('plat1','Model in the platinum sleeveless dress standing in slanted window light', '<a href="collection#platinum-dress">Platinum Sleeveless Dress</a>', 'a1 rv zoom')}
      {fig('sandal_olive','Olive cut-out sandals', None, 'a2 rv zoom')}
      {fig('cafe_pocket','Patch pocket on the café-au-lait two-pocket shirt', None, 'a3 rv zoom')}
    </div>
  </div>
</section>

<section class="night sec grain">
  <div class="wrap">
    <div class="act-head rv"><span class="act-num">II</span><div><span class="label">Presence</span><h2 style="margin-top:12px">This is what DÚNÍYÀ looks like.</h2><p>Strong individual looks, full length, held still.</p></div></div>
  </div>
  <div class="wide presence">
    {fig('plat_front','Platinum sleeveless dress', '<a href="collection#platinum-dress">Platinum Sleeveless Dress</a>', 'rv zoom')}
    {fig('onyx','Black notch-neck two-piece', '<a href="collection#black-set">Black Notch-Neck Two-Piece</a>', 'rv zoom')}
    {fig('cafe','Café-au-lait two-pocket shirt with platinum trousers', '<a href="collection#cafe-shirt">Café-au-Lait Two-Pocket Shirt</a>', 'rv zoom')}
    {fig('white','White stand-collar two-piece', '<a href="collection#white-set">White Stand-Collar Two-Piece</a>', 'rv zoom')}
    {fig('lumen','White two-pocket dress', '<a href="collection#white-dress">White Two-Pocket Dress</a>', 'rv zoom')}
  </div>
</section>

<section class="stone sec">
  <div class="wrap">
    <div class="act-head rv"><span class="act-num">III</span><div><span class="label">Craft</span><h2 style="color:var(--forest);margin-top:12px">Made, not merely styled.</h2><p>Closer now. Facings, pockets, weaves and seams.</p></div></div>
    <div class="craftrow">
      {fig('tide','Shaped V-neck facing on the sky-blue striped top', '<a href="collection#striped-top">Sky-Blue Striped V-Neck Top</a>', 'rv zoom')}
      {fig('noir_neck','Notch neckline in black cloth', '<a href="collection#black-set">Black Notch-Neck Two-Piece</a>', 'rv zoom')}
      {fig('olive2','Back of the olive printed camp-collar shirt', '<a href="collection#olive-shirt">Olive Printed Camp-Collar Shirt</a>', 'rv zoom')}
    </div>
    <p style="margin-top:32px"><a class="arrow" href="craft">More on craft</a></p>
  </div>
</section>

<section class="forest sec grain">
  <div class="wrap">
    <div class="act-head rv"><span class="act-num">IV</span><div><span class="label">Connection</span><h2 style="margin-top:12px">Men and women in one world.</h2><p>Different garments and personalities in a shared environment.</p></div></div>
    <div class="connection">
      {fig('trio','Three models together: a wine two-piece, a mustard shirt with lime-green trousers, and a black camp-collar shirt with cream trousers', 'Shown: <a href="collection#mustard-shirt">Mustard V-Neck Collared Shirt</a>, <a href="collection#lime-trousers">Lime-Green Linen Trousers</a>, <a href="collection#black-shirt">Black Textured Camp-Collar Shirt</a>, <a href="collection#cream-trousers">Cream Textured Trousers</a>', 'rv zoom')}
      {fig('pair','A woman in a carmine V-neck top and a man in a burnt-orange tunic', 'Shown: <a href="collection#carmine-top">Japanese Carmine V-Neck Top</a>, <a href="collection#orange-tunic">Burnt-Orange Notch-Neck Tunic</a>', 'rv zoom')}
    </div>
  </div>
</section>

<section class="night sec">
  <div class="wrap">
    <div class="act-head rv"><span class="act-num">V</span><div><span class="label">Movement</span><h2 style="margin-top:12px">Walking, turning, stillness.</h2><p>Loose silhouettes are meant to move. Scroll sideways.</p></div></div>
  </div>
  <div class="movement" tabindex="0" aria-label="Movement sequence, scroll sideways">
    {fig('moss','Model walking in the moss-green two-piece', '<span class="step">walking</span>')}
    {fig('ember','Model turning in the coral dress', '<span class="step">turning</span>')}
    {fig('moss2','Back of the moss two-piece', '<span class="step">passing</span>')}
    {fig('lime_sandal','Lime trousers and olive sandal mid-step', '<span class="step">the fabric moves</span>')}
    {fig('harvest_seated','Model seated in the mustard shirt and lime-green trousers', '<span class="step">stillness</span>')}
  </div>
</section>

<section class="opening">
  <img src="{P}plat6.jpg" alt="Model in the platinum dress walking away from the camera" loading="lazy">
  <div class="wrap">
    <span class="label" style="color:var(--copper-soft)">VI · Opening</span>
    <h2>This isn’t the end of the story.</h2>
    <a class="btn" href="collection">See the collection</a>
  </div>
</section>
</main>'''
write('lookbook.html','Lookbook · DÚNÍYÀ','The DÚNÍYÀ October 2026 shoot, told in six acts.', look, 'plat3')

# ---------------- CRAFT ----------------
craft = f'''
<main>
<section class="ph ph-bleed">
  <img src="{P}noir_neck.jpg" alt="Close-up of a notch neckline in black cloth" style="object-position:50% 20%">
  <div class="wrap">
    <span class="label" style="color:var(--copper-soft)">Craft</span>
    <h1 class="ph-title">Made, <em>not</em> merely styled.</h1>
    <p class="ph-lede">How we approach materials, tailoring and detail. Tap the numbered markers on each photograph to see what to look for.</p>
  </div>
</section>

<section class="day sec">
  <div class="wrap annot">
    <div class="hot rv" data-notes="n1">
      <img src="{P}cafe_pocket.jpg" alt="Close-up of the patch pocket on the café-au-lait two-pocket shirt" loading="lazy">
      <button class="pin" style="left:19%;top:20%" data-k="a" aria-label="Pocket corner">1</button>
      <button class="pin" style="left:52%;top:34%" data-k="b" aria-label="Pocket topstitch">2</button>
      <button class="pin" style="left:40%;top:69%" data-k="c" aria-label="Hem">3</button>
    </div>
    <div class="rv" style="display:grid;gap:26px">
      <span class="label">Detail · <a href="collection#cafe-shirt" style="color:inherit">Café-au-Lait Two-Pocket Shirt</a></span>
      <h2 class="pull">The pocket is part of the shape.</h2>
      <ol class="notes" id="n1">
        <li data-k="a"><span class="k">1</span><div><h3>Squared corners</h3><p>The patch pocket is folded to a clean right angle at each corner.</p></div></li>
        <li data-k="b"><span class="k">2</span><div><h3>A second line of stitching</h3><p>A line of stitching runs across the pocket, below its opening.</p></div></li>
        <li data-k="c"><span class="k">3</span><div><h3>A stitched hem</h3><p>The hem is turned and stitched in a thread close to the colour of the cloth.</p></div></li>
      </ol>
    </div>
  </div>
</section>

<section class="stone sec">
  <div class="wrap annot flip">
    <div class="hot rv" data-notes="n2">
      <img src="{P}tide.jpg" alt="Striped top with a shaped V-neck facing and a single button" loading="lazy">
      <button class="pin" style="left:62%;top:12%" data-k="a" aria-label="Neck facing">1</button>
      <button class="pin" style="left:40%;top:21%" data-k="b" aria-label="Button">2</button>
      <button class="pin" style="left:8%;top:34%" data-k="c" aria-label="Cap sleeve">3</button>
    </div>
    <div class="rv" style="display:grid;gap:26px">
      <span class="label">Detail · <a href="collection#striped-top" style="color:inherit">Sky-Blue Striped V-Neck Top</a></span>
      <h2 class="pull">Stripes, turned on purpose.</h2>
      <ol class="notes" id="n2">
        <li data-k="a"><span class="k">1</span><div><h3>Shaped facing</h3><p>The V-neck facing is cut on a different line, so the stripes change direction around the neck.</p></div></li>
        <li data-k="b"><span class="k">2</span><div><h3>One button</h3><p>A single button closes the placket at the base of the V.</p></div></li>
        <li data-k="c"><span class="k">3</span><div><h3>Cap sleeve</h3><p>A short cap sleeve keeps the line of the top relaxed.</p></div></li>
      </ol>
    </div>
  </div>
</section>

<section class="forest sec grain">
  <div class="wrap two" style="align-items:center">
    <div class="rv" style="display:grid;gap:22px">
      <span class="label">Materials</span>
      <h2 style="font-size:clamp(40px,5vw,72px)">Fabric, <em class="c">confirmed with you.</em></h2>
    </div>
    <div class="prose rv" style="color:var(--mute-light)">
      <p>We choose fabrics for how they look, move and wear on the body. Where a garment’s fabric is confirmed, you will find it listed with the design in the collection.</p>
      <p>Fabric availability changes from one order to the next. Before we make anything, we confirm with you which fabric and colour are available for your piece, and tell you if the one photographed can no longer be supplied.</p>
    </div>
  </div>
</section>

<section class="day sec">
  <div class="wrap">
    <div class="act-head rv" style="grid-template-columns:1fr"><div><span class="label">How to recognise it</span><h2 style="color:var(--forest);margin-top:14px">Recognised without a logo.</h2></div></div>
    <div class="principles">
      <div class="principle rv"><img src="{P}d_drape.jpg" alt="Cape sleeve of the coral dress" loading="lazy"><h3>Silhouette</h3><p>Relaxed shapes with a clear structure, like the cape sleeve on the coral-red linen dress.</p></div>
      <div class="principle rv"><img src="{P}d_waist.jpg" alt="Side vent of the moss two-piece" loading="lazy"><h3>Proportion</h3><p>Cropped tops over ¾ trousers. Lengths are decided, not defaulted.</p></div>
      <div class="principle rv"><img src="{P}noir_shirt.jpg" alt="Textured black cloth on the camp-collar shirt" loading="lazy" style="object-position:30% 60%"><h3>Material</h3><p>Texture can do the work. A textured black cloth needs no pattern.</p></div>
      <div class="principle rv"><img src="{P}d_placket.jpg" alt="Half placket and stand collar of the white shirt" loading="lazy"><h3>Construction</h3><p>A stand collar and half placket, cut and pressed clean.</p></div>
      <div class="principle rv"><img src="{P}olive2.jpg" alt="Printed olive cloth on the camp-collar shirt" loading="lazy"><h3>Restraint</h3><p>One print, one colour, one idea per garment.</p></div>
      <div class="principle rv"><img src="{P}wine_sandal.jpg" alt="Hem of wine trousers with striped sandals" loading="lazy" style="object-position:50% 20%"><h3>Purposeful detail</h3><p>A contrast stitch at the hem, seen only when you look.</p></div>
    </div>
  </div>
</section>

<section class="night sec grain">
  <div class="wrap">
    <span class="label">How a piece is made</span>
    <div class="process" style="margin-top:28px">
      <div class="rv"><span class="label">01</span><h3>Your request</h3><p>You choose a design, ask for a variation, or send us an idea.</p></div>
      <div class="rv"><span class="label">02</span><h3>Confirmation</h3><p>We confirm the fabric available and, for any change you ask for, whether it can be made and any extra cost.</p></div>
      <div class="rv"><span class="label">03</span><h3>Measurements</h3><p>You send your measurements, or we help you take them.</p></div>
      <div class="rv"><span class="label">04</span><h3>Tailoring</h3><p>Once everything is agreed, your garment is made through our tailoring network.</p></div>
    </div>
  </div>
</section>

<section class="day sec">
  <div class="wrap cta-band">
    <h2 style="color:var(--forest)">Questions about a <em class="c">fabric or detail?</em></h2>
    <a class="btn" data-wa="fabric" href="order#whatsapp">Ask on WhatsApp</a>
  </div>
</section>
</main>'''
write('craft.html','Craft · DÚNÍYÀ','How DÚNÍYÀ approaches materials, tailoring and detail in made-to-order clothing.', craft, 'cafe_pocket')

# ---------------- ORDER ----------------
order = f'''
<main>
<section class="ph ph-split stone">
  <div class="ph-text" style="order:0">
    <span class="label">How to Order</span>
    <h1 class="ph-title" style="color:var(--forest)">Make it <em>yours.</em></h1>
    <p class="ph-lede">Every DÚNÍYÀ piece is made to your measurements. Choose a design, add your measurements and any changes, then send your order here or on WhatsApp.</p>
    <p style="display:flex;gap:14px;flex-wrap:wrap"><a class="btn" href="#enquire">Start your order</a><a class="btn ghost" data-wa="general" href="#whatsapp" style="color:var(--forest)">WhatsApp us</a></p>
  </div>
  <div class="ph-img"><img src="{P}wine_sandal.jpg" alt="Seated man in wine trousers and striped sandals" style="object-position:50% 30%"></div>
</section>

<section class="day sec">
  <div class="wrap">
    <div>
        <span class="label">How ordering works</span>
        <ol class="steps five" style="margin-top:28px">
          <li class="step rv"><span class="n">1</span><h3>Choose</h3><p>Pick a design from the <a href="collection">collection</a> and see its price.</p></li>
          <li class="step rv"><span class="n">2</span><h3>Measure</h3><p>Enter your measurements, or ask us to help you measure.</p></li>
          <li class="step rv"><span class="n">3</span><h3>Customise</h3><p>Tell us about any change to fabric, colour, length or fit.</p></li>
          <li class="step rv"><span class="n">4</span><h3>Send</h3><p>Send your order with the form below or continue on WhatsApp.</p></li>
          <li class="step rv"><span class="n">5</span><h3>Confirm</h3><p>We confirm the details with you before your piece is made.</p></li>
        </ol>
    </div>
    <div class="price-list rv">
      <span class="label">Prices</span>
      <dl class="prices">
        <div><dt>Shirt or top</dt><dd>₦20,000</dd></div>
        <div><dt>Trousers</dt><dd>₦20,000</dd></div>
        <div><dt>Dress</dt><dd>₦35,000</dd></div>
        <div><dt>Any two-piece outfit</dt><dd>₦40,000</dd></div>
      </dl>
      <p class="note-line">The two-piece price applies to any two pieces ordered together. If a change you ask for affects the price, we confirm the extra cost with you before production.</p>
    </div>
  </div>
</section>

<section class="night sec grain" id="enquire">
  <div class="wrap enquire">
    <div class="enq-intro rv">
      <span class="label">Order form</span>
      <h2>Your <em class="c">order.</em></h2>
      <p>Fill in what you can. A person from DÚNÍYÀ will reply by WhatsApp or phone call to confirm your order before anything is made.</p>
      <p class="enq" id="enquiry" hidden></p>
      <figure class="enq-img"><img src="{P}cafe_pocket.jpg" alt="Close-up of the patch pocket on the café-au-lait two-pocket shirt" loading="lazy"></figure>
    </div>
    <form class="eform" id="eform" novalidate>
      <div class="f-step"><span class="f-n">1</span><h3>The design</h3></div>
      <div class="field"><label for="f-design">Design</label><select id="f-design" name="design" required></select><span class="err" id="e-design"></span></div>
      <div class="field" id="pairField" hidden><label for="f-pair">Add a second piece? <i>optional</i></label><select id="f-pair" name="pair"></select><span class="hint">Any two pieces together are ₦40,000.</span></div>
      <div class="f-price" id="f-price" aria-live="polite"></div>

      <fieldset class="field" id="sizeField" hidden>
        <legend><span class="f-step-inline"><span class="f-n">2</span>Size and measurements</span></legend>
        <p class="hint" style="margin:0 0 6px">There is no approved standard size chart yet, so each piece is made from your own measurements.</p>
        <div class="opts">
          <label class="opt"><input type="radio" name="measure" value="enter" checked><span>I’ll enter my measurements</span></label>
          <label class="opt"><input type="radio" name="measure" value="help"><span>Please help me measure</span></label>
        </div>
        <div id="measWrap">
          <div class="opts unit" role="group" aria-label="Unit">
            <label class="opt"><input type="radio" name="unit" value="inches" checked><span>Inches</span></label>
            <label class="opt"><input type="radio" name="unit" value="cm"><span>Centimetres</span></label>
          </div>
          <div id="f-meas"></div>
          <p class="hint">Measure over light clothing with a soft tape. Leave any field you’re unsure of blank and we’ll go through it with you.</p>
        </div>
        <span class="err" id="e-measure"></span>
      </fieldset>

      <fieldset class="field">
        <legend><span class="f-step-inline"><span class="f-n">3</span>Customisation <i>optional</i></span></legend>
        <div class="opts">
          <label class="opt"><input type="checkbox" name="custom" value="Fabric or colour"><span>Fabric or colour</span></label>
          <label class="opt"><input type="checkbox" name="custom" value="Length"><span>Length</span></label>
          <label class="opt"><input type="checkbox" name="custom" value="Fit"><span>Fit</span></label>
          <label class="opt"><input type="checkbox" name="custom" value="Other design change"><span>Other change</span></label>
        </div>
        <textarea id="f-custom" name="customdetail" rows="3" maxlength="600" placeholder="Describe the change, e.g. “trousers 2 inches longer” or “the dress in black”."></textarea>
        <span class="hint">Changes are subject to confirmation. If a change affects the price, we confirm the extra cost with you before production.</span>
      </fieldset>

      <div class="f-step"><span class="f-n">4</span><h3>Your details</h3></div>
      <div class="f-row two">
        <div class="field"><label for="f-name">Full name</label><input id="f-name" name="name" autocomplete="name" required maxlength="80"><span class="err" id="e-name"></span></div>
        <div class="field"><label for="f-phone">Phone / WhatsApp</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="0803 000 0000" required maxlength="30"><span class="err" id="e-phone"></span></div>
      </div>
      <div class="f-row two">
        <div class="field"><label for="f-email">Email <i>optional</i></label><input id="f-email" name="email" type="email" autocomplete="email" maxlength="120"><span class="err" id="e-email"></span></div>
        <div class="field"><label for="f-city">City</label><input id="f-city" name="city" autocomplete="address-level2" placeholder="Lagos" required maxlength="60"><span class="err" id="e-city"></span></div>
      </div>
      <fieldset class="field">
        <legend>How should we reach you?</legend>
        <div class="opts">
          <label class="opt"><input type="radio" name="contact" value="WhatsApp" checked><span>WhatsApp</span></label>
          <label class="opt"><input type="radio" name="contact" value="Call"><span>Phone call</span></label>
          <label class="opt"><input type="radio" name="contact" value="Either"><span>Either</span></label>
        </div>
      </fieldset>
      <div class="f-row two">
        <div class="field"><label for="f-needby">Needed by <i>optional</i></label><input id="f-needby" name="needby" type="date"><span class="hint">We will tell you whether this date is possible.</span></div>
        <div class="field hp" aria-hidden="true"><label for="f-website">Website</label><input id="f-website" name="website" tabindex="-1" autocomplete="off"></div>
      </div>
      <div class="field"><label for="f-message">Anything else <i>optional</i></label><textarea id="f-message" name="message" rows="3" maxlength="1000" placeholder="An occasion, a question, or details of a custom commission…"></textarea></div>
      <div class="f-foot">
        <p class="f-privacy">We use these details only to reply to your order. You can send reference photos once we are in touch on WhatsApp.</p>
        <div class="f-btns">
          <button class="btn" type="submit" id="f-submit">Send order</button>
          <button class="btn ghost" type="button" id="f-wa">Continue on WhatsApp</button>
        </div>
      </div>
      <p class="f-status" id="f-status" role="status" aria-live="polite"></p>
    </form>
    <div class="f-done" id="f-done" hidden tabindex="-1">
      <img src="{L}seal-cream.png" alt="" width="64" height="64">
      <span class="label">Order received</span>
      <h2 id="d-title">Thank you.</h2>
      <p id="d-text"></p>
      <p class="d-ref" id="d-ref"></p>
      <a class="arrow" href="collection">Back to the collection</a>
    </div>
  </div>
</section>

<section class="night sec grain" id="whatsapp" style="padding-top:0">
  <div class="wrap">
    <div class="wa">
      <div>
        <span class="label">WhatsApp</span>
        <h2 style="margin-top:14px">Message DÚNÍYÀ</h2>
        <p>To order a specific design, use “Order on WhatsApp” on that design in the <a href="collection">collection</a>, or “Continue on WhatsApp” in the form above: your message will name the design and price. For anything else, choose a topic.</p>
        <div class="wa-topics">
          <a class="btn" data-wa="product" href="#whatsapp">A question about a design</a>
          <a class="btn ghost" data-wa="fabric" href="#whatsapp">A fabric or colour change</a>
          <a class="btn ghost" data-wa="measure" href="#whatsapp">Help with measurements</a>
          <a class="btn ghost" data-wa="commission" href="#whatsapp">A custom commission</a>
          <a class="btn ghost" data-wa="general" href="#whatsapp">Something else</a>
        </div>
      </div>
      <div class="wa-num">
        <span class="label">Our number</span>
        <div class="num">
          <code id="waNum">+234 815 901 9324</code>
          <button class="btn" id="copyBtn">Copy number</button>
        </div>
        <p class="toast" id="toast" aria-live="polite"></p>
      </div>
    </div>
  </div>
</section>

<section class="stone sec" id="faq">
  <div class="wrap two">
    <div class="rv">
      <span class="label">Questions</span>
      <h2 class="pull" style="margin-top:22px">Before you <em>order.</em></h2>
    </div>
    <div class="faq rv">
      <details><summary>How much does a design cost?</summary><p>Shirts and tops are ₦20,000, trousers ₦20,000, dresses ₦35,000, and any two-piece outfit ₦40,000. The two-piece price applies to any two pieces ordered together.</p></details>
      <details><summary>Are the designs in stock?</summary><p>Designs are made to order, so your piece is made after we confirm your order. We confirm availability and timing with you.</p></details>
      <details><summary>Do you have standard sizes?</summary><p>There is no standard size chart yet. Each piece is made from your measurements. If you’re unsure how to measure, choose “Please help me measure” and we’ll take you through it.</p></details>
      <details><summary>Can I change the fabric, colour, length or fit?</summary><p>Tell us the change in the order form or on WhatsApp. Changes are subject to confirmation. If a change affects the price, we confirm the extra cost with you before production.</p></details>
      <details><summary>How long does it take, and how is it delivered?</summary><p>Timing, payment and delivery arrangements are confirmed with you before the order goes ahead.</p></details>
      <details><summary>Can you make something that isn’t in the collection?</summary><p>Choose “custom commission” in the order form or message us on WhatsApp with a reference or your idea. We will tell you honestly whether we can make it and what it will cost.</p></details>
    </div>
  </div>
</section>
</main>'''
write('order.html','How to Order · DÚNÍYÀ','How to order from DÚNÍYÀ: choose a design, add your measurements and any changes, and order on WhatsApp or online.', order, 'wine_sandal')

print('ok')

# ---------------- 404 ----------------
nf = f'''
<main>
<section class="ph ph-bleed" style="min-height:clamp(520px,80vh,860px)">
  <img src="{P}plat6.jpg" alt="Model in the platinum dress walking away" style="object-position:50% 35%">
  <div class="wrap">
    <span class="label" style="color:var(--copper-soft)">Page not found</span>
    <h1 class="ph-title">This path <em>wanders off.</em></h1>
    <p class="ph-lede">The page you were looking for isn’t here. It may have moved, or the address may have a typo.</p>
    <p style="display:flex;gap:14px;flex-wrap:wrap"><a class="btn" href="./">Back home</a><a class="btn ghost" href="collection">See the collection</a></p>
  </div>
</section>
</main>'''
write('404.html','Page not found · DÚNÍYÀ','This page could not be found.', nf, 'plat6')
