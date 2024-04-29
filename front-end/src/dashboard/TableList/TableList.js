import React from "react";
import TableInfo from "./TableInfo";

export default function TableList({ tables, loadDashboard }) {
  if (!tables || tables.length === 0) {
    return null;
  }

  const formatted = tables.map((table) => {
    const tableKey = table.table_id || table.index; // use index as a fallback key
    const capacity = table.capacity || "N/A";
    const status = table.status || "N/A";
    const finish = table.finish ? new Date(table.finish).toLocaleString() : "N/A";

    return (
      <TableInfo
        key={tableKey}
        table={table}
        loadDashboard={loadDashboard}
        capacity={capacity}
        status={status}
        finish={finish}
      />
    );
  });

  return (
    <div>
      <table className="table table-sm table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Table</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
            <th scope="col">Finish</th>
          </tr>
        </thead>
        <tbody>{formatted}</tbody>
      </table>
    </div>
  );
}

