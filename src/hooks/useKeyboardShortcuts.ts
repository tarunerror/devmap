"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

export interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: "navigation" | "actions" | "view";
}

export const useKeyboardShortcuts = (customShortcuts?: Shortcut[]) => {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  const defaultShortcuts: Shortcut[] = [
    {
      key: "/",
      description: "Focus search",
      action: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      category: "navigation",
    },
    {
      key: "g h",
      description: "Go home",
      action: () => router.push("/"),
      category: "navigation",
    },
    {
      key: "g s",
      description: "Go to stats",
      action: () => router.push("/stats"),
      category: "navigation",
    },
    {
      key: "d",
      description: "Toggle dark mode",
      action: () => {
        const darkModeButton = document.querySelector('[aria-label="Toggle dark mode"]') as HTMLButtonElement;
        if (darkModeButton) {
          darkModeButton.click();
        }
      },
      category: "view",
    },
    {
      key: "?",
      description: "Show keyboard shortcuts",
      action: () => setShowHelp((prev) => !prev),
      category: "view",
    },
    {
      key: "Escape",
      description: "Close modal / Go back",
      action: () => {
        setShowHelp(false);
        // Also close any open dropdowns
        document.body.click();
      },
      category: "actions",
    },
  ];

  const shortcuts = [...defaultShortcuts, ...(customShortcuts || [])];
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Allow Escape to blur inputs
        if (event.key === "Escape") {
          target.blur();
        }
        return;
      }

      // Handle multi-key shortcuts (e.g., "g h")
      const currentKey = event.key.toLowerCase();

      if (pendingKey) {
        const combo = `${pendingKey} ${currentKey}`;
        const shortcut = shortcuts.find((s) => s.key.toLowerCase() === combo);
        if (shortcut) {
          event.preventDefault();
          shortcut.action();
        }
        setPendingKey(null);
        return;
      }

      // Check for single key shortcuts
      const singleShortcut = shortcuts.find((s) => {
        const keyLower = s.key.toLowerCase();
        // Single key match
        if (keyLower === currentKey) return true;
        // Handle ? key which needs shift
        if (s.key === "?" && event.shiftKey && currentKey === "/") return true;
        return false;
      });

      if (singleShortcut) {
        // Check if this could be the start of a multi-key combo
        const hasMultiKeyShortcut = shortcuts.some((s) =>
          s.key.toLowerCase().startsWith(`${currentKey} `)
        );

        if (hasMultiKeyShortcut) {
          setPendingKey(currentKey);
          // Clear pending key after 1 second
          setTimeout(() => setPendingKey(null), 1000);
        } else {
          event.preventDefault();
          singleShortcut.action();
        }
        return;
      }

      // Check if this could be the start of a multi-key combo
      const hasMultiKeyShortcut = shortcuts.some((s) =>
        s.key.toLowerCase().startsWith(`${currentKey} `)
      );

      if (hasMultiKeyShortcut) {
        setPendingKey(currentKey);
        setTimeout(() => setPendingKey(null), 1000);
      }
    },
    [shortcuts, pendingKey, router]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts,
    showHelp,
    setShowHelp,
    pendingKey,
  };
};

export default useKeyboardShortcuts;
