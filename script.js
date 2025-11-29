/* ================= Load Markdown File ================= */
async function loadMarkdown(path) {
    const res = await fetch(path);
    const text = await res.text();
    return marked.parse(text);
}

/* ================= Smooth Scroll ================= */
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

/* ================= Load Static Markdown Sections ================= */
async function loadStaticSections() {
    document.getElementById("about-md").innerHTML =
        await loadMarkdown("projects/intro.md");

    document.getElementById("papers-md").innerHTML =
        await loadMarkdown("projects/papers.md");

    document.getElementById("awards-md").innerHTML =
        await loadMarkdown("projects/awards.md");

    document.getElementById("future-md").innerHTML =
        await loadMarkdown("projects/future.md");
}

/* ================= Load Projects List ================= */
async function loadProjects() {
    const listText = await fetch("projects/list.txt").then(r => r.text());
    const files = listText.split("\n").filter(x => x.trim() !== "");

    const container = document.getElementById("project-list");
    container.innerHTML = "";

    for (let file of files) {
        const name = file.replace(".md", "");
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `<strong>${name}</strong>`;
        card.onclick = () => openProject(file);
        container.appendChild(card);
    }
}

/* ================= Project Modal ================= */
async function openProject(mdFile) {
    document.getElementById("project-modal").style.display = "flex";
    document.getElementById("project-detail-md").innerHTML =
        await loadMarkdown("projects/" + mdFile);
}

function closeModal() {
    document.getElementById("project-modal").style.display = "none";
}

/* ================= Language Switching ================= */
const langData = {
    en: {
        about: "About",
        projects: "Projects",
    },
    zh: {
        about: "关于我",
        projects: "项目",
    }
};

document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const lang = btn.dataset.lang;
        switchLanguage(lang);
    });
});

function switchLanguage(lang) {
    document.querySelector('[data-en="Projects"]').innerText =
        langData[lang].projects;
}

/* ================= Init ================= */
loadStaticSections();
loadProjects();
