import { useEffect, useRef, useState } from 'react';
import { graphviz } from 'd3-graphviz';

interface DotGraphViewerProps {
  dot: string;
  title: string;
}

function fitGraphHeightToCanvas(host: HTMLDivElement) {
  const svg = host.querySelector('svg');
  if (!(svg instanceof SVGSVGElement)) {
    return;
  }

  const styles = window.getComputedStyle(host);
  const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
  const targetHeight = Math.max(host.clientHeight - paddingTop - paddingBottom, 0);

  if (targetHeight <= 0) {
    return;
  }

  svg.style.width = '100%';
  svg.style.height = `${targetHeight}px`;
  svg.setAttribute('preserveAspectRatio', 'none');
}

function normalizeGraphTransform(host: HTMLDivElement) {
  const graph = host.querySelector('svg g.graph');
  if (!(graph instanceof SVGGElement)) {
    return;
  }

  const transform = graph.getAttribute('transform') ?? '';
  const match = transform.match(/scale\(([-0-9.]+)\)/);
  const scale = match ? Number(match[1]) : 1;

  try {
    const box = graph.getBBox();
    graph.setAttribute('transform', `translate(${-box.x},${-box.y}) scale(${scale})`);
  } catch {
    // Ignore bbox read failures and keep the renderer output as-is.
  }
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
    let frameId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    setError(null);
    setReady(false);
    host.replaceChildren();

    const syncGraphLayout = () => {
      normalizeGraphTransform(host);
      fitGraphHeightToCanvas(host);
    };

    const scheduleSync = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        if (!disposed) {
          syncGraphLayout();
        }
      });
    };

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
            scheduleSync();
            setReady(true);
          }
        });

      resizeObserver = new ResizeObserver(() => {
        if (!disposed) {
          scheduleSync();
        }
      });

      resizeObserver.observe(host);

      return () => {
        disposed = true;
        if (frameId !== null) {
          cancelAnimationFrame(frameId);
        }
        resizeObserver?.disconnect();
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
