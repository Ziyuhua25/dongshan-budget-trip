import { Github, Waves } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink px-5 py-10 text-white sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-lg font-black">
            <Waves className="h-5 w-5 text-coral" />
            Dongshan Island & Xiamen Budget Trip
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
            Open-source travel guide built for Dongshan Island & Xiamen budget trip.
            这是一个面向学生党穷游的东山岛 + 厦门旅行攻略网站，路线从沈阳出发，适合 4–5 天短途旅行。
          </p>
        </div>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 border border-white/20 px-4 py-3 text-sm font-bold transition hover:border-coral hover:bg-coral"
        >
          <Github className="h-4 w-4" />
          GitHub Pages Ready
        </a>
      </div>
    </footer>
  );
}
