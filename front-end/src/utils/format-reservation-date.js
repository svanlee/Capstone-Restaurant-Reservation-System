import { formatAsDate } from "./date-time";

function formatDate(reservation) {
  if (!reservation || !reservation.reservation_date) {
    return reservation;
  }

  reservation.reservation_date = formatAsDate(reservation.reservation_date);
  return reservation;
}

/**
 * Formats the reservation_date property of a reservation.
 * @param {Array<reservation>|reservation} reservations
 *  a single reservation, or an array of reservations.
 * @returns {Array<reservation>|reservation}
 *  the specified reservation(s) with the reservation_date property formatted as YYYY-MM-DD.
 */
export default function formatReservationDate(reservations) {
  if (Array.isArray(reservations)) {
    return reservations.map((reservation) => formatDate(reservation));
  } else {
    return formatDate(reservations);
  }
}
