import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(here, "../assets/sheep/web");

const sheep = [
  ["棒球帽羊", "baseball-cap", ["#fff9ef", "#f0d7bd", "#c88f65", "#ffb4ad", "#c85662", "#f8fbff", "#1e6b9a"], "cap"],
  ["弹弓羊", "slingshot", ["#ffe2dc", "#ffaaa1", "#e96770", "#ffc6c0", "#c95765", "#e2a73b", "#8a4b26"], "slingshot"],
  ["铜角羊", "copper-horn", ["#fff3b8", "#edb64f", "#a95c1d", "#f1a88b", "#8f4135", "#f0b45c", "#8d4a20"], "horns"],
  ["蓝帽羊", "blue-hat", ["#f5fdff", "#a6dff5", "#2f8db6", "#d5eef6", "#486f86", "#4b83d9", "#17386e"], "beanie"],
  ["星角羊", "star-horn", ["#f6f1ff", "#c0adff", "#684fc7", "#d4c6ff", "#51408f", "#ffe778", "#8d71e8"], "starhorn"],
  ["金冠羊", "gold-crown", ["#fff8bc", "#f3c84e", "#ae6812", "#f2bd66", "#65300f", "#ffe66f", "#c67a10"], "crown"],
  ["彩虹羊", "rainbow", ["#f8ffff", "#7ee6d6", "#d95592", "#ffc8e2", "#8c3564", "#ffdd58", "#4ccf7a"], "rainbow"],
  ["传说羊", "legendary", ["#ffffff", "#d3dce8", "#526579", "#dfe8f5", "#202a36", "#f4d369", "#9caec4"], "legendary"],
  ["松露羊", "truffle", ["#f5fff0", "#91cf74", "#438346", "#edbc9b", "#794633", "#6b4026", "#b7895b"], "truffle"],
  ["银铃羊", "silver-bell", ["#fffdf5", "#e8e1c8", "#8d8873", "#f0c3ac", "#76584f", "#e9edf2", "#8b98a8"], "bell"],
  ["翡翠羊", "emerald", ["#effff7", "#8ee2b7", "#1d704e", "#bdecd7", "#285f4e", "#56e2a4", "#126842"], "emerald"],
  ["黑曜羊", "obsidian", ["#e8e6e2", "#6f6a66", "#171517", "#b5aaa2", "#211d24", "#d6bd70", "#302b35"], "obsidian"],
  ["极光羊", "aurora", ["#f2ffff", "#89e9ff", "#5159b9", "#d3f2ff", "#4a5598", "#7df6ff", "#c487ff"], "aurora"],
  ["钻石羊", "diamond", ["#ffffff", "#bde8ff", "#608fc8", "#eef9ff", "#395784", "#dff8ff", "#7fc7ef"], "diamond"],
  ["纽币羊", "nzd", ["#f9ffde", "#bce25c", "#568829", "#d7f0a4", "#4c6c32", "#1e6f46", "#e7c855"], "coin"],
  ["牧场经理羊", "farm-manager", ["#fff7e1", "#f0c164", "#935e1c", "#f7d29b", "#70411c", "#174f38", "#f0cf65"], "manager"],
  ["黄金剪羊", "golden-shears", ["#fff6d8", "#edc64a", "#aa6d16", "#f2c47d", "#653713", "#ffe899", "#b9cbd4"], "shears"],
  ["云端羊", "cloud", ["#ffffff", "#dceeff", "#86acd0", "#e8f5ff", "#58758f", "#ffffff", "#8bc9ff"], "cloud"],
  ["银河羊", "galaxy", ["#fffaff", "#9297ff", "#212b74", "#d9d8ff", "#292d65", "#ffe665", "#704bdf"], "galaxy"],
  ["皇家羊", "royal", ["#fff5c0", "#e5b744", "#6c3b12", "#f2c578", "#512a12", "#f5d457", "#861129"], "royal"],
  ["时光羊", "time", ["#f7fbff", "#b3d4dc", "#507279", "#d7e7ec", "#486268", "#d7edf2", "#394c55"], "clock"],
  ["量子羊", "quantum", ["#f4ffff", "#71f6d9", "#3154a7", "#c6fff1", "#2d427d", "#9d7bff", "#2fe0c1"], "quantum"],
  ["奥克兰羊王", "auckland-king", ["#fff4df", "#9ed681", "#1c6848", "#f1c8a6", "#543928", "#efcc5c", "#111d16"], "auckland"],
  ["南十字星羊", "southern-cross", ["#f8ffff", "#92c7ff", "#174477", "#d3edff", "#234671", "#fff5ac", "#df224a"], "southerncross"],
  ["新西兰神话羊", "nz-myth", ["#ffffff", "#f7e59c", "#71858c", "#f8e5bd", "#405158", "#f6d35d", "#101820"], "myth"]
];

