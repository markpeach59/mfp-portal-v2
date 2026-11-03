import http from "./httpService";
import config from "../config/apiConfig";

const apiEndPoint = config.apiURL + "/quotes/all";

export function getAllQuotes() {
  return http.get(apiEndPoint);
}

export function deleteQuote(id) {
  return http.delete(config.apiURL + "/quotes/" + id);
}

export function getOldQuotesCount() {
  return http.get(config.apiURL + "/quotes/bulk/old");
}

export function deleteOldQuotes() {
  return http.delete(config.apiURL + "/quotes/bulk/old");
}
