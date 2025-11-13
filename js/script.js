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

  // Parallax effect on scroll
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-image img, .card');
    
    parallaxElements.forEach((el, index) => {
      const speed = 0.1 + (index * 0.02);
      const yPos = -(scrolled * speed);
      if(el.classList.contains('hero-image') || el.parentElement.classList.contains('hero-image')){
        el.style.transform = `translateY(${yPos}px)`;
      }
    });
  });
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

// Donation section functionality
// PIX Configuration
const pixConfig = {
  pixKey: '+5531971533882',
  merchantName: 'ANDERSON L DA S JUNIOR',
  merchantCity: 'BELO HORIZONT',
  txid: 'DOACAO' + Date.now().toString().slice(-10),
  amount: 0 // Will be updated based on user selection
};

// Generate PIX BR Code (EMV format)
function generatePixBRCode(amount) {
  // Simple PIX BR Code generator (EMV QR Code format)
  // Format follows PIX specification
  const formatField = (id, value) => {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
  };

  let payload = '';
  
  // Payload Format Indicator
  payload += formatField('00', '01');
  
  // Merchant Account Information
  let merchantInfo = '';
  merchantInfo += formatField('00', 'BR.GOV.BCB.PIX');
  merchantInfo += formatField('01', pixConfig.pixKey);
  payload += formatField('26', merchantInfo);
  
  // Merchant Category Code
  payload += formatField('52', '0000');
  
  // Transaction Currency (986 = BRL)
  payload += formatField('53', '986');
  
  // Transaction Amount
  if(amount > 0) {
    payload += formatField('54', amount.toFixed(2));
  }
  
  // Country Code
  payload += formatField('58', 'BR');
  
  // Merchant Name
  payload += formatField('59', pixConfig.merchantName);
  
  // Merchant City
  payload += formatField('60', pixConfig.merchantCity);
  
  // Additional Data Field
  let additionalData = '';
  additionalData += formatField('05', pixConfig.txid);
  payload += formatField('62', additionalData);
  
  // CRC16 placeholder (will be calculated)
  payload += '6304';
  
  // Calculate CRC16
  const crc16 = calculateCRC16(payload);
  payload += crc16;
  
  return payload;
}

