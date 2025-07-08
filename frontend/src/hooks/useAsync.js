/**
 * Custom hook for async operations with loading and error states
 * @param {Function} asyncFunction - async function to execute
 * @param {boolean} immediate - whether to execute immediately
 * @returns {Object} - async state and methods
 */
import { useState, useEffect, useCallback } from 'react';

export const useAsync = (asyncFunction, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction(...params);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
    setError
  };
}; 