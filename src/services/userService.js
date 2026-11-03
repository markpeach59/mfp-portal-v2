import http from "./httpService";
import config from "../config/apiConfig";

const apiEndPoint = config.apiURL + "/users";

export function getUsers() {
  return http.get(apiEndPoint);
}

export function registerUser(name, email, password) {
  return http.post(apiEndPoint, { name, email, password });
}

export function assignDealertouser(userid, dealerid) {
  return http.post(apiEndPoint + "/assigndealer", { userid, dealerid }); 
}

export function removeDealerfromuser(userid) {
  return http.post(apiEndPoint + "/removedealer", { userid }); 
}

export function getUserSummary(id) {
  return http.get(apiEndPoint + "/" + id + "/summary");
}

export function deleteUser(id) {
  return http.delete(apiEndPoint + "/" + id);
}

export function resetUserPassword(id, password) {
  return http.post(apiEndPoint + "/" + id + "/reset-password", { password });
}

export function revokeUserLogin(id) {
  return http.post(apiEndPoint + "/" + id + "/revoke", {});
}
