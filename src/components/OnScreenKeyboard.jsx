"use client";

export const OnScreenKeyboard = ({ onKeyPress, onBackspace, onEnter }) => {
  const keys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-2 border-t z-50">
      {keys.map((row, i) => (
        <div key={i} className="flex justify-center mb-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="m-1 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded shadow text-sm"
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-2 mt-2">
        <button
          onClick={onBackspace}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded"
        >
          ⌫ Backspace
        </button>
        <button
          onClick={onEnter}
          className="px-4 py-2 bg-green-100 hover:bg-green-200 rounded"
        >
          ↵ Enter
        </button>
      </div>
    </div>
  );
};
