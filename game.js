import { firebaseConfig } from "./firebase-config.js";

const BUY_BASE_COST = 50;
const PASTURE_LIMIT = 30;
const MAX_LEVEL = 25;
const NZD_START_LEVEL = 15;
const NZD_BASE_INCOME = 0.000000001;
const SAVE_KEY = "happy-sheep-farm-save-v5";
const OLD_SAVE_KEYS = [
  "happy-sheep-farm-save-v4",
  "happy-sheep-farm-save-v3",
  "happy-sheep-farm-save-v2",
  "happy-sheep-farm-save-v1"
];
const MOODS = ["happy", "blink", "curious", "sleepy"];

const LEVEL_NAMES = [
  "棒球帽羊",
  "弹弓羊",
  "铜角羊",
  "蓝帽羊",
  "星角羊",
  "金冠羊",
  "彩虹羊",
  "传说羊",
  "松露羊",
  "银铃羊",
  "翡翠羊",
  "黑曜羊",
  "极光羊",
  "钻石羊",
  "纽币羊",
  "牧场经理羊",
  "黄金剪羊",
  "云端羊",
  "银河羊",
  "皇家羊",
  "时光羊",
  "量子羊",
  "奥克兰羊王",
  "南十字星羊",
  "新西兰神话羊"
];

