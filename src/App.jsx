import { useState } from "react";
import Clock from "./Components/Clock";
import Stopwatch from "./Components/Stopwatch";
import Timer from "./Components/Timer";

function App() {
  const [view, setView] = useState("clock");

  return (
    <div>
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button
          onClick={() => setView("clock")}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Clock
        </button>
        <button
          onClick={() => setView("stopwatch")}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Stopwatch
        </button>
        <button
          onClick={() => setView("timer")}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Timer
        </button>
      </div>
      {view === "clock" && <Clock />}
      {view === "stopwatch" && <Stopwatch />}
      {view === "timer" && <Timer />}
    </div>
  );
}

export default App;