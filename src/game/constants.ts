import type {
  ChallengeZone,
  CollectibleDef,
  FlagDef,
  InteractionZone,
  MovingPlatformDef,
  PlatformDef,
  ZoneConfig,
} from "./types";

export const ASSETS = {
  character: "/assets/kenney-3d/character.glb",
  platform: "/assets/kenney-3d/platform.glb",
  platformMedium: "/assets/kenney-3d/platform-medium.glb",
  platformLarge: "/assets/kenney-3d/platform-large.glb",
  platformGrassRound: "/assets/kenney-3d/platform-grass-large-round.glb",
  grass: "/assets/kenney-3d/grass.glb",
  grassSmall: "/assets/kenney-3d/grass-small.glb",
  cloud: "/assets/kenney-3d/cloud.glb",
  brick: "/assets/kenney-3d/brick.glb",
  coin: "/assets/kenney-3d/coin.glb",
  flag: "/assets/kenney-3d/flag.glb",
} as const;

export const AUDIO = {
  /** SUNO 등으로 만든 메인 탐험 BGM — mp3를 이 경로에 넣으세요 */
  bgmMain: "/assets/audio/bgm/main.mp3",
} as const;

export const WORLD = {
  fallY: -8,
  spawn: [0, 3, 0] as [number, number, number],
} as const;

export const PLAYER = {
  speed: 7,
  jumpStrength: 6.5,
  maxJumps: 2,
} as const;

/** 구역은 고도(Y) 기준 — 나선형 월드 */
export const ZONES: ZoneConfig[] = [
  { id: "home", startX: 0, endX: 3, label: "Home / Village" },
  { id: "storyHouse", startX: 3, endX: 5, label: "Story House" },
  { id: "museum", startX: 5, endX: 9, label: "Project Museum" },
  { id: "tower", startX: 9, endX: 12, label: "Skill Tower" },
  { id: "secret", startX: 12, endX: 16, label: "Secret Area" },
];

export const INTERACTIONS: InteractionZone[] = [
  {
    id: "story-house",
    platform: [-5, 4.8, -7.5],
    title: "Story House",
    subtitle: "김영섭의 시작",
    description:
      "나선길 첫 번째 둘레. 코드가 아닌 제품을 위해 일하는 Frontend Engineer 김영섭의 이야기.",
  },
  {
    id: "bridge-house",
    platform: [-11, 6, -7],
    title: "Bridge House",
    subtitle: "포지션 · 시작",
    description:
      "프론트엔드 포지션에 대한 생각, 개발을 시작하게 된 계기.",
  },
  {
    id: "failure-museum",
    platform: [-9, 7.2, 10],
    title: "Failure Museum",
    subtitle: "실패도 경험",
    description:
      "피벗, 팀 갈등, 초기 저참여 같은 일들. 망한 것도 기록해 뒀습니다.",
  },
  {
    id: "project-museum",
    platform: [16, 10.4, 2],
    title: "Project Museum",
    subtitle: "일한 것들",
    description:
      "휴넷·더탁·제이스톡 경력과 KeepUp·Jobro 사이드 프로젝트.",
  },
  {
    id: "skill-tower",
    platform: [1, 12.8, -10.5],
    title: "Skill Tower",
    subtitle: "쓰는 기술",
    description:
      "TypeScript, React, Next.js, Expo, SSE·WebSocket 등.",
  },
  {
    id: "future-lab",
    platform: [-4, 16, 10.5],
    title: "Future Lab",
    subtitle: "앞으로",
    description:
      "앞으로 제품을 어떻게 만들고 싶은지 적어 뒀습니다.",
  },
  {
    id: "secret-cave",
    platform: [6, 14.8, 0.5],
    title: "Secret Area",
    subtitle: "숨겨둔 메모",
    description:
      "해시태그, 숫자 정리, 연락처가 들어 있습니다.",
  },
];

/**
 * softFallY는 월드 바닥 근처(-1)만 — 점프 중간에 Oops 나지 않도록
 * respawn은 해당 구역 입구 발판
 */
