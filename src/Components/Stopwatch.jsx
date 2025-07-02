
import { useState, useRef } from "react";

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(Math.floor(milliseconds / 10)).padStart(2, "0")}`;
};

const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsed;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 10);
  };

  const stop = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const reset = () => {
    stop();
    setElapsed(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="text-6xl font-mono mb-6">
        {formatTime(elapsed)}
      </div>
      <div className="flex gap-4">
        <button
          onClick={isRunning ? stop : start}
          className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white transition"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;