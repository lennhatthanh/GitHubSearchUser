const themeToggle = document.querySelector(".theme-toggle");
const moonIcon = document.querySelector(".moon-icon");
const sunIcon = document.querySelector(".sun-icon");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const loadingState = document.querySelector("#loadingState");
const welcomeMessage = document.querySelector("#welcomeMessage");
const userCard = document.querySelector("#userCard");
const errorMessage = document.querySelector("#errorMessage");
const errorText = document.querySelector("#errorText");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
        moonIcon.classList.remove("hidden");
        sunIcon.classList.add("hidden");
    } else {
        localStorage.setItem("theme", "light");
        moonIcon.classList.add("hidden");
        sunIcon.classList.remove("hidden");
    }
});
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    moonIcon.classList.remove("hidden");
    sunIcon.classList.add("hidden");
} else {
    moonIcon.classList.add("hidden");
    sunIcon.classList.remove("hidden");
}
async function getData(data) {
    try {
        errorMessage.classList.add("hidden");
        loadingState.classList.remove("hidden");
        userCard.innerHTML = "";
        welcomeMessage.classList.add("hidden");
        const res = await fetch(`https://api.github.com/users/${data}`);
        if (!res.ok) throw new Error("Lỗi mạng hoặc api");
        searchButton.disabled = false;
        loadingState.classList.add("hidden");
        const user = await res.json();
        renderuser(user);
    } catch (error) {
        searchButton.disabled = false;
        errorMessage.classList.remove("hidden");
        errorText.textContent = "Không tìm thấy người dùng";
        loadingState.classList.add("hidden");
    }
}

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchButton.disabled = true;
        getData(e.target.value);
    }
});

searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    searchButton.disabled = true;
    getData(searchInput.value);
});

function renderuser(user) {
    userCard.classList.remove("hidden");
    userCard.innerHTML = `<div class="user-card-content">
      <div class="user-info">
        <div class="user-avatar">
          <img src="${user.avatar_url}" alt="fg" class="avatar" onerror="this.src='/diverse-user-avatars.png'">
        </div>
        <div class="user-details">
          <h2 class="user-name">${user.name || user.login}</h2>
          <a href="https://github.com/fg" target="_blank" class="user-username">@${user.login}</a>
          <p class="user-bio">${user.bio || "This profile has no bio"}</p>
          <div class="user-stats">
            <div class="stat-badge"><span class="stat-number">${user.public_repos}</span> Repos</div>
            <div class="stat-badge"><span class="stat-number">${user.followers}</span> Followers</div>
            <div class="stat-badge"><span class="stat-number">${user.following}</span> Following</div>
          </div>
          <div class="user-meta">
            <div class="meta-item"><span>Joined ${new Date(user.created_at).toDateString()}</span></div>
            ${user.location ? `<div class="meta-item"><span>${user.location}</span></div>` : ""}
            ${user.blog ? `<div class="meta-item"><a href="${user.blog}" target="_blank">${user.blog}</a></div>` : ""}
          </div>
        </div>
      </div>
    </div>`;
}
