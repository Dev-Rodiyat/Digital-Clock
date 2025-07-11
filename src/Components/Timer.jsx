import { useState, useEffect, useRef } from "react";

import sound1 from './../assets/def1.mp3';
import sound2 from './../assets/def2.mp3';
import sound3 from './../assets/def3.mp3';

const defaultSound = [
  { name: "Classic Beep", url: sound1 },
  { name: "Digital Alarm", url: sound2 },
  { name: "Soft Chime", url: sound3 },
];

const Timer = () => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerName, setTimerName] = useState("");
  const [customAudio, setCustomAudio] = useState(null);
  const [selectedDefaultSound, setSelectedDefaultSound] = useState(null);
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
    setIsSoundPlaying(false);

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
    handleStopSound();
  };

  const handleSoundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const soundURL = URL.createObjectURL(file);
      setCustomAudio(soundURL);
      setSelectedDefaultSound(null);
    }
  };

  const handleTimerComplete = () => {
    const soundToPlay = customAudio || selectedDefaultSound;

    if (soundToPlay && audioRef.current) {
      audioRef.current.src = soundToPlay;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
      setIsSoundPlaying(true);
    }

    if (navigator.vibrate) {
      navigator.vibrate([500, 300, 500]);
    }

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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 max-[400px]:px-2 max-[400px]:py-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 max-[400px]:p-5 rounded-2xl shadow-md w-full max-w-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl max-[400px]:text-3xl font-bold mb-8 text-center">⏳ Timer</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Name your timer"
            value={timerName}
            onChange={(e) => setTimerName(e.target.value)}
            className="w-full px-4 py-3 max-[400px]:px-2 max-[400px]:py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-center bg-gray-50 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-xs mx-auto">
          {[hours, minutes, seconds].map((val, i) => (
            <input
              key={i}
              type="number"
              min="0"
              placeholder={["HH", "MM", "SS"][i]}
              value={val}
              onChange={(e) => [setHours, setMinutes, setSeconds][i](e.target.value)}
              className="px-3 py-2 max-[400px]:px-2 max-[400px]:py-1 text-center rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          ))}
        </div>

        <div className="text-5xl sm:text-6xl max-[400px]:text-4xl font-mono font-semibold mb-8 text-center">
          {formatTime(remaining)}
        </div>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-6 py-2.5 max-[400px]:px-4 max-[400px]:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-sm sm:text-base transition"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-6 py-2.5 max-[400px]:px-4 max-[400px]:py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white font-semibold text-sm sm:text-base transition"
            >
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-6 py-2.5 max-[400px]:px-4 max-[400px]:py-2 rounded-xl bg-red-500 hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500 text-white font-semibold text-sm sm:text-base transition"
          >
            Reset
          </button>
        </div>

        {isSoundPlaying && (
          <button
            onClick={handleStopSound}
            className="w-full mb-6 px-5 py-2.5 max-[400px]:py-2 rounded-xl bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 text-white font-medium text-sm sm:text-base transition"
          >
            Stop Sound
          </button>
        )}

        <hr className="border-gray-300 dark:border-gray-600 my-6" />

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">🎵 Choose a Default Sound</label>
          <select
            value={selectedDefaultSound || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setSelectedDefaultSound(null);
              } else {
                setSelectedDefaultSound(value);
                setCustomAudio(null);
              }
            }}
            className="w-full p-3 max-[400px]:p-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">-- None --</option>
            {defaultSound.map((sound, index) => (
              <option key={index} value={sound.url}>
                {sound.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">🔊 Upload Custom Sound</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleSoundUpload}
            className="block w-full text-sm text-black dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
          />
        </div>

        {(customAudio || selectedDefaultSound) && (
          <p className="mt-2 text-sm text-center text-green-600 dark:text-green-400">
            Selected sound:{" "}
            {customAudio
              ? "Custom Upload"
              : "Default - " + defaultSound.find((s) => s.url === selectedDefaultSound)?.name}
          </p>
        )}

        <audio ref={audioRef} />
      </div>
    </div>
  );
};

export default Timer;
