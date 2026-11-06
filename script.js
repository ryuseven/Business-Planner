
let projects = JSON.parse(localStorage.getItem("projects")) || [];

function openProjectForm() {
    document.getElementById("project-form").style.display = "block";
    document.getElementById("project-form").scrollIntoView({
        behavior: "smooth"
    });
}

function closeProjectForm() {
    document.getElementById("project-form").style.display = "none";
}

function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

document.getElementById("new-project-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const project = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        name: document.getElementById("project-name").value,
        client: document.getElementById("client-name").value,
        fee: Number(document.getElementById("project-fee").value),
        deadline: document.getElementById("project-deadline").value
    };

    projects.push(project);

    saveProjects();
    displayProjects();

    this.reset();
    closeProjectForm();
});

function displayProjects() {
    const container = document.getElementById("project-list");

    if (projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state" id="empty-project">
                <div class="empty-icon">▤</div>
                <h3>No projects yet</h3>
                <p>Your projects will appear here once you add them.</p>
                <button onclick="openProjectForm()">Add your first project</button>
            </div>
        `;
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="project-item">
            <h3>${escapeHTML(project.name)}</h3>
            <p>Client: ${escapeHTML(project.client)}</p>
            <p>Fee: $${project.fee.toLocaleString("en-US")}</p>
            <p>Deadline: ${escapeHTML(project.deadline)}</p>
            <span class="project-status">In progress</span>
        </div>
    `).join("");
updateDashboard();
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[character];
    });
}

displayProjects();


// CLIENT MANAGEMENT

let clients = JSON.parse(localStorage.getItem("clients")) || [];

function openClientForm() {
    document.getElementById("client-form").style.display = "block";

    document.getElementById("client-form").scrollIntoView({
        behavior: "smooth"
    });
}

function closeClientForm() {
    document.getElementById("client-form").style.display = "none";
}

function saveClients() {
    localStorage.setItem("clients", JSON.stringify(clients));
}

document.getElementById("new-client-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const client = {
        id: Date.now(),
        name: document.getElementById("new-client-name").value,
        email: document.getElementById("new-client-email").value,
        company: document.getElementById("new-client-company").value,
        phone: document.getElementById("new-client-phone").value
    };

    clients.push(client);

    saveClients();
    displayClients();

    this.reset();
    closeClientForm();
});

function displayClients() {
    const container = document.getElementById("client-list");

    if (clients.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">♧</div>
                <h3>No clients yet</h3>
                <p>Your clients will appear here once you add them.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = clients.map(client => `
        <div class="client-item">
            <div>
                <h3>${escapeHTML(client.name)}</h3>
                <p>${escapeHTML(client.email)}</p>
                <p>${escapeHTML(client.company || "No company")}</p>
                <p>${escapeHTML(client.phone || "No phone number")}</p>
            </div>

            <button class="delete-client"
                onclick="deleteClient(${client.id})">
                Delete
            </button>
        </div>
    `).join("");
}

function deleteClient(id) {
    if (!confirm("Are you sure you want to delete this client?")) {
        return;
    }

    clients = clients.filter(client => client.id !== id);

    saveClients();
    displayClients();
}

displayClients();


function updateDashboard() {
    const period = document.getElementById("period-filter").value;

    const now = new Date();

    const filteredProjects = projects.filter(project => {
        const created = new Date(project.createdAt || project.id);

        if (period === "week") {
            const startOfWeek = new Date(now);
            const day = (now.getDay() + 6) % 7;
            startOfWeek.setDate(now.getDate() - day);
            startOfWeek.setHours(0, 0, 0, 0);

            return created >= startOfWeek && created <= now;
        }

        if (period === "month") {
            return created.getMonth() === now.getMonth() &&
                   created.getFullYear() === now.getFullYear();
        }

        if (period === "year") {
            return created.getFullYear() === now.getFullYear();
        }

        return true;
    });

    const revenue = filteredProjects.reduce(
        (total, project) => total + Number(project.fee || 0), 0
    );

    document.querySelector(".stat-card:nth-child(1) h2").textContent =
        "$" + revenue.toLocaleString("en-US");

    document.querySelector(".stat-card:nth-child(2) h2").textContent =
        filteredProjects.length;

    document.querySelector(".stat-card:nth-child(3) h2").textContent =
        clients.length;
}

updateDashboard();
