// src/utils/notify.js

import { toast } from 'react-toastify';

/**
 * Custom Toast Notification function
 * @param {string} message - The message to be displayed.
 * @param {string} type - The type of toast: 'success', 'error', 'info', 'warning'.
 * @param {object} options - Custom options for the toast (optional).
 */
const notify = (message, type = 'info', options = {}) => {
  const defaultOptions = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    ...options, // Merge any custom options passed
  };

  switch (type) {
    case 'success':
      return toast.success(message, defaultOptions);
    case 'error':
      return toast.error(message, defaultOptions);
    case 'info':
      return toast.info(message, defaultOptions);
    case 'warning':
      return toast.warning(message, defaultOptions);
    default:
      return toast(message, defaultOptions); // Default to info
  }
};

export default notify;
