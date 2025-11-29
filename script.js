// 使用 motion.dev 做动画
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

/* ---------- 平滑滚动 ---------- */
document.querySelectorAll('[data-target]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.dataset.target;
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
  });
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
    if(chIdx<0){ forward=true; twIdx=(twIdx+1)%phrases.length; setTimeout(typeTick,200); return; }
  }
  twElem.textContent = p.slice(0,chIdx);
  setTimeout(typeTick, forward?60:28);
}

/* ---------- 加载静态区块 ---------- */
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

/* ---------- Projects 列表 & 模态框 ---------- */
async function loadProjects(){
  const raw = await loadMarkdown('projects/list.txt');
  const files = raw.split('\n').map(s=>s.trim()).filter(Boolean);

  const container = document.getElementById('project-list');
  container.innerHTML = '';

  files.forEach((f, i)=>{
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
    card.addEventListener('click', ()=> openProjectModal(f));
    container.appendChild(card);
  });

  // 滚动到 Projects 时，卡片飞入
  inView('#projects', ()=>{
    animate('.project-card',
      { opacity:[0,1], y:[24,0], scale:[0.96,1] },
      { duration:0.7, delay:stagger(0.08), easing:'ease-out' }
    );
  }, { amount:0.3 });
}
loadProjects();

// Modal
const modal = document.getElementById('project-modal');
async function openProjectModal(file){
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  const md = await loadMarkdown('projects/' + file);
  document.getElementById('project-detail-md').innerHTML = marked.parse(md);

  animate('.modal-card',
    { opacity:[0,0,1], y:[30,0] },
    { duration:0.45, easing:'ease-out' }
  );
}
function closeModal(){
  modal.style.display = 'none';
  document.body.style.overflow = '';
}
window.closeModal = closeModal;

/* ---------- Section 出场动画 ---------- */
inView('.section', ({ target })=>{
  const idx = target.querySelector('.section-index');
  const title = target.querySelector('.section-title');
  const card = target.querySelector('.card');

  if(idx){
    animate(idx,{ opacity:[0,1], y:[10,0] },{ duration:0.5 });
  }
  if(title){
    animate(title,{ opacity:[0,1], y:[18,0] },{ duration:0.55, delay:0.06 });
  }
  if(card){
    animate(card,{ opacity:[0,1], y:[24,0] },{ duration:0.6, delay:0.12 });
  }
},{ amount:0.35 });

/* ---------- Hero 入场 ---------- */
function heroIntro(){
  animate('.hero-card',
    { opacity:[0,1], y:[28,0], scale:[0.96,1] },
    { duration:0.7, easing:'ease-out' }
  );
  animate('.hero-kicker',
    { opacity:[0,1], y:[16,0] },
    { duration:0.6 }
  );
  animate('.hero-title',
    { opacity:[0,1], y:[22,0] },
    { duration:0.7, delay:0.05 }
  );
  animate('.hero-sub',
    { opacity:[0,1], y:[18,0] },
    { duration:0.7, delay:0.15 }
  );
  animate('.hero-actions .btn',
    { opacity:[0,1], y:[12,0] },
    { delay:stagger(0.08, { start:0.25 }), duration:0.5 }
  );
}

/* ---------- 背景粒子场（简易 3D 感） ---------- */
function initBackground(){
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const particles = [];
  const COUNT = 70;

  function reset(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', reset);

  for(let i=0;i<COUNT;i++){
    particles.push({
      x: Math.random()*w,
      y: Math.random()*h,
      z: Math.random()*0.8 + 0.2, // 模拟深度
      vx: (Math.random()-0.5)*0.25,
      vy: (Math.random()-0.5)*0.25
    });
  }

  function tick(){
    ctx.clearRect(0,0,w,h);

    // 背景轻微渐变
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'#e0f2fe');
    g.addColorStop(1,'#f5f5f7');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    // 绘制粒子
    for(const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x<-40)p.x=w+40;
      if(p.x>w+40)p.x=-40;
      if(p.y<-40)p.y=h+40;
      if(p.y>h+40)p.y=-40;

      const size = 2.2 * p.z;
      const alpha = 0.35 + 0.4*p.z;

      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,size*2.6);
      grad.addColorStop(0,`rgba(56,189,248,${alpha})`);
      grad.addColorStop(1,'rgba(56,189,248,0)');
      ctx.fillStyle = grad;
      ctx.arc(p.x,p.y,size*2.6,0,Math.PI*2);
      ctx.fill();
    }

    // 粒子之间连一些线
    for(let i=0;i<COUNT;i++){
      for(let j=i+1;j<COUNT;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist<140){
          const alpha = 0.05*(1-dist/140);
          ctx.strokeStyle = `rgba(148,163,184,${alpha})`;
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

/* ---------- 启动 ---------- */
window.addEventListener('load', ()=>{
  setTimeout(typeTick,400);
  heroIntro();
  initBackground();
});