// CRC16-CCITT calculation
function calculateCRC16(str) {
  let crc = 0xFFFF;
  
  for(let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    
    for(let j = 0; j < 8; j++) {
      if((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  
  crc = crc & 0xFFFF;
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Generate QR Code
function generateQRCode(pixCode) {
  console.log('generateQRCode chamada com código:', pixCode.substring(0, 50) + '...');
  
  const container = document.getElementById('qrcodeContainer');
  
  if(!container) {
    console.error('Container qrcodeContainer não encontrado');
    return;
  }
  
  console.log('Container encontrado');
  
  // Clear previous QR code
  container.innerHTML = '';
  
  // Create a div for QRCode library
  const qrDiv = document.createElement('div');
  qrDiv.id = 'qrcodeCanvas';
  qrDiv.style.display = 'flex';
  qrDiv.style.justifyContent = 'center';
  qrDiv.style.marginBottom = '10px';
  container.appendChild(qrDiv);
  
  console.log('Div QR criada');
  
  // Check if QRCode library is loaded
  if(typeof QRCode === 'undefined') {
    console.error('Biblioteca QRCode não carregada');
    // Fallback: show text instruction
    qrDiv.innerHTML = '<p style="color: var(--muted); font-size: 14px;">QR Code não disponível. Use a chave PIX acima.</p>';
    container.style.display = 'block';
    return;
  }
  
  console.log('Biblioteca QRCode carregada, gerando...');
  
  try {
    // Generate QR Code using QRCode.js
    new QRCode(qrDiv, {
      text: pixCode,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
    
    console.log('QRCode constructor executado');
    
    // Add instruction text
    const instruction = document.createElement('p');
    instruction.className = 'qrcode-instruction';
    instruction.textContent = 'Escaneie o QR Code para doar';
    container.appendChild(instruction);
    
    console.log('QR Code gerado com sucesso');
  } catch(error) {
    console.error('Erro ao gerar QR Code:', error);
    qrDiv.innerHTML = '<p style="color: var(--muted); font-size: 14px;">Erro ao gerar QR Code. Use a chave PIX acima.</p>';
  }
}

// Update PIX info with selected amount
function updatePixInfo(amount) {
  pixConfig.amount = amount;
  const pixCode = generatePixBRCode(amount);
  
  // Update PIX code display
  const pixKeyElement = document.getElementById('pixKey');
  if(pixKeyElement && amount > 0) {
    pixKeyElement.textContent = pixCode;
  } else if(pixKeyElement) {
    pixKeyElement.textContent = pixConfig.pixKey;
  }
  
  // Don't generate QR Code automatically anymore
  // User needs to click the button
}

// Button to generate QR Code
const generateQRBtn = document.getElementById('generateQRBtn');
const qrcodeContainer = document.getElementById('qrcodeContainer');

if(generateQRBtn) {
  generateQRBtn.addEventListener('click', () => {
    console.log('Botão Gerar QR Code clicado');
    
    // Check if an amount is selected
    const activeAmount = document.querySelector('.donation-amount.active');
    let amount = 0;
    
    if(activeAmount) {
      const amountValue = activeAmount.getAttribute('data-amount');
      console.log('Valor selecionado:', amountValue);
      
      if(amountValue === 'outro') {
        const customAmount = document.getElementById('customAmount');
        amount = customAmount ? parseFloat(customAmount.value) : 0;
        console.log('Valor personalizado:', amount);
      } else {
        amount = parseFloat(amountValue);
        console.log('Valor do botão:', amount);
      }
    } else {
      console.log('Nenhum valor selecionado');
    }
    
    if(amount < 1 || isNaN(amount)) {
      alert('Por favor, selecione um valor de doação de pelo menos R$ 1,00');
      return;
    }
    
    console.log('Gerando PIX code para valor:', amount);
    
    // Generate PIX code and QR Code
    const pixCode = generatePixBRCode(amount);
    console.log('PIX code gerado:', pixCode.substring(0, 50) + '...');
    
    // Update key display with full PIX code
    const pixKeyElement = document.getElementById('pixKey');
    if(pixKeyElement) {
      pixKeyElement.textContent = pixCode;
      pixKeyElement.style.fontSize = '11px';
      pixKeyElement.style.wordBreak = 'break-all';
    }
    
    // Generate and show QR Code
    console.log('Chamando generateQRCode...');
    generateQRCode(pixCode);
    
    // Show QR Code container
    if(qrcodeContainer) {
      qrcodeContainer.style.display = 'block';
      // Scroll to show the QR code
      setTimeout(() => {
        qrcodeContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
    
    // Update button state
    generateQRBtn.classList.add('generated');
    generateQRBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;margin-right:8px;">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
      </svg>
      QR Code Gerado - R$ ${amount.toFixed(2)}
    `;
    generateQRBtn.disabled = true;
  });
}

// Initialize PIX on page load (without QR Code)
window.addEventListener('load', () => {
  // Just set up the initial state, no QR code generation
  const pixKeyElement = document.getElementById('pixKey');
  if(pixKeyElement) {
    pixKeyElement.textContent = pixConfig.pixKey;
  }
  
  // Initialize the button text
  const btn = document.getElementById('generateQRBtn');
  if(btn) {
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;margin-right:8px;">
        <rect x="3" y="3" width="8" height="8" rx="1"/>
        <rect x="3" y="13" width="8" height="8" rx="1"/>
        <rect x="13" y="3" width="8" height="8" rx="1"/>
        <rect x="13" y="13" width="4" height="4" rx="1"/>
        <rect x="17" y="17" width="4" height="4" rx="1"/>
      </svg>
      Gerar QR Code
    `;
  }
});

// Toggle between PIX and Card payment methods
const methodTabs = document.querySelectorAll('.method-tab');
const donationPanels = document.querySelectorAll('.donation-panel');

methodTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const method = tab.getAttribute('data-method');
    
    // Update active tab
    methodTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update active panel
    donationPanels.forEach(panel => panel.classList.remove('active'));
    document.getElementById(`${method}-panel`)?.classList.add('active');
  });
});

// PIX donation amount selection
const donationAmounts = document.querySelectorAll('.donation-amount');
const customAmountInput = document.querySelector('.custom-amount-input');
const customAmountField = document.getElementById('customAmount');

donationAmounts.forEach(btn => {
  btn.addEventListener('click', () => {
    const amount = btn.getAttribute('data-amount');
    
    // Remove active from all buttons
    donationAmounts.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Reset QR Code when changing amount
    resetQRCode();
    
    // Show/hide custom input
    if(amount === 'outro'){
      if(customAmountInput) customAmountInput.style.display = 'block';
      if(customAmountField) customAmountField.focus();
    } else {
      if(customAmountInput) customAmountInput.style.display = 'none';
    }
  });
});

// Update PIX when custom amount changes
if(customAmountField) {
  customAmountField.addEventListener('input', (e) => {
    const amount = parseFloat(e.target.value);
    if(amount >= 1) {
      resetQRCode();
    }
  });
}

// Reset QR Code function
function resetQRCode() {
  if(qrcodeContainer) {
    qrcodeContainer.style.display = 'none';
  }
  
  if(generateQRBtn) {
    generateQRBtn.classList.remove('generated');
    generateQRBtn.disabled = false;
    generateQRBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;margin-right:8px;">
        <rect x="3" y="3" width="8" height="8" rx="1"/>
        <rect x="3" y="13" width="8" height="8" rx="1"/>
        <rect x="13" y="3" width="8" height="8" rx="1"/>
        <rect x="13" y="13" width="4" height="4" rx="1"/>
        <rect x="17" y="17" width="4" height="4" rx="1"/>
      </svg>
      Gerar QR Code
    `;
  }
  
  // Reset key display
  const pixKeyElement = document.getElementById('pixKey');
  if(pixKeyElement) {
    pixKeyElement.textContent = pixConfig.pixKey;
    pixKeyElement.style.fontSize = '';
    pixKeyElement.style.wordBreak = '';
  }
}

// Copy PIX key to clipboard
const copyPixBtn = document.getElementById('copyPixBtn');
const pixKey = document.getElementById('pixKey');

if(copyPixBtn && pixKey){
  copyPixBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pixKey.textContent);
      copyPixBtn.classList.add('copied');
      
      // Reset button after 2 seconds
      setTimeout(() => {
        copyPixBtn.classList.remove('copied');
      }, 2000);
    } catch(err) {
      console.error('Erro ao copiar:', err);
    }
  });
}

// Card number formatting
const cardNumberInput = document.getElementById('cardNumber');
if(cardNumberInput){
  cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
  });
  
  // Validate card number using Luhn algorithm
  cardNumberInput.addEventListener('blur', (e) => {
    const cardNumber = e.target.value.replace(/\s/g, '');
    if(cardNumber.length > 0 && !validateCardNumber(cardNumber)) {
      e.target.style.borderColor = '#ff5050';
      showCardError('Número de cartão inválido');
    } else {
      e.target.style.borderColor = '';
      hideCardError();
    }
  });
}

// Luhn algorithm for card validation
function validateCardNumber(cardNumber) {
  if(!/^\d+$/.test(cardNumber)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for(let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);
    
    if(isEven) {
      digit *= 2;
      if(digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

function showCardError(message) {
  let errorEl = document.querySelector('.card-error');
  if(!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'card-error';
    cardNumberInput.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function hideCardError() {
  const errorEl = document.querySelector('.card-error');
  if(errorEl) errorEl.remove();
}

// Expiry date formatting
const cardExpiryInput = document.getElementById('cardExpiry');
if(cardExpiryInput){
  cardExpiryInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if(value.length >= 2){
      value = value.slice(0,2) + '/' + value.slice(2,4);
    }
    e.target.value = value;
  });
  
  // Validate expiry date
  cardExpiryInput.addEventListener('blur', (e) => {
    const expiry = e.target.value;
    if(expiry.length > 0 && !validateExpiryDate(expiry)) {
      e.target.style.borderColor = '#ff5050';
    } else {
      e.target.style.borderColor = '';
    }
  });
}

// Validate expiry date
function validateExpiryDate(expiry) {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if(!match) return false;
  
  const month = parseInt(match[1]);
  const year = parseInt('20' + match[2]);
  
  if(month < 1 || month > 12) return false;
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if(year < currentYear) return false;
  if(year === currentYear && month < currentMonth) return false;
  
  return true;
}

// CVV validation
const cardCVVInput = document.getElementById('cardCVV');
if(cardCVVInput){
  cardCVVInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
  });
}

// Handle donation form submission
const donationForm = document.getElementById('donationForm');
const donationStatus = document.getElementById('donationStatus');

if(donationForm){
  donationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(donationForm);
    const data = Object.fromEntries(formData.entries());
    
    // Basic validation
    if(!data.name || !data.email || !data.amount){
      donationStatus.textContent = 'Por favor, preencha todos os campos obrigatórios.';
      donationStatus.className = 'donation-status error';
      return;
    }
    
    if(parseFloat(data.amount) < 1){
      donationStatus.textContent = 'O valor mínimo de doação é R$ 1,00.';
      donationStatus.className = 'donation-status error';
      return;
    }
    
    // Validate card number
    const cardNumber = data.card.replace(/\s/g, '');
    if(!validateCardNumber(cardNumber)){
      donationStatus.textContent = 'Número de cartão inválido.';
      donationStatus.className = 'donation-status error';
      return;
    }
    
    // Validate expiry
    if(!validateExpiryDate(data.expiry)){
      donationStatus.textContent = 'Data de validade inválida.';
      donationStatus.className = 'donation-status error';
      return;
    }
    
    // Validate CVV
    if(!/^\d{3,4}$/.test(data.cvv)){
      donationStatus.textContent = 'CVV inválido.';
      donationStatus.className = 'donation-status error';
      return;
    }
    
    // Validate email
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){
      donationStatus.textContent = 'E-mail inválido.';
      donationStatus.className = 'donation-status error';
      return;
    }
    
    // Disable submit button
    const submitBtn = donationForm.querySelector('button[type="submit"]');
    if(submitBtn){
      submitBtn.setAttribute('disabled', '');
      submitBtn.textContent = 'Processando...';
    }
    
    donationStatus.textContent = 'Processando sua doação...';
    donationStatus.className = 'donation-status';
    
    try {
      // Simulate API call (replace with actual payment gateway integration)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - Update total raised
      const currentTotal = parseFloat(document.getElementById('totalRaised').textContent.replace(/\./g, '').replace(',', '.')) || 0;
      const newTotal = currentTotal + parseFloat(data.amount);
      document.getElementById('totalRaised').textContent = newTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      
      // Update progress bar
      const progress = (newTotal / 50000) * 100;
      const progressFill = document.getElementById('progressFill');
      if(progressFill) {
        progressFill.style.width = Math.min(progress, 100) + '%';
      }
      
      donationStatus.textContent = `Obrigado pela sua doação de R$ ${parseFloat(data.amount).toFixed(2)}! Você receberá um e-mail de confirmação.`;
      donationStatus.className = 'donation-status success';
      donationForm.reset();
      
    } catch(err) {
      donationStatus.textContent = 'Erro ao processar doação. Tente novamente.';
      donationStatus.className = 'donation-status error';
    } finally {
      if(submitBtn){
        submitBtn.removeAttribute('disabled');
        submitBtn.textContent = 'Doar Agora';
      }
    }
  });
}

// Animate stats on scroll (disabled for future goals - they will just fade in)
const animateStats = () => {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const rect = stat.getBoundingClientRect();
    if(rect.top < window.innerHeight - 100 && !stat.classList.contains('animated')){
      stat.classList.add('animated');
      // Just mark as animated, no counter animation since these are future goals
    }
  });
};

window.addEventListener('scroll', animateStats);
window.addEventListener('load', animateStats);

// Animar contador de doações arrecadadas
const animateDonationCounter = () => {
  const totalRaised = document.getElementById('totalRaised');
  
  if(totalRaised && !totalRaised.classList.contains('animated')){
    const rect = totalRaised.getBoundingClientRect();
    if(rect.top < window.innerHeight - 100){
      totalRaised.classList.add('animated');
      const valueText = totalRaised.textContent.replace(/\./g, '').replace(',', '.');
      const finalValue = parseFloat(valueText);
      
      // Only animate if value is greater than 0
      if(finalValue > 0) {
        const target = Math.floor(finalValue);
        let current = 0;
        const increment = target / 60;
        
        const timer = setInterval(() => {
          current += increment;
          if(current >= target){
            totalRaised.textContent = finalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            clearInterval(timer);
          } else {
            totalRaised.textContent = Math.floor(current).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
          }
        }, 25);
      }
    }
  }
};

window.addEventListener('scroll', animateDonationCounter);
window.addEventListener('load', animateDonationCounter);

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    const isOpen = question.getAttribute('aria-expanded') === 'true';
    
    // Close all other items
    faqQuestions.forEach(q => {
      if(q !== question){
        q.setAttribute('aria-expanded', 'false');
        q.parentElement.classList.remove('open');
      }
    });
    
    // Toggle current item
    question.setAttribute('aria-expanded', !isOpen);
    faqItem.classList.toggle('open');
  });
});

// FAQ Category Filter
const categoryBtns = document.querySelectorAll('.category-btn');
const faqItems = document.querySelectorAll('.faq-item');

categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.getAttribute('data-category');
    
    // Update active button
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Filter items
    faqItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      if(category === 'all' || itemCategory === category){
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
        // Close if open
        const question = item.querySelector('.faq-question');
        question.setAttribute('aria-expanded', 'false');
        item.classList.remove('open');
      }
    });
  });
});


