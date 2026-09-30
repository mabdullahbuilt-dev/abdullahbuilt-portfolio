# Case-study evidence map

Recorded 2026-09-30. This page lists the evidence behind each case study, as verified from the project repositories during the browser audit. Case studies must not state anything beyond these lists; tests in `tests/http-seo.spec.ts` guard the key qualifiers.

| Project | Live URL | Source | Role | Attribution | Environment | Must not claim |
|---|---|---|---|---|---|---|
| RESOLVE | https://www.useresolve.stream | velz-cmd/Things-to-do | Full-stack engineer | — | Arc Testnet; live on-chain payouts disabled by feature flag | Mainnet; running payouts; Cloudflare AI Gateway in production; users, volume, revenue |
| MERIDIAN | https://meridianarc.stream | velz-cmd/Meridian | Full-stack engineer | "Co-built — Muhammad Abdullah served as full-stack engineer, with work including the Gate strategy desk and BSC testnet execution." | BSC Testnet execution; Arc Testnet anchoring; BNB Hackathon Track 2 | Sole authorship; "AI trading agent"; accuracy, returns, win rate; mainnet; audit |
| RepoDiet | https://repodiet.uk | smokychain22/agentPass | Full-stack engineer | — | Public JS/TS repositories; x402 Quick Triage on X Layer; OKX.AI Genesis Hackathon | Independent verification infrastructure; demo results as usage; customers, revenue, accuracy; audit; private repos; auto-merge |
| Agora Forge | https://circle-arc-net.vercel.app/ | Ibrahimmovic/Circle-Arc-Net | Full-stack engineer | Neutral | Arc Testnet and four Sepolia testnets; Agora Agent Hackathon | AI/LLM agent; unsigned autonomous transactions; end-to-end CCTP or LI.FI tracking; Covalent as healthy; usage, TVL, returns; audit; sole authorship |

## Lighthouse note (2026-09-30)
- **What Lighthouse reports:** on `/services/ai-application-development/` and `/work/agora-forge/`, the simulated mobile LCP is 4.5–4.7 s.
- **What was observed:** Lighthouse's own observed LCP is 1.2 s, the same as FCP. A Playwright run with 4× CPU throttling measured LCP at 976 ms (the H1), with no console errors.
- **Why they differ:** the simulated figure comes from Lantern modelling the text paint as dependent on the Next.js script chunks. The browser does not wait for them.
- **Decision:** no code change.