const LEVEL_STYLES = [
  { "--fur-hi": "#fff9ef", "--fur-mid": "#f0d7bd", "--fur-low": "#d6a47b", "--face-hi": "#ffb4ad", "--face-low": "#d85e69", "--mark": "rgba(255,255,255,.35)", "--hat": "#f8fbff", "--hat-brim": "#1e6b9a", "--hat-opacity": "1", "--leg": "#33343a", "--ear": "#efa2a5" },
  { "--fur-hi": "#ffe2dc", "--fur-mid": "#ffaaa1", "--fur-low": "#ef7778", "--face-hi": "#ffc6c0", "--face-low": "#de6971", "--mark": "rgba(255,255,255,.38)", "--scarf": "#d93135", "--scarf-opacity": "1", "--tool": "#e2a73b", "--tool-opacity": "1", "--ear": "#ffb3b7" },
  { "--fur-hi": "#fff3b8", "--fur-mid": "#edb64f", "--fur-low": "#b76720", "--face-hi": "#f1a88b", "--face-low": "#9d4b3e", "--mark": "rgba(98,57,12,.26)", "--horn": "#f7df9a", "--horn-opacity": "1", "--ear": "#d58a60" },
  { "--fur-hi": "#f5fdff", "--fur-mid": "#a6dff5", "--fur-low": "#3b97bd", "--face-hi": "#d5eef6", "--face-low": "#547d91", "--mark": "rgba(255,255,255,.42)", "--hat": "#4b83d9", "--hat-brim": "#1b3c78", "--hat-opacity": "1", "--ear": "#b9e1eb" },
  { "--fur-hi": "#f6f1ff", "--fur-mid": "#c0adff", "--fur-low": "#735dd4", "--face-hi": "#d4c6ff", "--face-low": "#5c4a9d", "--mark": "rgba(255,255,255,.46)", "--horn": "#e6dcff", "--horn-opacity": "1", "--ear": "#baa8f6" },
  { "--fur-hi": "#fff8bc", "--fur-mid": "#f3c84e", "--fur-low": "#b97215", "--face-hi": "#f2bd66", "--face-low": "#6e3915", "--mark": "rgba(255,255,255,.36)", "--crown-opacity": "1", "--ear": "#e8ad55" },
  { "--fur-hi": "#f8ffff", "--fur-mid": "#7ee6d6", "--fur-low": "#de639a", "--face-hi": "#ffc8e2", "--face-low": "#9b4070", "--mark": "rgba(255,238,92,.42)", "--horn": "#fff2a7", "--horn-opacity": "1", "--scarf": "linear-gradient(90deg,#ff6868,#ffdd58,#4ccf7a,#5ba8ff)", "--scarf-opacity": "1", "--ear": "#ffc1dc" },
  { "--fur-hi": "#ffffff", "--fur-mid": "#d3dce8", "--fur-low": "#59697b", "--face-hi": "#dfe8f5", "--face-low": "#26303b", "--mark": "rgba(255,255,255,.52)", "--horn": "#d7e2f1", "--horn-opacity": "1", "--crown-opacity": "1", "--ear": "#cad8e5" },
  { "--fur-hi": "#f5fff0", "--fur-mid": "#91cf74", "--fur-low": "#4a8d4f", "--face-hi": "#edbc9b", "--face-low": "#87513d", "--mark": "rgba(61,105,39,.25)", "--tool": "#6b4026", "--tool-opacity": "1", "--ear": "#cf9270" },
  { "--fur-hi": "#fffdf5", "--fur-mid": "#e8e1c8", "--fur-low": "#97927c", "--face-hi": "#f0c3ac", "--face-low": "#86665d", "--mark": "rgba(255,255,255,.46)", "--scarf": "#f1d45b", "--scarf-opacity": "1", "--ear": "#dfb29e" },
  { "--fur-hi": "#effff7", "--fur-mid": "#8ee2b7", "--fur-low": "#277a5a", "--face-hi": "#bdecd7", "--face-low": "#326d5a", "--mark": "rgba(255,255,255,.36)", "--horn": "#caf5df", "--horn-opacity": "1", "--ear": "#abe2c8" },
  { "--fur-hi": "#e8e6e2", "--fur-mid": "#6f6a66", "--fur-low": "#1e1b1c", "--face-hi": "#b5aaa2", "--face-low": "#252127", "--mark": "rgba(255,255,255,.24)", "--hat": "#2a262e", "--hat-brim": "#d6bd70", "--hat-opacity": "1", "--ear": "#82756f" },
  { "--fur-hi": "#f2ffff", "--fur-mid": "#89e9ff", "--fur-low": "#5b64c5", "--face-hi": "#d3f2ff", "--face-low": "#5461a3", "--mark": "rgba(255,255,255,.52)", "--scarf": "linear-gradient(90deg,#7df6ff,#c487ff)", "--scarf-opacity": "1", "--ear": "#b9ebff" },
  { "--fur-hi": "#ffffff", "--fur-mid": "#bde8ff", "--fur-low": "#6d9dd5", "--face-hi": "#eef9ff", "--face-low": "#425f8e", "--mark": "rgba(255,255,255,.6)", "--crown-opacity": "1", "--horn": "#e7f6ff", "--horn-opacity": "1", "--ear": "#d4efff" },
  { "--fur-hi": "#f9ffde", "--fur-mid": "#bce25c", "--fur-low": "#62942e", "--face-hi": "#d7f0a4", "--face-low": "#59793b", "--mark": "rgba(255,255,255,.5)", "--tool": "#1e6f46", "--tool-opacity": "1", "--hat": "#163c2b", "--hat-brim": "#78d26f", "--hat-opacity": "1", "--ear": "#c3e98c" },
  { "--fur-hi": "#fff7e1", "--fur-mid": "#f0c164", "--fur-low": "#9e6b21", "--face-hi": "#f7d29b", "--face-low": "#7b4c22", "--mark": "rgba(255,255,255,.36)", "--scarf": "#174f38", "--scarf-opacity": "1", "--crown-opacity": "1", "--ear": "#dfaa70" },
  { "--fur-hi": "#fff6d8", "--fur-mid": "#edc64a", "--fur-low": "#b77a19", "--face-hi": "#f2c47d", "--face-low": "#714019", "--mark": "rgba(255,255,255,.42)", "--tool": "#c6d5dc", "--tool-opacity": "1", "--horn": "#ffe899", "--horn-opacity": "1", "--ear": "#e5ad5b" },
  { "--fur-hi": "#ffffff", "--fur-mid": "#dceeff", "--fur-low": "#93b8d8", "--face-hi": "#e8f5ff", "--face-low": "#65809a", "--mark": "rgba(255,255,255,.58)", "--hat": "#ffffff", "--hat-brim": "#8bc9ff", "--hat-opacity": "1", "--ear": "#d5ebff" },
  { "--fur-hi": "#fffaff", "--fur-mid": "#9297ff", "--fur-low": "#2a347d", "--face-hi": "#d9d8ff", "--face-low": "#30336c", "--mark": "rgba(255,230,88,.42)", "--horn": "#f6eeff", "--horn-opacity": "1", "--scarf": "#1d244f", "--scarf-opacity": "1", "--ear": "#c0c3ff" },
  { "--fur-hi": "#fff5c0", "--fur-mid": "#e5b744", "--fur-low": "#754317", "--face-hi": "#f2c578", "--face-low": "#5a3118", "--mark": "rgba(118,68,13,.25)", "--crown-opacity": "1", "--scarf": "#8c102a", "--scarf-opacity": "1", "--ear": "#d99d51" },
  { "--fur-hi": "#f7fbff", "--fur-mid": "#b3d4dc", "--fur-low": "#5b7c82", "--face-hi": "#d7e7ec", "--face-low": "#526b70", "--mark": "rgba(255,255,255,.44)", "--hat": "#394c55", "--hat-brim": "#b8d7df", "--hat-opacity": "1", "--ear": "#bfd4da" },
  { "--fur-hi": "#f4ffff", "--fur-mid": "#71f6d9", "--fur-low": "#365eb4", "--face-hi": "#c6fff1", "--face-low": "#334c88", "--mark": "rgba(255,255,255,.48)", "--horn": "#e5fff7", "--horn-opacity": "1", "--tool": "#6c45ff", "--tool-opacity": "1", "--ear": "#a7f5e5" },
  { "--fur-hi": "#fff4df", "--fur-mid": "#9ed681", "--fur-low": "#247452", "--face-hi": "#f1c8a6", "--face-low": "#604431", "--mark": "rgba(255,255,255,.4)", "--hat": "#111d16", "--hat-brim": "#efcc5c", "--hat-opacity": "1", "--crown-opacity": "1", "--ear": "#d5a47e" },
  { "--fur-hi": "#f8ffff", "--fur-mid": "#92c7ff", "--fur-low": "#1b4b83", "--face-hi": "#d3edff", "--face-low": "#284e7b", "--mark": "rgba(255,255,255,.5)", "--scarf": "#df224a", "--scarf-opacity": "1", "--horn": "#fff5ac", "--horn-opacity": "1", "--ear": "#b9dcff" },
  { "--fur-hi": "#ffffff", "--fur-mid": "#f7e59c", "--fur-low": "#7c8f95", "--face-hi": "#f8e5bd", "--face-low": "#4b5b61", "--mark": "rgba(255,255,255,.62)", "--crown-opacity": "1", "--horn": "#fff8d7", "--horn-opacity": "1", "--scarf": "linear-gradient(90deg,#101820,#f6d35d,#7bc67b)", "--scarf-opacity": "1", "--ear": "#efdcad" }
];

