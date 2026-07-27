import { supabaseConfig } from "./supabase-config.js";

const BUY_BASE_COST = 50;
const PASTURE_LIMIT = 30;
const MAX_LEVEL = 25;
const NZD_START_LEVEL = 15;
const NZD_BASE_INCOME = 0.000000001;
const NZD_CHEAT_MULTIPLIER = 10000;
const AD_BOOST_MS = 5 * 60 * 1000;
const AUTO_MERGE_UNLOCK_MS = 5 * 60 * 1000;
const REDEEM_CODES = {
  gogoshop: { type: "coins", amount: 99999999 },
  gogoshop2026: { type: "sheep", level: 15 },
  henry666: { type: "cheat" }
};
const DEFAULT_SETTINGS = {
  music: true,
  sound: true,
  vibration: true,
  musicVolume: 45,
  soundVolume: 70,
  language: "zh"
};
const COPY = {
  zh: {
    title: "开心养羊场",
    stageLabel: "开心养羊场",
    levelLine: (level, count) => `当前等级: ${level} 第${count}只羊`,
    coins: "金币",
    incomeSecond: "秒",
    boosted: (value) => `(加速+${value})`,
    withdraw: "提现",
    quest: "任务",
    book: "图鉴",
    ad: "看广告",
    adPlaying: "广告中",
    boostLeft: (minutes) => `加速${minutes}分`,
    redeem: "兑换",
    settings: "设置",
    login: "登录",
    loggedIn: "已登录",
    recycle: "回收",
    autoMerge: "自动合成",
    autoMergePlaying: "广告中",
    autoMergeLeft: (minutes) => `合成${minutes}分`,
    autoMergeReward: "自动合成已解锁 5 分钟",
    noAdAutoMergeReward: "暂无广告，直接解锁 5 分钟自动合成",
    woolOrder: "羊毛订单",
    shop: "商店",
    quickBuy: "快速购买",
    pastureHint: "牧场里的羊会自动产出。高等级升级需要更多同级羊，Lv.15 开始产 NZD。",
    buyCost: (cost, level) => `${cost} 金币 · Lv.${level}`,
    full: "牧场满了，先合成升级。",
    noCoins: (cost) => `金币不够，需要 ${cost}。`,
    bought: (level, name) => `购买成功：Lv.${level} ${name}`,
    recycled: (level, value) => `回收 Lv.${level} 羊，获得 ${value} 金币`,
    sameLevel: "相同等级才能合成。",
    maxed: "已经是最高等级。",
    needMerge: (level, required) => `Lv.${level} 升级需要 ${required} 只同级羊。`,
    merged: (name) => `合成成功：${name}`,
    noMerge: "没有足够数量的同级羊。",
    orderWait: (seconds) => `订单还要 ${seconds} 秒`,
    rewardCoins: (reward) => `获得 ${reward} 金币`,
    adReward: "广告奖励：5 分钟双倍产出",
    noAdReward: "暂无广告，直接获得 5 分钟加速",
    badCode: "兑换码无效。",
    usedCode: "这个兑换码已经领取过。",
    codeCoins: (amount) => `兑换成功，获得 ${amount} 金币`,
    codeSheep: (level, name) => `兑换成功，获得 Lv.${level} ${name}`,
    cheatReward: "兑换成功：无限金币已开启，NZD 产出 x10000",
    infiniteCoins: "∞",
    pastureFullClaim: "牧场满了，先合成后再领取。",
    nzdNotEnough: "NZD 余额不足。",
    voucherSuccess: (label) => `兑换成功：${label}`,
    resetConfirmTitle: "重新开始？",
    resetConfirmText: "会清除本机存档、金币、羊和兑换记录。",
    resetNow: "确认重开",
    cancel: "取消",
    resetDone: "已清除数据，重新开始。",
    questsTitle: "今日任务",
    questBuy: "买入 8 只羊",
    questLv10: "解锁 Lv.10",
    questNzd: "获得第一笔 NZD",
    currentLevel: (level) => `当前 Lv.${level}`,
    bookTitle: "羊羊图鉴",
    unknown: "未发现",
    mergeCount: (required) => `${required}只升`,
    coinIncome: (amount) => `${amount} 金币/秒`,
    nzdIncome: (amount) => `${amount}/秒`,
    loginTitle: "登录存档",
    supabaseLocal: "未配置 Supabase，先使用本地存档。",
    supabaseLocalPlay: "未配置 Supabase，当前使用本地试玩存档。",
    cloudInit: "云存档初始化中...",
    cloudHint: "登录后会把进度保存到云端。",
    signedIn: (name) => `已登录：${name}`,
    googleLogin: "Google 登录",
    email: "邮箱",
    password: "密码 6 位以上",
    emailLogin: "邮箱登录",
    register: "注册",
    logout: "退出登录",
    redeemTitle: "兑换码",
    redeemHint: "输入兑换码领取金币或稀有羊。",
    redeemPlaceholder: "兑换码",
    claim: "领取",
    music: "音乐",
    musicVolume: "音乐音量",
    sound: "音效",
    soundVolume: "音效音量",
    vibration: "振动",
    clearData: "清除数据重新开始",
    withdrawTitle: "提现",
    balance: (amount) => `余额 ${amount}`,
    voucherNeed: (value) => `需要 NZ$${value}`,
    voucherEmpty: "兑换后会在这里显示代金券码。",
    voucherCopyHint: "点击代金券码可自动复制",
    voucherCopied: "代金券码已复制",
    voucherCopyFail: "复制失败，请长按手动复制",
    useVoucher: "去 GO GO SHOP 使用",
    levelUpTitle: "恭喜升级啦",
    levelUpBody: (earn, required) => `产出 ${earn}，下次升级需要 ${required} 只同级羊`,
    cloudLoaded: "云存档已加载",
    cloudReadFail: "云存档读取失败",
    cloudInitFail: "云存档初始化失败，当前使用本地存档。",
    needSupabase: "需要先配置 Supabase。",
    loginSuccess: "登录成功",
    googleFail: "Google 登录失败",
    needEmail: "请输入邮箱和密码。",
    registerFail: "注册失败",
    emailFail: "邮箱登录失败",
    signedOut: "已退出登录",
    close: "关闭",
    modal: "弹窗"
  },
  en: {
    title: "Happy Sheep Farm",
    stageLabel: "Happy Sheep Farm",
    levelLine: (level, count) => `Level: ${level} · Sheep ${count}`,
    coins: "coins",
    incomeSecond: "sec",
    boosted: (value) => `(boost +${value})`,
    withdraw: "Cash out",
    quest: "Quests",
    book: "Album",
    ad: "Ad boost",
    adPlaying: "Ad...",
    boostLeft: (minutes) => `${minutes}m boost`,
    redeem: "Code",
    settings: "Settings",
    login: "Login",
    loggedIn: "Logged in",
    recycle: "Sell",
    autoMerge: "Auto merge",
    autoMergePlaying: "Ad...",
    autoMergeLeft: (minutes) => `${minutes}m merge`,
    autoMergeReward: "Auto merge unlocked for 5 minutes",
    noAdAutoMergeReward: "No ad available. Auto merge unlocked for 5 minutes",
    woolOrder: "Order",
    shop: "Shop",
    quickBuy: "Quick buy",
    pastureHint: "Sheep earn automatically in the pasture. Higher levels need more matching sheep. Lv.15 starts earning NZD.",
    buyCost: (cost, level) => `${cost} coins · Lv.${level}`,
    full: "Pasture is full. Merge some sheep first.",
    noCoins: (cost) => `Not enough coins. Need ${cost}.`,
    bought: (level, name) => `Bought Lv.${level} ${name}`,
    recycled: (level, value) => `Sold Lv.${level} sheep for ${value} coins`,
    sameLevel: "Only matching levels can merge.",
    maxed: "This is already the max level.",
    needMerge: (level, required) => `Lv.${level} needs ${required} matching sheep.`,
    merged: (name) => `Merged: ${name}`,
    noMerge: "No level has enough matching sheep.",
    orderWait: (seconds) => `Order ready in ${seconds}s`,
    rewardCoins: (reward) => `Got ${reward} coins`,
    adReward: "Ad reward: 5 minutes double income",
    noAdReward: "No ad available. 5 minute boost added",
    badCode: "Invalid code.",
    usedCode: "This code has already been used.",
    codeCoins: (amount) => `Code redeemed: ${amount} coins`,
    codeSheep: (level, name) => `Code redeemed: Lv.${level} ${name}`,
    cheatReward: "Code redeemed: infinite coins unlocked, NZD income x10000",
    infiniteCoins: "∞",
    pastureFullClaim: "Pasture is full. Merge before claiming.",
    nzdNotEnough: "Not enough NZD.",
    voucherSuccess: (label) => `Redeemed: ${label}`,
    resetConfirmTitle: "Start over?",
    resetConfirmText: "This clears local save data, coins, sheep, and voucher history.",
    resetNow: "Restart",
    cancel: "Cancel",
    resetDone: "Data cleared. Fresh start.",
    questsTitle: "Daily Quests",
    questBuy: "Buy 8 sheep",
    questLv10: "Unlock Lv.10",
    questNzd: "Earn first NZD",
    currentLevel: (level) => `Current Lv.${level}`,
    bookTitle: "Sheep Album",
    unknown: "Unknown",
    mergeCount: (required) => `${required} to merge`,
    coinIncome: (amount) => `${amount} coins/sec`,
    nzdIncome: (amount) => `${amount}/sec`,
    loginTitle: "Cloud Save",
    supabaseLocal: "Supabase is not configured. Local save is active.",
    supabaseLocalPlay: "Supabase is not configured. Using local save.",
    cloudInit: "Cloud save is starting...",
    cloudHint: "Login to save progress to the cloud.",
    signedIn: (name) => `Signed in: ${name}`,
    googleLogin: "Google login",
    email: "Email",
    password: "Password, 6+ chars",
    emailLogin: "Email login",
    register: "Register",
    logout: "Logout",
    redeemTitle: "Redeem Code",
    redeemHint: "Enter a code for coins or a rare sheep.",
    redeemPlaceholder: "Code",
    claim: "Claim",
    music: "Music",
    musicVolume: "Music volume",
    sound: "SFX",
    soundVolume: "SFX volume",
    vibration: "Vibration",
    clearData: "Clear data and restart",
    withdrawTitle: "Cash Out",
    balance: (amount) => `Balance ${amount}`,
    voucherNeed: (value) => `Needs NZ$${value}`,
    voucherEmpty: "Voucher codes will appear here after exchange.",
    voucherCopyHint: "Tap a voucher code to copy it",
    voucherCopied: "Voucher code copied",
    voucherCopyFail: "Copy failed. Long press to copy manually",
    useVoucher: "Use at GO GO SHOP",
    levelUpTitle: "Level Up",
    levelUpBody: (earn, required) => `Earns ${earn}. Next merge needs ${required} matching sheep.`,
    cloudLoaded: "Cloud save loaded",
    cloudReadFail: "Cloud save read failed",
    cloudInitFail: "Cloud save failed. Using local save.",
    needSupabase: "Supabase must be configured first.",
    loginSuccess: "Login success",
    googleFail: "Google login failed",
    needEmail: "Enter email and password.",
    registerFail: "Register failed",
    emailFail: "Email login failed",
    signedOut: "Signed out",
    close: "Close",
    modal: "Modal"
  }
};
const VOUCHERS = [
  { id: "gogo-1", label: "GO GO SHOP $1 代金券", value: 1 },
  { id: "gogo-5", label: "GO GO SHOP $5 代金券", value: 5 },
  { id: "gogo-10", label: "GO GO SHOP $10 代金券", value: 10 }
];
const SAVE_KEY = "happy-sheep-farm-save-v5";
const SUPABASE_SAVE_TABLE = "farm_saves";
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
  autoMergeUntil: 0,
  redeemedCodes: [],
  purchaseCounts: {},
  infiniteCoins: false,
  nzdMultiplier: 1,
  settings: { ...DEFAULT_SETTINGS },
  vouchers: [],
  lastSaved: Date.now()
};

