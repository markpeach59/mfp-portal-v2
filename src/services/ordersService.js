import http from "./httpService";
import config from "../config.json";

const apiEndPoint = config.apiURL + "/orders";

export function getAllOrders() {
  return http.get(apiEndPoint);
}

export function getOrderDetail(id) {
  return http.get(apiEndPoint + "/" + id);
}

export function confirmOrder(id, newstocknumber) {
  console.log( 'stocknumber', newstocknumber)
  return http.patch(apiEndPoint + "/confirmorder/" + id, {
    stocknumber: newstocknumber
  });
}
