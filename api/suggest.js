import {
  applyCors,
  extractResponseText,
  requireAdmin,
  requirePost,
  safeString,
  sendJson,
  tryParseJson,
} from './_utils.js';

function fallbackPayload(topic, section, currentText) {
  const baseQueries = [
    `${topic} 最新攻略`,
    `${topic} 交通 价格`,
    `${topic} 避坑`,
    `${topic} 小红书 高德`,
  ];

  return {
    mode: 'fallback',
    summary: '后端未配置 OPENAI_API_KEY，先返回可人工核查的搜索关键词和编辑提示。',
    queries: baseQueries,
    searchLinks: baseQueries.map((query) => ({
      label: query,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    })),
    recommendations: [
      '先核对交通班次、营业时间、潮汐和门票价格，这些最容易过期。',
      '把需要实时确认的信息写成“出发前再次确认”，不要写死。',
      '预算建议保留区间，避免给出过准但不稳定的价格。',
    ],
    suggestedCopy: currentText || `建议补充「${topic}」的最新交通、费用、注意事项和备用方案。`,
    warnings: ['这是无 AI key 的离线兜底结果，需要你手动打开搜索链接核查。'],
    citations: [],
    section,
  };
}

function buildPrompt({ topic, section, currentText }) {
  return `
你是一个谨慎的中文旅行攻略编辑，正在维护一个开源网站「沈阳出发｜东山岛 + 厦门 4–5 天穷游攻略」。

请基于实时网页搜索结果和常识，给出可以人工确认后写入网站的修改建议。

要求：
1. 用中文输出。
2. 不要编造精确价格、地址、营业时间；不确定就写“出发前再次确认”。
3. 明确区分「建议文案」和「需要核查的事项」。
4. 对潮汐、天气、航班、门店地址、价格等易变信息要提醒核查。
5. 只输出 JSON，不要输出 Markdown。

JSON 格式：
{
  "summary": "一句话总结",
  "queries": ["建议继续搜索的关键词"],
  "recommendations": ["具体修改建议"],
  "suggestedCopy": "可以粘贴进网站的建议文案",
  "warnings": ["风险或不确定性"],
  "citations": [{"title":"来源标题","url":"https://...","note":"为什么参考它"}]
}

编辑区域：${section}
用户想更新的主题：${topic}
当前内容：
${currentText || '暂无当前内容'}
`.trim();
}

async function callOpenAI(payload) {
  const model = process.env.OPENAI_MODEL || 'gpt-5.5';
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: buildPrompt(payload),
      tools: [{ type: 'web_search_preview' }],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenAI request failed with ${response.status}`);
  }

  const text = extractResponseText(data);
  const parsed = tryParseJson(text);
  if (!parsed) {
    throw new Error('OpenAI returned non-JSON output.');
  }

  const queries = Array.isArray(parsed.queries) ? parsed.queries : [];
  return {
    mode: 'openai-web-search',
    summary: safeString(parsed.summary, '已生成建议。'),
    queries,
    searchLinks: queries.map((query) => ({
      label: query,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    })),
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    suggestedCopy: safeString(parsed.suggestedCopy),
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
    citations: Array.isArray(parsed.citations) ? parsed.citations : [],
    section: payload.section,
  };
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (!requirePost(req, res)) return;
  if (!requireAdmin(req, res)) return;

  const topic = safeString(req.body?.topic);
  const section = safeString(req.body?.section, '通用攻略');
  const currentText = safeString(req.body?.currentText);

  if (!topic) {
    sendJson(res, 400, { error: 'topic is required.' });
    return;
  }

  try {
    const result = process.env.OPENAI_API_KEY
      ? await callOpenAI({ topic, section, currentText })
      : fallbackPayload(topic, section, currentText);
    sendJson(res, 200, result);
  } catch (error) {
    sendJson(res, 500, {
      error: error.message,
      fallback: fallbackPayload(topic, section, currentText),
    });
  }
}
