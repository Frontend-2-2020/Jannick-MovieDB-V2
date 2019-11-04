import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/index.scss";
import queryString from "query-string";
import { initDetail } from "./detail";
import { initOverview, getData } from "./overview";

const param = location.search;
const parsed = queryString.parse(param);

if(parsed.movie){
    initDetail(parsed.movie);
} else {
    initOverview();
}