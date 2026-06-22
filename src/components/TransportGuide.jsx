import { Bus, Home, Plane, Search, TrainFront } from 'lucide-react';
import { cafeKeywords, stays, transportOptions } from '../data/itinerary';

const icons = [Plane, Bus, TrainFront, Bus];

export default function TransportGuide() {
  return (
    <section id="transport" className="section-wrap">
      <div className="section-heading">
        <p className="eyebrow">Transport & Stay</p>
        <h2>交通和住宿</h2>
        <p>从沈阳到福建距离很长，先用飞机把大头解决；东山岛内部再按天气选择步行、小电驴、打车或拼车。</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {transportOptions.map((option, index) => {
          const Icon = icons[index];
          return (
            <article key={option.title} className="card">
              <Icon className="h-7 w-7 text-coast-500" />
              <h3 className="mt-3 text-xl font-black text-ink">{option.title}</h3>
              <p className="mt-2 leading-7 text-ink/70">{option.description}</p>
              <p className="mt-4 border-l-4 border-coral bg-sand px-4 py-3 text-sm font-semibold text-ink">{option.bestFor}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="card">
          <div className="mb-4 flex items-center gap-3">
            <Home className="h-6 w-6 text-coast-500" />
            <h3 className="text-xl font-black text-ink">住宿建议</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-coast-50 text-coast-700">
                <tr>
                  <th className="px-4 py-3">区域</th>
                  <th className="px-4 py-3">适合人群</th>
                  <th className="px-4 py-3">特点</th>
                </tr>
              </thead>
              <tbody>
                {stays.map((stay) => (
                  <tr key={stay.area} className="border-b border-coast-100">
                    <td className="px-4 py-3 font-black">{stay.area}</td>
                    <td className="px-4 py-3">{stay.people}</td>
                    <td className="px-4 py-3">{stay.feature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/70">穷游优先住铜陵镇，想拍照优先住南门湾。不要盲目订海景房，旺季价格会明显上涨。</p>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center gap-3">
            <Search className="h-6 w-6 text-coral" />
            <h3 className="text-xl font-black text-ink">EF / 天坛咖啡搜索</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {cafeKeywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-sand px-3 py-2 text-sm font-bold text-ink">
                {keyword}
              </span>
            ))}
          </div>
          <p className="mt-5 leading-7 text-ink/70">
            这家店需要当天用高德地图、小红书或抖音再次确认地址。把它放在厦门半天行程里，和沙坡尾或厦大附近顺路安排最稳。
          </p>
        </div>
      </div>
    </section>
  );
}
