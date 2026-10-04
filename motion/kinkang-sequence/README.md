# Kinkang in Motion

A 20-second motion graphics sequence that explains Kinkang: a skewed Kafka cluster gets rebalanced, scaled out and healed by the Kinkang Engine, then resolves into the logo.

- `index.html` is the source. Open it in a browser to play it live; it has a scrubber and play/pause, and the space bar toggles playback.
- `kinkang-sequence.mp4` is the render: 1920×1080, 30 fps, H.264.
- `render.mjs` renders the page frame by frame into the MP4.

## Storyboard

| Time | Beat | On screen |
| --- | --- | --- |
| 0.0–3.2 | **Your Kafka cluster.** | Letterbox opens. Messages stream through the frame as light streaks, with a live events/sec counter. |
| 2.0–4.0 | Shape transition | The streaks fold into partition blocks and stack onto five broker plates. |
| 3.6–7.2 | **Hot brokers. Skewed partitions. 3 a.m. pages.** | Broker 03 holds 104 of 240 partitions and heats from amber to red. A tag tracks its CPU, disk and network load. The three lines get struck through. |
| 6.1–7.6 | Engine arrives | The Kinkang Engine (the logo as 3D rings and bars) drops in. A ring wipe and a floor ripple mark the landing. |
| 7.5–10.1 | **Kinkang rebalances.** | Beams link the engine to every broker. 56 partitions arc off the hot tower, executing proposal #4182. |
| 10.1–12.1 | **Scales out.** | Brokers 06 and 07 rise from the floor and the cluster rebalances onto 7 brokers. The headline's tracking opens up as it scales. |
| 12.3–14.2 | **Heals itself.** | Broker 04 fails, flickers red and sinks. Its 34 replicas move to the 6 brokers that are left. |
| 14.2–16.9 | **Fully managed.** | Crane up over the healthy cluster. Chips: AWS MSK, Self-managed Kafka, PrivateLink, Grafana dashboards, REST API, 24/7 ops. |
| 15.2–18.4 | Logo morph | Every partition flies into place on the engine's rings and bars. The engine turns to face the camera and the partitions are absorbed in a flash. |
| 17.9–20.0 | End card | Kinkang. *Your Kafka cluster. Properly managed.* kinkang.cloud. The letterbox closes so the clip loops cleanly. |

The partition moves are computed rather than keyframed. Each rebalance pops partitions off the overloaded brokers and assigns them to the underloaded ones, the same way a Cruise Control proposal would. That's why the counts on screen (104 on broker 03, 56 moves, 34 replicas re-replicated) match what the blocks actually do.

## Rendering

```bash
cd motion/kinkang-sequence
npm install
npm run render            # -> kinkang-sequence.mp4
npm run preview           # -> stills/ at key moments for quick review
node render.mjs --width 3840 --height 2160 --out kinkang-4k.mp4
```

The renderer needs `ffmpeg` on the PATH and uses Playwright's Chromium with SwiftShader, so it works without a GPU. Three.js and the fonts (Inter, JetBrains Mono) are served from `node_modules` during a render. Output is the same on every run because every frame is drawn by `window.__kk.seek(t)` and nothing depends on wall-clock time.

## Using it on the site

The MP4 can go into `apps/landing/public/` and play as a muted, looping hero video:

```tsx
<video src="/kinkang-sequence.mp4" autoPlay muted loop playsInline />
```