const cloud = {
  enabled: false,
  ready: false,
  user: null,
  client: null,
  lastSaveAt: 0,
  saveTimer: null
};

const dom = {};
let drag = null;
let toastTimer = null;
let lastFrame = 0;
let adInProgress = false;
let autoMergeInProgress = false;
let audioContext = null;
let musicTimer = null;
let audioUnlocked = false;
let musicStep = 0;

function i18n() {
  return COPY[state.settings.language === "en" ? "en" : "zh"];
}

function text(key, ...args) {
  const value = i18n()[key] ?? COPY.zh[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function currentLanguage() {
  return state.settings.language === "en" ? "en" : "zh";
}

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

function purchaseLevel() {
  const unlockedLevel = Math.min(Math.max(1, state.maxLevel), MAX_LEVEL);
  const pastureLevels = [...new Set(state.pasture
    .map((sheep) => Math.min(Math.max(1, sheep.level || 1), unlockedLevel))
    .filter((level) => level <= unlockedLevel))]
    .sort((a, b) => a - b);

  if (pastureLevels.length > 0) {
    const affordablePastureLevel = pastureLevels.find((level) => state.infiniteCoins || state.coins >= buyCost(level));
    return affordablePastureLevel || pastureLevels[0];
  }

  if (state.infiniteCoins) return unlockedLevel;
  for (let level = unlockedLevel; level >= 1; level -= 1) {
    if (state.coins >= buyCost(level)) return level;
  }
  return 1;
}

function buyCost(level = purchaseLevel()) {
  const baseCost = BUY_BASE_COST * level;
  if (level <= 10) return baseCost;
  const levelPressure = 1.75 ** (level - 10);
  const repeatPressure = 1.32 ** (state.purchaseCounts[level] || 0);
  return Math.floor(baseCost * levelPressure * repeatPressure);
}

function mergeRequirement(level) {
  const currentLevel = Math.max(1, Number(level) || 1);
  if (currentLevel <= 10) return 2;
  return Math.min(6, 2 + Math.ceil((currentLevel - 10) / 5));
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
    autoMergeUntil: state.autoMergeUntil,
    redeemedCodes: state.redeemedCodes,
    purchaseCounts: state.purchaseCounts,
    infiniteCoins: state.infiniteCoins,
    nzdMultiplier: state.nzdMultiplier,
    settings: state.settings,
    vouchers: state.vouchers,
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
    autoMergeUntil: Number(saved.autoMergeUntil) || 0,
    redeemedCodes: Array.isArray(saved.redeemedCodes) ? saved.redeemedCodes : [],
    purchaseCounts: saved.purchaseCounts && typeof saved.purchaseCounts === "object" ? saved.purchaseCounts : {},
    infiniteCoins: Boolean(saved.infiniteCoins),
    nzdMultiplier: Math.max(1, Number(saved.nzdMultiplier) || 1),
    settings: { ...DEFAULT_SETTINGS, ...(saved.settings && typeof saved.settings === "object" ? saved.settings : {}) },
    vouchers: Array.isArray(saved.vouchers) ? saved.vouchers : [],
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
    toast(`Offline +${formatNumber(offlineCoins)} ${text("coins")} ${formatNZD(offlineNzd)}`);
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

function vibrate(pattern = 18) {
  if (state.settings.vibration && navigator.vibrate) navigator.vibrate(pattern);
}

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function playTone(frequency = 520, duration = 0.08, gain = 0.08, type = "sine", delay = 0) {
  if (!state.settings.sound) return;
  try {
    const context = ensureAudioContext();
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    const startAt = context.currentTime + delay;
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    volume.gain.setValueAtTime(0.0001, startAt);
    volume.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain * (state.settings.soundVolume / 100)), startAt + 0.012);
    volume.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(volume);
    volume.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.02);
  } catch {
    // Audio can be blocked before user interaction; ignore silently.
  }
}

