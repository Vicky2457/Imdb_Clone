// Get a reference to the HTML element that will display the movie details
const resultGrid = document.getElementById('result-grid');
const movieId = getParameterByName('id');

// When the page's content is loaded, fetch and display the movie details
document.addEventListener('DOMContentLoaded', () => {
    fetchMovieDetails(movieId);
});

// This function helps extract a specific value from the URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Fetch movie details from the API and show them on the page
async function fetchMovieDetails(movieId) {
    const URL = `https://omdbapi.com/?i=${movieId}&apikey=88b64dee`;     // Construct the API URL using the movie ID
    const res = await fetch(URL);
    const movieDetails = await res.json();
    displayMovieDetails(movieDetails);        // Display the fetched movie details on the page
}

// Show the movie details on the page using the received data
function displayMovieDetails(details) {
    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${(details.Poster !== "N/A") ? details.Poster : "image_not_found.png"}" alt="${details.Title} Poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
     
            <h4 class="year">Year: ${details.Year}</h4 >
            <h4 class="rated">Ratings: ${details.Rated}<h4  >
            <h4  class="released">Released: ${details.Released}<h4 >
    
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors:</b> ${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

// After the content loads, check if a movie ID exists in the URL
document.addEventListener('DOMContentLoaded', () => {
    const movieId = getUrlParameter('id');      // If a movie ID exists, set up the functionality of the favorite button

    if (movieId) {
        setupFavoriteButton(movieId);
    }
});

// Set up the favorite button's action
function setupFavoriteButton(movieId) {
    const favoriteButton = document.getElementById('favorite-button');
    favoriteButton.addEventListener('click', async () => {
        await updateFavoriteMovies(movieId);
        alert('Movie added to favorites.');
    });
}
