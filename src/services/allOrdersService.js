import http from "./httpService";
import config from "../config/apiConfig";

const apiEndPoint = config.apiURL + "/orders/all";

export function getAllOrders() {
  return http.get(apiEndPoint);
}

export function deleteOrder(id) {
  return http.delete(config.apiURL + "/orders/" + id);
}


