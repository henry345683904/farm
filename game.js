const LEVELS = [
  { level: 1, name: "新手绵羊", income: 1, toneA: "#bcefd0", toneB: "#68bf74" },
  { level: 2, name: "青草绵羊", income: 3, toneA: "#c8f4ff", toneB: "#5bbfe0" },
  { level: 3, name: "铃铛绵羊", income: 8, toneA: "#ffe8a3", toneB: "#f0a53b" },
  { level: 4, name: "奶油绵羊", income: 18, toneA: "#ffd0be", toneB: "#f07f70" },
  { level: 5, name: "星光绵羊", income: 42, toneA: "#d9d3ff", toneB: "#8875e6" },
  { level: 6, name: "金冠绵羊", income: 95, toneA: "#fff2a7", toneB: "#d69b1d" },
  { level: 7, name: "彩虹绵羊", income: 210, toneA: "#b7f5ec", toneB: "#e76ba0" },
  { level: 8, name: "传说绵羊", income: 460, toneA: "#f9fbff", toneB: "#5e748f" }
];

const PASTURE_SLOTS = 12;
const BUY_COST = 50;
const BASE_WORKSHOP_SLOTS = 2;
const MAX_WORKSHOP_SLOTS = 6;
const SAVE_KEY = "happy-sheep-farm-save-v1";

const state = {
  coins: 100,
  reputation: 0,
  workshopSlots: BASE_WORKSHOP_SLOTS,
  pasture: [],
  workshop: [],
  maxLevel: 1,
  totalBought: 0,
  totalMerged: 0,
  totalEarned: 0,
  boostUntil: 0,
  lastSaved: Date.now(),
  selected: null
};

const dom = {};
let pastureClickTimer = null;

function sheepId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function levelData(level) {
  return LEVELS[Math.min(level, LEVELS.length) - 1];
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;

  try {
    const saved = JSON.parse(raw);
    Object.assign(state, {
      coins: Number(saved.coins) || 100,
      reputation: Number(saved.reputation) || 0,
      workshopSlots: Math.min(Number(saved.workshopSlots) || BASE_WORKSHOP_SLOTS, MAX_WORKSHOP_SLOTS),
      pasture: Array.isArray(saved.pasture) ? saved.pasture : [],
      workshop: Array.isArray(saved.workshop) ? saved.workshop : [],
      maxLevel: Number(saved.maxLevel) || 1,
      totalBought: Number(saved.totalBought) || 0,
      totalMerged: Number(saved.totalMerged) || 0,
      totalEarned: Number(saved.totalEarned) || 0,
      boostUntil: Number(saved.boostUntil) || 0,
      lastSaved: Number(saved.lastSaved) || Date.now(),
      selected: null
    });

    const offlineSeconds = Math.min(7200, Math.floor((Date.now() - state.lastSaved) / 1000));
    const offlineCoins = Math.floor(incomePerSecond() * offlineSeconds * 0.35);
    if (offlineCoins > 0) {
      state.coins += offlineCoins;
      state.totalEarned += offlineCoins;
      toast(`离线羊毛收入 +${offlineCoins} 金币`);
    }
  } catch {
    localStorage.removeItem(SAVE_KEY);
  }
}

function saveGame() {
  const snapshot = { ...state, selected: null, lastSaved: Date.now() };
  localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
}

function incomeMultiplier() {
  return Date.now() < state.boostUntil ? 2 : 1;
}

function incomePerSecond() {
  return state.workshop.reduce((sum, sheep) => {
    if (!sheep) return sum;
    return sum + levelData(sheep.level).income;
  }, 0) * incomeMultiplier();
}

function firstEmptyPastureSlot() {
  for (let i = 0; i < PASTURE_SLOTS; i += 1) {
    if (!state.pasture[i]) return i;
  }
  return -1;
}

function firstEmptyWorkshopSlot() {
  for (let i = 0; i < state.workshopSlots; i += 1) {
    if (!state.workshop[i]) return i;
  }
  return -1;
}

