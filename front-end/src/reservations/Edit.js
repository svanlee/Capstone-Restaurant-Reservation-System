import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { isNotOnTuesday, isInTheFuture } from "../utils/date-time";
import { findReservation, modifyReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Form from "./Form";

export default function Edit() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [error, setError] = useState(null);
  const [reservationData, setReservationData] = useState(null);

  useEffect(() => {
    async function loadReservation() {
      const ac = new AbortController();
      try {
        const reservation = await findReservation(reservation_id, ac.signal);
        setReservationData({ ...reservation, people: Number(reservation.people) });
      } catch (error) {
        setError(error);
      }
      return () => ac.abort();
    }
    loadReservation();
  }, [reservation_id]);

  const findErrors = (reservation) => {
    const errors = [];
    if (isNotOnTuesday(reservation.reservation_date)) {
      errors.push(<li key="tuesday">Reservations cannot be made on Tuesdays</li>);
    }
    if (isInTheFuture(reservation.reservation_date)) {
      errors.push(<li key="future">Reservation date must not be in the future</li>);
    }
    if (reservation.status && reservation.status !== "booked") {
      errors.push(
        <li key="not booked">Reservation can no longer be changed</li>
      );
    }
    return errors;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = findErrors(reservationData);
    if (errors.length) {
      setError({ message: errors });
      return;
    }
    const ac = new AbortController();
    try {
      await modifyReservation(reservation_id, reservationData, ac.signal);
      history.push(`/dashboard?date=${reservationData.reservation_date}`);
    } catch (error) {
      setError(error);
    }
    return () => ac.abort();
  }

  const handleFormChange = (e) => {
    setReservationData({
      ...reservationData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <ErrorAlert error={error} />
      {reservationData && (
        <Form
          initialformData={reservationData}
          handleFormChange={handleFormChange}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
}
