export type Tab = string;
export type Format = 'SINGLE' | 'BATCH';
export type ClaudeKind = 'note' | 'graph' | 'draft';

export interface ContentEntry {
  id: string;
  tab: Tab;
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

export interface TabMeta {
  id: string;
  label: string;
  hasSubgroups: boolean;
}

export interface Manifest {
  tabs: TabMeta[];
  entries: ContentEntry[];
}

export interface ClaudeEntry extends ContentEntry {
  kind: ClaudeKind;
  section: string;
  sourcePath: string;
}

export interface ClaudeSectionMeta {
  id: string;
  label: string;
  count: number;
}

export interface ClaudeManifest {
  generatedAt: string;
  sections: ClaudeSectionMeta[];
  entries: ClaudeEntry[];
}
