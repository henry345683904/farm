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

const PASTURE_LIMIT = 12;
const BUY_COST = 50;
const BASE_WORKSHOP_SLOTS = 2;
const MAX_WORKSHOP_SLOTS = 6;
const SAVE_KEY = "happy-sheep-farm-save-v2";
const OLD_SAVE_KEY = "happy-sheep-farm-save-v1";

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
  lastSaved: Date.now()
};

const dom = {};
let drag = null;
let toastTimer = null;
let lastAnimationTime = 0;

function sheepId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function levelData(level) {
  return LEVELS[Math.min(level, LEVELS.length) - 1];
}

function createSheep(level = 1, position = randomPasturePosition()) {
  return {
    id: sheepId(),
    level,
    x: position.x,
    y: position.y,
    tx: position.tx ?? randomBetween(18, 82),
    ty: position.ty ?? randomBetween(42, 82),
    speed: randomBetween(5.5, 9.5)
  };
}

function randomPasturePosition() {
  const x = randomBetween(16, 84);
  const y = randomBetween(46, 84);
  return { x, y, tx: randomBetween(16, 84), ty: randomBetween(46, 84) };
}

function normalizeSheep(raw, fallbackLevel = 1) {
  if (!raw) return null;
  const position = randomPasturePosition();
  return {
    id: raw.id || sheepId(),
    level: Math.min(Number(raw.level) || fallbackLevel, LEVELS.length),
    x: Number.isFinite(Number(raw.x)) ? Number(raw.x) : position.x,
    y: Number.isFinite(Number(raw.y)) ? Number(raw.y) : position.y,
    tx: Number.isFinite(Number(raw.tx)) ? Number(raw.tx) : position.tx,
    ty: Number.isFinite(Number(raw.ty)) ? Number(raw.ty) : position.ty,
    speed: Number.isFinite(Number(raw.speed)) ? Number(raw.speed) : randomBetween(5.5, 9.5)
  };
}

function compactSheep(list) {
  return Array.isArray(list) ? list.filter(Boolean).map((sheep) => normalizeSheep(sheep)) : [];
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem(OLD_SAVE_KEY);
  if (!raw) return;

  try {
    const saved = JSON.parse(raw);
    Object.assign(state, {
      coins: Number(saved.coins) || 100,
      reputation: Number(saved.reputation) || 0,
      workshopSlots: Math.min(Number(saved.workshopSlots) || BASE_WORKSHOP_SLOTS, MAX_WORKSHOP_SLOTS),
      pasture: compactSheep(saved.pasture).slice(0, PASTURE_LIMIT),
      workshop: compactSheep(saved.workshop).slice(0, MAX_WORKSHOP_SLOTS),
      maxLevel: Number(saved.maxLevel) || 1,
      totalBought: Number(saved.totalBought) || 0,
      totalMerged: Number(saved.totalMerged) || 0,
      totalEarned: Number(saved.totalEarned) || 0,
      boostUntil: Number(saved.boostUntil) || 0,
      lastSaved: Number(saved.lastSaved) || Date.now()
    });

    while (state.workshop.length < state.workshopSlots) state.workshop.push(null);

    const offlineSeconds = Math.min(7200, Math.floor((Date.now() - state.lastSaved) / 1000));
    const offlineCoins = Math.floor(incomePerSecond() * offlineSeconds * 0.35);
    if (offlineCoins > 0) {
      state.coins += offlineCoins;
      state.totalEarned += offlineCoins;
      toast(`离线羊毛收入 +${offlineCoins} 金币`);
    }
  } catch {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(OLD_SAVE_KEY);
  }
}

