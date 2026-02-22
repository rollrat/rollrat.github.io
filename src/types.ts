export type Tab = string;
export type Format = 'SINGLE' | 'BATCH';

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