export const CHALLENGE_ZONES: ChallengeZone[] = [
  {
    id: "early-spiral",
    minX: -6,
    maxX: 14,
    minZ: -12,
    maxZ: 6,
    softFallY: -1,
    respawn: [0, 3, 0],
    label: "홈 → Story",
  },
  {
    id: "failure-arc",
    minX: -14,
    maxX: 2,
    minZ: -8,
    maxZ: 14,
    softFallY: -1,
    respawn: [-5, 6.5, -7.5],
    label: "Failure Museum 오르막",
  },
  {
    id: "museum-arc",
    minX: -8,
    maxX: 18,
    minZ: -4,
    maxZ: 16,
    softFallY: -1,
    respawn: [-9, 7.9, 10],
    label: "Project Museum",
  },
  {
    id: "tower-arc",
    minX: -8,
    maxX: 18,
    minZ: -13,
    maxZ: 6,
    softFallY: -1,
    respawn: [16, 11.1, 2],
    label: "Skill Tower",
  },
  {
    id: "lab-arc",
    minX: -14,
    maxX: 6,
    minZ: -10,
    maxZ: 14,
    softFallY: -1,
    respawn: [1, 13.5, -10.5],
    label: "Future Lab",
  },
  {
    id: "secret-inner",
    minX: 2,
    maxX: 10,
    minZ: -10,
    maxZ: 4,
    softFallY: -1,
    respawn: [-4, 16.7, 10.5],
    label: "Secret Area",
  },
];

/**
 * 나선형 상승 — 넓은 간격, 천천히 올라감 (Y ~0.8/step, XZ ~5–7/step)
 */
export const PLATFORMS: PlatformDef[] = [
  // 둘레 0 — Home (넓은 동쪽 호)
  { model: "platformGrassRound", position: [0, 0, 0] },
  { model: "platformMedium", position: [5, 0.9, 3.5] },
  { model: "platformGrassRound", position: [9, 1.6, 0] },
  { model: "platformMedium", position: [8, 2.4, -5], rotation: [0, -0.15, 0] },
  { model: "platform", position: [4, 3.2, -7.5], rotation: [0, 0.1, 0] },

  // 둘레 1 — Story House
  { model: "platformLarge", position: [-1, 4, -10] },
  { model: "platformMedium", position: [-5, 4.8, -7.5] },

  // 서쪽 갈래 — Bridge House (Story와 분리)
  { model: "platform", position: [-8, 5.3, -8] },
  { model: "platformMedium", position: [-11, 6, -7] },
  { model: "platform", position: [-10, 6.2, -4.5] },

  // 둘레 2 — Failure Museum (서→북)
  { model: "platformGrassRound", position: [-9, 5.6, -2.5] },
  { model: "platformMedium", position: [-12, 6.4, 4], rotation: [0, 0.2, 0] },
  { model: "platformLarge", position: [-9, 7.2, 10] },

  // Failure → Museum 연결
  { model: "platformMedium", position: [-6, 7.8, 12], rotation: [0, -0.1, 0] },

  // 둘레 3 — Project Museum (북→동)
  { model: "platformMedium", position: [-3, 8, 13], rotation: [0, -0.15, 0] },
  { model: "platform", position: [4, 8.8, 12] },
  { model: "platformMedium", position: [11, 9.6, 7.5], rotation: [0, 0.1, 0] },
  { model: "platformLarge", position: [16, 10.4, 2] },

  // 둘레 4 — Skill Tower (동→남)
  { model: "platformMedium", position: [14, 11.2, -5.5], rotation: [0, 0.15, 0] },
  { model: "platform", position: [8, 12, -10.5] },
  { model: "platformLarge", position: [1, 12.8, -10.5] },

  // 둘레 5 — Future Lab (남→북)
  { model: "platformMedium", position: [-5, 13.6, -6.5], rotation: [0, -0.2, 0] },
  { model: "platform", position: [-10, 14.4, -0.5], rotation: [0, 0.1, 0] },
  { model: "platformMedium", position: [-7, 15.2, 5.5], rotation: [0, -0.15, 0] },
  { model: "platformLarge", position: [-4, 16, 10.5] },

  // 안쪽 — Secret (탑에서 중심으로)
  { model: "platformMedium", position: [5, 13.8, -7.5], rotation: [0, 0.1, 0] },
  { model: "platform", position: [7, 14.3, -3], rotation: [0, -0.1, 0] },
  { model: "platformGrassRound", position: [6, 14.8, 0.5] },
];

