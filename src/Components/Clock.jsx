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

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const isAM = hours < 12;
    let suffix = "";

    if (!is24Hour) {
      suffix = isAM ? "AM" : "PM";
      hours = hours % 12 || 12;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} ${suffix}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="text-6xl font-mono mb-2">
        {formatTime(time)}
      </div>
      <div className="text-xl mb-6">
        {formatDate(time)}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          Toggle {is24Hour ? "12" : "24"}-Hour
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
};

export default Clock;