const LEVELS = LEVEL_NAMES.map((name, index) => {
  const level = index + 1;
  return {
    level,
    name,
    coinIncome: level < NZD_START_LEVEL ? Math.max(1, Math.floor(1.9 ** (level - 1))) : 0,
    nzdIncome: level >= NZD_START_LEVEL ? NZD_BASE_INCOME * 3 ** (level - NZD_START_LEVEL) : 0,
    style: LEVEL_STYLES[index]
  };
});

const state = {
  coins: 100,
  nzd: 0,
  reputation: 0,
  pasture: [],
  maxLevel: 1,
  totalBought: 0,
  totalMerged: 0,
  totalEarnedCoins: 0,
  totalEarnedNzd: 0,
  boostUntil: 0,
  lastSaved: Date.now()
};

const cloud = {
  enabled: false,
  ready: false,
  user: null,
  auth: null,
  db: null,
  modules: null,
  lastSaveAt: 0,
  saveTimer: null
};

const dom = {};
let drag = null;
let toastTimer = null;
let lastFrame = 0;

function sheepId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomPosition() {
  return {
    x: randomBetween(12, 88),
    y: randomBetween(16, 84),
    tx: randomBetween(12, 88),
    ty: randomBetween(16, 84)
  };
}

function levelData(level) {
  return LEVELS[Math.min(Math.max(Number(level) || 1, 1), LEVELS.length) - 1];
}

function buyCost() {
  if (state.totalBought < 2) return BUY_BASE_COST;
  return Math.floor(BUY_BASE_COST * 1.18 ** Math.max(0, state.totalBought - 1));
}

function mergeRequirement(level) {
  return Math.min(6, 2 + Math.floor((Math.max(1, level) - 1) / 5));
}

function createSheep(level = 1, position = randomPosition()) {
  return {
    id: sheepId(),
    level: Math.min(level, MAX_LEVEL),
    x: position.x,
    y: position.y,
    tx: position.tx ?? randomBetween(12, 88),
    ty: position.ty ?? randomBetween(16, 84),
    speed: randomBetween(4.2, 7.8),
    mood: MOODS[Math.floor(Math.random() * MOODS.length)],
    moodChangeAt: randomBetween(1200, 3600)
  };
}

function normalizeSheep(raw) {
  if (!raw) return null;
  const pos = randomPosition();
  return {
    id: raw.id || sheepId(),
    level: Math.min(Number(raw.level) || 1, MAX_LEVEL),
    x: Number.isFinite(Number(raw.x)) ? Number(raw.x) : pos.x,
    y: Number.isFinite(Number(raw.y)) ? Number(raw.y) : pos.y,
    tx: Number.isFinite(Number(raw.tx)) ? Number(raw.tx) : pos.tx,
    ty: Number.isFinite(Number(raw.ty)) ? Number(raw.ty) : pos.ty,
    speed: Number.isFinite(Number(raw.speed)) ? Number(raw.speed) : randomBetween(4.2, 7.8),
    mood: MOODS.includes(raw.mood) ? raw.mood : "happy",
    moodChangeAt: randomBetween(800, 2800)
  };
}

function compactSheep(list) {
  return Array.isArray(list) ? list.filter(Boolean).map(normalizeSheep) : [];
}

function serializableState() {
  return {
    coins: state.coins,
    nzd: state.nzd,
    reputation: state.reputation,
    pasture: state.pasture,
    maxLevel: state.maxLevel,
    totalBought: state.totalBought,
    totalMerged: state.totalMerged,
    totalEarnedCoins: state.totalEarnedCoins,
    totalEarnedNzd: state.totalEarnedNzd,
    boostUntil: state.boostUntil,
    lastSaved: Date.now(),
    version: 5
  };
}

