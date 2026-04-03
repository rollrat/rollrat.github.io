import { execSync } from 'child_process';
import fs from 'fs';
import { glob } from 'glob';
import matter from 'gray-matter';
import { marked } from 'marked';
import path from 'path';

type Format = 'SINGLE' | 'BATCH';
type ClaudeSectionId = 'notes' | 'graphs' | 'drafts';
type ClaudeKind = 'note' | 'graph' | 'draft';

interface ContentEntry {
  id: string;
  tab: string;
  subgroup?: string;
  type: Format;
  title: string;
  date: string;
  tags: string[];
  html: string;
  markdown?: string;
  summary: string;
  videoId?: string;
  channel?: string;
  duration?: string;
  itemCount?: number;
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

interface ClaudeEntry extends ContentEntry {
  kind: ClaudeKind;
  section: ClaudeSectionId;
  sourcePath: string;
}

interface ClaudeSectionMeta {
  id: ClaudeSectionId;
  label: string;
  count: number;
}

interface ClaudeManifest {
  generatedAt: string;
  sections: ClaudeSectionMeta[];
  entries: ClaudeEntry[];
}

const TAB_LABEL_MAP: Record<string, string> = {
  community: 'Community',
  daily: 'Daily',
  'dcinside-stocks': 'DC Inside Stocks',
  'reddit-ai': 'Reddit AI',
  'reddit-politics-economy': 'Politics & Economy',
  'reddit-saas': 'Reddit SaaS',
  'reddit-space': 'Reddit Space',
  'reddit-stocks': 'Reddit Stocks',
  research: 'Research',
  youtube: 'YouTube',
};

const CLAUDE_SECTION_ORDER: ClaudeSectionId[] = ['notes', 'graphs', 'drafts'];

const CLAUDE_SECTION_LABELS: Record<ClaudeSectionId, string> = {
  drafts: 'Drafts',
  graphs: 'Graphs',
  notes: 'Notes',
};

function normalizePath(value: string): string {
  return value.replace(/\\/g, '/');
}

function ensureGeneratedDir(): string {
  const outDir = path.join(process.cwd(), 'src', 'generated');
  fs.mkdirSync(outDir, { recursive: true });
  return outDir;
}

function writeJsonFile(fileName: string, payload: unknown) {
  const outDir = ensureGeneratedDir();
  const outPath = path.join(outDir, fileName);
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${fileName}`);
}

function getTabLabel(folderName: string): string {
  return TAB_LABEL_MAP[folderName] ?? folderName;
}

function getGitAddedTimestamp(filePath: string): number {
  try {
    const result = execSync(
      `git log --diff-filter=A --format="%ct" -- "${filePath}"`,
      { encoding: 'utf-8' }
    ).trim();

    const ts = Number.parseInt(result.split('\n')[0] ?? '', 10);
    return Number.isNaN(ts) ? 0 : ts;
  } catch {
    return 0;
  }
}

function normalizeDate(value: unknown): string {
  if (!value) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value);
}

function slugify(input: string): string {
  return normalizePath(input)
    .replace(/\.(md|dot)$/i, '')
    .replace(/[^\p{Letter}\p{Number}_-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function tabFromPath(filePath: string, contentDir: string): string {
  const relative = normalizePath(path.relative(contentDir, filePath));
  return relative.split('/')[0] ?? '';
}

function subgroupFromPath(filePath: string, contentDir: string): string | undefined {
  const relative = normalizePath(path.relative(contentDir, filePath));
  const parts = relative.split('/');

  if (parts.length >= 3) {
    return parts[1];
  }

  return undefined;
}

function transformWikiLinks(html: string): string {
  return html.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, fileName, display) => {
    const label = display ?? fileName;
    return `<span class="wiki-link">${label}</span>`;
  });
}

function extractSummary(text: string, maxLen = 160): string {
  const clean = text
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/^#{1,6}\s+.*/gm, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/^[-*>]\s+/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim();

  const firstMeaningfulLine = clean
    .split('\n')
    .map(line => line.trim())
    .find(line => line.length > 20) ?? clean;

  if (firstMeaningfulLine.length <= maxLen) {
    return firstMeaningfulLine;
  }

  return `${firstMeaningfulLine.slice(0, maxLen - 1)}…`;
}

function countBatchItems(body: string): number {
  return (body.match(/^##\s+/gm) ?? []).length;
}

function extractHeading(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function prettifyName(name: string): string {
  return name
    .split(/[-_]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function renderMarkdown(markdown: string): Promise<string> {
  const html = await marked.parse(markdown, { gfm: true });
  return transformWikiLinks(String(html));
}

async function processContentFile(filePath: string, contentDir: string): Promise<ContentEntry | null> {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const tab = tabFromPath(filePath, contentDir);
  const subgroup = subgroupFromPath(filePath, contentDir);
  const id = slugify(path.relative(contentDir, filePath));

  const hasFrontmatterTitle = /^---[\s\S]+?title:/.test(raw);
  const hasSeparator = /\n---\n/.test(raw);
  const format: Format = hasFrontmatterTitle ? 'SINGLE' : 'BATCH';

  const { content: body, data: frontmatter } = matter(raw);

  if (format === 'SINGLE') {
    return {
      channel: frontmatter.channel ? String(frontmatter.channel) : undefined,
      date: normalizeDate(frontmatter.upload_date ?? frontmatter.date),
      duration: frontmatter.duration ? String(frontmatter.duration) : undefined,
      html: await renderMarkdown(body),
      id,
      markdown: body,
      subgroup,
      summary: extractSummary(body),
      tab,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : [],
      ticker: frontmatter.ticker ? String(frontmatter.ticker) : undefined,
      title: String(frontmatter.title ?? path.basename(filePath, '.md')),
      type: 'SINGLE',
      verdict: frontmatter.verdict ? String(frontmatter.verdict) : undefined,
      videoId: frontmatter.video_id ? String(frontmatter.video_id) : undefined,
    };
  }

  const title = extractHeading(body) ?? path.basename(filePath, '.md');
  const dateMatch = title.match(/(\d{2}\.\d{2}\.\d{2})/);
  const date = frontmatter.date
    ? normalizeDate(frontmatter.date)
    : dateMatch
      ? `20${dateMatch[1].replace(/\./g, '-')}`
      : '';

  return {
    channel: frontmatter.channel ? String(frontmatter.channel) : undefined,
    date,
    html: await renderMarkdown(body),
    id,
    itemCount: hasSeparator ? countBatchItems(body) : 1,
    markdown: body,
    subgroup,
    summary: extractSummary(body),
    tab,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : [],
    title,
    type: 'BATCH',
  };
}

async function buildContentManifest(): Promise<Manifest> {
  const contentDir = path.join(process.cwd(), 'content');

  if (!fs.existsSync(contentDir)) {
    console.log('content/ directory not found, creating empty content manifest');
    return { entries: [], tabs: [] };
  }

  const files = await glob('**/*.md', { absolute: true, cwd: contentDir });
  const entries: ContentEntry[] = [];
  const addedTimes = new Map<string, number>();

  for (const filePath of files) {
    try {
      const entry = await processContentFile(filePath, contentDir);
      if (entry) {
        entries.push(entry);
        addedTimes.set(entry.id, getGitAddedTimestamp(filePath));
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }

  entries.sort((left, right) => {
    const leftAdded = addedTimes.get(left.id) ?? 0;
    const rightAdded = addedTimes.get(right.id) ?? 0;

    if (leftAdded || rightAdded) {
      return rightAdded - leftAdded;
    }

    if (left.date && right.date) {
      return right.date.localeCompare(left.date);
    }

    return left.title.localeCompare(right.title);
  });

  const topLevelDirs = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  const tabs: TabMeta[] = topLevelDirs
    .map(dirName => {
      const dirPath = path.join(contentDir, dirName);
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      const hasFiles = items.some(item => item.isFile() && item.name.endsWith('.md'));
      const hasSubDirs = items.some(item => item.isDirectory());

      return {
        hasSubgroups: hasSubDirs && !hasFiles,
        id: dirName,
        label: getTabLabel(dirName),
      };
    })
    .sort((left, right) => {
      const leftCount = entries.filter(entry => entry.tab === left.id).length;
      const rightCount = entries.filter(entry => entry.tab === right.id).length;
      return rightCount - leftCount;
    });

  return { entries, tabs };
}

async function processClaudeFile(filePath: string, claudeDir: string): Promise<ClaudeEntry | null> {
  const relative = normalizePath(path.relative(claudeDir, filePath));
  const [section] = relative.split('/');

  if (!section || !CLAUDE_SECTION_ORDER.includes(section as ClaudeSectionId)) {
    return null;
  }

  const sectionId = section as ClaudeSectionId;
  const sectionLabel = CLAUDE_SECTION_LABELS[sectionId];
  const ext = path.extname(filePath).toLowerCase();
  const raw = fs.readFileSync(filePath, 'utf-8');
  const stats = fs.statSync(filePath);
  const id = slugify(relative);

  if (ext === '.md') {
    const { content: body, data: frontmatter } = matter(raw);
    const title = String(frontmatter.title ?? extractHeading(body) ?? prettifyName(path.basename(filePath, '.md')));
    const tags = Array.from(new Set([
      'claude',
      'analysis',
      sectionId,
      ...(Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : []),
    ]));

    return {
      channel: `CLAUDE / ${sectionLabel.toUpperCase()}`,
      date: normalizeDate(frontmatter.date ?? stats.mtime.toISOString().slice(0, 10)),
      html: await renderMarkdown(body),
      id,
      kind: 'note',
      markdown: body,
      section: sectionId,
      sourcePath: relative,
      summary: extractSummary(body),
      tab: 'claude',
      tags,
      title,
      type: 'SINGLE',
    };
  }

  if (ext === '.dot') {
    const title = prettifyName(path.basename(filePath, '.dot'));
    const displayMarkdown = [
      '> Graphviz DOT source copied from the local Claude analysis workspace.',
      '',
      `> Source: \`${relative}\``,
      '',
      '```dot',
      raw.trimEnd(),
      '```',
    ].join('\n');

