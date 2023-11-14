/* --------- RENDER DATAS TO THE DOM --------- */
const NEWS_API_URL = 'https://newsapi.org/v2/everything?q=All&from=2023-11-13&sortBy=popularity&apiKey=d31bd4f44a6b4d96bb34b43396382429';
const searchInput = document.getElementById('searchInput');
const form = document.getElementById('form');
const loading = document.querySelector('.loading');
const notFoundMessage = document.querySelector('.notFoundMessage');
const newsContainer = document.getElementById('newsContainerAll');
const pagination = document.querySelector('.pagination');

const itemsPerPage = 5;
let currentPage = 1;
let totalItems = 0;
let currentNews = [];

async function getData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        totalItems = data.articles.length;
        return data.articles;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function updatePaginationLinks() {
    pagination.innerHTML = '';
    const totalPage = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPage; i++) {
        const pageLink = document.createElement('li');
        pageLink.textContent = i;

        if (i === currentPage) {
            pageLink.classList.add('active');
        }

        pagination.appendChild(pageLink);

        pageLink.addEventListener('click', () => {
            currentPage = i;
            updateNews(currentNews);
            updatePaginationLinks();
        });
    }
}

async function updateNews(newsData) {
    newsContainer.innerHTML = '';
    let found = false;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const filteredNews = newsData.slice(startIndex, endIndex);

    filteredNews.forEach((article) => {
        const { title, description, url, urlToImage, author } = article;
        const newsCard = document.createElement('div');
        newsCard.classList.add('article');
        const cardText = document.createElement('div');
        cardText.classList.add('texts')

        const image = document.createElement('img');
        image.src = urlToImage || './images/default-image.jpg';
        image.alt = title;
        newsCard.appendChild(image);

        const authorElement = document.createElement('span');
        const safeAuthor = (author || '').toLowerCase();
        authorElement.textContent = `Author: ${safeAuthor || 'Not available'}`;
        cardText.appendChild(authorElement);

        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        cardText.appendChild(titleElement);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = description;
        cardText.appendChild(descriptionElement);

        const readMoreLink = document.createElement('a');
        readMoreLink.href = url;
        readMoreLink.textContent = 'Read more...';
        readMoreLink.target = '_blank';
        cardText.appendChild(readMoreLink);

        newsCard.appendChild(cardText);
        newsContainer.appendChild(newsCard);
        found = true;
    });
    window.scrollTo(0, 0);
    loading.style.display = 'none';
    if (!found) {
        notFoundMessage.style.display = 'block';
    } else {
        notFoundMessage.style.display = 'none';
    }

}


form.addEventListener('submit', async(event) => {
    event.preventDefault();
    const searchValue = searchInput.value.trim().toLowerCase();
    try {
        const allNews = await getData(NEWS_API_URL);
        currentNews = allNews.filter(article => {
            const title = article.title.toLowerCase();
            const description = article.description.toLowerCase();
            const author = (article.author || '').toLowerCase();
            return title.includes(searchValue) || description.includes(searchValue) || author.includes(searchValue);
        });
        totalItems = currentNews.length;
        currentPage = 1;
        updatePaginationLinks();
        updateNews(currentNews);
    } catch (error) {
        console.error(error);
    }
});


getData(NEWS_API_URL).then((data) => {
    currentNews = data;
    updatePaginationLinks();
    updateNews(currentNews);
});