// Menu mobile toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle?.addEventListener('click', (e)=>{
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  // animate toggle
  menuToggle.classList.toggle('open', isOpen);
});

// close menu when clicking outside (mobile)
document.addEventListener('click', (e)=>{
  if(!mainNav || !menuToggle) return;
  const isOpen = mainNav.classList.contains('open');
  if(!isOpen) return;
  const target = e.target;
  if(!mainNav.contains(target) && !menuToggle.contains(target)){
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded','false');
    menuToggle.classList.remove('open');
  }
});

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