    const kind: ClaudeKind = sectionId === 'drafts' ? 'draft' : 'graph';
    const tagName = sectionId === 'drafts' ? 'draft' : 'graph';

    return {
      channel: `CLAUDE / ${sectionLabel.toUpperCase()}`,
      date: stats.mtime.toISOString().slice(0, 10),
      html: await renderMarkdown(displayMarkdown),
      id,
      kind,
      markdown: raw,
      section: sectionId,
      sourcePath: relative,
      summary: `${kind === 'draft' ? 'Draft' : 'Graphviz'} DOT source for ${title}.`,
      tab: 'claude',
      tags: ['claude', 'analysis', sectionId, tagName],
      title,
      type: 'SINGLE',
    };
  }

  return null;
}

async function buildClaudeManifest(): Promise<ClaudeManifest> {
  const claudeDir = path.join(process.cwd(), 'claude-source');

  if (!fs.existsSync(claudeDir)) {
    console.log('claude-source/ directory not found, creating empty Claude manifest');
    return {
      entries: [],
      generatedAt: new Date().toISOString(),
      sections: [],
    };
  }

  const files = await glob('**/*.{md,dot}', { absolute: true, cwd: claudeDir });
  const entries: ClaudeEntry[] = [];

  for (const filePath of files) {
    try {
      const entry = await processClaudeFile(filePath, claudeDir);
      if (entry) {
        entries.push(entry);
      }
    } catch (error) {
      console.error(`Error processing Claude source ${filePath}:`, error);
    }
  }

  entries.sort((left, right) => {
    const sectionOrder = CLAUDE_SECTION_ORDER.indexOf(left.section) - CLAUDE_SECTION_ORDER.indexOf(right.section);
    if (sectionOrder !== 0) {
      return sectionOrder;
    }

    if (left.date && right.date && left.date !== right.date) {
      return right.date.localeCompare(left.date);
    }

    return left.title.localeCompare(right.title);
  });

  const sections = CLAUDE_SECTION_ORDER
    .map(sectionId => ({
      count: entries.filter(entry => entry.section === sectionId).length,
      id: sectionId,
      label: CLAUDE_SECTION_LABELS[sectionId],
    }))
    .filter(section => section.count > 0);

  return {
    entries,
    generatedAt: new Date().toISOString(),
    sections,
  };
}

async function main() {
  const contentManifest = await buildContentManifest();
  const claudeManifest = await buildClaudeManifest();

  writeJsonFile('content-manifest.json', contentManifest);
  writeJsonFile('claude-manifest.json', claudeManifest);

  console.log(`Content tabs: ${contentManifest.tabs.map(tab => tab.id).join(', ')}`);
  console.log(`Claude entries: ${claudeManifest.entries.length}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
