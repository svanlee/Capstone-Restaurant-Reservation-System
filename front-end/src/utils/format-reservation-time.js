import { formatAsTime } from "./date-time";

function formatTime(reservation) {
  if (reservation && reservation.reservation_time) {
    reservation.reservation_time = formatAsTime(reservation.reservation_time);
  }
  return reservation;
}

/**
 * Formats the reservation_time property of a reservation or an array of reservations.
 * @param {*} reservations - a single reservation or an array of reservations.
 * @returns {*|Array} the specified reservation(s) with the reservation_time property formatted as HH:MM.
 */
export default function formatReservationTime(reservations) {
  if (Array.isArray(reservations)) {
    return reservations.map((reservation) => formatTime(reservation));
  } else if (reservations && typeof reservations === 'object') {
    return formatTime(reservations);
  }
  return reservations;
}
