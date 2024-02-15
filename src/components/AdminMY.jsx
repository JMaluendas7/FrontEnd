import React, { useState } from "react";

const useDateMY = ({ setShowTable }) => {
  const [DateMY, setDateMY] = useState("");

  const renderDateMY = () => (
    <div>
      <input
        type="month"
        className="input-field"
        value={DateMY}
        onChange={(e) => {
          setDateMY(e.target.value);
          setShowTable(false);
        }}
        min="YYYY-01"
        max="YYYY-12"
      />
      <label className="input-label-options label">Mes y Año</label>
    </div>
  );

  return {
    renderDateMY,
    month: DateMY.split("-")[1],
    year: DateMY.split("-")[0],
  };
};

export default useDateMY;
