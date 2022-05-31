import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { deleteToken, getToken } from '../Auth/token-service';

interface ApiResult {
  status: 'success';
  data: any;
}

interface ApiError {
  status: 'fail' | 'error';
  message: string;
}

type ApiResponse = ApiResult | ApiError;

export class ApiException extends Error {
  constructor(response: ApiError) {
    super(response.message);
  }
}

async function apiCall(url: string, method = 'get', data?: any) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // prefix the url with the base api url
    switch (process.env.NODE_ENV) {
      case 'production':
        // TODO: replace with actual url
        url = `https://api.judoincloud.com/${url}`;
        break;
      case 'development':
      default:
        url = `http://localhost:2500/api/${url}`;
    }
  }

  let res: ApiResponse;
  try {
    const token = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token !== null) {
      headers.Authorization = `Bearer ${token}`;
    }
    const body = data ? JSON.stringify(data) : undefined;
    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    if (response.status === 401 && token !== null) {
      // unauthorized, if the token exists it's invalid
      deleteToken();
    }
    res = await response.json();
  } catch (error) {
    // generic connection error
    const errSwal = withReactContent(Swal);

    errSwal.fire({
      title: <p>Errore di connessione</p>,
      icon: 'error',
    });
    console.error('[API SERVICE] error', { error });
    throw new ApiException({
      status: 'error',
      message: 'Errore di connessione'
    });
  }

  if (res.status !== 'success') {
    // internal server error or call error
    const errSwal = withReactContent(Swal);

    errSwal.fire({
      title: <p>{res.message}</p>,
      icon: 'error',
    });
    throw res;
  }

  return res.data;
}

export function apiPost<T = any>(url: string, data: object): Promise<T> {
  return apiCall(url, 'post', data);
}

export function apiGet<T = any>(url: string): Promise<T> {
  return apiCall(url, 'get');
}

export function apiDelete<T = any>(url: string): Promise<T> {
  return apiCall(url, 'delete');
}

export function apiPatch<T = any>(url: string, data: object): Promise<T> {
  return apiCall(url, 'patch', data);
}
