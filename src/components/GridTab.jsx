import React, { useState, useEffect } from "react";
import Slider from "./UI/Slider";
// import styles from './GridTab.module.css'; // CSSモジュールは後で作成

const GridTab = () => {
  // 状態管理の実装 (Step 6-3)
  const [rows, setRows] = useState(3); // design.mdに基づく初期値
  const [cols, setCols] = useState(4); // design.mdに基づく初期値
  const [product, setProduct] = useState(rows * cols); // 結果の状態も管理

  // 行数または列数が変更されたときに自動的に積を更新
  useEffect(() => {
    setProduct(rows * cols);
    console.log(
      `GridTab: Calculation updated - ${rows} × ${cols} = ${rows * cols}`
    );
  }, [rows, cols]);

  // 行数スライダーの値変更ハンドラー
  const handleRowsChange = (event) => {
    // eventがNumberの場合もあるので、両方対応する
    const newValue =
      typeof event === "object" ? Number(event.target.value) : Number(event);
    setRows(newValue);
    console.log(`GridTab: Rows changed to ${newValue}`);
  };

  // 行数増減のハンドラー
  const handleRowsIncrease = () => {
    if (rows < 9) {
      const newValue = rows + 1;
      setRows(newValue);
      console.log(`GridTab: Rows increased to ${newValue}`);
    }
  };

  const handleRowsDecrease = () => {
    if (rows > 1) {
      const newValue = rows - 1;
      setRows(newValue);
      console.log(`GridTab: Rows decreased to ${newValue}`);
    }
  };

  // 列数スライダーの値変更ハンドラー
  const handleColsChange = (event) => {
    // eventがNumberの場合もあるので、両方対応する
    const newValue =
      typeof event === "object" ? Number(event.target.value) : Number(event);
    setCols(newValue);
    console.log(`GridTab: Cols changed to ${newValue}`);
  };

  // 列数増減のハンドラー
  const handleColsIncrease = () => {
    if (cols < 9) {
      const newValue = cols + 1;
      setCols(newValue);
      console.log(`GridTab: Cols increased to ${newValue}`);
    }
  };

  const handleColsDecrease = () => {
    if (cols > 1) {
      const newValue = cols - 1;
      setCols(newValue);
      console.log(`GridTab: Cols decreased to ${newValue}`);
    }
  };

  return (
    <div className="grid-tab-container" data-testid="grid-tab-container">
      {" "}
      {/* Main container */}
      <h2>グリッドタブ</h2>
      <div className="grid-and-controls">
        {" "}
        {/* Container for grid and sliders */}
        <div
          className="grid-display-area" // Class for grid area
          style={{
            border: "1px solid black",
            minHeight: "300px", // Increase min-height for better visibility
            // width: '100%', // Let flexbox handle width
            marginBottom: "20px", // Space below grid
          }}
        >
          {/* グリッド表示エリア (Step 6-4 で Canvas を使用予定) */}
          グリッド表示エリア (ここに {rows} x {cols} のグリッドが表示されます)
        </div>
        <div className="slider-controls-container">
          {" "}
          {/* Container for both sliders */}
          <div
            className="slider-control rows-control"
            data-testid="rows-control"
          >
            {" "}
            {/* Existing class */}
            <label htmlFor="rows-slider" className="slider-label">
              行数: {rows}
            </label>{" "}
            {/* Add class for styling */}
            <Slider
              id="rows-slider"
              min={1}
              max={9}
              value={rows}
              onChange={handleRowsChange}
              onIncrease={handleRowsIncrease}
              onDecrease={handleRowsDecrease}
              data-testid="rows-slider"
            />
          </div>
          <div
            className="slider-control cols-control"
            data-testid="cols-control"
          >
            {" "}
            {/* Existing class */}
            <label htmlFor="cols-slider" className="slider-label">
              列数: {cols}
            </label>{" "}
            {/* Add class for styling */}
            <Slider
              id="cols-slider"
              min={1}
              max={9}
              value={cols}
              onChange={handleColsChange}
              onIncrease={handleColsIncrease}
              onDecrease={handleColsDecrease}
              data-testid="cols-slider"
            />
          </div>
        </div>
      </div>
      <div
        className="result-area"
        style={{ marginTop: "10px" }}
        data-testid="result-area"
      >
        {" "}
        {/* Add class */}
        {/* 結果表示エリア (Step 6-4 で更新予定) */}
        <p className="result-text" data-testid="result-text">
          {" "}
          {/* Add class for styling */}
          式: {rows} × {cols} = {product}
        </p>
      </div>
    </div>
  );
};
export default GridTab;
