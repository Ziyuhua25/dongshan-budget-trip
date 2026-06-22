import { CalendarDays } from 'lucide-react';
import ItineraryCard from './ItineraryCard';
import { routes } from '../data/itinerary';

export default function RouteOverview({ activeRoute, onRouteChange }) {
  const route = routes[activeRoute];

  return (
    <section id="itinerary" className="section-wrap">
      <div className="section-heading">
        <p className="eyebrow">Route Overview</p>
        <h2>行程总览</h2>
        <p>两套路线都围绕厦门进出、东山岛深度玩，区别在于节奏和留给厦门咖啡店的时间。</p>
      </div>

      <div className="mb-7 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onRouteChange('five')}
          className={activeRoute === 'five' ? 'btn-primary' : 'btn-muted'}
        >
          <CalendarDays className="h-4 w-4" />
          查看 5 天舒适版
        </button>
        <button
          type="button"
          onClick={() => onRouteChange('four')}
          className={activeRoute === 'four' ? 'btn-primary' : 'btn-muted'}
        >
          <CalendarDays className="h-4 w-4" />
          查看 4 天压缩版
        </button>
      </div>

      <div className="mb-7 border-l-4 border-coast-500 bg-coast-50 p-4 text-ink">
        <strong>{route.label}</strong>
        <span className="ml-2 text-ink/70">{route.summary}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {route.days.map((day) => (
          <ItineraryCard key={`${route.label}-${day.day}`} day={day} />
        ))}
      </div>
    </section>
  );
}
