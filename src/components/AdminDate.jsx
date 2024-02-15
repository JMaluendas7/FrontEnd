import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

const useDate = () => {
  const [DateF, setDateF] = useState("");
  const [dateRangeText, setDateRangeText] = useState("");
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDateF(
      date
        ? `${date.toISOString().split("T")[0]} ${
            date.toISOString().split("T")[1].split(".")[0]
          }`
        : ""
    );

    if (date) {
      const formattedDate = date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      setDateRangeText(`${formattedDate}`);
    } else {
      setDateRangeText("");
    }
  };

  const renderDatePicker1 = () => (
    <div className="content__dateDH">
      <div className="input-container">
        <DatePicker
          className="input-field-datepicker datepicker icon_calendar"
          selected={selectedDate}
          onChange={handleDateChange}
          inputMode="none"
          onBlur={() => setShow(false)}
          onSelect={() => setShow(false)}
          onInputClick={() => setShow(true)}
          onClickOutside={() => setShow(false)}
          open={show}
          locale={es}
        />
        <label
          className={`input-label-datepicker ${selectedDate ? "label" : ""}`}
        >
          Fecha
        </label>
      </div>
    </div>
  );

  return {
    selectedDate,
    DateF,
    handleDateChange,
    renderDatePicker1,
  };
};

export default useDate;
