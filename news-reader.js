const urlParams = new URLSearchParams(window.location.search);
const rssUrl = urlParams.get("rss");
const siteName = urlParams.get("name");

document.getElementById("news-title").textContent = siteName || "News Feed";

const newsContainer = document.getElementById("news-container");
const popupOverlay = document.getElementById("popup-overlay");
const popupContent = document.getElementById("popup-content");
const popupClose = document.getElementById("popup-close");

let currentPage = 1;
const postsPerPage = 10;
let newsItems = [];

// Load RSS Feed
async function loadRSS() {
    const parser = new RSSParser();
    try {
        const feed = await parser.parseURL(rssUrl);
        newsItems = feed.items;
        renderNews();
    } catch (error) {
        console.error("Failed to load RSS feed:", error);
        newsContainer.innerHTML = "<p>Unable to load news. Please try again later.</p>";
    }
}

// Render News Cards
function renderNews() {
    newsContainer.innerHTML = "";
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const pageItems = newsItems.slice(start, end);

    pageItems.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("news-card");
        card.innerHTML = `
            <img src="${item.enclosure?.url || 'https://via.placeholder.com/300'}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>${item.contentSnippet || "No description available."}</p>
        `;
        card.onclick = () => showPopup(item);
        newsContainer.appendChild(card);
    });

    updateNavigation();
}

// Show Popup with News Details
function showPopup(item) {
    popupContent.innerHTML = `
        <h2>${item.title}</h2>
        <img src="${item.enclosure?.url || 'https://via.placeholder.com/300'}" alt="${item.title}" style="width: 100%; border-radius: 8px;">
        <p>${item.content || item.contentSnippet || "No content available."}</p>
        <a href="${item.link}" target="_blank">Read more on the original website</a>
    `;
    popupOverlay.style.display = "flex";
}

// Close Popup
popupClose.onclick = () => {
    popupOverlay.style.display = "none";
};

// Update Navigation Buttons
function updateNavigation() {
    document.getElementById("prev-button").disabled = currentPage === 1;
    document.getElementById("next-button").disabled =
        currentPage * postsPerPage >= newsItems.length;
}

// Handle Navigation
document.getElementById("prev-button").onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        renderNews();
    }
};
document.getElementById("next-button").onclick = () => {
    if (currentPage * postsPerPage < newsItems.length) {
        currentPage++;
        renderNews();
    }
};

// Initialize
loadRSS();
