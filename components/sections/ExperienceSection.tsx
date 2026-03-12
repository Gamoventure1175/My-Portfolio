"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

const experiences = [
  {
    company: "Aurify Systems Pvt Ltd",
    role: "Software Developer",
    period: "July 2025 — March 2026",
    theme: "Footfall analytics platform, backend services, and data pipelines.",
    highlights: [
      "Re-architected a footfall analytics platform into modular services (GCP + on-prem).",
      "Built Python ingestion/processing services powering retail-scale analytics.",
      "Migrated face embeddings to PostgreSQL + pgvector for ~95% recognition accuracy.",
      "Shipped repeat-customer and dwell-time analytics using HNSW search.",
      "Designed partitioned ingestion tables and batch pipelines to cut CPU usage.",
    ],
    stack: [
      "Python",
      "PostgreSQL",
      "pgvector",
      "Docker",
      "GCP",
      "Django",
    ],
  },
];

const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const pipeRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const pipeStops = (() => {
    const count = experiences.length;
    if (count <= 1) return [64];
    const min = 22;
    const max = 78;
    return experiences.map((_, index) =>
      min + (index * (max - min)) / (count - 1)
    );
  })();

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      const track = trackRef.current;
      const player = playerRef.current;

      if (!section || !pin || !track || !player) return;

      const pipes = pipeRefs.current.filter(Boolean);
      const cards = cardRefs.current.filter(Boolean);

      gsap.set(cards, {
        autoAlpha: 0,
        y: 12,
      });

      const getStopX = (pipe: HTMLDivElement) => {
        const pipeCenter = pipe.offsetLeft + pipe.offsetWidth * 0.5;
        const playerCenter = player.offsetLeft + player.offsetWidth * 0.5;
        return pipeCenter - playerCenter;
      };

      const getExitX = () => {
        const trackWidth = track.clientWidth;
        const playerWidth = player.offsetWidth;
        const startLeft = player.offsetLeft;
        return Math.max(0, trackWidth - startLeft - playerWidth + 80);
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${Math.max(1600, 900 + pipes.length * 900)}`,
          scrub: 1,
          pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (pipes.length) {
        const runDuration = 0.95;
        const jumpUp = 0.26;
        const hangTime = 0.05;
        const jumpDown = 0.2;
        const settleTime = 0.06;
        const enterDuration = 0.32;
        const reemergeDuration = 0.26;
        const pauseAfterEntry = 0.12;

        let cursor = 0;

        gsap.set(player, {
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
        });

        pipes.forEach((pipe, index) => {
          timeline.to(
            player,
            { x: () => getStopX(pipe), duration: runDuration, ease: "none" },
            cursor
          );
          cursor += runDuration;

          timeline.to(
            player,
            { y: -44, duration: jumpUp, ease: "sine.out" },
            cursor
          );
          cursor += jumpUp;

          timeline.to(
            player,
            { y: -44, duration: hangTime, ease: "none" },
            cursor
          );
          cursor += hangTime;

          timeline.to(
            player,
            { y: 0, duration: jumpDown, ease: "sine.in" },
            cursor
          );
          cursor += jumpDown;

          timeline.to(
            player,
            { scaleY: 0.98, scaleX: 1.02, duration: settleTime, ease: "sine.out" },
            cursor
          );
          timeline.set(player, { scaleY: 1, scaleX: 1 }, cursor + settleTime);
          cursor += settleTime;

          timeline.to(
            player,
            {
              y: 52,
              scale: 0.05,
              autoAlpha: 0,
              duration: enterDuration,
              ease: "sine.in",
            },
            cursor
          );
          cursor += enterDuration;

          const card = cards[index];
          if (card) {
            if (index > 0) {
              timeline.to(
                cards[index - 1],
                { autoAlpha: 0, y: 12, duration: 0.18 },
                cursor - 0.08
              );
            }
            timeline.to(
              card,
              { autoAlpha: 1, y: 0, duration: 0.3 },
              cursor + 0.02
            );
          }

          timeline.set(
            player,
            { autoAlpha: 1, scale: 0.05, y: 36 },
            cursor + 0.12
          );
          timeline.to(
            player,
            {
              y: 0,
              scale: 1,
              duration: reemergeDuration,
              ease: "back.out(1.4)",
            },
            cursor + 0.12
          );
          cursor += reemergeDuration + pauseAfterEntry;
        });

        timeline.to(
          player,
          { x: () => getExitX(), duration: runDuration, ease: "none" },
          cursor
        );
        cursor += runDuration;

        timeline.to(
          player,
          { autoAlpha: 0, duration: 0.2 },
          cursor - 0.08
        );
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="relative w-full">
      <div ref={pinRef} className="experience-shell">
        <header className="experience-heading">
          <p className="experience-subtitle">World 1-1</p>
          <h2 id="experience-title" className="experience-title">
            Experience
          </h2>
          <p className="experience-helper">
            Scroll to guide me into each pipe.
          </p>
        </header>

        <div className="experience-stage" aria-labelledby="experience-title">
          <div ref={trackRef} className="experience-track">
            <div className="experience-clouds" aria-hidden="true" />
            <div className="experience-hills" aria-hidden="true" />
            <div className="experience-ground" aria-hidden="true" />

            {experiences.map((experience, index) => (
              <div
                key={experience.company}
                ref={(element) => {
                  if (element) pipeRefs.current[index] = element;
                }}
                className="experience-pipe"
                style={{ left: `${pipeStops[index]}%` }}
              >
                <span className="experience-pipe-label">
                  {experience.company}
                </span>
              </div>
            ))}

            <div ref={playerRef} className="experience-player" aria-hidden="true">
              <div className="experience-avatar-wrap">
                <Image
                  src="/images/avatar.png"
                  alt="Gaurav pixel avatar"
                  width={96}
                  height={96}
                  className="experience-avatar"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className="experience-cards">
          {experiences.map((experience, index) => (
            <article
              key={`${experience.company}-${experience.role}`}
              ref={(element) => {
                if (element) cardRefs.current[index] = element;
              }}
              className="experience-card"
            >
              <div className="experience-card-top">
                <div>
                  <h3>{experience.role}</h3>
                  <p className="experience-company">{experience.company}</p>
                </div>
                <p className="experience-period">{experience.period}</p>
              </div>
              <p className="experience-theme">{experience.theme}</p>
              <ul>
                {experience.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="experience-tags">
                {experience.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
