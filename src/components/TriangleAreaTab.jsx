import React, { useState, useEffect, useRef, useCallback } from "react";
import Slider from "./UI/Slider";

const TriangleAreaTab = () => {
  // 状態管理の実装
  const [base, setBase] = useState(6); // 初期の底辺の長さ（design.mdより）
  const [height, setHeight] = useState(4); // 初期の高さ（design.mdより）
  const [vertexPosition, setVertexPosition] = useState("center"); // 初期の頂点位置（左端、中央、右端）
  const [area, setArea] = useState((base * height) / 2); // 三角形の面積
  const [isBlinking, setIsBlinking] = useState(true); // 点滅状態の管理
  const maxValue = 10; // 最大値は10

  // canvasの参照を作成
  const canvasRef = useRef(null);
  // コンテキスト参照用
  const ctxRef = useRef(null);
  // 点滅タイマーの参照用
  const timerRef = useRef(null);

  // 三角形描画関数
  const drawTriangle = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;

    // 現在のキャンバスサイズを取得
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    console.log(
      `【デバッグ】三角形描画前のキャンバスサイズ: ${canvasWidth}x${canvasHeight}`
    );

    // キャンバスをクリア
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // キャンバスの高さを調整して縦に10セル入るようにする
    canvas.height = 500; // キャンバスの高さも500に固定
    canvasHeight = canvas.height;

    // 10x10のときにキャンバス全体にグリッドが収まるようなセルサイズを計算
    const visibleCellSize = 500 / 10; // 10セルあたりの幅を固定
    const maxVisibleCells = 10; // 最大表示セル数
    console.log(`【デバッグ】セルサイズ計算: ${visibleCellSize}px`);

    // 左下を原点として配置するための開始位置
    const startX = 0; // 左端を固定
    const startY = 0; // キャンバスの上端から開始

    console.log(`【デバッグ】グリッド起点座標: (${startX}, ${startY})`);
    console.log(
      `【デバッグ】スライダー値確認: 底辺=${base}, 高さ=${height}, 頂点位置=${vertexPosition}`
    );

    // 背景色を追加 - もっと濃いポップな色に変更
    const bgGradient = ctx.createLinearGradient(
      0,
      0,
      canvasWidth,
      canvasHeight
    );
    bgGradient.addColorStop(0, "#FFE8C2"); // 濃いクリーム色
    bgGradient.addColorStop(1, "#FFCFA9"); // 濃いピーチ色
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 500, 500); // 背景も常に500x500の正方形に固定

    // 固定の水玉模様を追加（アニメーションなし）
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    const bubbles = [
      { x: canvasWidth * 0.2, y: canvasHeight * 0.3, radius: 25 },
      { x: canvasWidth * 0.8, y: canvasHeight * 0.2, radius: 35 },
      { x: canvasWidth * 0.5, y: canvasHeight * 0.7, radius: 30 },
      { x: canvasWidth * 0.3, y: canvasHeight * 0.8, radius: 20 },
      { x: canvasWidth * 0.7, y: canvasHeight * 0.5, radius: 40 },
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

    // 三角形を描画
    // 三角形の座標計算
    // スライダーの値に対応するグリッドのサイズを計算
    const baseWidth = base * visibleCellSize;
    const triangleHeight = height * visibleCellSize;

    console.log(`【デバッグ】スライダー値: 底辺=${base}, 高さ=${height}`);
    console.log(
      `【デバッグ】底辺サイズ=${baseWidth}px, 高さサイズ=${triangleHeight}px`
    );

    // 三角形の左下をグリッドエリアの左下に固定する計算
    // グリッドエリアの左下の座標を定義
    const gridBottomLeftX = 0;
    const gridBottomLeftY = canvasHeight;

    // グリッド上のセルの大きさが50pxなので、マージンを設定して少し調整
    const marginX = 0; // 左端に固定
    const marginY = 0; // 下端に固定

    // 底辺の左端のx座標
    const bottomLeftX = gridBottomLeftX + marginX;
    // 底辺のy座標（下端）
    const bottomLeftY = gridBottomLeftY - marginY;

    // 底辺の右端の座標
    const bottomRightX = bottomLeftX + baseWidth;
    const bottomRightY = bottomLeftY;

    // 頂点のx座標（頂点位置によって変わる）
    let topX;

    switch (vertexPosition) {
      case "left":
        topX = bottomLeftX; // 左端
        break;
      case "center":
        topX = bottomLeftX + baseWidth / 2; // 中央
        break;
      case "right":
        topX = bottomRightX; // 右端
        break;
      default:
        topX = bottomLeftX + baseWidth / 2; // デフォルトは中央
    }

    // 頂点のy座標（上端）
    const topY = bottomLeftY - triangleHeight;

    console.log(
      `【デバッグ】三角形座標: 底辺左(${bottomLeftX},${bottomLeftY}), 底辺右(${bottomRightX},${bottomRightY}), 頂点(${topX},${topY})`
    );

    // 先ほど上部ですでに座標設定済み

    // 三角形を描画
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(bottomLeftX, bottomLeftY);
    ctx.lineTo(bottomRightX, bottomRightY);
    ctx.closePath();

    // 三角形の塗りつぶし
    const triangleGradient = ctx.createLinearGradient(
      bottomLeftX,
      bottomLeftY,
      bottomRightX,
      topY
    );
    triangleGradient.addColorStop(0, "rgba(100, 180, 255, 0.7)");
    triangleGradient.addColorStop(1, "rgba(0, 120, 215, 0.7)");
    ctx.fillStyle = triangleGradient;
    ctx.fill();

    // 三角形の枠線
    ctx.strokeStyle = "rgba(0, 80, 180, 0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 長方形の空白部分（点滅エフェクト用）を描画
    // 状態変数isBlinkingを使用
    console.log(
      `【デバッグ】点滅エフェクト: 現在の状態 isBlinking=${isBlinking}`
    );

    if (isBlinking) {
      // 頂点位置に応じて異なる空白部分を描画
      if (vertexPosition === "center") {
        // 中央の場合は左右の空白部分を描画
        const leftTriangle = {
          points: [
            { x: bottomLeftX, y: bottomLeftY },
            { x: topX, y: topY },
            { x: bottomLeftX, y: topY },
          ],
        };

        const rightTriangle = {
          points: [
            { x: topX, y: topY },
            { x: bottomRightX, y: bottomRightY },
            { x: bottomRightX, y: topY },
          ],
        };

        // 左の空白三角形
        ctx.beginPath();
        ctx.moveTo(leftTriangle.points[0].x, leftTriangle.points[0].y);
        ctx.lineTo(leftTriangle.points[1].x, leftTriangle.points[1].y);
        ctx.lineTo(leftTriangle.points[2].x, leftTriangle.points[2].y);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 100, 100, 0.5)";
        ctx.fill();

        // 右の空白三角形
        ctx.beginPath();
        ctx.moveTo(rightTriangle.points[0].x, rightTriangle.points[0].y);
        ctx.lineTo(rightTriangle.points[1].x, rightTriangle.points[1].y);
        ctx.lineTo(rightTriangle.points[2].x, rightTriangle.points[2].y);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 100, 100, 0.5)";
        ctx.fill();
      } else if (vertexPosition === "left") {
        // 左端の場合は右側の空白部分を描画
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(bottomRightX, bottomRightY);
        ctx.lineTo(bottomRightX, topY);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 100, 100, 0.5)";
        ctx.fill();
      } else if (vertexPosition === "right") {
        // 右端の場合は左側の空白部分を描画
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(bottomLeftX, bottomLeftY);
        ctx.lineTo(bottomLeftX, topY);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 100, 100, 0.5)";
        ctx.fill();
      }
    }

    // コンソールにデバッグ情報を出力
    console.log(
      `【デバッグ】三角形描画: 底辺=${base}, 高さ=${height}, 頂点位置=${vertexPosition}`
    );
  }, [base, height, vertexPosition, isBlinking]); // base, height, vertexPosition, isBlinkingは全て描画に必要

  // コンポーネントがマウントされたときにコンテキストを初期化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext("2d");
      // 初回描画
      drawTriangle();
    }
  }, [drawTriangle]); // drawTriangleを依存配列に追加

  // isBlinkingが変わったときに再描画を実行
  useEffect(() => {
    // 点滅状態が変わったときに再描画
    console.log(
      `【点滅再描画】isBlinkingが変化したため再描画実行: ${isBlinking}`
    );
    drawTriangle();
  }, [isBlinking, drawTriangle]); // isBlinkingがstateなので依存配列に追加

  // 点滅タイマーを設定
  useEffect(() => {
    // タイマーを設定（500ミリ秒間隔で点滅）
    timerRef.current = setInterval(() => {
      setIsBlinking((prev) => {
        console.log(`【点滅タイマー】状態変更: isBlinking=${!prev}`);
        return !prev; // 前の状態を反転
      });
    }, 500);

    // クリーンアップ関数
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []); // マウント時に一度だけ実行

  // 底辺または高さが変更されたときに面積を再計算
  useEffect(() => {
    setArea((base * height) / 2);
  }, [base, height]);

  // 底辺スライダーの値変更ハンドラー
  const handleBaseChange = (event) => {
    // eventがNumberの場合もあるので、両方対応する
    const newValue =
      typeof event === "object" ? Number(event.target.value) : Number(event);
    setBase(newValue);
    console.log(`TriangleAreaTab: Base changed to ${newValue}`);
  };

  // 底辺増減のハンドラー
  const handleBaseIncrease = () => {
    if (base < maxValue) {
      const newValue = base + 1;
      setBase(newValue);
      console.log(`TriangleAreaTab: Base increased to ${newValue}`);
    }
  };

  const handleBaseDecrease = () => {
    if (base > 1) {
      const newValue = base - 1;
      setBase(newValue);
      console.log(`TriangleAreaTab: Base decreased to ${newValue}`);
    }
  };

  // 高さスライダーの値変更ハンドラー
  const handleHeightChange = (event) => {
    // eventがNumberの場合もあるので、両方対応する
    const newValue =
      typeof event === "object" ? Number(event.target.value) : Number(event);
    setHeight(newValue);
    console.log(`TriangleAreaTab: Height changed to ${newValue}`);
  };

  // 高さ増減のハンドラー
  const handleHeightIncrease = () => {
    if (height < maxValue) {
      const newValue = height + 1;
      setHeight(newValue);
      console.log(`TriangleAreaTab: Height increased to ${newValue}`);
    }
  };

  const handleHeightDecrease = () => {
    if (height > 1) {
      const newValue = height - 1;
      setHeight(newValue);
      console.log(`TriangleAreaTab: Height decreased to ${newValue}`);
    }
  };

  // 頂点位置変更のハンドラー
  const handleVertexPositionChange = (event) => {
    const newPosition = event.target.value;
    setVertexPosition(newPosition);
    console.log(`TriangleAreaTab: Vertex position changed to ${newPosition}`);
  };

  return (
    <div
      className="triangle-area-tab-container"
      data-testid="triangle-area-tab-container"
    >
      {/* Main container */}
      <div className="triangle-and-controls">
        {/* ラジオボタンを最初に配置 */}
        <div
          className="vertex-position-controls"
          data-testid="vertex-position-controls"
          style={{
            marginBottom: "15px",
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <label className="radio-label" style={{ fontSize: "1.2rem" }}>
            <input
              type="radio"
              name="vertexPosition"
              value="left"
              checked={vertexPosition === "left"}
              onChange={handleVertexPositionChange}
              data-testid="vertex-position-left"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
                cursor: "pointer",
              }}
            />
            左端
          </label>
          <label className="radio-label" style={{ fontSize: "1.2rem" }}>
            <input
              type="radio"
              name="vertexPosition"
              value="center"
              checked={vertexPosition === "center"}
              onChange={handleVertexPositionChange}
              data-testid="vertex-position-center"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
                cursor: "pointer",
              }}
            />
            中央
          </label>
          <label className="radio-label" style={{ fontSize: "1.2rem" }}>
            <input
              type="radio"
              name="vertexPosition"
              value="right"
              checked={vertexPosition === "right"}
              onChange={handleVertexPositionChange}
              data-testid="vertex-position-right"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
                cursor: "pointer",
              }}
            />
            右端
          </label>
        </div>

        {/* Container for triangle and sliders */}
        <div
          className="triangle-display-area" // Class for triangle area
          style={{
            border: "1px solid #8B5A2B", // 茶色の框
            borderRadius: "8px", // 角丸
            marginBottom: "5px", // 下の余白
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 影
            display: "flex",
            justifyContent: "center", // 中央揃え
          }}
        >
          {/* 三角形表示エリア (Canvas を使用) */}
          <canvas
            ref={canvasRef}
            width="500"
            height="500"
            data-testid="triangle-canvas"
            style={{ border: "1px solid #ddd" }}
          />
        </div>

        {/* 式をスライダーの上に表示 */}
        <div
          className="result-area"
          style={{ marginTop: "2px", marginBottom: "2px", textAlign: "center" }}
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
            面積: ( {base} × {height} ) ÷ 2 = {area}
          </p>
        </div>

        <div className="slider-controls-container" style={{ marginTop: "0" }}>
          {/* Container for both sliders */}
          <div
            className="slider-control base-control"
            data-testid="base-control"
          >
            {/* 横方向（底辺）のスライダー */}
            <label htmlFor="base-slider" className="slider-label">
              底辺: {base}
            </label>{" "}
            <Slider
              id="base-slider"
              min={1}
              max={maxValue}
              value={base}
              onChange={handleBaseChange}
              onIncrease={handleBaseIncrease}
              onDecrease={handleBaseDecrease}
              data-testid="base-slider"
            />
          </div>
          <div
            className="slider-control height-control"
            data-testid="height-control"
          >
            {/* 縦方向（高さ）のスライダー */}
            <label htmlFor="height-slider" className="slider-label">
              高さ: {height}
            </label>{" "}
            <Slider
              id="height-slider"
              min={1}
              max={maxValue}
              value={height}
              onChange={handleHeightChange}
              onIncrease={handleHeightIncrease}
              onDecrease={handleHeightDecrease}
              data-testid="height-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriangleAreaTab;