export const MOVING_PLATFORMS: MovingPlatformDef[] = [
  {
    id: "mover-failure-bridge",
    model: "platformMedium",
    position: [-10.5, 6.95, 7],
    axis: "z",
    range: 2.4,
    speed: 0.52,
    phase: 0,
    hint: "Failure Museum — 발판이 지나갈 때 점프!",
  },
  {
    id: "mover-museum-cross",
    model: "platformLarge",
    position: [13.5, 9.9, 5],
    axis: "x",
    range: 2.6,
    speed: 0.58,
    phase: 1.1,
    hint: "Project Museum — 좌우로 움직이는 발판을 노려보세요",
  },
  {
    id: "mover-tower-bridge",
    model: "platformMedium",
    position: [11, 11.55, -8],
    axis: "z",
    range: 2.2,
    speed: 0.62,
    phase: 0.6,
    hint: "Skill Tower — 타이밍 맞춰 건너세요!",
  },
  {
    id: "lab-mover-1",
    model: "platformMedium",
    position: [-8.5, 15.6, 3.5],
    axis: "z",
    range: 1.6,
    speed: 0.48,
    phase: 0,
    hint: "Future Lab — 첫 번째 움직이는 발판",
  },
  {
    id: "lab-mover-2",
    model: "platform",
    position: [-5.5, 15.65, 8],
    axis: "z",
    range: 2,
    speed: 0.68,
    phase: Math.PI * 0.5,
    hint: "Future Lab — 두 번째 발판, 속도가 더 빨라요!",
  },
  {
    id: "secret-mover",
    model: "platformGrassRound",
    position: [6, 14.15, -3],
    axis: "z",
    range: 2.4,
    speed: 0.72,
    phase: 2.2,
    hint: "비밀 구역 — 숨겨진 발판 타이밍!",
  },
];

export const COINS: CollectibleDef[] = [
  { id: "coin-home-1", position: [9, 2.2, 0] },
  { id: "coin-home-2", position: [8, 3, -5] },
  { id: "coin-story-1", position: [-1, 4.8, -10] },
  { id: "coin-bridge-1", position: [-8, 5.7, -8] },
  { id: "coin-failure-1", position: [-12, 7, 4] },
  { id: "coin-museum-1", position: [13.5, 10.8, 5] },
  { id: "coin-tower-1", position: [8, 12.6, -10.5] },
  { id: "coin-lab-1", position: [-8.5, 16.2, 3.5] },
  { id: "coin-secret-1", position: [7, 15.1, -3] },
  { id: "coin-secret-2", position: [6, 15.6, 0.5], secret: true },
  { id: "coin-timing-1", position: [6, 15.2, -3] },
];

export const FLAGS: FlagDef[] = [
  { id: "flag-home", position: [0, 1.2, 0], label: "시작 마을", zone: "home" },
  {
    id: "flag-story",
    position: [-5, 6.3, -7.5],
    label: "Story House",
    zone: "storyHouse",
  },
  {
    id: "flag-bridge",
    position: [-11, 7.3, -7],
    label: "Bridge House",
    zone: "storyHouse",
  },
  {
    id: "flag-failure",
    position: [-9, 8.4, 10],
    label: "Failure Museum",
    zone: "museum",
  },
  {
    id: "flag-museum",
    position: [16, 11.6, 2],
    label: "Project Museum",
    zone: "museum",
  },
  {
    id: "flag-tower",
    position: [1, 14, -10.5],
    label: "Skill Tower",
    zone: "tower",
  },
  {
    id: "flag-lab",
    position: [-4, 17.3, 10.5],
    label: "Future Lab",
    zone: "tower",
  },
  {
    id: "flag-secret",
    position: [6, 16, 0.5],
    label: "Secret Area",
    zone: "secret",
  },
];

export const DECORATIONS: PlatformDef[] = [
  { model: "grass", position: [3, 0.5, 2], scale: 1.2 },
  { model: "grassSmall", position: [10, 2, 1] },
  { model: "grass", position: [5, 3.5, -6], scale: 1.1 },
  { model: "cloud", position: [8, 10, 12], scale: 2 },
  { model: "grass", position: [-10.5, 6.4, -5], scale: 1 },
  { model: "cloud", position: [14, 13, 5], scale: 2.2 },
  { model: "cloud", position: [-2, 17, 8], scale: 1.8 },
  { model: "cloud", position: [7, 16, 2], scale: 2.4 },
  { model: "cloud", position: [5, 15.5, -4], scale: 1.6 },
  { model: "grass", position: [-2, 9, 12], scale: 1.1 },
];
