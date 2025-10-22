// Menu mobile toggle with backdrop and focus management
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

// create backdrop element once (CSS class .nav-backdrop)
let navBackdrop = document.querySelector('.nav-backdrop');
if(!navBackdrop){
  navBackdrop = document.createElement('div');
  navBackdrop.className = 'nav-backdrop';
  document.body.appendChild(navBackdrop);
}

function openMenu(){
  if(!mainNav || !menuToggle) return;
  mainNav.classList.add('open');
  menuToggle.classList.add('open');
  menuToggle.setAttribute('aria-expanded','true');
  navBackdrop.classList.add('show');
  // move focus into first focusable item in menu (link)
  const firstLink = mainNav.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
  if(firstLink) firstLink.focus();
}

function closeMenu(){
  if(!mainNav || !menuToggle) return;
  mainNav.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded','false');
  navBackdrop.classList.remove('show');
  // return focus to toggle for keyboard users
  menuToggle.focus();
}

// simple focus trap: keep tab focus inside the mainNav when open
document.addEventListener('keydown', (e)=>{
  if(e.key !== 'Tab') return;
  if(!mainNav || !mainNav.classList.contains('open')) return;
  const focusable = mainNav.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
  if(!focusable || focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length -1];
  const active = document.activeElement;
  if(e.shiftKey){
    if(active === first){
      e.preventDefault();
      last.focus();
    }
  } else {
    if(active === last){
      e.preventDefault();
      first.focus();
    }
  }
});

menuToggle?.addEventListener('click', (e)=>{
  const isOpen = mainNav.classList.contains('open');
  if(isOpen) closeMenu(); else openMenu();
});

// close when clicking backdrop
navBackdrop.addEventListener('click', ()=> closeMenu());

// close menu when clicking outside (fallback for older browsers)
document.addEventListener('click', (e)=>{
  if(!mainNav || !menuToggle) return;
  const isOpen = mainNav.classList.contains('open');
  if(!isOpen) return;
  const target = e.target;
  if(!mainNav.contains(target) && !menuToggle.contains(target) && !navBackdrop.contains(target)){
    closeMenu();
  }
});

// Staggered reveal on load for cards and gallery, hero reveal and floating image
window.addEventListener('load', ()=>{
  const items = Array.from(document.querySelectorAll('.card, .gallery img'));
  items.forEach((el, i)=>{
    setTimeout(()=>{
      el.style.opacity = 1;
      el.style.transform = 'none';
    }, 120 + i * 80);
  });

  // hero text reveal
  const heroText = document.querySelector('.hero-text');
  if(heroText) setTimeout(()=> heroText.classList.add('show'), 180);

  // hero image float little animation loop
  const heroImg = document.querySelector('.hero-image img');
  if(heroImg){
    setTimeout(()=> heroImg.classList.add('float'), 600);
    setInterval(()=>{
      heroImg.classList.toggle('float');
    }, 3600);
  }
});

// animate menu links when menu opens (stagger)
function animateMenuLinks(open){
  if(!mainNav) return;
  const links = Array.from(mainNav.querySelectorAll('a, button.icon-btn'));
  links.forEach((lnk, idx)=>{
    if(open){
      lnk.classList.add('animated-in');
      setTimeout(()=> lnk.classList.add('show'), 80 + idx * 60);
    } else {
      lnk.classList.remove('show');
      setTimeout(()=> lnk.classList.remove('animated-in'), 260);
    }
  });
}

// wrap openMenu/closeMenu to include animation of links
if(typeof openMenu === 'function' && typeof closeMenu === 'function'){
  const __openMenu = openMenu;
  const __closeMenu = closeMenu;
  openMenu = function(){ __openMenu(); animateMenuLinks(true); };
  closeMenu = function(){ animateMenuLinks(false); __closeMenu(); };
}

// close menu on Escape
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && mainNav.classList.contains('open')){
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded','false');
    menuToggle?.classList.remove('open');
    menuToggle?.focus();
  }
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    if(href === '#') return;
    if(href && href.startsWith('#')){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      // close mobile menu after click
      if(mainNav.classList.contains('open')){
        mainNav.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded','false');
      }
    }
  })
});

// small reveal on scroll
const reveal = ()=>{
  document.querySelectorAll('.card, .gallery img, .hero-text, .hero-image').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 60){
      el.style.opacity = 1;
      el.style.transform = 'none';
    }
  })
}
window.addEventListener('scroll', reveal);
window.addEventListener('load', ()=>{
  document.querySelectorAll('.card, .gallery img, .hero-text, .hero-image').forEach(el=>{
    el.style.opacity = 0;
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'all .6s cubic-bezier(.2,.9,.2,1)';
  });
  reveal();
});

// Form handling (for contato page)
const requestForm = document.getElementById('requestForm');
const statusEl = document.getElementById('status');
if(requestForm){
  requestForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    // basic client-side presence validation
    const fd = new FormData(requestForm);
    const required = ['name','email','address','size'];
    for(const k of required){
      if(!fd.get(k) || String(fd.get(k)).trim() === ''){
        statusEl.textContent = 'Por favor preencha os campos obrigatórios.';
        statusEl.className = 'status--error';
        return;
      }
    }

    const submitBtn = requestForm.querySelector('button[type="submit"]');
    submitBtn?.setAttribute('disabled','');
    statusEl.textContent = 'Enviando...';
    statusEl.className = '';

    const data = Object.fromEntries(fd.entries());
    try{
      const res = await fetch('/api/requests',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      if(res.ok){
        const json = await res.json();
        statusEl.textContent = 'Pedido enviado com sucesso. ID: ' + json.id;
        statusEl.className = 'status--success';
        requestForm.reset();
      } else {
        const err = await res.text();
        statusEl.textContent = 'Erro: ' + err;
        statusEl.className = 'status--error';
      }
    }catch(err){
      statusEl.textContent = 'Erro ao enviar: ' + (err.message || err);
      statusEl.className = 'status--error';
    }finally{
      submitBtn?.removeAttribute('disabled');
    }
  })
}

// Dark mode and text size toggles + Back to top
const toggleDarkBtns = document.querySelectorAll('#toggleDark');
// text size buttons removed per request
const backToTop = document.getElementById('backToTop');

function setDark(on){
  if(on) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
  toggleDarkBtns.forEach(b=> b.setAttribute('aria-pressed', String(on)));
  localStorage.setItem('theme-dark', on ? '1' : '0');
}

toggleDarkBtns.forEach(b=> b.addEventListener('click', ()=> setDark(!document.documentElement.classList.contains('dark'))));

// restore theme preference
if(localStorage.getItem('theme-dark') === '1') setDark(true);

// Back to top behavior
function checkScroll(){
  if(!backToTop) return;
  if(window.scrollY > 220) backToTop.classList.add('show'); else backToTop.classList.remove('show');
}
window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);
backToTop?.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));