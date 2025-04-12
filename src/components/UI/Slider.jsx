import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Slider.css";

/**
 * カスタムスライダーコンポーネント
 * ドラッグ問題を解決するために完全カスタム実装に変更
 */
const Slider = ({
  id,
  min = 1,
  max = 10,
  value,
  onChange,
  onIncrease,
  onDecrease,
  "data-testid": dataTestId,
  hideButtons = false, // ボタンを非表示にするオプションを追加
}) => {
  // DOM参照を保存するためのref
  const sliderTrackRef = useRef(null);
  const thumbRef = useRef(null);

  // ドラッグ状態を管理するステート
  const [isDragging, setIsDragging] = useState(false);

  // スライダーの値を計算する関数（useCallbackでメモ化）
  const calculateValue = useCallback(
    (clientX) => {
      if (!sliderTrackRef.current) return value;

      const trackRect = sliderTrackRef.current.getBoundingClientRect();
      const trackWidth = trackRect.width;
      const trackLeft = trackRect.left;

      // クリック位置から値を計算
      let percent = (clientX - trackLeft) / trackWidth;
      // 0から1の範囲に収める
      percent = Math.max(0, Math.min(1, percent));

      // 実際の値に変換
      const range = max - min;
      const newValue = Math.round(min + percent * range);

      return newValue;
    },
    [min, max, value, sliderTrackRef]
  );

  // スライダーの値を更新する関数（useCallbackでメモ化）
  const updateValue = useCallback(
    (newValue) => {
      if (onChange && newValue !== value) {
        console.log(`Slider(${id}) 値変更: ${newValue}`);
        // 値を更新するイベントを生成
        const event = { target: { value: newValue } };
        onChange(event);
      }
    },
    [onChange, value, id]
  );

  // トラック上でのクリックハンドラー
  const handleTrackClick = (e) => {
    // クリック位置から値を計算し更新
    const newValue = calculateValue(e.clientX);
    updateValue(newValue);
  };

  // スライダーのつまみ部分でのドラッグ開始ハンドラー
  const handleThumbMouseDown = (e) => {
    e.preventDefault(); // デフォルトの選択動作を防止
    setIsDragging(true);
    console.log(`Slider(${id}) ドラッグ開始`);

    // ドラッグ中であることを示すクラスを追加
    document.body.classList.add("slider-dragging");
  };

  // 全体の値を減らすボタンハンドラー
  const handleDecreaseClick = () => {
    console.log(`Slider(${id}) 値減少ボタンクリック`);

    // 現在値から1減らした新しい値を計算
    const newValue = Math.max(min, value - 1);

    // 値が変わった場合のみ更新
    if (newValue !== value) {
      if (onDecrease) {
        // 元のハンドラーがあれば呼び出す
        onDecrease();
      } else if (onChange) {
        // なければ直接値を更新
        updateValue(newValue);
      }
    }
  };

  // 全体の値を増やすボタンハンドラー
  const handleIncreaseClick = () => {
    console.log(`Slider(${id}) 値増加ボタンクリック`);

    // 現在値に1足した新しい値を計算
    const newValue = Math.min(max, value + 1);

    // 値が変わった場合のみ更新
    if (newValue !== value) {
      if (onIncrease) {
        // 元のハンドラーがあれば呼び出す
        onIncrease();
      } else if (onChange) {
        // なければ直接値を更新
        updateValue(newValue);
      }
    }
  };

  // グローバルのマウス移動ハンドラー（useCallbackでメモ化）
  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const newValue = calculateValue(e.clientX);
        console.log(
          `Slider(${id}) ドラッグ中: ${e.clientX}, 新値: ${newValue}`
        );
        updateValue(newValue);
      }
    },
    [isDragging, calculateValue, id, updateValue]
  );

  // ドラッグ終了ハンドラー（useCallbackでメモ化）
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      document.body.classList.remove("slider-dragging");
      console.log(`Slider(${id}) ドラッグ終了`);
    }
  }, [isDragging, id]);

  // スライダーの位置を計算する関数
  const calculateThumbPosition = () => {
    const range = max - min;
    const percent = (value - min) / range;
    // つまみの幅の半分（14px）を考慮して左にずらす
    return `calc(${percent * 100}% - 14px)`;
  };

  // グローバルイベントリスナーの追加と削除
  useEffect(() => {
    // マウスイベントリスナーをドキュメント全体に追加
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseUp);

    // クリーンアップ関数
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
      document.body.classList.remove("slider-dragging");
    };
  }, [handleMouseMove, handleMouseUp]);

  // カスタムスライダーをレンダリング
  return (
    <div className="slider-container" data-testid={dataTestId}>
      {!hideButtons && (
        <button
          className="slider-button slider-button-prev"
          onClick={handleDecreaseClick}
          aria-label="値を減らす"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z"
              fill="white"
            />
          </svg>
        </button>
      )}

      {/* カスタムスライダーのトラック領域 */}
      <div
        className="slider-track"
        ref={sliderTrackRef}
        onClick={handleTrackClick}
        data-testid={`${dataTestId}-input`}
        style={{ margin: hideButtons ? "0" : "0 15px" }} // ボタンが非表示の場合はマージンをなくす
      >
        {/* 現在値を示す塗りつぶし部分 */}
        <div
          className="slider-fill"
          style={{ width: calculateThumbPosition() }}
        />

        {/* ドラッグ可能なつまみ部分 */}
        <div
          className="slider-thumb"
          ref={thumbRef}
          style={{ left: calculateThumbPosition() }}
          onMouseDown={handleThumbMouseDown}
          onTouchStart={handleThumbMouseDown}
        >
          <span className="slider-value">{value}</span>
        </div>

        {/* 値を保持するための隠しinput要素（テスト用） */}
        <input
          id={id}
          type="hidden"
          value={value}
          data-testid={`${dataTestId}-hidden-input`}
        />
      </div>

      {!hideButtons && (
        <button
          className="slider-button slider-button-next"
          onClick={handleIncreaseClick}
          aria-label="値を増やす"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"
              fill="white"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Slider;
