import type { Tab, TabMeta, ContentEntry } from '../../types';

interface TabNavProps {
  activeTab: Tab;
  tabs: TabMeta[];
  entries: ContentEntry[];
  onTabChange: (tab: Tab) => void;
}

export function TabNav({ activeTab, tabs, entries, onTabChange }: TabNavProps) {
  return (
    <div className="tabnav">
      {tabs.map(tabMeta => {
        const count = entries.filter(e => e.tab === tabMeta.id).length;
        return (
          <button
            key={tabMeta.id}
            className={`tabnav-btn${activeTab === tabMeta.id ? ' active' : ''}`}
            onClick={() => onTabChange(tabMeta.id)}
          >
            {tabMeta.label}
            <span className="tabnav-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
