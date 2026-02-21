import { glob } from 'glob';
import matter from 'gray-matter';
import { marked } from 'marked';
import fs from 'fs';
import path from 'path';

// ── Types ──────────────────────────────────────────────────────────────────

type Format = 'SINGLE' | 'BATCH';

interface ContentEntry {
  id: string;
  tab: string;
  subgroup?: string;
  type: Format;
  title: string;
  date: string;
  tags: string[];
  html: string;
  summary: string;
  // SINGLE-specific
  videoId?: string;
  channel?: string;
  duration?: string;
  // BATCH-specific
  itemCount?: number;
  // research-specific
  ticker?: string;
  verdict?: string;
}

interface TabMeta {
  id: string;
  label: string;
  hasSubgroups: boolean;
}

interface Manifest {
  tabs: TabMeta[];
  entries: ContentEntry[];
}

// ── Tab label mapping ────────────────────────────────────────────────────────

const TAB_LABEL_MAP: Record<string, string> = {
  youtube: '유튜브 요약',
  community: '커뮤니티',
  research: '리서치',
  daily: '일일 요약',
  'reddit-saas': 'Reddit SaaS',
};

function getTabLabel(folderName: string): string {
  return TAB_LABEL_MAP[folderName] ?? folderName;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function slugify(filePath: string): string {
  return filePath
    .replace(/[/\\]/g, '-')
    .replace(/\.md$/, '')
    .replace(/[^a-zA-Z0-9가-힣_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function tabFromPath(filePath: string, contentDir: string): string {
  const relative = path.relative(contentDir, filePath).replace(/\\/g, '/');
  const parts = relative.split('/');
  return parts[0];
}

function subgroupFromPath(filePath: string, contentDir: string): string | undefined {
  const relative = path.relative(contentDir, filePath).replace(/\\/g, '/');
  const parts = relative.split('/');
  // parts[0] = tab, parts[1] = subgroup or file, parts[2] = file (if subgroup exists)
  if (parts.length >= 3) {
    return parts[1];
  }
  return undefined;
}

function transformWikiLinks(html: string): string {
  // [[file|display]] or [[file]]
  return html.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, _file, display) => {
    const label = display ?? _file;
    return `<span class="wiki-link">${label}</span>`;
  });
}

function extractSummary(text: string, maxLen = 160): string {
  // Strip markdown, take first meaningful paragraph
  const clean = text
    .replace(/^#{1,6}\s+.*/gm, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/^[-*>]\s+/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
  const first = clean.split('\n').find(l => l.trim().length > 20) ?? clean;
  return first.length > maxLen ? first.slice(0, maxLen - 1) + '…' : first;
}

// Count ## sections in BATCH file
function countBatchItems(body: string): number {
  return (body.match(/^##\s+/gm) ?? []).length;
}

async function processFile(filePath: string, contentDir: string): Promise<ContentEntry | null> {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const tab = tabFromPath(filePath, contentDir);
  const subgroup = subgroupFromPath(filePath, contentDir);
  const id = slugify(path.relative(contentDir, filePath));

  // Detect format
  const hasFrontmatterTitle = /^---[\s\S]+?title:/.test(raw);
  const hasSeparator = /\n---\n/.test(raw);
  const format: Format = hasFrontmatterTitle ? 'SINGLE' : 'BATCH';

  const { data: fm, content: body } = matter(raw);

  // ── SINGLE ─────────────────────────────────────────────────────────────
  if (format === 'SINGLE') {
    const htmlRaw = await marked(body, { gfm: true });
    const html = transformWikiLinks(htmlRaw);

    return {
      id,
      tab,
      subgroup,
      type: 'SINGLE',
      title: String(fm.title ?? path.basename(filePath, '.md')),
      date: String(fm.upload_date ?? fm.date ?? ''),
      tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
      html,
      summary: extractSummary(body),
      videoId: fm.video_id ? String(fm.video_id) : undefined,
      channel: fm.channel ? String(fm.channel) : undefined,
      duration: fm.duration ? String(fm.duration) : undefined,
      ticker: fm.ticker ? String(fm.ticker) : undefined,
      verdict: fm.verdict ? String(fm.verdict) : undefined,
    };
  }

  // ── BATCH ──────────────────────────────────────────────────────────────
  // Extract title from first H1 line
  const h1Match = body.match(/^#\s+(.+)/m);
  const title = h1Match ? h1Match[1].trim() : path.basename(filePath, '.md');

  // Extract date from title pattern like "26.02.09 ~ 02.14" or frontmatter
  const dateMatch = title.match(/(\d{2}\.\d{2}\.\d{2})/);
  const date = fm.date
    ? String(fm.date)
    : dateMatch
    ? '20' + dateMatch[1].replace(/\./g, '-')
    : '';

  const htmlRaw = await marked(body, { gfm: true });
  const html = transformWikiLinks(htmlRaw);

  return {
    id,
    tab,
    subgroup,
    type: 'BATCH',
    title,
    date,
    tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
    html,
    summary: extractSummary(body),
    itemCount: hasSeparator ? countBatchItems(body) : 1,
    channel: fm.channel ? String(fm.channel) : undefined,
  };
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) {
    console.log('content/ directory not found, creating empty manifest');
    const outDir = path.join(process.cwd(), 'src', 'generated');
    fs.mkdirSync(outDir, { recursive: true });
    const emptyManifest: Manifest = { tabs: [], entries: [] };
    fs.writeFileSync(path.join(outDir, 'content-manifest.json'), JSON.stringify(emptyManifest, null, 2));
    return;
  }

  const files = await glob('**/*.md', { cwd: contentDir, absolute: true });
  console.log(`Found ${files.length} markdown files`);

  const entries: ContentEntry[] = [];
  for (const f of files) {
    try {
      const entry = await processFile(f, contentDir);
      if (entry) entries.push(entry);
    } catch (err) {
      console.error(`Error processing ${f}:`, err);
    }
  }

  // Sort by date descending, then by title
  entries.sort((a, b) => {
    if (b.date && a.date) return b.date.localeCompare(a.date);
    if (b.date) return 1;
    if (a.date) return -1;
    return a.title.localeCompare(b.title);
  });

  // Build tab metadata by scanning top-level directories
  const topLevelDirs = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const tabs: TabMeta[] = topLevelDirs.map(dirName => {
    const dirPath = path.join(contentDir, dirName);
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    const hasFiles = items.some(item => item.isFile() && item.name.endsWith('.md'));
    const hasSubDirs = items.some(item => item.isDirectory());
    // hasSubgroups = only subdirectories (no top-level .md files)
    const hasSubgroups = hasSubDirs && !hasFiles;

    return {
      id: dirName,
      label: getTabLabel(dirName),
      hasSubgroups,
    };
  });

  const manifest: Manifest = { tabs, entries };

  const outDir = path.join(process.cwd(), 'src', 'generated');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'content-manifest.json');
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${entries.length} entries to ${outPath}`);
  console.log(`Tabs: ${tabs.map(t => `${t.id}(hasSubgroups=${t.hasSubgroups})`).join(', ')}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
