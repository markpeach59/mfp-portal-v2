import http from "./httpService";
import config from "../config.json";

const apiEndPoint = config.apiURL + "/quotes/all";

export function getAllQuotes() {
  return http.get(apiEndPoint);
}
