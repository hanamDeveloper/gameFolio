"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StartScreen } from "@/components/StartScreen";
import { CompletionCelebration } from "@/components/CompletionCelebration";
import GameCanvas from "@/components/GameCanvas";
import { ContentOverlay } from "@/components/ContentOverlay";
import { CoinBurst, GameHUD, JumpFeedback } from "@/components/GameUI";
import { QuickTravelBar } from "@/components/QuickTravelBar";
import { QuestReveal } from "@/components/QuestReveal";
import { MobileControls } from "@/components/MobileControls";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import { ZoneTransition } from "@/components/ZoneTransition";
import { bindCameraDrag } from "@/game/cameraControls";
import { initBgmPreference, isBgmEnabled, setBgmDucked, toggleBgmEnabled, unlockGameAudio } from "@/game/bgm";
import { easeInOutCubic, INTRO_TIMING, type IntroPhase } from "@/game/introCamera";
import { setBuildingCheckpoint } from "@/game/checkpoint";
import { COINS, FLAGS, INTERACTIONS } from "@/game/constants";
import { getContentByInteractionId } from "@/game/content";
import { bindKeyboardInput, consumeInteract, queueMobileInteract } from "@/game/input";
import { requestTeleport } from "@/game/teleport";
import { getTravelDestination } from "@/game/travel";
import { loadProgress, saveProgress } from "@/game/progress";
import { getActiveQuest, isExplorationComplete, isQuestMilestone } from "@/game/quests";
import { playCoinSound, playCompletionFanfare, playDiscoverySound, playFlagSound, playZoneSound } from "@/game/sounds";
import type { GameState, ZoneId } from "@/game/types";

const INITIAL_STATE: GameState = {
  zone: "home",
  playerX: 0,
  playerY: 3,
  playerZ: 0,
  activeInteraction: null,
  standingPlatform: null,
  isBehindWaterfall: false,
  hint: "WASD 이동 · Space 점프 · E 상호작용 · 드래그로 시점 회전",
  ready: false,
  jumpFeedback: null,
  feedbackTick: 0,
  coinsCollected: [],
  totalCoins: COINS.length,
  flagsDiscovered: [],
  totalFlags: FLAGS.length,
  coinBurst: null,
  cloudBubble: null,
};

