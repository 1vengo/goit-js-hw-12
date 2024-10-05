import { fetchImages } from './js/pixelbay-api.js';
import {
  renderImages,
  showError,
  clearGallery,
  showLoadingIndicator,
  hideLoadingIndicator,
  showLoadMoreButton,
  hideLoadMoreButton,
  smoothScroll,
} from './js/render-function.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('input[name="searchQuery"]');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const query = input.value.trim();
  if (!query) {
    showError('Please enter a search term');
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoadingIndicator();

  try {
    const data = await fetchImages(currentQuery, currentPage);
    hideLoadingIndicator();

    if (data.hits.length === 0) {
      showError('Sorry, there are no images matching your search query. Please try again!');
      return;
    }

    totalHits = data.totalHits;
    renderImages(data.hits);
    showLoadMoreButton();
  } catch (error) {
    hideLoadingIndicator();
    showError('Something went wrong. Please try again later.');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoadingIndicator();

  try {
    const data = await fetchImages(currentQuery, currentPage);
    hideLoadingIndicator();

    renderImages(data.hits);
    smoothScroll();

    const alreadyLoadedImages = currentPage * 15;
    if (alreadyLoadedImages >= totalHits) {
      hideLoadMoreButton();
      showError("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    hideLoadingIndicator();
    showError('Failed to load more images. Please try again later.');
  }
});