function playMusicTone(frequency = 196, duration = 0.24, gain = 0.032) {
  if (!state.settings.music) return;
  try {
    const context = ensureAudioContext();
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    const startAt = context.currentTime;
    oscillator.frequency.value = frequency;
    oscillator.type = "triangle";
    volume.gain.setValueAtTime(0.0001, startAt);
    volume.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain * (state.settings.musicVolume / 100)), startAt + 0.03);
    volume.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(volume);
    volume.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.04);
  } catch {
    // Browsers may block audio until the first tap.
  }
}

function syncMusic() {
  clearInterval(musicTimer);
  musicTimer = null;
  if (!state.settings.music || !audioUnlocked) return;
  const melody = [261.63, 329.63, 392.0, 329.63, 293.66, 349.23, 440.0, 392.0];
  musicTimer = setInterval(() => {
    if (document.hidden || !state.settings.music) return;
    playMusicTone(melody[musicStep % melody.length]);
    musicStep += 1;
  }, 640);
}

function unlockAudio() {
  if (audioUnlocked) return;
  try {
    ensureAudioContext();
    audioUnlocked = true;
    syncMusic();
  } catch {
    // Keep the game playable if audio is unavailable.
  }
}

function feedback(kind = "tap") {
  unlockAudio();
  const effects = {
    tap: [[440, 0.045, 0.045, "triangle", 0]],
    buy: [[523.25, 0.07, 0.06, "sine", 0], [659.25, 0.09, 0.05, "sine", 0.055]],
    merge: [[523.25, 0.06, 0.055, "triangle", 0], [659.25, 0.07, 0.055, "triangle", 0.055], [783.99, 0.11, 0.055, "triangle", 0.11]],
    sell: [[246.94, 0.07, 0.055, "sawtooth", 0], [196, 0.08, 0.04, "sawtooth", 0.06]],
    reward: [[659.25, 0.08, 0.05, "triangle", 0], [880, 0.12, 0.055, "triangle", 0.08]],
    error: [[174.61, 0.1, 0.05, "square", 0]]
  };
  (effects[kind] || effects.tap).forEach(([frequency, duration, gain, type, delay]) => {
    playTone(frequency, duration, gain, type, delay);
  });
  vibrate(kind === "error" ? [20, 30, 20] : 18);
}

