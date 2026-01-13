"use client";

import React, { useState, useRef, useEffect } from "react";

const NoteButton = ({
  note,
  onSave,
}: {
  note: string;
  onSave: (note: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localNote, setLocalNote] = useState(note);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave(localNote);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const hasNote = note.trim().length > 0;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`p-1.5 rounded-lg transition-all duration-300 ${
          hasNote
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500"
        }`}
        aria-label={hasNote ? "Edit note" : "Add note"}
      >
        <svg
          className="w-4 h-4"
          fill={hasNote ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Your Note
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {localNote.length}/200
                </span>
              </div>
              <textarea
                ref={textareaRef}
                value={localNote}
                onChange={(e) => setLocalNote(e.target.value.slice(0, 200))}
                onKeyDown={handleKeyDown}
                placeholder="Add your personal note here..."
                className="w-full h-28 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => {
                    setLocalNote(note);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteButton;
