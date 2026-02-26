# JC Workspace — Claude Code Instructions

## Regole Base
- Lingua: **Italiano**
- Autonomia: NON chiedere conferme, procedi direttamente
- Dubai: MAI menzionare Dubai nella comunicazione pubblica (solo sede aziendale)
- NON consulenza finanziaria su MasoLab/LinearityFX

## Progetti e Percorsi Locali
| Progetto | Path | Deploy |
|----------|------|--------|
| 362gradi | `C:\Users\motok\Desktop\JC\362gradi` | — |
| Symplo | `C:\Users\motok\Desktop\JC\symplo` (cartella da rinominare da `easyai`) | symplo.vercel.app |
| LinearityFX | `C:\Users\motok\Desktop\JC\LinearityFX` | linearityfxnew.vercel.app |
| MasoLab | `C:\Users\motok\Desktop\JC\MasoLab` | defimaso.ae |
| MerryProject | `C:\Users\motok\Desktop\JC\MerryProject` | merryproject.ae |
| Smarti Diet | `C:\Users\motok\Desktop\JC\smarti-diet` | — |

## Stack Comune
- React 18 + Vite + TS + Tailwind + shadcn/ui
- Supabase: ppbbqchycxffsfavtsjp (prefisso per tabelle: eezy_, smarti_)
- Deploy: Vercel (auto-deploy da GitHub main)

## Workflow Deploy
```
git add . && git commit -m "msg" && git push
# Vercel auto-deploys. Per forzare: vercel --prod
```

## Memoria Persistente
- Directory: `C:\Users\motok\.claude\projects\C--Users-motok-Desktop-JC\memory\`
- MEMORY.md — indice principale
- symplo.md, masolab.md — dettagli progetto
- sessions.md — ultime sessioni (archive → sessions-archive.md)
