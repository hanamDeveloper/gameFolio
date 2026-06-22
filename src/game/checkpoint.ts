/** 오버레이가 열린 건물 발판 — 낙하 시 리스폰 위치 */
let buildingCheckpoint: [number, number, number] | null = null;

export function checkpointFromInteractionPlatform(
  platform: [number, number, number],
): [number, number, number] {
  return [platform[0], platform[1] + 2.8, platform[2]];
}

export function setBuildingCheckpoint(platform: [number, number, number]): void {
  buildingCheckpoint = checkpointFromInteractionPlatform(platform);
}

export function getBuildingCheckpoint(): [number, number, number] | null {
  return buildingCheckpoint;
}
