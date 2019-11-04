import Axios from "axios";
import { KEY } from "./config";
import queryString from "query-string";

const param = location.search;
const parsed = queryString.parse(param);
let page = parsed.page ? parseInt(parsed.page) : 1;

let maxPages = 10 //default;
let movies;
let genres;
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const prevNumber = document.querySelector("#prevNumber a");
const nextNumber = document.querySelector("#nextNumber a");
const currentNumber = document.querySelector("#currentNumber span");

export function initOverview() {
    document.getElementById("index").style.display = "block";

    
    prevBtn.addEventListener("click", prevPage);
    nextBtn.addEventListener("click", nextPage);
    prevNumber.addEventListener("click", prevPage);
    nextNumber.addEventListener("click", nextPage);
    
    updatePagination();

    getData();
}

function prevPage(){
    if(page > 1){
        page -= 1;
        updatePagination();
        getMovies().then(response => {
            movies = response.data.results;
            renderPage();
        })
    }
}

function nextPage(){
    if(page < 500){
        page += 1;
        updatePagination();
        getMovies().then(response => {
            movies = response.data.results;
            renderPage();
        })
    }
}

function updatePagination(){
    if(page === 1){
        prevBtn.classList.add("disabled");
        prevNumber.parentNode.style.display = "none";
    } else {
        prevNumber.parentNode.style.display = "block";
        prevBtn.classList.remove("disabled");
    }

    if(page === maxPages){
        nextBtn.classList.add("disabled");
        nextNumber.parentNode.style.display = "none";
    } else {
        nextBtn.classList.remove("disabled");
        nextNumber.parentNode.style.display = "block";
    }

    prevNumber.innerHTML = page - 1;
    nextNumber.innerHTML = page + 1;
    currentNumber.innerHTML = page;

    const stringified = queryString.stringify({page: page});
    if("?"+stringified !== location.search){
        location.search = stringified;
    }
}

function getMovies(){
    return Axios.get("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=" + page + "&api_key=" + KEY)
}

function getGenres(){
    return Axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=" + KEY)
}

function getData(){
    Axios.all([getMovies(), getGenres()])
    .then(Axios.spread(function (moviesResponse, genresResponse) {
        movies = moviesResponse.data.results;
        genres = genresResponse.data.genres;

        maxPages = moviesResponse.data.total_pages;

        renderPage();
    }));
}

function renderPage(){
    document.querySelector("#index .row").innerHTML = "";

    movies.forEach(movie => {
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
       const movieGenresHtml = movieGenreNames.map(name => `<span class="badge badge-secondary mb-1 mr-1">${name}</span>`);

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