import { useState } from "react";
import Clock from "./Components/Clock";
import Stopwatch from "./Components/Stopwatch";
import Timer from "./Components/Timer";
import Alarm from "./Components/Alarm";

function App() {
  const [view, setView] = useState("clock");

  return (
    <div>
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        {["clock", "stopwatch", "timer", "alarm"].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`px-3 py-1 rounded transition font-medium
          ${view === tab
                ? "bg-blue-700 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {view === "clock" && <Clock />}
      {view === "stopwatch" && <Stopwatch />}
      {view === "timer" && <Timer />}
      {view === "alarm" && <Alarm />}
    </div>
  );
}

export default App;