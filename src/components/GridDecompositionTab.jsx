import React, { useState, useEffect, useRef, useCallback } from "react";
import Slider from "./UI/Slider";
// import styles from './GridDecompositionTab.module.css'; // CSSモジュールは後で作成

const GridDecompositionTab = () => {
  // 状態管理の実装
  const [rows, setRows] = useState(8); // 初期の行数
  const [cols, setCols] = useState(8); // 初期の列数
  const [verticalSplit, setVerticalSplit] = useState(4); // 初期の縦分割位置
  const [horizontalSplit, setHorizontalSplit] = useState(4); // 初期の横分割位置
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
      `【デバッグ】描画前のキャンバスサイズ: ${width}x${height}、セル数: ${rows}x${cols}、分割位置: 縦${verticalSplit}, 横${horizontalSplit}`
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

    // 分割位置を示すオレンジ色のラインを描画
    ctx.strokeStyle = "rgba(255, 120, 50, 0.8)"; // オレンジ色を濃く
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 3]); // 点線スタイル

    // 縦分割位置のライン
    const xSplit = startX + verticalSplit * visibleCellSize; // 縦分割位置に線を引く
    ctx.beginPath();
    ctx.moveTo(xSplit, startY);
    ctx.lineTo(xSplit, startY + maxVisibleCells * visibleCellSize);
    ctx.stroke();

    // 横分割位置のライン
    const ySplit =
      startY + (maxVisibleCells - horizontalSplit) * visibleCellSize; // 横分割位置に線を引く
    ctx.beginPath();
    ctx.moveTo(startX, ySplit);
    ctx.lineTo(startX + maxVisibleCells * visibleCellSize, ySplit);
    ctx.stroke();

    // 点線スタイルをリセット
    ctx.setLineDash([]);

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

        // グラデーションで光沉感を出す - より鮮やかでポップな色使い
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

        // ハイライト効果（光沉感）
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

    console.log(
      `GridDecompositionTab: Grid drawn - ${rows} × ${cols}, Split at: V${verticalSplit}, H${horizontalSplit}`
    );
  }, [rows, cols, verticalSplit, horizontalSplit, canvasRef, ctxRef]);

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
      `GridDecompositionTab: Calculation updated - ${rows} × ${cols} = ${rows * cols}`
    );
    // グリッドを描画
    drawGrid();
  }, [rows, cols, verticalSplit, horizontalSplit, drawGrid]);

  // 行数スライダーの値変更ハンドラー
  const handleRowsChange = (event) => {
    // eventがNumberの場合もあるので、両方対応する
    const newValue =
      typeof event === "object" ? Number(event.target.value) : Number(event);
    setRows(newValue);
    console.log(`GridDecompositionTab: Rows changed to ${newValue}`);
  };

  // 行数増減のハンドラー
  const handleRowsIncrease = () => {
    if (rows < maxValue) {
      const newValue = rows + 1;
      setRows(newValue);
      console.log(`GridDecompositionTab: Rows increased to ${newValue}`);
    }
  };

  const handleRowsDecrease = () => {
    if (rows > 1) {
      const newValue = rows - 1;
      setRows(newValue);
      console.log(`GridDecompositionTab: Rows decreased to ${newValue}`);
    }
  };

  // 列数スライダーの値変更ハンドラー
  const handleColsChange = (event) => {
    // eventがNumberの場合もあるので、両方対応する
    const newValue =
      typeof event === "object" ? Number(event.target.value) : Number(event);
    setCols(newValue);
    console.log(`GridDecompositionTab: Cols changed to ${newValue}`);
  };

  // 列数増減のハンドラー
  const handleColsIncrease = () => {
    if (cols < maxValue) {
      const newValue = cols + 1;
      setCols(newValue);
      console.log(`GridDecompositionTab: Cols increased to ${newValue}`);
    }
  };

  const handleColsDecrease = () => {
    if (cols > 1) {
      const newValue = cols - 1;
      setCols(newValue);
      console.log(`GridDecompositionTab: Cols decreased to ${newValue}`);
    }
  };

  // 縦分割スライダーの値変更ハンドラー
  const handleVerticalSplitChange = (event) => {
    // eventがNumberの場合もあるので、両方対応する
    const newValue =
      typeof event === "object" ? Number(event.target.value) : Number(event);
    setVerticalSplit(newValue);
    console.log(`GridDecompositionTab: Vertical split changed to ${newValue}`);
  };

  // 縦分割増減のハンドラー
  const handleVerticalSplitIncrease = () => {
    if (verticalSplit < maxValue) {
      const newValue = verticalSplit + 1;
      setVerticalSplit(newValue);
      console.log(
        `GridDecompositionTab: Vertical split increased to ${newValue}`
      );
    }
  };

  const handleVerticalSplitDecrease = () => {
    if (verticalSplit > 1) {
      const newValue = verticalSplit - 1;
      setVerticalSplit(newValue);
      console.log(
        `GridDecompositionTab: Vertical split decreased to ${newValue}`
      );
    }
  };

  // 横分割スライダーの値変更ハンドラー
  const handleHorizontalSplitChange = (event) => {
    // eventがNumberの場合もあるので、両方対応する
    const newValue =
      typeof event === "object" ? Number(event.target.value) : Number(event);
    setHorizontalSplit(newValue);
    console.log(
      `GridDecompositionTab: Horizontal split changed to ${newValue}`
    );
  };

  // 横分割増減のハンドラー
  const handleHorizontalSplitIncrease = () => {
    if (horizontalSplit < maxValue) {
      const newValue = horizontalSplit + 1;
      setHorizontalSplit(newValue);
      console.log(
        `GridDecompositionTab: Horizontal split increased to ${newValue}`
      );
    }
  };

  const handleHorizontalSplitDecrease = () => {
    if (horizontalSplit > 1) {
      const newValue = horizontalSplit - 1;
      setHorizontalSplit(newValue);
      console.log(
        `GridDecompositionTab: Horizontal split decreased to ${newValue}`
      );
    }
  };

  // 分割結果の式を生成する関数
  const generateSplitFormula = () => {
    // 分割された4つの領域の計算式を生成
    const topLeft = `(${verticalSplit}×${horizontalSplit})`;
    const topRight = `(${verticalSplit}×${cols - horizontalSplit})`;
    const bottomLeft = `(${rows - verticalSplit}×${horizontalSplit})`;
    const bottomRight = `(${rows - verticalSplit}×${cols - horizontalSplit})`;

    return `${topLeft} + ${topRight} + ${bottomLeft} + ${bottomRight} = ${product}`;
  };

  return (
    <div
      className="grid-decomposition-tab-container"
      data-testid="grid-decomposition-tab-container"
      style={{ padding: "10px 20px", maxHeight: "100vh", overflow: "hidden" }}
    >
      {/* Main container */}
      <div
        className="grid-and-controls"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* グリッド表示エリアと分割スライダーのコンテナ */}
        <div
          className="grid-and-sliders-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* 縦分割スライダー（グリッド表示エリアの上に配置） */}
          <div
            className="vertical-split-control"
            data-testid="vertical-split-control"
            style={{
              width: "502px", // グリッドの幅に合わせる（境界線も含む）
              position: "absolute",
              zIndex: "1",
              top: "75px", // グリッド表示エリアの上端からの位置調整
              left: "calc(50% - 290px)", // グリッドの左端に配置
            }}
          >
            <div style={{ height: "30px" }}>
              <Slider
                id="vertical-split-slider"
                min={0}
                max={maxValue}
                value={verticalSplit}
                onChange={handleVerticalSplitChange}
                onIncrease={handleVerticalSplitIncrease}
                onDecrease={handleVerticalSplitDecrease}
                data-testid="vertical-split-slider"
                hideButtons={true}
                style={{ height: "30px" }}
              />
            </div>
          </div>

          <div
            className="grid-display-container"
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            {/* グリッド表示エリア */}
            <div
              className="grid-display-area"
              style={{
                border: "1px solid #8B5A2B",
                borderRadius: "8px",
                marginBottom: "5px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                margin: "0 auto", // 中央に配置
                position: "relative",
              }}
              data-testid="grid-display-area"
            >
              {/* グリッド表示エリア (Canvas を使用) */}
              <canvas
                ref={canvasRef}
                width="500"
                height="500"
                data-testid="grid-canvas"
                style={{ border: "1px solid #ddd" }}
              />
            </div>

            {/* 横分割スライダー（グリッド表示エリアの右に配置） */}
            <div
              className="horizontal-split-control"
              data-testid="horizontal-split-control"
              style={{
                height: "422px", // グリッドの高さに合わせる（境界線も含む）
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "absolute",
                right: "calc(50% - 740px)", // グリッドの右端に配置（右にズラす）
                top: "0", // グリッド表示エリアの上端に配置
              }}
            >
              <div
                style={{
                  transform: "rotate(-90deg)",
                  width: "502px",
                  transformOrigin: "0 0",
                  position: "relative",
                  top: "340px", // 高さ方向の位置調整
                }}
              >
                <Slider
                  id="horizontal-split-slider"
                  min={0}
                  max={maxValue}
                  value={horizontalSplit}
                  onChange={handleHorizontalSplitChange}
                  onIncrease={handleHorizontalSplitDecrease}
                  onDecrease={handleHorizontalSplitIncrease}
                  data-testid="horizontal-split-slider"
                  hideButtons={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 式を表示 */}
        <div
          className="result-area"
          style={{
            marginTop: "20px",
            marginBottom: "2px",
            textAlign: "center",
            width: "100%",
          }}
          data-testid="result-area"
        >
          <p
            className="result-text"
            data-testid="result-text"
            style={{
              fontSize: "2.2rem",
              fontWeight: "bold",
              color: "white",
              textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
              backgroundColor: "rgba(80, 129, 217, 0.8)",
              padding: "5px 15px",
              borderRadius: "8px",
              display: "inline-block",
              margin: "3px 0",
            }}
          >
            式: {cols} × {rows} = {product}
          </p>
        </div>

        {/* 分割結果の式を表示 */}
        <div
          className="split-formula-area"
          style={{
            marginTop: "2px",
            marginBottom: "10px",
            textAlign: "center",
            width: "100%",
          }}
          data-testid="split-formula-area"
        >
          <p
            className="split-formula-text"
            data-testid="split-formula-text"
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "white",
              textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
              backgroundColor: "rgba(80, 129, 217, 0.8)",
              padding: "5px 15px",
              borderRadius: "8px",
              display: "inline-block",
              margin: "3px 0",
            }}
          >
            {generateSplitFormula()}
          </p>
        </div>

        <div
          className="slider-controls-container"
          style={{
            marginTop: "10px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {/* Container for both sliders */}
          <div
            className="slider-control cols-control"
            data-testid="cols-control"
            style={{ width: "400px" }}
          >
            {/* 左側に横方向（列数）のスライダー */}
            <label
              htmlFor="cols-slider"
              className="slider-label"
              style={{
                display: "block",
                textAlign: "center",
                marginBottom: "5px",
              }}
            >
              横の数: {cols}
            </label>
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
            style={{ width: "400px" }}
          >
            {/* 右側に縦方向（行数）のスライダー */}
            <label
              htmlFor="rows-slider"
              className="slider-label"
              style={{
                display: "block",
                textAlign: "center",
                marginBottom: "5px",
              }}
            >
              縦の数: {rows}
            </label>
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

export default GridDecompositionTab;
