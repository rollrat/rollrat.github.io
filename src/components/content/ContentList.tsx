import type { Tab, ContentEntry } from '../../types';
import { TAB_LABELS } from '../../types';
import { ContentCard } from './ContentCard';

interface ContentListProps {
  tab: Tab;
  entries: ContentEntry[];
  onSelect: (id: string) => void;
}

export function ContentList({ tab, entries, onSelect }: ContentListProps) {
  const filtered = entries.filter(e => e.tab === tab);

  return (
    <div className="content-list">
      <div className="sec-head">
        <span className="sec-num">01</span>
        <span className="sec-title">// {TAB_LABELS[tab].toLowerCase().replace(' ', '_')}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">NO_DATA_FOUND</div>
          <div className="empty-state-sub">content/{tab}/ 폴더에 .md 파일을 추가하세요</div>
        </div>
      ) : (
        <div className="content-cards">
          {filtered.map(entry => (
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
