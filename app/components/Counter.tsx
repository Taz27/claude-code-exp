"use client";

import { useState, useEffect } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 sm:items-start">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">Counter</span>
      <span className="text-5xl font-bold tabular-nums text-black dark:text-zinc-50">
        {count}
      </span>
    </div>
  );
}
