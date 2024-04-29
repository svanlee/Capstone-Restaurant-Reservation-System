import React from "react";
import PropTypes from "prop-types";

export default function ReservationRow({ reservation, cancelRes }) {
  function handleCancel() {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      ) &&
      typeof cancelRes === "function"
    ) {
      cancelRes(reservation);
    }
  }

  return (
    <tr>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.people}</td>
      <td>{reservation.reservation_time}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>
      <td>
        {reservation.status === "booked" && (
          <a
            className="btn btn-secondary"
            role="button"
            href={`/reservations/${reservation.reservation_id}/seat`}
          >
            Seat
          </a>
        )}
      </td>
      <td>
        <a
          className="btn btn-secondary"
          role="button"
          href={`/reservations/${reservation.reservation_id}/edit`}
        >
          Edit
        </a>
      </td>
      <td>
        {reservation.status === "booked" && (
          <button
            className="btn btn-danger"
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={handleCancel}
            data-testid="cancel-button"
          >
            Cancel
          </button>
        )}
      </td>
    </tr>
  );
}

ReservationRow.propTypes = {
  reservation: PropTypes.shape({
    reservation_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    mobile_number: PropTypes.string.isRequired,
    people: PropTypes.number.isRequired,
    reservation_time: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  cancelRes: PropTypes.func,
};

ReservationRow.defaultProps = {
  cancelRes: () => {},
};
