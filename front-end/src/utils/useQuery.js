/**
 * useQuery is a custom hook that makes use of the useLocation and the URLSearchParams class to parse the query parameters.
 *
 * @example
 *
 *     const query = useQuery();
 *     const date = query.get("date")
 */

import { useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);

  // Add a function to parse query parameters as an object
  const queryParams = Object.fromEntries(urlParams.entries());

  // Add a function to update query parameters
  const setQueryParam = (param, value) => {
    const newUrlParams = new URLSearchParams(queryParams);
    newUrlParams.set(param, value);
    const newUrl = `${window.location.pathname}?${newUrlParams.toString()}`;
    window.history.pushState({}, "", newUrl);
    window.location.reload();
  };

  return { queryParams, setQueryParam };
}

export default useQuery;
