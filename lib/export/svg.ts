/**
 * Render a mermaid chart string to an SVG string, suitable for download or
 * for piping into the PNG renderer below.
 *
 * Uses the dynamic `mermaid` import so this never lands in the client bundle
 * unless explicitly imported.
 */
export async function renderMermaidToSvg(chart: string): Promise<string> {
    const mermaid = (await import('mermaid')).default;
    mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'strict' });
    const { svg } = await mermaid.render('export-' + Date.now(), chart.trim());
    return svg;
}

/**
 * Trigger a browser download for a Blob.
 */
export function downloadBlob(blob: Blob, filename: string) {
    if (typeof window === 'undefined') return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Defer revoke to allow the browser to fetch the blob.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadSvgString(svg: string, filename: string) {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    downloadBlob(blob, filename);
}
