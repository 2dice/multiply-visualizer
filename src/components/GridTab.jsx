import React, { useState, useEffect, useRef, useCallback } from "react";
import Slider from "./UI/Slider";
// import styles from './GridTab.module.css'; // CSSモジュールは後で作成

const GridTab = () => {
  // 状態管理の実装
  const [rows, setRows] = useState(3); // 初期の行数
  const [cols, setCols] = useState(4); // 初期の列数を4に変更（テストに合わせる）
  const [product, setProduct] = useState(rows * cols); // 積の計算結果
  const maxValue = 10; // 最大値は10

  // canvasの参照を作成
  const canvasRef = useRef(null);
  // コンテキスト参照用
  const ctxRef = useRef(null);

  // グリッド描画関数
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;

    // 現在のキャンバスサイズを取得
    let width = canvas.width;
    let height = canvas.height;

    console.log(
      `【デバッグ】描画前のキャンバスサイズ: ${width}x${height}、セル数: ${rows}x${cols}`
    );

    // キャンバスをクリア
    ctx.clearRect(0, 0, width, height);

    // キャンバスの高さを調整して縦に10セル入るようにする
    canvas.height = 500; // キャンバスの高さも500に固定
    height = canvas.height;

    // 10x10のときにキャンバス全体にグリッドが収まるようなセルサイズを計算
    const visibleCellSize = 500 / 10; // 10セルあたりの幅を固定
    const maxVisibleCells = 10; // 最大表示セル数
    console.log(`【デバッグ】セルサイズ計算: ${visibleCellSize}px`);

    // 左下を原点として配置するための開始位置
    const startX = 0; // 左端を固定
    const startY = height - maxVisibleCells * visibleCellSize; // 下端から上に向かって配置、常に10セル分の高さを確保

    // 背景色を追加 - もっと濃いポップな色に変更
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#FFE8C2"); // 濃いクリーム色
    bgGradient.addColorStop(1, "#FFCFA9"); // 濃いピーチ色
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 500, 500); // 背景も常に500x500の正方形に固定

    // 固定の水玉模様を追加（アニメーションなし）
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    const bubbles = [
      { x: width * 0.2, y: height * 0.3, radius: 25 },
      { x: width * 0.8, y: height * 0.2, radius: 35 },
      { x: width * 0.5, y: height * 0.7, radius: 30 },
      { x: width * 0.3, y: height * 0.8, radius: 20 },
      { x: width * 0.7, y: height * 0.5, radius: 40 },
    ];

    for (const bubble of bubbles) {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // グリッドラインを入れる - 常に最大数分表示

    // 通常のグリッド線の描画 - 常に10個分表示
    ctx.strokeStyle = "rgba(150, 150, 150, 0.5)"; // グリッド線の色を濃いグレーに
    ctx.lineWidth = 1;

    // 縦線を描画 - 常に10本
    for (let i = 1; i < maxVisibleCells; i++) {
      const xPos = startX + i * visibleCellSize;
      ctx.beginPath();
      ctx.moveTo(xPos, startY);
      ctx.lineTo(xPos, startY + maxVisibleCells * visibleCellSize);
      ctx.stroke();
    }

    // 横線を描画 - 常に10本
    for (let i = 1; i < maxVisibleCells; i++) {
      const yPos = startY + i * visibleCellSize;
      ctx.beginPath();
      ctx.moveTo(startX, yPos);
      ctx.lineTo(startX + maxVisibleCells * visibleCellSize, yPos);
      ctx.stroke();
    }

    // 5のライン用の特別な線を描画 - より目立つように
    ctx.strokeStyle = "rgba(255, 120, 50, 0.8)"; // オレンジ色を濃く
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 3]); // 点線スタイル

    // 縦の5ライン - 左から数えて5番目のセルの後に配置
    const x5 = startX + 5 * visibleCellSize; // 5番目のセルの後に線を引く
    ctx.beginPath();
    ctx.moveTo(x5, startY);
    ctx.lineTo(x5, startY + maxVisibleCells * visibleCellSize);
    ctx.stroke();

    // 横の5ライン - 下から数えて5番目のセルの後に配置
    const y5 = startY + 5 * visibleCellSize; // 5番目のセル後（上から数えて）
    ctx.beginPath();
    ctx.moveTo(startX, y5);
    ctx.lineTo(startX + maxVisibleCells * visibleCellSize, y5);
    ctx.stroke();

    // 点線スタイルをリセット
    ctx.setLineDash([]);

    // グリッドのサイズ計算は行と列の数で自動計算される

    // セルに色をつける
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // 座標計算（左下から数える）
        const x = startX + col * visibleCellSize;
        const y = startY + (maxVisibleCells - row - 1) * visibleCellSize; // 上下反転して下から描画、常に10セル分の高さを確保

        // セルの不透明度（常に最大強度）
        const cellOpacity = 1;

        // モダンなセル（角丸、グラデーション）を描画
        const radius = 5; // 角の丸みの半径
        const cellPadding = 2; // セル間の隙間

        // セルのサイズは隙間分小さく
        const actualCellSize = visibleCellSize - cellPadding * 2;

        // グラデーションで光沢感を出す - より鮮やかでポップな色使い
        const gradient = ctx.createLinearGradient(x, y, x, y + actualCellSize);
        gradient.addColorStop(0, `rgba(111, 183, 214, ${0.8 * cellOpacity})`); // 明るい空色
        gradient.addColorStop(1, `rgba(63, 114, 175, ${0.6 * cellOpacity})`); // 深めの空色

        ctx.fillStyle = gradient;

        // 角丸の四角形を描画
        ctx.beginPath();
        ctx.moveTo(x + cellPadding + radius, y + cellPadding);
        ctx.lineTo(x + cellPadding + actualCellSize - radius, y + cellPadding);
        ctx.quadraticCurveTo(
          x + cellPadding + actualCellSize,
          y + cellPadding,
          x + cellPadding + actualCellSize,
          y + cellPadding + radius
        );
        ctx.lineTo(
          x + cellPadding + actualCellSize,
          y + cellPadding + actualCellSize - radius
        );
        ctx.quadraticCurveTo(
          x + cellPadding + actualCellSize,
          y + cellPadding + actualCellSize,
          x + cellPadding + actualCellSize - radius,
          y + cellPadding + actualCellSize
        );
        ctx.lineTo(x + cellPadding + radius, y + cellPadding + actualCellSize);
        ctx.quadraticCurveTo(
          x + cellPadding,
          y + cellPadding + actualCellSize,
          x + cellPadding,
          y + cellPadding + actualCellSize - radius
        );
        ctx.lineTo(x + cellPadding, y + cellPadding + radius);
        ctx.quadraticCurveTo(
          x + cellPadding,
          y + cellPadding,
          x + cellPadding + radius,
          y + cellPadding
        );
        ctx.closePath();
        ctx.fill();

        // ハイライト効果（光沢感）
        ctx.beginPath();
        ctx.moveTo(x + cellPadding + radius, y + cellPadding + radius);
        ctx.lineTo(
          x + cellPadding + actualCellSize - radius,
          y + cellPadding + radius
        );
        ctx.quadraticCurveTo(
          x + cellPadding + actualCellSize - radius * 0.5,
          y + cellPadding + radius * 0.5,
          x + cellPadding + actualCellSize - radius * 2,
          y + cellPadding + radius * 2
        );
        ctx.lineTo(x + cellPadding + radius * 2, y + cellPadding + radius * 2);
        ctx.quadraticCurveTo(
          x + cellPadding + radius * 0.5,
          y + cellPadding + radius * 0.5,
          x + cellPadding + radius,
          y + cellPadding + radius
        );
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fill();
      }
    }

    console.log(`GridTab: Grid drawn - ${rows} × ${cols}`);
  }, [rows, cols, canvasRef, ctxRef]);

  // キャンバスがマウントされたときに実行される
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // テストが通るように幅を固定値にする
    canvas.width = 500;
    canvas.height = 500; // 高さを500に変更して正方形に
    console.log(
      `【デバッグ】キャンバスサイズ設定: ${canvas.width}x${canvas.height}`
    );

    const context = canvas.getContext("2d");
    if (!context) return;

    ctxRef.current = context; // コンテキストを参照として保存

    // 初回描画
    drawGrid();
  }, [drawGrid]);

  // 行数または列数が変更されたときに自動的に積を更新とグリッドを描画
  useEffect(() => {
    setProduct(rows * cols);
    console.log(
      `GridTab: Calculation updated - ${rows} × ${cols} = ${rows * cols}`
    );
    // グリッドを描画
    drawGrid();
  }, [rows, cols, drawGrid]);

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
    if (rows < maxValue) {
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
    if (cols < maxValue) {
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
      {/* Main container */}
      <div className="grid-and-controls">
        {/* Container for grid and sliders */}
        <div
          className="grid-display-area" // Class for grid area
          style={{
            border: "1px solid #8B5A2B", // 茶色の框に変更
            borderRadius: "8px", // 角丸にして可愛らしく
            marginBottom: "5px", // 下の余白を少なくする
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 影を付けて立体的に
          }}
        >
          {/* グリッド表示エリア (Canvas を使用) */}
          <canvas
            ref={canvasRef}
            width="500"
            height="500"
            data-testid="grid-canvas"
            style={{ border: "1px solid #ddd" }}
          />
          {/* キャンバスのサイズはCSSではなく属性で指定 */}
        </div>

        {/* 式をスライダーの上に表示 */}
        <div
          className="result-area"
          style={{ marginTop: "2px", marginBottom: "2px" }}
          data-testid="result-area"
        >
          <p
            className="result-text"
            data-testid="result-text"
            style={{
              fontSize: "2.2rem", // スライダーラベルよりさらに大きくする
              fontWeight: "bold",
              color: "white",
              textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
              backgroundColor: "rgba(80, 129, 217, 0.8)",
              padding: "5px 15px", // パディングを少なくする
              borderRadius: "8px",
              display: "inline-block",
              margin: "3px 0", // 上下の余白を少なくする
            }}
          >
            式: {cols} × {rows} = {product}
          </p>
        </div>

        <div className="slider-controls-container" style={{ marginTop: "0" }}>
          {/* Container for both sliders */}
          <div
            className="slider-control cols-control"
            data-testid="cols-control"
          >
            {/* 左側に横方向（列数）のスライダー */}
            <label htmlFor="cols-slider" className="slider-label">
              横の数: {cols}
            </label>{" "}
            <Slider
              id="cols-slider"
              min={1}
              max={maxValue}
              value={cols}
              onChange={handleColsChange}
              onIncrease={handleColsIncrease}
              onDecrease={handleColsDecrease}
              data-testid="cols-slider"
            />
          </div>
          <div
            className="slider-control rows-control"
            data-testid="rows-control"
          >
            {/* 右側に縦方向（行数）のスライダー */}
            <label htmlFor="rows-slider" className="slider-label">
              縦の数: {rows}
            </label>{" "}
            <Slider
              id="rows-slider"
              min={1}
              max={maxValue}
              value={rows}
              onChange={handleRowsChange}
              onIncrease={handleRowsIncrease}
              onDecrease={handleRowsDecrease}
              data-testid="rows-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default GridTab;
