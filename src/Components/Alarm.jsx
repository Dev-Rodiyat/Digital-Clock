import { useEffect, useState, useRef } from "react";

import sound1 from './../assets/def1.mp3'
import sound2 from './../assets/def2.mp3'
import sound3 from './../assets/def3.mp3'

const defaultTones = [
    { name: "Classic Beep", url: { sound1 } },
    { name: "Digital Alarm", url: { sound2 } },
    { name: "Soft Chime", url: { sound3 } },
];

const getStoredAlarms = () => {
    try {
        return JSON.parse(localStorage.getItem("alarms")) || [];
    } catch {
        return [];
    }
};

const Alarm = () => {
    const [alarms, setAlarms] = useState(getStoredAlarms);
    const [time, setTime] = useState("");
    const [label, setLabel] = useState("");
    const [repeat, setRepeat] = useState("once");
    const [soundFile, setSoundFile] = useState(null);
    const [soundName, setSoundName] = useState("");
    const [useDefaultTone, setUseDefaultTone] = useState("");
    const [volume, setVolume] = useState(1); // 0 to 1
    const [showModal, setShowModal] = useState(false);
    const [activeAlarm, setActiveAlarm] = useState(null);
    const [playingSound, setPlayingSound] = useState(null);

    const audioRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("alarms", JSON.stringify(alarms));
    }, [alarms]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = now.toTimeString().slice(0, 5);
            const currentDay = now.getDay();

            setAlarms((prevAlarms) => {
                const updated = prevAlarms.map((alarm) => {
                    const shouldTrigger =
                        alarm.on &&
                        alarm.time === currentTime &&
                        !alarm.triggered &&
                        (
                            alarm.repeat === "daily" ||
                            (alarm.repeat === "weekdays" && currentDay >= 1 && currentDay <= 5) ||
                            (alarm.repeat === "once") ||
                            (Array.isArray(alarm.repeat) && alarm.repeat.includes(currentDay))
                        );

                    if (shouldTrigger) {
                        triggerAlarm(alarm);
                        return { ...alarm, triggered: true, on: alarm.repeat !== "once" };
                    }
                    return alarm;
                });

                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const triggerAlarm = (alarm) => {
        if (showModal) return;

        setActiveAlarm(alarm);
        setPlayingSound(alarm.soundFile);
        setShowModal(true);

        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.volume = volume;
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(console.error);
            }

            // 📱 Trigger Vibration (if supported)
            if (navigator.vibrate) {
                navigator.vibrate([500, 300, 500]);
            }
        }, 100);
    };

    const stopAlarm = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        navigator.vibrate?.(0); // stop vibration
        setPlayingSound(null);
        setShowModal(false);
        setActiveAlarm(null);
    };

    const snoozeAlarm = () => {
        if (!activeAlarm) return;
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5);
        const snoozedTime = now.toTimeString().slice(0, 5);

        const newAlarm = {
            ...activeAlarm,
            id: Date.now(),
            time: snoozedTime,
            triggered: false,
        };
        setAlarms((prev) => [...prev, newAlarm]);
        stopAlarm();
    };

    const addOrUpdateAlarm = (e) => {
        e.preventDefault();
        if (!time) return;

        let finalSound = null;
        let finalName = "";

        if (useDefaultTone) {
            const selected = defaultTones.find((tone) => tone.name === useDefaultTone);
            if (selected) {
                finalSound = selected.url;
                finalName = selected.name;
            }
        } else if (soundFile) {
            finalSound = soundFile;
            finalName = soundName;
        }

        const newAlarm = {
            id: Date.now(),
            time,
            label,
            repeat,
            soundFile: finalSound,
            soundName: finalName,
            on: true,
            triggered: false,
        };

        setAlarms((prev) => [...prev, newAlarm]);
        setTime("");
        setLabel("");
        setRepeat("once");
        setSoundFile(null);
        setSoundName("");
        setUseDefaultTone("");
    };

    const handleSoundUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSoundFile(url);
            setSoundName(file.name);
            setUseDefaultTone("");
        }
    };

    const toggleAlarm = (id) => {
        setAlarms((prev) =>
            prev.map((alarm) =>
                alarm.id === id ? { ...alarm, on: !alarm.on, triggered: false } : alarm
            )
        );
    };

    const deleteAlarm = (id) => {
        setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
    };

    const editAlarm = (alarm) => {
        setTime(alarm.time);
        setLabel(alarm.label);
        setRepeat(alarm.repeat);
        if (defaultTones.some(t => t.url === alarm.soundFile)) {
            setUseDefaultTone(alarm.soundName);
            setSoundFile(null);
            setSoundName("");
        } else {
            setUseDefaultTone("");
            setSoundFile(alarm.soundFile);
            setSoundName(alarm.soundName);
        }
        deleteAlarm(alarm.id);
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-900 text-black dark:text-white text-sm sm:text-base">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">⏰ Alarm</h1>

            <form
                onSubmit={addOrUpdateAlarm}
                className="flex flex-col gap-3 w-full max-w-md mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md"
            >
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="p-2 rounded border dark:bg-gray-800 w-full"
                />
                <input
                    type="text"
                    placeholder="Label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="p-2 rounded border dark:bg-gray-800 w-full"
                />
                <select
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value)}
                    className="p-2 rounded border dark:bg-gray-800 w-full"
                >
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays</option>
                </select>

                {/* <div>
                    <label className="block text-sm mb-1">Choose default tone:</label>
                    <select
                        value={useDefaultTone}
                        onChange={(e) => {
                            setUseDefaultTone(e.target.value);
                            setSoundFile(null);
                            setSoundName("");
                        }}
                        className="p-2 rounded border dark:bg-gray-800 w-full"
                    >
                        <option value="">-- None --</option>
                        {defaultTones.map((tone) => (
                            <option key={tone.name} value={tone.name}>
                                {tone.name}
                            </option>
                        ))}
                    </select>
                </div> */}

                <div>
                    <label className="block text-sm mb-1">Or upload custom sound:</label>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleSoundUpload}
                        className="p-2 rounded border dark:bg-gray-800 w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Volume</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center"
                >
                    Save Alarm
                </button>
            </form>

            {playingSound && <audio ref={audioRef} src={playingSound} />}

            <ul className="mt-8 space-y-4 w-full max-w-md mx-auto">
                {alarms.map((alarm) => (
                    <li
                        key={alarm.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border rounded dark:border-gray-700"
                    >
                        <div>
                            <div className="text-lg font-semibold">{alarm.time}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {alarm.label}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Sound: {alarm.soundName}
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-end">
                            <button
                                onClick={() => toggleAlarm(alarm.id)}
                                className={`px-3 py-1 rounded text-white ${alarm.on ? "bg-green-500" : "bg-gray-400"
                                    }`}
                            >
                                {alarm.on ? "On" : "Off"}
                            </button>
                            <button
                                onClick={() => editAlarm(alarm)}
                                className="px-3 py-1 rounded bg-yellow-500 text-white"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteAlarm(alarm.id)}
                                className="px-3 py-1 rounded bg-red-500 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl w-full max-w-sm text-center">
                        <h2 className="text-xl font-bold mb-4">
                            ⏰ {activeAlarm?.label || "Alarm!"}
                        </h2>
                        <p className="mb-4">It's {activeAlarm?.time}</p>
                        <div className="flex justify-center gap-2 flex-wrap">
                            <button
                                onClick={stopAlarm}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Stop
                            </button>
                            <button
                                onClick={snoozeAlarm}
                                className="px-4 py-2 bg-yellow-500 text-white rounded"
                            >
                                Snooze +5 min
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Alarm;