import { useEffect, useRef, useState } from "react";

function Timer() {
  const [input, setInput] = useState('');
  const [label, setLabel] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setIsComplete(true);

      if (audioRef.current) audioRef.current.play();
      if (navigator.vibrate) navigator.vibrate([300, 100, 300]);

      setTimeout(() => setIsComplete(false), 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, seconds]);

  const startTimer = () => {
    const sec = parseInt(input, 10);
    if (!isNaN(sec) && sec > 0) {
      setSeconds(sec);
      setIsRunning(true);
      setIsComplete(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
    setInput('');
    setLabel('');
    setIsComplete(false);
  };

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-center relative">
        {/* <audio ref={audioRef} src="https://www.soundjay.com/buttons/sounds/beep-07.mp3" preload="auto" /> */}
        {/* <audio ref={audioRef} src="https://www.soundjay.com/button/beep-2.mp3" preload="auto" /> */}
        {/* <audio ref={audioRef}
          src="https://cdn.pixabay.com/download/sounds/beep-07.mp3?filename=beep-07"
          preload="auto" /> */}
        <audio ref={audioRef}
          src="https://www.soundjay.com/button/beep-1.mp3"
          preload="auto" />

        <div className="text-5xl font-mono mb-2">{formatTime(seconds)}</div>
        {label && <div className="mb-4 text-xl text-gray-300 italic">Timer: {label}</div>}

        {isComplete && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white text-black text-2xl font-bold px-8 py-6 rounded-lg shadow-lg animate-bounce">
              ⏳ Time's up!
            </div>
          </div>
        )}

        <input
          type="text"
          placeholder="Timer name (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="px-4 py-2 rounded text-black mb-2"
          disabled={isRunning}
        />

        <input
          type="number"
          placeholder="Seconds"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-4 py-2 rounded text-black mb-4 block mx-auto"
          disabled={isRunning}
        />

        <div className="space-x-4">
          <button onClick={startTimer} className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">Start</button>
          <button onClick={resetTimer} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">Reset</button>
        </div>
      </div>
    </div>
  );
}

export default Timer;