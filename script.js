import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

/* ---------- 工具：加载 Markdown ---------- */
async function loadMarkdown(path){
  try{
    const r = await fetch(path);
    if(!r.ok) throw new Error('not found');
    return await r.text();
  }catch(e){
    return `# The page could not be found\nNOT_FOUND\n${e.message}`;
  }
}

/* ---------- 视图切换（顶部菜单） ---------- */
const views = document.querySelectorAll('.view');
const tabs = document.querySelectorAll('.nav-tab');

function switchView(name){
  tabs.forEach(t=>{
    t.classList.toggle('active', t.dataset.view === name);
  });
  views.forEach(v=>{
    const match = v.id === `view-${name}`;
    v.classList.toggle('active', match);
  });
  window.scrollTo({top:0,behavior:'smooth'});

  // 小动画：新视图中的 section 平滑进场
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

// hero 按钮也可以切换视图
document.querySelectorAll('[data-switch]').forEach(btn=>{
  btn.addEventListener('click', ()=> switchView(btn.dataset.switch));
});

/* ---------- Hero 打字机 ---------- */
const phrases = [
  "Yuan Wutong",
  "Robotics Developer",
  "Embedded Control Engineer",
  "Flexible Sensor Explorer"
];
let twIdx = 0, chIdx = 0, forward = true;
const twElem = document.getElementById('typewriter');

function typeTick(){
  const p = phrases[twIdx];
  if(forward){
    chIdx++;
    if(chIdx>p.length){ forward=false; setTimeout(typeTick,900); return; }
  }else{
    chIdx--;
    if(chIdx<0){ forward=true; twIdx=(twIdx+1)%phrases.length; setTimeout(typeTick,220); return; }
  }
  twElem.textContent = p.slice(0,chIdx);
  setTimeout(typeTick, forward?60:28);
}

/* ---------- 加载静态 sections (MD) ---------- */
async function loadStaticSections(){
  document.getElementById('about-md').innerHTML  =
    marked.parse(await loadMarkdown('projects/intro.md'));
  document.getElementById('papers-md').innerHTML =
    marked.parse(await loadMarkdown('projects/papers.md'));
  document.getElementById('awards-md').innerHTML =
    marked.parse(await loadMarkdown('projects/awards.md'));
  document.getElementById('future-md').innerHTML =
    marked.parse(await loadMarkdown('projects/future.md'));
}
loadStaticSections();

/* ---------- Projects 列表 + Modal ---------- */
async function loadProjects(){
  const raw = await loadMarkdown('projects/list.txt');
  const files = raw.split('\n').map(s=>s.trim()).filter(Boolean);
  const container = document.getElementById('project-list');
  container.innerHTML = '';

  files.forEach((f,i)=>{
    const name = f.replace('.md','').replace(/_/g,' ');
    const idx = String(i+1).padStart(2,'0');
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-index">${idx}</div>
      <div class="project-meta">
        <div class="project-title">${name}</div>
        <p class="project-sub">Click to open · 查看详情</p>
      </div>
    `;
    card.addEventListener('click', ()=> openModal('Project', 'projects/'+f));
    container.appendChild(card);
  });

  inView('#view-projects', ()=>{
    animate('.project-card',
      { opacity:[0,1], y:[24,0], scale:[0.96,1] },
      { duration:0.7, delay:stagger(0.08) }
    );
  }, { amount:0.3 });
}
loadProjects();

/* ---------- Blog 列表 + Modal ---------- */
/*
  /blog/list.txt 每行格式建议为：
  slug|Title|Tagline
  例如：
  first_post|Building my first biped robot|Robotics Dev Log
*/
async function loadBlog(){
  const raw = await loadMarkdown('blog/list.txt');
  const lines = raw.split('\n').map(s=>s.trim()).filter(Boolean);
  const container = document.getElementById('blog-list');
  if(!container) return;
  container.innerHTML = '';

  for(const line of lines){
    const [slug,title,tagline] = line.split('|');
    const safeSlug = slug.trim();
    const t = (title || safeSlug).trim();
    const tag = (tagline || 'Update').trim();

    const item = document.createElement('article');
    item.className = 'blog-item';
    item.innerHTML = `
      <div class="blog-main">
        <div class="blog-title">${t}</div>
        <div class="blog-meta">${tag}</div>
        <div class="blog-excerpt">Click to read · 点击查看全文</div>
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

/* ---------- 通用 Modal ---------- */
const modal = document.getElementById('content-modal');
const modalTag = document.getElementById('modal-tag');
const modalBody = document.getElementById('modal-md');

async function openModal(tag, path){
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  modalTag.textContent = tag;
  const md = await loadMarkdown(path);
  modalBody.innerHTML = marked.parse(md);

  animate('.modal-card',
    { opacity:[0,1], y:[28,0] },
    { duration:0.45, easing:'ease-out' }
  );
}
function closeModal(){
  modal.style.display = 'none';
  document.body.style.overflow = '';
}
window.closeModal = closeModal;

/* ---------- 背景粒子（简化版 伪 3D） ---------- */
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

/* ---------- Hero 入场动画 ---------- */
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

/* ---------- 启动 ---------- */
window.addEventListener('load', ()=>{
  setTimeout(typeTick,400);
  heroIntro();
  initBackground();
});

/* ---------- Mobile / Desktop Drawer Menu Logic ---------- */
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuInner = document.querySelector('.mobile-menu-inner');
const menuClose = document.getElementById('menu-close');

function openDrawer(){
  if(!mobileMenu || !mobileMenuInner) return;
  mobileMenu.classList.add('open');

  // 白色面板滑入
  animate(mobileMenuInner,
    { x:["-100%","0%"] },
    { duration:0.35, easing:'ease-out' }
  );

  // 菜单项阶梯式滑入
  animate('.mobile-menu-item',
    { opacity:[0,1], x:[-16,0] },
    { delay:stagger(0.06,{ start:0.10 }), duration:0.35, easing:'ease-out' }
  );
}

function closeDrawer(){
  if(!mobileMenu || !mobileMenuInner) return;

  // 先把面板滑回去，再关 overlay
  animate(mobileMenuInner,
    { x:["0%","-100%"] },
    { duration:0.28, easing:'ease-in' }
  ).finished.then(()=>{
    mobileMenu.classList.remove('open');
  });
}

if(menuBtn){
  menuBtn.addEventListener('click', openDrawer);
}
if(menuClose){
  menuClose.addEventListener('click', closeDrawer);
}

// 点击菜单项：切换视图 + 关闭抽屉
document.querySelectorAll('.mobile-menu-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    const view = item.dataset.view;
    if(view) switchView(view);
    closeDrawer();
  });
});

