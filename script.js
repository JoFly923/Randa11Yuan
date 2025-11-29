import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

/* =========================================================
   多语言系统（默认中文）
   ========================================================= */

let currentLang = 'zh'; // 默认中文
const langBtn = document.querySelector('.nav-lang');

// 固定文案的多语言字典
const i18n = {
  zh: {
    navOverview: '概览',
    navProjects: '项目',
    navBlog: '博客',
    navResearch: '研究',
    heroKicker: '机器人 · 嵌入式 · 柔性传感',
    heroSub: '专注于安静、高精度的机器人与智能柔性传感织物。',
    heroBtnProjects: '查看项目',
    heroBtnBlog: '阅读博客',
    secAbout: '关于我',
    labelProfile: '个人简介',
    secTimeline: '时间线',
    labelJourney: '成长轨迹',
    secProjects: '项目',
    labelSelected: '代表作品',
    projectsHint: '滚动或点击按钮翻页 · 浏览不同项目',
    btnPrev: '上一项',
    btnNext: '下一项',
    secBlog: '博客',
    labelStories: '记录',
    blogHint: '记录机器人、传感器与日常折腾。',
    secResearch: '研究与规划',
    labelPapers: '论文',
    labelAwards: '奖项',
    labelFuture: '未来计划',
  },
  en: {
    navOverview: 'Overview',
    navProjects: 'Projects',
    navBlog: 'Blog',
    navResearch: 'Research',
    heroKicker: 'ROBOTICS · EMBEDDED · FLEXIBLE SENSORS',
    heroSub: 'Building quiet, precise robots and intelligent sensing fabrics.',
    heroBtnProjects: 'View Projects',
    heroBtnBlog: 'Read Blog',
    secAbout: 'About',
    labelProfile: 'Profile',
    secTimeline: 'Timeline',
    labelJourney: 'Journey',
    secProjects: 'Projects',
    labelSelected: 'Selected work',
    projectsHint: 'Scroll / click buttons to flip between projects.',
    btnPrev: 'Prev',
    btnNext: 'Next',
    secBlog: 'Blog',
    labelStories: 'Stories',
    blogHint: 'Writing about robots, sensors, and side projects.',
    secResearch: 'Research & Path',
    labelPapers: 'Papers',
    labelAwards: 'Awards',
    labelFuture: 'Future',
  }
};

// Hero 打字机两套文案
const typePhrases = {
  zh: ['袁梧桐', '机器人开发者', '嵌入式控制工程', '柔性传感探索者'],
  en: ['Yuan Wutong', 'Robotics Developer', 'Embedded Control Engineer', 'Flexible Sensor Explorer'],
};

function hasChinese(text) {
  return /[\u4e00-\u9fff]/.test(text || '');
}

/**
 * 对 markdown 容器做中英拆分：
 * - 自动加 data-lang="zh" / "en"
 * - 如果同时有中英文：中文段落在上，英文在下
 */
function structureBilingual(container) {
  if (!container) return;

  const children = Array.from(container.children);
  const zhNodes = [];
  const enNodes = [];

  children.forEach(el => {
    if (el.nodeType !== 1) return;
    const text = el.textContent || '';
    if (hasChinese(text)) {
      el.dataset.lang = 'zh';
      zhNodes.push(el);
    } else {
      el.dataset.lang = 'en';
      enNodes.push(el);
    }
  });

  if (zhNodes.length && enNodes.length) {
    container.innerHTML = '';
    [...zhNodes, ...enNodes].forEach(el => container.appendChild(el));
  }
}

/** 只对带 data-lang 的元素做显示/隐藏 */
function applyLanguageDom() {
  const zhEls = document.querySelectorAll('[data-lang="zh"]');
  const enEls = document.querySelectorAll('[data-lang="en"]');

  if (currentLang === 'en') {
    zhEls.forEach(el => (el.style.display = 'none'));
    enEls.forEach(el => (el.style.display = ''));
  } else {
    zhEls.forEach(el => (el.style.display = ''));
    enEls.forEach(el => (el.style.display = ''));
  }
}

