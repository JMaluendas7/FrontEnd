import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

const useDateRange = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRangeText, setDateRangeText] = useState("");
  const [formattedStartDate, setformattedStartDate] = useState(null);
  const [formattedEndDate, setformattedEndDate] = useState(null);

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

    setformattedStartDate(
      start ? start.toISOString().split("T")[0] + "T00:00:00.00Z" : ""
    );
    setformattedEndDate(
      end ? end.toISOString().split("T")[0] + "T23:59:59.00Z" : ""
    );
  };

  const renderDatePicker = () => (
    <div className="content__dateDH">
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
    </div>
  );

  return {
    formattedStartDate,
    formattedEndDate,
    startDate,
    endDate,
    dateRangeText,
    handleDateChange,
    renderDatePicker,
  };
};

export default useDateRange;
