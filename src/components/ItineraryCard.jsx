import { Camera, Map, TrainFront, Wallet } from 'lucide-react';

export default function ItineraryCard({ day }) {
  return (
    <article className="card flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-coral">{day.day}</p>
          <h3 className="mt-1 text-xl font-black text-ink">{day.title}</h3>
        </div>
        <span className="rounded-full bg-sand px-3 py-1 text-xs font-bold text-ink">{day.city}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {day.spots.map((spot) => (
          <span key={spot} className="rounded-full bg-coast-50 px-3 py-1 text-xs font-semibold text-coast-700">
            {spot}
          </span>
        ))}
      </div>

      <ul className="mt-5 space-y-3 text-sm leading-6 text-ink/75">
        {day.plan.map((item) => (
          <li key={item} className="flex gap-2">
            <Map className="mt-1 h-4 w-4 flex-none text-coast-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto space-y-3 pt-5 text-sm">
        <p className="info-line">
          <TrainFront className="h-4 w-4" />
          {day.transport}
        </p>
        <p className="info-line">
          <Wallet className="h-4 w-4" />
          {day.budget}
        </p>
        <p className="info-line">
          <Camera className="h-4 w-4" />
          {day.photo}
        </p>
      </div>
    </article>
  );
}