function applySavedState(saved, fromCloud = false) {
  const pasture = compactSheep(saved.pasture);
  const migratedWorkshop = compactSheep(saved.workshop);
  const allSheep = [...pasture, ...migratedWorkshop].slice(0, PASTURE_LIMIT);

  Object.assign(state, {
    coins: Number.isFinite(Number(saved.coins)) ? Number(saved.coins) : 100,
    nzd: Number.isFinite(Number(saved.nzd)) ? Number(saved.nzd) : 0,
    reputation: Number(saved.reputation) || 0,
    pasture: allSheep,
    maxLevel: Math.min(Number(saved.maxLevel) || highestPastureLevel(allSheep), MAX_LEVEL),
    totalBought: Number(saved.totalBought) || 0,
    totalMerged: Number(saved.totalMerged) || 0,
    totalEarnedCoins: Number(saved.totalEarnedCoins ?? saved.totalEarned) || 0,
    totalEarnedNzd: Number(saved.totalEarnedNzd) || 0,
    boostUntil: Number(saved.boostUntil) || 0,
    lastSaved: Number(saved.lastSaved) || Date.now()
  });

  if (!fromCloud) {
    applyOfflineIncome();
  }
}

function highestPastureLevel(list = state.pasture) {
  return Math.max(1, ...list.map((sheep) => sheep.level || 1));
}

function applyOfflineIncome() {
  const offlineSeconds = Math.min(7200, Math.floor((Date.now() - state.lastSaved) / 1000));
  if (offlineSeconds <= 0) return;

  const offlineCoins = coinIncomePerSecond() * offlineSeconds * 0.35;
  const offlineNzd = nzdIncomePerSecond() * offlineSeconds * 0.35;
  if (offlineCoins > 0) {
    state.coins += offlineCoins;
    state.totalEarnedCoins += offlineCoins;
  }
  if (offlineNzd > 0) {
    state.nzd += offlineNzd;
    state.totalEarnedNzd += offlineNzd;
  }
  if (offlineCoins > 0 || offlineNzd > 0) {
    toast(`离线收益 +${formatNumber(offlineCoins)} 金币 ${formatNZD(offlineNzd)}`);
  }
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY) || OLD_SAVE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
  if (!raw) return;

  try {
    applySavedState(JSON.parse(raw));
  } catch {
    localStorage.removeItem(SAVE_KEY);
  }
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(serializableState()));
  scheduleCloudSave();
}

function incomeMultiplier() {
  return Date.now() < state.boostUntil ? 2 : 1;
}

function coinIncomePerSecond() {
  return state.pasture.reduce((sum, sheep) => {
    return sum + levelData(sheep.level).coinIncome;
  }, 0) * incomeMultiplier();
}

function nzdIncomePerSecond() {
  return state.pasture.reduce((sum, sheep) => {
    return sum + levelData(sheep.level).nzdIncome;
  }, 0) * incomeMultiplier();
}

function buySheep() {
  const cost = buyCost();
  if (state.pasture.length >= PASTURE_LIMIT) {
    toast("牧场满了，先合成升级。");
    return;
  }
  if (state.coins < cost) {
    toast(`金币不够，需要 ${formatNumber(cost)}。`);
    return;
  }

  state.coins -= cost;
  state.pasture.push(createSheep(1));
  state.totalBought += 1;
  toast("购买成功");
  render();
  saveGame();
}

function mergeSheep(sourceIndex, targetIndex) {
  const source = state.pasture[sourceIndex];
  const target = state.pasture[targetIndex];
  if (!source || !target || sourceIndex === targetIndex) return false;
  if (source.level !== target.level) {
    toast("相同等级才能合成。");
    return false;
  }
  if (source.level >= MAX_LEVEL) {
    toast("已经是最高等级。");
    return false;
  }

  const required = mergeRequirement(source.level);
  const sameLevelIndexes = state.pasture
    .map((sheep, index) => ({ sheep, index }))
    .filter((item) => item.sheep.level === source.level)
    .map((item) => item.index);

  if (sameLevelIndexes.length < required) {
    toast(`Lv.${source.level} 升级需要 ${required} 只同级羊。`);
    return false;
  }

  const selected = [sourceIndex, targetIndex];
  sameLevelIndexes.forEach((index) => {
    if (selected.length < required && !selected.includes(index)) selected.push(index);
  });

  const selectedSheep = selected.map((index) => state.pasture[index]);
  const nextLevel = source.level + 1;
  const wasNewUnlock = nextLevel > state.maxLevel;
  const merged = createSheep(nextLevel, {
    x: selectedSheep.reduce((sum, sheep) => sum + sheep.x, 0) / selectedSheep.length,
    y: selectedSheep.reduce((sum, sheep) => sum + sheep.y, 0) / selectedSheep.length,
    tx: randomBetween(12, 88),
    ty: randomBetween(16, 84)
  });
  const selectedSet = new Set(selected);

  state.pasture = state.pasture.filter((_, index) => !selectedSet.has(index));
  state.pasture.push(merged);
  state.maxLevel = Math.max(state.maxLevel, nextLevel);
  state.reputation += nextLevel * required;
  state.totalMerged += 1;

  render();
  saveGame();

  if (wasNewUnlock) {
    showLevelUp(nextLevel);
  } else {
    toast(`合成成功：${levelData(nextLevel).name}`);
  }
  return true;
}

