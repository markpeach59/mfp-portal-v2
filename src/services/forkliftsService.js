import http from "./httpService";
import config from "../config/apiConfig";

const apiEndPoint = config.apiURL + "/forklifts";


export function getForklifts() {
  return http.get(apiEndPoint);
}
