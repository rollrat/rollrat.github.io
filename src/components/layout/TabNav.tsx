import type { Tab, ContentEntry } from '../../types';
import { TAB_LABELS } from '../../types';

const TAB_ORDER: Tab[] = ['youtube', 'community', 'research', 'daily'];

interface TabNavProps {
  activeTab: Tab;
  entries: ContentEntry[];
  onTabChange: (tab: Tab) => void;
}

export function TabNav({ activeTab, entries, onTabChange }: TabNavProps) {
  const counts = TAB_ORDER.reduce<Record<Tab, number>>(
    (acc, tab) => {
      acc[tab] = entries.filter(e => e.tab === tab).length;
      return acc;
    },
    { youtube: 0, community: 0, research: 0, daily: 0 }
  );

  return (
    <div className="tabnav">
      {TAB_ORDER.map(tab => (
        <button
          key={tab}
          className={`tabnav-btn${activeTab === tab ? ' active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {TAB_LABELS[tab]}
          <span className="tabnav-count">{counts[tab]}</span>
        </button>
      ))}
    </div>
  );
}
