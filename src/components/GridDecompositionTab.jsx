import React, { useState, useEffect, useRef, useCallback } from "react";
import Slider from "./UI/Slider";
import VerticalSlider from "./UI/VerticalSlider";

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

    // キャンバスをクリア
    ctx.clearRect(0, 0, width, height);

    // キャンバスの高さを調整して縦に10セル入るようにする
    canvas.height = 500; // キャンバスの高さも500に固定
    height = canvas.height;

    // 10x10のときにキャンバス全体にグリッドが収まるようなセルサイズを計算
    const visibleCellSize = 500 / 10; // 10セルあたりの幅を固定
    const maxVisibleCells = 10; // 最大表示セル数

    // 左下を原点として配置するための開始位置
    const startX = 0; // 左端を固定
    const startY = height - maxVisibleCells * visibleCellSize; // 下端から上に向かって配置、常に10セル分の高さを確保

    // 背景色を追加 - 色弱者にも見やすい色に変更
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#E6E6FA"); // 薄いラベンダー色
    bgGradient.addColorStop(1, "#D8D8F0"); // より深いラベンダー色
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

    // 分割位置を示すラインをより強調して描画
    ctx.strokeStyle = "rgba(0, 0, 0, 0.9)"; // 黒色でより目立つように
    ctx.lineWidth = 5; // 線を太く
    ctx.setLineDash([8, 4]); // 点線スタイルをより目立つように調整

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

        // 分割領域に基づいて色を変える
        // 分割領域を判定（左上、右上、左下、右下）
        let gradientColors;

        // 分割領域を判定
        const isLeftSide = col < verticalSplit;
        const isTopSide = row < horizontalSplit;

        if (isLeftSide && isTopSide) {
          // 左上領域（濃い青色）- 色弱者にも識別しやすい
          gradientColors = {
            start: `rgba(0, 102, 204, ${0.8 * cellOpacity})`,
            end: `rgba(0, 51, 153, ${0.6 * cellOpacity})`,
          };
        } else if (!isLeftSide && isTopSide) {
          // 右上領域（濃い茶色）- 黄色を避けて茶色に変更
          gradientColors = {
            start: `rgba(153, 102, 51, ${0.8 * cellOpacity})`,
            end: `rgba(102, 51, 0, ${0.6 * cellOpacity})`,
          };
        } else if (isLeftSide && !isTopSide) {
          // 左下領域（濃い紫色）- 色弱者にも識別しやすい
          gradientColors = {
            start: `rgba(153, 51, 204, ${0.8 * cellOpacity})`,
            end: `rgba(102, 0, 153, ${0.6 * cellOpacity})`,
          };
        } else {
          // 右下領域（濃い赤色）- 色弱者にも識別しやすい
          gradientColors = {
            start: `rgba(204, 0, 0, ${0.8 * cellOpacity})`,
            end: `rgba(153, 0, 0, ${0.6 * cellOpacity})`,
          };
        }

        // グラデーションで光沉感を出す
        const gradient = ctx.createLinearGradient(x, y, x, y + actualCellSize);
        gradient.addColorStop(0, gradientColors.start);
        gradient.addColorStop(1, gradientColors.end);

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

    // テスト用にグローバル変数にコンポーネントの状態管理関数を設定
    window.__GRID_DECOMPOSITION_COMPONENT__ = {
      setRows,
      setCols,
      setVerticalSplit,
      setHorizontalSplit,
      getState: () => ({ rows, cols, verticalSplit, horizontalSplit }),
    };

    // 初回描画
    drawGrid();
  }, [drawGrid, rows, cols, verticalSplit, horizontalSplit]);

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
    console.log(
      `[デバッグ] 横分割スライダー値変更ハンドラー呼び出し: event=`,
      event,
      ` newValue=${newValue}`
    );

    // 値が有効範囲内か確認
    if (newValue >= 0 && newValue <= maxValue) {
      setHorizontalSplit(newValue);
      console.log(
        `GridDecompositionTab: Horizontal split changed to ${newValue}`
      );
    } else {
      console.log(
        `[デバッグ] 横分割スライダー: 無効な値 ${newValue} が指定されました`
      );
    }
  };

  // 横分割スライダー用のカスタムクリックハンドラーは不要になったので削除

  // 横分割増減のハンドラー
  const handleHorizontalSplitIncrease = () => {
    console.log(
      `[デバッグ] 横分割増加ハンドラー呼び出し: 現在値=${horizontalSplit}`
    );
    if (horizontalSplit < maxValue) {
      const newValue = horizontalSplit + 1;
      setHorizontalSplit(newValue);
    }
  };

  const handleHorizontalSplitDecrease = () => {
    if (horizontalSplit > 1) {
      const newValue = horizontalSplit - 1;
      setHorizontalSplit(newValue);
    }
  };

  // 分割結果の式を生成する関数
  const generateSplitFormula = () => {
    // 実際のグリッドサイズに基づいた分割位置を計算
    // 縦分割は横の数と比較、横分割は縦の数と比較
    const effectiveVerticalSplit = Math.min(verticalSplit, cols);
    const effectiveHorizontalSplit = Math.min(horizontalSplit, rows);

    // 全ての場合で同じ計算式を使用する
    // 式の基本形：(縦分割の数×横分割の数) + (縦分割の数×(縦の数-横分割の数)) + ((横の数-縦分割の数)×横分割の数) + ((横の数-縦分割の数)×(縦の数-横分割の数))
    // 分割線がグリッドの外にある場合も同じ計算式を使い、有効な領域のみを式に含める
    const terms = [];

    // 左上領域: 縦分割の数×横分割の数
    if (effectiveVerticalSplit > 0 && effectiveHorizontalSplit > 0) {
      terms.push(`(${effectiveVerticalSplit}×${effectiveHorizontalSplit})`);
    }

    // 右上領域: 縦分割の数×(縦の数-横分割の数)
    if (effectiveVerticalSplit > 0 && rows - effectiveHorizontalSplit > 0) {
      // 正しい計算式は、縦分割の数×(縦の数-横分割の数)
      const rightHeight = rows - effectiveHorizontalSplit;
      terms.push(`(${effectiveVerticalSplit}×${rightHeight})`);
    }

    // 左下領域: (横の数-縦分割の数)×横分割の数
    if (cols - effectiveVerticalSplit > 0 && effectiveHorizontalSplit > 0) {
      terms.push(
        `(${cols - effectiveVerticalSplit}×${effectiveHorizontalSplit})`
      );
    }

    // 右下領域: (横の数-縦分割の数)×(縦の数-横分割の数)
    if (
      cols - effectiveVerticalSplit > 0 &&
      rows - effectiveHorizontalSplit > 0
    ) {
      terms.push(
        `(${cols - effectiveVerticalSplit}×${rows - effectiveHorizontalSplit})`
      );
    }

    // 式が空の場合はエラーメッセージを表示
    if (terms.length === 0) {
      return "有効な分割がありません";
    }

    return `${terms.join(" + ")} = ${product}`;
  };

  return (
    <div
      className="grid-decomposition-tab-container"
      data-testid="grid-decomposition-tab-container"
      style={{
        padding: "10px 20px",
        maxHeight: "100vh",
        overflow: "hidden",
        maxWidth: "1200px", // 最大幅を設定
        margin: "0 auto", // 中央揃え
      }}
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
            margin: "0 auto", // 中央揃え
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
              left: "50%", // コンテナの中央に配置
              transform: "translateX(-50%)", // 自身の幅の半分だけ左に移動させて中央揃え
              marginLeft: "-27px", // 左に27px移動
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
              // maxWidthを削除して画面幅に応じて要素が広がるようにする
              margin: "30px auto 0", // 上マージン30px、左右中央揃え
              overflow: "hidden", // はみ出した要素を隠す
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
                height: "539px", // グリッドの高さに合わせる（境界線も含む）
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "absolute",
                left: "calc(50% + 251px + 10px)", // グリッドの右端から右に20px移動
                top: "0", // グリッド表示エリアの上端に配置
              }}
              // カスタムクリックハンドラーは不要になったので削除
            >
              {/* 縦方向スライダーを使用しているため、上に行くほど値が大きくなる */}
              <VerticalSlider
                id="horizontal-split-slider"
                min={0}
                max={maxValue}
                value={horizontalSplit}
                onChange={handleHorizontalSplitChange}
                onIncrease={handleHorizontalSplitIncrease}
                onDecrease={handleHorizontalSplitDecrease}
                data-testid="horizontal-split-slider"
                hideButtons={true}
              />
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
