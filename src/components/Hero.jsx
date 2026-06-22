import { MapPin, Plane, WalletCards } from 'lucide-react';
import { routeLine, tags } from '../data/itinerary';

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[88vh] overflow-hidden bg-ink text-white">
      <img
        src="./images/hero-dongshan-xiamen.png"
        alt="东山岛与厦门海岸旅行氛围图"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-coast-700/20" />
      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
            <MapPin className="h-4 w-4" />
            东山岛 + 厦门穷游攻略
          </p>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl">
            沈阳出发｜东山岛 + 厦门 4–5 天穷游攻略
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
            学生党预算版海岛旅行路线：沈阳 → 厦门 → 东山岛 → 厦门 → 沈阳
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm backdrop-blur">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-8 max-w-2xl border-l-4 border-coral bg-white/20 p-5 text-lg font-semibold shadow-soft backdrop-blur">
            <div className="flex items-start gap-3">
              <Plane className="mt-1 h-5 w-5 flex-none text-coral" />
              <span>{routeLine}</span>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#itinerary" className="btn-primary">
              <MapPin className="h-4 w-4" />
              看行程
            </a>
            <a href="#budget" className="btn-secondary text-white">
              <WalletCards className="h-4 w-4" />
              算预算
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
