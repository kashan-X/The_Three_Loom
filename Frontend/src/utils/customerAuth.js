// utils/customerAuth.js

export function getCustomerToken() {
  return localStorage.getItem('customerToken');
}

export function getCustomerName() {
  return localStorage.getItem('customerName');
}

export function isCustomerLoggedIn() {
  return !!getCustomerToken();
}

export function customerLogout() {
  localStorage.removeItem('customerToken');
  localStorage.removeItem('customerName');
}