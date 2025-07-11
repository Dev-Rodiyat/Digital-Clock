import { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(() => {
    return localStorage.getItem("clockFormat") === "24";
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("clockFormat", is24Hour ? "24" : "12");
  }, [is24Hour]);

  const now = new Date();
  const secondAngle = now.getSeconds() * 6;
  const minuteAngle = now.getMinutes() * 6 + now.getSeconds() * 0.1;
  const hourAngle = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-900 text-black dark:text-white transition-colors duration-300 px-4">
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-[8px] border-gray-300 dark:border-gray-700 shadow-inner bg-white dark:bg-gray-800 flex items-center justify-center">
        <div className="absolute w-3 h-3 bg-black dark:bg-white rounded-full z-10" />

        <div
          className="absolute w-1 h-16 bg-black dark:bg-white origin-bottom"
          style={{
            transform: `rotate(${hourAngle}deg)`,
            bottom: '50%',
          }}
        />

        <div
          className="absolute w-1 h-24 bg-gray-700 dark:bg-gray-300 origin-bottom"
          style={{
            transform: `rotate(${minuteAngle}deg)`,
            bottom: '50%',
          }}
        />

        <div
          className="absolute w-0.5 h-28 bg-red-500 origin-bottom"
          style={{
            transform: `rotate(${secondAngle}deg)`,
            bottom: '50%',
          }}
        />

        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i + 1) * 30;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 42 * Math.sin(rad);
          const y = 50 - 42 * Math.cos(rad);
          return (
            <div
              key={i}
              className="absolute text-sm font-bold"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-4 flex-wrap justify-center">
        <div className="text-sm font-medium px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition">
          {new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>
    </div>
  );
};

export default Clock;