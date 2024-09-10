const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const watchLaterGrid = document.getElementById('watch-later-grid');

// Load the watch later movies from Local Storage
let watchLaterMovies = JSON.parse(localStorage.getItem('watchLaterMovies')) || [];

// Display the watch later movies on page load
window.onload = function() {
    displayWatchLaterMovies();
};

// Load movies from API
async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=e614b5d5`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');
        let moviePoster = (movies[idx].Poster != "N/A") ? movies[idx].Poster : "image_not_found.png";

        movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
            <img src="${moviePoster}">
        </div>
        <div class="search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=e614b5d5`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = ''; // Clear existing items

    if (resultGrid.length === 0) {
        // Show a message if there are no movies in the Watch Later list
        watchLaterGrid.innerHTML = '<p>No movies in the Watch Later list.</p>';
        return;
    }
    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors:</b> ${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
        <button id="watch-later-btn">Add to Watch Later</button>
    </div>
    `;

    const watchLaterBtn = document.getElementById('watch-later-btn');
    watchLaterBtn.addEventListener('click', () => addToWatchLater(details));
}

function addToWatchLater(movie) {
    if (watchLaterMovies.some(item => item.imdbID === movie.imdbID)) {
        alert("This movie is already in your Watch Later list.");
        return;
    }

    watchLaterMovies.push(movie);
    saveWatchLaterMovies();
    displayWatchLaterMovies();
}

function displayWatchLaterMovies() {
    watchLaterGrid.innerHTML = ''; // Clear existing items

    watchLaterMovies.forEach(movie => {
        let watchLaterItem = document.createElement('div');
        watchLaterItem.classList.add('watch-later-item');

        let moviePoster = (movie.Poster != "N/A") ? movie.Poster : "image_not_found.png";

        watchLaterItem.innerHTML = `
        <div class="watch-later-thumbnail">
            <img src="${moviePoster}" alt="${movie.Title}">
        </div>
        <div class="watch-later-info">
            <h4>${movie.Title}</h4>
            <p>${movie.Year}</p>
        </div>
        <button class="remove-btn">Remove</button>
        `;

        watchLaterItem.querySelector('.remove-btn').addEventListener('click', () => removeFromWatchLater(movie.imdbID));
        watchLaterGrid.appendChild(watchLaterItem);
    });
}

function removeFromWatchLater(imdbID) {
    watchLaterMovies = watchLaterMovies.filter(movie => movie.imdbID !== imdbID);
    saveWatchLaterMovies();
    displayWatchLaterMovies();
}

function saveWatchLaterMovies() {
    localStorage.setItem('watchLaterMovies', JSON.stringify(watchLaterMovies));
}

window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
});
