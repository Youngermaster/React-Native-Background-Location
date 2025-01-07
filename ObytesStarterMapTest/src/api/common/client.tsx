import { Env } from '@env';
import axios from 'axios';
export const client = axios.create({
  baseURL: Env.API_URL,
});
export const secondary_client = axios.create({
  baseURL: Env.SECONDARY_API_URL + '/api/',
});
