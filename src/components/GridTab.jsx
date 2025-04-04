import React, { useState } from "react";
import Slider from "./UI/Slider"; // パスを修正
// import styles from './GridTab.module.css'; // CSSモジュールは後で作成

const GridTab = () => {
  // 状態管理は Step 6-3 で実装しますが、基本的な動作のために仮実装します
  const [rows, setRows] = useState(3); // design.md に基づく初期値 (仮)
  const [cols, setCols] = useState(4); // design.md に基づく初期値 (仮)

  // ハンドラーも仮実装
  const handleRowsChange = (newValue) => {
    setRows(newValue);
    console.log(`GridTab: Rows changed to ${newValue}`); // デバッグ用ログ
  };

  const handleColsChange = (newValue) => {
    setCols(newValue);
    console.log(`GridTab: Cols changed to ${newValue}`); // デバッグ用ログ
  };

  return (
    <div className="grid-tab-container">
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
          <div className="slider-control">
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
            />
          </div>
          <div className="slider-control">
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
            />
          </div>
        </div>
      </div>
      <div className="result-area" style={{ marginTop: "10px" }}>
        {" "}
        {/* Add class */}
        {/* 結果表示エリア (Step 6-4 で更新予定) */}
        <p className="result-text">
          {" "}
          {/* Add class for styling */}
          式: {rows} × {cols} = {rows * cols}
        </p>
      </div>
    </div>
  );
};
export default GridTab;