/** 固定文案（导航、标题、按钮等）根据 currentLang 设置 */
function applyStaticI18n() {
  const t = i18n[currentLang];

  const navTabs = document.querySelectorAll('.nav-tab');
  if (navTabs.length >= 4) {
    navTabs[0].textContent = t.navOverview;
    navTabs[1].textContent = t.navProjects;
    navTabs[2].textContent = t.navBlog;
    navTabs[3].textContent = t.navResearch;
  }

  const heroKicker = document.querySelector('.hero-kicker');
  if (heroKicker) heroKicker.textContent = t.heroKicker;

  const heroSub = document.querySelector('.hero-sub');
  if (heroSub) heroSub.textContent = t.heroSub;

  const heroBtns = document.querySelectorAll('.hero-actions .btn');
  if (heroBtns.length >= 2) {
    heroBtns[0].textContent = t.heroBtnProjects;
    heroBtns[1].textContent = t.heroBtnBlog;
  }

  const titles = document.querySelectorAll('.section-title');
  if (titles.length >= 5) {
    titles[0].textContent = t.secAbout;
    titles[1].textContent = t.secTimeline;
    titles[2].textContent = t.secProjects;
    titles[3].textContent = t.secBlog;
    titles[4].textContent = t.secResearch;
  }

  const labels = document.querySelectorAll('.section-side-label');
  if (labels.length >= 7) {
    labels[0].textContent = t.labelProfile;
    labels[1].textContent = t.labelJourney;
    labels[2].textContent = t.labelSelected;
    labels[3].textContent = t.labelStories;
    labels[4].textContent = t.labelPapers;
    labels[5].textContent = t.labelAwards;
    labels[6].textContent = t.labelFuture;
  }

  const projHint = document.querySelector('.projects-hint');
  if (projHint) projHint.textContent = t.projectsHint;

  const blogHint = document.querySelector('.blog-hint');
  if (blogHint) blogHint.textContent = t.blogHint;

  const prevBtn = document.getElementById('prev-project');
  const nextBtn = document.getElementById('next-project');
  if (prevBtn) prevBtn.textContent = t.btnPrev;
  if (nextBtn) nextBtn.textContent = t.btnNext;
}

/** 总的语言应用函数 */
function applyLanguage() {
  applyLanguageDom();
  applyStaticI18n();
  if (langBtn) {
    langBtn.textContent = currentLang === 'en' ? 'EN' : '中';
  }
}

// 点击语言按钮切换：中文 <-> 英文
if (langBtn) {
  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    applyLanguage();
  });
}

/* =========================================================
   视图切换
   ========================================================= */

const views = document.querySelectorAll('.view');
const tabs  = document.querySelectorAll('.nav-tab');

function switchView(name){
  tabs.forEach(t=>{
    t.classList.toggle('active', t.dataset.view === name);
  });
  views.forEach(v=>{
    const match = v.id === `view-${name}`;
    v.classList.toggle('active', match);
  });
  window.scrollTo({top:0,behavior:'smooth'});

  const activeView = document.getElementById(`view-${name}`);
  if(activeView){
    const firstSection = activeView.querySelector('.section-first') || activeView.querySelector('.section');
    if(firstSection){
      animate(firstSection,
        { opacity:[0,1], y:[26,0] },
        { duration:0.6, easing:'ease-out' }
      );
    }
  }
}

tabs.forEach(tab=>{
  tab.addEventListener('click', ()=> switchView(tab.dataset.view));
});

document.querySelectorAll('[data-switch]').forEach(btn=>{
  btn.addEventListener('click', ()=> switchView(btn.dataset.switch));
});

/* =========================================================
   Hero 打字机
   ========================================================= */

let twIdx = 0, chIdx = 0, forward = true;
const twElem = document.getElementById('typewriter');

function typeTick(){
  const list = typePhrases[currentLang] || typePhrases.en;
  const p = list[twIdx % list.length];

  if(forward){
    chIdx++;
    if(chIdx>p.length){ forward=false; setTimeout(typeTick,900); return; }
  }else{
    chIdx--;
    if(chIdx<0){ forward=true; twIdx=(twIdx+1)%list.length; setTimeout(typeTick,220); return; }
  }
  if(twElem) twElem.textContent = p.slice(0,chIdx);
  setTimeout(typeTick, forward?60:28);
}

/* =========================================================
   加载静态 sections（About / Papers / Awards / Future）
   ========================================================= */

