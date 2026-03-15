export const SHEETS = {
  mario: {
    src: "/assets/mario/mario.png",
    w: 405,
    h: 188,
  },
  bg1: {
    src: "/assets/mario/bg-1-1.png",
    w: 3376,
    h: 480,
  },
  bg2: {
    src: "/assets/mario/bg-1-2.png",
    w: 3072,
    h: 720,
  },
  //   characters: {
  //     src: "/assets/mario/characters.gif",
  //     w: 0,
  //     h: 0,
  //   },
  //   blocks: {
  //     src: "/assets/mario/blocks.png",
  //     w: 0,
  //     h: 0,
  //   },
  //   items: {
  //     src: "/assets/mario/items-objects.png",
  //     w: 0,
  //     h: 0,
  //   },
  //   items2: {
  //     src: "/assets/mario/items-objects-2.png",
  //     w: 0,
  //     h: 0,
  //   },
  //   misc: {
  //     src: "/assets/mario/misc.gif",
  //     w: 0,
  //     h: 0,
  //   },
  misc2: {
    src: "/assets/mario/misc-2.gif",
    w: 411,
    h: 949,
  },
  bgClouds: {
    src: "/assets/mario/bg-clouds.png",
    w: 768,
    h: 1112,
  },
} as const;

export type SheetKey = keyof typeof SHEETS;

export interface SpriteDef {
  sheet: SheetKey; // which image file
  x: number; // left edge in the sheet (px, 1x)
  y: number; // top edge in the sheet (px, 1x)
  w: number; // width of this sprite (px, 1x)
  h: number; // height of this sprite (px, 1x)
}

export const MARIO = {
  idle: { sheet: "mario", x: 176, y: 0, w: 23, h: 17 },
  "walk-1": { sheet: "mario", x: 146, y: 0, w: 23, h: 17 },
  "walk-2": { sheet: "mario", x: 116, y: 0, w: 23, h: 17 },
  "walk-3": { sheet: "mario", x: 85, y: 0, w: 23, h: 17 },
  crouch: { sheet: "mario", x: 57, y: 0, w: 23, h: 17 },
  jump: { sheet: "mario", x: 25, y: 0, w: 23, h: 17 },
} as const satisfies Record<string, SpriteDef>;

export type MarioFrame = keyof typeof MARIO;

// export const MARIO_RIGHT: Record<string, SpriteDef> = {
//   idle: { sheet: "mario", x: 207, y: 0, w: 23, h: 17 },
//   "walk-1": { sheet: "mario", x: 236, y: 0, w: 23, h: 17 },
//   "walk-2": { sheet: "mario", x: 266, y: 0, w: 23, h: 17 },
//   "walk-3": { sheet: "mario", x: 297, y: 0, w: 23, h: 17 },
//   crouch: { sheet: "mario", x: 326, y: 0, w: 23, h: 17 },
//   jump: { sheet: "mario", x: 357, y: 0, w: 23, h: 17 },
// } as const;

// export type MarioRightFrame = keyof typeof MARIO_LEFT;

// export const LEFT_WALK_CYCLE: MarioLeftFrame[] = [
//   "walk-1",
//   "walk-2",
//   "walk-3",
//   "walk-2",
// ];

export const WALK_CYCLE: MarioFrame[] = [
  "walk-1",
  "walk-2",
  "walk-3",
  "walk-2",
];

export const SCROLL_PX_PER_FRAME = 12;

export const PROPS = {
  // green pipe props
  "green-pipe-entry-cap": { sheet: "misc2", x: 230, y: 385, w: 33, h: 17 },
  "green-pipe-entry-body": { sheet: "misc2", x: 230, y: 400, w: 33, h: 50 },
  "green-pipe-exit-cap": { sheet: "misc2", x: 83, y: 416, w: 18, h: 35 },
  "green-pipe-exit-body": { sheet: "misc2", x: 99, y: 320, w: 48, h: 131 },

  // silver pipe props
  "silver-pipe-entry-cap": { sheet: "misc2", x: 230, y: 536, w: 33, h: 17 },
  "silver-pipe-entry-body": { sheet: "misc2", x: 230, y: 536, w: 33, h: 50 },
  "silver-pipe-exit-cap": { sheet: "misc2", x: 83, y: 552, w: 18, h: 35 },
  "silver-pipe-exit-body": { sheet: "misc2", x: 99, y: 456, w: 48, h: 131 },

  // castle
  castle: { sheet: "misc2", x: 246, y: 862, w: 83, h: 84 },
} as const satisfies Record<string, SpriteDef>;

export const WORLD_1 = {
  main_world: { sheet: "bg1", x: 0, y: 0, w: 395, h: 106 },
  under_world: { sheet: "bg1", x: 336, y: 104, w: 118, h: 109 },
} as const satisfies Record<string, SpriteDef>;

export const EXIT_WORLD = {
  main_world: { sheet: "bg2", x: 1215, y: 0, w: 269, h: 116 },
} as const satisfies Record<string, SpriteDef>;

export const TILES = {
  "default-tile": { sheet: "bg1", x: 0, y: 92, w: 16, h: 16 },
  "underworld-tile": { sheet: "bg1", x: 343, y: 198, w: 16, h: 16 },
} as const satisfies Record<string, SpriteDef>;

export const CLOUDS = {
  clouds: { sheet: "bgClouds", x: 0, y: 40, w: 768, h: 176 },
} as const satisfies Record<string, SpriteDef>;
