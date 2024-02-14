import axios from 'axios';
export const BASE_URL = 'http://api.github.com';
export const headers = {
  "Accept": "application/vnd.github+json",
  "Content-Type": "application/json",
}

export const axiosService = axios.create({
  baseURL: BASE_URL,
  headers: headers,
  timeout: 1000
})