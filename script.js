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
    if(chIdx<0){ twForward=true; twIdx=(twIdx+1)%phrases.length; setTimeout(typeTick,200); return; }
  }
  twElem.textContent = p.slice(0,chIdx);
  setTimeout(typeTick, twForward?60:28);
}
window.addEventListener('load', ()=> setTimeout(typeTick,400));

/* ------------------ mouse parallax (hero visual) ------------------ */
(function(){
  const hero = document.getElementById('hero');
  const visual = document.getElementById('hero-visual');
  if(!hero || !visual) return;
  hero.addEventListener('mousemove', e=>{
    const r = hero.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const dx = (e.clientX - cx)/r.width, dy = (e.clientY - cy)/r.height;
    visual.style.transform = `translate(${dx*12}px, ${dy*10}px) rotate(${dx*2}deg)`;
  });
  hero.addEventListener('mouseleave', ()=> visual.style.transform = 'none');
})();

/* ------------------ load static sections (MD) ------------------ */
async function loadStaticSections(){
  document.getElementById('about-md').innerHTML = marked.parse(await loadMarkdown('projects/intro.md'));
  document.getElementById('papers-md').innerHTML = marked.parse(await loadMarkdown('projects/papers.md'));
  document.getElementById('awards-md').innerHTML = marked.parse(await loadMarkdown('projects/awards.md'));
  document.getElementById('future-md').innerHTML = marked.parse(await loadMarkdown('projects/future.md'));
}
loadStaticSections();

/* ------------------ projects list & modal ------------------ */
async function loadProjects(){
  const raw = await loadMarkdown('projects/list.txt'); // simple text
  const files = raw.split('\n').map(s=>s.trim()).filter(Boolean);
  const container = document.getElementById('project-list');
  container.innerHTML = '';
  for(const f of files){
    const name = f.replace('.md','').replace(/_/g,' ');
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.innerHTML = `<strong>${name}</strong><p style="margin-top:8px;color:#555;font-size:13px">Click to open</p>`;
    card.addEventListener('click', ()=> openProjectModal(f));
    container.appendChild(card);
    // reveal will be handled by observer
  }
}
loadProjects();

/* ------------------ modal ------------------ */
const modal = document.getElementById('project-modal');
async function openProjectModal(file){
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  const md = await loadMarkdown('projects/' + file);
  document.getElementById('project-detail-md').innerHTML = marked.parse(md);
  // small entrance animation
  document.querySelector('.modal-content').style.transform = 'scale(.98)';
  setTimeout(()=> document.querySelector('.modal-content').style.transform = 'scale(1)',20);
}
function closeModal(){
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

/* ------------------ intersection observer for reveal ------------------ */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('show');
  });
},{threshold:0.16});
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.reveal, .card, .project-card').forEach(el=>{
    // ensure initial hidden for reveal elements
    el.classList.add('reveal');
    io.observe(el);
  });
});

/* ------------------ language buttons minimal (placeholder) ------------------ */
document.querySelectorAll('.lang-btn').forEach(b=>{
  b.addEventListener('click', ()=>{
    // minimal: just switch some headings for now
    const lang = b.dataset.lang;
    document.querySelectorAll('.section-heading').forEach(h=>{
      if(lang==='zh') h.textContent = {
        'About / 关于': '关于 / About',
        'Projects / 项目': '项目 / Projects'
      }[h.textContent] || h.textContent;
    });
    // re-load about in other lang: if you maintain bilingual MD, handle accordingly
  });
});
