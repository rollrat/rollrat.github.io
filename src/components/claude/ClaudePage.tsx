import { useEffect, useMemo, useState } from 'react';
import type { ClaudeEntry, ClaudeManifest } from '../../types';
import { ClaudeDetail } from './ClaudeDetail';

interface ClaudePageProps {
  defaultContentPath: string;
  manifest: ClaudeManifest;
  onExit: () => void;
  onSelect: (id: string) => void;
  onToggleTheme: () => void;
  selectedId: string | null;
  theme: 'dark' | 'light';
}

const ALL_FILTER = 'all';

function formatSectionLabel(section: string): string {
  return section.charAt(0).toUpperCase() + section.slice(1);
}

export function ClaudePage({
  defaultContentPath,
  manifest,
  onExit,
  onSelect,
  onToggleTheme,
  selectedId,
  theme,
}: ClaudePageProps) {
  const selectedEntry = selectedId
    ? manifest.entries.find(entry => entry.id === selectedId) ?? null
    : null;

  const [activeFilter, setActiveFilter] = useState<string>(selectedEntry?.section ?? ALL_FILTER);

  useEffect(() => {
    if (selectedEntry) {
      setActiveFilter(selectedEntry.section);
    }
  }, [selectedEntry]);

  const filteredEntries = useMemo(() => (
    activeFilter === ALL_FILTER
      ? manifest.entries
      : manifest.entries.filter(entry => entry.section === activeFilter)
  ), [activeFilter, manifest.entries]);

  const focusedEntry: ClaudeEntry | null = selectedEntry ?? filteredEntries[0] ?? manifest.entries[0] ?? null;
  const graphCount = manifest.entries.filter(entry => entry.kind !== 'note').length;
  const noteCount = manifest.entries.filter(entry => entry.kind === 'note').length;

  return (
    <div className="claude-shell">
      <header className="claude-topbar">
        <div>
          <div className="claude-topbar-kicker">rollrat / claude workspace</div>
          <div className="claude-topbar-title">Claude Graph Lab</div>
        </div>

        <div className="claude-topbar-actions">
          <button className="claude-topbar-btn ghost" onClick={onExit} type="button">
            Back To Briefing
          </button>
          <a className="claude-topbar-btn ghost" href={defaultContentPath}>
            Archive
          </a>
          <button className="claude-topbar-btn" onClick={onToggleTheme} type="button">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      <section className="claude-hero-panel">
        <div className="claude-hero-copy">
          <div className="claude-hero-label">Dedicated Route</div>
          <h1>Separate UI for Claude analysis notes and DOT graphs.</h1>
          <p>
            The main archive stays untouched. This route is now a standalone workspace
            with its own layout, its own navigation, and a proper graph viewport for
            Graphviz sources.
          </p>
        </div>

        <div className="claude-stat-grid">
          <div className="claude-stat-card">
            <span className="claude-stat-value">{manifest.entries.length}</span>
            <span className="claude-stat-label">mirrored files</span>
          </div>
          <div className="claude-stat-card">
            <span className="claude-stat-value">{graphCount}</span>
            <span className="claude-stat-label">graph sources</span>
          </div>
          <div className="claude-stat-card">
            <span className="claude-stat-value">{noteCount}</span>
            <span className="claude-stat-label">notes</span>
          </div>
        </div>
      </section>

      <div className="claude-layout">
        <aside className="claude-sidebar">
          <div className="claude-sidebar-section">
            <div className="claude-sidebar-title">Sections</div>
            <div className="claude-filter-stack">
              <button
                className={`claude-filter-chip${activeFilter === ALL_FILTER ? ' active' : ''}`}
                onClick={() => setActiveFilter(ALL_FILTER)}
                type="button"
              >
                <span>All Files</span>
                <span>{manifest.entries.length}</span>
              </button>

              {manifest.sections.map(section => (
                <button
                  key={section.id}
                  className={`claude-filter-chip${activeFilter === section.id ? ' active' : ''}`}
                  onClick={() => setActiveFilter(section.id)}
                  type="button"
                >
                  <span>{section.label}</span>
                  <span>{section.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="claude-sidebar-section">
            <div className="claude-sidebar-title">Files</div>
            <div className="claude-file-list">
              {filteredEntries.map(entry => {
                const isActive = focusedEntry?.id === entry.id;

                return (
                  <button
                    key={entry.id}
                    className={`claude-file-item${isActive ? ' active' : ''}`}
                    onClick={() => onSelect(entry.id)}
                    type="button"
                  >
                    <div className="claude-file-item-top">
                      <span className={`claude-kind-badge ${entry.kind}`}>{entry.kind}</span>
                      <span className="claude-file-date">{entry.date || 'undated'}</span>
                    </div>
                    <div className="claude-file-title">{entry.title}</div>
                    <div className="claude-file-summary">{entry.summary}</div>
                    <div className="claude-file-meta">
                      <span>{formatSectionLabel(entry.section)}</span>
                      <span>{entry.sourcePath}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="claude-stage">
          {focusedEntry ? (
            <ClaudeDetail entry={focusedEntry} />
          ) : (
            <div className="claude-stage-empty">
              <div className="claude-stage-empty-title">No Claude files loaded</div>
              <p>Add markdown or dot files under the mirrored Claude source folders.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
