import Image from "next/image";
import Counter from "./components/Counter";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-8 bg-white dark:bg-black px-16 py-16 text-center rounded-2xl shadow-sm">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Taz&apos;s first app using Claude Code.
        </h1>
        <Counter />
      </main>
    </div>
  );
}