function saveGame() {
  const snapshot = { ...state, lastSaved: Date.now() };
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

function firstEmptyWorkshopSlot() {
  for (let i = 0; i < state.workshopSlots; i += 1) {
    if (!state.workshop[i]) return i;
  }
  return -1;
}

function buySheep() {
  if (state.pasture.length >= PASTURE_LIMIT) {
    toast("牧场满了，先合成或拖进工作间。");
    return;
  }
  if (state.coins < BUY_COST) {
    toast("金币不够，等工作间产出一点再买。");
    return;
  }

  state.coins -= BUY_COST;
  state.pasture.push(createSheep(1));
  state.totalBought += 1;
  toast("买到 1 级羊，已经放进牧场。");
  render();
  saveGame();
}

function movePastureToWorkshop(index) {
  const sheep = state.pasture[index];
  if (!sheep) return false;

  const target = firstEmptyWorkshopSlot();
  if (target === -1) {
    toast("工作间满了，可以先扩建。");
    return false;
  }

  state.workshop[target] = sheep;
  state.pasture.splice(index, 1);
  toast(`${levelData(sheep.level).name} 进工作间了。`);
  render();
  saveGame();
  return true;
}

function moveWorkshopToPasture(index) {
  const sheep = state.workshop[index];
  if (!sheep) return;
  if (state.pasture.length >= PASTURE_LIMIT) {
    toast("牧场满了，暂时送不回来。");
    return;
  }

  const position = randomPasturePosition();
  state.pasture.push({ ...sheep, ...position, tx: position.tx, ty: position.ty });
  state.workshop[index] = null;
  toast(`${levelData(sheep.level).name} 回到牧场。`);
  render();
  saveGame();
}

function mergeSheep(sourceIndex, targetIndex) {
  const source = state.pasture[sourceIndex];
  const target = state.pasture[targetIndex];
  if (!source || !target) return false;
  if (source.id === target.id) return false;
  if (source.level !== target.level) {
    toast("只有相同等级的羊才能合成。");
    return false;
  }
  if (source.level >= LEVELS.length) {
    toast("这只羊已经是最高等级。");
    return false;
  }

  const nextLevel = source.level + 1;
  const merged = createSheep(nextLevel, {
    x: (source.x + target.x) / 2,
    y: (source.y + target.y) / 2,
    tx: randomBetween(16, 84),
    ty: randomBetween(46, 84)
  });

  const keep = state.pasture.filter((_, index) => index !== sourceIndex && index !== targetIndex);
  keep.push(merged);
  state.pasture = keep;
  state.maxLevel = Math.max(state.maxLevel, nextLevel);
  state.reputation += nextLevel * 3;
  state.totalMerged += 1;
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
        mergeSheep(indexes[0], indexes[1]);
        merged += 1;
        changed = true;
        break;
      }
    }
  }

  if (!merged) toast("牧场里还没有可合成的同级羊。");
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
  state.workshop.push(null);
  state.reputation += 12;
  toast("工作间扩建成功。");
  render();
  saveGame();
}

function resetGame() {
  const ok = window.confirm("确定要重开开心养羊场吗？");
  if (!ok) return;

  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(OLD_SAVE_KEY);
  localStorage.removeItem("happy-sheep-order-time");
  localStorage.removeItem("happy-sheep-quest-flags");
  window.location.reload();
}

function formatNumber(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 10000) return `${(value / 1000).toFixed(1)}K`;
  return `${Math.floor(value)}`;
}

function sheepMarkup(sheep) {
  const data = levelData(sheep.level);
  return `
    <span class="sheep-level">Lv.${sheep.level}</span>
    <span class="sheep-body" style="--tone-a: ${data.toneA}"></span>
    <span class="sheep-face"></span>
    <span class="sheep-leg one"></span>
    <span class="sheep-leg two"></span>
    <span class="sheep-income">${data.income}/s</span>
  `;
}

function pastureSheepButton(sheep, index) {
  const data = levelData(sheep.level);
  const button = document.createElement("button");
  button.className = "sheep-token";
  button.type = "button";
  button.style.left = `${sheep.x}%`;
  button.style.top = `${sheep.y}%`;
  button.style.setProperty("--tone-a", data.toneA);
  button.style.setProperty("--tone-b", data.toneB);
  button.setAttribute("data-testid", "pasture-sheep");
  button.setAttribute("data-sheep-id", sheep.id);
  button.setAttribute("aria-label", `${data.name}，等级 ${sheep.level}`);
  button.innerHTML = sheepMarkup(sheep);
  button.addEventListener("pointerdown", (event) => startDrag(event, index));
  return button;
}

function workshopCard(sheep, index) {
  const slot = document.createElement("div");
  slot.className = `workshop-slot ${sheep ? "" : "empty"}`;
  slot.setAttribute("data-workshop-slot", String(index));

  if (!sheep) return slot;

  const data = levelData(sheep.level);
  const button = document.createElement("button");
  button.className = "workshop-card";
  button.type = "button";
  button.style.setProperty("--tone-a", data.toneA);
  button.style.setProperty("--tone-b", data.toneB);
  button.setAttribute("data-testid", "workshop-sheep");
  button.setAttribute("aria-label", `${data.name}，点击送回牧场`);
  button.innerHTML = `<span class="sheep-token">${sheepMarkup(sheep)}</span>`;
  button.addEventListener("click", () => moveWorkshopToPasture(index));
  slot.appendChild(button);
  return slot;
}