function createSheep(level = 1) {
  return { id: sheepId(), level };
}

function buySheep() {
  const slot = firstEmptyPastureSlot();
  if (slot === -1) {
    toast("羊圈满了，先合成或放进工作间。");
    return;
  }
  if (state.coins < BUY_COST) {
    toast("金币不够，等工作间产出一点再买。");
    return;
  }

  state.coins -= BUY_COST;
  state.pasture[slot] = createSheep(1);
  state.totalBought += 1;
  toast("买到 1 级羊。");
  render();
  saveGame();
}

function moveSheep(area, index) {
  const list = state[area];
  const sheep = list[index];
  if (!sheep) return;

  if (area === "pasture") {
    const target = firstEmptyWorkshopSlot();
    if (target === -1) {
      toast("工作间满了，可以先扩建。");
      return;
    }
    state.workshop[target] = sheep;
    state.pasture[index] = null;
    toast(`${levelData(sheep.level).name} 进工作间了。`);
  } else {
    const target = firstEmptyPastureSlot();
    if (target === -1) {
      toast("羊圈满了，暂时搬不出来。");
      return;
    }
    state.pasture[target] = sheep;
    state.workshop[index] = null;
    toast(`${levelData(sheep.level).name} 回到羊圈。`);
  }

  state.selected = null;
  render();
  saveGame();
}

function selectForMerge(index) {
  const sheep = state.pasture[index];
  if (!sheep) return;

  if (state.selected === null) {
    state.selected = index;
    render();
    return;
  }

  if (state.selected === index) {
    state.selected = null;
    render();
    return;
  }

  const first = state.pasture[state.selected];
  if (!first || first.level !== sheep.level) {
    state.selected = index;
    toast("请选择两只相同等级的小羊。");
    render();
    return;
  }

  mergeAt(state.selected, index);
}

function mergeAt(a, b) {
  const first = state.pasture[a];
  if (!first || !state.pasture[b]) return false;
  if (first.level !== state.pasture[b].level || first.level >= LEVELS.length) return false;

  const nextLevel = first.level + 1;
  state.pasture[a] = createSheep(nextLevel);
  state.pasture[b] = null;
  state.maxLevel = Math.max(state.maxLevel, nextLevel);
  state.reputation += nextLevel * 3;
  state.totalMerged += 1;
  state.selected = null;
  toast(`合成成功：${levelData(nextLevel).name}`);
  render();
  saveGame();
  return true;
}

function autoMerge() {
  let merged = 0;
  let changed = true;

  while (changed) {
    changed = false;
    for (let level = 1; level < LEVELS.length; level += 1) {
      const indexes = state.pasture
        .map((sheep, index) => ({ sheep, index }))
        .filter((item) => item.sheep && item.sheep.level === level)
        .map((item) => item.index);
      if (indexes.length >= 2) {
        mergeAt(indexes[0], indexes[1]);
        merged += 1;
        changed = true;
        break;
      }
    }
  }

  if (!merged) toast("羊圈里还没有可合成的同级羊。");
}

function collectWoolOrder() {
  const reward = Math.floor(20 + state.maxLevel * 12 + incomePerSecond() * 8);
  const cooldownKey = "happy-sheep-order-time";
  const last = Number(localStorage.getItem(cooldownKey)) || 0;
  const waitMs = 45000;

  if (Date.now() - last < waitMs) {
    const left = Math.ceil((waitMs - (Date.now() - last)) / 1000);
    toast(`羊毛订单还要 ${left} 秒刷新。`);
    return;
  }

  state.coins += reward;
  state.reputation += 5;
  state.totalEarned += reward;
  localStorage.setItem(cooldownKey, String(Date.now()));
  toast(`羊毛订单完成，获得 ${reward} 金币。`);
  render();
  saveGame();
}