function incomeMultiplier() {
  return Date.now() < state.boostUntil ? 2 : 1;
}

function baseCoinIncomePerSecond() {
  return state.pasture.reduce((sum, sheep) => {
    return sum + levelData(sheep.level).coinIncome;
  }, 0);
}

function coinIncomePerSecond() {
  return baseCoinIncomePerSecond() * incomeMultiplier();
}

function boostedCoinIncomePerSecond() {
  return Math.max(0, coinIncomePerSecond() - baseCoinIncomePerSecond());
}

function baseNzdIncomePerSecond() {
  return state.pasture.reduce((sum, sheep) => {
    return sum + levelData(sheep.level).nzdIncome;
  }, 0);
}

function nzdIncomePerSecond() {
  return baseNzdIncomePerSecond() * incomeMultiplier() * Math.max(1, state.nzdMultiplier || 1);
}

function buySheep() {
  const level = purchaseLevel();
  const cost = buyCost(level);
  if (state.pasture.length >= PASTURE_LIMIT) {
    toast(text("full"));
    feedback("error");
    return;
  }
  if (!state.infiniteCoins && state.coins < cost) {
    toast(text("noCoins", formatNumber(cost)));
    feedback("error");
    return;
  }

  if (!state.infiniteCoins) state.coins -= cost;
  state.pasture.push(createSheep(level));
  state.totalBought += 1;
  state.purchaseCounts[level] = (state.purchaseCounts[level] || 0) + 1;
  toast(text("bought", level, levelData(level).name));
  feedback("buy");
  render();
  saveGame();
}

function recycleValue(level) {
  return Math.max(1, Math.floor(BUY_BASE_COST * level * (level <= 10 ? 0.45 : 0.75 * 1.4 ** (level - 10))));
}

function recycleSheep(index) {
  const sheep = state.pasture[index];
  if (!sheep) return false;
  const value = recycleValue(sheep.level);
  state.pasture.splice(index, 1);
  state.coins += value;
  state.totalEarnedCoins += value;
  toast(text("recycled", sheep.level, formatNumber(value)));
  feedback("sell");
  render();
  saveGame();
  return true;
}

function mergeSheep(sourceIndex, targetIndex) {
  const source = state.pasture[sourceIndex];
  const target = state.pasture[targetIndex];
  if (!source || !target || sourceIndex === targetIndex) return false;
  if (source.level !== target.level) {
    toast(text("sameLevel"));
    feedback("error");
    return false;
  }
  if (source.level >= MAX_LEVEL) {
    toast(text("maxed"));
    feedback("error");
    return false;
  }

  const required = mergeRequirement(source.level);
  const sameLevelIndexes = state.pasture
    .map((sheep, index) => ({ sheep, index }))
    .filter((item) => item.sheep.level === source.level)
    .map((item) => item.index);

  if (sameLevelIndexes.length < required) {
    toast(text("needMerge", source.level, required));
    feedback("error");
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
    feedback("merge");
    showLevelUp(nextLevel);
  } else {
    toast(text("merged", levelData(nextLevel).name));
    feedback("merge");
  }
  return true;
}

function autoMergeOnce(silent = false) {
  for (let level = 1; level < MAX_LEVEL; level += 1) {
    const indexes = state.pasture
      .map((sheep, index) => ({ sheep, index }))
      .filter((item) => item.sheep.level === level)
      .map((item) => item.index);
    if (indexes.length >= mergeRequirement(level)) {
      mergeSheep(indexes[0], indexes[1]);
      return true;
    }
  }
  if (!silent) {
    toast(text("noMerge"));
    feedback("error");
  }
  return false;
}

async function autoMerge() {
  if (autoMergeInProgress) return;
  if (Date.now() < state.autoMergeUntil) {
    autoMergeOnce();
    return;
  }

  autoMergeInProgress = true;
  dom.autoMerge.disabled = true;
  dom.autoMerge.textContent = text("autoMergePlaying");
  const watched = await watchRewardedAd();
  const startAt = Math.max(Date.now(), state.autoMergeUntil);
  state.autoMergeUntil = startAt + AUTO_MERGE_UNLOCK_MS;
  autoMergeInProgress = false;
  toast(watched ? text("autoMergeReward") : text("noAdAutoMergeReward"));
  feedback("reward");
  render();
  saveGame();
}

