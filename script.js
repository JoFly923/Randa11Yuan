// Motion.dev 动画库（CDN ESM 版本）
import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

/* ------------------ UTIL: load markdown ------------------ */
async function loadMarkdown(path){
  try{
    const r = await fetch(path);
    if(!r.ok) throw new Error('not found');
    return await r.text();
  }catch(e){
    return `# The page could not be found\nNOT_FOUND\n${e.message}`;
  }
}

/* ------------------ smooth scrolling buttons ------------------ */
document.querySelectorAll('.btn[data-target]').forEach(b=>{
  b.addEventListener('click', ()=> {
    const id = b.dataset.target;
    document.getElementById(id).scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* ------------------ typewriter for hero ------------------ */
const phrases = [
  "Yuan Wutong",
  "Robotics Developer",
  "Embedded Control Engineer",
  "Flexible Sensor Explorer"
];
let twIdx = 0, chIdx = 0, twForward = true;
const twElem = document.getElementById('typewriter');
function typeTick(){
  const p = phrases[twIdx];
  if(twForward){
    chIdx++;
    if(chIdx>p.length){ twForward=false; setTimeout(typeTick,900); return; }
  } else {
    chIdx--;
    if(chIdx<0){ twForward=true; twIdx=(twIdx+1)%phrases.length; setTimeout(typeTick,220); return; }
  }
  twElem.textContent = p.slice(0,chIdx);
  setTimeout(typeTick, twForward?60:26);
}

/* ------------------ hero parallax (mouse) ------------------ */
(function(){
  const hero = document.getElementById('hero');
  const visual = document.getElementById('hero-visual');
  if(!hero || !visual) return;
  hero.addEventListener('mousemove', e=>{
    const r = hero.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const dx = (e.clientX - cx)/r.width, dy = (e.clientY - cy)/r.height;
    visual.style.transform = `translate(${dx*14}px, ${dy*10}px) rotate(${dx*2}deg)`;
  });
  hero.addEventListener('mouseleave', ()=> visual.style.transform = 'none');
})();

/* ------------------ load static sections (MD) ------------------ */
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

/* ------------------ projects list & modal ------------------ */
async function loadProjects(){
  const raw = await loadMarkdown('projects/list.txt'); // simple text
  const files = raw.split('\n').map(s=>s.trim()).filter(Boolean);
  const container = document.getElementById('project-list');
  container.innerHTML = '';

  files.forEach((f, idx)=>{
    const name = f.replace('.md','').replace(/_/g,' ');
    const index = String(idx+1).padStart(2,'0');

    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-index">${index}</div>
      <div class="project-meta">
        <div class="project-title">${name}</div>
        <p class="project-sub">Click to open · 查看详情</p>
      </div>
    `;
    card.addEventListener('click', ()=> openProjectModal(f));
    container.appendChild(card);
  });

  // 滚动到 Projects 区域时，序号和卡片做一次进场动画
  inView('#projects', () => {
    animate('.project-card', 
      { opacity:[0,1], y:[24,0] },
      { duration:0.7, delay:stagger(0.08), easing:'ease-out' }
    );
    animate('.project-index',
      { opacity:[0,1], y:[36,0] },
      { duration:0.7, delay:stagger(0.12), easing:'ease-out' }
    );
  }, { amount:0.3 });
}
loadProjects();

/* ------------------ modal ------------------ */
const modal = document.getElementById('project-modal');
async function openProjectModal(file){
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  const md = await loadMarkdown('projects/' + file);
  document.getElementById('project-detail-md').innerHTML = marked.parse(md);

  animate('.modal-content',
    { opacity:[0,0,1], scale:[0.9,1.02,1] },
    { duration:0.45, easing:'ease-out' }
  );
}
function closeModal(){
  modal.style.display = 'none';
  document.body.style.overflow = '';
}
// 让 HTML 里的 onclick 能访问到
window.closeModal = closeModal;

/* ------------------ section scroll reveal ------------------ */
inView('.section', ({ target }) => {
  const heading = target.querySelector('.section-heading');
  const tag = target.querySelector('.section-tag');
  const card = target.querySelector('.card');

  if(tag){
    animate(tag, { opacity:[0,1], y:[12,0] }, { duration:0.5, easing:'ease-out' });
  }
  if(heading){
    animate(heading, { opacity:[0,1], y:[16,0] }, { duration:0.55, delay:0.05 });
  }
  if(card){
    animate(card, { opacity:[0,1], y:[26,0] }, { duration:0.6, delay:0.1 });
  }
}, { amount:0.25 });

/* ------------------ Hero intro animation ------------------ */
function heroIntro(){
  animate('#avatar',
    { opacity:[0,1], y:[26,0] },
    { duration:0.7, easing:'ease-out' }
  );
  animate('.hero-title',
    { opacity:[0,1], y:[16,0] },
    { duration:0.7, delay:0.08 }
  );
  animate('.hero-sub',
    { opacity:[0,1], y:[18,0] },
    { duration:0.7, delay:0.16 }
  );
  animate('.hero-actions .btn',
    { opacity:[0,1], y:[14,0] },
    { delay:stagger(0.08, { start:0.24 }), duration:0.55 }
  );
}

window.addEventListener('load', ()=>{
  setTimeout(typeTick,400);
  heroIntro();
});

/* ------------------ language buttons (简单版本) ------------------ */
document.querySelectorAll('.lang-btn').forEach(b=>{
  b.addEventListener('click', ()=>{
    const lang = b.dataset.lang;
    document.querySelectorAll('.section-heading').forEach(h=>{
      if(lang==='zh') h.textContent = {
        'About / 关于': '关于 / About',
        'Projects / 项目': '项目 / Projects',
        'Papers / 论文': '论文 / Papers',
        'Awards / 荣誉': '荣誉 / Awards',
        'Future / 未来计划': '未来计划 / Future'
      }[h.textContent] || h.textContent;
      if(lang==='en') h.textContent = {
        '关于 / About':'About / 关于',
        '项目 / Projects':'Projects / 项目',
        '论文 / Papers':'Papers / 论文',
        '荣誉 / Awards':'Awards / 荣誉',
        '未来计划 / Future':'Future / 未来计划'
      }[h.textContent] || h.textContent;
    });
  });
});
