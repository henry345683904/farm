# 开心养羊场

一个竖屏单页网页小游戏。玩家初始拥有 100 金币，可以购买羊、拖动同等级羊合成更高等级，羊会在牧场里自由走动并自动产出收益。

## 玩法

- 初始金币：100
- 快速购买会在已解锁等级中，自动购买当前金币买得起的最高等级羊
- 如果牧场里已有羊，快速购买会优先购买场上已有的最低等级羊，方便低级羊继续合成
- Lv.1-Lv.10 的购买价格固定为 `等级 x 50` 金币，例如 Lv.1 是 50 金币，Lv.2 是 100 金币
- Lv.11 开始，同等级羊每次购买价格会逐步增加
- 最高等级：Lv.25
- Lv.1 到 Lv.14 的羊自动产出金币
- Lv.15 开始不再产出金币，只产出 NZD
- Lv.15 羊每秒产出 `NZ$0.000000001`，更高等级按 3 倍递增
- Lv.1-Lv.10 是正常难度，需要 2 只同级羊升级；Lv.11 之后逐段增加需求
- 看广告可以获得 5 分钟双倍产出；没有广告时会直接发放 5 分钟加速
- 自动合成需要看广告解锁 5 分钟；没有广告时会直接解锁 5 分钟
- 兑换码入口可输入 `gogoshop` 领取 `99999999` 金币，输入 `gogoshop2026` 领取 1 只 Lv.15 羊
- 无限兑换码 `henry666` 可重复使用，输入后开启无限金币、免广告领奖励，并让 NZD 产出提升到 10000 倍
- 拖动羊到右下角回收桶可以卖掉并换回一部分金币
- 设置弹窗可以调整音乐、音效、振动，也可以清除本地数据重新开始
- 右上角可以切换中文 / English
- 加速期间金币速度会显示红色的额外加成，例如 `+120/秒 (加速+120)`
- NZD 余额旁边可以提现，兑换 GO GO SHOP 代金券并生成兑换码
- 提现弹窗里点击代金券码会自动复制，底部按钮可跳转到 `gogoshop.nz` 使用
- 任务、图鉴、兑换码、登录存档通过按钮弹窗打开
- 未配置 Supabase 时，游戏会使用浏览器 localStorage 本地存档

## 羊角色素材

- 25 只羊使用独立的 `1024 x 1024` 透明 SVG，位于 `assets/sheep/web/`
- 文件名按等级编号，`manifest.json` 保存等级、中文名称和资源路径的对应关系
- SVG 可直接用于网页，也可以无损放大后导出 PNG
- 修改 `tools/generate-sheep-art.mjs` 后，可运行下面的命令重新生成整套素材：

```bash
node tools/generate-sheep-art.mjs
```

## Supabase 云存档

项目已经改为使用 Supabase Auth 和 Supabase Database。要启用 Google 登录、邮箱登录和永久云存档：

1. 在 Supabase 创建项目。
2. 在 Authentication 里启用 Email 登录；如需 Google 登录，在 Providers 里启用 Google。
3. 在 Authentication 的 URL Configuration 里，把 `https://henry345683904.github.io/farm/` 加入 Site URL 或 Redirect URLs。
4. 在 SQL Editor 先执行存档表 SQL，再执行代金券表 SQL。仓库里的 `supabase-shop-vouchers.sql` 已经包含完整建表、RLS 和状态更新时间触发器。代金券表会把本游戏生成的券统一标记为 `happy_sheep_farm` / `开心羊圈`，后台可以按这个字段单独筛选。
5. 把 Supabase Project URL 和 anon public key 填入 `supabase-config.js`。

```sql
create table if not exists public.farm_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.farm_saves enable row level security;

drop policy if exists "Users can read own farm save" on public.farm_saves;
create policy "Users can read own farm save"
on public.farm_saves
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own farm save" on public.farm_saves;
create policy "Users can insert own farm save"
on public.farm_saves
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own farm save" on public.farm_saves;
create policy "Users can update own farm save"
on public.farm_saves
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

```sql
create extension if not exists pgcrypto;

create table if not exists public.shop_vouchers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null unique,
  label text not null,
  value numeric not null check (value >= 0),
  currency text not null default 'NZD',
  source_key text not null default 'happy_sheep_farm',
  source_label text not null default '开心羊圈',
  campaign text not null default 'GO GO SHOP',
  status text not null default 'pending_redeem' check (status in ('pending_redeem', 'pending_use', 'used')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  redeemed_at timestamptz,
  used_at timestamptz
);

alter table public.shop_vouchers enable row level security;
create index if not exists shop_vouchers_user_source_status_idx
on public.shop_vouchers (user_id, source_key, status, created_at desc);

drop policy if exists "Users can read own shop vouchers" on public.shop_vouchers;
create policy "Users can read own shop vouchers"
on public.shop_vouchers
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own shop vouchers" on public.shop_vouchers;
create policy "Users can insert own shop vouchers"
on public.shop_vouchers
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own shop vouchers" on public.shop_vouchers;
create policy "Users can update own shop vouchers"
on public.shop_vouchers
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## 本地打开

建议启动静态服务器：

```bash
python -m http.server 4177
```

然后打开 `http://127.0.0.1:4177/`。
