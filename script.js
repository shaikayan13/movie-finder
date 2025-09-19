const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("results");

// Replace with your OMDb API key (get free at http://www.omdbapi.com/apikey.aspx)
const API_KEY = "thewdb"; // demo key, limited usage

async function fetchMovies(query) {
  resultsContainer.innerHTML = "<p>Loading...</p>";
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await response.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      resultsContainer.innerHTML = `<p>No results found for "${query}".</p>`;
    }
  } catch (error) {
    resultsContainer.innerHTML = "<p>Error fetching data. Try again.</p>";
    console.error(error);
  }
}

async function fetchMovieDetails(id) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=short`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function displayMovies(movies) {
  resultsContainer.innerHTML = "";
  for (let movie of movies) {
    const details = await fetchMovieDetails(movie.imdbID);

    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="${details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/220x300"}" alt="${details.Title}">
      <div class="movie-info">
        <h3>${details.Title}</h3>
        <p><strong>Year:</strong> ${details.Year}</p>
        <p><strong>Rating:</strong> ${details.imdbRating}</p>
        <p>${details.Plot}</p>
      </div>
    `;
    resultsContainer.appendChild(card);
  }
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(query);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
