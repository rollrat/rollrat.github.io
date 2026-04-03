import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import type { ClaudeManifest, Manifest, Tab } from './types';
import { ClaudePage } from './components/claude/ClaudePage';
import { ContentDetail } from './components/content/ContentDetail';
import { ContentList } from './components/content/ContentList';
import { BackgroundLayers } from './components/layout/BackgroundLayers';
import { Footer } from './components/layout/Footer';
import { TabNav } from './components/layout/TabNav';
import { TopBar } from './components/layout/TopBar';
import claudeManifestData from './generated/claude-manifest.json';
import manifestData from './generated/content-manifest.json';

const manifest = manifestData as unknown as Manifest;
const claudeManifest = claudeManifestData as unknown as ClaudeManifest;

function getStoredTheme(): 'dark' | 'light' {
  try {
    const value = localStorage.getItem('theme');
    if (value === 'light' || value === 'dark') {
      return value;
    }
  } catch {
    // Ignore storage access issues.
  }

  return 'dark';
}

interface ShellProps {
  defaultContentPath: string;
  onToggleTheme: () => void;
  theme: 'dark' | 'light';
}

interface SiteFrameProps extends ShellProps {
  activeSection: 'briefing' | 'claude';
  children: ReactNode;
}

function SiteFrame({ activeSection, children, defaultContentPath, onToggleTheme, theme }: SiteFrameProps) {
  return (
    <>
      <BackgroundLayers />
      <main>
        <TopBar
          activeSection={activeSection}
          defaultContentPath={defaultContentPath}
          onToggleTheme={onToggleTheme}
          theme={theme}
        />
        {children}
        <Footer />
      </main>
    </>
  );
}

function ContentShell({ defaultContentPath, onToggleTheme, theme }: ShellProps) {
  const { id, tab } = useParams<{ id?: string; tab?: string }>();
  const navigate = useNavigate();

  const validTabIds = manifest.tabs.map(tabMeta => tabMeta.id);
  const fallbackTab = validTabIds[0] ?? 'youtube';
  const activeTab: Tab = tab && validTabIds.includes(tab) ? tab : fallbackTab;

  const decodedId = id ? decodeURIComponent(id) : null;
  const selectedEntry = decodedId ? manifest.entries.find(entry => entry.id === decodedId) ?? null : null;

  function handleBack() {
    navigate(`/${activeTab}`);
  }

  function handleSelect(entryId: string) {
    navigate(`/${activeTab}/${encodeURIComponent(entryId)}`);
  }

  function handleTabChange(nextTab: Tab) {
    navigate(`/${nextTab}`);
  }

  return (
    <SiteFrame
      activeSection="briefing"
      defaultContentPath={defaultContentPath}
      onToggleTheme={onToggleTheme}
      theme={theme}
    >
      <TabNav
        activeTab={activeTab}
        entries={manifest.entries}
        onTabChange={handleTabChange}
        tabs={manifest.tabs}
      />
      <div className="content-area">
        {selectedEntry ? (
          <ContentDetail entry={selectedEntry} onBack={handleBack} />
        ) : (
          <ContentList
            entries={manifest.entries}
            onSelect={handleSelect}
            tab={activeTab}
            tabs={manifest.tabs}
          />
        )}
      </div>
    </SiteFrame>
  );
}

function ClaudeShell({ defaultContentPath, onToggleTheme, theme }: ShellProps) {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const selectedId = id ? decodeURIComponent(id) : null;

  function handleSelect(entryId: string) {
    navigate(`/claude/${encodeURIComponent(entryId)}`);
  }

  return (
    <ClaudePage
      defaultContentPath={defaultContentPath}
      manifest={claudeManifest}
      onExit={() => navigate(defaultContentPath)}
      onSelect={handleSelect}
      onToggleTheme={onToggleTheme}
      selectedId={selectedId}
      theme={theme}
    />
  );
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Ignore storage access issues.
    }
  }, [theme]);

  function toggleTheme() {
    setTheme(current => (current === 'dark' ? 'light' : 'dark'));
  }

  const defaultTab = manifest.tabs[0]?.id ?? 'youtube';
  const defaultContentPath = `/${defaultTab}`;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to={defaultContentPath} />} />
        <Route
          path="/claude"
          element={
            <ClaudeShell
              defaultContentPath={defaultContentPath}
              onToggleTheme={toggleTheme}
              theme={theme}
            />
          }
        />
        <Route
          path="/claude/:id"
          element={
            <ClaudeShell
              defaultContentPath={defaultContentPath}
              onToggleTheme={toggleTheme}
              theme={theme}
            />
          }
        />
        <Route
          path="/:tab"
          element={
            <ContentShell
              defaultContentPath={defaultContentPath}
              onToggleTheme={toggleTheme}
              theme={theme}
            />
          }
        />
        <Route
          path="/:tab/:id"
          element={
            <ContentShell
              defaultContentPath={defaultContentPath}
              onToggleTheme={toggleTheme}
              theme={theme}
            />
          }
        />
        <Route path="*" element={<Navigate replace to={defaultContentPath} />} />
      </Routes>
    </BrowserRouter>
  );
}
