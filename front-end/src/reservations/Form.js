import React from "react";
import { useHistory } from "react-router";

export default function Form({ initialformData, handleFormChange, handleSubmit }) {
  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  };

  return (
    initialformData && (
      <form noValidate onSubmit={handleSubmit} className="form-group">
        <fieldset>
          <legend className="d-flex justify-content-center">
            Guest Information
          </legend>
          <div className="pb-1">
            <label htmlFor="firstName" className="form-label visually-hidden" required>First Name</label>
            <input
              type="text"
              name="first_name"
              className="form-control"
              id="firstName"
              placeholder="First Name"
              defaultValue={initialformData?.first_name || ""}
              title="Enter your first name"
              required
              minLength="1"
              autoComplete="given-name"
              aria-describedby="firstNameHelp"
            />
            <small id="firstNameHelp" className="form-text text-muted">
              We'll never share your first name with anyone else.
            </small>
          </div>
          <div className="pb-1">
            <label htmlFor="lastName" className="form-label visually-hidden" required>Last Name</label>
            <input
              type="text"
              name="last_name"
              className="form-control"
              id="lastName"
              placeholder="Last Name"
              defaultValue={initialformData?.last_name || ""}
              title="Enter your last name"
              required
              minLength="1"
              autoComplete="family-name"
              aria-describedby="lastNameHelp"
            />
            <small id="lastNameHelp" className="form-text text-muted">
              We'll never share your last name with anyone else.
            </small>
          </div>
          <div className="pb-1">
            <label htmlFor="mobileNumber" className="form-label visually-hidden" required>Mobile Number</label>
            <input
              type="tel"
              name="mobile_number"
              className="form-control"
              id="mobileNumber"
              placeholder="Mobile Number"
              defaultValue={initialformData?.mobile_number || ""}
              title="Enter your mobile number"
              required
              minLength="10"
              autoComplete="tel"
              aria-describedby="mobileNumberHelp"
            />
            <small id="mobileNumberHelp" className="form-text text-muted">
              We'll never share your mobile number with anyone else.
            </small>
          </div>
          <div className="pb-1">
            <label htmlFor="people" className="form-label visually-hidden" required>Number of guests</label>
            <input
              type="number"
              name="people"
              className="form-control"
              id="people"
              placeholder="Number of guests"
              defaultValue={initialformData?.people || 1}
              title="Enter the number of guests"
              required
              min="1"
              autoComplete="off"
              aria-describedby="peopleHelp"
            />
            <small id="peopleHelp" className="form-text text-muted">
              We'll never share your number of guests with anyone else.
            </small>
          </div>

          <div className="pb-1">
            <label htmlFor="reservationDate" className="form-label visually-hidden" required>Reservation Date</label>
            <input
              type="date"
              name="reservation_date"
              className="form-control mb-1"
              id="reservationDate"
              placeholder="Reservation Date"
              defaultValue={initialformData?.reservation_date || ""}
              title="Enter your reservation date"
              required
              autoComplete="off"
              aria-describedby="reservationDateHelp"
            />
            <small id="reservationDateHelp" className="form-text text-muted">
              We'll never share your reservation date with anyone else.
            </small>
          </div>
          <div className="pb-1">
            <label htmlFor="reservationTime" className="form-label visually-hidden" required>Reservation Time</label>
            <input
              type="time"
              name="reservation_time"
              className="form-control"
              id="reservationTime"
              placeholder="Reservation Time"
              defaultValue={initialformData?.reservation_time || ""}
              title="Enter your reservation time"
              required
              autoComplete="off"
              aria-describedby="reservationTimeHelp"
            />
            <small id="reservationTimeHelp" className="form-text text-muted">
              We'll never share your reservation time with anyone else.
            </small>
          </div>
        </fieldset>
        <div className="d-flex justify-content-center pt-2">
          <button type="submit" className="btn btn-primary mr-1">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            id="cancelButton"
            onClick={handleCancel}
          >
            <label htmlFor="cancelButton" className="visually-hidden">Cancel</label>
          </button>
        </div>
      </form>
    )
  );
}
