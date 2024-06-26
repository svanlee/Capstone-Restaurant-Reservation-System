/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const config = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  const { signal } = options;
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      const payload = await response.json();
      throw new Error(payload.error || "An error occurred");
    }

    const payload = await response.json();
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Formats the response data
 *
 * @param data
 *  the data to format
 * @returns {*|Promise<any>}
 *  the formatted data
 */
const formatResponse = (data) =>
  Array.isArray(data)
    ? data.map((item) => formatReservationDate(formatReservationTime(item)))
    : formatReservationDate(formatReservationTime(data));

/**
 * Retrieves all existing reservation.
 * @param {Object} params
 *  the query parameters
 * @param {AbortSignal} [signal]
 *  the abort signal
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
export async function listReservations(params = {}, signal) {
  if (Object.keys(params).length === 0) {
    throw new Error("Invalid input parameters");
  }

  const url = new URL(`${config.baseUrl}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );

  return await fetchJson(url, { headers: config.headers, signal }, [])
    .then(formatResponse)
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject(error.message));
}

// ... other functions
