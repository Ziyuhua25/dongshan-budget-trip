import { applyCors, requireAdmin, requirePost, safeString, sendJson, slugify } from './_utils.js';

function toBase64(value) {
  return Buffer.from(value, 'utf8').toString('base64');
}

async function githubRequest(path, options = {}) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error('GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN must be configured.');
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `GitHub request failed with ${response.status}`);
  }

  return data;
}

function buildProposalMarkdown({ title, section, topic, currentText, suggestion }) {
  const citations = Array.isArray(suggestion?.citations) ? suggestion.citations : [];
  const recommendations = Array.isArray(suggestion?.recommendations) ? suggestion.recommendations : [];
  const warnings = Array.isArray(suggestion?.warnings) ? suggestion.warnings : [];

  return `# ${title}

## 更新区域

${section || '通用攻略'}

## 主题

${topic}

## 当前内容

${currentText || '暂无'}

## AI 建议文案

${suggestion?.suggestedCopy || '暂无'}

## 修改建议

${recommendations.map((item) => `- ${item}`).join('\n') || '- 暂无'}

## 风险提醒

${warnings.map((item) => `- ${item}`).join('\n') || '- 暂无'}

## 参考来源

${citations.map((item) => `- [${item.title || item.url}](${item.url})：${item.note || ''}`).join('\n') || '- 暂无'}

## 人工确认清单

- [ ] 已核对价格、交通、营业时间或潮汐等易变信息
- [ ] 已确认文案适合公开展示
- [ ] 已决定要把建议同步到 src/data/ 中
`;
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (!requirePost(req, res)) return;
  if (!requireAdmin(req, res)) return;

  const title = safeString(req.body?.title, 'Update travel guide suggestions');
  const section = safeString(req.body?.section, '通用攻略');
  const topic = safeString(req.body?.topic, '旅行攻略更新');
  const currentText = safeString(req.body?.currentText);
  const suggestion = req.body?.suggestion || {};

  if (!process.env.GITHUB_TOKEN) {
    sendJson(res, 500, { error: 'GITHUB_TOKEN is not configured on the backend.' });
    return;
  }

  try {
    const baseBranch = process.env.GITHUB_BASE_BRANCH || 'main';
    const baseRef = await githubRequest(`/git/ref/heads/${baseBranch}`);
    const branch = `cms/${slugify(topic)}-${Date.now()}`;
    const path = `content/proposals/${new Date().toISOString().slice(0, 10)}-${slugify(topic)}.md`;
    const markdown = buildProposalMarkdown({ title, section, topic, currentText, suggestion });

    await githubRequest('/git/refs', {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${branch}`,
        sha: baseRef.object.sha,
      }),
    });

    await githubRequest(`/contents/${encodeURIComponent(path).replaceAll('%2F', '/')}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: title,
        content: toBase64(markdown),
        branch,
      }),
    });

    const pr = await githubRequest('/pulls', {
      method: 'POST',
      body: JSON.stringify({
        title,
        head: branch,
        base: baseBranch,
        body: 'AI/search-assisted travel guide update proposal. Review the checklist before merging.',
      }),
    });

    sendJson(res, 200, {
      branch,
      file: path,
      pullRequestUrl: pr.html_url,
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}
