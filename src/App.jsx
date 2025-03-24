import { useState } from "react";
import "./App.css";
import Tab from "./components/UI/Tab";
import Slider from "./components/UI/Slider";
import Button from "./components/UI/Button";

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

  const handleSliderIncrease = () => {
    if (parseInt(sliderValue, 10) < 100) {
      setSliderValue(String(parseInt(sliderValue, 10) + 1));
    }
  };

  const handleSliderDecrease = () => {
    if (parseInt(sliderValue, 10) > 0) {
      setSliderValue(String(parseInt(sliderValue, 10) - 1));
    }
  };

  return (
    <>
      <div>
        <Tab active={activeTab === 0} onClick={() => setActiveTab(0)}>
          Tab 1
        </Tab>
        <Tab active={activeTab === 1} onClick={() => setActiveTab(1)}>
          Tab 2
        </Tab>
      </div>
      {activeTab === 0 && (
        <>
          <Slider
            min={0}
            max={100}
            value={sliderValue}
            onChange={handleSliderChange}
            onIncrease={handleSliderIncrease}
            onDecrease={handleSliderDecrease}
          />
          <p>Slider Value: {sliderValue}</p>
          <Button onClick={() => alert("Button Clicked!")}>Click Me</Button>
        </>
      )}
      {activeTab === 1 && <p>Tab 2 Content</p>}
    </>
  );
}

export default App;
