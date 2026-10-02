const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('siteMenu');
const portrait = document.getElementById('portraitWrap');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
// The draggable badge is a desktop-only interaction. Touch, coarse-pointer and phone-width layouts get a static card.
const badgeInteractive = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');

function closeMenu() {
  if (!menu || !menuButton) return;
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); } });
}

const projects = {
  resolve: { src:'/assets/resolve.webp', name:'Resolve', description:'Evidence-backed contribution funding on Arc', live:'https://www.useresolve.stream', code:'https://github.com/velz-cmd/Things-to-do', width:1917, height:900, cropTop:77 },
  meridian: { src:'/assets/meridian.webp', name:'Meridian', description:'Market intelligence and strategy replay', live:'https://meridianarc.stream', code:'https://github.com/velz-cmd/Meridian', width:1917, height:910, cropTop:72 },
  repodiet: { src:'/assets/repodiet.webp', name:'RepoDiet', description:'Verified repository cleanup and reviewable pull requests', live:'https://repodiet.uk', code:'https://github.com/smokychain22/agentPass', width:1915, height:908, cropTop:55 },
  agora: { src:'/assets/agora.webp', name:'Agora Forge', description:'Cross-chain USDC portfolio and execution', live:'https://circle-arc-net.vercel.app/', code:'https://github.com/Ibrahimmovic/Circle-Arc-Net', width:1917, height:910, cropTop:63 }
};
const projectDialog = document.getElementById('projectDialog');
const dialogImage = document.getElementById('dialogImage');
const dialogViewport = document.getElementById('dialogViewport');
const hoverPreview = document.getElementById('hoverPreview');
const hoverScreen = document.getElementById('hoverScreen');
const hoverImage = document.getElementById('hoverImage');
function openProject(key) {
  const project = projects[key];
  if (!project) return;
  hoverPreview.classList.remove('visible');
  document.getElementById('dialogTitle').textContent = project.name;
  document.getElementById('dialogDescription').textContent = project.description;
  document.getElementById('dialogLive').href = project.live;
  document.getElementById('dialogCode').href = project.code;
  dialogViewport.style.aspectRatio = project.width + ' / ' + project.height;
  dialogImage.style.top = (-100 * project.cropTop / project.height) + '%';
  dialogImage.style.opacity = '0';
  dialogImage.onload = () => { dialogImage.style.opacity = '1'; };
  dialogImage.src = project.src;
  dialogImage.alt = project.name + ' product interface';
  projectDialog.showModal();
  if (dialogImage.complete && dialogImage.naturalWidth) dialogImage.style.opacity = '1';
}
document.querySelectorAll('[data-open-preview]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.openPreview)));
const dialogClose = document.getElementById('dialogClose');
if (dialogClose && projectDialog) dialogClose.addEventListener('click', () => projectDialog.close());
if (projectDialog) projectDialog.addEventListener('click', event => { if (event.target === projectDialog) projectDialog.close(); });

if (hoverPreview && hoverScreen && hoverImage && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const placePreview = event => {
    const width = hoverPreview.getBoundingClientRect().width;
    const height = hoverPreview.getBoundingClientRect().height;
    const left = event.clientX + width + 30 < window.innerWidth ? event.clientX + 22 : event.clientX - width - 22;
    const top = Math.max(16, Math.min(window.innerHeight - height - 16, event.clientY - height / 2));
    hoverPreview.style.setProperty('--preview-x', Math.max(16, left) + 'px');
    hoverPreview.style.setProperty('--preview-y', top + 'px');
  };
  document.querySelectorAll('.work-row[data-preview]').forEach(row => {
    row.addEventListener('pointerenter', event => {
      const project = projects[row.dataset.preview];
      hoverPreview.classList.remove('visible');
      hoverImage.style.opacity = '0';
      hoverScreen.style.aspectRatio = project.width + ' / ' + project.height;
      hoverImage.style.top = (-100 * project.cropTop / project.height) + '%';
      hoverImage.onload = () => { hoverImage.style.opacity = '1'; };
      hoverImage.src = project.src;
      document.getElementById('hoverName').textContent = project.name;
      if (hoverImage.complete && hoverImage.naturalWidth) hoverImage.style.opacity = '1';
      placePreview(event);
      hoverPreview.classList.add('visible');
    });
    row.addEventListener('pointermove', placePreview);
    row.addEventListener('pointerleave', () => hoverPreview.classList.remove('visible'));
  });
  window.addEventListener('scroll', () => hoverPreview.classList.remove('visible'), { passive: true });
}

if (portrait && !reducedMotion.matches && badgeInteractive.matches) {
  const hero = portrait.closest('.hero');
  const card = document.getElementById('badgeCard');
  const assembly = document.getElementById('badgeAssembly');
  const lanyard = document.getElementById('badgeLanyard');
  const connector = portrait.querySelector('.badge-connector');
  const state = { x: 0, y: 0, swing: 0, tx: 0, ty: 0 };
  const target = { x: 0, y: 0, swing: 0, tx: 0, ty: 0 };
  const velocity = { x: 0, y: 0, swing: 0, tx: 0, ty: 0 };
  let dragging = false;
  let moving = false;
  let startX = 0;
  let startY = 0;
  function placeStrap() {
    const portraitRect = portrait.getBoundingClientRect();
    const connectorRect = connector.getBoundingClientRect();
    const anchorX = portraitRect.left + portraitRect.width / 2;
    const anchorY = portraitRect.top + parseFloat(lanyard.style.top || '0');
    const endX = connectorRect.left + connectorRect.width / 2;
    const endY = connectorRect.top + connectorRect.height / 2;
    const dx = endX - anchorX;
    const dy = endY - anchorY;
    lanyard.style.height = Math.hypot(dx, dy) + 3 + 'px';
    lanyard.style.transform = `rotate(${Math.atan2(-dx, dy)}rad)`;
  }
  function syncTether() {
    const offset = portrait.getBoundingClientRect().top - hero.getBoundingClientRect().top;
    const connectorCenter = parseFloat(getComputedStyle(connector).top) + connector.offsetHeight / 2;
    const anchor = window.innerWidth < 751 ? Math.min(520, Math.max(420, offset - 140)) : 5;
    const localTop = anchor - offset;
    lanyard.style.top = localTop + 'px';
    assembly.style.transformOrigin = '50% ' + connectorCenter + 'px';
    placeStrap();
  }
  syncTether();
  window.addEventListener('resize', syncTether, { passive: true });
  function animateBadge() {
    for (const key of ['x', 'y', 'swing', 'tx', 'ty']) {
      velocity[key] = (velocity[key] + (target[key] - state[key]) * (dragging ? .22 : .075)) * (dragging ? .66 : .83);
      state[key] += velocity[key];
    }
    card.style.transform = `rotateX(${state.y.toFixed(2)}deg) rotateY(${state.x.toFixed(2)}deg)`;
    assembly.style.transform = `translate3d(${state.tx.toFixed(1)}px,${state.ty.toFixed(1)}px,0) rotate(${state.swing.toFixed(2)}deg)`;
    placeStrap();
    card.style.setProperty('--glare-x', (50 + state.x * 2) + '%');
    if (Object.keys(state).some(key => Math.abs(target[key] - state[key]) + Math.abs(velocity[key]) > .08) || dragging) requestAnimationFrame(animateBadge);
    else moving = false;
  }
  function pointAt(event, force) {
    if (!badgeInteractive.matches || (event.pointerType === 'touch' && !force)) return;
    const rect = hero.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)));
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)));
    target.x = x * (force ? 19 : 11);
    target.y = -y * (force ? 15 : 8);
    target.swing = x * (force ? 15 : 3);
    if (force) {
      target.tx = Math.max(-300, Math.min(300, event.clientX - startX));
      target.ty = Math.max(-170, Math.min(220, event.clientY - startY));
      target.swing = Math.max(-27, Math.min(27, target.tx * .075));
    }
    if (!moving) { moving = true; requestAnimationFrame(animateBadge); }
  }
  hero.addEventListener('pointermove', (event) => pointAt(event, dragging));
  hero.addEventListener('pointerleave', () => {
    if (dragging) return;
    target.x = target.y = target.swing = target.tx = target.ty = 0;
    if (!moving) { moving = true; requestAnimationFrame(animateBadge); }
  });
  portrait.addEventListener('pointerdown', (event) => {
    if (!badgeInteractive.matches || event.pointerType === 'touch') return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    event.preventDefault();
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    portrait.setPointerCapture(event.pointerId);
    pointAt(event, true);
  });
  function releaseBadge() { dragging = false; target.x = target.y = target.swing = target.tx = target.ty = 0; if (!moving) { moving = true; requestAnimationFrame(animateBadge); } }
  portrait.addEventListener('pointerup', releaseBadge);
  portrait.addEventListener('pointercancel', releaseBadge);
}

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const CONTACT_EMAIL = 'mabdullah.built@gmail.com';
function buildInquiryMailto(data, pageUrl) {
  const get = (key) => String(data.get(key) || '').trim();
  const name = get('name'), service = get('service');
  const subject = (service ? service + ' inquiry' : 'Project inquiry') + ' from ' + name;
  const lines = [
    'Name: ' + name,
    'Email: ' + get('email'),
    service ? 'Relevant service: ' + service : '',
    get('stage') ? 'Current stage: ' + get('stage') : '',
    get('projectUrl') ? 'Useful link: ' + get('projectUrl') : '',
    get('timeline') ? 'Timeline: ' + get('timeline') : '',
    get('budget') ? 'Budget range: ' + get('budget') : '',
    'Source: ' + (get('source') || pageUrl),
    '',
    get('message')
  ].filter((line, index) => line !== '' || index > 0);
  return 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
}
if (contactForm && formStatus) {
const requestedService = new URLSearchParams(window.location.search).get('service');
const serviceField = contactForm.elements.namedItem('service');
if (requestedService && serviceField instanceof HTMLSelectElement && [...serviceField.options].some(option => option.value === requestedService)) {
  serviceField.value = requestedService;
}
const serviceLabel = (field, value) => field instanceof HTMLSelectElement ? ([...field.options].find(option => option.value === value)?.textContent || value) : value;
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.className = 'form-status';
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    formStatus.textContent = 'Please complete the required fields.';
    formStatus.classList.add('error');
    return;
  }
  const data = new FormData(contactForm);
  if (data.get('website')) return;
  if (serviceField instanceof HTMLSelectElement && data.get('service')) data.set('service', serviceLabel(serviceField, String(data.get('service'))));
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'contact_form_submit', service: String(serviceField?.value || 'general') });
  formStatus.textContent = 'Opening your email app. Review the message and press Send to finish.';
  formStatus.classList.add('success');
  const draft = document.createElement('a');
  draft.href = buildInquiryMailto(data, window.location.href);
  document.body.appendChild(draft);
  draft.click();
  draft.remove();
});
contactForm.addEventListener('focusin', () => {
  if (contactForm.dataset.started) return;
  contactForm.dataset.started = 'true';
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'contact_form_start', service: String(serviceField?.value || 'general') });
});
}

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target.closest('[data-event]') : null;
  if (!target) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: target.getAttribute('data-event'), service: target.getAttribute('data-service') || undefined, destination: target.getAttribute('href') || undefined });
});