export default function GameShell() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [coinsCollected, setCoinsCollected] = useState<string[]>([]);
  const [flagsDiscovered, setFlagsDiscovered] = useState<string[]>([]);
  const [buildingsVisited, setBuildingsVisited] = useState<string[]>([]);
  const [contentId, setContentId] = useState<string | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [zoneFlash, setZoneFlash] = useState<ZoneId | null>(null);
  const [coinBurstTick, setCoinBurstTick] = useState(0);
  const [questReveal, setQuestReveal] = useState<{ quest: string; id: number } | null>(
    null,
  );
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [bgmOn, setBgmOn] = useState(true);
  const [introPhase, setIntroPhase] = useState<IntroPhase>("idle");
  const [introZoom, setIntroZoom] = useState(0);

  const prevZone = useRef<ZoneId>("home");
  const zoneFlashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const lastRevealedQuestRef = useRef<string>("");
  const prevQuestMilestoneRef = useRef<string>("");
  const questReadyRef = useRef(false);
  const celebrationScheduledRef = useRef(false);
  const celebrationSeenRef = useRef(false);
  const progressRef = useRef({
    buildingsVisited,
    coinsCollected: coinsCollected.length,
    flagsDiscovered: flagsDiscovered.length,
    totalCoins: state.totalCoins,
    totalFlags: state.totalFlags,
  });
  progressRef.current = {
    buildingsVisited,
    coinsCollected: coinsCollected.length,
    flagsDiscovered: flagsDiscovered.length,
    totalCoins: state.totalCoins,
    totalFlags: state.totalFlags,
  };

  const saveDataRef = useRef({
    coinsCollected,
    flagsDiscovered,
    buildingsVisited,
    showTutorial,
  });
  saveDataRef.current = {
    coinsCollected,
    flagsDiscovered,
    buildingsVisited,
    showTutorial,
  };

  const paused =
    !gameStarted || contentId !== null || showTutorial || showCelebration;

  const questProgress = {
    buildingsVisited,
    coinsCollected: coinsCollected.length,
    flagsDiscovered: flagsDiscovered.length,
    totalCoins: state.totalCoins,
    totalFlags: state.totalFlags,
  };

  const activeQuest = getActiveQuest(questProgress);

  const explorationComplete = useMemo(
    () => isExplorationComplete(questProgress),
    [
      buildingsVisited,
      coinsCollected.length,
      flagsDiscovered.length,
      state.totalCoins,
      state.totalFlags,
    ],
  );

  const handleBgmToggle = useCallback(() => {
    setBgmOn(toggleBgmEnabled());
  }, []);

  const handleOpenBuilding = useCallback((destinationId: string) => {
    const dest = getTravelDestination(destinationId);
    if (!dest) return;

    const platform = INTERACTIONS.find((z) => z.id === dest.contentId)?.platform;
    if (platform) setBuildingCheckpoint(platform);

    requestTeleport(dest.position);
    setBuildingsVisited((prev) =>
      prev.includes(dest.contentId) ? prev : [...prev, dest.contentId],
    );
    setContentId(dest.contentId);
    playDiscoverySound();
  }, []);

  const handleGameStart = useCallback(async () => {
    await unlockGameAudio();
    setGameStarted(true);
  }, []);

  const triggerQuestReveal = useCallback((quest: string) => {
    if (!quest || quest === lastRevealedQuestRef.current) return;
    lastRevealedQuestRef.current = quest;
    setQuestReveal({ quest, id: Date.now() });
  }, []);

  const closeContent = useCallback(() => {
    setContentId(null);
    window.setTimeout(() => {
      triggerQuestReveal(getActiveQuest(progressRef.current));
    }, 100);
  }, [triggerQuestReveal]);

  useEffect(() => {
    initBgmPreference();
    setBgmOn(isBgmEnabled());

    const progress = loadProgress();
    setCoinsCollected(progress.coins);
    setFlagsDiscovered(progress.flags);
    setBuildingsVisited(progress.buildings);
    setShowTutorial(!progress.tutorialDone);
    celebrationSeenRef.current = Boolean(progress.celebrationSeen);

    const initialQuest = getActiveQuest({
      buildingsVisited: progress.buildings,
      coinsCollected: progress.coins.length,
      flagsDiscovered: progress.flags.length,
      totalCoins: COINS.length,
      totalFlags: FLAGS.length,
    });
    lastRevealedQuestRef.current = initialQuest;
    prevQuestMilestoneRef.current = initialQuest;
  }, []);

  useEffect(() => {
    if (!state.ready || introPhase !== "idle") return;
    setIntroPhase("title");
  }, [state.ready, introPhase]);

  useEffect(() => {
    if (introPhase !== "title") return;
    const t = window.setTimeout(
      () => setIntroPhase("zoom"),
      INTRO_TIMING.titleHoldMs,
    );
    return () => clearTimeout(t);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "zoom") return;

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / INTRO_TIMING.zoomDurationMs);
      setIntroZoom(easeInOutCubic(raw));
      if (raw < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setIntroPhase("ready");
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [introPhase]);

  useEffect(() => {
    if (!gameStarted) return;
    return bindKeyboardInput();
  }, [gameStarted]);

  useEffect(() => {
    setBgmDucked(contentId !== null || showTutorial || showCelebration);
  }, [contentId, showTutorial, showCelebration]);

  useEffect(() => {
    saveProgress({
      coins: coinsCollected,
      flags: flagsDiscovered,
      buildings: buildingsVisited,
      tutorialDone: !showTutorial,
      celebrationSeen: celebrationSeenRef.current,
    });
  }, [coinsCollected, flagsDiscovered, buildingsVisited, showTutorial]);

  // 탐험 100% — 빵빠레 + 연락처 (한 번만 예약)
  useEffect(() => {
    if (!explorationComplete || !state.ready || !gameStarted || showTutorial || contentId) return;
    if (celebrationSeenRef.current || celebrationScheduledRef.current) return;

    celebrationScheduledRef.current = true;
    window.setTimeout(() => {
      if (celebrationSeenRef.current) return;
      playCompletionFanfare();
      setShowCelebration(true);
      celebrationSeenRef.current = true;
      const snap = saveDataRef.current;
      saveProgress({
        coins: snap.coinsCollected,
        flags: snap.flagsDiscovered,
        buildings: snap.buildingsVisited,
        tutorialDone: !snap.showTutorial,
        celebrationSeen: true,
      });
    }, 700);
  }, [explorationComplete, state.ready, gameStarted, showTutorial, contentId]);

  useEffect(() => {
    if (!state.ready) return;
    questReadyRef.current = true;
  }, [state.ready]);

  // 코인/깃발 단계로 넘어갈 때 (건물 퀘스트는 closeContent에서 처리)
  useEffect(() => {
    if (!questReadyRef.current || !state.ready || !gameStarted || showTutorial || contentId) return;
    if (activeQuest.includes("에 도착하기")) return;

    const prev = prevQuestMilestoneRef.current;
    if (!isQuestMilestone(prev, activeQuest)) {
      prevQuestMilestoneRef.current = activeQuest;
      return;
    }

    prevQuestMilestoneRef.current = activeQuest;
    triggerQuestReveal(activeQuest);
  }, [activeQuest, contentId, gameStarted, showTutorial, state.ready, triggerQuestReveal]);

  const handleStateChange = useCallback((next: GameState) => {
    setState(next);
  }, []);

  const handleCollectCoin = useCallback((id: string) => {
    setCoinsCollected((prev) => {
      if (prev.includes(id)) return prev;
      playCoinSound();
      setCoinBurstTick((t) => t + 1);
      return [...prev, id];
    });
  }, []);

  const handleDiscoverFlag = useCallback((id: string) => {
    setFlagsDiscovered((prev) => {
      if (prev.includes(id)) return prev;
      playFlagSound();
      return [...prev, id];
    });
  }, []);

  function platformKey(platform: [number, number, number] | null): string | null {
    if (!platform) return null;
    return `${platform[0]},${platform[1]},${platform[2]}`;
  }

  const enterStateRef = useRef({
    ready: state.ready,
    showTutorial,
    contentId,
    activeInteraction: state.activeInteraction,
    standingPlatform: state.standingPlatform,
  });
  enterStateRef.current = {
    ready: state.ready,
    showTutorial,
    contentId,
    activeInteraction: state.activeInteraction,
    standingPlatform: state.standingPlatform,
  };

  const tryEnterBuilding = useCallback(() => {
    const {
      ready,
      showTutorial: tut,
      contentId: cid,
      activeInteraction,
      standingPlatform,
    } = enterStateRef.current;

    if (!ready || tut || cid) return;
    if (!activeInteraction) return;

    const currentKey = platformKey(standingPlatform);
    if (currentKey !== platformKey(activeInteraction.platform)) return;
    if (!getContentByInteractionId(activeInteraction.id)) return;

    setBuildingsVisited((prev) =>
      prev.includes(activeInteraction.id) ? prev : [...prev, activeInteraction.id],
    );
    setBuildingCheckpoint(activeInteraction.platform);
    setContentId(activeInteraction.id);
    playDiscoverySound();
  }, []);

  useEffect(() => {
    if (!state.ready || paused) return;

    let raf = 0;
    const tick = () => {
      if (consumeInteract()) tryEnterBuilding();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state.ready, paused, tryEnterBuilding]);

  useEffect(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    return bindCameraDrag(el, () => paused || !state.ready);
  }, [paused, state.ready]);

  useEffect(() => {
    if (!state.ready || state.zone === prevZone.current) return;

    playZoneSound();
    setZoneFlash(state.zone);
    if (zoneFlashTimer.current) clearTimeout(zoneFlashTimer.current);
    zoneFlashTimer.current = setTimeout(() => setZoneFlash(null), 1400);
    prevZone.current = state.zone;
  }, [state.zone, state.ready]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape" && showTutorial) {
        setShowTutorial(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showTutorial]);

  const activeContent = contentId ? getContentByInteractionId(contentId) : null;
  const finishTutorial = useCallback(() => setShowTutorial(false), []);

  const totalBuildings = INTERACTIONS.length;
  const buildingProgress =
    totalBuildings > 0 ? buildingsVisited.length / totalBuildings : 0;
  const coinProgress =
    state.totalCoins > 0 ? coinsCollected.length / state.totalCoins : 0;
  const flagProgress =
    state.totalFlags > 0 ? flagsDiscovered.length / state.totalFlags : 0;
  const explorationPercent = Math.round(
    ((buildingProgress + coinProgress + flagProgress) / 3) * 100,
  );

  const playerPosition = useMemo(
    (): [number, number, number] => [state.playerX, state.playerY, state.playerZ],
    [state.playerX, state.playerY, state.playerZ],
  );

  const enterBuilding =
    state.ready &&
    !showTutorial &&
    !contentId &&
    state.activeInteraction &&
    platformKey(state.standingPlatform) ===
      platformKey(state.activeInteraction.platform) &&
    getContentByInteractionId(state.activeInteraction.id)
      ? state.activeInteraction
      : null;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#87a8c8]">
      <div
        ref={canvasWrapRef}
        className={`absolute inset-0 ${gameStarted ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
      >
        <GameCanvas
          zone={state.zone}
          paused={paused}
          hideLandmarkLabels={contentId !== null || showCelebration || !gameStarted}
          playerPosition={playerPosition}
          coinsCollected={coinsCollected}
          flagsDiscovered={flagsDiscovered}
          cloudBubble={state.cloudBubble}
          introPhase={gameStarted ? "idle" : introPhase}
          introZoom={introZoom}
          onStateChange={handleStateChange}
          onCollectCoin={handleCollectCoin}
          onDiscoverFlag={handleDiscoverFlag}
        />
      </div>

      <div
        className={`pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#06040c] transition-opacity duration-1000 ${
          state.ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/30">
          Loading World
        </p>
        <h2 className="text-3xl font-bold text-white/90">YS World</h2>
        <div className="mt-6 h-px w-32 overflow-hidden bg-white/10">
          <div className="h-full w-1/2 animate-pulse bg-amber-400/60" />
        </div>
      </div>

      <div
        className={`transition-opacity duration-1000 ${state.ready && gameStarted ? "opacity-100" : "opacity-0"} ${!gameStarted || contentId || showCelebration ? "pointer-events-none opacity-0" : ""}`}
      >
        <JumpFeedback label={state.jumpFeedback} tick={state.feedbackTick} />
        <CoinBurst tick={coinBurstTick} />
        <GameHUD
          zone={state.zone}
          hint={state.hint}
          isBehindWaterfall={state.isBehindWaterfall}
          coinsCollected={coinsCollected.length}
          totalCoins={state.totalCoins}
          flagsDiscovered={flagsDiscovered.length}
          totalFlags={state.totalFlags}
          explorationPercent={explorationPercent}
          activeQuest={activeQuest}
          enterPrompt={enterBuilding ? { title: enterBuilding.title } : null}
          bgmOn={bgmOn}
          onBgmToggle={handleBgmToggle}
        />

        <QuickTravelBar
          visitedIds={buildingsVisited}
          onOpenBuilding={handleOpenBuilding}
        />

        {zoneFlash && <ZoneTransition zone={zoneFlash} visible={!!zoneFlash} />}

        {showTutorial && state.ready && gameStarted && !contentId && (
          <TutorialOverlay
            step={tutorialStep}
            onNext={() => {
              if (tutorialStep >= 3) finishTutorial();
              else setTutorialStep((s) => s + 1);
            }}
            onSkip={finishTutorial}
          />
        )}

        <MobileControls
          disabled={paused}
          showEnter={!!enterBuilding}
          onEnter={() => queueMobileInteract()}
        />
      </div>

      <StartScreen
        phase={gameStarted ? "idle" : introPhase}
        zoomProgress={introZoom}
        bgmOn={bgmOn}
        onBgmToggle={handleBgmToggle}
        onStart={handleGameStart}
      />

      {activeContent && (
        <ContentOverlay content={activeContent} onClose={closeContent} />
      )}

      <QuestReveal
        payload={questReveal}
        onComplete={() => setQuestReveal(null)}
      />

      <CompletionCelebration
        visible={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
    </div>
  );
}
