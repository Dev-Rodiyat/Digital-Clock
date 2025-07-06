import { useState, useEffect, useRef } from "react";

const Timer = () => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerName, setTimerName] = useState("");
  const [customAudio, setCustomAudio] = useState(null);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (remaining <= 0 && isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      handleTimerComplete();
    }
  }, [remaining, isRunning]);

  const handleStart = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalMs = (h * 3600 + m * 60 + s) * 1000;

    if (totalMs <= 0) {
      alert("Please enter a valid time.");
      return;
    }

    setRemaining(totalMs);
    setIsRunning(true);
    setIsSoundPlaying(false); // reset sound state

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => prev - 1000);
    }, 1000);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setRemaining(0);
    setIsRunning(false);
    setHours("");
    setMinutes("");
    setSeconds("");
    handleStopSound(); // also stop sound if playing
  };

  const handleSoundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const soundURL = URL.createObjectURL(file);
      setCustomAudio(soundURL);
    }
  };

  const handleTimerComplete = () => {
    if (customAudio && audioRef.current) {
      audioRef.current.src = customAudio;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
      setIsSoundPlaying(true);
    }

    if (navigator.vibrate) {
      navigator.vibrate([500, 300, 500]);
    }

    // Allow sound to play a bit before alert
    setTimeout(() => {
      alert(`⏰ "${timerName || "Timer"}" completed!`);
    }, 300);
  };

  const handleStopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSoundPlaying(false);
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="bg-gray-100 dark:bg-gray-800 p-12 rounded-2xl shadow-md">
        <h1 className="text-4xl font-bold mb-6 text-center">⏳ Timer</h1>

        <input
          type="text"
          placeholder="Name your timer"
          value={timerName}
          onChange={(e) => setTimerName(e.target.value)}
          className="mb-6 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 w-full max-w-sm text-center bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <div className="flex flex-wrap justify-center gap-3 mb-6 w-full max-w-sm">
          <input
            type="number"
            min="0"
            placeholder="HH"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-24 px-3 py-2 text-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="number"
            min="0"
            placeholder="MM"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-24 px-3 py-2 text-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="number"
            min="0"
            placeholder="SS"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            className="w-24 px-3 py-2 text-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="text-5xl sm:text-6xl font-mono font-semibold mb-6 text-center">
          {formatTime(remaining)}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition"
            >
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition"
          >
            Reset
          </button>
        </div>

        {isSoundPlaying && (
          <button
            onClick={handleStopSound}
            className="mb-6 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition"
          >
            Stop Sound
          </button>
        )}

        <div className="w-full max-w-sm">
          <label className="block mb-2 text-sm font-medium">🔊 Upload Custom Sound</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleSoundUpload}
            className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
          />
        </div>

        <audio ref={audioRef} />
      </div>
    </div>
  );
};

export default Timer;