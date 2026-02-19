import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import type { Tab, ContentEntry } from './types';
import { BackgroundLayers } from './components/layout/BackgroundLayers';
import { TopBar } from './components/layout/TopBar';
import { TabNav } from './components/layout/TabNav';
import { ContentList } from './components/content/ContentList';
import { ContentDetail } from './components/content/ContentDetail';
import { Footer } from './components/layout/Footer';
import manifestData from './generated/content-manifest.json';

const manifest = manifestData as unknown as ContentEntry[];

const VALID_TABS: Tab[] = ['youtube', 'community', 'research', 'daily'];

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

  const activeTab = (VALID_TABS.includes(tab as Tab) ? tab : 'youtube') as Tab;

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
  const selectedEntry = decodedId ? manifest.find(e => e.id === decodedId) : null;

  return (
    <>
      <BackgroundLayers />
      <main>
        <TopBar theme={theme} onToggleTheme={onToggleTheme} />
        <TabNav activeTab={activeTab} entries={manifest} onTabChange={handleTabChange} />
        <div className="content-area">
          {selectedEntry ? (
            <ContentDetail entry={selectedEntry} onBack={handleBack} />
          ) : (
            <ContentList tab={activeTab} entries={manifest} onSelect={handleSelect} />
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/youtube" replace />} />
        <Route path="/:tab" element={<AppShell theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/:tab/:id" element={<AppShell theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="*" element={<Navigate to="/youtube" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
