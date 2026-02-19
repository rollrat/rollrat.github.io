import { useState, useEffect } from 'react';
import type { Tab, ContentEntry } from './types';
import { BackgroundLayers } from './components/layout/BackgroundLayers';
import { TopBar } from './components/layout/TopBar';
import { TabNav } from './components/layout/TabNav';
import { ContentList } from './components/content/ContentList';
import { ContentDetail } from './components/content/ContentDetail';
import { Footer } from './components/layout/Footer';
import manifestData from './generated/content-manifest.json';

// Manifest is generated at build time by scripts/build-content.ts
const manifest = manifestData as unknown as ContentEntry[];

function getStoredTheme(): 'dark' | 'light' {
  try {
    const v = localStorage.getItem('theme');
    if (v === 'light' || v === 'dark') return v;
  } catch {
    // ignore
  }
  return 'dark';
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getStoredTheme);
  const [activeTab, setActiveTab] = useState<Tab>('youtube');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  function toggleTheme() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setSelectedId(null);
  }

  const selectedEntry = selectedId ? manifest.find(e => e.id === selectedId) : null;

  return (
    <>
      <BackgroundLayers />
      <main>
        <TopBar theme={theme} onToggleTheme={toggleTheme} />
        <TabNav
          activeTab={activeTab}
          entries={manifest}
          onTabChange={handleTabChange}
        />
        <div className="content-area">
          {selectedEntry ? (
            <ContentDetail
              entry={selectedEntry}
              onBack={() => setSelectedId(null)}
            />
          ) : (
            <ContentList
              tab={activeTab}
              entries={manifest}
              onSelect={setSelectedId}
            />
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}
