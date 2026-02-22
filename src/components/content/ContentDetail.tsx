import { useState } from 'react';
import type { ContentEntry } from '../../types';

interface ContentDetailProps {
  entry: ContentEntry;
  onBack: () => void;
}

export function ContentDetail({ entry, onBack }: ContentDetailProps) {
  const [copied, setCopied] = useState(false);

  const videoUrl = entry.videoId
    ? `https://www.youtube.com/watch?v=${entry.videoId}`
    : null;

  function handleCopy() {
    const text = entry.markdown ?? entry.summary;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="detail-wrapper">
      <div className="detail-top-actions">
        <button className="detail-back" onClick={onBack}>
          ‹ BACK
        </button>
        <button className={`detail-copy${copied ? ' copied' : ''}`} onClick={handleCopy}>
          {copied ? '✓ COPIED' : '⎘ COPY'}
        </button>
      </div>

      <div className="detail-header">
        {entry.channel && (
          <div className="detail-channel">{entry.channel}</div>
        )}
        <div className="detail-title">{entry.title}</div>

        <div className="detail-meta-row">
          {entry.date && (
            <span>date: <span className="detail-meta-val">{entry.date}</span></span>
          )}
          {entry.duration && (
            <span>duration: <span className="detail-meta-val">{entry.duration}</span></span>
          )}
          {entry.type === 'BATCH' && entry.itemCount != null && (
            <span>videos: <span className="detail-meta-val">{entry.itemCount}</span></span>
          )}
          {entry.ticker && (
            <span>ticker: <span className="detail-meta-val">{entry.ticker}</span></span>
          )}
        </div>

        {videoUrl && (
          <a
            className="detail-video-link"
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            ▶ YouTube에서 보기
          </a>
        )}

        {entry.tags.length > 0 && (
          <div className="detail-tags">
            {entry.tags.map(tag => (
              <span key={tag} className="detail-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="detail-body">
        <div
          className="md-content"
          dangerouslySetInnerHTML={{ __html: entry.html }}
        />
      </div>
    </div>
  );
}
