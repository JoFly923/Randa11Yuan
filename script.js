/* === Load Intro === */
async function loadIntro(lang = "en") {
    const text = await fetch("projects/intro.md").then(r => r.text());
    const [titleEn, titleZh, ...body] = text.split("\n");

    document.getElementById("intro-title").innerText =
        lang === "en" ? titleEn.replace("# ", "") : titleZh.replace("# ", "");

    document.getElementById("intro-text").innerText =
        body.join("\n").trim();
}

/* === Load Project List === */
async function loadProjects() {
    const list = await fetch("projects/list.txt").then(r => r.text());
    const names = list.split("\n").filter(l => l.trim());

    const container = document.getElementById("project-list");
    container.innerHTML = "";

    names.forEach(name => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `<h3 class="project-title">${name.replace(".md","")}</h3>`;
        card.onclick = () => window.open(`projects/${name}`, "_blank");
        container.appendChild(card);
    });
}

/* === Language Switch === */
const langButtons = document.querySelectorAll(".lang-btn");
langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        loadIntro(btn.dataset.lang);
        document.querySelector(".section-title").innerText =
            btn.dataset.lang === "en" ? "Projects" : "项目";
    });
});

/* === Init === */
loadIntro("en");
loadProjects();
