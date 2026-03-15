"use client";

import { useLayoutEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MarioCharacter, type MarioState } from "@/components/mario/MarioCharacter";
import { Sprite } from "@/components/mario/Sprite";
import { experiences } from "@/data/portfolio";
import { CLOUDS, EXIT_WORLD, PROPS, WORLD_1, type SpriteDef } from "@/lib/mario/sprites";

type SceneName = "main" | "underworld" | "exit";
type ExperienceEntry = (typeof experiences)[number];
type PipeTheme = "green" | "silver";
type PipeVariant = "entry" | "exit";

const MAIN_RUN = 1.2;
const MAIN_PIPE_DROP = 0.62;
const ROOM_EMERGE = 0.34;
const ROOM_WALK = 1.18;
const ROOM_PIPE_DROP = 0.44;
const ROOM_SHIFT = 0.34;
const EXIT_TRANSITION = 0.64;
const EXIT_EMERGE = 0.34;
const EXIT_WALK = 1.16;
const END_HOLD = 0.3;

const PIPE_KEYS = {
  green: {
    entry: { cap: "green-pipe-entry-cap", body: "green-pipe-entry-body" },
    exit: { cap: "green-pipe-exit-cap", body: "green-pipe-exit-body" },
  },
  silver: {
    entry: { cap: "silver-pipe-entry-cap", body: "silver-pipe-entry-body" },
    exit: { cap: "silver-pipe-exit-cap", body: "silver-pipe-exit-body" },
  },
} as const;

interface ExperienceViewState {
  scene: SceneName;
  activeRoom: number | null;
  marioState: MarioState;
}

interface PhaseWindow extends ExperienceViewState {
  start: number;
  end: number;
}

function SpriteStrip({
  def,
  scale,
  count,
  className,
}: {
  def: SpriteDef;
  scale: number;
  count: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, index) => (
        <Sprite key={`${def.sheet}-${def.x}-${index}`} def={def} scale={scale} />
      ))}
    </div>
  );
}

function Pipe({
  theme,
  variant,
  scale,
  className,
}: {
  theme: PipeTheme;
  variant: PipeVariant;
  scale: number;
  className?: string;
}) {
  const pipe = PIPE_KEYS[theme][variant];
  const spriteScale = variant === "exit" ? Math.max(1.4, scale * 0.55) : scale;

  return (
    <div className={className} aria-hidden="true">
      <Sprite def={PROPS[pipe.cap]} scale={spriteScale} />
      <Sprite def={PROPS[pipe.body]} scale={spriteScale} />
    </div>
  );
}

