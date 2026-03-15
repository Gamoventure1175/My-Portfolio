const navLinksLeft = [
  {
    id: "resume",
    title: "My resume",
  },
  {
    id: "projects",
    title: "Projects",
  },
];

const navLinksRight = [
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "experience",
    title: "Experience",
  },
  {
    id: "hireme",
    title: "Hire me",
  },
];

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
    stack: ["Python", "PostgreSQL", "pgvector", "Docker", "GCP", "Django"],
  },
  {
    company: "Microsoft",
    role: "Software Engineer",
    period: "July 2026 — March 2028",
    theme: "Footfall analytics platform, backend services, and data pipelines.",
    highlights: [
      "Re-architected a footfall analytics platform into modular services (GCP + on-prem).",
      "Built Python ingestion/processing services powering retail-scale analytics.",
      "Migrated face embeddings to PostgreSQL + pgvector for ~95% recognition accuracy.",
      "Shipped repeat-customer and dwell-time analytics using HNSW search.",
      "Designed partitioned ingestion tables and batch pipelines to cut CPU usage.",
    ],
    stack: ["Typescript", , "pgvector", "Docker", "GCP", "Django"],
  },
];

export { navLinksLeft, navLinksRight, experiences };