function autoMerge() {
  for (let level = 1; level < MAX_LEVEL; level += 1) {
    const indexes = state.pasture
      .map((sheep, index) => ({ sheep, index }))
      .filter((item) => item.sheep.level === level)
      .map((item) => item.index);
    if (indexes.length >= mergeRequirement(level)) {
      mergeSheep(indexes[0], indexes[1]);
      return;
    }
  }
  toast("没有足够数量的同级羊。");
}

function collectWoolOrder() {
  const reward = Math.floor(35 + state.maxLevel * 18 + coinIncomePerSecond() * 4);
  const cooldownKey = "happy-sheep-order-time";
  const last = Number(localStorage.getItem(cooldownKey)) || 0;
  const waitMs = 90000;
  if (Date.now() - last < waitMs) {
    toast(`订单还要 ${Math.ceil((waitMs - (Date.now() - last)) / 1000)} 秒`);
    return;
  }
  state.coins += reward;
  state.reputation += 5;
  state.totalEarnedCoins += reward;
  localStorage.setItem(cooldownKey, String(Date.now()));
  toast(`获得 ${formatNumber(reward)} 金币`);
  render();
  saveGame();
}

function feedBoost() {
  const cost = Math.max(120, state.maxLevel * 95);
  if (Date.now() < state.boostUntil) {
    toast("加速中。");
    return;
  }
  if (state.coins < cost) {
    toast(`加速需要 ${formatNumber(cost)} 金币。`);
    return;
  }
  state.coins -= cost;
  state.boostUntil = Date.now() + 30000;
  toast("30 秒双倍产出");
  render();
  saveGame();
}

function resetGame() {
  if (!window.confirm("确定重开吗？")) return;
  localStorage.removeItem(SAVE_KEY);
  OLD_SAVE_KEYS.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem("happy-sheep-order-time");
  localStorage.removeItem("happy-sheep-quest-flags");
  window.location.reload();
}