async function loadMarkdown(path){
  try{
    const r = await fetch(path);
    if(!r.ok) throw new Error('not found');
    return await r.text();
  }catch(e){
    return `# The page could not be found\nNOT_FOUND\n${e.message}`;
  }
}

async function loadStaticSections(){
  const aboutEl  = document.getElementById('about-md');
  const papersEl = document.getElementById('papers-md');
  const awardsEl = document.getElementById('awards-md');
  const futureEl = document.getElementById('future-md');

  if (aboutEl) {
    aboutEl.innerHTML  = marked.parse(await loadMarkdown('projects/intro.md'));
    structureBilingual(aboutEl);
  }
  if (papersEl) {
    papersEl.innerHTML = marked.parse(await loadMarkdown('projects/papers.md'));
    structureBilingual(papersEl);
  }
  if (awardsEl) {
    awardsEl.innerHTML = marked.parse(await loadMarkdown('projects/awards.md'));
    structureBilingual(awardsEl);
  }
  if (futureEl) {
    futureEl.innerHTML = marked.parse(await loadMarkdown('projects/future.md'));
    structureBilingual(futureEl);
  }

  applyLanguage(); // 初始按当前语言应用
}
loadStaticSections();

/* =========================================================
   项目数据 & 翻页机
   ========================================================= */

let projectData = [];   // { file, title, date, index }
let currentProject = 0;

const flipContainer = document.getElementById('project-flip');
const prevBtn = document.getElementById('prev-project');
const nextBtn = document.getElementById('next-project');
const counter = document.getElementById('project-counter');

function updateCounter(){
  if(!counter || !projectData.length) return;
  counter.textContent = `${currentProject+1} / ${projectData.length}`;
}

function renderProjectCard(direction = 1){
  if(!flipContainer || !projectData.length) return;

  const data = projectData[currentProject];
  const oldCard = flipContainer.querySelector('.project-card-flip');
  const card = document.createElement('article');
  card.className = 'project-card-flip';
  card.innerHTML = `
    <div class="project-card-flip-header">
      <div>
        <div class="project-card-flip-title">${data.title}</div>
        <div class="project-card-flip-meta">
          ${data.date ? data.date + " · " : ""}${currentLang === 'en' ? 'Click to open · view details' : '点击打开 · 查看详情'}
        </div>
      </div>
      <div class="project-card-flip-index">${String(data.index+1).padStart(2,'0')}</div>
    </div>
    <div class="project-card-flip-body">
      ${currentLang === 'en'
        ? `This is a summary card for <strong>${data.title}</strong>. Click to see full details, images, and videos.`
        : `这里是 <strong>${data.title}</strong> 的概要卡片，点击可查看完整介绍、图片和视频。`}
    </div>
  `;
  card.addEventListener('click', ()=> openModal('Project', 'projects/'+data.file));
  flipContainer.appendChild(card);

  const fromY = direction > 0 ? 40 : -40;
  animate(card,
    { opacity:[0,1], y:[fromY,0] },
    { duration:0.45, easing:"cubic-bezier(.16,1.4,.3,1)" }
  );

  if(oldCard){
    const toY = direction > 0 ? -40 : 40;
    animate(oldCard,
      { opacity:[1,0], y:[0,toY] },
      { duration:0.3, easing:"ease-in" }
    ).finished.then(()=> oldCard.remove());
  }

  updateCounter();
}

function initProjectFlip(){
  currentProject = 0;
  renderProjectCard(1);

  if(prevBtn){
    prevBtn.onclick = ()=>{
      if(!projectData.length) return;
      currentProject = (currentProject - 1 + projectData.length) % projectData.length;
      renderProjectCard(-1);
    };
  }
  if(nextBtn){
    nextBtn.onclick = ()=>{
      if(!projectData.length) return;
      currentProject = (currentProject + 1) % projectData.length;
      renderProjectCard(1);
    };
  }

  let wheelLocked = false;
  if(flipContainer){
    flipContainer.addEventListener('wheel', e=>{
      e.preventDefault();
      if(wheelLocked || !projectData.length) return;
      wheelLocked = true;
      if(e.deltaY > 0){
        currentProject = (currentProject + 1) % projectData.length;
        renderProjectCard(1);
      }else{
        currentProject = (currentProject - 1 + projectData.length) % projectData.length;
        renderProjectCard(-1);
      }
      setTimeout(()=> wheelLocked=false, 500);
    }, { passive:false });
  }

  updateCounter();
}