function collectWoolOrder() {
  const reward = Math.floor(35 + state.maxLevel * 18 + coinIncomePerSecond() * 4);
  const cooldownKey = "happy-sheep-order-time";
  const last = Number(localStorage.getItem(cooldownKey)) || 0;
  const waitMs = 90000;
  if (Date.now() - last < waitMs) {
    toast(text("orderWait", Math.ceil((waitMs - (Date.now() - last)) / 1000)));
    return;
  }
  state.coins += reward;
  state.reputation += 5;
  state.totalEarnedCoins += reward;
  localStorage.setItem(cooldownKey, String(Date.now()));
  toast(text("rewardCoins", formatNumber(reward)));
  render();
  saveGame();
}

async function feedBoost() {
  if (adInProgress) return;
  adInProgress = true;
  dom.feedBoost.disabled = true;
  dom.feedBoost.textContent = text("adPlaying");
  const watched = await watchRewardedAd();
  const startAt = Math.max(Date.now(), state.boostUntil);
  state.boostUntil = startAt + AD_BOOST_MS;
  adInProgress = false;
  toast(watched ? text("adReward") : text("noAdReward"));
  render();
  saveGame();
}

async function watchRewardedAd() {
  if (typeof window.showRewardedAd !== "function") return false;
  try {
    return await window.showRewardedAd();
  } catch (error) {
    console.warn(error);
    return false;
  }
}

function redeemCode(code) {
  const normalized = code.toLowerCase().replace(/[^a-z0-9]/g, "");
  const reward = REDEEM_CODES[normalized];
  if (!reward) {
    toast(text("badCode"));
    return;
  }
  if (state.redeemedCodes.includes(normalized) && reward.type !== "cheat") {
    toast(text("usedCode"));
    return;
  }

  if (reward.type !== "cheat") state.redeemedCodes.push(normalized);
  if (reward.type === "coins") {
    state.coins += reward.amount;
    state.totalEarnedCoins += reward.amount;
    toast(text("codeCoins", formatNumber(reward.amount)));
  }
  if (reward.type === "cheat") {
    state.infiniteCoins = true;
    state.nzdMultiplier = Math.max(NZD_CHEAT_MULTIPLIER, state.nzdMultiplier || 1);
    toast(text("cheatReward"));
  }
  if (reward.type === "sheep") {
    if (state.pasture.length >= PASTURE_LIMIT) {
      state.redeemedCodes = state.redeemedCodes.filter((item) => item !== normalized);
      toast(text("pastureFullClaim"));
      return;
    }
    state.pasture.push(createSheep(reward.level));
    state.maxLevel = Math.max(state.maxLevel, reward.level);
    toast(text("codeSheep", reward.level, levelData(reward.level).name));
  }
  closeModal();
  render();
  saveGame();
}

function updateSetting(key, value) {
  state.settings[key] = value;
  if (key === "music" || key === "musicVolume") syncMusic();
  if (key === "language") render();
  feedback("tap");
  saveGame();
}

function toggleLanguage() {
  updateSetting("language", currentLanguage() === "en" ? "zh" : "en");
}

function voucherCode(value) {
  return `GOGO-${value}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function voucherLabel(voucher) {
  return currentLanguage() === "en"
    ? `GO GO SHOP $${voucher.value} voucher`
    : voucher.label;
}

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

async function copyVoucherCode(code) {
  try {
    await copyText(code);
    toast(text("voucherCopied"));
    feedback("reward");
  } catch {
    toast(text("voucherCopyFail"));
    feedback("error");
  }
}

function redeemVoucher(voucherId) {
  const voucher = VOUCHERS.find((item) => item.id === voucherId);
  if (!voucher) return;
  if (state.nzd < voucher.value) {
    toast(text("nzdNotEnough"));
    feedback("error");
    return;
  }

  const code = voucherCode(voucher.value);
  state.nzd -= voucher.value;
  state.vouchers.unshift({
    code,
    label: voucher.label,
    value: voucher.value,
    createdAt: Date.now()
  });
  toast(text("voucherSuccess", voucherLabel(voucher)));
  feedback("reward");
  openModal("withdraw");
  render();
  saveGame();
}

function freshGameState(settings = state.settings) {
  return {
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
    autoMergeUntil: 0,
    redeemedCodes: [],
    purchaseCounts: {},
    infiniteCoins: false,
    nzdMultiplier: 1,
    settings: { ...DEFAULT_SETTINGS, ...settings },
    vouchers: [],
    lastSaved: Date.now()
  };
}

async function resetGame() {
  Object.assign(state, freshGameState());
  localStorage.removeItem(SAVE_KEY);
  OLD_SAVE_KEYS.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem("happy-sheep-order-time");
  localStorage.removeItem("happy-sheep-quest-flags");
  closeModal();
  render();
  saveGame();
  if (cloud.enabled && cloud.user) await saveCloudGame(true);
  toast(text("resetDone"));
  feedback("reward");
}

function formatNumber(value) {
  if (!Number.isFinite(Number(value))) return text("infiniteCoins");
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${Math.floor(value)}`;
}

