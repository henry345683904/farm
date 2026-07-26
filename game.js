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

const SLOT_COUNT = 12;
const BUY_COST = 50;
const BASE_WORKSHOP_SLOTS = 2;
const MAX_WORKSHOP_SLOTS = 6;
const SAVE_KEY = "happy-sheep-farm-save-v3";
const OLD_SAVE_KEYS = ["happy-sheep-farm-save-v2", "happy-sheep-farm-save-v1"];

const state = {
  coins: 100,
  reputation: 0,
  workshopSlots: BASE_WORKSHOP_SLOTS,
  pasture: Array(SLOT_COUNT).fill(null),
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

function sheepId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function levelData(level) {
  return LEVELS[Math.min(level, LEVELS.length) - 1];
}

function createSheep(level = 1) {
  return { id: sheepId(), level };
}

function normalizeSheep(raw) {
  if (!raw) return null;
  return {
    id: raw.id || sheepId(),
    level: Math.min(Number(raw.level) || 1, LEVELS.length)
  };
}

function normalizePasture(rawPasture) {
  const slots = Array(SLOT_COUNT).fill(null);
  if (!Array.isArray(rawPasture)) return slots;
  const compact = rawPasture.filter(Boolean).map(normalizeSheep);
  compact.slice(0, SLOT_COUNT).forEach((sheep, index) => {
    slots[index] = sheep;
  });
  return slots;
}

function normalizeWorkshop(rawWorkshop, slots) {
  const workshop = Array(slots).fill(null);
  if (!Array.isArray(rawWorkshop)) return workshop;
  rawWorkshop.filter(Boolean).slice(0, slots).forEach((sheep, index) => {
    workshop[index] = normalizeSheep(sheep);
  });
  return workshop;
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY) || OLD_SAVE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
  if (!raw) return;

  try {
    const saved = JSON.parse(raw);
    const slots = Math.min(Number(saved.workshopSlots) || BASE_WORKSHOP_SLOTS, MAX_WORKSHOP_SLOTS);
    Object.assign(state, {
      coins: Number(saved.coins) || 100,
      reputation: Number(saved.reputation) || 0,
      workshopSlots: slots,
      pasture: normalizePasture(saved.pasture),
      workshop: normalizeWorkshop(saved.workshop, slots),
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

function firstEmptyPastureSlot() {
  return state.pasture.findIndex((slot) => !slot);
}

function firstEmptyWorkshopSlot() {
  return state.workshop.findIndex((slot) => !slot);
}

function buySheep() {
  const slot = firstEmptyPastureSlot();
  if (slot === -1) {
    toast("草地满了，先合成或放进工作间。");
    return;
  }
  if (state.coins < BUY_COST) {
    toast("金币不够。");
    return;
  }

  state.coins -= BUY_COST;
  state.pasture[slot] = createSheep(1);
  state.totalBought += 1;
  toast("购买成功");
  render();
  saveGame();
}

function movePastureToWorkshop(slotIndex) {
  const sheep = state.pasture[slotIndex];
  if (!sheep) return false;
  const target = firstEmptyWorkshopSlot();
  if (target === -1) {
    toast("工作间满了。");
    return false;
  }
  state.workshop[target] = sheep;
  state.pasture[slotIndex] = null;
  toast(`${levelData(sheep.level).name} 开始产金币`);
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
  state.pasture[targetIndex] = createSheep(nextLevel);
  state.pasture[sourceIndex] = null;
  state.maxLevel = Math.max(state.maxLevel, nextLevel);
  state.reputation += nextLevel * 3;
  state.totalMerged += 1;
  state.coins += 100;
  showLevelUp(nextLevel);
  render();
  saveGame();
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
    <span class="sheep-core"></span>
    <span class="sheep-face"></span>
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

function sheepButton(sheep, slotIndex) {
  const button = document.createElement("button");
  button.className = `sheep-token variant-${sheep.level}`;
  button.type = "button";
  button.setAttribute("data-testid", "pasture-sheep");
  button.setAttribute("data-slot", String(slotIndex));
  button.setAttribute("aria-label", `${levelData(sheep.level).name}，等级 ${sheep.level}`);
  button.innerHTML = sheepMarkup(sheep);
  button.addEventListener("pointerdown", (event) => startDrag(event, slotIndex));
  return button;
}

function renderPasture() {
  dom.pasture.innerHTML = "";
  state.pasture.forEach((sheep, index) => {
    const slot = document.createElement("div");
    slot.className = `pasture-slot ${sheep ? "" : "empty"}`;
    slot.setAttribute("data-slot", String(index));
    if (sheep) slot.appendChild(sheepButton(sheep, index));
    dom.pasture.appendChild(slot);
  });
}

function startDrag(event, slotIndex) {
  const sheep = state.pasture[slotIndex];
  if (!sheep) return;
  const node = event.currentTarget;
  const stageRect = dom.stage.getBoundingClientRect();
  const rect = node.getBoundingClientRect();
  node.setPointerCapture(event.pointerId);
  node.classList.add("dragging");

  drag = {
    pointerId: event.pointerId,
    sourceIndex: slotIndex,
    node,
    stageRect,
    offsetX: event.clientX - rect.left - rect.width / 2,
    offsetY: event.clientY - rect.top - rect.height / 2
  };

  document.body.appendChild(node);
  node.style.position = "fixed";
  node.style.width = `${rect.width}px`;
  node.style.height = `${rect.height}px`;
  moveDraggedNode(event.clientX, event.clientY);
  document.addEventListener("pointermove", onDragMove);
  document.addEventListener("pointerup", endDrag);
  document.addEventListener("pointercancel", endDrag);
}

function moveDraggedNode(clientX, clientY) {
  if (!drag) return;
  drag.node.style.left = `${clientX - drag.offsetX}px`;
  drag.node.style.top = `${clientY - drag.offsetY}px`;
  highlightTarget(clientX, clientY);
}

function onDragMove(event) {
  moveDraggedNode(event.clientX, event.clientY);
}

function endDrag(event) {
  if (!drag) return;
  const source = drag.sourceIndex;
  const target = slotFromPoint(event.clientX, event.clientY);
  const droppedOnWorkshop = event.clientX > dom.stage.getBoundingClientRect().right - 92 && event.clientY < dom.stage.getBoundingClientRect().top + 430;

  document.removeEventListener("pointermove", onDragMove);
  document.removeEventListener("pointerup", endDrag);
  document.removeEventListener("pointercancel", endDrag);
  clearTargets();
  if (drag.node.parentNode) {
    drag.node.remove();
  }
  drag = null;

  if (droppedOnWorkshop) {
    movePastureToWorkshop(source);
  } else if (target !== -1 && target !== source && state.pasture[target]) {
    mergeSheep(source, target);
  } else {
    render();
    saveGame();
  }
}

function slotFromPoint(x, y) {
  const element = document.elementFromPoint(x, y);
  const slot = element?.closest?.(".pasture-slot");
  if (!slot) return -1;
  return Number(slot.dataset.slot);
}

function highlightTarget(x, y) {
  clearTargets();
  const target = slotFromPoint(x, y);
  if (target === -1 || target === drag.sourceIndex) return;
  const sheep = state.pasture[target];
  const source = state.pasture[drag.sourceIndex];
  if (!sheep || !source || sheep.level !== source.level) return;
  const targetNode = dom.pasture.querySelector(`[data-slot="${target}"] .sheep-token`);
  if (targetNode) targetNode.classList.add("merge-target");
}

function clearTargets() {
  document.querySelectorAll(".merge-target").forEach((node) => node.classList.remove("merge-target"));
}

function renderHud() {
  const sheepCount = state.pasture.filter(Boolean).length + state.workshop.filter(Boolean).length;
  dom.coins.textContent = formatNumber(state.coins);
  dom.income.textContent = `${formatNumber(incomePerSecond())}/秒`;
  dom.maxLevel.textContent = `Lv.${state.maxLevel}`;
  dom.pastureCount.textContent = String(sheepCount);
  dom.buySheep.disabled = state.coins < BUY_COST || firstEmptyPastureSlot() === -1;
  dom.feedBoost.textContent = Date.now() < state.boostUntil ? "加速中" : "加速";
}

function render() {
  renderHud();
  renderPasture();
}

function questData() {
  return [
    { title: "买入 4 只羊", done: state.totalBought >= 4, progress: `${Math.min(state.totalBought, 4)}/4` },
    { title: "合成到 Lv.3", done: state.maxLevel >= 3, progress: `当前 Lv.${state.maxLevel}` },
    { title: "每秒 10 金币", done: incomePerSecond() >= 10, progress: `${formatNumber(incomePerSecond())}/秒` }
  ];
}

function openModal(type) {
  if (type === "workshop") {
    dom.modalTitle.textContent = "金币工作间";
    dom.modalBody.innerHTML = `
      <div class="workshop-list">
        ${Array.from({ length: state.workshopSlots }, (_, index) => {
          const sheep = state.workshop[index];
          return `<div class="workshop-row">${sheep ? `${levelData(sheep.level).name}<br>+${levelData(sheep.level).income}/秒` : "空位"}</div>`;
        }).join("")}
      </div>
      <div class="help-card">把羊拖到右上角功能按钮附近，可以送入工作间持续产金币。</div>
    `;
  }
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
        ${LEVELS.map((item) => `<div class="book-item ${item.level <= state.maxLevel ? "" : "locked"}"><strong>${item.level <= state.maxLevel ? item.name : "未发现"}</strong><span>Lv.${item.level}</span></div>`).join("")}
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
    <div>恭喜获得100金币</div>
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
    "pasture",
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
}

init();
