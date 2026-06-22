import { useState } from 'react';
import BudgetTable from './components/BudgetTable';
import FoodGuide from './components/FoodGuide';
import Footer from './components/Footer';
import Hero from './components/Hero';
import PhotoSpots from './components/PhotoSpots';
import RouteOverview from './components/RouteOverview';
import SmartEditor from './components/SmartEditor';
import Tips from './components/Tips';
import TransportGuide from './components/TransportGuide';

const navItems = [
  ['行程', '#itinerary'],
  ['交通住宿', '#transport'],
  ['预算', '#budget'],
  ['吃饭', '#food'],
  ['拍照', '#photos'],
  ['清单', '#tips'],
];

export default function App() {
  const [activeRoute, setActiveRoute] = useState('five');

  return (
    <div className="min-h-screen bg-sand text-ink">
      <header className="fixed left-0 right-0 top-0 z-30 border-b border-white/20 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <a href="#top" className="text-sm font-black text-coast-700 sm:text-base">
            东山岛 + 厦门穷游攻略
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} className="nav-link">
                {label}
              </a>
            ))}
          </div>
          <a href="#budget" className="rounded-full bg-coral px-4 py-2 text-sm font-black text-white transition hover:bg-coast-700">
            预算计算
          </a>
        </nav>
      </header>

      <main>
        <Hero />
        <RouteOverview activeRoute={activeRoute} onRouteChange={setActiveRoute} />
        <TransportGuide />
        <BudgetTable />
        <FoodGuide />
        <PhotoSpots />
        <Tips />
      </main>

      <Footer />
      <SmartEditor />
    </div>
  );
}
