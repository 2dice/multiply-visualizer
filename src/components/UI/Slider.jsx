import React, { useRef, useEffect } from "react";
import "./Slider.css";

const Slider = ({ min, max, value, onChange, onIncrease, onDecrease }) => {
  const offsetWidthSpan = useRef(null);
  const clientWidthSpan = useRef(null);

  useEffect(() => {
    if (offsetWidthSpan.current && clientWidthSpan.current) {
      offsetWidthSpan.current.textContent = String(
        offsetWidthSpan.current.parentElement.offsetWidth
      );
      clientWidthSpan.current.textContent = String(
        clientWidthSpan.current.parentElement.clientWidth
      );
    }
  }, []);

  return (
    <div className="slider-container">
      <button className="slider-button slider-button-prev" onClick={onDecrease}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z"
            fill="white"
          />
        </svg>
      </button>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="slider-input"
      />
      <button className="slider-button slider-button-next" onClick={onIncrease}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
};

export default Slider;
