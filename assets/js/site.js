(() => {
  const header = document.querySelector('[data-header]');
  const footer = document.querySelector('[data-footer]');
  const path = location.pathname.split('/').pop() || 'index.html';
  const nav = [['Home','index.html'],['About','about.html'],['Expertise','expertise.html'],['Projects','projects.html'],['Contact','contact.html']];
  if (header) {
    header.innerHTML = `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="container nav-shell"><a class="brand" href="index.html" aria-label="Chinmay Kadam home"><span class="brand-mark">CK</span><span>Chinmay Kadam</span></a><button class="menu-toggle" aria-expanded="false" aria-controls="primary-navigation">Menu</button><nav class="nav-links" id="primary-navigation" aria-label="Main navigation">${nav.map(([label,url]) => `<a href="${url}"${path===url?' class="active" aria-current="page"':''}>${label}</a>`).join('')}<a class="nav-cta" href="contact.html">Get in Touch ↗</a></nav></div></header>`;
    const toggle = header.querySelector('.menu-toggle'), links = header.querySelector('.nav-links');
    const closeMenu = (focus=false) => { links.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); if (focus) toggle.focus(); };
    toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); links.classList.toggle('open', open); if(open) links.querySelector('a')?.focus(); });
    links.addEventListener('keydown', e => { if(e.key==='Escape') closeMenu(true); });
    links.addEventListener('click', e => { if(e.target.closest('a')) closeMenu(); });
    document.addEventListener('click', e => { if(!header.contains(e.target)) closeMenu(); });
    window.addEventListener('resize', () => { if(window.innerWidth>767) closeMenu(); });
  }
  if (footer) footer.innerHTML = `<footer class="site-footer"><div class="container"><div class="footer-grid"><div><a class="brand footer-brand" href="index.html"><span class="brand-mark">CK</span><span>Chinmay Kadam</span></a><p class="footer-statement">Urban Planning, Redevelopment &amp; Public Sector Advisory. Procurement · Infrastructure · Feasibility · Land Strategy.</p></div><div><div class="footer-title">QUICK LINKS</div><div class="footer-links">${nav.map(([label,url])=>`<a href="${url}">${label}</a>`).join('')}</div></div><div><div class="footer-title">CONTACT</div><div class="footer-contact"><a href="mailto:chinmay20kadam@gmail.com">chinmay20kadam@gmail.com</a><br><a href="tel:+919324285345">+91 93242 85345</a><br><a href="https://www.linkedin.com/in/chinmaytheurbanplanner" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div></div></div><p class="footer-note">Selected project experience was gained through professional employment and does not imply endorsement by KPMG, TECHCOMM or the named public authorities.</p><div class="footer-bottom"><span>© <span data-year></span> Chinmay Kadam</span><span>Mumbai / Thane · Bhopal — professional geographies</span></div></div></footer>`;
  document.querySelectorAll('.breadcrumbs').forEach(crumb => {
    const parts = crumb.textContent.split('/').map(part => part.trim()).filter(Boolean);
    const isProjectDetail = path.startsWith('project-');
    const current = parts[parts.length - 1] || 'PAGE';
    crumb.setAttribute('aria-label', 'Breadcrumb');
    crumb.replaceChildren();
    const home = document.createElement('a'); home.className = 'crumb-home'; home.href = 'index.html'; home.setAttribute('aria-label', 'Home');
    home.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 10 8.5-7 8.5 7v10.5h-6v-7h-5v7h-6z"/></svg>';
    crumb.append(home);
    if (isProjectDetail) {
      const divider = document.createElement('span'); divider.className = 'crumb-divider'; divider.textContent = '/'; divider.setAttribute('aria-hidden','true'); crumb.append(divider);
      const projects = document.createElement('a'); projects.href = 'projects.html'; projects.textContent = 'Projects'; crumb.append(projects);
      const divider2 = divider.cloneNode(true); crumb.append(divider2);
    } else {
      const divider = document.createElement('span'); divider.className = 'crumb-divider'; divider.textContent = '/'; divider.setAttribute('aria-hidden','true'); crumb.append(divider);
    }
    const currentLabel = document.createElement('span'); currentLabel.setAttribute('aria-current','page'); currentLabel.textContent = current; crumb.append(currentLabel);
  });
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const mapCanvas = document.querySelector('[data-urban-canvas]');
  if (mapCanvas) {
    const ctx = mapCanvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0, height = 0, frame = 0, running = false, start = 0;
    const routes = [
      { color: '#D6A64F', points: [[.05,.69],[.20,.65],[.31,.51],[.47,.48],[.59,.36],[.76,.34],[.94,.20]] },
      { color: '#E8EDF3', points: [[.17,.17],[.28,.31],[.43,.42],[.47,.48],[.58,.62],[.78,.68],[.94,.59]] },
      { color: '#E8C77E', points: [[.06,.43],[.22,.45],[.36,.39],[.47,.48],[.65,.51],[.80,.46],[.95,.43]] }
    ];
    const resize = () => {
      const rect = mapCanvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      mapCanvas.width = Math.round(width*dpr); mapCanvas.height = Math.round(height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      if (reduceMotion) draw(0);
    };
    const point = p => [p[0]*width,p[1]*height];
    const along = (points,t) => {
      const scaled=t*(points.length-1), index=Math.min(Math.floor(scaled),points.length-2), mix=scaled-index;
      const a=point(points[index]), b=point(points[index+1]);
      return [a[0]+(b[0]-a[0])*mix,a[1]+(b[1]-a[1])*mix];
    };
    function draw(seconds) {
      if (!ctx || !width || !height) return;
      ctx.clearRect(0,0,width,height);
      const glow=ctx.createRadialGradient(width*.53,height*.46,5,width*.53,height*.46,width*.75);
      glow.addColorStop(0,'rgba(20,43,69,.3)'); glow.addColorStop(1,'rgba(13,32,53,0)');
      ctx.fillStyle=glow; ctx.fillRect(0,0,width,height);
      const cell=Math.max(23,Math.min(36,width/22));
      ctx.lineWidth=.65; ctx.strokeStyle='rgba(229,228,226,.15)';
      for(let x=-cell; x<width+cell; x+=cell){ctx.beginPath();ctx.moveTo(x+Math.sin(seconds*.18+x*.01)*4,0);ctx.lineTo(x+Math.sin(seconds*.18+x*.01+1)*4,height);ctx.stroke();}
      for(let y=cell*.65; y<height; y+=cell*.78){ctx.beginPath();ctx.moveTo(0,y+Math.sin(seconds*.16+y*.03)*3);ctx.lineTo(width,y+Math.sin(seconds*.16+y*.03+1)*3);ctx.stroke();}
      for(let row=0;row<5;row++) for(let col=0;col<9;col++){
        const x=width*(.055+col*.105), y=height*(.13+row*.145), w=width*.074, h=height*.095;
        const variation=(row*7+col*3)%11;
        ctx.fillStyle=variation===0?'rgba(214,166,79,.16)':variation===5?'rgba(232,237,243,.12)':'rgba(13,32,53,.3)';
        ctx.fillRect(x,y,w,h); ctx.strokeStyle='rgba(229,228,226,.2)';ctx.lineWidth=.7;ctx.strokeRect(x,y,w,h);
        ctx.fillStyle='rgba(232,199,126,.38)';ctx.fillRect(x+4,y+4,Math.max(3,w*.16),1);
      }
      const polygon=pts=>{ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath()};
      for(let row=0;row<5;row++) for(let col=0;col<9;col++){
        const cx=width*(.075+col*.105+row*.013), cy=height*(.29+row*.105), rx=Math.max(5,width*.015), ry=Math.max(3,height*.017);
        const hash=(row*13+col*7)%9, elevation=height*(.035+(hash/9)*.12);
        const base=[[cx-rx,cy],[cx,cy-ry],[cx+rx,cy],[cx,cy+ry]];
        const roof=base.map(([x,y])=>[x,y-elevation]);
        ctx.fillStyle='rgba(20,43,69,.22)';polygon(base);ctx.fill();ctx.strokeStyle='rgba(232,237,243,.28)';ctx.lineWidth=.65;ctx.stroke();
        polygon([base[0],base[3],roof[3],roof[0]]);ctx.fillStyle='rgba(13,32,53,.97)';ctx.fill();ctx.strokeStyle='rgba(214,166,79,.4)';ctx.stroke();
        polygon([base[2],base[3],roof[3],roof[2]]);ctx.fillStyle='rgba(30,58,89,.97)';ctx.fill();ctx.strokeStyle='rgba(214,166,79,.34)';ctx.stroke();
        polygon(roof);ctx.fillStyle=hash===2?'rgba(214,166,79,.96)':hash===6?'rgba(232,237,243,.92)':'rgba(20,43,69,.98)';ctx.fill();ctx.strokeStyle='rgba(232,199,126,.55)';ctx.stroke();
        ctx.strokeStyle='rgba(232,199,126,.5)';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(roof[0][0]+2,roof[0][1]-2);ctx.lineTo(roof[0][0]+2,base[0][1]-4);ctx.stroke();
      }
      routes.forEach((route,ri)=>{
        ctx.save();ctx.beginPath();route.points.forEach((p,i)=>{const [x,y]=point(p);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});
        ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=route.color;ctx.globalAlpha=.16;ctx.lineWidth=8;ctx.shadowColor=route.color;ctx.shadowBlur=14;ctx.stroke();
        ctx.globalAlpha=.82;ctx.lineWidth=1.6;ctx.shadowBlur=5;ctx.stroke();ctx.restore();
        route.points.forEach((p,i)=>{const [x,y]=point(p), pulse=(seconds*.72+ri*.23+i*.17)%1, radius=4+pulse*11;
          ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.strokeStyle=route.color;ctx.globalAlpha=(1-pulse)*.33;ctx.lineWidth=1;ctx.stroke();ctx.globalAlpha=1;
          ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fillStyle=route.color;ctx.shadowColor=route.color;ctx.shadowBlur=9;ctx.fill();ctx.shadowBlur=0;
        });
        for(let i=0;i<3;i++){const p=along(route.points,(seconds*(.065+ri*.009)+i/3+ri*.14)%1);const dot=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],8);dot.addColorStop(0,'#ffffff');dot.addColorStop(.2,route.color);dot.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=dot;ctx.fillRect(p[0]-8,p[1]-8,16,16);}
      });
      const scan=(seconds*28)%(width+40)-20;const beam=ctx.createLinearGradient(scan-9,0,scan+9,0);beam.addColorStop(0,'rgba(214,166,79,0)');beam.addColorStop(.5,'rgba(214,166,79,.19)');beam.addColorStop(1,'rgba(214,166,79,0)');ctx.fillStyle=beam;ctx.fillRect(scan-9,0,18,height);
    }
    const animate=now=>{if(!running)return;if(!start)start=now;draw((now-start)/1000);frame=requestAnimationFrame(animate)};
    const mapObserver=new IntersectionObserver(entries=>{const visible=entries.some(e=>e.isIntersecting);if(visible&&!running&&!reduceMotion){running=true;frame=requestAnimationFrame(animate)}else if(!visible&&running){running=false;cancelAnimationFrame(frame)}});
    mapObserver.observe(mapCanvas);new ResizeObserver(resize).observe(mapCanvas);resize();
    document.addEventListener('visibilitychange',()=>{if(document.hidden){running=false;cancelAnimationFrame(frame)}else if(!reduceMotion&&mapCanvas.getBoundingClientRect().bottom>0&&mapCanvas.getBoundingClientRect().top<innerHeight){running=true;frame=requestAnimationFrame(animate)}});
  }
  const counters = [...document.querySelectorAll('[data-count]')];
  if (counters.length) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderCount = (el, value) => { const format = el.dataset.format; el.textContent = format === 'grouped' ? Math.round(value).toLocaleString('en-IN') : Math.round(value).toString(); };
    const finishCount = el => renderCount(el, Number(el.dataset.count));
    const animateCount = el => {
      if (reducedMotion) { finishCount(el); return; }
      const target = Number(el.dataset.count), duration = 1500, start = performance.now();
      const tick = now => { const progress = Math.min((now - start) / duration, 1), eased = 1 - Math.pow(1 - progress, 4); renderCount(el, target * eased); if (progress < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window && !reducedMotion) {
      const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { animateCount(entry.target); counterObserver.unobserve(entry.target); } }), { threshold: .55 });
      counters.forEach(el => counterObserver.observe(el));
    } else counters.forEach(finishCount);
  }
  const motionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!motionOff && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('.section-head, .regional-route, .metrics-grid article, .expertise-card, .project-card, .approach-list, .approach-list li, .career-item, .expertise-detail, .info-card, .timeline, .timeline-item, .about-story-aside, .about-story-copy, .detail-main section, .contact-card, .contact-form');
    revealTargets.forEach((item, index) => {
      item.classList.add('reveal-ready');
      item.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
    });
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    revealTargets.forEach(item => revealObserver.observe(item));
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b===button)));
    document.querySelectorAll('[data-category]').forEach(card => card.hidden = category !== 'all' && !card.dataset.category.split(' ').includes(category));
  }));
  const form = document.querySelector('#contact-form');
  if(form) form.addEventListener('submit', e => {
    e.preventDefault(); if(!form.reportValidity()) return;
    const data = new FormData(form), value = key => String(data.get(key)||'').trim();
    const subject = encodeURIComponent(`Portfolio enquiry: ${value('interest')}`);
    const body = encodeURIComponent(`Name: ${value('name')}\nOrganisation: ${value('organisation')}\nEmail: ${value('email')}\nPhone: ${value('phone')||'Not provided'}\nArea of interest: ${value('interest')}\n\n${value('message')}\n\nConsent to respond: Yes`);
    const status = document.querySelector('[data-form-status]'); status.classList.add('show'); status.textContent = 'Your email app should open with this enquiry prepared. The website does not send or store form submissions.';
    location.href = `mailto:chinmay20kadam@gmail.com?subject=${subject}&body=${body}`;
  });
})();
