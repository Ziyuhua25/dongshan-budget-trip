import { ExternalLink, FileJson, RotateCcw, Search, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const storageKeys = {
  draft: 'dongshan-search-editor-draft',
};

const sections = ['每日行程', '交通指南', '住宿建议', '预算', '吃饭攻略', '拍照打卡', '避坑提醒', '咖啡店计划'];

const searchTargets = [
  {
    name: '百度',
    hint: '中文网页攻略',
    buildUrl: (query) => `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
  },
  {
    name: 'Google',
    hint: '综合搜索',
    buildUrl: (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  },
  {
    name: '高德地图',
    hint: '地址和路线',
    buildUrl: (query) => `https://www.amap.com/search?query=${encodeURIComponent(query)}`,
  },
  {
    name: '小红书',
    hint: '游记和实拍',
    buildUrl: (query) => `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(query)}`,
  },
  {
    name: '抖音',
    hint: '短视频近况',
    buildUrl: (query) => `https://www.douyin.com/search/${encodeURIComponent(query)}`,
  },
  {
    name: 'Bing',
    hint: '备用搜索',
    buildUrl: (query) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
  },
];

const quickTopics = [
  '东山岛 南屿绿色灯塔 潮汐',
  '东山岛 金銮湾 日出 时间',
  '东山岛 苏峰山环岛路 电动车',
  '厦门 天坛咖啡 EF 地址',
  '厦门 到 东山岛 巴士',
  '东山岛 铜陵镇 住宿 性价比',
  '东山岛 海鲜 大排档 避坑',
  '六月 福建沿海 天气 雷雨',
];

function getStoredDraft() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.localStorage.getItem(storageKeys.draft) || 'null');
  } catch {
    return null;
  }
}

function saveDraft(draft) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKeys.draft, JSON.stringify(draft));
  }
}

function removeDraft() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(storageKeys.draft);
  }
}

function makeSuggestions(section, topic) {
  const base = topic.trim();
  const sectionHints = {
    每日行程: ['最新攻略', '路线安排', '交通时间', '避坑'],
    交通指南: ['交通', '巴士', '动车', '拼车', '时刻表'],
    住宿建议: ['住宿', '民宿', '位置', '性价比', '避雷'],
    预算: ['价格', '预算', '门票', '餐饮消费'],
    吃饭攻略: ['小吃', '海鲜', '大排档', '价格'],
    拍照打卡: ['拍照机位', '日出', '日落', '实拍'],
    避坑提醒: ['避坑', '注意事项', '天气', '潮汐'],
    咖啡店计划: ['地址', '营业时间', '探店', '最新'],
  };
  const hints = sectionHints[section] || ['攻略', '最新', '避坑'];
  return [base, ...hints.map((hint) => `${base} ${hint}`)].filter(Boolean);
}