// Cal.com inline calendar for muhammad-abdullah-built/idea-to-product.
const calContainer = document.getElementById('my-cal-inline-idea-to-product');
if (calContainer) {
  const loadCalendar = () => {
    if (calContainer.dataset.loaded) return;
    calContainer.dataset.loaded = 'true';
  (function (C, A, L) {
    const p = (a, ar) => a.q.push(ar);
    const d = C.document;
    C.Cal = C.Cal || function () {
      const cal = C.Cal;
      const ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        const script = d.createElement('script');
        script.src = A;
        script.onerror = () => {
          calContainer.innerHTML = '<p class="cal-error">The calendar could not load. <a href="https://cal.com/muhammad-abdullah-built/idea-to-product" target="_blank" rel="noopener noreferrer">View available times ↗</a></p>';
        };
        d.head.appendChild(script);
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ['initNamespace', namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');
  window.Cal('init', 'idea-to-product', { origin: 'https://app.cal.com' });
  window.Cal.config = window.Cal.config || {};
  window.Cal.config.forwardQueryParams = true;
  calContainer.textContent = '';
  window.Cal.ns['idea-to-product']('inline', {
    elementOrSelector: '#my-cal-inline-idea-to-product',
    config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
    calLink: 'muhammad-abdullah-built/idea-to-product'
  });
  window.Cal.ns['idea-to-product']('ui', { hideEventTypeDetails: false, layout: 'month_view', theme: 'dark' });
  };
  if ('IntersectionObserver' in window) {
    const calendarObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      loadCalendar();
    }, { rootMargin: '300px 0px' });
    calendarObserver.observe(calContainer);
  } else {
    loadCalendar();
  }
}

const canvas = document.getElementById('field');
const ctx = canvas ? canvas.getContext('2d') : null;
if (ctx) {
  let dots = [];
  let width = 0;
  let height = 0;
  function resizeField() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    dots = Array.from({length: Math.min(35, Math.round(width / 34))}, (_, i) => ({
      x: (i * 147.41 % width),
      y: (i * 311.07 % height),
      size: .5 + (i % 3) * .35,
      speed: .08 + (i % 5) * .025
    }));
  }
  function drawField() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = document.body.classList.contains('light') ? '#4357bd' : '#a7baff';
    dots.forEach((dot) => {
      ctx.globalAlpha = .26 + dot.size * .11;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fill();
      if (!reducedMotion.matches) {
        dot.y -= dot.speed;
        if (dot.y < -4) dot.y = height + 4;
      }
    });
    ctx.globalAlpha = 1;
    if (!reducedMotion.matches) requestAnimationFrame(drawField);
  }
  resizeField();
  drawField();
  window.addEventListener('resize', () => { resizeField(); if (reducedMotion.matches) drawField(); });
}
