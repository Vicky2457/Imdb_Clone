// Get references to HTML elements
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const favoritesButton = document.getElementById('favorites-button');

// Define the OMDB API key and base URL
const apiKey = "http://www.omdbapi.com/?apikey=88b64dee"; 
const apiUrl = `https://www.omdbapi.com/?apikey=88b64dee`;
favoritesButton.addEventListener('click', () => {
    window.location.href = 'favorites.html';
});

movieSearchBox.addEventListener('input', findMovies);

// Function to load movies based on search term
async function loadMovies(searchTerm) {
    const URL = `${apiUrl}&s=${searchTerm}&page=1`;
    const res = await fetch(URL);
    const data = await res.json();
    if (data.Response == "True") {
        displayMovieList(data.Search);
    }
}

// Function to perform movie search
 function findMovies() {
    let searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

// Function to fetch movie details using IMDb ID
async function fetchMovieDetails(movieId) {
    const URL = `https://omdbapi.com/?i=${movieId}&apikey=88b64dee`;
    const res = await fetch(URL);
    const movieDetails = await res.json();
    return movieDetails;
}

// Function to display a list of movies
async function displayMovieList(movies) {
    searchList.innerHTML = "";
        // Create a container for the grid
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('movie-suggestions-grid');

    for (let idx = 0; idx < movies.length; idx++) {
        const movieDetails = await fetchMovieDetails(movies[idx].imdbID);

        let movieListItem = document.createElement('div');
         // Store IMDb ID in dataset
        movieListItem.dataset.id = movieDetails.imdbID;
        movieListItem.classList.add('search-list-item', 'movie-suggestion-item');
        let moviePoster = (movieDetails.Poster !== "N/A") ? movieDetails.Poster : "image_not_found.png";
        // Display movie details including favorite button/icon
        movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
            <img src="${moviePoster}" alt="${movieDetails.Title} Poster">
        </div>
        <div class="search-item-info">
            <h3 class="movie-title">${movieDetails.Title}</h3>
            <p>${movieDetails.Year}</p>
            <p>⭐${movieDetails.imdbRating}</p>
            <button class="favorite-button" data-id="${movieDetails.imdbID}">Favorite</button>
        </div>
        `;
                // Check if the movie is in favorites
        const movieInfo = movieListItem.querySelector('.search-item-info');
        const isFavorite = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
        
        if (!isFavorite.includes(movieDetails.imdbID)) {
            const favoriteButton = document.createElement('button');
            favoriteButton.innerHTML = '<i class="far fa-heart"></i>';
            favoriteButton.classList.add('favorite-button');
            favoriteButton.dataset.id = movieDetails.imdbID;
            favoriteButton.addEventListener('click', () => addToFavorites(movieDetails.imdbID));
            movieInfo.appendChild(favoriteButton);
        } else {
            const heartIcon = document.createElement('i');
            heartIcon.classList.add('fas', 'fa-heart', 'favorite-icon');
            movieInfo.appendChild(heartIcon);
        }
    // Append the grid container to the search list
        gridContainer.appendChild(movieListItem);
    }

    searchList.appendChild(gridContainer);
    loadMovieDetails();
}
// Function to add a movie to favorites
async function addToFavorites(movieId) {
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    if (!favoriteMovies.includes(movieId)) {
        favoriteMovies.push(movieId);
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
        renderFavoriteMovies();
    }
}
// Function to render favorite movies on the home page

async function renderFavoriteMoviesOnHomePage() {
    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const favoriteList = document.getElementById('favorite-list');
    favoriteList.innerHTML = '';

    for (const movieId of favoriteMovies) {
        const movieDetails = await fetchMovieDetails(movieId);
        if (movieDetails && movieDetails.Response === "True") {
            displayFavoriteMovieOnHomePage(movieDetails);
        }
    }
}

// Function to display a favorite movie on the home page
function displayFavoriteMovieOnHomePage(details) {
    const favoriteListItem = document.createElement('div');
    favoriteListItem.classList.add('favorite-list-item');
    favoriteListItem.innerHTML = `
    <div class="favorite-item-thumbnail">
        <img src="${(details.Poster !== "N/A") ? details.Poster : "image_not_found.png"}" alt="${details.Title} Poster">
    </div>
    <div class="favorite-item-info">
        <h3>${details.Title}</h3>
        <p>${details.Title}}</p>
    </div>
    `;
    favoriteList.appendChild(favoriteListItem);
}


renderFavoriteMoviesOnHomePage();

// Function to load movie details when a movie item is clicked
function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const movieId = movie.dataset.id;
            window.location.href = `movie.html?id=${movieId}`;
        });
    });
}

// Close the search list when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
});
