// EditAlarmModal.jsx
import { useState } from "react";

const EditAlarmModal = ({ alarm, onClose, onSave }) => {
  const [label, setLabel] = useState(alarm.label || "");
  const [time, setTime] = useState(
    new Date(alarm.time).toISOString().substring(0, 16)
  );
  const [sound, setSound] = useState(alarm.soundUrl || "");
  const [soundName, setSoundName] = useState(alarm.soundName || "");

  const handleSave = () => {
    const updatedAlarm = {
      ...alarm,
      label,
      time: new Date(time).toISOString(),
      soundUrl: sound,
      soundName,
    };
    onSave(updatedAlarm);
  };

  const handleSoundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSound(url);
      setSoundName(file.name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Edit Alarm</h2>
        <div className="mb-2">
          <label className="block mb-1">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Time</label>
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Sound</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleSoundChange}
            className="w-full"
          />
          {soundName && <p className="text-sm mt-1">🎵 {soundName}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-400 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAlarmModal;