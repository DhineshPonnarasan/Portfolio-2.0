import { downloadBlob } from './svg';

const SVG_FONT_FAMILY = 'Inter, "Helvetica Neue", Arial, sans-serif';

/**
 * Render an SVG string into a PNG Blob via an offscreen Image → Canvas
 * pipeline. We inline a default font-family on the SVG <text> elements so
 * the rasterised output is legible even when the page fonts haven't fully
 * loaded.
 *
 * Resolution defaults to 2× the SVG's natural size for crisp output on
 * hi-DPI displays.
 */
export async function svgStringToPngBlob(
    svg: string,
    scale = 2,
): Promise<Blob> {
    if (typeof window === 'undefined') {
        throw new Error('svgStringToPngBlob must run in the browser');
    }

    // Inject a default font family on text/foreignObject nodes so the rendered
    // PNG is legible without relying on the host page's @font-face rules.
    const inlined = svg
        .replace(/<text\b/g, `<text font-family="${SVG_FONT_FAMILY}"`)
        .replace(/<tspan\b/g, `<tspan font-family="${SVG_FONT_FAMILY}"`);

    const blob = new Blob([inlined], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    try {
        const img = await loadImage(url);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context unavailable');
        ctx.fillStyle = '#0b1020';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const png = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((b) => resolve(b), 'image/png'),
        );
        if (!png) throw new Error('Failed to encode PNG');
        return png;
    } finally {
        URL.revokeObjectURL(url);
    }
}

function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load SVG into <img>'));
        img.crossOrigin = 'anonymous';
        img.src = url;
    });
}

export async function downloadMermaidPng(chart: string, filename: string, scale = 2) {
    const { renderMermaidToSvg } = await import('./svg');
    const svg = await renderMermaidToSvg(chart);
    const png = await svgStringToPngBlob(svg, scale);
    downloadBlob(png, filename);
}
