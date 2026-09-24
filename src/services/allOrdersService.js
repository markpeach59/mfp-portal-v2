import http from "./httpService";
import config from "../config/apiConfig";

const apiEndPoint = config.apiURL + "/orders/all";

export function getAllOrders() {
  return http.get(apiEndPoint);
}