function renderSheep() {
  dom.pasture.querySelectorAll(".sheep-token").forEach((node) => node.remove());
  state.pasture.forEach((sheep, index) => {
    dom.pasture.appendChild(pastureSheepButton(sheep, index));
  });

  dom.workshop.innerHTML = "";
  for (let i = 0; i < state.workshopSlots; i += 1) {
    dom.workshop.appendChild(workshopCard(state.workshop[i], i));
  }
}

function updateSheepPositions() {
  state.pasture.forEach((sheep) => {
    const node = dom.pasture.querySelector(`[data-sheep-id="${sheep.id}"]`);
    if (node && !node.classList.contains("dragging")) {
      node.style.left = `${sheep.x}%`;
      node.style.top = `${sheep.y}%`;
    }
  });
}

function startDrag(event, index) {
  const sheep = state.pasture[index];
  if (!sheep) return;

  const rect = dom.pasture.getBoundingClientRect();
  const node = event.currentTarget;
  node.setPointerCapture(event.pointerId);
  node.classList.add("dragging");

  drag = {
    pointerId: event.pointerId,
    index,
    sheepId: sheep.id,
    node,
    rect
  };

  moveDraggedSheep(event.clientX, event.clientY);
  node.addEventListener("pointermove", onDragMove);
  node.addEventListener("pointerup", endDrag);
  node.addEventListener("pointercancel", endDrag);
}

function moveDraggedSheep(clientX, clientY) {
  if (!drag) return;
  const x = ((clientX - drag.rect.left) / drag.rect.width) * 100;
  const y = ((clientY - drag.rect.top) / drag.rect.height) * 100;
  const sheep = state.pasture[drag.index];
  if (!sheep) return;

  sheep.x = Math.max(6, Math.min(94, x));
  sheep.y = Math.max(24, Math.min(88, y));
  sheep.tx = sheep.x;
  sheep.ty = sheep.y;
  drag.node.style.left = `${sheep.x}%`;
  drag.node.style.top = `${sheep.y}%`;
  highlightMergeTarget();
}

function onDragMove(event) {
  moveDraggedSheep(event.clientX, event.clientY);
}

function endDrag(event) {
  if (!drag) return;

  const dragged = drag;
  dragged.node.classList.remove("dragging");
  dragged.node.releasePointerCapture(dragged.pointerId);
  dragged.node.removeEventListener("pointermove", onDragMove);
  dragged.node.removeEventListener("pointerup", endDrag);
  dragged.node.removeEventListener("pointercancel", endDrag);
  clearMergeHighlights();

  const workshopRect = dom.workshop.getBoundingClientRect();
  const droppedInWorkshop =
    event.clientX >= workshopRect.left &&
    event.clientX <= workshopRect.right &&
    event.clientY >= workshopRect.top &&
    event.clientY <= workshopRect.bottom;

  const targetIndex = findMergeTargetIndex(dragged.index);
  drag = null;

  if (droppedInWorkshop) {
    movePastureToWorkshop(dragged.index);
    return;
  }

  if (targetIndex !== -1) {
    mergeSheep(dragged.index, targetIndex);
    return;
  }

  render();
  saveGame();
}

function findMergeTargetIndex(sourceIndex) {
  const source = state.pasture[sourceIndex];
  if (!source) return -1;

  return state.pasture.findIndex((candidate, index) => {
    if (!candidate || index === sourceIndex) return false;
    if (candidate.level !== source.level) return false;
    const dx = candidate.x - source.x;
    const dy = candidate.y - source.y;
    return Math.sqrt(dx * dx + dy * dy) < 11;
  });
}

function highlightMergeTarget() {
  clearMergeHighlights();
  if (!drag) return;
  const targetIndex = findMergeTargetIndex(drag.index);
  if (targetIndex === -1) return;
  const target = state.pasture[targetIndex];
  const targetNode = dom.pasture.querySelector(`[data-sheep-id="${target.id}"]`);
  if (targetNode) targetNode.classList.add("merge-target");
}

function clearMergeHighlights() {
  dom.pasture.querySelectorAll(".merge-target").forEach((node) => node.classList.remove("merge-target"));
}

