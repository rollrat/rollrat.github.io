import { useMemo, useState } from 'react';
import type { ClaudeEntry } from '../../types';
import { DotGraphViewer } from './DotGraphViewer';

interface ClaudeDetailProps {
  entry: ClaudeEntry;
}

type ViewMode = 'rendered' | 'source';

export function ClaudeDetail({ entry }: ClaudeDetailProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('rendered');

  const isGraphEntry = entry.kind !== 'note';
  const rawText = entry.markdown ?? entry.summary;

  const chips = useMemo(() => [
    `section:${entry.section}`,
    `kind:${entry.kind}`,
    ...(entry.date ? [`updated:${entry.date}`] : []),
  ], [entry.date, entry.kind, entry.section]);

  function handleCopy() {
    navigator.clipboard.writeText(rawText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <article className="claude-detail">
      <div className="claude-detail-header">
        <div className="claude-detail-meta">
          <div className="claude-detail-channel">{entry.channel ?? 'CLAUDE'}</div>
          <h2>{entry.title}</h2>
          <p>{entry.summary}</p>

          <div className="claude-chip-row">
            {chips.map(chip => (
              <span key={chip} className="claude-meta-chip">
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="claude-detail-actions">
          {isGraphEntry && (
            <div className="claude-toggle-group">
              <button
                className={`claude-toggle-btn${viewMode === 'rendered' ? ' active' : ''}`}
                onClick={() => setViewMode('rendered')}
                type="button"
              >
                Rendered
              </button>
              <button
                className={`claude-toggle-btn${viewMode === 'source' ? ' active' : ''}`}
                onClick={() => setViewMode('source')}
                type="button"
              >
                Source
              </button>
            </div>
          )}

          <button className="claude-copy-btn" onClick={handleCopy} type="button">
            {copied ? 'Copied' : 'Copy Source'}
          </button>
        </div>
      </div>

      <div className="claude-source-pill">
        <span>source</span>
        <code>{entry.sourcePath}</code>
      </div>

      <div className="claude-detail-body">
        {isGraphEntry ? (
          viewMode === 'rendered' ? (
            <DotGraphViewer dot={rawText} title={entry.title} />
          ) : (
            <pre className="claude-source-block">
              <code>{rawText}</code>
            </pre>
          )
        ) : (
          <div
            className="md-content claude-note-body"
            dangerouslySetInnerHTML={{ __html: entry.html }}
          />
        )}
      </div>
    </article>
  );
}