/* 供时间线跳转用 */
function jumpToProjectByFile(file){
  const idx = projectData.findIndex(p=>p.file === file);
  if(idx === -1) return;
  currentProject = idx;
  switchView('projects');
  renderProjectCard(1);
}

/* ---------- 加载项目列表 & 时间线 ---------- */

const timelineEl = document.getElementById('timeline');

function buildTimeline(){
  if(!timelineEl) return;
  timelineEl.innerHTML = '';
  projectData.forEach(p=>{
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-title">${p.title}</div>
        <div class="timeline-meta">${p.date || (currentLang === 'en' ? 'Project' : '项目')}</div>
      </div>
    `;
    item.addEventListener('click', ()=> jumpToProjectByFile(p.file));
    timelineEl.appendChild(item);
  });

  inView('.timeline-item', ({ target })=>{
    animate(target,
      { opacity:[0,1], x:[-12,0] },
      { duration:0.4, easing:'ease-out' }
    );
  }, { amount:0.5 });
}

async function loadProjects(){
  const raw = await loadMarkdown('projects/list.txt');
  const lines = raw.split('\n').map(s=>s.trim()).filter(Boolean);

  projectData = lines.map((line, i)=>{
    const parts = line.split('|').map(p=>p.trim());
    const file  = parts[0];
    const base  = file.replace('.md','').replace(/_/g,' ');
    return {
      file,
      title: parts[1] || base,
      date:  parts[2] || '',
      index: i
    };
  });

  initProjectFlip();
  buildTimeline();
  applyLanguage(); // 再同步一次文案
}
loadProjects();

/* =========================================================
   Blog 列表
   ========================================================= */

/*
  /blog/list.txt 每行： slug|Title|Tagline
*/
async function loadBlog(){
  const raw = await loadMarkdown('blog/list.txt');
  const lines = raw.split('\n').map(s=>s.trim()).filter(Boolean);
  const container = document.getElementById('blog-list');
  if(!container) return;
  container.innerHTML = '';

  for(const line of lines){
    const [slug,title,tagline] = line.split('|');
    const safeSlug = (slug || '').trim();
    if(!safeSlug) continue;
    const t   = (title   || safeSlug).trim();
    const tag = (tagline || (currentLang === 'en' ? 'Update' : '更新')).trim();

    const item = document.createElement('article');
    item.className = 'blog-item';
    item.innerHTML = `
      <div class="blog-main">
        <div class="blog-title">${t}</div>
        <div class="blog-meta">${tag}</div>
        <div class="blog-excerpt">${currentLang === 'en'
          ? 'Click to read · view full post'
          : '点击查看 · 阅读完整文章'}</div>
      </div>
      <span class="blog-tag">Blog</span>
    `;
    item.addEventListener('click', ()=> openModal('Blog', `blog/${safeSlug}.md`));
    container.appendChild(item);
  }

  inView('#view-blog', ()=>{
    animate('.blog-item',
      { opacity:[0,1], y:[16,0] },
      { duration:0.6, delay:stagger(0.06) }
    );
  }, { amount:0.3 });
}
loadBlog();

/* =========================================================
   Modal（项目 + 博客详情）
   ========================================================= */

const modal     = document.getElementById('content-modal');
const modalTag  = document.getElementById('modal-tag');
const modalBody = document.getElementById('modal-md');

async function openModal(tag, path){
  if(!modal) return;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // 标签文字跟语言
  if(tag === 'Project'){
    modalTag.textContent = currentLang === 'en' ? 'Project' : '项目';
  }else if(tag === 'Blog'){
    modalTag.textContent = currentLang === 'en' ? 'Blog' : '博客';
  }else{
    modalTag.textContent = currentLang === 'en' ? 'Detail' : '详情';
  }

  const md = await loadMarkdown(path);
  modalBody.innerHTML = marked.parse(md);
  structureBilingual(modalBody);
  applyLanguageDom(); // 只需要切显示/隐藏，固定文案已由 applyLanguage 控制

  animate('.modal-card',
    { opacity:[0,1], y:[28,0] },
    { duration:0.45, easing:'ease-out' }
  );
}
function closeModal(){
  if(!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}
window.closeModal = closeModal;

/* =========================================================
   背景粒子
   ========================================================= */

function initBackground(){
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);

  const COUNT = 80;
  const pts = [];
  for(let i=0;i<COUNT;i++){
    pts.push({
      x:Math.random()*w,
      y:Math.random()*h,
      vx:(Math.random()-0.5)*0.25,
      vy:(Math.random()-0.5)*0.25,
      z:Math.random()*0.8+0.2
    });
  }

  function tick(){
    ctx.clearRect(0,0,w,h);
    const grad = ctx.createRadialGradient(w*0.2,h*0.1,0,w*0.2,h*0.1,w*1.1);
    grad.addColorStop(0,'#e0f2fe');
    grad.addColorStop(1,'#f5f7fb');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,w,h);

    for(const p of pts){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<-40)p.x=w+40;
      if(p.x>w+40)p.x=-40;
      if(p.y<-40)p.y=h+40;
      if(p.y>h+40)p.y=-40;

      const size=2.1*p.z;
      const alpha=0.35+0.4*p.z;
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,size*3);
      g.addColorStop(0,`rgba(56,189,248,${alpha})`);
      g.addColorStop(1,'rgba(56,189,248,0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.arc(p.x,p.y,size*3,0,Math.PI*2);
      ctx.fill();
    }

    for(let i=0;i<COUNT;i++){
      for(let j=i+1;j<COUNT;j++){
        const a=pts[i],b=pts[j];
        const dx=a.x-b.x,dy=a.y-b.y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<130){
          const alpha=0.05*(1-d/130);
          ctx.strokeStyle=`rgba(148,163,184,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
}

/* =========================================================
   抽屉菜单（PC + Mobile）
   ========================================================= */

const menuBtn        = document.getElementById('menu-btn');
const mobileMenu     = document.getElementById('mobile-menu');
const mobileMenuInner= document.querySelector('.mobile-menu-inner');
const menuClose      = document.getElementById('menu-close');

function openDrawer(){
  if(!mobileMenu || !mobileMenuInner) return;
  mobileMenu.classList.add('open');

  animate(mobileMenuInner,
    { x:["-100%","0%"] },
    { duration:0.45, easing:"cubic-bezier(.16,1.4,.3,1)" }
  );

  const items = document.querySelectorAll('.mobile-menu-item');
  items.forEach((item, i)=>{
    animate(item,
      { opacity:[0,1], x:[-40,0], scale:[0.92,1] },
      {
        duration:0.45,
        delay:0.08 + i*0.07,
        easing:"cubic-bezier(.16,1.4,.3,1)"
      }
    );
  });
}
function closeDrawer(){
  if(!mobileMenu || !mobileMenuInner) return;
  animate(mobileMenuInner,
    { x:["0%","-100%"] },
    { duration:0.32, easing:"cubic-bezier(.45,0,.75,.18)" }
  ).finished.then(()=>{
    mobileMenu.classList.remove('open');
  });
}

if(menuBtn)   menuBtn.addEventListener('click', openDrawer);
if(menuClose) menuClose.addEventListener('click', closeDrawer);

document.querySelectorAll('.mobile-menu-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    const view = item.dataset.view;
    if(view) switchView(view);
    closeDrawer();
  });
});

/* =========================================================
   启动
   ========================================================= */

function heroIntro(){
  animate('.hero-card',
    { opacity:[0,1], y:[26,0], scale:[0.96,1] },
    { duration:0.7 }
  );
  animate('.hero-kicker',
    { opacity:[0,1], y:[14,0] },
    { duration:0.6 }
  );
  animate('.hero-title',
    { opacity:[0,1], y:[18,0] },
    { duration:0.7, delay:0.05 }
  );
  animate('.hero-sub',
    { opacity:[0,1], y:[18,0] },
    { duration:0.7, delay:0.15 }
  );
  animate('.hero-actions .btn',
    { opacity:[0,1], y:[12,0] },
    { delay:stagger(0.08,{start:0.25}), duration:0.5 }
  );
}

window.addEventListener('load', ()=>{
  applyLanguage();          // 默认中文
  setTimeout(typeTick,400);
  heroIntro();
  initBackground();
});
