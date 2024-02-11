import axios from 'axios';
import { random } from 'lodash';

const userNames = [
  'manmao',
  'robyrobt',
  'robertdunca',
  'silasDaniel',
  'ruscosmin',
  'josephwilliams',
  'meOtniel'
]

export const BASE_USERNAME = userNames[random(0, userNames.length - 1)];

export const BASE_URL = 'https://api.github.com';
export const headers = {
  "Accept": "application/vnd.github+json",
  "Content-Type": "application/json",
}

export const axiosService = axios.create({
  baseURL: BASE_URL,
  headers: headers,
  timeout: 1000
})