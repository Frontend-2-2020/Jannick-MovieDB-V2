import Axios from "axios";
import { KEY } from "./config";

export function initDetail(id){
    //document.getElementById("detail").classList.add("show");
    document.getElementById("detail").style.display = "block";
    getData(id);
}

let movie;
function getData(id){
    Axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${KEY}`)
    .then(response => {
        movie = response.data;
        renderPage();  
    });
}

function renderPage(){
    document.getElementById("title").innerHTML = movie.title;
    document.getElementById("score").innerHTML = movie.vote_average;
    document.getElementById("samenvatting").innerHTML = movie.overview;
    document.getElementById("release").innerHTML = movie.release_date;

    document.getElementById("poster").setAttribute("src", `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
    document.querySelector(".jumbotron").style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`; 

    movie.production_companies.forEach(company => {
        document.querySelector(".logos").innerHTML += `<img class="mr-2" src="https://image.tmdb.org/t/p/w92${company.logo_path}" alt="">`;
    });
}
