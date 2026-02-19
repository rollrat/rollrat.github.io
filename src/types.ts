export type Tab = 'youtube' | 'community' | 'research' | 'daily';
export type Format = 'SINGLE' | 'BATCH';

export interface ContentEntry {
  id: string;
  tab: Tab;
  type: Format;
  title: string;
  date: string;
  tags: string[];
  html: string;
  summary: string;
  videoId?: string;
  channel?: string;
  duration?: string;
  itemCount?: number;
  ticker?: string;
  verdict?: string;
}

export const TAB_LABELS: Record<Tab, string> = {
  youtube: '유튜브 요약',
  community: '커뮤니티',
  research: '리서치',
  daily: '일일 요약',
};
