/// <reference types="vite/client" />

declare module 'd3-graphviz' {
  interface GraphvizOptions {
    fit?: boolean;
    useWorker?: boolean;
    zoom?: boolean;
  }

  interface GraphvizRenderer {
    destroy(): void;
    renderDot(dot: string, callback?: () => void): GraphvizRenderer;
    zoom(enabled: boolean): GraphvizRenderer;
  }

  export function graphviz(selector: string | Element, options?: GraphvizOptions): GraphvizRenderer;
}