function formatNumber(value) {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${Math.floor(value)}`;
}

function formatNZD(value) {
  if (!value) return "NZ$0";
  if (value >= 1) return `NZ$${value.toFixed(2)}`;
  if (value >= 0.01) return `NZ$${value.toFixed(4)}`;
  return `NZ$${value.toFixed(12).replace(/0+$/, "").replace(/\.$/, "")}`;
}

function sheepStyleAttr(level) {
  return Object.entries(levelData(level).style)
    .map(([key, value]) => `${key}:${value}`)
    .join(";");
}

function applySheepStyle(element, level) {
  Object.entries(levelData(level).style).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}

function sheepMarkup(sheep) {
  return `
    <span class="sheep-shadow"></span>
    <span class="sheep-core"></span>
    <span class="sheep-ear left"></span>
    <span class="sheep-ear right"></span>
    <span class="sheep-face"></span>
    <span class="sheep-nose"></span>
    <span class="sheep-mouth"></span>
    <span class="sheep-hat"></span>
    <span class="sheep-horn left"></span>
    <span class="sheep-horn right"></span>
    <span class="sheep-crown"></span>
    <span class="sheep-scarf"></span>
    <span class="sheep-tool"></span>
    <span class="sheep-leg one"></span>
    <span class="sheep-leg two"></span>
    <span class="sheep-level">${sheep.level}</span>
  `;
}

function sheepButton(sheep, index) {
  const button = document.createElement("button");
  button.className = `sheep-token walking variant-${sheep.level} mood-${sheep.mood || "happy"}`;
  button.type = "button";
  button.style.left = `${sheep.x}%`;
  button.style.top = `${sheep.y}%`;
  applySheepStyle(button, sheep.level);
  button.setAttribute("data-testid", "pasture-sheep");
  button.setAttribute("data-sheep-id", sheep.id);
  button.setAttribute("aria-label", `${levelData(sheep.level).name}，等级 ${sheep.level}`);
  button.innerHTML = sheepMarkup(sheep);
  button.addEventListener("pointerdown", (event) => startDrag(event, index));
  return button;
}

function renderPasture() {
  dom.pasture.querySelectorAll(".sheep-token").forEach((node) => node.remove());
  state.pasture.forEach((sheep, index) => {
    dom.pasture.appendChild(sheepButton(sheep, index));
  });
}

function renderHud() {
  const cost = buyCost();
  dom.coins.textContent = `${formatNumber(state.coins)} 金币`;
  dom.nzd.textContent = formatNZD(state.nzd);
  dom.income.textContent = `+${formatNumber(coinIncomePerSecond())}/秒 · +${formatNZD(nzdIncomePerSecond())}/秒`;
  dom.maxLevel.textContent = `Lv.${state.maxLevel}`;
  dom.pastureCount.textContent = String(state.pasture.length);
  dom.buySheep.disabled = state.coins < cost || state.pasture.length >= PASTURE_LIMIT;
  dom.buyCost.textContent = `${formatNumber(cost)} 金币 · Lv.1`;
  dom.feedBoost.textContent = Date.now() < state.boostUntil ? "加速中" : "加速";
  dom.pastureHint.classList.toggle("is-hidden", state.totalMerged >= 2);
  dom.loginButton.textContent = cloud.user ? "已登录" : "登录";
}

function render() {
  renderHud();
  renderPasture();
}

function updateSheepPositions() {
  state.pasture.forEach((sheep) => {
    const node = dom.pasture.querySelector(`[data-sheep-id="${sheep.id}"]`);
    if (!node || node.classList.contains("dragging")) return;
    node.style.left = `${sheep.x}%`;
    node.style.top = `${sheep.y}%`;
    MOODS.forEach((mood) => node.classList.toggle(`mood-${mood}`, sheep.mood === mood));
  });
}

function animate(time) {
  if (!lastFrame) lastFrame = time;
  const delta = Math.min(0.05, (time - lastFrame) / 1000);
  lastFrame = time;

  state.pasture.forEach((sheep) => {
    if (drag && drag.sheepId === sheep.id) return;
    if (!sheep.moodChangeAt || time > sheep.moodChangeAt) {
      sheep.mood = MOODS[Math.floor(Math.random() * MOODS.length)];
      sheep.moodChangeAt = time + randomBetween(1200, 4200);
    }

    const dx = sheep.tx - sheep.x;
    const dy = sheep.ty - sheep.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 1.2) {
      sheep.tx = randomBetween(10, 90);
      sheep.ty = randomBetween(14, 86);
      sheep.speed = randomBetween(4.2, 7.8);
      return;
    }

    const step = sheep.speed * delta;
    sheep.x += (dx / distance) * step;
    sheep.y += (dy / distance) * step;
  });

  updateSheepPositions();
  requestAnimationFrame(animate);
}

function startDrag(event, index) {
  const sheep = state.pasture[index];
  if (!sheep) return;

  event.preventDefault();
  const node = event.currentTarget;
  node.setPointerCapture(event.pointerId);
  node.classList.add("dragging");
  node.classList.remove("walking");

  drag = {
    index,
    sheepId: sheep.id,
    node,
    pastureRect: dom.pasture.getBoundingClientRect()
  };

  moveDraggedSheep(event.clientX, event.clientY);
  node.addEventListener("pointermove", onDragMove);
  node.addEventListener("pointerup", endDrag);
  node.addEventListener("pointercancel", endDrag);
}

function onDragMove(event) {
  moveDraggedSheep(event.clientX, event.clientY);
}

function moveDraggedSheep(clientX, clientY) {
  if (!drag) return;
  const sheep = state.pasture[drag.index];
  if (!sheep) return;

  const x = ((clientX - drag.pastureRect.left) / drag.pastureRect.width) * 100;
  const y = ((clientY - drag.pastureRect.top) / drag.pastureRect.height) * 100;
  sheep.x = Math.max(7, Math.min(93, x));
  sheep.y = Math.max(11, Math.min(89, y));
  sheep.tx = sheep.x;
  sheep.ty = sheep.y;
  drag.node.style.left = `${sheep.x}%`;
  drag.node.style.top = `${sheep.y}%`;
  highlightMergeTarget();
}

function endDrag(event) {
  if (!drag) return;
  const currentDrag = drag;
  const targetIndex = findMergeTargetIndex(currentDrag.index);

  currentDrag.node.classList.remove("dragging");
  currentDrag.node.classList.add("walking");
  currentDrag.node.releasePointerCapture(event.pointerId);
  currentDrag.node.removeEventListener("pointermove", onDragMove);
  currentDrag.node.removeEventListener("pointerup", endDrag);
  currentDrag.node.removeEventListener("pointercancel", endDrag);
  clearTargets();
  drag = null;

  if (targetIndex !== -1) {
    mergeSheep(currentDrag.index, targetIndex);
  } else {
    render();
    saveGame();
  }
}

function findMergeTargetIndex(sourceIndex) {
  const source = state.pasture[sourceIndex];
  if (!source) return -1;

  return state.pasture.findIndex((candidate, index) => {
    if (!candidate || index === sourceIndex) return false;
    if (candidate.level !== source.level) return false;
    const dx = candidate.x - source.x;
    const dy = candidate.y - source.y;
    return Math.sqrt(dx * dx + dy * dy) < 13;
  });
}

function highlightMergeTarget() {
  clearTargets();
  if (!drag) return;
  const targetIndex = findMergeTargetIndex(drag.index);
  if (targetIndex === -1) return;
  const target = state.pasture[targetIndex];
  const node = dom.pasture.querySelector(`[data-sheep-id="${target.id}"]`);
  if (node) node.classList.add("merge-target");
}

function clearTargets() {
  dom.pasture.querySelectorAll(".merge-target").forEach((node) => node.classList.remove("merge-target"));
}

function questData() {
  return [
    { title: "买入 8 只羊", done: state.totalBought >= 8, progress: `${Math.min(state.totalBought, 8)}/8` },
    { title: "解锁 Lv.10", done: state.maxLevel >= 10, progress: `当前 Lv.${state.maxLevel}` },
    { title: "获得第一笔 NZD", done: state.nzd > 0, progress: formatNZD(state.nzd) }
  ];
}

function openModal(type) {
  if (type === "quest") {
    dom.modalTitle.textContent = "今日任务";
    dom.modalBody.innerHTML = questData()
      .map((quest) => `<div class="quest ${quest.done ? "done" : ""}"><strong>${quest.title}</strong><span>${quest.progress}</span></div>`)
      .join("");
  }

  if (type === "book") {
    dom.modalTitle.textContent = "羊羊图鉴";
    dom.modalBody.innerHTML = `
      <div class="sheep-book">
        ${LEVELS.map((item) => {
          const unlocked = item.level <= state.maxLevel;
          const earn = item.level >= NZD_START_LEVEL
            ? `${formatNZD(item.nzdIncome)}/秒`
            : `${formatNumber(item.coinIncome)} 金币/秒`;
          return `
            <div class="book-item ${unlocked ? "" : "locked"}">
              <span class="book-preview sheep-token variant-${item.level}" style="${sheepStyleAttr(item.level)}">${sheepMarkup({ level: item.level })}</span>
              <strong>${unlocked ? item.name : "未发现"}</strong>
              <span>Lv.${item.level} · ${mergeRequirement(item.level)}只升</span>
              <span>${earn}</span>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  if (type === "login") {
    dom.modalTitle.textContent = "登录存档";
    dom.modalBody.innerHTML = `
      <div class="auth-card">
        <p id="authStatus">${authStatusText()}</p>
        <button id="googleLogin" type="button">Google 登录</button>
        <form id="emailAuthForm" class="auth-form">
          <input id="emailInput" type="email" placeholder="邮箱" autocomplete="email" />
          <input id="passwordInput" type="password" placeholder="密码 6 位以上" autocomplete="current-password" />
          <div class="auth-actions">
            <button id="emailLogin" type="submit" data-mode="login">邮箱登录</button>
            <button id="emailRegister" type="submit" data-mode="register">注册</button>
          </div>
        </form>
        <button id="logoutButton" type="button" ${cloud.user ? "" : "hidden"}>退出登录</button>
      </div>
    `;
  }

  dom.modalBackdrop.hidden = false;
}

function closeModal() {
  dom.modalBackdrop.hidden = true;
}

function showLevelUp(level) {
  dom.modalTitle.textContent = "恭喜升级啦";
  const item = levelData(level);
  const earn = level >= NZD_START_LEVEL
    ? `${formatNZD(item.nzdIncome)}/秒`
    : `${formatNumber(item.coinIncome)} 金币/秒`;
  dom.modalBody.innerHTML = `
    <button class="sheep-token variant-${level}" style="${sheepStyleAttr(level)}" type="button">${sheepMarkup({ level })}</button>
    <div>Lv.${level} ${item.name}</div>
    <div>产出 ${earn}，下次升级需要 ${mergeRequirement(level)} 只同级羊</div>
  `;
  dom.modalBackdrop.hidden = false;
}

function tick() {
  const coinIncome = coinIncomePerSecond();
  const nzdIncome = nzdIncomePerSecond();
  if (coinIncome > 0) {
    state.coins += coinIncome;
    state.totalEarnedCoins += coinIncome;
  }
  if (nzdIncome > 0) {
    state.nzd += nzdIncome;
    state.totalEarnedNzd += nzdIncome;
  }
  renderHud();
  saveGame();
}

function toast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dom.toast.classList.remove("show"), 1700);
}

function hasFirebaseConfig() {
  return Boolean(firebaseConfig && firebaseConfig.apiKey && !String(firebaseConfig.apiKey).includes("YOUR_"));
}

async function setupCloudSave() {
  if (!hasFirebaseConfig()) {
    cloud.ready = true;
    updateAuthStatus("未配置 Firebase，当前使用本地试玩存档。");
    return;
  }

  try {
    const [appModule, authModule, firestoreModule] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
    ]);

    const app = appModule.initializeApp(firebaseConfig);
    cloud.auth = authModule.getAuth(app);
    cloud.db = firestoreModule.getFirestore(app);
    cloud.modules = { ...authModule, ...firestoreModule };
    cloud.enabled = true;
    cloud.ready = true;

    authModule.onAuthStateChanged(cloud.auth, async (user) => {
      cloud.user = user;
      updateAuthStatus(authStatusText());
      renderHud();
      if (user) await loadCloudGame();
    });
  } catch (error) {
    cloud.ready = true;
    updateAuthStatus("云存档初始化失败，当前使用本地存档。");
    console.error(error);
  }
}

function authStatusText() {
  if (!hasFirebaseConfig()) return "未配置 Firebase，先使用本地存档。";
  if (!cloud.enabled) return "云存档初始化中...";
  if (!cloud.user) return "登录后会把进度保存到云端。";
  return `已登录：${cloud.user.email || cloud.user.displayName || "Google 用户"}`;
}

function updateAuthStatus(text) {
  const status = document.getElementById("authStatus");
  if (status) status.textContent = text;
}

function cloudDocRef() {
  return cloud.modules.doc(cloud.db, "farmSaves", cloud.user.uid);
}

async function loadCloudGame() {
  if (!cloud.enabled || !cloud.user) return;
  try {
    const snapshot = await cloud.modules.getDoc(cloudDocRef());
    if (snapshot.exists()) {
      const remote = snapshot.data();
      if (remote.state) {
        applySavedState(remote.state, true);
        applyOfflineIncome();
        localStorage.setItem(SAVE_KEY, JSON.stringify(serializableState()));
        render();
        toast("云存档已加载");
      }
    } else {
      await saveCloudGame(true);
    }
  } catch (error) {
    toast("云存档读取失败");
    console.error(error);
  }
}

function scheduleCloudSave() {
  if (!cloud.enabled || !cloud.user) return;
  const now = Date.now();
  if (now - cloud.lastSaveAt > 5000) {
    saveCloudGame();
    return;
  }
  if (cloud.saveTimer) return;
  cloud.saveTimer = setTimeout(() => {
    cloud.saveTimer = null;
    saveCloudGame();
  }, 5000 - (now - cloud.lastSaveAt));
}

async function saveCloudGame(force = false) {
  if (!cloud.enabled || !cloud.user || (!force && Date.now() - cloud.lastSaveAt < 900)) return;
  try {
    cloud.lastSaveAt = Date.now();
    await cloud.modules.setDoc(cloudDocRef(), {
      state: serializableState(),
      updatedAt: cloud.modules.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error(error);
  }
}

async function signInGoogle() {
  if (!cloud.enabled) {
    toast("需要先配置 Firebase。");
    return;
  }
  try {
    const provider = new cloud.modules.GoogleAuthProvider();
    await cloud.modules.signInWithPopup(cloud.auth, provider);
    toast("登录成功");
  } catch (error) {
    toast("Google 登录失败");
    console.error(error);
  }
}

async function signInEmail(mode) {
  if (!cloud.enabled) {
    toast("需要先配置 Firebase。");
    return;
  }
  const email = document.getElementById("emailInput")?.value.trim();
  const password = document.getElementById("passwordInput")?.value;
  if (!email || !password) {
    toast("请输入邮箱和密码。");
    return;
  }
  try {
    if (mode === "register") {
      await cloud.modules.createUserWithEmailAndPassword(cloud.auth, email, password);
    } else {
      await cloud.modules.signInWithEmailAndPassword(cloud.auth, email, password);
    }
    toast("登录成功");
  } catch (error) {
    toast(mode === "register" ? "注册失败" : "邮箱登录失败");
    console.error(error);
  }
}

async function signOutUser() {
  if (!cloud.enabled) return;
  await saveCloudGame(true);
  await cloud.modules.signOut(cloud.auth);
  toast("已退出登录");
  renderHud();
}

function bindDom() {
  dom.stage = document.querySelector(".phone-stage");
  [
    "coins",
    "nzd",
    "income",
    "maxLevel",
    "pastureCount",
    "buySheep",
    "buyCost",
    "autoMerge",
    "collectBonus",
    "feedBoost",
    "loginButton",
    "resetGame",
    "pasture",
    "pastureHint",
    "toast",
    "modalBackdrop",
    "modalTitle",
    "modalBody",
    "closeModal"
  ].forEach((id) => {
    dom[id] = document.getElementById(id);
  });
}

function bindEvents() {
  dom.buySheep.addEventListener("click", buySheep);
  dom.autoMerge.addEventListener("click", autoMerge);
  dom.collectBonus.addEventListener("click", collectWoolOrder);
  dom.feedBoost.addEventListener("click", feedBoost);
  dom.loginButton.addEventListener("click", () => openModal("login"));
  dom.resetGame.addEventListener("click", resetGame);
  dom.closeModal.addEventListener("click", closeModal);
  dom.modalBackdrop.addEventListener("click", (event) => {
    if (event.target === dom.modalBackdrop) closeModal();
  });
  dom.modalBody.addEventListener("click", (event) => {
    if (event.target.id === "googleLogin") signInGoogle();
    if (event.target.id === "logoutButton") signOutUser();
  });
  dom.modalBody.addEventListener("submit", (event) => {
    if (event.target.id !== "emailAuthForm") return;
    event.preventDefault();
    signInEmail(event.submitter?.dataset.mode || "login");
  });
  document.querySelectorAll("[data-modal]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.modal));
  });
}

function init() {
  bindDom();
  bindEvents();
  loadGame();
  render();
  setupCloudSave();
  setInterval(tick, 1000);
  requestAnimationFrame(animate);
}

init();