export default function SmartEditor() {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('admin') === '1' || Boolean(getStoredDraft());
  });
  const storedDraft = getStoredDraft();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState(storedDraft?.section || '每日行程');
  const [topic, setTopic] = useState(storedDraft?.topic || '东山岛 南屿绿色灯塔 潮汐');
  const [notes, setNotes] = useState(storedDraft?.notes || '');

  const queries = useMemo(() => makeSuggestions(section, topic), [section, topic]);
  const primaryQuery = queries[0] || topic;

  if (!enabled) {
    return null;
  }

  function persistDraft(nextValues = {}) {
    saveDraft({
      section,
      topic,
      notes,
      updatedAt: new Date().toISOString(),
      ...nextValues,
    });
  }

  function exportJson() {
    const payload = {
      section,
      topic,
      notes,
      queries,
      links: queries.flatMap((query) =>
        searchTargets.map((target) => ({
          query,
          target: target.name,
          url: target.buildUrl(query),
        })),
      ),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dongshan-search-notes-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetDraft() {
    removeDraft();
    setSection('每日行程');
    setTopic('东山岛 南屿绿色灯塔 潮汐');
    setNotes('');
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-white shadow-soft transition hover:bg-coral">
        <Sparkles className="h-4 w-4" />
        搜索编辑
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink/55 p-3 backdrop-blur-sm sm:p-6">
          <section className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden bg-sand shadow-2xl">
            <header className="flex items-center justify-between gap-4 border-b border-coast-100 bg-white px-5 py-4">
              <div>
                <p className="eyebrow mb-1">Static Search Editor</p>
                <h2 className="text-2xl font-black text-ink">攻略搜索跳转工具</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-coast-100 text-ink transition hover:bg-coast-50" aria-label="关闭搜索编辑器">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="grid min-h-0 flex-1 gap-0 overflow-y-auto lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4 border-b border-coast-100 bg-white p-5 lg:border-b-0 lg:border-r">
                <label className="field-label">
                  编辑区域
                  <select value={section} onChange={(event) => setSection(event.target.value)} className="field-input">
                    {sections.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field-label">
                  想搜索或修改的主题
                  <input value={topic} onChange={(event) => setTopic(event.target.value)} className="field-input" />
                </label>

                <div>
                  <p className="field-label">快捷主题</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {quickTopics.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setTopic(item);
                          persistDraft({ topic: item });
                        }}
                        className="rounded-full bg-coast-50 px-3 py-2 text-xs font-bold text-coast-700 transition hover:bg-coral hover:text-white"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="field-label">
                  核查笔记 / 修改草稿
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={10}
                    placeholder="打开搜索结果后，把你确认过的信息、价格、地址、潮汐提醒、避坑点写在这里。"
                    className="field-input resize-y leading-7"
                  />
                </label>

                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => persistDraft()} className="btn-primary">
                    保存草稿
                  </button>
                  <button type="button" onClick={exportJson} className="btn-muted">
                    <FileJson className="h-4 w-4" />
                    导出 JSON
                  </button>
                  <button type="button" onClick={resetDraft} className="btn-muted">
                    <RotateCcw className="h-4 w-4" />
                    重置
                  </button>
                </div>

                <div className="border-l-4 border-coral bg-sand p-4 text-sm leading-6 text-ink/75">
                  这是纯静态功能，不调用任何 API，也不会产生费用。它只负责生成搜索链接、保存本地草稿和导出文件。
                </div>
              </div>

              <div className="space-y-4 p-5">
                <article className="card">
                  <p className="eyebrow">One Click Search</p>
                  <h3 className="text-xl font-black text-ink">直接跳转搜索：{primaryQuery}</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {searchTargets.map((target) => (
                      <a key={target.name} href={target.buildUrl(primaryQuery)} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 border border-coast-100 bg-white p-4 font-black text-ink transition hover:border-coral hover:bg-coast-50">
                        <span>
                          {target.name}
                          <span className="mt-1 block text-xs font-semibold text-ink/55">{target.hint}</span>
                        </span>
                        <ExternalLink className="h-4 w-4 text-coral" />
                      </a>
                    ))}
                  </div>
                </article>

                <article className="card">
                  <p className="eyebrow">Suggested Queries</p>
                  <div className="space-y-4">
                    {queries.map((query) => (
                      <div key={query} className="border border-coast-100 bg-white p-4">
                        <div className="mb-3 flex items-center gap-2 font-black text-ink">
                          <Search className="h-4 w-4 text-coast-500" />
                          {query}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {searchTargets.map((target) => (
                            <a key={`${query}-${target.name}`} href={target.buildUrl(query)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-coast-50 px-3 py-2 text-sm font-bold text-coast-700 transition hover:bg-coral hover:text-white">
                              {target.name}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="card">
                  <p className="eyebrow">Manual Workflow</p>
                  <ol className="space-y-3 leading-7 text-ink/75">
                    <li>1. 点开高德确认地址、路线、是否仍营业。</li>
                    <li>2. 点开小红书或抖音看近期实拍和避坑。</li>
                    <li>3. 点开百度或 Google 补充公开网页资料。</li>
                    <li>4. 把确认后的内容写到左侧草稿，再手动更新 `src/data/`。</li>
                  </ol>
                </article>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
