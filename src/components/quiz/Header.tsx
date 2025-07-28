"use client";

import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export function Header({ theme, setTheme }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-6 md:mb-8 pb-4 border-b-2 border-primary">
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 dark:to-purple-400 text-transparent bg-clip-text">
        QuizTime Ace
      </h1>
      <ThemeToggle theme={theme} setTheme={setTheme} />
    </header>
  );
}
