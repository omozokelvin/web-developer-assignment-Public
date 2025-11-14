import { TOAST_TIMEOUT } from '@/lib/constants/toast';
import { ExtendedAxiosRequestConfig, HttpErrorResponse } from '@/lib/types';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const shownErrors = new Set();

const baseURL = process.env.NEXT_PUBLIC_API_URL;
export const httpService = axios.create({ baseURL });

const handleError = (error: AxiosError<HttpErrorResponse>) => {
  const message =
    error?.response?.data?.message || error?.message || 'Something went wrong';

  if (!message) {
    return;
  }

  if (!shownErrors.has(message)) {
    toast.error(message);
    shownErrors.add(message);

    setTimeout(() => {
      shownErrors.delete(message);
    }, TOAST_TIMEOUT);
  }
};

httpService.interceptors.response.use(
  (response) => {
    const data: AxiosResponse = response.data;
    return data;
  },
  async (outerError: AxiosError<HttpErrorResponse>) => {
    const requestConfig = outerError.config as ExtendedAxiosRequestConfig;
    const noErrorMessage = requestConfig?.noErrorMessage;

    if (!noErrorMessage) {
      handleError(outerError);
    }

    return Promise.reject(outerError?.response?.data);
  }
);