function coinBalanceText() {
  return state.infiniteCoins ? text("infiniteCoins") : formatNumber(state.coins);
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

function renderStaticText() {
  document.documentElement.lang = currentLanguage() === "en" ? "en" : "zh-CN";
  document.title = text("title");
  dom.stage.setAttribute("aria-label", text("stageLabel"));
  dom.withdrawButton.textContent = text("withdraw");
  dom.languageToggle.textContent = currentLanguage() === "en" ? "中" : "EN";
  document.querySelector('[data-modal="quest"]').textContent = text("quest");
  document.querySelector('[data-modal="book"]').textContent = text("book");
  document.querySelector('[data-modal="redeem"]').textContent = text("redeem");
  document.querySelector('[data-modal="settings"]').textContent = text("settings");
  dom.autoMerge.textContent = text("autoMerge");
  dom.collectBonus.textContent = text("woolOrder");
  dom.pastureHint.textContent = text("pastureHint");
  dom.buySheep.querySelector(".cart-icon").textContent = text("shop");
  dom.buySheep.querySelector("strong").textContent = text("quickBuy");
  dom.closeModal.setAttribute("aria-label", text("close"));
  dom.recycleBin.setAttribute("aria-label", text("recycle"));
  dom.recycleBin.querySelector(".bin-body").textContent = text("recycle");
}

function renderHud() {
  renderStaticText();
  const level = purchaseLevel();
  const cost = buyCost(level);
  const baseCoinIncome = baseCoinIncomePerSecond();
  const boostedCoinIncome = boostedCoinIncomePerSecond();
  const coinIncomeText = boostedCoinIncome > 0
    ? `+${formatNumber(baseCoinIncome)}/${text("incomeSecond")} <span class="boosted-income">${text("boosted", formatNumber(boostedCoinIncome))}</span>`
    : `+${formatNumber(baseCoinIncome)}/${text("incomeSecond")}`;
  dom.coins.textContent = `${coinBalanceText()} ${text("coins")}`;
  dom.nzd.textContent = formatNZD(state.nzd);
  dom.income.innerHTML = `${coinIncomeText} · +${formatNZD(nzdIncomePerSecond())}/${text("incomeSecond")}`;
  dom.maxLevel.textContent = `Lv.${state.maxLevel}`;
  dom.maxLevel.parentElement.innerHTML = text("levelLine", `<strong id="maxLevel">Lv.${state.maxLevel}</strong>`, `<span id="pastureCount">${state.pasture.length}</span>`);
  dom.maxLevel = document.getElementById("maxLevel");
  dom.pastureCount = document.getElementById("pastureCount");
  dom.pastureCount.textContent = String(state.pasture.length);
  dom.buySheep.disabled = (!state.infiniteCoins && state.coins < cost) || state.pasture.length >= PASTURE_LIMIT;
  dom.buyCost.textContent = text("buyCost", formatNumber(cost), level);
  dom.autoMerge.disabled = autoMergeInProgress;
  dom.autoMerge.textContent = autoMergeInProgress
    ? text("autoMergePlaying")
    : Date.now() < state.autoMergeUntil
    ? text("autoMergeLeft", Math.ceil((state.autoMergeUntil - Date.now()) / 60000))
    : text("autoMerge");
  dom.feedBoost.disabled = adInProgress;
  dom.feedBoost.textContent = adInProgress
    ? text("adPlaying")
    : Date.now() < state.boostUntil
    ? text("boostLeft", Math.ceil((state.boostUntil - Date.now()) / 60000))
    : text("ad");
  dom.pastureHint.classList.toggle("is-hidden", state.totalMerged >= 2);
  dom.loginButton.textContent = cloud.user ? text("loggedIn") : text("login");
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
  updateRecycleTarget(clientX, clientY);
  highlightMergeTarget();
}

function endDrag(event) {
  if (!drag) return;
  const currentDrag = drag;
  const targetIndex = findMergeTargetIndex(currentDrag.index);
  const droppedOnRecycle = isPointInElement(event.clientX, event.clientY, dom.recycleBin);

  currentDrag.node.classList.remove("dragging");
  currentDrag.node.classList.add("walking");
  currentDrag.node.releasePointerCapture(event.pointerId);
  currentDrag.node.removeEventListener("pointermove", onDragMove);
  currentDrag.node.removeEventListener("pointerup", endDrag);
  currentDrag.node.removeEventListener("pointercancel", endDrag);
  clearTargets();
  dom.recycleBin.classList.remove("is-active");
  drag = null;

  if (droppedOnRecycle) {
    recycleSheep(currentDrag.index);
  } else if (targetIndex !== -1) {
    mergeSheep(currentDrag.index, targetIndex);
  } else {
    render();
    saveGame();
  }
}

function isPointInElement(clientX, clientY, element) {
  const rect = element.getBoundingClientRect();
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}

function updateRecycleTarget(clientX, clientY) {
  dom.recycleBin.classList.toggle("is-active", isPointInElement(clientX, clientY, dom.recycleBin));
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
    { title: text("questBuy"), done: state.totalBought >= 8, progress: `${Math.min(state.totalBought, 8)}/8` },
    { title: text("questLv10"), done: state.maxLevel >= 10, progress: text("currentLevel", state.maxLevel) },
    { title: text("questNzd"), done: state.nzd > 0, progress: formatNZD(state.nzd) }
  ];
}

