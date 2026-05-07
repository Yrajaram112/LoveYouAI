# 💌 LoveYouAI — A Love Letter Built Into a Link

> Make her feel like the entire universe was built just for her. Or make her forgive you. Either way.

## ✨ Features

| Mode | Route | Description |
|------|-------|-------------|
| 💌 Love Letter | `/open/[id]` | Cinematic cosmic love letter — stars, envelope, typewriter, photo polaroid, days counter, song |
| 💋 She's Mad | `/sorry/[id]` | Pink apology page — the "No" button literally runs away. She cannot resist. |
| 🛠 Creator | `/create` | Build either experience, get a shareable link |

## 🚀 Setup (5 minutes)

### 1. Create a Sanity project (free)
```
npx sanity@latest init --project LOVEYOUAI --dataset production
```
Or go to https://sanity.io → New Project → copy your **Project ID**

### 2. Create a write token
Sanity Dashboard → Your Project → API → Tokens → **Add API Token** → Editor

### 3. Add environment variables
```bash
cp .env.example .env.local
# Fill in your Project ID and token
```

### 4. Run it
```bash
npm install
npm run dev
```

### 5. Deploy to Vercel (free)
```bash
npx vercel
# Add env vars in Vercel dashboard
```

## 🏗 Architecture

- **Next.js 14** App Router
- **Framer Motion** — all animations
- **Sanity.io** — stores love stories + sorry stories + forgiven status
- **No login required** — boyfriend creates link, girlfriend opens it, done
- **Photo CDN** — photos uploaded to Sanity CDN, full quality on any device

## 💡 How the "No" button works

- Flees on hover/touch before she can click it
- Shrinks and rotates more with each escape attempt  
- Disappears entirely after 6 attempts
- YES button grows bigger with each failed No attempt
- When she forgives → confetti, kiss emojis, her choice saves to Sanity
- He can check Sanity dashboard to see she forgave him 💗
