import type { ContentEntry } from '../../types';

interface ContentCardProps {
  entry: ContentEntry;
  onClick: () => void;
}

export function ContentCard({ entry, onClick }: ContentCardProps) {
  return (
    <div className="content-card" onClick={onClick}>
      <div className="card-meta">
        {entry.date && (
          <div className="card-date">
            {entry.date.replace(/-/g, '.')}
          </div>
        )}
        <div className={`card-type-badge${entry.type === 'BATCH' ? ' batch' : ''}`}>
          {entry.type === 'BATCH' ? 'BATCH' : 'SINGLE'}
        </div>
        {entry.type === 'BATCH' && entry.itemCount != null && entry.itemCount > 0 && (
          <div className="card-count-badge">{entry.itemCount} VIDEOS</div>
        )}
      </div>

      <div className="card-body">
        {entry.channel && (
          <div className="card-channel">{entry.channel}</div>
        )}
        <div className="card-title">{entry.title}</div>
        <div className="card-summary">{entry.summary}</div>
        {entry.tags.length > 0 && (
          <div className="card-tags">
            {entry.tags.slice(0, 5).map(tag => (
              <span key={tag} className="card-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <span className="card-arrow">›</span>
    </div>
  );
}
