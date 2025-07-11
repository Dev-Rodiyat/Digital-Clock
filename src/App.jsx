import { useState } from "react";
import Clock from "./Components/Clock";
import Stopwatch from "./Components/Stopwatch";
import Timer from "./Components/Timer";
import Alarm from "./Components/Alarm";
import { FaBars, FaTimes } from "react-icons/fa";

function App() {
  const [view, setView] = useState("clock");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (view) {
      case "clock":
        return <Clock />;
      case "stopwatch":
        return <Stopwatch />;
      case "timer":
        return <Timer />;
      case "alarm":
        return <Alarm />;
      default:
        return null;
    }
  };

  return (
    <div className="relative h-screen font-sans bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300 overflow-hidden">
      <div
        className={`fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out 
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      w-64 bg-blue-100 dark:bg-blue-950 shadow-md border-r border-blue-200 dark:border-blue-800 p-4 flex flex-col`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="mb-6 text-gray-900 dark:text-white self-end hover:text-blue-700 dark:hover:text-blue-300 transition"
        >
          <FaTimes size={20} />
        </button>

        <nav className="flex flex-col gap-3 mt-2">
          {["clock", "stopwatch", "timer", "alarm"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setView(tab);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xl font-medium capitalize transition-all duration-200
            ${view === tab
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-800 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-800"
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow hover:bg-blue-100 dark:hover:bg-blue-700 transition"
      >
        <FaBars size={20} className="text-gray-800 dark:text-white" />
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="relative z-10 h-full overflow-auto p-6 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {renderComponent()}
      </main>
    </div>
  );
}

export default App;
