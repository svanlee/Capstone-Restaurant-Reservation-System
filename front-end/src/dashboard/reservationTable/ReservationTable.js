import React from "react";
import PropTypes from "prop-types";
import ReservationRow from "./ReservationRow";
import { cancelReservation } from "../../utils/api";
import { useHistory } from "react-router-dom";

export default function ReservationTable({
  reservations,
  setReservations,
  setError,
}) {
  const history = useHistory();

  const cancelRes = async (reservation) => {
    try {
      const { status } = await cancelReservation(reservation.reservation_id);
      const updated = reservations.map((res) =>
        res.reservation_id === reservation.reservation_id
          ? { ...res, status }
          : res
      );
      setReservations(updated);
      history.go(`/dashboard?date=${reservation.reservation_date}`);
    } catch (error) {
      setError(error);
    }
  };

  const formatted = reservations.map((res) => (
    <ReservationRow
      key={res.reservation_id}
      reservation={res}
      cancelRes={cancelRes}
    />
  ));

  return (
    <>
      <table className="table table-sm table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Number</th>
            <th scope="col">Guests</th>
            <th scope="col">Time</th>
            <th scope="col">Status</th>
            <th scope="col">Seat</th>
            <th scope="col">Edit</th>
            <th scope="col">
              <button
                type="button"
                className="btn btn-link text-danger"
                data-testid="cancel-btn"
              >
                Cancel
              </button>
            </th>
          </tr>
        </thead>
        <tbody data-testid="reservations-tbody">{formatted}</tbody>
      </table>
    </>
  );
}

ReservationTable.propTypes = {
  reservations: PropTypes.arrayOf(
    PropTypes.shape({
      reservation_id: PropTypes.number.isRequired,
    })
  ).isRequired,
  setReservations: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};

ReservationRow.propTypes = {
  reservation: PropTypes.shape({
    reservation_id: PropTypes.number.isRequired,
  }).isRequired,
  cancelRes: PropTypes.func.isRequired,
};


npm install prop-types
