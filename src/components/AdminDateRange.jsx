import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

const useDateRange = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRangeText, setDateRangeText] = useState("");

  const handleDateChange = (dates) => {
    const [start, end] = dates;

    const formatDate = (date) =>
      date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });

    setStartDate(start);
    setEndDate(end);
    setDateRangeText(
      start && end ? `${formatDate(start)} - ${formatDate(end)}` : ""
    );
  };

  const renderDatePicker = () => (
    <div className="input-container">
      <DatePicker
        className="input-field-datepicker datepicker icon_calendar"
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        inputMode="none"
        onFocus={(e) => e.target.blur()}
        onBlur={(e) => e.target.blur()}
        disabledInput
        locale={es}
      />
      <label className={`input-label-datepicker ${startDate ? "label" : ""}`}>
        Rango de Fecha
      </label>
    </div>
  );

  return {
    startDate,
    endDate,
    dateRangeText,
    handleDateChange,
    renderDatePicker,
  };
};

export default useDateRange;
