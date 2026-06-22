import { Check, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { checklistItems } from '../data/itinerary';
import { tips } from '../data/tips';

const storageKey = 'dongshan-xiamen-checklist';

export default function Tips() {
  const [checked, setChecked] = useState({});

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setChecked(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked]);

  function toggleItem(item) {
    setChecked((current) => ({ ...current, [item]: !current[item] }));
  }

  return (
    <section id="tips" className="section-wrap bg-white">
      <div className="section-heading">
        <p className="eyebrow">Tips & Checklist</p>
        <h2>避坑提醒和打包清单</h2>
        <p>海岛旅行最怕晒、雨、潮汐和返程时间卡太紧，这几项提前看，体验会舒服很多。</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="card">
          <div className="mb-4 flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-coral" />
            <h3 className="text-xl font-black text-ink">避坑提醒</h3>
          </div>
          <ol className="space-y-3 text-ink/80">
            {tips.map((tip, index) => (
              <li key={tip} className="flex gap-3 leading-7">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-coast-50 text-sm font-black text-coast-700">
                  {index + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center gap-3">
            <Check className="h-6 w-6 text-coast-500" />
            <h3 className="text-xl font-black text-ink">打包清单</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {checklistItems.map((item) => (
              <label key={item} className="flex cursor-pointer items-center gap-3 border border-coast-100 bg-white px-3 py-3 text-sm font-bold text-ink transition hover:border-coast-500 hover:bg-coast-50">
                <input
                  type="checkbox"
                  checked={Boolean(checked[item])}
                  onChange={() => toggleItem(item)}
                  className="h-5 w-5 accent-coast-500"
                />
                <span className={checked[item] ? 'text-ink/50 line-through' : ''}>{item}</span>
              </label>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/60">勾选状态会自动保存在当前浏览器，下次打开还能继续用。</p>
        </div>
      </div>
    </section>
  );
}
