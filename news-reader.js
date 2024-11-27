const API_KEY = "myjhs9wh7ngw3ktagtwxfsikxyabma0ffdux0brz"; // Replace with your RSS2JSON API key
const RSS_FEED = "https://feeds.bbci.co.uk/news/rss.xml"; // Replace with your desired RSS feed URL
const RSS_FEED = "https://www.jagonews24.com/rss/rss.xml";
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEED)}&api_key=${API_KEY}`;

const newsContainer = document.getElementById("news-container");
const popupOverlay = document.getElementById("popup-overlay");
const popupContent = document.getElementById("popup-content");
const popupClose = document.getElementById("popup-close");

// Fetch RSS feed
async function fetchNews() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch news.");
        const data = await response.json();

        renderNews(data.items);
    } catch (error) {
        console.error("Error fetching news:", error);
        newsContainer.innerHTML = "<p>Unable to load news. Please try again later.</p>";
    }
}

// Render news cards
function renderNews(newsItems) {
    newsContainer.innerHTML = ""; // Clear existing news
    newsItems.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("news-card");
        card.innerHTML = `
            <img src="${item.enclosure?.link || 'https://via.placeholder.com/300'}" alt="${item.title}">
            <h3>${item.title}</h3>
        `;
        card.onclick = () => showPopup(item);
        newsContainer.appendChild(card);
    });
}

// Show popup with news details
function showPopup(newsItem) {
    popupContent.innerHTML = `
        <h2>${newsItem.title}</h2>
        <img src="${newsItem.enclosure?.link || 'https://via.placeholder.com/600'}" alt="${newsItem.title}" style="width: 100%; margin-bottom: 20px;">
        <p>${newsItem.content || newsItem.description}</p>
        <a href="${newsItem.link}" target="_blank">Read more on original site</a>
    `;
    popupOverlay.style.display = "flex";
}

// Close popup
popupClose.onclick = () => {
    popupOverlay.style.display = "none";
};

// Initialize
fetchNews();