function animatePasture(time) {
  if (!lastAnimationTime) lastAnimationTime = time;
  const delta = Math.min(0.05, (time - lastAnimationTime) / 1000);
  lastAnimationTime = time;

  state.pasture.forEach((sheep) => {
    if (drag && drag.sheepId === sheep.id) return;
    const dx = sheep.tx - sheep.x;
    const dy = sheep.ty - sheep.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 1.2) {
      sheep.tx = randomBetween(14, 86);
      sheep.ty = randomBetween(42, 84);
      sheep.speed = randomBetween(5.5, 9.5);
      return;
    }

    const step = sheep.speed * delta;
    sheep.x += (dx / distance) * step;
    sheep.y += (dy / distance) * step;
  });

  updateSheepPositions();
  requestAnimationFrame(animatePasture);
}

function questData() {
  return [
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
      reward: "+30 名声"
    }
  ];
}

function renderQuestList() {
  return questData()
    .map(
      (quest) => `
        <div class="quest ${quest.done ? "done" : ""}">
          <strong>${quest.done ? "完成" : "进行中"} · ${quest.title}</strong>
          <span>${quest.progress} · ${quest.reward}</span>
        </div>
      `
    )
    .join("");
}

function renderBook() {
  return `
    <div class="sheep-book">
      ${LEVELS.map((item) => {
        const unlocked = item.level <= state.maxLevel;
        return `
          <div class="book-item ${unlocked ? "" : "locked"}">
            <span class="book-icon">${unlocked ? "羊" : "?"}</span>
            <strong>Lv.${item.level}</strong>
            <strong>${unlocked ? item.name : "未发现"}</strong>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function openModal(type) {
  const content = {
    quest: {
      title: "今日目标",
      body: renderQuestList()
    },
    book: {
      title: "小羊图鉴",
      body: renderBook()
    },
    help: {
      title: "玩法",
      body: `
        <div class="help-card">初始有 100 金币，点击“买 1 级羊”会花 50 金币把小羊放进牧场。</div>
        <div class="help-card">牧场里的羊会自动走动。按住一只羊拖到同等级羊旁边，松手即可合成更高等级。</div>
        <div class="help-card">把牧场里的羊拖进右侧工作间，它会每秒产生金币。点击工作间里的羊可以送回牧场。</div>
        <div class="help-card">羊毛订单、喂草加速、扩建工作间会让成长更快，进度会自动保存。</div>
      `
    }
  }[type];

  if (!content) return;
  dom.modalTitle.textContent = content.title;
  dom.modalBody.innerHTML = content.body;
  dom.modalBackdrop.hidden = false;
}

function closeModal() {
  dom.modalBackdrop.hidden = true;
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

function renderHud() {
  const income = incomePerSecond();
  dom.coins.textContent = formatNumber(state.coins);
  dom.income.textContent = `${formatNumber(income)}/s`;
  dom.maxLevel.textContent = `Lv.${state.maxLevel}`;
  dom.reputation.textContent = formatNumber(state.reputation);
  dom.pastureCount.textContent = `${state.pasture.length}/${PASTURE_LIMIT}`;
  dom.buySheep.disabled = state.coins < BUY_COST || state.pasture.length >= PASTURE_LIMIT;
  dom.feedBoost.textContent = Date.now() < state.boostUntil ? "加速中" : "喂草加速";
  dom.unlockSlot.textContent = state.workshopSlots >= MAX_WORKSHOP_SLOTS
    ? "已满级"
    : `扩建 ${160 * (state.workshopSlots - BASE_WORKSHOP_SLOTS + 1)}`;
  dom.boostBadge.textContent = Date.now() < state.boostUntil ? "双倍速度" : "普通速度";
}

function render() {
  state.pasture = state.pasture.filter(Boolean).slice(0, PASTURE_LIMIT);
  state.workshop = state.workshop.slice(0, state.workshopSlots);
  while (state.workshop.length < state.workshopSlots) state.workshop.push(null);

  renderHud();
  renderSheep();
}

function showWorkshopCoinPop(amount) {
  if (amount <= 0) return;
  const pop = document.createElement("span");
  pop.className = "coin-pop";
  pop.textContent = `+${formatNumber(amount)}`;
  dom.workshop.appendChild(pop);
  setTimeout(() => pop.remove(), 1000);
}

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
    showWorkshopCoinPop(income);
  }
  applyQuestRewards();
  renderHud();
  saveGame();
}

function bindDom() {
  [
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
    "boostBadge",
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
  dom.unlockSlot.addEventListener("click", unlockWorkshopSlot);
  dom.resetGame.addEventListener("click", resetGame);
  dom.closeModal.addEventListener("click", closeModal);
  dom.modalBackdrop.addEventListener("click", (event) => {
    if (event.target === dom.modalBackdrop) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
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
  setInterval(tick, 1000);
  requestAnimationFrame(animatePasture);
}

init();
