import { useState } from 'react';

export const useMessage = () => {
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const clearMessage = () => setMessage(null);

  return { message, showMessage, clearMessage };
}; 