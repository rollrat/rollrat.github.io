import { useState } from 'react';
import type { Tab, TabMeta, ContentEntry } from '../../types';
import { ContentCard } from './ContentCard';

interface ContentListProps {
  tab: Tab;
  tabs: TabMeta[];
  entries: ContentEntry[];
  onSelect: (id: string) => void;
}

export function ContentList({ tab, tabs, entries, onSelect }: ContentListProps) {
  const tabMeta = tabs.find(t => t.id === tab);
  const filtered = entries.filter(e => e.tab === tab);

  const subgroups = tabMeta?.hasSubgroups
    ? [...new Set(filtered.map(e => e.subgroup).filter(Boolean) as string[])].sort().reverse()
    : [];

  const [activeSubgroup, setActiveSubgroup] = useState<string | null>(
    subgroups.length > 0 ? subgroups[0] : null
  );

  const displayed = tabMeta?.hasSubgroups && activeSubgroup
    ? filtered.filter(e => e.subgroup === activeSubgroup)
    : filtered;

  const label = tabMeta?.label ?? tab;
  const secTitle = `// ${label.toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <div className="content-list">
      <div className="sec-head">
        <span className="sec-num">01</span>
        <span className="sec-title">{secTitle}</span>
      </div>

      {tabMeta?.hasSubgroups && subgroups.length > 0 && (
        <div className="subtab-nav">
          {subgroups.map(sg => (
            <button
              key={sg}
              className={`subtab-btn${activeSubgroup === sg ? ' active' : ''}`}
              onClick={() => setActiveSubgroup(sg)}
            >
              {sg}
            </button>
          ))}
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">NO_DATA_FOUND</div>
          <div className="empty-state-sub">content/{tab}/ 폴더에 .md 파일을 추가하세요</div>
        </div>
      ) : (
        <div className="content-cards">
          {displayed.map(entry => (
            <ContentCard
              key={entry.id}
              entry={entry}
              onClick={() => onSelect(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
