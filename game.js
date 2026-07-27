const LEVELS = [
  { level: 1, name: "棒球帽羊", income: 1 },
  { level: 2, name: "弹弓羊", income: 3 },
  { level: 3, name: "铜角羊", income: 8 },
  { level: 4, name: "蓝帽羊", income: 18 },
  { level: 5, name: "星角羊", income: 42 },
  { level: 6, name: "金冠羊", income: 95 },
  { level: 7, name: "彩虹羊", income: 210 },
  { level: 8, name: "传说羊", income: 460 }
];

const BUY_COST = 50;
const PASTURE_LIMIT = 12;
const BASE_WORKSHOP_SLOTS = 2;
const MAX_WORKSHOP_SLOTS = 6;
const SAVE_KEY = "happy-sheep-farm-save-v4";
const OLD_SAVE_KEYS = [
  "happy-sheep-farm-save-v3",
  "happy-sheep-farm-save-v2",
  "happy-sheep-farm-save-v1"
];

const state = {
  coins: 100,
  reputation: 0,
  workshopSlots: BASE_WORKSHOP_SLOTS,
  pasture: [],
  workshop: Array(BASE_WORKSHOP_SLOTS).fill(null),
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
  return LEVELS[Math.min(level, LEVELS.length) - 1];
}

function createSheep(level = 1, position = randomPosition()) {
  return {
    id: sheepId(),
    level,
    x: position.x,
    y: position.y,
    tx: position.tx ?? randomBetween(12, 88),
    ty: position.ty ?? randomBetween(16, 84),
    speed: randomBetween(5.8, 9.5)
  };
}

function normalizeSheep(raw) {
  if (!raw) return null;
  const pos = randomPosition();
  return {
    id: raw.id || sheepId(),
    level: Math.min(Number(raw.level) || 1, LEVELS.length),
    x: Number.isFinite(Number(raw.x)) ? Number(raw.x) : pos.x,
    y: Number.isFinite(Number(raw.y)) ? Number(raw.y) : pos.y,
    tx: Number.isFinite(Number(raw.tx)) ? Number(raw.tx) : pos.tx,
    ty: Number.isFinite(Number(raw.ty)) ? Number(raw.ty) : pos.ty,
    speed: Number.isFinite(Number(raw.speed)) ? Number(raw.speed) : randomBetween(5.8, 9.5)
  };
}

function compactSheep(list) {
  return Array.isArray(list) ? list.filter(Boolean).map(normalizeSheep) : [];
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY) || OLD_SAVE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
  if (!raw) return;

  try {
    const saved = JSON.parse(raw);
    const workshopSlots = Math.min(Number(saved.workshopSlots) || BASE_WORKSHOP_SLOTS, MAX_WORKSHOP_SLOTS);
    const workshop = compactSheep(saved.workshop).slice(0, workshopSlots);
    while (workshop.length < workshopSlots) workshop.push(null);

    Object.assign(state, {
      coins: Number(saved.coins) || 100,
      reputation: Number(saved.reputation) || 0,
      workshopSlots,
      pasture: compactSheep(saved.pasture).slice(0, PASTURE_LIMIT),
      workshop,
      maxLevel: Number(saved.maxLevel) || 1,
      totalBought: Number(saved.totalBought) || 0,
      totalMerged: Number(saved.totalMerged) || 0,
      totalEarned: Number(saved.totalEarned) || 0,
      boostUntil: Number(saved.boostUntil) || 0,
      lastSaved: Number(saved.lastSaved) || Date.now()
    });

    const offlineSeconds = Math.min(7200, Math.floor((Date.now() - state.lastSaved) / 1000));
    const offlineCoins = Math.floor(incomePerSecond() * offlineSeconds * 0.35);
    if (offlineCoins > 0) {
      state.coins += offlineCoins;
      state.totalEarned += offlineCoins;
      toast(`离线收益 +${offlineCoins} 金币`);
    }
  } catch {
    localStorage.removeItem(SAVE_KEY);
  }
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSaved: Date.now() }));
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
  return state.workshop.findIndex((slot) => !slot);
}

function buySheep() {
  if (state.pasture.length >= PASTURE_LIMIT) {
    toast("牧场满了，先合成或送进小屋。");
    return;
  }
  if (state.coins < BUY_COST) {
    toast("金币不够。");
    return;
  }

  state.coins -= BUY_COST;
  state.pasture.push(createSheep(1));
  state.totalBought += 1;
  toast("购买成功");
  render();
  saveGame();
}