const star = (x, y, r, fill = "#fff3a3") => {
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 ? r * 0.43 : r;
    return `${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`;
  }).join(" ");
  return `<polygon points="${points}" fill="${fill}" stroke="#5b4518" stroke-width="8" stroke-linejoin="round"/>`;
};

function accessory(type) {
  const a = 'url(#accent)';
  switch (type) {
    case "cap": return `<path d="M605 332q105-92 225 4l-16 83-208-10z" fill="${a}" stroke="#4b3d39" stroke-width="13"/><path d="M762 398q113-22 151 30-92 37-167 10z" fill="url(#accent2)" stroke="#4b3d39" stroke-width="12"/><path d="M688 329q18 41 11 76" fill="none" stroke="#aab8c6" stroke-width="9"/>`;
    case "slingshot": return `<g transform="rotate(-18 250 505)"><path d="M236 420l-48-87m48 87 61-76m-60 75 20 231" fill="none" stroke="#7a4526" stroke-width="29" stroke-linecap="round"/><path d="M188 334q55 55 109 10" fill="none" stroke="#e5bd68" stroke-width="12"/></g>`;
    case "horns": return `<path d="M615 410q-96-122 11-171 71 2 67 77-4 62-70 59" fill="none" stroke="url(#accent)" stroke-width="40" stroke-linecap="round"/><path d="M824 382q92-93 137-8 27 60-40 89" fill="none" stroke="url(#accent2)" stroke-width="36" stroke-linecap="round"/>`;
    case "beanie": return `<path d="M611 398q19-154 140-166 128 8 132 158z" fill="url(#accent)" stroke="#31455f" stroke-width="13"/><rect x="603" y="370" width="288" height="66" rx="29" fill="url(#accent2)" stroke="#31455f" stroke-width="12"/><circle cx="753" cy="226" r="35" fill="#bde9ff" stroke="#31455f" stroke-width="10"/>`;
    case "starhorn": return `<path d="M633 401q-69-115 20-157" fill="none" stroke="#e9dcff" stroke-width="36" stroke-linecap="round"/><path d="M844 397q72-100 122-24" fill="none" stroke="#e9dcff" stroke-width="34" stroke-linecap="round"/>${star(653,238,53)}${star(959,364,43)}`;
    case "crown": return `<path d="M627 372l6-134 76 69 58-118 61 118 83-73-11 145z" fill="url(#accent)" stroke="#765016" stroke-width="13" stroke-linejoin="round"/><circle cx="767" cy="278" r="17" fill="#ff6464"/>`;
    case "rainbow": return `<path d="M597 639q132 74 288 6" fill="none" stroke="url(#rainbow)" stroke-width="55" stroke-linecap="round"/><path d="M649 399q-58-106 17-151m174 153q65-104 120-27" fill="none" stroke="#fff0a2" stroke-width="31" stroke-linecap="round"/>${star(951,361,30,"#fff487")}`;
    case "legendary": return `<path d="M634 394q-69-120 22-163m188 169q76-113 125-27" fill="none" stroke="#dbe7f4" stroke-width="39" stroke-linecap="round"/><path d="M660 322l8-111 67 52 52-92 50 96 72-58-13 125z" fill="url(#accent)" stroke="#4d5968" stroke-width="12"/>${star(788,215,27,"#ffffff")}`;
    case "truffle": return `<g transform="translate(145 570)"><ellipse cx="83" cy="64" rx="80" ry="61" fill="#5a3424" stroke="#2f1b14" stroke-width="13"/><circle cx="53" cy="45" r="14" fill="#94705a"/><circle cx="103" cy="74" r="11" fill="#94705a"/><path d="M62 8q7-63 61-79" fill="none" stroke="#477b37" stroke-width="18" stroke-linecap="round"/><path d="M112-66q59-29 78 17-44 39-91 12z" fill="#74ad56" stroke="#396c31" stroke-width="10"/></g>`;
    case "bell": return `<path d="M669 640q88 36 177 0" fill="none" stroke="#efd558" stroke-width="36" stroke-linecap="round"/><path d="M731 652q7-82 66-83 62 2 68 84l25 38H706z" fill="url(#accent)" stroke="#66717c" stroke-width="12"/><circle cx="798" cy="699" r="21" fill="#707b87"/>`;
    case "emerald": return `<path d="M697 221l105-50 94 67-37 137-129 9-67-114z" fill="url(#accent)" stroke="#15573b" stroke-width="13"/><path d="M697 221l98 52 101-35m-101 35-65 111m65-111 64 102" fill="none" stroke="#d8ffeb" stroke-width="9" opacity=".8"/>`;
    case "obsidian": return `<path d="M614 394q30-160 155-174 116 18 130 176z" fill="url(#accent2)" stroke="#17151a" stroke-width="15"/><path d="M624 357l74-78 56 57 60-87 72 114" fill="none" stroke="#bca766" stroke-width="13"/><path d="M205 589l68-121 82 39-36 143z" fill="#211e24" stroke="#cdb66d" stroke-width="12"/>`;
    case "aurora": return `<path d="M595 643q138 78 288 0" fill="none" stroke="url(#aurora)" stroke-width="59" stroke-linecap="round"/><path d="M640 259q58-83 112 2t107 0" fill="none" stroke="#d8ffff" stroke-width="24" stroke-linecap="round" opacity=".9"/>${star(890,271,29,"#eaffff")}`;
    case "diamond": return `<path d="M685 301l73-91 102 11 69 91-121 125z" fill="url(#ice)" stroke="#5f9dcc" stroke-width="13"/><path d="M685 301h244m-171-91 50 227m52-216-52 216" fill="none" stroke="#ffffff" stroke-width="9" opacity=".85"/>`;
    case "coin": return `<circle cx="258" cy="550" r="104" fill="#e5ce55" stroke="#3c713a" stroke-width="16"/><circle cx="258" cy="550" r="75" fill="#f4e788" stroke="#6b922e" stroke-width="8"/><path d="M231 608q78-29 66-129-73 23-66 129zm3-46q41-20 67-68" fill="#2b7d4e" stroke="#155b36" stroke-width="8"/><path d="M229 497q-34 11-45 47" fill="none" stroke="#fff9b0" stroke-width="12" stroke-linecap="round"/>`;
    case "manager": return `<path d="M603 375q48-132 163-133 116 9 144 135z" fill="url(#accent2)" stroke="#1a392b" stroke-width="14"/><path d="M576 383q170 53 355-3" fill="none" stroke="url(#accent)" stroke-width="37" stroke-linecap="round"/><rect x="170" y="493" width="137" height="184" rx="15" fill="#f5e7b7" stroke="#214d38" stroke-width="14"/><path d="M203 540h72m-72 44h72m-72 44h52" stroke="#527462" stroke-width="11" stroke-linecap="round"/>`;
    case "shears": return `<g transform="translate(166 470) rotate(-17 105 100)"><circle cx="61" cy="57" r="47" fill="none" stroke="#b9cbd4" stroke-width="20"/><circle cx="149" cy="57" r="47" fill="none" stroke="#b9cbd4" stroke-width="20"/><path d="M93 91l104 172m-80-172L25 270" fill="none" stroke="#d79e20" stroke-width="28" stroke-linecap="round"/><circle cx="105" cy="91" r="18" fill="#6b4b1b"/></g>`;
    case "cloud": return `<g fill="#ffffff" stroke="#86b4d6" stroke-width="11"><circle cx="668" cy="298" r="69"/><circle cx="746" cy="257" r="87"/><circle cx="832" cy="304" r="72"/><rect x="636" y="301" width="239" height="75" rx="38"/></g><path d="M190 585q71-84 141 0t141 0" fill="none" stroke="#d8edff" stroke-width="42" stroke-linecap="round" opacity=".9"/>`;
    case "galaxy": return `<path d="M596 645q145 81 293-5" fill="none" stroke="url(#galaxy)" stroke-width="61" stroke-linecap="round"/>${star(685,283,31)}${star(873,316,26)}${star(315,416,23)}<path d="M226 422q153-111 280 3" fill="none" stroke="#8cc8ff" stroke-width="13" stroke-linecap="round"/><circle cx="365" cy="374" r="21" fill="#ff8bd8"/>`;
    case "royal": return `<path d="M619 366l9-135 79 67 59-116 62 116 82-70-11 145z" fill="url(#accent)" stroke="#6d4915" stroke-width="14"/><path d="M579 625q163 124 328 8l-41 155q-133 77-266-1z" fill="url(#accent2)" stroke="#5e1020" stroke-width="14"/><circle cx="766" cy="272" r="18" fill="#d92747"/>`;
    case "clock": return `<circle cx="246" cy="550" r="112" fill="#e7f1f3" stroke="#405861" stroke-width="18"/><circle cx="246" cy="550" r="84" fill="#fbffff" stroke="#91afb5" stroke-width="9"/><path d="M246 550v-54m0 54 53 32" stroke="#405861" stroke-width="15" stroke-linecap="round"/><circle cx="246" cy="550" r="13" fill="#405861"/><path d="M205 414h82" stroke="#405861" stroke-width="18" stroke-linecap="round"/>`;
    case "quantum": return `<g fill="none" stroke-linecap="round"><ellipse cx="744" cy="335" rx="178" ry="72" stroke="#77ffe9" stroke-width="18" transform="rotate(18 744 335)"/><ellipse cx="744" cy="335" rx="178" ry="72" stroke="#a68aff" stroke-width="18" transform="rotate(-51 744 335)"/><ellipse cx="744" cy="335" rx="178" ry="72" stroke="#5ca8ff" stroke-width="18" transform="rotate(75 744 335)"/></g><circle cx="744" cy="335" r="40" fill="#fff" stroke="#4c72c5" stroke-width="12"/>`;
    case "auckland": return `<path d="M602 381q31-144 157-151 128 9 145 148z" fill="url(#accent2)" stroke="#102219" stroke-width="15"/><path d="M590 389q168 48 334-5" fill="none" stroke="url(#accent)" stroke-width="38" stroke-linecap="round"/><path d="M678 263l17-80 60 53 51-84 51 83 61-50 12 91" fill="url(#accent)" stroke="#78551a" stroke-width="12"/><path d="M226 670q93-61 153-168-19 128-96 206m22-106q46-16 76 9m-101 33q-42-12-65 18" fill="none" stroke="#2d8054" stroke-width="17" stroke-linecap="round"/>`;
    case "southerncross": return `<path d="M601 643q143 82 289-4" fill="none" stroke="url(#accent2)" stroke-width="57" stroke-linecap="round"/>${star(706,213,34)}${star(822,284,27)}${star(732,367,24)}${star(892,404,20)}${star(638,322,16)}<path d="M706 213l116 71-90 83 160 37" fill="none" stroke="#fff6b0" stroke-width="8" stroke-dasharray="13 15" opacity=".7"/>`;
    case "myth": return `<path d="M623 392q-59-122 30-178 65 24 75 92m117 88q84-94 129-15" fill="none" stroke="#fff2bf" stroke-width="38" stroke-linecap="round"/><path d="M640 303l32-118 74 71 54-111 66 111 78-67 9 120" fill="url(#accent)" stroke="#74531b" stroke-width="13"/><path d="M206 690q103-64 164-194-12 140-102 231m46-122q53-20 88 7m-119 38q-48-11-75 22" fill="none" stroke="#2e7c4f" stroke-width="20" stroke-linecap="round"/><path d="M596 646q148 82 296-3" fill="none" stroke="url(#nzstripe)" stroke-width="55" stroke-linecap="round"/>`;
    default: return "";
  }
}

