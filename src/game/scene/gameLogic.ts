import { CHALLENGE_ZONES, COINS, FLAGS, INTERACTIONS, MOVING_PLATFORMS, PLATFORMS, ZONES } from "../constants";
import { getMovingPlatformPosition } from "../movingPlatform";
import type {
  ChallengeZone,
  CloudBubbleState,
  CollectibleDef,
  FlagDef,
  GameState,
  InteractionZone,
  MovingPlatformDef,
  PlatformDef,
  ZoneId,
} from "../types";

/** 구역은 고도(Y) 기준 — 나선형 월드 */
export function getZoneAt(x: number, z = 0, y = 0): ZoneId {
  if (y >= 14 && x >= 4 && x <= 9 && z >= -9 && z <= 3) return "secret";
  if (y >= 12) return "tower";
  if (y >= 7.5) return "museum";
  if (y >= 3.8) return "storyHouse";
  return "home";
}

function samePlatform(
  a: [number, number, number],
  b: [number, number, number],
): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

export function findInteraction(
  x: number,
  y: number,
  z: number,
  onGround: boolean,
): InteractionZone | null {
  if (!onGround) return null;

  const platform = findPlatformAt(x, y, z);
  if (!platform) return null;

  for (const interaction of INTERACTIONS) {
    if (samePlatform(interaction.platform, platform.position)) {
      return interaction;
    }
  }
  return null;
}

const PLATFORM_RADIUS: Record<PlatformDef["model"], number> = {
  platform: 2,
  platformMedium: 2.8,
  platformLarge: 3.5,
  platformGrassRound: 2.2,
  grass: 1,
  grassSmall: 1,
  cloud: 1,
  brick: 1,
  coin: 1,
  flag: 1,
};

export function findMovingPlatformAt(
  x: number,
  y: number,
  z: number,
  time: number,
): MovingPlatformDef | null {
  let best: MovingPlatformDef | null = null;
  let bestDist = Infinity;

  for (const def of MOVING_PLATFORMS) {
    const pos = getMovingPlatformPosition(def, time);
    const surfaceY = pos[1] + 0.85;
    if (Math.abs(y - surfaceY) > 2.2) continue;

    const dx = x - pos[0];
    const dz = z - pos[2];
    const dist = Math.hypot(dx, dz);
    const radius = PLATFORM_RADIUS[def.model];

    if (dist <= radius && dist < bestDist) {
      bestDist = dist;
      best = def;
    }
  }

  return best;
}

export function findPlatformAt(
  x: number,
  y: number,
  z: number,
  time = 0,
): PlatformDef | null {
  let best: PlatformDef | null = null;
  let bestDist = Infinity;

  for (const platform of PLATFORMS) {
    const surfaceY = platform.position[1] + 0.85;
    if (Math.abs(y - surfaceY) > 2.2) continue;

    const dx = x - platform.position[0];
    const dz = z - platform.position[2];
    const dist = Math.hypot(dx, dz);
    const radius = PLATFORM_RADIUS[platform.model];

    if (dist <= radius && dist < bestDist) {
      bestDist = dist;
      best = platform;
    }
  }

  const mover = findMovingPlatformAt(x, y, z, time);
  if (mover) {
    const pos = getMovingPlatformPosition(mover, time);
    const dx = x - pos[0];
    const dz = z - pos[2];
    const dist = Math.hypot(dx, dz);
    if (dist < bestDist) {
      return {
        model: mover.model,
        position: pos,
        scale: mover.scale,
      };
    }
  }

  return best;
}

export function checkpointFromPlatform(
  platform: PlatformDef,
): [number, number, number] {
  return [
    platform.position[0],
    platform.position[1] + 2.8,
    platform.position[2],
  ];
}

export function findCoinAt(
  x: number,
  y: number,
  z: number,
  collected: Set<string>,
): CollectibleDef | null {
  for (const coin of COINS) {
    if (collected.has(coin.id)) continue;
    const dx = x - coin.position[0];
    const dy = y - coin.position[1];
    const dz = z - coin.position[2];
    if (Math.hypot(dx, dy, dz) <= 1.35) return coin;
  }
  return null;
}

export function findFlagAt(
  x: number,
  y: number,
  z: number,
  discovered: Set<string>,
): FlagDef | null {
  for (const flag of FLAGS) {
    if (discovered.has(flag.id)) continue;
    const dx = x - flag.position[0];
    const dy = y - flag.position[1];
    const dz = z - flag.position[2];
    if (Math.hypot(dx, dy, dz) <= 2.5) return flag;
  }
  return null;
}