function feedBoost() {
  const cost = Math.max(60, state.maxLevel * 35);
  if (Date.now() < state.boostUntil) {
    toast("加速已经生效中。");
    return;
  }
  if (state.coins < cost) {
    toast(`喂草需要 ${cost} 金币。`);
    return;
  }

  state.coins -= cost;
  state.boostUntil = Date.now() + 30000;
  toast("小羊吃饱了，30 秒双倍产出。");
  render();
  saveGame();
}

function unlockWorkshopSlot() {
  if (state.workshopSlots >= MAX_WORKSHOP_SLOTS) {
    toast("工作间已经扩到最大。");
    return;
  }

  const cost = 160 * (state.workshopSlots - BASE_WORKSHOP_SLOTS + 1);
  if (state.coins < cost) {
    toast(`扩建需要 ${cost} 金币。`);
    return;
  }

  state.coins -= cost;
  state.workshopSlots += 1;
  state.reputation += 12;
  toast("工作间扩建成功。");
  render();
  saveGame();
}

function resetGame() {
  const ok = window.confirm("确定要重开开心养羊场吗？");
  if (!ok) return;

  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem("happy-sheep-order-time");
  window.location.reload();
}

function formatNumber(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 10000) return `${(value / 1000).toFixed(1)}K`;
  return `${Math.floor(value)}`;
}

function sheepCard(sheep, area, index) {
  if (!sheep) {
    const empty = document.createElement("div");
    empty.className = "slot empty";
    return empty;
  }

  const data = levelData(sheep.level);
  const button = document.createElement("button");
  button.className = "sheep-card";
  button.setAttribute("data-testid", `${area}-sheep`);
  if (area === "pasture" && state.selected === index) button.classList.add("selected");
  button.type = "button";
  button.style.setProperty("--tone-a", data.toneA);
  button.style.setProperty("--tone-b", data.toneB);
  button.setAttribute("aria-label", `${data.name}，等级 ${sheep.level}`);
  button.innerHTML = `
    <span class="sheep-level">Lv.${sheep.level}</span>
    <span class="mini-sheep" aria-hidden="true"></span>
    <span class="sheep-income">${data.income}/s</span>
  `;
  if (area === "pasture") {
    button.addEventListener("click", () => {
      clearTimeout(pastureClickTimer);
      pastureClickTimer = setTimeout(() => selectForMerge(index), 180);
    });
    button.addEventListener("dblclick", () => {
      clearTimeout(pastureClickTimer);
      moveSheep(area, index);
    });
  }
  return button;
}

function workshopCard(sheep, index) {
  const card = sheepCard(sheep, "workshop", index);
  if (!sheep) return card;
  card.addEventListener("click", () => moveSheep("workshop", index));
  return card;
}

function renderSlots() {
  dom.pasture.innerHTML = "";
  dom.workshop.innerHTML = "";

  for (let i = 0; i < PASTURE_SLOTS; i += 1) {
    dom.pasture.appendChild(sheepCard(state.pasture[i], "pasture", i));
  }

  for (let i = 0; i < state.workshopSlots; i += 1) {
    dom.workshop.appendChild(workshopCard(state.workshop[i], i));
  }
}

function renderBook() {
  dom.sheepBook.innerHTML = "";
  LEVELS.forEach((item) => {
    const unlocked = item.level <= state.maxLevel;
    const node = document.createElement("div");
    node.className = `book-item ${unlocked ? "" : "locked"}`;
    node.innerHTML = `
      <span class="book-icon">${unlocked ? "🐑" : "?"}</span>
      <strong>Lv.${item.level}</strong>
      <strong>${unlocked ? item.name : "未发现"}</strong>
    `;
    dom.sheepBook.appendChild(node);
  });
}

