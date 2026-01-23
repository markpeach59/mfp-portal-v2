import http from "./httpService";
import config from "../config.json";

const apiEndPoint = config.apiURL + "/forklifts";


export function getForklifts() {
  return http.get(apiEndPoint);
}
