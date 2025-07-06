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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 px-4">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono mb-6 text-center">
        {formatTime(elapsed)}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
        <button
          onClick={isRunning ? stop : start}
          className="w-full sm:w-auto px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="w-full sm:w-auto px-5 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;