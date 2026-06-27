/**
 * Pure parser for the architecture ASCII art.
 *
 * Reads the same monospace diagram that `SystemArchitectureDiagrams.tsx` renders
 * and extracts the coordinates needed to position a separate overlay layer
 * (status indicators, animated packets, scan-line) on top of the text.
 *
 * The parser does NOT mutate the diagram text. The ASCII output of the existing
 * component is byte-identical; the overlay is a sibling DOM element that
 * positions itself using these coordinates with CSS `ch` / `em` units.
 */

export type BoxPos = {
    number: number;
    topLine: number;
    bottomLine: number;
    leftCol: number;
    rightCol: number;
    contentLines: number[];
};

export type EdgePos = {
    fromBox: number;
    toBox: number;
    line: number;
    col: number;
    direction: 'down' | 'up';
};

export type ParsedDiagram = {
    boxes: BoxPos[];
    edges: EdgePos[];
    lineCount: number;
};

const isBorderLine = (line: string): boolean =>
    /^[+\-\s]+$/.test(line) && /[+\-]{3,}/.test(line);

const isConnectorLine = (line: string): boolean =>
    /^\s*[|v^↑↓]\s*$/.test(line) || /^\s*[<\->]{3,}\s*$/.test(line);

const findConnectorCol = (line: string): number => {
    // Prefer the actual arrow character if present; otherwise the pipe.
    const arrowMatch = line.match(/[v^↑↓]|->|<-/);
    if (arrowMatch && typeof arrowMatch.index === 'number') return arrowMatch.index;
    const pipeIdx = line.indexOf('|');
    if (pipeIdx >= 0) return pipeIdx;
    // Strip leading whitespace and report first non-space column.
    return line.length - line.trimStart().length;
};

const getConnectorDirection = (line: string): 'down' | 'up' => {
    const trimmed = line.trim();
    if (/[v↓]/.test(trimmed) || trimmed.startsWith('->') || trimmed.endsWith('->')) return 'down';
    if (/[\^↑]/.test(trimmed) || trimmed.startsWith('<-') || trimmed.endsWith('<-')) return 'up';
    return 'down';
};

const getBorderCols = (line: string): { left: number; right: number } => {
    const left = line.indexOf('+');
    const right = line.lastIndexOf('+');
    return { left: left >= 0 ? left : 0, right: right >= 0 ? right : line.length - 1 };
};

export function parseArchitectureDiagram(text: string): ParsedDiagram {
    const lines = text.split('\n');
    const boxes: BoxPos[] = [];
    const edges: EdgePos[] = [];

    let openBox: BoxPos | null = null;
    let implicitBoxCounter = 0;
    let lastSeenBoxNumber: number | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (isBorderLine(line)) {
            if (openBox) {
                const { left, right } = getBorderCols(line);
                openBox.leftCol = left;
                openBox.rightCol = right;
                openBox.bottomLine = i;
                boxes.push(openBox);
                // Remember the closed box so a following connector knows its source.
                lastSeenBoxNumber = openBox.number;
                openBox = null;
            } else {
                implicitBoxCounter += 1;
                openBox = {
                    number: implicitBoxCounter,
                    topLine: i,
                    bottomLine: i,
                    leftCol: 0,
                    rightCol: 0,
                    contentLines: [],
                };
            }
            continue;
        }

        if (isConnectorLine(line)) {
            const col = findConnectorCol(line);
            const direction = getConnectorDirection(line);
            if (lastSeenBoxNumber !== null) {
                const target = direction === 'down' ? lastSeenBoxNumber + 1 : lastSeenBoxNumber - 1;
                // The connector points to the next (or previous) box in the
                // canonical 1→2→3→4→5→6 flow. Allow the target to be a
                // future box that has not been parsed yet — it will be parsed
                // on the next iteration.
                if (target > 0) {
                    edges.push({
                        fromBox: lastSeenBoxNumber,
                        toBox: target,
                        line: i,
                        col,
                        direction,
                    });
                }
            }
            lastSeenBoxNumber = null;
            continue;
        }

        if (openBox) {
            openBox.contentLines.push(i);
            if (openBox.contentLines.length === 1) {
                const numMatch = line.match(/^\|\s*(\d+)\s*[.)]/);
                if (numMatch && numMatch[1]) {
                    openBox.number = parseInt(numMatch[1], 10);
                    implicitBoxCounter = Math.max(implicitBoxCounter, openBox.number);
                    lastSeenBoxNumber = openBox.number;
                }
            }
        }
    }

    if (openBox) boxes.push(openBox);

    return { boxes, edges, lineCount: lines.length };
}
