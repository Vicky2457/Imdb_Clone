// Get a reference to the HTML element that will display the favorite movies
const favoriteList = document.getElementById('favorite-list');
// After the page's content is loaded, render the favorite movies
document.addEventListener('DOMContentLoaded', () => {
    renderFavoriteMovies();
});
// Fetch details of a movie using its ID
async function getMovieDetails(movieId) {
    const URL = `https://omdbapi.com/?i=${movieId}&apikey=88b64dee`;
    const res = await fetch(URL);
    const movieDetails = await res.json();
    return movieDetails;
}

// Render the list of favorite movies on the page
async function renderFavoriteMovies() {
    // Clear the previous list of favorite movies
    const favoriteList = document.getElementById('favorite-list');
    favoriteList.innerHTML = '';

    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
        // Loop through favorite movie IDs and display their details
    for (const movieId of favoriteMovies) {
        const movieDetails = await getMovieDetails(movieId);
        if (movieDetails && movieDetails.Response === "True") {
            displayFavoriteMovieDetails(movieDetails);
        }
    }
}

// Display details of a favorite movie on the page
function displayFavoriteMovieDetails(details) {
    const favoriteListItem = document.createElement('div');
    favoriteListItem.classList.add('favorite-list-item');
    favoriteListItem.innerHTML = `
    <div class="favorite-item-thumbnail">
        <img src="${(details.Poster !== "N/A") ? details.Poster : "image_not_found.png"}" alt="${details.Title} Poster">
    </div>
    <div class="favorite-item-info">
    <h3 class="movie-title">${details.Title}</h3>
     
        <button class="remove-button" data-id="${details.imdbID}">Remove</button>
    </div>
    `;
    favoriteList.appendChild(favoriteListItem);
        // Set up the remove button for this favorite movie
    setupRemoveButton(details.imdbID);
}

// Add a movie to the list of favorite movies
function updateFavoriteMovies(movieId) {
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    if (!favoriteMovies.includes(movieId)) {
        favoriteMovies.push(movieId);
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
        renderFavoriteMovies();
    }
}

// Remove a movie from the list of favorite movies
function removeFromFavorites(movieId) {
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    favoriteMovies = favoriteMovies.filter(id => id !== movieId);
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
    renderFavoriteMovies();
}
// Set up the remove button for a favorite movie
function setupRemoveButton(movieId) {
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            removeFromFavorites(movieId);
        });
    });
}