function movePastureToWorkshop(index) {
  const sheep = state.pasture[index];
  if (!sheep) return false;

  const target = firstEmptyWorkshopSlot();
  if (target === -1) {
    toast("剃毛小屋满了。");
    return false;
  }

  state.workshop[target] = sheep;
  state.pasture.splice(index, 1);
  toast(`${levelData(sheep.level).name} 开始剃毛产金币`);
  render();
  saveGame();
  return true;
}

function mergeSheep(sourceIndex, targetIndex) {
  const source = state.pasture[sourceIndex];
  const target = state.pasture[targetIndex];
  if (!source || !target || sourceIndex === targetIndex) return false;
  if (source.level !== target.level) {
    toast("相同等级才能合成。");
    return false;
  }
  if (source.level >= LEVELS.length) {
    toast("已经是最高等级。");
    return false;
  }

  const nextLevel = source.level + 1;
  const wasNewUnlock = nextLevel > state.maxLevel;
  const merged = createSheep(nextLevel, {
    x: (source.x + target.x) / 2,
    y: (source.y + target.y) / 2,
    tx: randomBetween(12, 88),
    ty: randomBetween(16, 84)
  });

  state.pasture = state.pasture.filter((_, index) => index !== sourceIndex && index !== targetIndex);
  state.pasture.push(merged);
  state.maxLevel = Math.max(state.maxLevel, nextLevel);
  state.reputation += nextLevel * 3;
  state.totalMerged += 1;
  state.coins += 100;

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
  for (let level = 1; level < LEVELS.length; level += 1) {
    const indexes = state.pasture
      .map((sheep, index) => ({ sheep, index }))
      .filter((item) => item.sheep && item.sheep.level === level)
      .map((item) => item.index);
    if (indexes.length >= 2) {
      mergeSheep(indexes[0], indexes[1]);
      return;
    }
  }
  toast("没有可合成的同级羊。");
}

function collectWoolOrder() {
  const reward = Math.floor(20 + state.maxLevel * 12 + incomePerSecond() * 8);
  const cooldownKey = "happy-sheep-order-time";
  const last = Number(localStorage.getItem(cooldownKey)) || 0;
  const waitMs = 45000;
  if (Date.now() - last < waitMs) {
    toast(`订单还要 ${Math.ceil((waitMs - (Date.now() - last)) / 1000)} 秒`);
    return;
  }
  state.coins += reward;
  state.reputation += 5;
  state.totalEarned += reward;
  localStorage.setItem(cooldownKey, String(Date.now()));
  toast(`获得 ${reward} 金币`);
  render();
  saveGame();
}

function feedBoost() {
  const cost = Math.max(60, state.maxLevel * 35);
  if (Date.now() < state.boostUntil) {
    toast("加速中。");
    return;
  }
  if (state.coins < cost) {
    toast(`加速需要 ${cost} 金币。`);
    return;
  }
  state.coins -= cost;
  state.boostUntil = Date.now() + 30000;
  toast("30 秒双倍产出");
  render();
  saveGame();
}

