import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function Tables() {
  const history = useHistory();
  const initForm = { table_name: "", capacity: 0 };
  const [tableError, setTableError] = useState(null);
  const [tableForm, setTableForm] = useState({ ...initForm });

  function handleFormChange(event) {
    setTableForm({
      ...tableForm,
      [event.target.name]: event.target.value,
    });
  }
//As explained in other components this is going to be our main functionality behind what happens with our table information, how it is updated in the back-end and displayed on the webpage for the user to interact with customer/owner of application HTML5 interacts with javascript functionality and a wonderful UI experience is created with TONS of functionality.
  async function handleSubmit(event) {
    event.preventDefault();
    const con = new AbortController();
    try {
      tableForm.capacity = Number(tableForm.capacity);
      const response = await createTable(tableForm, con.signal);
      if (response) {
        history.push("/dashboard");
      }
    } catch (error) {
      setTableError(error);
    }
    return () => con.abort();
  }

  function handleCancel() {
    history.goBack();
  }

  return (
    <>
      <div className="d-flex justify-content-center pt-3">
        <h3>Create a New Table</h3>
      </div>
      <ErrorAlert error={tableError} />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="table_name"
          className="form-control mb-1"
          id="table_name"
          placeholder="Table"
          value={tableForm.table_name}
          onChange={handleFormChange}
          minLength={2}
          required
        />
        <input
          type="number"
          name="capacity"
          className="form-control mb-1"
          id="capacity"
          placeholder="Number of guests"
          value={tableForm.capacity}
          onChange={handleFormChange}
          min="1"
          required
        />
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary mr-1">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}