import React, { useState } from "react";
import Slider from "./UI/Slider"; // パスを修正
// import styles from './GridTab.module.css'; // CSSモジュールは後で作成

const GridTab = () => {
  // 状態管理は Step 6-2 で実装しますが、基本的な動作のために仮実装します
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
    <div>
      <h2>グリッドタブ</h2>
      <div className="slider-control">
        {" "}
        {/* クラス名を追加 */}
        <label htmlFor="rows-slider">行数: {rows}</label>
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
        {/* クラス名を追加 */}
        <label htmlFor="cols-slider">列数: {cols}</label>
        <Slider
          id="cols-slider"
          min={1}
          max={9}
          value={cols}
          onChange={handleColsChange}
        />
      </div>
      <div
        /* className={styles.gridContainer} */ style={{
          border: "1px solid black",
          minHeight: "200px",
          marginTop: "20px",
          padding: "10px",
        }}
      >
        {/* グリッド表示エリア (Step 6-3 で Canvas を使用予定) */}
        グリッド表示エリア (ここに {rows} x {cols} のグリッドが表示されます)
      </div>
      <div /* className={styles.resultArea} */ style={{ marginTop: "10px" }}>
        {/* 結果表示エリア (Step 6-3 で更新予定) */}
        <p>
          式: {rows} × {cols} = {rows * cols}
        </p>
      </div>
    </div>
  );
};

export default GridTab;