function renderQuests() {
  const quests = [
    {
      title: "买入 4 只小羊",
      done: state.totalBought >= 4,
      progress: `${Math.min(state.totalBought, 4)}/4`,
      reward: "+20 名声"
    },
    {
      title: "合成到 3 级羊",
      done: state.maxLevel >= 3,
      progress: `最高 Lv.${state.maxLevel}`,
      reward: "+80 金币"
    },
    {
      title: "工作间每秒 10 金币",
      done: incomePerSecond() >= 10,
      progress: `${formatNumber(incomePerSecond())}/s`,
      reward: "+1 扩建目标"
    }
  ];

  dom.questList.innerHTML = "";
  quests.forEach((quest) => {
    const node = document.createElement("div");
    node.className = `quest ${quest.done ? "done" : ""}`;
    node.innerHTML = `
      <strong>${quest.done ? "完成" : "进行中"} · ${quest.title}</strong>
      <span>${quest.progress} · ${quest.reward}</span>
    `;
    dom.questList.appendChild(node);
  });
}

function applyQuestRewards() {
  const flagsKey = "happy-sheep-quest-flags";
  const flags = JSON.parse(localStorage.getItem(flagsKey) || "{}");
  const checks = [
    { key: "buy4", done: state.totalBought >= 4, reward: () => (state.reputation += 20) },
    { key: "level3", done: state.maxLevel >= 3, reward: () => (state.coins += 80) },
    { key: "income10", done: incomePerSecond() >= 10, reward: () => (state.reputation += 30) }
  ];

  let changed = false;
  checks.forEach((check) => {
    if (check.done && !flags[check.key]) {
      check.reward();
      flags[check.key] = true;
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem(flagsKey, JSON.stringify(flags));
    toast("目标奖励已到账。");
    saveGame();
  }
}

function render() {
  state.pasture = state.pasture.slice(0, PASTURE_SLOTS);
  while (state.pasture.length < PASTURE_SLOTS) state.pasture.push(null);
  state.workshop = state.workshop.slice(0, state.workshopSlots);
  while (state.workshop.length < state.workshopSlots) state.workshop.push(null);

  const income = incomePerSecond();
  dom.coins.textContent = formatNumber(state.coins);
  dom.income.textContent = `${formatNumber(income)}/s`;
  dom.maxLevel.textContent = `Lv.${state.maxLevel}`;
  dom.reputation.textContent = formatNumber(state.reputation);
  dom.pastureCount.textContent = `${state.pasture.filter(Boolean).length}/${PASTURE_SLOTS}`;
  dom.buySheep.disabled = state.coins < BUY_COST || firstEmptyPastureSlot() === -1;
  dom.feedBoost.textContent = Date.now() < state.boostUntil ? "加速中" : `喂草加速`;
  dom.unlockSlot.textContent = state.workshopSlots >= MAX_WORKSHOP_SLOTS
    ? "已满级"
    : `扩建 ${160 * (state.workshopSlots - BASE_WORKSHOP_SLOTS + 1)}`;
  dom.boostBadge.textContent = Date.now() < state.boostUntil ? "双倍速度" : "普通速度";

  renderSlots();
  renderQuests();
  renderBook();
}

let toastTimer;
function toast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dom.toast.classList.remove("show"), 2200);
}

function tick() {
  const income = incomePerSecond();
  if (income > 0) {
    state.coins += income;
    state.totalEarned += income;
  }
  applyQuestRewards();
  render();
  saveGame();
}

function bindDom() {
  const ids = [
    "coins",
    "income",
    "maxLevel",
    "reputation",
    "buySheep",
    "autoMerge",
    "collectBonus",
    "feedBoost",
    "resetGame",
    "unlockSlot",
    "pasture",
    "workshop",
    "pastureCount",
    "questList",
    "sheepBook",
    "boostBadge",
    "toast"
  ];

  ids.forEach((id) => {
    dom[id] = document.getElementById(id);
  });
}

function init() {
  bindDom();
  loadGame();
  render();
  dom.buySheep.addEventListener("click", buySheep);
  dom.autoMerge.addEventListener("click", autoMerge);
  dom.collectBonus.addEventListener("click", collectWoolOrder);
  dom.feedBoost.addEventListener("click", feedBoost);
  dom.unlockSlot.addEventListener("click", unlockWorkshopSlot);
  dom.resetGame.addEventListener("click", resetGame);
  setInterval(tick, 1000);
}

init();
