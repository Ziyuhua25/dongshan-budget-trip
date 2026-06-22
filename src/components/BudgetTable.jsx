import { Calculator, WalletCards } from 'lucide-react';
import { useMemo, useState } from 'react';
import { budgetRows, defaultBudgetInputs } from '../data/budget';

const fields = [
  { key: 'flight', label: '机票价格', suffix: '元' },
  { key: 'hotelPerNight', label: '住宿每晚价格', suffix: '元' },
  { key: 'days', label: '旅行天数', suffix: '天' },
  { key: 'mealsPerDay', label: '每日餐饮预算', suffix: '元' },
  { key: 'localTransport', label: '岛内交通预算', suffix: '元' },
  { key: 'extras', label: '咖啡 / 门票 / 杂费', suffix: '元' },
];

export default function BudgetTable() {
  const [values, setValues] = useState(defaultBudgetInputs);

  const total = useMemo(() => {
    const nights = Math.max(Number(values.days) - 1, 0);
    return (
      Number(values.flight || 0) +
      Number(values.hotelPerNight || 0) * nights +
      Number(values.mealsPerDay || 0) * Number(values.days || 0) +
      Number(values.localTransport || 0) +
      Number(values.extras || 0)
    );
  }, [values]);

  function updateValue(key, nextValue) {
    setValues((current) => ({ ...current, [key]: nextValue }));
  }

  return (
    <section id="budget" className="section-wrap bg-white">
      <div className="section-heading">
        <p className="eyebrow">Budget</p>
        <h2>预算估算</h2>
        <p>预估总预算：¥2700–4600。真正穷游的关键不是少玩，而是控制机票、住宿和海鲜大排档消费。</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden border border-coast-100 bg-white shadow-soft">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead className="bg-coast-700 text-white">
              <tr>
                <th className="px-4 py-3">项目</th>
                <th className="px-4 py-3 text-right">低预算</th>
                <th className="px-4 py-3 text-right">正常预算</th>
              </tr>
            </thead>
            <tbody>
              {budgetRows.map((row) => (
                <tr key={row.item} className={row.total ? 'bg-sand font-black text-ink' : 'border-b border-coast-100'}>
                  <td className="px-4 py-3">{row.item}</td>
                  <td className="px-4 py-3 text-right">¥{row.low}</td>
                  <td className="px-4 py-3 text-right">¥{row.normal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-coral text-white">
              <Calculator className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-xl font-black text-ink">自定义预算计算器</h3>
              <p className="text-sm text-ink/60">按自己的机票和住宿改一下，马上看总价。</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className="text-sm font-bold text-ink/75">
                {field.label}
                <div className="mt-1 flex overflow-hidden border border-coast-100 bg-white">
                  <input
                    type="number"
                    min="0"
                    value={values[field.key]}
                    onChange={(event) => updateValue(field.key, event.target.value)}
                    className="min-w-0 flex-1 px-3 py-2 outline-none focus:bg-coast-50"
                  />
                  <span className="bg-sand px-3 py-2 text-ink/70">{field.suffix}</span>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-5 bg-coast-700 p-5 text-white">
            <p className="flex items-center gap-2 text-sm font-semibold text-white/75">
              <WalletCards className="h-4 w-4" />
              计算结果
            </p>
            <p className="mt-2 text-4xl font-black">¥{Math.round(total)}</p>
            <p className="mt-2 text-sm text-white/80">按 {values.days || 0} 天、{Math.max(Number(values.days) - 1, 0)} 晚估算。</p>
          </div>
        </div>
      </div>
    </section>
  );
}
