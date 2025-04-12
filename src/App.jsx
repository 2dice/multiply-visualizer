import { useState } from "react";
import "./App.css";
import Tab from "./components/UI/Tab";
// import Slider from "./components/UI/Slider"; // GridTab内で使用するため、ここでは不要
// import Button from "./components/UI/Button"; // GridTab内で使用するため、ここでは不要
import GridTab from "./components/GridTab"; // GridTabコンポーネントをインポート
import GridDecompositionTab from "./components/GridDecompositionTab"; // GridDecompositionTabコンポーネントをインポート

// 他のタブコンポーネントも将来的にインポートする
// import AreaTriangleTab from "./components/AreaTriangleTab";
// import TimeAndSpeedTab from "./components/TimeAndSpeedTab";

function App() {
  const [activeTab, setActiveTab] = useState(0); // 初期タブをグリッドタブに設定

  // design.md に基づくタブのリスト
  const tabs = [
    { id: 0, label: "グリッド", component: <GridTab /> },
    {
      id: 1,
      label: "グリッド分解",
      component: <GridDecompositionTab />,
    },
    {
      id: 2,
      label: "面積(三角形)",
      component: <p>面積(三角形)タブ Content (仮)</p>,
    }, // Step 8 で実装
    {
      id: 3,
      label: "時間と速度",
      component: <p>時間と速度タブ Content (仮)</p>,
    }, // Step 9 で実装
  ];

  return (
    <>
      <div className="tabs-container">
        {" "}
        {/* タブのスタイル用コンテナ */}
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
      </div>

      <div className="tab-content">
        {" "}
        {/* タブコンテンツのスタイル用コンテナ */}
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </>
  );
}

export default App;
