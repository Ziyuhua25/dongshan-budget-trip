import { Camera } from 'lucide-react';
import { photoSpots } from '../data/tips';

export default function PhotoSpots() {
  return (
    <section id="photos" className="section-wrap">
      <div className="section-heading">
        <p className="eyebrow">Photo Spots</p>
        <h2>拍照打卡点</h2>
        <p>把景点按时间和关键词记下来，到现场就不用临时翻攻略。</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photoSpots.map((spot) => (
          <article key={spot.name} className="card">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-ink">{spot.name}</h3>
              <Camera className="h-5 w-5 text-coral" />
            </div>
            <dl className="mt-4 space-y-3 text-sm leading-6">
              <div>
                <dt className="font-black text-coast-700">适合时间</dt>
                <dd className="text-ink/75">{spot.time}</dd>
              </div>
              <div>
                <dt className="font-black text-coast-700">关键词</dt>
                <dd className="text-ink/75">{spot.keywords}</dd>
              </div>
              <div>
                <dt className="font-black text-coast-700">注意</dt>
                <dd className="text-ink/75">{spot.note}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
