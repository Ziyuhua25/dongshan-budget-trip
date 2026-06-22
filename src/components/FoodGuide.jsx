import { Coffee, Soup, Utensils } from 'lucide-react';
import { foodGuide } from '../data/itinerary';

export default function FoodGuide() {
  return (
    <section id="food" className="section-wrap bg-white">
      <div className="section-heading">
        <p className="eyebrow">Food Guide</p>
        <h2>吃饭安排</h2>
        <p>穷游不是不吃好，而是把钱花在最想吃的一两顿上，其他时候用本地小吃和简餐稳住预算。</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FoodColumn icon={Coffee} title="厦门" items={foodGuide.xiamen} />
        <FoodColumn icon={Utensils} title="东山岛" items={foodGuide.dongshan} />
        <FoodColumn icon={Soup} title="穷游推荐" items={foodGuide.budget} accent />
      </div>
    </section>
  );
}

function FoodColumn({ icon: Icon, title, items, accent = false }) {
  return (
    <article className={accent ? 'card bg-sand' : 'card'}>
      <Icon className={accent ? 'h-7 w-7 text-coral' : 'h-7 w-7 text-coast-500'} />
      <h3 className="mt-3 text-xl font-black text-ink">{title}</h3>
      <ul className="mt-4 space-y-3 leading-7 text-ink/75">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
