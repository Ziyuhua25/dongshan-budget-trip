import { Bot, ExternalLink, FileJson, GitPullRequest, KeyRound, Search, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const storageKeys = {
  apiBase: 'dongshan-admin-api-base',
  adminToken: 'dongshan-admin-token',
};

const sections = ['每日行程', '交通指南', '住宿建议', '预算', '吃饭攻略', '拍照打卡', '避坑提醒', '咖啡店计划'];

function getStoredValue(key) {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(key) || '';
}

function setStoredValue(key, value) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value);
  }
}

function normalizeApiBase(value) {
  return value.trim().replace(/\/$/, '');
}

function buildEndpoint(apiBase, path) {
  const base = normalizeApiBase(apiBase);
  return `${base}${path}`;
}

export default function SmartEditor() {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('admin') === '1' || Boolean(getStoredValue(storageKeys.adminToken));
  });
  const [open, setOpen] = useState(false);
  const [apiBase, setApiBase] = useState(() => getStoredValue(storageKeys.apiBase));
  const [adminToken, setAdminToken] = useState(() => getStoredValue(storageKeys.adminToken));
  const [section, setSection] = useState('每日行程');
  const [topic, setTopic] = useState('东山岛 南屿绿色灯塔 潮汐');
  const [currentText, setCurrentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingPr, setCreatingPr] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [prUrl, setPrUrl] = useState('');

  const canCallApi = useMemo(() => adminToken.trim().length > 0, [adminToken]);

  if (!enabled) {
    return null;
  }

  function persistSettings() {
    setStoredValue(storageKeys.apiBase, normalizeApiBase(apiBase));
    setStoredValue(storageKeys.adminToken, adminToken.trim());
  }

  async function requestSuggestion() {
    persistSettings();
    setLoading(true);
    setError('');
    setPrUrl('');

    try {
      const response = await fetch(buildEndpoint(apiBase, '/api/suggest'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken.trim(),
        },
        body: JSON.stringify({ section, topic, currentText }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '请求失败');
      }
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function createProposalPr() {
    if (!result) return;
    persistSettings();
    setCreatingPr(true);
    setError('');

    try {
      const response = await fetch(buildEndpoint(apiBase, '/api/create-pr'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken.trim(),
        },
        body: JSON.stringify({
          title: `Update travel guide: ${topic}`,
          section,
          topic,
          currentText,
          suggestion: result,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '创建 PR 失败');
      }
      setPrUrl(data.pullRequestUrl);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCreatingPr(false);
    }
  }

  function exportJson() {
    const payload = {
      section,
      topic,
      currentText,
      suggestion: result,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dongshan-guide-suggestion-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-white shadow-soft transition hover:bg-coral">
        <Sparkles className="h-4 w-4" />
        智能编辑
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink/55 p-3 backdrop-blur-sm sm:p-6">
          <section className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden bg-sand shadow-2xl">
            <header className="flex items-center justify-between gap-4 border-b border-coast-100 bg-white px-5 py-4">
              <div>
                <p className="eyebrow mb-1">Admin CMS</p>
                <h2 className="text-2xl font-black text-ink">智能攻略编辑器</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-coast-100 text-ink transition hover:bg-coast-50" aria-label="关闭智能编辑器">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="grid min-h-0 flex-1 gap-0 overflow-y-auto lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-4 border-b border-coast-100 bg-white p-5 lg:border-b-0 lg:border-r">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="field-label">
                    后端 API URL
                    <input
                      value={apiBase}
                      onChange={(event) => setApiBase(event.target.value)}
                      placeholder="Vercel 地址，可留空表示同域"
                      className="field-input"
                    />
                  </label>
                  <label className="field-label">
                    管理员口令
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                      <input
                        value={adminToken}
                        type="password"
                        onChange={(event) => setAdminToken(event.target.value)}
                        placeholder="ADMIN_TOKEN"
                        className="field-input pl-9"
                      />
                    </div>
                  </label>
                </div>

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
                  想更新或搜索的主题
                  <input value={topic} onChange={(event) => setTopic(event.target.value)} className="field-input" />
                </label>

                <label className="field-label">
                  当前内容或你的草稿
                  <textarea
                    value={currentText}
                    onChange={(event) => setCurrentText(event.target.value)}
                    rows={9}
                    placeholder="把你想修改的攻略段落粘到这里，AI 会结合搜索结果给建议。"
                    className="field-input resize-y leading-7"
                  />
                </label>

                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={requestSuggestion} disabled={!canCallApi || loading} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">
                    <Search className="h-4 w-4" />
                    {loading ? '搜索和分析中...' : '搜索并给建议'}
                  </button>
                  <button type="button" onClick={exportJson} disabled={!result} className="btn-muted disabled:cursor-not-allowed disabled:opacity-50">
                    <FileJson className="h-4 w-4" />
                    导出 JSON
                  </button>
                </div>

                <div className="border-l-4 border-coral bg-sand p-4 text-sm leading-6 text-ink/75">
                  这个面板不会把密钥写进网页代码。管理员口令只存在你的浏览器 localStorage，并通过请求头发给后端校验。
                </div>
              </div>

              <div className="space-y-4 p-5">
                {error && <div className="border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

                {!result && !error && (
                  <div className="card flex min-h-[320px] flex-col items-center justify-center text-center">
                    <Bot className="h-12 w-12 text-coast-500" />
                    <h3 className="mt-4 text-xl font-black text-ink">等待生成建议</h3>
                    <p className="mt-2 max-w-md leading-7 text-ink/65">输入主题后，后端会调用搜索和 AI，把结果整理成可人工确认的修改建议。</p>
                  </div>
                )}

                {result && (
                  <>
                    <article className="card">
                      <p className="eyebrow">Summary</p>
                      <h3 className="text-xl font-black text-ink">{result.summary}</h3>
                      <p className="mt-2 text-sm font-bold text-coast-700">模式：{result.mode}</p>
                    </article>

                    <ResultList title="修改建议" items={result.recommendations} />

                    <article className="card">
                      <p className="eyebrow">Suggested Copy</p>
                      <p className="whitespace-pre-wrap leading-8 text-ink/78">{result.suggestedCopy}</p>
                    </article>

                    <ResultList title="风险提醒" items={result.warnings} tone="warning" />

                    <article className="card">
                      <p className="eyebrow">Search Links</p>
                      <div className="flex flex-wrap gap-2">
                        {(result.searchLinks || []).map((link) => (
                          <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-coast-50 px-3 py-2 text-sm font-bold text-coast-700 transition hover:bg-coral hover:text-white">
                            {link.label}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ))}
                      </div>
                    </article>

                    {Boolean(result.citations?.length) && (
                      <article className="card">
                        <p className="eyebrow">Citations</p>
                        <ul className="space-y-3">
                          {result.citations.map((item) => (
                            <li key={`${item.title}-${item.url}`} className="leading-7">
                              <a href={item.url} target="_blank" rel="noreferrer" className="font-black text-coast-700 hover:text-coral">
                                {item.title || item.url}
                              </a>
                              {item.note && <p className="text-sm text-ink/65">{item.note}</p>}
                            </li>
                          ))}
                        </ul>
                      </article>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      <button type="button" onClick={createProposalPr} disabled={creatingPr} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">
                        <GitPullRequest className="h-4 w-4" />
                        {creatingPr ? '创建 PR 中...' : '创建建议 PR'}
                      </button>
                      {prUrl && (
                        <a href={prUrl} target="_blank" rel="noreferrer" className="btn-muted">
                          打开 PR
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function ResultList({ title, items = [], tone = 'normal' }) {
  if (!items.length) return null;
  return (
    <article className="card">
      <p className="eyebrow">{title}</p>
      <ul className="space-y-3 leading-7 text-ink/75">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={tone === 'warning' ? 'mt-2 h-2 w-2 flex-none rounded-full bg-coral' : 'mt-2 h-2 w-2 flex-none rounded-full bg-coast-500'} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
