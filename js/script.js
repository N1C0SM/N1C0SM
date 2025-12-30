const GITHUB_TOKEN = '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';
const USERNAME = 'N1C0SM';

async function fetchRepos() {
    const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
    const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`, { headers });
    return await response.json();
}

function getLanguageStats(repos) {
    const languages = {};
    repos.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });
    return Object.entries(languages).sort((a, b) => b[1] - a[1]);
}

async function loadUserData() {
    try {
        const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
        const response = await fetch(`https://api.github.com/users/${USERNAME}`, { headers });
        const user = await response.json();
        document.getElementById('portfolio-name').textContent = `Hola, soy ${user.name || 'N1C0'}`;
        document.getElementById('profile-photo').src = user.avatar_url;

        // Calculate experience
        const joinDate = new Date(user.created_at);
        const now = new Date();
        const years = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24 * 365));
        document.getElementById('experience-years').textContent = `+${years} años en proyectos web`;
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

async function loadMainStack() {
    try {
        const repos = await fetchRepos();
        const sortedLanguages = getLanguageStats(repos).slice(0, 5);
        const container = document.getElementById('main-stack');
        sortedLanguages.forEach(([lang]) => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = lang;
            container.appendChild(chip);
        });
    } catch (error) {
        console.error('Error loading main stack:', error);
    }
}

async function loadTechGrid() {
    try {
        const repos = await fetchRepos();
        const sortedLanguages = getLanguageStats(repos).slice(0, 3);
        const container = document.getElementById('tech-grid');

        sortedLanguages.forEach(([lang, count]) => {
            const techCard = document.createElement('div');
            techCard.className = 'tech-card';
            techCard.innerHTML = `
                <p class="label">${lang}</p>
                <div class="chips">
                    <span class="chip">${count} proyectos</span>
                    <span class="chip">Desarrollo web</span>
                </div>
            `;
            container.appendChild(techCard);
        });
    } catch (error) {
        console.error('Error loading tech grid:', error);
    }
}

async function loadProjects() {
    try {
        console.log('Loading projects...');
        const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
        const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=10`, { headers });
        const repos = await response.json();
        console.log('Repos fetched:', repos);
        const container = document.getElementById('projects-container');
        console.log('Container:', container);

        repos.forEach(repo => {
            console.log('Processing repo:', repo.name, repo.fork, repo.description);
            if (!repo.fork && repo.description) {  // Only non-fork repos with description
                const projectCard = document.createElement('article');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
                    <div class="project-header">
                        <div>
                            <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
                            <p class="muted">${repo.language || 'Proyecto'} · ${new Date(repo.updated_at).getFullYear()}</p>
                        </div>
                        <span class="chip">${repo.language || 'Web'}</span>
                    </div>
                    <p class="project-body">${repo.description}</p>
                    <div class="project-footer">
                        <span class="label">Estrellas</span>
                        <span>${repo.stargazers_count}</span>
                    </div>
                `;
                container.appendChild(projectCard);
                console.log('Added project:', repo.name);
            }
        });
        console.log('Projects loaded');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Functions for CV page (index.html)
async function loadUserDataCV() {
    try {
        const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
        const response = await fetch(`https://api.github.com/users/${USERNAME}`, { headers });
        const user = await response.json();
        document.getElementById('user-name').textContent = user.name || 'N1C0';
        document.getElementById('user-bio').textContent = user.bio || 'Desarrollador web apasionado.';

        // Calculate experience
        const joinDate = new Date(user.created_at);
        const now = new Date();
        const years = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24 * 365));
        const experienceText = document.querySelector('.cv-item p.muted');
        if (experienceText) {
            experienceText.textContent = `+${years} años en proyectos web`;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

async function loadServices() {
    try {
        const repos = await fetchRepos();
        const languageSet = new Set(repos.map(repo => repo.language).filter(Boolean));

        const container = document.getElementById('services-list');
        let html = '';

        if (languageSet.has('HTML') || languageSet.has('CSS') || languageSet.has('JavaScript')) {
            html += `
                <div class="service-category">
                    <h4>Desarrollo web</h4>
                    <p>HTML & CSS</p>
                    <p>JavaScript</p>
                    <p>Diseño responsive</p>
                    <p>Accesibilidad</p>
                    <p>Optimización de carga</p>
                </div>
            `;
        }
        if (languageSet.has('PHP') || languageSet.has('MySQL')) {
            html += `
                <div class="service-category">
                    <h4>Backend simple</h4>
                    <p>PHP</p>
                    <p>Formularios</p>
                    <p>Autenticación básica</p>
                    <p>MySQL</p>
                </div>
            `;
        }
        // Always include Mantenimiento
        html += `
            <div class="service-category">
                <h4>Mantenimiento</h4>
                <p>Actualizaciones</p>
                <p>Mejoras de rendimiento</p>
                <p>Corrección de errores</p>
            </div>
        `;

        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

async function loadLanguages() {
    try {
        const repos = await fetchRepos();
        const sortedLanguages = getLanguageStats(repos).slice(0, 5);
        const container = document.getElementById('github-languages');
        sortedLanguages.forEach(([lang]) => {
            const chip = document.createElement('span');
            chip.className = 'skill-chip';
            chip.textContent = lang;
            container.appendChild(chip);
        });
    } catch (error) {
        console.error('Error loading languages:', error);
    }
}

async function loadCVProjects() {
    try {
        const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
        const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=5`, { headers });
        const repos = await response.json();
        const container = document.getElementById('cv-projects');

        repos.slice(0, 3).forEach(repo => {  // Top 3 repos
            if (!repo.fork && repo.description) {
                const item = document.createElement('div');
                item.className = 'cv-item';
                item.innerHTML = `
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p class="muted">${repo.language || 'Proyecto'} · ${new Date(repo.updated_at).getFullYear()}</p>
                    <p>${repo.description}</p>
                    <p><strong>Estrellas:</strong> ${repo.stargazers_count}</p>
                `;
                container.appendChild(item);
            }
        });
    } catch (error) {
        console.error('Error loading CV projects:', error);
    }
}