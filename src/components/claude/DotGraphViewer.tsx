import { useEffect, useRef, useState } from 'react';
import { graphviz } from 'd3-graphviz';

interface DotGraphViewerProps {
  dot: string;
  title: string;
}

export function DotGraphViewer({ dot, title }: DotGraphViewerProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return undefined;
    }

    let disposed = false;
    setError(null);
    setReady(false);
    host.replaceChildren();

    try {
      const renderer = graphviz(host, {
        fit: true,
        useWorker: false,
        zoom: true,
      });

      renderer
        .zoom(true)
        .renderDot(dot, () => {
          if (!disposed) {
            setReady(true);
          }
        });

      return () => {
        disposed = true;
        if (typeof renderer.destroy === 'function') {
          renderer.destroy();
        }
        host.replaceChildren();
      };
    } catch (caughtError) {
      if (!disposed) {
        setError(caughtError instanceof Error ? caughtError.message : 'Graph render failed.');
      }
    }

    return undefined;
  }, [dot]);

  if (error) {
    return (
      <div className="claude-graph-fallback">
        <div className="claude-graph-fallback-title">Graph render failed</div>
        <p>{error}</p>
        <pre className="claude-source-block">
          <code>{dot}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="claude-graph-panel">
      <div className="claude-graph-toolbar">
        <span>{title}</span>
        <span>{ready ? 'interactive graph ready' : 'rendering graph...'}</span>
      </div>
      <div className="claude-graph-canvas" ref={hostRef} />
    </div>
  );
}
