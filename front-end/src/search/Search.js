import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationTable from "../dashboard/reservationTable/ReservationTable";
import ErrorAlert from "../layout/ErrorAlert";

export default function Search() {
  const [reservations, setReservations] = useState([]);
  const [display, setDisplay] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setMobileNumber(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const data = await listReservations(
        { mobile_number: mobileNumber },
        abortController.signal
      );
      setReservations(data);
      setDisplay(true);
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  };

  return (
    <>
      <div className="d-flex justify-content-center pt-3">
        <h3>Search</h3>
      </div>
      <ErrorAlert error={error} />
      <div className="pt-3 pb-3">
        <form className="form-group" onSubmit={handleSearch}>
          <input
            name="mobile_number"
            id="mobile_number"
            onChange={handleChange}
            placeholder="Enter a customer's phone number"
            value={mobileNumber}
            className="form-control"
            required
          />
          <div className="pt-2">
            <button type="submit" className="btn btn-primary">
              Find
            </button>
          </div>
        </form>
      </div>
      {display && (
        <div>
          {reservations.length ? (
            <ReservationTable
              reservations={reservations}
              setReservations={setReservations}
              setError={setError}
            />
          ) : (
            <h3>No reservations found</h3>
          )}
        </div>
      )}
    </>
  );
}
