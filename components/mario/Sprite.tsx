import { type SpriteDef, SHEETS } from '@/lib/mario/sprites'

interface SpriteProps {
    def: SpriteDef
    scale?: number
    className?: string
    style?: React.CSSProperties,
    flipX?: boolean
}

export function Sprite({ def, scale = 2, className, style, flipX = false }: SpriteProps) {
    const sheet = SHEETS[def.sheet]

    return (
        <div
            className={className}
            style={{
                width: def.w * scale,
                height: def.h * scale,
                backgroundImage: `url(${sheet.src})`,
                backgroundSize: `${sheet.w * scale}px ${sheet.h * scale}px`,
                backgroundPosition: `-${def.x * scale}px -${def.y * scale}px`,
                backgroundRepeat: 'no-repeat',
                imageRendering: 'pixelated',
                transform: flipX ? 'scaleX(-1)' : undefined,
                flexShrink: 0,
                ...style,
            }}
        />
    )
}