export function findChallengeSoftRespawn(
  x: number,
  y: number,
  z: number,
): ChallengeZone | null {
  for (const zone of CHALLENGE_ZONES) {
    if (
      x >= zone.minX &&
      x <= zone.maxX &&
      z >= zone.minZ &&
      z <= zone.maxZ &&
      y < zone.softFallY
    ) {
      return zone;
    }
  }
  return null;
}

export function findNearbyMovingPlatformHint(
  x: number,
  y: number,
  z: number,
  time: number,
): string | null {
  for (const def of MOVING_PLATFORMS) {
    const pos = getMovingPlatformPosition(def, time);
    const dx = x - pos[0];
    const dy = y - pos[1];
    const dz = z - pos[2];
    const horizontal = Math.hypot(dx, dz);

    if (Math.abs(dy) > 5 || horizontal > 7) continue;
    if (findMovingPlatformAt(x, y, z, time)?.id === def.id) continue;

    return def.hint ?? "움직이는 발판 — 타이밍에 맞춰 점프!";
  }
  return null;
}

export function buildHint(
  zone: ZoneId,
  interaction: InteractionZone | null,
  isSecretPath: boolean,
  coinsCollected: number,
  totalCoins: number,
  playerX: number,
  playerY: number,
  playerZ: number,
  time = 0,
): string {
  const timingHint = findNearbyMovingPlatformHint(playerX, playerY, playerZ, time);
  if (timingHint) return timingHint;

  if (interaction) return `${interaction.title} — E 키로 입장`;
  if (isSecretPath) return "나선 중심의 숨겨진 공간! 탑에서 안쪽으로 비껴 들어왔어요.";
  if (zone === "home") {
    return `나선길이 시작됩니다 · 동쪽으로 걸어 첫 둘레를 돌아보세요 · 코인 ${coinsCollected}/${totalCoins}`;
  }
  if (zone === "storyHouse" && playerX > -1) {
    return "Story House — 남서쪽 둘레, 첫 번째 건물";
  }
  if (zone === "storyHouse" && playerX <= -8 && playerZ < -5) {
    return "Bridge House — Story House 서쪽 갈래, 점프해서 건너가세요";
  }
  if (zone === "storyHouse" && playerX <= -1) {
    return "서쪽으로 올라가면 Failure Museum · 나선을 따라 위로!";
  }
  if (zone === "museum" && playerZ > 4) {
    return "Failure Museum — 나선 북쪽 고지, 계속 위로 올라가세요";
  }
  if (zone === "museum" && playerZ <= 4) {
    return "Project Museum — 동쪽 둘레 꼭대기를 향해 올라가세요";
  }
  if (zone === "tower" && playerZ < 0) {
    return "Skill Tower — 나선이 남쪽으로 돌아 올라갑니다";
  }
  if (zone === "tower" && playerZ >= 0 && playerZ < 4) {
    return "Future Lab — 최상단 둘레, 움직이는 발판을 건너세요";
  }
  if (zone === "tower" && playerZ >= 4) {
    return "최고층! 나선 안쪽으로 비껴 들어가 보세요";
  }
  if (zone === "secret") {
    return "나선 중심의 숨겨진 공간 — 탐험 완료!";
  }
  const label = ZONES.find((z) => z.id === zone)?.label ?? "";
  return `${label} — 코인 ${coinsCollected}/${totalCoins}`;
}

export function computeGameState(
  x: number,
  y: number,
  z: number,
  ready: boolean,
  coinsCollected: string[],
  flagsDiscovered: string[],
  jumpFeedback: GameState["jumpFeedback"] = null,
  feedbackTick = 0,
  coinBurst: GameState["coinBurst"] = null,
  onGround = false,
  time = 0,
  cloudBubble: CloudBubbleState | null = null,
): GameState {
  const zone = getZoneAt(x, z, y);
  const standingPlatform = onGround
    ? (findPlatformAt(x, y, z, time)?.position ?? null)
    : null;
  const activeInteraction = findInteraction(x, y, z, onGround);
  const isBehindWaterfall = zone === "secret";

  return {
    zone,
    playerX: x,
    playerY: y,
    playerZ: z,
    activeInteraction,
    standingPlatform,
    isBehindWaterfall,
    ready,
    jumpFeedback,
    feedbackTick,
    coinsCollected,
    totalCoins: COINS.length,
    flagsDiscovered,
    totalFlags: FLAGS.length,
    coinBurst,
    cloudBubble,
    hint: buildHint(
      zone,
      activeInteraction,
      isBehindWaterfall,
      coinsCollected.length,
      COINS.length,
      x,
      y,
      z,
      time,
    ),
  };
}