function renderSvg(item, index) {
  const [name, slug, colors, type] = item;
  const [furHi, furMid, furLow, faceHi, faceLow, accent, accent2] = colors;
  const id = String(index + 1).padStart(2, "0");
  const curls = [[218,375,82],[287,283,91],[390,236,93],[505,226,96],[610,270,88],[677,346,82],[211,493,88],[215,606,82],[301,686,88],[420,721,91],[542,700,88],[645,634,82]];
  const blinkDelay = `${(index * 0.17).toFixed(2)}s`;
  const stepDelay = `${(index % 2 ? 0.28 : 0).toFixed(2)}s`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" role="img" aria-labelledby="title-${id}">
  <title id="title-${id}">${name}</title>
  <defs>
    <linearGradient id="fur" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${furHi}"/><stop offset=".52" stop-color="${furMid}"/><stop offset="1" stop-color="${furLow}"/></linearGradient>
    <linearGradient id="face" x1=".2" y1="0" x2=".8" y2="1"><stop stop-color="${faceHi}"/><stop offset="1" stop-color="${faceLow}"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${accent}"/><stop offset="1" stop-color="${accent2}"/></linearGradient>
    <linearGradient id="accent2" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${accent2}"/><stop offset="1" stop-color="${accent}"/></linearGradient>
    <linearGradient id="rainbow"><stop stop-color="#ff6767"/><stop offset=".26" stop-color="#ffdc58"/><stop offset=".52" stop-color="#4dcf7b"/><stop offset=".76" stop-color="#5ba8ff"/><stop offset="1" stop-color="#cf76f4"/></linearGradient>
    <linearGradient id="aurora"><stop stop-color="#71f5e4"/><stop offset=".5" stop-color="#71bfff"/><stop offset="1" stop-color="#c181ff"/></linearGradient>
    <linearGradient id="galaxy"><stop stop-color="#151d4b"/><stop offset=".52" stop-color="#5441a8"/><stop offset="1" stop-color="#df65bc"/></linearGradient>
    <linearGradient id="ice" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".35" stop-color="#bcecff"/><stop offset=".7" stop-color="#8dbef7"/><stop offset="1" stop-color="#d7f8ff"/></linearGradient>
    <linearGradient id="nzstripe"><stop stop-color="#101820"/><stop offset=".45" stop-color="#101820"/><stop offset=".46" stop-color="#f6d35d"/><stop offset=".66" stop-color="#f6d35d"/><stop offset=".67" stop-color="#4eaa70"/></linearGradient>
    <radialGradient id="shine"><stop stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <filter id="shadow" x="-25%" y="-25%" width="150%" height="165%"><feDropShadow dx="0" dy="24" stdDeviation="18" flood-color="#243127" flood-opacity=".25"/></filter>
    <style>
      .sheep-body { transform-box: fill-box; transform-origin: 50% 100%; }
      .sheep-body { animation: bodyFloat 1.15s ease-in-out infinite; }
      .sheep-ear-left, .sheep-ear-right { transform-box: fill-box; transform-origin: 50% 100%; }
      .sheep-ear-left { animation: earLeft 2.8s ease-in-out infinite; }
      .sheep-ear-right { animation: earRight 3.1s ease-in-out infinite; }
      .leg-front-a, .leg-back-a { transform-box: fill-box; transform-origin: 50% 8%; animation: legFront .58s ease-in-out infinite; }
      .leg-front-b, .leg-back-b { transform-box: fill-box; transform-origin: 50% 8%; animation: legBack .58s ease-in-out infinite; animation-delay: ${stepDelay}; }
      .blink-line, .surprised-mouth { animation-delay: ${blinkDelay}; }
      @keyframes bodyFloat { 0%, 100% { transform: translateY(0); } 45% { transform: translateY(-4px); } 70% { transform: translateY(1px); } }
      @keyframes earLeft { 0%, 100% { transform: rotate(-7deg); } 48% { transform: rotate(3deg); } 56% { transform: rotate(-1deg); } }
      @keyframes earRight { 0%, 100% { transform: rotate(8deg); } 52% { transform: rotate(-4deg); } 60% { transform: rotate(1deg); } }
      @keyframes legFront { 0%, 100% { transform: rotate(7deg) translateY(0); } 45% { transform: rotate(-9deg) translateY(-4px); } 70% { transform: rotate(2deg) translateY(1px); } }
      @keyframes legBack { 0%, 100% { transform: rotate(-8deg) translateY(0); } 45% { transform: rotate(9deg) translateY(-4px); } 70% { transform: rotate(-2deg) translateY(1px); } }
    </style>
  </defs>
  <g filter="url(#shadow)">
    <ellipse cx="494" cy="829" rx="295" ry="48" fill="#243127" opacity=".16"/>
    <g stroke="#433632" stroke-width="14" stroke-linejoin="round">
      <g class="leg-front-a"><path d="M303 620v176q0 34 37 34t38-34V626" fill="url(#face)"/></g>
      <g class="leg-back-a"><path d="M526 638v168q0 34 37 34t38-34V638" fill="url(#face)"/></g>
      <g class="leg-front-b"><path d="M648 625v179q0 34 37 34t38-34V617" fill="url(#face)"/></g>
      <g class="leg-back-b"><path d="M758 600v205q0 34 38 34t38-34V586" fill="url(#face)"/></g>
    </g>
    <g fill="#342b2b"><rect x="295" y="804" width="93" height="39" rx="19"/><rect x="518" y="809" width="92" height="39" rx="19"/><rect x="641" y="808" width="92" height="39" rx="19"/><rect x="755" y="807" width="93" height="39" rx="19"/></g>
    <g class="sheep-body">
      <circle cx="171" cy="510" r="76" fill="url(#fur)" stroke="#665049" stroke-width="14"/>
      <ellipse cx="448" cy="505" rx="290" ry="244" fill="url(#fur)" stroke="#665049" stroke-width="16"/>
      <g fill="url(#fur)" stroke="#665049" stroke-width="14">${curls.map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>
      <ellipse cx="425" cy="432" rx="183" ry="145" fill="url(#shine)" opacity=".55"/>
      <path class="sheep-ear-left" d="M629 418q-77-75-124 6 31 79 121 67z" fill="${faceHi}" stroke="#654743" stroke-width="14"/>
      <path class="sheep-ear-right" d="M846 425q78-68 119 16-36 72-116 55z" fill="${faceHi}" stroke="#654743" stroke-width="14"/>
      <rect x="592" y="328" width="310" height="346" rx="151" fill="url(#face)" stroke="#654743" stroke-width="16"/>
      <ellipse cx="677" cy="467" rx="41" ry="51" fill="#fff"/><ellipse cx="817" cy="467" rx="41" ry="51" fill="#fff"/>
      <ellipse cx="683" cy="477" rx="20" ry="27" fill="#21191b"><animate attributeName="cx" values="683;690;683;677;683" dur="3.7s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="823" cy="477" rx="20" ry="27" fill="#21191b"><animate attributeName="cx" values="823;830;823;817;823" dur="3.7s" repeatCount="indefinite"/></ellipse>
      <circle cx="689" cy="468" r="7" fill="#fff"/><circle cx="829" cy="468" r="7" fill="#fff"/>
      <path class="blink-line" d="M641 477q36 24 72 0M781 477q36 24 72 0" fill="none" stroke="${faceLow}" stroke-width="14" stroke-linecap="round" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.39;.43;.48;.53;1" dur="4.9s" repeatCount="indefinite"/>
      </path>
      <ellipse cx="750" cy="563" rx="38" ry="27" fill="#8b4f56" opacity=".7"/>
      <path d="M750 590q-3 35-46 40m46-40q3 35 46 40" fill="none" stroke="#69383d" stroke-width="11" stroke-linecap="round" opacity=".88">
        <animate attributeName="opacity" values=".88;.88;0;0;.88;.88" keyTimes="0;.39;.43;.48;.53;1" dur="5.9s" repeatCount="indefinite"/>
      </path>
      <ellipse class="surprised-mouth" cx="750" cy="604" rx="25" ry="32" fill="#69383d" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.39;.43;.48;.53;1" dur="5.9s" repeatCount="indefinite"/>
      </ellipse>
      <path d="M706 555q-30 28-56 0M794 555q30 28 56 0" fill="none" stroke="#ff9eaa" stroke-width="14" stroke-linecap="round" opacity=".58"/>
      ${accessory(type)}
    </g>
  </g>
</svg>\n`;
}

await mkdir(outputDir, { recursive: true });
const manifest = [];
for (let i = 0; i < sheep.length; i += 1) {
  const [name, slug] = sheep[i];
  const level = i + 1;
  const file = `${String(level).padStart(2, "0")}-${slug}.svg`;
  await writeFile(resolve(outputDir, file), renderSvg(sheep[i], i), "utf8");
  manifest.push({ level, name, file: `assets/sheep/web/${file}` });
}
await writeFile(resolve(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Generated ${sheep.length} sheep SVG assets in ${outputDir}`);
