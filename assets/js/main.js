(function(){
  const looks = [
    {n:'06',name:'Platinum',g:'w',a:'plat1',b:'plat6',d:'Platinum hessian-linen sleeveless dress with a centre seam'},
    {n:'07',name:'Ember',g:'w',a:'ember',d:'Coral-red linen dress with cape sleeves and side slits'},
    {n:'09',name:'Moss',g:'w',a:'moss',b:'moss2',d:'Dark moss-green sleeveless top with matching ¾ pants'},
    {n:'02',name:'Café',g:'w',a:'cafe',b:'cafe2',d:'Café-au-lait cotton two-pocket top with platinum hessian-linen pants'},
    {n:'M1',name:'Stillwater',g:'m',a:'white',d:'White stand-collar half-placket shirt with straight trousers'},
    {n:'M2',name:'Vine',g:'m',a:'olive',d:'Olive printed camp-collar shirt with cream textured trousers'}
  ];
  const wrap = document.getElementById('looks');
  wrap.innerHTML = looks.map(l => `
    <article class="look" data-g="${l.g}">
      <div class="photo${l.b?' has-alt':''}">
        <img src="assets/img/photos/${l.a}.jpg" alt="${l.name}: ${l.d}" loading="lazy">
        ${l.b?`<img class="alt" src="assets/img/photos/${l.b}.jpg" alt="" loading="lazy">`:''}
        <span class="tag">${l.g==='w'?'Women':'Men'}</span>
      </div>
      <div class="meta"><span class="label">Look ${l.n}</span><a href="#order">Enquire</a></div>
      <h3>${l.name}</h3>
      <p class="pair">${l.d}</p>
    </article>`).join('');

  document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x===c));
    const f = c.dataset.f;
    wrap.querySelectorAll('.look').forEach(el => el.hidden = !(f==='all' || el.dataset.g===f));
  }));

  /* band */
  const words = ['Linen','<i>journey</i>','Cotton','<i>creation</i>','Poplin','<i>craft</i>','Jonkoso','<i>light</i>','Chambray','<i>the whole world</i>'];
  const row = words.map(w => `<span>${w}</span>`).join('');
  document.getElementById('band').innerHTML = row + row;

  /* menu */
  const ov = document.getElementById('overlay');
  document.getElementById('menuOpen').onclick = () => { ov.hidden = false; document.body.style.overflow='hidden'; };
  const close = () => { ov.hidden = true; document.body.style.overflow=''; };
  document.getElementById('menuClose').onclick = close;
  ov.querySelectorAll('nav a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key==='Escape' && !ov.hidden) close(); });

  /* copy */
  const toast = document.getElementById('toast');
  document.getElementById('copyBtn').addEventListener('click', () => {
    const txt = document.getElementById('waNum').textContent;
    const fallback = () => { const r=document.createRange(); r.selectNodeContents(document.getElementById('waNum')); const s=getSelection(); s.removeAllRanges(); s.addRange(r); toast.textContent='Selected. Copy with your keyboard.'; };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(()=>toast.textContent='Copied', fallback); else fallback();
  });

  /* gentle reveal: content visible at rest, nudged in on scroll */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const els = [...document.querySelectorAll('.rv')].filter(el => el.getBoundingClientRect().top > innerHeight);
    els.forEach(el => el.classList.add('pre'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } }), {threshold:.12});
    els.forEach(el => io.observe(el));
  }
})();
