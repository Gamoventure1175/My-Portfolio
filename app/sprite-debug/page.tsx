'use client'
import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

const SHEETS = [
    { name: 'mario', src: '/assets/mario/mario.png' },
    { name: 'characters', src: '/assets/mario/characters.gif' },
    { name: 'blocks', src: '/assets/mario/blocks.png' },
    { name: 'items-objects', src: '/assets/mario/items-objects.png' },
    { name: 'items-objects-2', src: '/assets/mario/items-objects-2.png' },
    { name: 'bg-1-1', src: '/assets/mario/bg-1-1.png' },
    { name: 'bg-1-2', src: '/assets/mario/bg-1-2.png' },
    { name: 'bg-5-1', src: '/assets/mario/bg-5-1.png' },
    { name: 'misc', src: '/assets/mario/misc.gif' },
    { name: 'misc-2', src: '/assets/mario/misc-2.gif' },
    { name: 'misc-4', src: '/assets/mario/misc-4.gif' },
    { name: 'bg-clouds', src: '/assets/mario/bg-clouds.png' },

]

interface Sel { x: number; y: number; w: number; h: number }

function snapTo(v: number, snap: number) {
    return snap <= 1 ? v : Math.round(v / snap) * snap
}

export default function SpriteDebug() {
    const [sheet, setSheet] = useState(SHEETS[0])
    const [zoom, setZoom] = useState(2)
    const [snap, setSnap] = useState(1)
    const [cursor, setCursor] = useState({ x: 0, y: 0 })
    const [start, setStart] = useState<{ x: number; y: number } | null>(null)
    const [sel, setSel] = useState<Sel | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
    const [saved, setSaved] = useState<Array<Sel & { name: string; sheet: string }>>([])
    const [spriteName, setSpriteName] = useState('')
    const [manualMode, setManualMode] = useState(false)
    const [manual, setManual] = useState({ x: '0', y: '0', w: '16', h: '16' })

    // ── Two separate refs: the scrollable container, and the image wrapper inside it ──
    const scrollRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // KEY FIX: use container's bounding rect but add scroll offsets from the scroll container
    const toImageCoords = useCallback((e: React.MouseEvent) => {
        const scroll = scrollRef.current!
        const container = containerRef.current!
        const rect = container.getBoundingClientRect()

        // Without adding scrollLeft/scrollTop, coords drift as soon as you scroll the sheet
        const rawX = e.clientX - rect.left + scroll.scrollLeft
        const rawY = e.clientY - rect.top + scroll.scrollTop

        const x = snapTo(Math.floor(rawX / zoom), snap)
        const y = snapTo(Math.floor(rawY / zoom), snap)
        return { x: Math.max(0, x), y: Math.max(0, y) }
    }, [zoom, snap])

    function onMouseMove(e: React.MouseEvent) {
        const pos = toImageCoords(e)
        setCursor(pos)
        if (isDragging && start) {
            setSel({
                x: Math.min(start.x, pos.x),
                y: Math.min(start.y, pos.y),
                w: Math.abs(pos.x - start.x),
                h: Math.abs(pos.y - start.y),
            })
        }
    }

    function onMouseDown(e: React.MouseEvent) {
        if (manualMode) return
        e.preventDefault()
        const pos = toImageCoords(e)
        setStart(pos)
        setIsDragging(true)
        setSel(null)
    }

    function onMouseUp() { setIsDragging(false) }

    const manualSel: Sel | null = manualMode
        ? { x: +manual.x || 0, y: +manual.y || 0, w: +manual.w || 0, h: +manual.h || 0 }
        : null

    const activeSel = manualMode ? manualSel : sel

    function saveSprite() {
        if (!activeSel || activeSel.w < 1 || !spriteName.trim()) return
        setSaved(prev => [...prev, { ...activeSel, name: spriteName.trim(), sheet: sheet.name }])
        setSpriteName('')
    }

    function exportCode() {
        if (saved.length === 0) return
        const lines = [
            '// Sprite definitions — paste into lib/mario/sprites.ts',
            '',
            ...saved.map(s =>
                `  '${s.name}': { sheet: '${s.sheet}', x: ${s.x}, y: ${s.y}, w: ${s.w}, h: ${s.h} },`
            ),
        ]
        navigator.clipboard.writeText(lines.join('\n'))
        alert('Copied!')
    }

    const s = activeSel

    return (
        <div style={{ fontFamily: 'monospace', fontSize: 13, padding: 16, background: '#1a1a2e', minHeight: '100vh', color: '#e0e0e0' }}>
            <h1 style={{ color: '#ffd700', marginTop: 0, fontFamily: 'sans-serif', fontSize: 20 }}>🍄 Sprite Inspector</h1>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                <label>Sheet:&nbsp;
                    <select value={sheet.name} onChange={e => {
                        setSheet(SHEETS.find(sh => sh.name === e.target.value)!)
                        setSel(null)
                    }} style={selectStyle}>
                        {SHEETS.map(sh => <option key={sh.name} value={sh.name}>{sh.name}</option>)}
                    </select>
                </label>

                <label>Zoom:&nbsp;
                    <select value={zoom} onChange={e => setZoom(+e.target.value)} style={selectStyle}>
                        {[1, 2, 3, 4, 6].map(z => <option key={z} value={z}>{z}×</option>)}
                    </select>
                </label>

                <label>Snap:&nbsp;
                    <select value={snap} onChange={e => setSnap(+e.target.value)} style={selectStyle}>
                        {[1, 8, 16, 32].map(n => <option key={n} value={n}>{n === 1 ? 'off' : `${n}px`}</option>)}
                    </select>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={manualMode} onChange={e => setManualMode(e.target.checked)} />
                    Manual coords
                </label>

                <span style={{ color: '#555' }}>{imgSize.w}×{imgSize.h}px</span>
                <span style={{ color: '#888' }}>cursor {cursor.x}, {cursor.y}</span>
            </div>

            {/* Manual input row */}
            {manualMode && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center', background: '#2a2a4e', padding: 10, borderRadius: 6, flexWrap: 'wrap' }}>
                    {(['x', 'y', 'w', 'h'] as const).map(k => (
                        <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ color: '#ffd700' }}>{k}:</span>
                            <input
                                value={manual[k]}
                                onChange={e => setManual(m => ({ ...m, [k]: e.target.value }))}
                                style={{ ...numInput, width: 64 }}
                                type="number" min="0"
                            />
                        </label>
                    ))}
                    <span style={{ color: '#444', fontSize: 11 }}>preview updates live</span>
                </div>
            )}

            {/* Sheet viewer — scrollRef wraps scrollRef contains containerRef */}
            <div
                ref={scrollRef}
                style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '55vh', border: '1px solid #333', borderRadius: 6 }}
            >
                <div
                    ref={containerRef}
                    style={{ position: 'relative', display: 'inline-block', cursor: manualMode ? 'default' : 'crosshair', userSelect: 'none' }}
                    onMouseMove={onMouseMove}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                >
                    {/* Pixel grid */}
                    <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
                        backgroundSize: `${16 * zoom}px ${16 * zoom}px`,
                    }} />

                    {/* Selection box — positioned in zoomed pixel space */}
                    {s && s.w > 1 && s.h > 1 && (
                        <div style={{
                            position: 'absolute',
                            left: s.x * zoom,
                            top: s.y * zoom,
                            width: s.w * zoom,
                            height: s.h * zoom,
                            border: '2px solid #ff4444',
                            background: 'rgba(255,68,68,0.15)',
                            pointerEvents: 'none',
                            zIndex: 2,
                            boxSizing: 'border-box',
                        }} />
                    )}

                    <Image
                        src={sheet.src}
                        alt={sheet.name}
                        width={imgSize.w || 1}
                        height={imgSize.h || 1}
                        unoptimized
                        style={{
                            display: 'block',
                            imageRendering: 'pixelated',
                            width: imgSize.w ? imgSize.w * zoom : 'auto',
                            height: imgSize.h ? imgSize.h * zoom : 'auto'
                        }}
                        onLoad={e => {
                            const img = e.target as HTMLImageElement
                            setImgSize({ w: img.naturalWidth, h: img.naturalHeight })
                        }}
                        draggable={false}
                    />
                </div>
            </div>

            {/* Bottom panel */}
            <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* Readout + save */}
                <div style={{ ...panel, minWidth: 280 }}>
                    <div style={panelTitle}>Selection</div>
                    {s && s.w > 0 ? (
                        <>
                            <div style={{ lineHeight: 2.2 }}>
                                {(['x', 'y', 'w', 'h'] as const).map(k => (
                                    <span key={k} style={{ marginRight: 16 }}>
                                        <span style={{ color: '#555' }}>{k} </span>
                                        <b style={{ color: '#7ec8e3' }}>{s[k]}</b>
                                    </span>
                                ))}
                            </div>
                            <div style={{ fontSize: 11, color: '#555', marginTop: 4, lineHeight: 1.9 }}>
                                background-position: -{s.x}px -{s.y}px<br />
                                width: {s.w}px; height: {s.h}px;
                            </div>
                            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                                <input
                                    value={spriteName}
                                    onChange={e => setSpriteName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && saveSprite()}
                                    placeholder="name, e.g. mario-walk-1"
                                    style={{ flex: 1, ...numInput }}
                                />
                                <button onClick={saveSprite} style={saveBtn}>Save</button>
                            </div>
                        </>
                    ) : (
                        <div style={{ color: '#444' }}>
                            {manualMode ? 'Enter coordinates above ↑' : 'Drag on the image to select a region'}
                        </div>
                    )}
                </div>

                {/* Preview */}
                {s && s.w >= 1 && s.h >= 1 && imgSize.w > 0 && (
                    <div style={panel}>
                        <div style={panelTitle}>Preview (4×)</div>
                        <div style={{
                            width: Math.min(s.w * 4, 320),
                            height: Math.min(s.h * 4, 320),
                            backgroundImage: `url(${sheet.src})`,
                            backgroundPosition: `-${s.x * 4}px -${s.y * 4}px`,
                            backgroundSize: `${imgSize.w * 4}px ${imgSize.h * 4}px`,
                            backgroundRepeat: 'no-repeat',
                            imageRendering: 'pixelated',
                            border: '1px solid #333',
                            // Checkerboard for transparent sprites
                            backgroundColor: '#111',
                            backgroundBlendMode: 'normal',
                        }} />
                        <div style={{ marginTop: 6, color: '#444', fontSize: 10 }}>{s.w}×{s.h} native px</div>
                    </div>
                )}

                {/* Saved list */}
                {saved.length > 0 && (
                    <div style={{ ...panel, flex: 1, minWidth: 300 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                            <span style={panelTitle}>Saved ({saved.length})</span>
                            <button onClick={exportCode} style={{ ...saveBtn, background: '#1a2a3a', color: '#7ec8e3', borderColor: '#2a4a5a' }}>
                                Copy as sprites.ts ↗
                            </button>
                        </div>
                        <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {saved.map((sp, i) => {
                                const src = SHEETS.find(sh => sh.name === sp.sheet)?.src
                                return (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 6px', background: '#1a1a2e', borderRadius: 4 }}>
                                        <div style={{
                                            width: Math.min(sp.w, 48) * 2, height: Math.min(sp.h, 48) * 2,
                                            backgroundImage: `url(${src})`,
                                            backgroundPosition: `-${sp.x * 2}px -${sp.y * 2}px`,
                                            backgroundSize: `${imgSize.w * 2}px ${imgSize.h * 2}px`,
                                            backgroundRepeat: 'no-repeat',
                                            imageRendering: 'pixelated',
                                            flexShrink: 0,
                                            border: '1px solid #222',
                                            backgroundColor: '#111',
                                        }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ color: '#ffd700', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sp.name}</div>
                                            <div style={{ color: '#444', fontSize: 10 }}>{sp.sheet} | {sp.x},{sp.y} · {sp.w}×{sp.h}</div>
                                        </div>
                                        <button onClick={() => setSaved(p => p.filter((_, j) => j !== i))}
                                            style={{ background: 'none', color: '#444', border: 'none', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}>
                                            ×
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: 16, color: '#333', fontSize: 11, lineHeight: 1.9 }}>
                <b style={{ color: '#444' }}>Scroll then drag</b> — selection stays locked to the image. &nbsp;
                <b style={{ color: '#444' }}>Snap 16px</b> — locks to NES tile boundaries. &nbsp;
                <b style={{ color: '#444' }}>Manual coords</b> — type x/y/w/h directly for precise control on large sheets.
            </div>
        </div>
    )
}

const selectStyle: React.CSSProperties = {
    background: '#2a2a4e', color: '#e0e0e0',
    border: '1px solid #444', padding: '3px 8px', borderRadius: 4,
}
const numInput: React.CSSProperties = {
    background: '#1a1a2e', color: '#7ec8e3',
    border: '1px solid #444', padding: '4px 8px', borderRadius: 4, fontSize: 12,
}
const saveBtn: React.CSSProperties = {
    background: '#3a5a3a', color: '#7ec87e',
    border: '1px solid #4a7a4a', padding: '4px 12px', borderRadius: 4, cursor: 'pointer',
}
const panel: React.CSSProperties = {
    background: '#2a2a4e', padding: 12, borderRadius: 6, border: '1px solid #333',
}
const panelTitle: React.CSSProperties = { color: '#ffd700', marginBottom: 8, fontSize: 12 }
