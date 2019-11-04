import Axios from "axios";
import { KEY } from "./config";

export function initOverview() {
    document.getElementById("index").style.display = "block";
    getData();
}

function getMovies(){
    return Axios.get("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=" + KEY)
}

function getGenres(){
    return Axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=" + KEY)
}

let movies;
let genres;
function getData(){
    Axios.all([getMovies(), getGenres()])
    .then(Axios.spread(function (moviesResponse, genresResponse) {
        movies = moviesResponse.data.results;
        genres = genresResponse.data.genres;

        renderPage();
    }));
}

function renderPage(){
    movies.forEach(movie => {
        //console.log(movie.genre_ids);
        

        /*
        const movieGenres = [];
        for (let i = 0; i < movie.genre_ids.length; i++) {
            const genreId = movie.genre_ids[i];
            
            for (let j = 0; j < genres.length; j++) {
                const genre = genres[j];
                if(genre.id == genreId){
                    movieGenres.push(genre);
                }
            }
        }*/

        /*
        const movieGenres = genres.filter(function(genre){
            return movie.genre_ids.indexOf(genre.id) !== -1;
        });
        */

       const movieGenres = genres.filter(genre => movie.genre_ids.indexOf(genre.id) !== -1);
       const movieGenreNames = movieGenres.map(genre => genre.name);
       const movieGenresHtml = movieGenreNames.map(name => `<span class="badge badge-secondary">${name}</span>`);

        document.querySelector("#index .row").innerHTML += `
        <div class="col-md-4 mb-4">
            <div class="card">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${movie.title} <span class="badge badge-primary">${movie.vote_average}</span></h5>
                <h6 class="card-subtitle mb-4">Release: ${movie.release_date}</h6>
                <p class="card-text mb-4">${movie.overview}</p>
                
                <a href="?movie=${movie.id}" class="btn btn-primary">Details</a>

                <div>${movieGenresHtml.join("")}</div>
            </div>
            </div>
        </div>
    `;
    });    
}