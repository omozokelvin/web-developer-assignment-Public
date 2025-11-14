'use client';
import { ToastContainer } from 'react-toastify';
import { TOAST_TIMEOUT } from '@/lib/constants/toast';

export default function ToastContainerProvider() {
  return (
    <ToastContainer
      hideProgressBar
      position="top-center"
      autoClose={TOAST_TIMEOUT}
      stacked
    />
  );
}
