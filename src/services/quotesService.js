import http from "./httpService";
import config from "../config.json";

const apiEndPoint = config.apiURL + "/quotes";

export function getQuotes() {
  return http.get(apiEndPoint);
}

export function savequote(quote) {
  //console.log("quote items ", quote);

  return http.post(apiEndPoint, quote);
}

export function getQuoteDetail(id) {
  return http.get(apiEndPoint + "/" + id);
}

export function createOrderFromQuote(id, newponumber) {
  return http.patch(apiEndPoint + "/" + id, {
    ponumber: newponumber
  });
}

export function reassignQuote(id, newuserid) {
  return http.patch(apiEndPoint + "/reassign/" + id, {
    userid: newuserid,
  });
}

export function saveMarkup(id, newmarkup) {
    return http.patch(apiEndPoint + "/savemarkup/" + id, {
      markup: newmarkup,
    });
}
