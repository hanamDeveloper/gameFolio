export type ZoneId =
  | "home"
  | "storyHouse"
  | "museum"
  | "tower"
  | "secret";

export type KenneyModelId =
  | "platform"
  | "platformMedium"
  | "platformLarge"
  | "platformGrassRound"
  | "grass"
  | "grassSmall"
  | "cloud"
  | "brick"
  | "coin"
  | "flag";

export type JumpFeedbackLabel = "Perfect!" | "Great!" | "Amazing!" | "Oops!" | null;

export interface ZoneConfig {
  id: ZoneId;
  startX: number;
  endX: number;
  label: string;
}

export interface PlatformDef {
  model: KenneyModelId;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export interface MovingPlatformDef {
  id: string;
  model: KenneyModelId;
  position: [number, number, number];
  axis: "x" | "y" | "z";
  range: number;
  speed: number;
  phase?: number;
  scale?: number;
  /** 근처에서 HUD 힌트로 표시 */
  hint?: string;
}

export interface ChallengeZone {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  softFallY: number;
  respawn: [number, number, number];
  label: string;
}

export interface CollectibleDef {
  id: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  secret?: boolean;
}

export interface FlagDef {
  id: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  label: string;
  zone: ZoneId;
}

export interface InteractionZone {
  id: string;
  /** 건물이 올라간 발판 좌표 — 이 발판에 착지했을 때만 오버레이 */
  platform: [number, number, number];
  title: string;
  subtitle: string;
  description: string;
}

export interface GameState {
  zone: ZoneId;
  playerX: number;
  playerY: number;
  playerZ: number;
  activeInteraction: InteractionZone | null;
  /** 지상에 있을 때 서 있는 발판 좌표 */
  standingPlatform: [number, number, number] | null;
  isBehindWaterfall: boolean;
  hint: string;
  ready: boolean;
  jumpFeedback: JumpFeedbackLabel;
  feedbackTick: number;
  coinsCollected: string[];
  totalCoins: number;
  flagsDiscovered: string[];
  totalFlags: number;
  coinBurst: { id: string; tick: number } | null;
  /** 구름 접촉 시 해당 구름 위치에 표시 */
  cloudBubble: CloudBubbleState | null;
}

export interface CloudBubbleState {
  position: [number, number, number];
  scale: number;
  tick: number;
}

export interface GameCallbacks {
  onCollectCoin: (id: string) => void;
  onDiscoverFlag: (id: string) => void;
}
