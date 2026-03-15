"use client"

import { forwardRef, useEffect, useState } from "react"
import { Sprite } from "./Sprite"
import { type MarioFrame, MARIO, WALK_CYCLE } from "@/lib/mario/sprites"

export type MarioState = "idle" | "walking" | "jumping" | "crouching" | "entering-pipe"

interface MarioCharacterProps {
    scrollDelta?: number
    state?: MarioState
    scale?: number
    pipeOffset?: number
    left?: number
    bottom?: number
    className?: string
    style?: React.CSSProperties
    flipX?: boolean
    walkFps?: number
}

export const MarioCharacter = forwardRef<HTMLDivElement, MarioCharacterProps>(function MarioCharacter({
    scrollDelta = 0,
    state = 'walking',
    scale = 2,
    pipeOffset = 0,
    left = 80,
    bottom = 32,
    className,
    style,
    flipX = false,
    walkFps = 10,
}: MarioCharacterProps, ref) {
    const [frameIndex, setFrameIndex] = useState(0)
    const effectiveWalkFps = scrollDelta === 0
        ? walkFps
        : Math.max(walkFps, Math.min(16, Math.abs(scrollDelta) * 2))

    useEffect(() => {
        if (state !== 'walking') {
            return
        }

        const interval = window.setInterval(() => {
            setFrameIndex(i => (i + 1) % WALK_CYCLE.length)
        }, 1000 / effectiveWalkFps)

        return () => window.clearInterval(interval)
    }, [effectiveWalkFps, state])

    const frame: MarioFrame = (() => {
        switch (state) {
            case 'idle': return 'idle'
            case 'jumping': return 'jump'
            case 'crouching':
            case 'entering-pipe': return 'crouch'
            case 'walking': return WALK_CYCLE[frameIndex]
        }
    })()

    return (
        <div
            ref={ref}
            className={className}
            style={{
                position: 'absolute',
                bottom: bottom * scale,
                left,
                zIndex: 10,
                ...style,
            }}
        >
            <div
                style={{
                    transform: `translateY(${pipeOffset}px)`,
                    transition: state === 'entering-pipe' ? 'transform 0.5s ease-in' : undefined,
                }}
            >
                <Sprite def={MARIO[frame]} scale={scale} flipX={flipX} />
            </div>
        </div>
    )
})
