import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number = 1000) => {
  const [debouncedSearch, setDebouncedSearch] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedSearch;
};
