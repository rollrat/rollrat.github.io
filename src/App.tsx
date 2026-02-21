import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import type { Tab, Manifest } from './types';
import { BackgroundLayers } from './components/layout/BackgroundLayers';
import { TopBar } from './components/layout/TopBar';
import { TabNav } from './components/layout/TabNav';
import { ContentList } from './components/content/ContentList';
import { ContentDetail } from './components/content/ContentDetail';
import { Footer } from './components/layout/Footer';
import manifestData from './generated/content-manifest.json';

const manifest = manifestData as unknown as Manifest;

function getStoredTheme(): 'dark' | 'light' {
  try {
    const v = localStorage.getItem('theme');
    if (v === 'light' || v === 'dark') return v;
  } catch { /* ignore */ }
  return 'dark';
}

// ── Inner app (inside Router context) ────────────────────────────────────────

function AppShell({ theme, onToggleTheme }: { theme: 'dark' | 'light'; onToggleTheme: () => void }) {
  const { tab, id } = useParams<{ tab?: string; id?: string }>();
  const navigate = useNavigate();

  const validTabIds = manifest.tabs.map(t => t.id);
  const defaultTab = validTabIds[0] ?? 'youtube';
  const activeTab: Tab = (tab && validTabIds.includes(tab) ? tab : defaultTab);

  function handleTabChange(t: Tab) {
    navigate(`/${t}`);
  }

  function handleSelect(entryId: string) {
    navigate(`/${activeTab}/${encodeURIComponent(entryId)}`);
  }

  function handleBack() {
    navigate(`/${activeTab}`);
  }

  const decodedId = id ? decodeURIComponent(id) : null;
  const selectedEntry = decodedId ? manifest.entries.find(e => e.id === decodedId) : null;

  return (
    <>
      <BackgroundLayers />
      <main>
        <TopBar theme={theme} onToggleTheme={onToggleTheme} />
        <TabNav activeTab={activeTab} tabs={manifest.tabs} entries={manifest.entries} onTabChange={handleTabChange} />
        <div className="content-area">
          {selectedEntry ? (
            <ContentDetail entry={selectedEntry} onBack={handleBack} />
          ) : (
            <ContentList tab={activeTab} tabs={manifest.tabs} entries={manifest.entries} onSelect={handleSelect} />
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch { /* ignore */ }
  }, [theme]);

  function toggleTheme() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }

  const defaultTab = manifest.tabs[0]?.id ?? 'youtube';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/${defaultTab}`} replace />} />
        <Route path="/:tab" element={<AppShell theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/:tab/:id" element={<AppShell theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="*" element={<Navigate to={`/${defaultTab}`} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
