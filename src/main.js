import { fetchImages } from './js/pixelbay-api.js';
import {
  renderImages,
  showError,
  clearGallery,
  showLoadingIndicator,
  hideLoadingIndicator,
} from './js/render-function.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('input[name="searchQuery"]');
let currentPage = 1;
let currentQuery = '';

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
  showLoadingIndicator();

  try {
    const data = await fetchImages(currentQuery, currentPage);
    hideLoadingIndicator();

    if (data.hits.length === 0) {
      showError('Sorry, there are no images matching your search query. Please try again!');
      return;
    }

    renderImages(data.hits);
  } catch (error) {
    hideLoadingIndicator();
    showError('Something went wrong. Please try again later.');
  }
});
