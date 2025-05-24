import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '@/types/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

/**
 * Custom hook for API calls with loading, error, and data state management
 */
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const { immediate = false, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiFunction(...args);
        
        if (response.success && response.data) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          });
          onSuccess?.(response.data);
        } else {
          const errorMessage = response.message || 'An error occurred';
          setState({
            data: null,
            loading: false,
            error: errorMessage,
          });
          onError?.(errorMessage);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        onError?.(errorMessage);
      }
    },
    [apiFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Custom hook for paginated API calls
 */
export function usePaginatedApi<T>(
  apiFunction: (page: number, limit: number, ...args: any[]) => Promise<ApiResponse<T[]>>,
  limit: number = 10,
  options: UseApiOptions = {}
) {
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const {
    data,
    loading,
    error,
    execute: baseExecute,
    reset: baseReset,
  } = useApi(apiFunction, options);

  const loadMore = useCallback(
    async (...args: any[]) => {
      const response = await baseExecute(page, limit, ...args);
      
      if (response && Array.isArray(response)) {
        setAllData(prev => [...prev, ...response]);
        setHasMore(response.length === limit);
      }
    },
    [baseExecute, page, limit]
  );

  const loadPage = useCallback(
    async (newPage: number, ...args: any[]) => {
      setPage(newPage);
      const response = await baseExecute(newPage, limit, ...args);
      
      if (response && Array.isArray(response)) {
        setAllData(response);
        setHasMore(response.length === limit);
      }
    },
    [baseExecute, limit]
  );

  const reset = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
    setTotal(0);
    baseReset();
  }, [baseReset]);

  const nextPage = useCallback(() => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  const prevPage = useCallback(() => {
    if (page > 1 && !loading) {
      setPage(prev => prev - 1);
    }
  }, [page, loading]);

  return {
    data: allData,
    currentPageData: data,
    loading,
    error,
    page,
    hasMore,
    total,
    totalPages: Math.ceil(total / limit),
    loadMore,
    loadPage,
    nextPage,
    prevPage,
    reset,
  };
}