function openModal(type) {
  dom.modalBackdrop.dataset.modalType = type;

  if (type === "quest") {
    dom.modalTitle.textContent = text("questsTitle");
    dom.modalBody.innerHTML = questData()
      .map((quest) => `<div class="quest ${quest.done ? "done" : ""}"><strong>${quest.title}</strong><span>${quest.progress}</span></div>`)
      .join("");
  }

  if (type === "book") {
    dom.modalTitle.textContent = text("bookTitle");
    dom.modalBody.innerHTML = `
      <div class="sheep-book">
        ${LEVELS.map((item) => {
          const unlocked = item.level <= state.maxLevel;
          const earn = item.level >= NZD_START_LEVEL
            ? text("nzdIncome", formatNZD(item.nzdIncome * Math.max(1, state.nzdMultiplier || 1)))
            : text("coinIncome", formatNumber(item.coinIncome));
          return `
            <div class="book-item ${unlocked ? "" : "locked"}">
              <span class="book-preview sheep-token variant-${item.level}" style="${sheepStyleAttr(item.level)}">${sheepMarkup({ level: item.level })}</span>
              <strong>${unlocked ? item.name : text("unknown")}</strong>
              <span>Lv.${item.level} · ${text("mergeCount", mergeRequirement(item.level))}</span>
              <span>${earn}</span>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  if (type === "login") {
    dom.modalTitle.textContent = text("loginTitle");
    dom.modalBody.innerHTML = `
      <div class="auth-card">
        <p id="authStatus">${authStatusText()}</p>
        <button id="googleLogin" type="button">${text("googleLogin")}</button>
        <form id="emailAuthForm" class="auth-form">
          <input id="emailInput" type="email" placeholder="${text("email")}" autocomplete="email" />
          <input id="passwordInput" type="password" placeholder="${text("password")}" autocomplete="current-password" />
          <div class="auth-actions">
            <button id="emailLogin" type="submit" data-mode="login">${text("emailLogin")}</button>
            <button id="emailRegister" type="submit" data-mode="register">${text("register")}</button>
          </div>
        </form>
        <button id="logoutButton" type="button" ${cloud.user ? "" : "hidden"}>${text("logout")}</button>
      </div>
    `;
  }

  if (type === "redeem") {
    dom.modalTitle.textContent = text("redeemTitle");
    dom.modalBody.innerHTML = `
      <form id="redeemForm" class="auth-card">
        <p>${text("redeemHint")}</p>
        <input id="redeemInput" type="text" placeholder="${text("redeemPlaceholder")}" autocomplete="off" />
        <button type="submit">${text("claim")}</button>
      </form>
    `;
  }

  if (type === "settings") {
    dom.modalTitle.textContent = text("settings");
    dom.modalBody.innerHTML = `
      <div class="settings-card">
        <label><span>${text("music")}</span><input data-setting="music" type="checkbox" ${state.settings.music ? "checked" : ""} /></label>
        <label><span>${text("musicVolume")}</span><input data-setting="musicVolume" type="range" min="0" max="100" value="${state.settings.musicVolume}" /></label>
        <label><span>${text("sound")}</span><input data-setting="sound" type="checkbox" ${state.settings.sound ? "checked" : ""} /></label>
        <label><span>${text("soundVolume")}</span><input data-setting="soundVolume" type="range" min="0" max="100" value="${state.settings.soundVolume}" /></label>
        <label><span>${text("vibration")}</span><input data-setting="vibration" type="checkbox" ${state.settings.vibration ? "checked" : ""} /></label>
        <button id="clearDataButton" class="danger-action" type="button">${text("clearData")}</button>
      </div>
    `;
  }

  if (type === "withdraw") {
    dom.modalTitle.textContent = text("withdrawTitle");
    dom.modalBody.innerHTML = `
      <div class="withdraw-card">
        <strong>${text("balance", formatNZD(state.nzd))}</strong>
        <div class="voucher-list">
          ${VOUCHERS.map((voucher) => `
            <button type="button" data-voucher="${voucher.id}" ${state.nzd < voucher.value ? "disabled" : ""}>
              ${voucherLabel(voucher)}
              <span>${text("voucherNeed", voucher.value)}</span>
            </button>
          `).join("")}
        </div>
        <div class="voucher-history">
          ${state.vouchers.length
            ? state.vouchers.slice(0, 5).map((voucher) => `
              <div class="voucher-code">
                <span>${voucher.label}</span>
                <button type="button" data-copy-voucher="${voucher.code}">${voucher.code}</button>
              </div>
            `).join("")
            : `<p>${text("voucherEmpty")}</p>`}
        </div>
        <small>${text("voucherCopyHint")}</small>
        <button id="goGoShopButton" class="shop-link-button" type="button">${text("useVoucher")}</button>
      </div>
    `;
  }

  if (type === "reset-confirm") {
    dom.modalTitle.textContent = text("resetConfirmTitle");
    dom.modalBody.innerHTML = `
      <div class="auth-card">
        <p>${text("resetConfirmText")}</p>
        <div class="auth-actions">
          <button id="confirmResetButton" class="danger-action" type="button">${text("resetNow")}</button>
          <button id="cancelResetButton" type="button">${text("cancel")}</button>
        </div>
      </div>
    `;
  }

  dom.modalBackdrop.hidden = false;
}

function closeModal() {
  dom.modalBackdrop.hidden = true;
}

function showLevelUp(level) {
  dom.modalTitle.textContent = text("levelUpTitle");
  const item = levelData(level);
  const earn = level >= NZD_START_LEVEL
    ? text("nzdIncome", formatNZD(item.nzdIncome * Math.max(1, state.nzdMultiplier || 1)))
    : text("coinIncome", formatNumber(item.coinIncome));
  dom.modalBody.innerHTML = `
    <button class="sheep-token variant-${level}" style="${sheepStyleAttr(level)}" type="button">${sheepMarkup({ level })}</button>
    <div>Lv.${level} ${item.name}</div>
    <div>${text("levelUpBody", earn, mergeRequirement(level))}</div>
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
  if (Date.now() < state.autoMergeUntil) {
    autoMergeOnce(true);
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

function hasSupabaseConfig() {
  return Boolean(
    supabaseConfig
    && supabaseConfig.url
    && supabaseConfig.anonKey
    && !String(supabaseConfig.url).includes("YOUR_")
    && !String(supabaseConfig.anonKey).includes("YOUR_")
  );
}

async function setupCloudSave() {
  if (!hasSupabaseConfig()) {
    cloud.ready = true;
    updateAuthStatus(text("supabaseLocalPlay"));
    return;
  }

  try {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    cloud.client = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    cloud.enabled = true;
    cloud.ready = true;

    const { data } = await cloud.client.auth.getSession();
    cloud.user = data.session?.user || null;
    updateAuthStatus(authStatusText());
    renderHud();
    if (cloud.user) await loadCloudGame();

    cloud.client.auth.onAuthStateChange(async (event, session) => {
      cloud.user = session?.user || null;
      updateAuthStatus(authStatusText());
      renderHud();
      if (cloud.user && event !== "INITIAL_SESSION") await loadCloudGame();
    });
  } catch (error) {
    cloud.ready = true;
    updateAuthStatus(text("cloudInitFail"));
    console.error(error);
  }
}

function authStatusText() {
  if (!hasSupabaseConfig()) return text("supabaseLocal");
  if (!cloud.enabled) return text("cloudInit");
  if (!cloud.user) return text("cloudHint");
  return text("signedIn", cloud.user.email || cloud.user.user_metadata?.full_name || "Google 用户");
}

function updateAuthStatus(text) {
  const status = document.getElementById("authStatus");
  if (status) status.textContent = text;
}

async function loadCloudGame() {
  if (!cloud.enabled || !cloud.user) return;
  try {
    const { data, error } = await cloud.client
      .from(SUPABASE_SAVE_TABLE)
      .select("state")
      .eq("user_id", cloud.user.id)
      .maybeSingle();
    if (error) throw error;
    if (data?.state) {
      applySavedState(data.state, true);
      applyOfflineIncome();
      localStorage.setItem(SAVE_KEY, JSON.stringify(serializableState()));
      render();
      toast(text("cloudLoaded"));
    } else {
      await saveCloudGame(true);
    }
  } catch (error) {
    toast(text("cloudReadFail"));
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
    const { error } = await cloud.client
      .from(SUPABASE_SAVE_TABLE)
      .upsert({
        user_id: cloud.user.id,
        state: serializableState(),
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

function authRedirectUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

async function signInGoogle() {
  if (!cloud.enabled) {
    toast(text("needSupabase"));
    return;
  }
  try {
    const { error } = await cloud.client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: authRedirectUrl() }
    });
    if (error) throw error;
  } catch (error) {
    toast(text("googleFail"));
    console.error(error);
  }
}

async function signInEmail(mode) {
  if (!cloud.enabled) {
    toast(text("needSupabase"));
    return;
  }
  const email = document.getElementById("emailInput")?.value.trim();
  const password = document.getElementById("passwordInput")?.value;
  if (!email || !password) {
    toast(text("needEmail"));
    return;
  }
  try {
    const { error } = mode === "register"
      ? await cloud.client.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: authRedirectUrl() }
      })
      : await cloud.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    toast(text("loginSuccess"));
  } catch (error) {
    toast(mode === "register" ? text("registerFail") : text("emailFail"));
    console.error(error);
  }
}

async function signOutUser() {
  if (!cloud.enabled) return;
  await saveCloudGame(true);
  await cloud.client.auth.signOut();
  cloud.user = null;
  toast(text("signedOut"));
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
    "withdrawButton",
    "languageToggle",
    "loginButton",
    "resetGame",
    "recycleBin",
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
  window.addEventListener("pointerdown", unlockAudio, { once: true });
  dom.buySheep.addEventListener("click", buySheep);
  dom.autoMerge.addEventListener("click", autoMerge);
  dom.collectBonus.addEventListener("click", collectWoolOrder);
  dom.feedBoost.addEventListener("click", feedBoost);
  dom.withdrawButton.addEventListener("click", () => openModal("withdraw"));
  dom.languageToggle.addEventListener("click", toggleLanguage);
  dom.loginButton.addEventListener("click", () => openModal("login"));
  dom.resetGame.addEventListener("click", resetGame);
  dom.closeModal.addEventListener("click", closeModal);
  dom.modalBackdrop.addEventListener("click", (event) => {
    if (event.target === dom.modalBackdrop) closeModal();
  });
  dom.modalBody.addEventListener("click", (event) => {
    if (event.target.id === "googleLogin") signInGoogle();
    if (event.target.id === "logoutButton") signOutUser();
    if (event.target.id === "clearDataButton") openModal("reset-confirm");
    if (event.target.id === "confirmResetButton") resetGame();
    if (event.target.id === "cancelResetButton") openModal("settings");
    if (event.target.id === "goGoShopButton") window.open("https://gogoshop.nz", "_blank", "noopener");
    const copyButton = event.target.closest("[data-copy-voucher]");
    if (copyButton) copyVoucherCode(copyButton.dataset.copyVoucher);
    const voucherButton = event.target.closest("[data-voucher]");
    if (voucherButton) redeemVoucher(voucherButton.dataset.voucher);
  });
  dom.modalBody.addEventListener("input", (event) => {
    const setting = event.target.dataset.setting;
    if (!setting) return;
    const value = event.target.type === "checkbox" ? event.target.checked : Number(event.target.value);
    updateSetting(setting, value);
  });
  dom.modalBody.addEventListener("submit", (event) => {
    if (event.target.id === "redeemForm") {
      event.preventDefault();
      redeemCode(document.getElementById("redeemInput")?.value || "");
      return;
    }
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
  syncMusic();
  setupCloudSave();
  setInterval(tick, 1000);
  requestAnimationFrame(animate);
}

init();