function unlockWorkshopSlot() {
  if (state.workshopSlots >= MAX_WORKSHOP_SLOTS) {
    toast("小屋已满级。");
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
  toast("剃毛小屋扩建成功。");
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
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${Math.floor(value)}`;
}

function sheepMarkup(sheep) {
  return `
    <span class="sheep-shadow"></span>
    <span class="sheep-core"></span>
    <span class="sheep-ear left"></span>
    <span class="sheep-ear right"></span>
    <span class="sheep-face"></span>
    <span class="sheep-nose"></span>
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
  button.className = `sheep-token walking variant-${sheep.level}`;
  button.type = "button";
  button.style.left = `${sheep.x}%`;
  button.style.top = `${sheep.y}%`;
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

function renderWorkshopHut() {
  const active = state.workshop.filter(Boolean).slice(0, 2);
  dom.workshopSheep.innerHTML = active.map(() => '<span class="workshop-mini"></span>').join("");
  dom.workshopHut.classList.toggle("has-sheep", active.length > 0);
  dom.unlockSlot.textContent = state.workshopSlots >= MAX_WORKSHOP_SLOTS
    ? "满级"
    : `扩建`;
}

function renderHud() {
  const sheepCount = state.pasture.length + state.workshop.filter(Boolean).length;
  dom.coins.textContent = formatNumber(state.coins);
  dom.income.textContent = `${formatNumber(incomePerSecond())}/秒`;
  dom.maxLevel.textContent = `Lv.${state.maxLevel}`;
  dom.pastureCount.textContent = String(sheepCount);
  dom.buySheep.disabled = state.coins < BUY_COST || state.pasture.length >= PASTURE_LIMIT;
  dom.feedBoost.textContent = Date.now() < state.boostUntil ? "加速中" : "加速";
}

function render() {
  renderHud();
  renderPasture();
  renderWorkshopHut();
}

function updateSheepPositions() {
  state.pasture.forEach((sheep) => {
    const node = dom.pasture.querySelector(`[data-sheep-id="${sheep.id}"]`);
    if (!node || node.classList.contains("dragging")) return;
    node.style.left = `${sheep.x}%`;
    node.style.top = `${sheep.y}%`;
  });
}

function animate(time) {
  if (!lastFrame) lastFrame = time;
  const delta = Math.min(0.05, (time - lastFrame) / 1000);
  lastFrame = time;

  state.pasture.forEach((sheep) => {
    if (drag && drag.sheepId === sheep.id) return;
    const dx = sheep.tx - sheep.x;
    const dy = sheep.ty - sheep.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 1.2) {
      sheep.tx = randomBetween(10, 90);
      sheep.ty = randomBetween(14, 86);
      sheep.speed = randomBetween(5.8, 9.5);
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
  const hutRect = dom.workshopHut.getBoundingClientRect();
  const droppedOnHut =
    event.clientX >= hutRect.left &&
    event.clientX <= hutRect.right &&
    event.clientY >= hutRect.top &&
    event.clientY <= hutRect.bottom;
  const targetIndex = findMergeTargetIndex(currentDrag.index);

  currentDrag.node.classList.remove("dragging");
  currentDrag.node.classList.add("walking");
  currentDrag.node.releasePointerCapture(event.pointerId);
  currentDrag.node.removeEventListener("pointermove", onDragMove);
  currentDrag.node.removeEventListener("pointerup", endDrag);
  currentDrag.node.removeEventListener("pointercancel", endDrag);
  clearTargets();
  drag = null;

  if (droppedOnHut) {
    movePastureToWorkshop(currentDrag.index);
  } else if (targetIndex !== -1) {
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
    { title: "买入 4 只羊", done: state.totalBought >= 4, progress: `${Math.min(state.totalBought, 4)}/4` },
    { title: "解锁 Lv.3", done: state.maxLevel >= 3, progress: `当前 Lv.${state.maxLevel}` },
    { title: "每秒 10 金币", done: incomePerSecond() >= 10, progress: `${formatNumber(incomePerSecond())}/秒` }
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
          return `
            <div class="book-item ${unlocked ? "" : "locked"}">
              <span class="book-preview sheep-token variant-${item.level}">${sheepMarkup({ level: item.level })}</span>
              <strong>${unlocked ? item.name : "未发现"}</strong>
              <span>Lv.${item.level}</span>
            </div>
          `;
        }).join("")}
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
  dom.modalBody.innerHTML = `
    <button class="sheep-token variant-${level}" type="button">${sheepMarkup({ level })}</button>
    <div>Lv.${level} ${levelData(level).name}</div>
    <div>首次解锁图鉴，获得100金币</div>
  `;
  dom.modalBackdrop.hidden = false;
}

function tick() {
  const income = incomePerSecond();
  if (income > 0) {
    state.coins += income;
    state.totalEarned += income;
  }
  renderHud();
  renderWorkshopHut();
  saveGame();
}

function toast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dom.toast.classList.remove("show"), 1700);
}

function bindDom() {
  dom.stage = document.querySelector(".phone-stage");
  [
    "coins",
    "income",
    "maxLevel",
    "pastureCount",
    "buySheep",
    "autoMerge",
    "collectBonus",
    "feedBoost",
    "resetGame",
    "unlockSlot",
    "pasture",
    "workshopHut",
    "workshopSheep",
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
  requestAnimationFrame(animate);
}

init();
