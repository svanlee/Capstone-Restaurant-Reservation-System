const fetch = require("cross-fetch");

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const headers = { "Content-Type": "application/json" };

/**
 * Fetches `json` from the specified URL and handles error status codes and ignores `AbortError`s
 *
 * @param url
 *  the URL for the request
 * @param options
 *  any options for fetch
 * @param signal
 *  an `AbortSignal` to allow canceling the request
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
const fetchJson = async (url, options, signal, onCancel) => {
  if (!url) {
    throw new Error("URL is required");
  }

  if (signal && signal.aborted) {
    return Promise.resolve(onCancel);
  }

  try {
    const response = await fetch(url, { ...options, signal });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      const payload = await response.json();
      throw new Error(payload.error || "An error occurred");
    }

    return (await response.json()).data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
};

/**
 * Creates a new reservation
 * @param reservation
 *  the reservation to create
 * @param signal
 *  an `AbortSignal` to allow canceling the request
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to the newly created reservation.
 */
const createReservation = async (reservation, signal) => {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, signal, reservation);
};

/**
 * Creates a new table
 * @param table
 *  the table to create
 * @param signal
 *  an `AbortSignal` to allow canceling the request
 * @returns {Promise<[table]>}
 *  a promise that resolves to the newly created table.
 */
const createTable = async (table, signal) => {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options, signal, table);
};

/**
 * Seats a reservation at a table
 * @param reservation_id
 *  the ID of the reservation to seat
 * @param table_id
 *  the ID of the table to seat the reservation at
 * @param signal
 *  an `AbortSignal` to allow canceling the request
 * @returns {Promise<any>}
 *  a promise that resolves to the updated table.
 */
const seatReservation = async (reservation_id, table_id, signal) => {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { reservation_id } }),
    headers,
    signal,
  };
  return await fetchJson(url, options, signal, {});
};

module.exports = {
  createReservation,
  createTable,
  seatReservation,
};