function ExperienceRoomCard({
  experience,
  index,
  active,
}: {
  experience: ExperienceEntry;
  index: number;
  active: boolean;
}) {
  const stack = experience.stack.filter((item): item is string => Boolean(item));

  return (
    <article
      className={`experience-room-card${active ? " is-active" : ""}`}
      aria-label={`${experience.company} experience`}
    >
      <div className="experience-room-card-top">
        <p className="experience-room-world">Room 1-{index + 2}</p>
        <p className="experience-room-period">{experience.period}</p>
      </div>

      <div className="experience-room-company">{experience.company}</div>
      <h3>{experience.role}</h3>
      <p className="experience-room-theme">{experience.theme}</p>

      <ul className="experience-room-highlights">
        {experience.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

      <div className="experience-room-tags">
        {stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </article>
  );
}

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const mainSceneRef = useRef<HTMLDivElement | null>(null);
  const underSceneRef = useRef<HTMLDivElement | null>(null);
  const underTrackRef = useRef<HTMLDivElement | null>(null);
  const exitSceneRef = useRef<HTMLDivElement | null>(null);
  const marioRef = useRef<HTMLDivElement | null>(null);
  const [sceneScale, setSceneScale] = useState(3);
  const [viewState, setViewState] = useState<ExperienceViewState>({
    scene: "main",
    activeRoom: null,
    marioState: "walking",
  });

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateScale = () => {
      if (window.innerWidth < 640) {
        setSceneScale(2);
        return;
      }

      if (window.innerWidth < 1100) {
        setSceneScale(3);
        return;
      }

      setSceneScale(4);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => {
        setViewState({
          scene: "underworld",
          activeRoom: 0,
          marioState: "idle",
        });
      });

      return () => window.cancelAnimationFrame(frame);
    }

    if (experiences.length === 0) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const totalUnits =
      MAIN_RUN +
      MAIN_PIPE_DROP +
      experiences.length * (ROOM_EMERGE + ROOM_WALK + ROOM_PIPE_DROP) +
      Math.max(0, experiences.length - 1) * ROOM_SHIFT +
      EXIT_TRANSITION +
      EXIT_EMERGE +
      EXIT_WALK +
      END_HOLD;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      const stage = stageRef.current;
      const mainScene = mainSceneRef.current;
      const underScene = underSceneRef.current;
      const underTrack = underTrackRef.current;
      const exitScene = exitSceneRef.current;
      const mario = marioRef.current;

      if (!section || !pin || !stage || !mainScene || !underScene || !underTrack || !exitScene || !mario) {
        return;
      }

      const windows: PhaseWindow[] = [];

      const getStageWidth = () => stage.clientWidth;
      const getMarioWidth = () => 23 * sceneScale;
      const getMainStartX = () => Math.max(28, getStageWidth() * 0.06);
      const getMainPipeX = () => getStageWidth() * 0.69 - getMarioWidth() * 0.25;
      const getRoomEntryX = () => Math.max(32, getStageWidth() * 0.12);
      const getRoomExitX = () => getStageWidth() * 0.76 - getMarioWidth() * 0.2;
      const getExitPipeX = () => Math.max(32, getStageWidth() * 0.12);
      const getCastleX = () => getStageWidth() * 0.69;

      const commitViewState = (nextState: ExperienceViewState) => {
        setViewState((current) => {
          if (
            current.scene === nextState.scene &&
            current.activeRoom === nextState.activeRoom &&
            current.marioState === nextState.marioState
          ) {
            return current;
          }

          return nextState;
        });
      };

      gsap.set(mainScene, { yPercent: 0, autoAlpha: 1 });
      gsap.set(underScene, { yPercent: 100, autoAlpha: 0 });
      gsap.set(underTrack, { xPercent: 0 });
      gsap.set(exitScene, { yPercent: 100, autoAlpha: 0 });
      gsap.set(mario, {
        x: getMainStartX(),
        y: 0,
        autoAlpha: 1,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 3.4, totalUnits * 540)}`,
          scrub: 1,
          pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      let cursor = 0;

      windows.push({
        start: cursor,
        end: cursor + MAIN_RUN,
        scene: "main",
        activeRoom: null,
        marioState: "walking",
      });
      timeline.to(mario, { x: getMainPipeX, duration: MAIN_RUN, ease: "none" }, cursor);
      cursor += MAIN_RUN;

      windows.push({
        start: cursor,
        end: cursor + MAIN_PIPE_DROP,
        scene: "main",
        activeRoom: null,
        marioState: "entering-pipe",
      });
      timeline.to(mario, { y: 92, autoAlpha: 0, duration: MAIN_PIPE_DROP, ease: "power1.in" }, cursor);
      timeline.to(mainScene, { yPercent: -18, autoAlpha: 0, duration: MAIN_PIPE_DROP, ease: "power2.inOut" }, cursor);
      timeline.to(underScene, { yPercent: 0, autoAlpha: 1, duration: MAIN_PIPE_DROP, ease: "power2.inOut" }, cursor);
      cursor += MAIN_PIPE_DROP;

      experiences.forEach((_, index) => {
        windows.push({
          start: cursor,
          end: cursor + ROOM_EMERGE + ROOM_WALK,
          scene: "underworld",
          activeRoom: index,
          marioState: "walking",
        });
        timeline.set(mario, { x: getRoomEntryX, y: 72, autoAlpha: 1 }, cursor);
        timeline.to(mario, { y: 0, duration: ROOM_EMERGE, ease: "sine.out" }, cursor);
        timeline.to(mario, { x: getRoomExitX, duration: ROOM_WALK, ease: "none" }, cursor + ROOM_EMERGE * 0.4);
        cursor += ROOM_EMERGE + ROOM_WALK;

        windows.push({
          start: cursor,
          end: cursor + ROOM_PIPE_DROP + (index < experiences.length - 1 ? ROOM_SHIFT : 0),
          scene: "underworld",
          activeRoom: index,
          marioState: "entering-pipe",
        });
        timeline.to(mario, { y: 78, autoAlpha: 0, duration: ROOM_PIPE_DROP, ease: "power1.in" }, cursor);
        cursor += ROOM_PIPE_DROP;

        if (index < experiences.length - 1) {
          timeline.to(
            underTrack,
            { xPercent: -100 * (index + 1), duration: ROOM_SHIFT, ease: "power2.inOut" },
            cursor
          );
          cursor += ROOM_SHIFT;
        }
      });

      windows.push({
        start: cursor,
        end: cursor + EXIT_TRANSITION,
        scene: "exit",
        activeRoom: experiences.length - 1,
        marioState: "entering-pipe",
      });
      timeline.to(underScene, { yPercent: 16, autoAlpha: 0, duration: EXIT_TRANSITION, ease: "power2.inOut" }, cursor);
      timeline.to(exitScene, { yPercent: 0, autoAlpha: 1, duration: EXIT_TRANSITION, ease: "power2.inOut" }, cursor);
      cursor += EXIT_TRANSITION;

      windows.push({
        start: cursor,
        end: cursor + EXIT_EMERGE + EXIT_WALK,
        scene: "exit",
        activeRoom: experiences.length - 1,
        marioState: "walking",
      });
      timeline.set(mario, { x: getExitPipeX, y: 72, autoAlpha: 1 }, cursor);
      timeline.to(mario, { y: 0, duration: EXIT_EMERGE, ease: "sine.out" }, cursor);
      timeline.to(mario, { x: getCastleX, duration: EXIT_WALK, ease: "none" }, cursor + EXIT_EMERGE * 0.3);
      cursor += EXIT_EMERGE + EXIT_WALK;

      windows.push({
        start: cursor,
        end: cursor + END_HOLD,
        scene: "exit",
        activeRoom: experiences.length - 1,
        marioState: "idle",
      });
      timeline.to({}, { duration: END_HOLD }, cursor);

      timeline.eventCallback("onUpdate", () => {
        const time = timeline.time();
        const activeWindow =
          windows.find((windowState) => time >= windowState.start && time < windowState.end) ??
          windows[windows.length - 1];

        commitViewState({
          scene: activeWindow.scene,
          activeRoom: activeWindow.activeRoom,
          marioState: activeWindow.marioState,
        });
      });

      commitViewState({
        scene: "main",
        activeRoom: null,
        marioState: "walking",
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [sceneScale]);

  const activeExperience =
    viewState.activeRoom === null ? null : experiences[viewState.activeRoom] ?? null;
  const sceneLabel =
    viewState.scene === "main"
      ? "Main World"
      : viewState.scene === "underworld"
        ? activeExperience?.company ?? "Underworld"
        : "Castle Exit";
  const helperCopy =
    viewState.scene === "main"
      ? "Scroll to send Mario down the first pipe."
      : viewState.scene === "underworld"
        ? "Each room is a company world connected by pipes."
        : "Final pipe cleared. Mario heads for the castle.";

  return (
    <section id="experience" ref={sectionRef} className="experience-section">
      <div ref={pinRef} className="experience-shell">
        <div ref={stageRef} className="experience-stage" aria-labelledby="experience-title">
          <header className="experience-hud">
            <div>
              <p className="experience-hud-kicker">World 1-1</p>
              <h2 id="experience-title" className="experience-title">
                Experience
              </h2>
            </div>

            <div className="experience-hud-copy">
              <p className="experience-scene-label">{sceneLabel}</p>
              <p className="experience-helper">{helperCopy}</p>
            </div>
          </header>

          <ol className="experience-progress" aria-label="Experience worlds">
            {experiences.map((experience, index) => (
              <li
                key={experience.company}
                className={index === viewState.activeRoom ? "is-active" : undefined}
              >
                <span>{experience.company}</span>
              </li>
            ))}
          </ol>

          <div ref={mainSceneRef} className="experience-scene experience-scene-main" aria-hidden="true">
            <div className="experience-cloud-band experience-cloud-band-left">
              <Sprite def={CLOUDS.clouds} scale={sceneScale < 4 ? 0.8 : 1} />
            </div>
            <div className="experience-cloud-band experience-cloud-band-right">
              <Sprite def={CLOUDS.clouds} scale={sceneScale < 4 ? 0.65 : 0.85} />
            </div>

            <SpriteStrip def={WORLD_1.main_world} scale={sceneScale} count={1} className="experience-main-strip" />

            <Pipe
              theme="green"
              variant="entry"
              scale={sceneScale}
              className="experience-pipe experience-main-pipe"
            />

            <div className="experience-scene-caption experience-main-caption">
              Enter the first pipe to drop into the timeline.
            </div>
          </div>

          <div ref={underSceneRef} className="experience-scene experience-scene-under">
            <div ref={underTrackRef} className="experience-under-track">
              {experiences.map((experience, index) => (
                <div key={`${experience.company}-${experience.role}`} className="experience-room">
                  <SpriteStrip
                    def={WORLD_1.under_world}
                    scale={sceneScale + 1}
                    count={3}
                    className="experience-room-strip"
                  />

                  <Pipe
                    theme="silver"
                    variant="exit"
                    scale={sceneScale}
                    className="experience-pipe experience-room-pipe experience-room-pipe-left"
                  />

                  <Pipe
                    theme={index === experiences.length - 1 ? "green" : "silver"}
                    variant="entry"
                    scale={sceneScale}
                    className="experience-pipe experience-room-pipe experience-room-pipe-right"
                  />

                  <ExperienceRoomCard
                    experience={experience}
                    index={index}
                    active={index === viewState.activeRoom}
                  />
                </div>
              ))}
            </div>
          </div>

          <div ref={exitSceneRef} className="experience-scene experience-scene-exit" aria-hidden="true">
            <div className="experience-cloud-band experience-cloud-band-left">
              <Sprite def={CLOUDS.clouds} scale={sceneScale < 4 ? 0.8 : 1} />
            </div>
            <SpriteStrip def={EXIT_WORLD.main_world} scale={sceneScale} count={1} className="experience-exit-strip" />

            <Pipe
              theme="green"
              variant="exit"
              scale={sceneScale}
              className="experience-pipe experience-exit-pipe"
            />

            <div className="experience-castle" aria-hidden="true">
              <Sprite def={PROPS.castle} scale={sceneScale} />
            </div>

            <div className="experience-scene-caption experience-exit-caption">
              Cleared the underground run. Castle reached.
            </div>
          </div>

          <MarioCharacter
            ref={marioRef}
            state={viewState.marioState}
            scale={sceneScale}
            left={0}
            bottom={5}
            flipX
            className="experience-mario"
          />
        </div>
      </div>
    </section>
  );
}
