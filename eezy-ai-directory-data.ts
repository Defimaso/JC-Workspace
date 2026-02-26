// ============================================================
// EEZY AI - Directory Completa Tool AI per Non-Tecnici
// Generato: Febbraio 2026
// ============================================================

// --- TIPI ---

export type Costo = "Gratis" | "Freemium" | "A pagamento";
export type Difficolta = "Principiante" | "Intermedio" | "Avanzato";
export type FasciaUtente = "Tutti" | "Creator" | "Business" | "Developer";
export type Categoria =
  | "scrittura"
  | "immagini"
  | "video"
  | "codice"
  | "produttivita"
  | "marketing"
  | "ecommerce"
  | "audio"
  | "design"
  | "automazione";

export interface Tool {
  nome: string;
  slug: string;
  tagline: string;
  descrizione: string;
  categoria: Categoria;
  costo: Costo;
  dettaglioPrezzo: string;
  difficolta: Difficolta;
  fasciaUtente: FasciaUtente;
  rating: number;
  supportoItaliano: boolean;
  website: string;
  sinergie: string[];
  features: string[];
  casiUso: string[];
  pro: string[];
  contro: string[];
}

export interface StackTier {
  nome: string;
  budget: string;
  tools: {
    slug: string;
    ruolo: string;
    nota: string;
  }[];
}

export interface QuizStack {
  risultato: string;
  slug: string;
  descrizione: string;
  gratuito: StackTier;
  medio: StackTier;
  pro: StackTier;
}

// ============================================================
// NUOVI TOOL PER CATEGORIA (3-5 per categoria, non presenti nella lista esistente)
// ============================================================

export const nuoviTools: Tool[] = [
  // ============================================================
  // SCRITTURA (text generation, copywriting)
  // ============================================================
  {
    nome: "Writesonic",
    slug: "writesonic",
    tagline: "Crea contenuti di marketing e articoli SEO con un click",
    descrizione:
      "Writesonic e' un tool AI per generare articoli blog, landing page, copy pubblicitario e contenuti social. Integra la ricerca web in tempo reale per contenuti sempre aggiornati. Perfetto per freelancer, marketer e piccole imprese che vogliono scalare la produzione di contenuti.",
    categoria: "scrittura",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito limitato, Business da $16/mese",
    difficolta: "Principiante",
    fasciaUtente: "Business",
    rating: 4.3,
    supportoItaliano: true,
    website: "https://writesonic.com",
    sinergie: ["surfer-seo", "grammarly", "canva", "zapier"],
    features: [
      "Generazione articoli SEO con ricerca web integrata",
      "Template per landing page e annunci",
      "AI Chat con accesso a dati in tempo reale",
      "Brand Voice personalizzabile",
      "Integrazione WordPress diretta",
    ],
    casiUso: [
      "Scrivere articoli blog ottimizzati SEO in 5 minuti",
      "Creare copy per annunci Facebook e Google Ads",
      "Generare descrizioni prodotto per e-commerce",
      "Riscrivere e parafrasare contenuti esistenti",
    ],
    pro: [
      "Ricerca web integrata per contenuti aggiornati",
      "Oltre 100 template pronti all'uso",
      "Output in oltre 25 lingue incluso italiano",
      "Piano gratuito per iniziare",
    ],
    contro: [
      "Piano gratuito molto limitato (10.000 parole)",
      "La qualita' varia in base al template usato",
      "Interfaccia un po' caotica con troppe opzioni",
    ],
  },
  {
    nome: "Copy.ai",
    slug: "copy-ai",
    tagline: "Copywriting AI per team di marketing e vendite",
    descrizione:
      "Copy.ai e' specializzato nella creazione di copy di marketing, email di vendita e contenuti social. La piattaforma offre workflow automatizzati che trasformano un brief in contenuti pronti alla pubblicazione. Include funzionalita' di team collaboration e brand voice.",
    categoria: "scrittura",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (2000 parole/mese), Pro da $36/mese",
    difficolta: "Principiante",
    fasciaUtente: "Business",
    rating: 4.2,
    supportoItaliano: true,
    website: "https://www.copy.ai",
    sinergie: ["zapier", "brevo", "grammarly", "surfer-seo"],
    features: [
      "Workflow automatizzati per contenuti marketing",
      "Chat AI con accesso a dati aziendali",
      "Oltre 90 template di copywriting",
      "Brand Voice e tono personalizzabile",
      "Collaborazione team con ruoli e permessi",
    ],
    casiUso: [
      "Creare sequenze email di vendita automatiche",
      "Generare post social per una settimana intera",
      "Scrivere copy per landing page ad alta conversione",
    ],
    pro: [
      "Eccellente per copy brevi e ad alta conversione",
      "Workflow che automatizzano processi ripetitivi",
      "Interfaccia intuitiva e facile da usare",
      "Piano gratuito senza carta di credito",
    ],
    contro: [
      "Piano gratuito molto limitato",
      "Meno efficace per contenuti lunghi come articoli blog",
      "Prezzo Pro alto rispetto ai concorrenti",
    ],
  },
  {
    nome: "Rytr",
    slug: "rytr",
    tagline: "Assistente di scrittura AI economico e versatile",
    descrizione:
      "Rytr e' uno dei tool di scrittura AI piu' accessibili sul mercato. Genera contenuti in oltre 30 lingue con piu' di 40 casi d'uso predefiniti. Ideale per chi vuole iniziare con la scrittura AI senza investire troppo.",
    categoria: "scrittura",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (10.000 caratteri/mese), Unlimited $9/mese",
    difficolta: "Principiante",
    fasciaUtente: "Tutti",
    rating: 4.1,
    supportoItaliano: true,
    website: "https://rytr.me",
    sinergie: ["grammarly", "canva", "surfer-seo"],
    features: [
      "Oltre 40 casi d'uso predefiniti",
      "Supporto 30+ lingue",
      "Controllo plagio integrato",
      "Estensione browser Chrome",
      "Toni di voce personalizzabili",
    ],
    casiUso: [
      "Scrivere bio professionali per social media",
      "Generare idee per contenuti e titoli",
      "Creare descrizioni prodotto rapidamente",
    ],
    pro: [
      "Prezzo molto competitivo ($9/mese unlimited)",
      "Interfaccia semplicissima",
      "Piano gratuito generoso per provare",
    ],
    contro: [
      "Qualita' output inferiore a ChatGPT e Jasper",
      "Poche funzionalita' avanzate",
      "Non ideale per contenuti lunghi e complessi",
    ],
  },
  {
    nome: "Anyword",
    slug: "anyword",
    tagline: "Copy AI con punteggio predittivo di performance",
    descrizione:
      "Anyword si distingue per il suo Predictive Performance Score che valuta l'efficacia del copy prima della pubblicazione. Analizza i dati storici per prevedere quale variante di testo performera' meglio. Perfetto per team marketing data-driven.",
    categoria: "scrittura",
    costo: "A pagamento",
    dettaglioPrezzo: "Starter da $39/mese, Data-Driven da $79/mese",
    difficolta: "Intermedio",
    fasciaUtente: "Business",
    rating: 4.4,
    supportoItaliano: false,
    website: "https://anyword.com",
    sinergie: ["surfer-seo", "brevo", "zapier", "grammarly"],
    features: [
      "Predictive Performance Score per ogni copy",
      "A/B testing automatico dei contenuti",
      "Integrazione con Google Ads e Meta Ads",
      "Brand Voice con apprendimento continuo",
      "Analytics predittiva delle conversioni",
    ],
    casiUso: [
      "Ottimizzare copy ads per massimizzare CTR",
      "Testare varianti email prima dell'invio",
      "Creare landing page con copy ad alta conversione",
      "Analizzare performance storiche dei contenuti",
    ],
    pro: [
      "Score predittivo unico nel mercato",
      "Ottimo per team marketing orientati ai dati",
      "Integrazione diretta con piattaforme ads",
      "Qualita' copy superiore alla media",
    ],
    contro: [
      "Prezzo elevato per singoli utenti",
      "Supporto italiano limitato",
      "Curva di apprendimento per le funzionalita' predittive",
    ],
  },

  // ============================================================
  // IMMAGINI (image generation, editing)
  // ============================================================
  {
    nome: "Ideogram",
    slug: "ideogram",
    tagline: "Genera immagini AI con testo perfettamente leggibile",
    descrizione:
      "Ideogram e' il tool AI che ha risolto il problema storico del testo nelle immagini generate. Produce grafiche, poster e loghi con scritte perfettamente leggibili. Versione 2.0 con qualita' fotorealistica impressionante e stili artistici avanzati.",
    categoria: "immagini",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (10 immagini/giorno), Plus $8/mese, Pro $20/mese",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.5,
    supportoItaliano: false,
    website: "https://ideogram.ai",
    sinergie: ["canva", "gamma", "capcut"],
    features: [
      "Testo nelle immagini perfettamente leggibile",
      "Stile fotorealistico e artistico",
      "Editing e remix di immagini esistenti",
      "Prompt in linguaggio naturale",
      "Download alta risoluzione",
    ],
    casiUso: [
      "Creare poster e grafiche con testo per social media",
      "Generare loghi e brand identity",
      "Produrre thumbnail per YouTube con titoli",
      "Creare mockup prodotto con etichette",
    ],
    pro: [
      "Miglior AI per testo nelle immagini",
      "Piano gratuito generoso",
      "Qualita' immagini molto alta",
      "Interfaccia intuitiva",
    ],
    contro: [
      "Meno personalizzazione di Midjourney",
      "Community piu' piccola",
      "Supporto solo in inglese",
    ],
  },
  {
    nome: "DALL-E 3",
    slug: "dall-e-3",
    tagline: "Il generatore di immagini AI integrato in ChatGPT",
    descrizione:
      "DALL-E 3 di OpenAI e' accessibile direttamente da ChatGPT, rendendo la generazione di immagini semplice come una conversazione. Eccelle nella comprensione di prompt complessi e nella coerenza visiva. La versione 2025-2026 ha migliorato drasticamente la qualita' fotografica.",
    categoria: "immagini",
    costo: "Freemium",
    dettaglioPrezzo: "Incluso in ChatGPT Plus ($20/mese), API a consumo",
    difficolta: "Principiante",
    fasciaUtente: "Tutti",
    rating: 4.4,
    supportoItaliano: true,
    website: "https://openai.com/dall-e-3",
    sinergie: ["chatgpt", "canva", "zapier"],
    features: [
      "Integrazione nativa in ChatGPT",
      "Comprensione prompt in linguaggio naturale",
      "Editing conversazionale delle immagini",
      "Stili multipli (fotorealistico, illustrazione, 3D)",
      "Generazione testo nelle immagini",
    ],
    casiUso: [
      "Creare illustrazioni per blog e articoli",
      "Generare immagini per social media",
      "Produrre concept art e mood board",
    ],
    pro: [
      "Semplicissimo da usare via ChatGPT",
      "Eccellente comprensione dei prompt complessi",
      "Nessun tool separato da imparare",
      "Editing iterativo via chat",
    ],
    contro: [
      "Richiede abbonamento ChatGPT Plus",
      "Meno controllo stilistico di Midjourney",
      "Limiti di generazione giornalieri",
    ],
  },
  {
    nome: "Flux (by Black Forest Labs)",
    slug: "flux",
    tagline: "Modello open-source per immagini AI di altissima qualita'",
    descrizione:
      "Flux e' il modello di generazione immagini di Black Forest Labs (fondatori di Stable Diffusion). Disponibile in versione Pro su varie piattaforme, offre qualita' paragonabile a Midjourney con maggiore accessibilita'. Flux 1.1 Pro e' considerato tra i migliori modelli del 2025-2026.",
    categoria: "immagini",
    costo: "Freemium",
    dettaglioPrezzo:
      "Versione base gratuita su piattaforme terze, Pro da $0.04/immagine via API",
    difficolta: "Intermedio",
    fasciaUtente: "Creator",
    rating: 4.6,
    supportoItaliano: false,
    website: "https://blackforestlabs.ai",
    sinergie: ["leonardo-ai", "canva", "comfyui"],
    features: [
      "Qualita' fotorealistica di livello top",
      "Modello open-source disponibile localmente",
      "Supporto ControlNet e LoRA",
      "Generazione velocissima",
      "Varianti: Schnell (veloce), Dev, Pro",
    ],
    casiUso: [
      "Creare immagini fotorealistiche per brand",
      "Generare asset grafici per siti web",
      "Produrre immagini stock personalizzate",
      "Prototipazione visiva di prodotti",
    ],
    pro: [
      "Qualita' tra le migliori in assoluto",
      "Modello open-source (versione base)",
      "Velocita' di generazione eccellente",
      "Costo per immagine molto basso",
    ],
    contro: [
      "Richiede piattaforma terza per usarlo facilmente",
      "Documentazione tecnica in inglese",
      "Curva di apprendimento per le versioni locali",
    ],
  },
  {
    nome: "Krea AI",
    slug: "krea-ai",
    tagline: "Genera e modifica immagini AI in tempo reale",
    descrizione:
      "Krea AI offre una esperienza unica di generazione immagini in tempo reale: vedi l'immagine formarsi mentre modifichi il prompt. Include upscaling AI, rimozione sfondo, e un canvas infinito per composizioni creative. Perfetto per designer e creator che vogliono iterare velocemente.",
    categoria: "immagini",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito limitato, Pro da $24/mese",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.3,
    supportoItaliano: false,
    website: "https://krea.ai",
    sinergie: ["canva", "leonardo-ai", "photoshop-ai-firefly"],
    features: [
      "Generazione immagini in tempo reale",
      "Upscaling e miglioramento qualita' AI",
      "Canvas infinito per composizioni",
      "Rimozione sfondo automatica",
      "Stile transfer e variazioni",
    ],
    casiUso: [
      "Iterare rapidamente su concept visivi",
      "Migliorare qualita' di immagini esistenti",
      "Creare composizioni grafiche complesse",
    ],
    pro: [
      "Preview in tempo reale unica nel settore",
      "Interfaccia moderna e intuitiva",
      "Upscaling di qualita' eccellente",
    ],
    contro: [
      "Piano gratuito molto limitato",
      "Meno modelli rispetto ai concorrenti",
      "Solo in inglese",
    ],
  },

  // ============================================================
  // VIDEO (video generation, editing)
  // ============================================================
  {
    nome: "Synthesia",
    slug: "synthesia",
    tagline: "Crea video con avatar AI parlanti senza telecamera",
    descrizione:
      "Synthesia permette di creare video professionali con avatar AI realistici che parlano in oltre 140 lingue. Basta scrivere lo script e l'avatar lo recita. Ideale per training aziendale, video marketing e contenuti educativi senza bisogno di attori o attrezzatura video.",
    categoria: "video",
    costo: "A pagamento",
    dettaglioPrezzo: "Starter $22/mese, Creator $67/mese, Enterprise custom",
    difficolta: "Principiante",
    fasciaUtente: "Business",
    rating: 4.5,
    supportoItaliano: true,
    website: "https://www.synthesia.io",
    sinergie: ["heygen", "elevenlabs", "canva", "gamma"],
    features: [
      "Oltre 230 avatar AI realistici",
      "Supporto 140+ lingue con lip-sync",
      "Avatar personalizzato dal tuo volto",
      "Template video professionali",
      "Collaborazione team e brand kit",
      "Integrazione con LMS e piattaforme e-learning",
    ],
    casiUso: [
      "Creare video di formazione aziendale scalabili",
      "Produrre video marketing multilingua",
      "Generare video tutorial per prodotti",
      "Creare presentazioni video per pitch e vendite",
    ],
    pro: [
      "Avatar estremamente realistici",
      "Supporto italiano eccellente con lip-sync",
      "Nessuna attrezzatura video necessaria",
      "Scalabilita' per grandi volumi di contenuti",
    ],
    contro: [
      "Prezzo elevato per creator individuali",
      "Avatar possono sembrare artificiali in certi contesti",
      "Personalizzazione limitata negli avatar standard",
    ],
  },
  {
    nome: "Kling AI",
    slug: "kling-ai",
    tagline: "Video AI di altissima qualita' da testo e immagini",
    descrizione:
      "Kling AI di Kuaishou e' tra i migliori generatori video AI del 2025-2026. Produce clip video fino a 2 minuti con qualita' cinematografica da semplici prompt testuali o immagini. Il modello Kling 1.6 compete direttamente con Sora di OpenAI.",
    categoria: "video",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (crediti giornalieri), Pro da $9.99/mese",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.5,
    supportoItaliano: false,
    website: "https://klingai.com",
    sinergie: ["runway", "capcut", "midjourney", "elevenlabs"],
    features: [
      "Generazione video da testo fino a 2 minuti",
      "Video da immagine con motion realistico",
      "Qualita' fino a 1080p",
      "Controllo movimento della camera",
      "Lip-sync per avatar virtuali",
    ],
    casiUso: [
      "Creare clip promozionali per social media",
      "Animare foto di prodotti per e-commerce",
      "Generare B-roll per video YouTube",
      "Creare contenuti virali per TikTok e Reels",
    ],
    pro: [
      "Qualita' video tra le migliori disponibili",
      "Piano gratuito per iniziare",
      "Velocita' di generazione buona",
      "Video lunghi fino a 2 minuti",
    ],
    contro: [
      "Interfaccia solo in inglese e cinese",
      "Risultati imprevedibili su soggetti complessi",
      "Richiede crediti anche nel piano gratuito",
    ],
  },
  {
    nome: "Luma Dream Machine",
    slug: "luma-dream-machine",
    tagline: "Trasforma le tue idee in video cinematografici con l'AI",
    descrizione:
      "Dream Machine di Luma AI genera video realistici da prompt testuali e immagini con una qualita' sorprendente. Specializzato in scene 3D e movimenti di camera cinematografici. Eccellente per creare contenuti visivi d'impatto senza competenze di videomaking.",
    categoria: "video",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (30 generazioni/mese), Standard $23.99/mese",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.3,
    supportoItaliano: false,
    website: "https://lumalabs.ai/dream-machine",
    sinergie: ["runway", "capcut", "midjourney", "krea-ai"],
    features: [
      "Generazione video da testo e immagini",
      "Scene 3D realistiche",
      "Movimenti camera cinematografici",
      "Keyframes per controllo animazione",
      "Estensione video esistenti",
    ],
    casiUso: [
      "Creare intro video professionali",
      "Generare scene impossibili per storytelling",
      "Animare concept art e illustrazioni",
    ],
    pro: [
      "Qualita' 3D e movimenti camera eccellenti",
      "Piano gratuito generoso (30 gen/mese)",
      "Interfaccia web semplice",
    ],
    contro: [
      "Video brevi (5-10 secondi max)",
      "Solo in inglese",
      "Tempi di generazione lunghi nelle ore di punta",
    ],
  },
  {
    nome: "Pika",
    slug: "pika",
    tagline: "Editor video AI creativo per effetti speciali incredibili",
    descrizione:
      "Pika si e' affermato come uno dei tool video AI piu' creativi. Oltre alla generazione da testo, offre effetti speciali AI unici: esplosioni, trasformazioni, cambi di stile in tempo reale. Versione 2.0 con qualita' video notevolmente migliorata.",
    categoria: "video",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito limitato, Standard $8/mese, Pro $28/mese",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.2,
    supportoItaliano: false,
    website: "https://pika.art",
    sinergie: ["capcut", "runway", "midjourney", "canva"],
    features: [
      "Effetti speciali AI (esplosioni, trasformazioni)",
      "Generazione video da testo e immagini",
      "Lip-sync automatico",
      "Modifica video esistenti con AI",
      "Stili artistici e filtri creativi",
    ],
    casiUso: [
      "Aggiungere effetti speciali a video esistenti",
      "Creare contenuti virali con effetti WOW",
      "Trasformare foto in video animati",
      "Produrre clip creative per social",
    ],
    pro: [
      "Effetti speciali unici nel mercato",
      "Prezzo accessibile ($8/mese)",
      "Molto divertente e creativo",
      "Community attiva",
    ],
    contro: [
      "Video brevi (fino a 10 secondi)",
      "Qualita' inferiore a Kling e Runway per video realistici",
      "Risultati inconsistenti",
    ],
  },

  // ============================================================
  // CODICE (coding assistants, no-code builders)
  // ============================================================
  {
    nome: "Bolt.new",
    slug: "bolt-new",
    tagline: "Costruisci app web complete direttamente nel browser",
    descrizione:
      "Bolt.new di StackBlitz permette di creare applicazioni web complete scrivendo in linguaggio naturale. L'AI genera il codice, lo esegue in un ambiente sandbox nel browser e lo deploya con un click. Supporta React, Next.js, Vue e molti altri framework.",
    categoria: "codice",
    costo: "Freemium",
    dettaglioPrezzo:
      "Piano gratuito (token limitati), Pro $20/mese, Teams $40/mese",
    difficolta: "Principiante",
    fasciaUtente: "Tutti",
    rating: 4.5,
    supportoItaliano: false,
    website: "https://bolt.new",
    sinergie: ["lovable", "v0", "cursor", "github-copilot"],
    features: [
      "Generazione app completa da prompt testuale",
      "Ambiente di sviluppo nel browser",
      "Deploy con un click su Netlify/Vercel",
      "Supporto multi-framework (React, Vue, Svelte)",
      "Preview live in tempo reale",
      "Installazione automatica dipendenze npm",
    ],
    casiUso: [
      "Creare un sito web completo in pochi minuti",
      "Prototipare un'app prima di investire in sviluppo",
      "Costruire tool interni per il proprio business",
      "Imparare a programmare con assistenza AI",
    ],
    pro: [
      "Tutto nel browser, nessun setup locale",
      "Risultati impressionanti da prompt semplici",
      "Deploy immediato",
      "Supporta framework moderni",
    ],
    contro: [
      "Token si esauriscono rapidamente",
      "Difficile debuggare errori complessi",
      "Meno controllo rispetto a Cursor",
    ],
  },
  {
    nome: "Replit",
    slug: "replit",
    tagline: "IDE cloud con AI che scrive e deploya codice per te",
    descrizione:
      "Replit e' una piattaforma di sviluppo cloud con un potente assistente AI integrato. Replit Agent puo' creare intere applicazioni partendo da una descrizione testuale, gestire database, e deployare automaticamente. Ideale per principianti e prototipi veloci.",
    categoria: "codice",
    costo: "Freemium",
    dettaglioPrezzo:
      "Piano gratuito (risorse base), Replit Core $25/mese con AI illimitata",
    difficolta: "Intermedio",
    fasciaUtente: "Tutti",
    rating: 4.3,
    supportoItaliano: false,
    website: "https://replit.com",
    sinergie: ["bolt-new", "lovable", "cursor", "zapier"],
    features: [
      "Replit Agent: crea app intere da descrizione",
      "IDE completo nel browser",
      "Hosting e deploy integrati",
      "Database e storage inclusi",
      "Collaborazione in tempo reale",
      "Supporto 50+ linguaggi di programmazione",
    ],
    casiUso: [
      "Creare un SaaS completo senza setup locale",
      "Sviluppare bot e automazioni",
      "Prototipare idee di business rapidamente",
      "Collaborare con un team su progetti code",
    ],
    pro: [
      "Ambiente completo tutto incluso",
      "Replit Agent molto potente",
      "Hosting gratuito incluso",
      "Comunita' attiva e template pronti",
    ],
    contro: [
      "Performance limitate nel piano gratuito",
      "AI Agent puo' fare errori su progetti complessi",
      "Costo puo' crescere con l'uso di risorse",
    ],
  },
  {
    nome: "Windsurf",
    slug: "windsurf",
    tagline: "L'editor AI che scrive codice insieme a te come un copilota",
    descrizione:
      "Windsurf (ex Codeium) e' un IDE con AI che va oltre il completamento codice. La modalita' Cascade permette all'AI di navigare il progetto, modificare piu' file e risolvere problemi complessi. Alternativa potente e piu' economica a Cursor.",
    categoria: "codice",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (crediti base), Pro $15/mese",
    difficolta: "Intermedio",
    fasciaUtente: "Developer",
    rating: 4.4,
    supportoItaliano: false,
    website: "https://windsurf.com",
    sinergie: ["cursor", "github-copilot", "bolt-new", "lovable"],
    features: [
      "Cascade: AI che naviga e modifica multi-file",
      "Completamento codice intelligente",
      "Basato su VS Code (familiare)",
      "Supporto modelli multipli (Claude, GPT, ecc.)",
      "Terminale AI integrato",
    ],
    casiUso: [
      "Sviluppare applicazioni web con assistenza AI",
      "Refactoring e miglioramento codice esistente",
      "Debugging intelligente con contesto del progetto",
      "Generazione test automatici",
    ],
    pro: [
      "Piu' economico di Cursor ($15 vs $20)",
      "Modalita' Cascade molto potente",
      "Basato su VS Code (facile transizione)",
      "Piano gratuito disponibile",
    ],
    contro: [
      "Meno maturo di Cursor",
      "Community piu' piccola",
      "Occasionali bug nell'interfaccia",
    ],
  },
  {
    nome: "Framer",
    slug: "framer",
    tagline: "Costruisci siti web professionali con AI senza codice",
    descrizione:
      "Framer e' un website builder no-code con AI integrata che genera pagine web professionali da prompt testuali. L'AI crea layout, copy e animazioni. Ideale per freelancer, startup e piccole imprese che vogliono un sito bello senza programmare.",
    categoria: "codice",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (sottodominio), Mini $5/mese, Basic $15/mese",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.4,
    supportoItaliano: true,
    website: "https://www.framer.com",
    sinergie: ["canva", "v0", "lovable", "gamma"],
    features: [
      "Generazione sito da prompt AI",
      "Editor drag-and-drop avanzato",
      "Animazioni e interazioni professionali",
      "CMS integrato per blog e contenuti",
      "SEO e analytics integrati",
      "Template professionali personalizzabili",
    ],
    casiUso: [
      "Creare landing page per lancio prodotto",
      "Costruire portfolio professionale",
      "Sviluppare sito aziendale con blog",
      "Creare siti per clienti come freelancer",
    ],
    pro: [
      "Design output di qualita' professionale",
      "Animazioni e micro-interazioni eccellenti",
      "SEO built-in molto efficace",
      "Prezzo competitivo",
    ],
    contro: [
      "Meno flessibile di builder code-based",
      "E-commerce limitato",
      "Alcuni template solo premium",
    ],
  },

  // ============================================================
  // PRODUTTIVITA' (task management, presentations, notes)
  // ============================================================
  {
    nome: "Tome",
    slug: "tome",
    tagline: "Crea presentazioni e documenti AI in secondi",
    descrizione:
      "Tome utilizza l'AI per generare presentazioni professionali, one-pager e documenti di vendita partendo da un semplice prompt. L'AI crea contenuti, layout e grafiche automaticamente. Perfetto per pitch, report e proposte commerciali.",
    categoria: "produttivita",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito limitato, Pro $16/mese per utente",
    difficolta: "Principiante",
    fasciaUtente: "Business",
    rating: 4.2,
    supportoItaliano: true,
    website: "https://tome.app",
    sinergie: ["gamma", "canva", "notion-ai", "chatgpt"],
    features: [
      "Generazione presentazioni da prompt AI",
      "Layout e design automatici",
      "Integrazione immagini AI",
      "Template per pitch e report",
      "Condivisione con analytics",
    ],
    casiUso: [
      "Creare pitch deck per investitori in 5 minuti",
      "Generare report settimanali automaticamente",
      "Preparare proposte commerciali professionali",
    ],
    pro: [
      "Velocissimo per creare presentazioni",
      "Design output molto professionale",
      "Analytics sulla fruizione dei contenuti",
    ],
    contro: [
      "Piano gratuito molto limitato",
      "Meno personalizzazione di PowerPoint",
      "Export PDF a volte impreciso",
    ],
  },
  {
    nome: "Todoist",
    slug: "todoist",
    tagline: "Il task manager intelligente con AI per organizzare tutto",
    descrizione:
      "Todoist e' uno dei piu' popolari task manager al mondo, ora potenziato con AI Assistant che suggerisce task, scadenze e priorita'. L'AI aiuta a scomporre progetti complessi in attivita' gestibili e a organizzare la giornata lavorativa.",
    categoria: "produttivita",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (5 progetti), Pro EUR 4/mese, Business EUR 6/mese",
    difficolta: "Principiante",
    fasciaUtente: "Tutti",
    rating: 4.5,
    supportoItaliano: true,
    website: "https://todoist.com",
    sinergie: ["notion-ai", "zapier", "make", "chatgpt"],
    features: [
      "AI Assistant per suggerimenti task e priorita'",
      "Organizzazione progetti con sezioni e filtri",
      "Date naturali (es. 'domani alle 9')",
      "Integrazioni con 80+ app",
      "Collaborazione team",
      "Disponibile su tutte le piattaforme",
    ],
    casiUso: [
      "Gestire task quotidiani di un business digitale",
      "Pianificare lanci prodotto con milestone",
      "Organizzare calendario editoriale social",
      "Coordinare team freelance su progetti",
    ],
    pro: [
      "Interfaccia pulita e intuitiva",
      "AI che impara le tue abitudini",
      "Eccellente app mobile",
      "Piano gratuito molto funzionale",
    ],
    contro: [
      "Meno potente di Notion per documentazione",
      "AI Assistant solo nel piano Pro",
      "Nessuna vista Gantt nativa",
    ],
  },
  {
    nome: "Otter.ai",
    slug: "otter-ai",
    tagline: "Trascrizione AI automatica di meeting e conversazioni",
    descrizione:
      "Otter.ai trascrive automaticamente riunioni, interviste e conversazioni in tempo reale. L'AI genera riassunti, action items e punti chiave. Si integra con Zoom, Google Meet e Teams per catturare ogni meeting senza prendere appunti.",
    categoria: "produttivita",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (300 min/mese), Pro $16.99/mese, Business $30/mese",
    difficolta: "Principiante",
    fasciaUtente: "Business",
    rating: 4.3,
    supportoItaliano: false,
    website: "https://otter.ai",
    sinergie: ["notion-ai", "todoist", "zapier", "make"],
    features: [
      "Trascrizione in tempo reale",
      "Riassunti automatici dei meeting",
      "Action items e follow-up automatici",
      "Integrazione Zoom, Meet, Teams",
      "Ricerca nei trascritti",
      "OtterPilot che partecipa ai meeting per te",
    ],
    casiUso: [
      "Trascrivere meeting di lavoro automaticamente",
      "Generare verbali e minute senza sforzo",
      "Creare contenuti da interviste e podcast",
    ],
    pro: [
      "Trascrizione accurata in tempo reale",
      "OtterPilot che entra nei meeting al posto tuo",
      "Piano gratuito generoso (300 min/mese)",
    ],
    contro: [
      "Trascrizione italiano non supportata nativamente",
      "Precisione cala con accenti forti",
      "Prezzo Pro alto per singoli utenti",
    ],
  },
  {
    nome: "Perplexity",
    slug: "perplexity",
    tagline: "Il motore di ricerca AI che risponde con fonti verificate",
    descrizione:
      "Perplexity e' un motore di ricerca potenziato da AI che fornisce risposte dettagliate con citazioni e fonti verificabili. Perfetto per ricerche di mercato, analisi competitor e raccolta informazioni. La versione Pro offre analisi approfondite con modelli AI avanzati.",
    categoria: "produttivita",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (illimitato base), Pro $20/mese",
    difficolta: "Principiante",
    fasciaUtente: "Tutti",
    rating: 4.6,
    supportoItaliano: true,
    website: "https://perplexity.ai",
    sinergie: ["chatgpt", "claude", "notion-ai", "surfer-seo"],
    features: [
      "Risposte AI con citazioni e fonti",
      "Ricerca web in tempo reale",
      "Modalita' Pro con analisi approfondite",
      "Collection per organizzare ricerche",
      "Focus mode (Academic, Writing, Math, ecc.)",
      "Upload file per analisi documenti",
    ],
    casiUso: [
      "Ricerche di mercato e analisi competitor",
      "Verificare informazioni con fonti attendibili",
      "Preparare brief e report con dati aggiornati",
      "Rispondere a domande tecniche con riferimenti",
    ],
    pro: [
      "Risposte con fonti verificabili (non allucina)",
      "Ricerca web aggiornata in tempo reale",
      "Piano gratuito molto generoso",
      "Interfaccia pulita e veloce",
    ],
    contro: [
      "Meno creativo di ChatGPT per generazione contenuti",
      "Pro richiesto per i modelli AI migliori",
      "Non ideale per task di scrittura creativa",
    ],
  },

  // ============================================================
  // MARKETING (SEO, email, ads, analytics)
  // ============================================================
  {
    nome: "SEMrush",
    slug: "semrush",
    tagline: "La piattaforma all-in-one per SEO, PPC e content marketing",
    descrizione:
      "SEMrush e' la suite di marketing digitale piu' completa con tool AI per keyword research, audit SEO, analisi competitor, content optimization e gestione social. L'AI Writing Assistant e il Content Advisor aiutano a creare contenuti ottimizzati per i motori di ricerca.",
    categoria: "marketing",
    costo: "A pagamento",
    dettaglioPrezzo: "Pro $139.95/mese, Guru $249.95/mese, Business $499.95/mese",
    difficolta: "Intermedio",
    fasciaUtente: "Business",
    rating: 4.7,
    supportoItaliano: true,
    website: "https://www.semrush.com",
    sinergie: ["surfer-seo", "grammarly", "chatgpt", "zapier"],
    features: [
      "Keyword research con volume e difficolta'",
      "Audit SEO tecnico automatico",
      "Analisi competitor dettagliata",
      "AI Writing Assistant per contenuti SEO",
      "Gestione social media integrata",
      "Report personalizzabili per clienti",
    ],
    casiUso: [
      "Fare keyword research per strategia contenuti",
      "Analizzare e superare i competitor nel ranking",
      "Monitorare posizionamento parole chiave",
      "Creare report SEO per clienti",
    ],
    pro: [
      "Database keyword piu' grande del mercato",
      "Suite completa tutto-in-uno",
      "AI integrata per contenuti e analisi",
      "Supporto in italiano",
    ],
    contro: [
      "Prezzo elevato per piccoli business",
      "Curva di apprendimento significativa",
      "Puo' essere overwhelming per principianti",
    ],
  },
  {
    nome: "Mailchimp",
    slug: "mailchimp",
    tagline: "Email marketing con AI per campagne che convertono",
    descrizione:
      "Mailchimp e' la piattaforma di email marketing piu' diffusa, ora potenziata con AI che genera oggetti, contenuti email e segmenta il pubblico automaticamente. L'AI Creative Assistant crea design e copy personalizzati per ogni campagna.",
    categoria: "marketing",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (500 contatti), Essentials da $13/mese, Standard $20/mese",
    difficolta: "Principiante",
    fasciaUtente: "Business",
    rating: 4.3,
    supportoItaliano: true,
    website: "https://mailchimp.com",
    sinergie: ["brevo", "zapier", "make", "shopify", "canva"],
    features: [
      "AI Creative Assistant per design e copy",
      "Segmentazione automatica del pubblico",
      "A/B testing con ottimizzazione AI",
      "Automazioni email predefinite",
      "Landing page builder",
      "Analytics predittiva sulla deliverability",
    ],
    casiUso: [
      "Inviare newsletter settimanali al proprio pubblico",
      "Creare funnel di benvenuto per nuovi iscritti",
      "Recuperare carrelli abbandonati per e-commerce",
      "Segmentare contatti per campagne mirate",
    ],
    pro: [
      "Piano gratuito per iniziare (500 contatti)",
      "Interfaccia intuitiva drag-and-drop",
      "AI per oggetti e contenuti email",
      "Integrazioni con centinaia di app",
    ],
    contro: [
      "Prezzo cresce rapidamente con i contatti",
      "Piano gratuito molto limitato rispetto a Brevo",
      "Automazioni avanzate solo nei piani costosi",
    ],
  },
  {
    nome: "AdCreative.ai",
    slug: "adcreative-ai",
    tagline: "Genera creativita' pubblicitarie AI che convertono",
    descrizione:
      "AdCreative.ai usa AI addestrata su milioni di ads ad alta conversione per generare banner, creativita' social e copy pubblicitario. Ogni creativa viene valutata con un punteggio di conversione predittivo. Perfetto per chi fa advertising su Facebook, Instagram e Google.",
    categoria: "marketing",
    costo: "A pagamento",
    dettaglioPrezzo: "Starter $29/mese (10 download), Premium $59/mese (25 download)",
    difficolta: "Principiante",
    fasciaUtente: "Business",
    rating: 4.3,
    supportoItaliano: true,
    website: "https://www.adcreative.ai",
    sinergie: ["canva", "chatgpt", "semrush", "zapier"],
    features: [
      "Generazione banner pubblicitari AI",
      "Score predittivo di conversione",
      "Varianti multiple per A/B testing",
      "Formati per tutte le piattaforme ads",
      "Brand kit e colori personalizzati",
      "Generazione copy ads automatica",
    ],
    casiUso: [
      "Creare banner per campagne Facebook Ads",
      "Generare creativita' per Google Display",
      "Testare varianti visive per massimizzare ROAS",
      "Produrre ads per lancio prodotto",
    ],
    pro: [
      "AI addestrata specificamente su ads ad alta conversione",
      "Score predittivo utile per decisioni",
      "Output in tutti i formati standard ads",
      "Risparmio enorme di tempo sul design ads",
    ],
    contro: [
      "Prezzo per download, non illimitato",
      "Design a volte generici",
      "Meno flessibilita' di Canva per personalizzazione",
    ],
  },
  {
    nome: "Jasper (Marketing)",
    slug: "jasper-marketing",
    tagline: "Piattaforma AI marketing completa per team e brand",
    descrizione:
      "Jasper si e' evoluto da tool di scrittura a piattaforma AI marketing completa. Offre campagne AI end-to-end, brand voice avanzata, generazione multi-formato (testo, immagini, ads) e collaborazione team. Il Marketing Copilot gestisce strategie di contenuto intere.",
    categoria: "marketing",
    costo: "A pagamento",
    dettaglioPrezzo: "Creator $49/mese, Pro $69/mese, Business custom",
    difficolta: "Intermedio",
    fasciaUtente: "Business",
    rating: 4.4,
    supportoItaliano: true,
    website: "https://www.jasper.ai",
    sinergie: [
      "surfer-seo",
      "grammarly",
      "zapier",
      "semrush",
      "brevo",
      "mailchimp",
    ],
    features: [
      "Marketing Copilot per strategie complete",
      "Brand Voice con AI personalizzata",
      "Campagne multi-formato (testo + immagini + ads)",
      "Template 50+ per ogni tipo di contenuto",
      "Collaborazione team con workflow",
      "Integrazione con Surfer SEO per ottimizzazione",
    ],
    casiUso: [
      "Gestire contenuti marketing di un brand completo",
      "Creare campagne multi-canale coordinate",
      "Mantenere coerenza di brand voice su tutti i contenuti",
      "Scalare la produzione contenuti di un team",
    ],
    pro: [
      "Brand Voice tra i migliori del mercato",
      "Campagne multi-formato molto efficaci",
      "Integrazione Surfer SEO nativa",
      "Ottimo per team marketing strutturati",
    ],
    contro: [
      "Prezzo elevato per singoli utenti",
      "Overkill per chi ha bisogno solo di scrittura",
      "Curva di apprendimento per le funzionalita' avanzate",
    ],
  },

  // ============================================================
  // E-COMMERCE (store builders, product tools)
  // ============================================================
  {
    nome: "WooCommerce + AI",
    slug: "woocommerce-ai",
    tagline: "E-commerce WordPress potenziato con plugin AI",
    descrizione:
      "WooCommerce e' la piattaforma e-commerce open source piu' diffusa, ora integrabile con decine di plugin AI per descrizioni prodotto, pricing dinamico e customer service automatico. La combinazione WordPress + WooCommerce + AI offre massima flessibilita' a costi contenuti.",
    categoria: "ecommerce",
    costo: "Freemium",
    dettaglioPrezzo: "WooCommerce gratuito, hosting da EUR 10/mese, plugin AI da $5-50/mese",
    difficolta: "Intermedio",
    fasciaUtente: "Business",
    rating: 4.2,
    supportoItaliano: true,
    website: "https://woocommerce.com",
    sinergie: ["shopify", "chatgpt", "canva", "zapier", "make"],
    features: [
      "Plugin AI per descrizioni prodotto automatiche",
      "Pricing dinamico con AI",
      "Chatbot customer service AI",
      "SEO AI per pagine prodotto",
      "Raccomandazioni prodotto intelligenti",
    ],
    casiUso: [
      "Creare e-commerce con budget ridotto",
      "Generare descrizioni per centinaia di prodotti",
      "Automatizzare customer service con chatbot",
      "Ottimizzare prezzi dinamicamente con AI",
    ],
    pro: [
      "Open source e gratuito come base",
      "Massima flessibilita' e personalizzazione",
      "Migliaia di plugin disponibili",
      "Nessuna commissione sulle vendite",
    ],
    contro: [
      "Richiede hosting e manutenzione",
      "Setup iniziale piu' complesso di Shopify",
      "Plugin AI spesso a pagamento separato",
    ],
  },
  {
    nome: "Gumroad",
    slug: "gumroad",
    tagline: "Vendi prodotti digitali in modo semplice e veloce",
    descrizione:
      "Gumroad e' la piattaforma piu' semplice per vendere prodotti digitali: ebook, corsi, template, software. Zero setup tecnico, pagina di vendita inclusa e pagamenti integrati. Ideale per creator che vogliono monetizzare rapidamente contenuti digitali.",
    categoria: "ecommerce",
    costo: "Freemium",
    dettaglioPrezzo: "Nessun costo fisso, 10% commissione su ogni vendita",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.1,
    supportoItaliano: false,
    website: "https://gumroad.com",
    sinergie: ["canva", "chatgpt", "zapier", "mailchimp", "brevo"],
    features: [
      "Pagina di vendita instant senza design",
      "Pagamenti integrati (carte, PayPal)",
      "Delivery automatica prodotti digitali",
      "Dashboard analytics vendite",
      "Upsell e discount code",
    ],
    casiUso: [
      "Vendere ebook e guide digitali",
      "Monetizzare template e risorse design",
      "Lanciare un mini-corso senza piattaforma complessa",
    ],
    pro: [
      "Setup in 5 minuti, zero conoscenze tecniche",
      "Nessun costo fisso mensile",
      "Perfetto per primi prodotti digitali",
    ],
    contro: [
      "Commissione 10% alta per volumi elevati",
      "Pagine vendita basiche nel design",
      "Poche funzionalita' di marketing avanzato",
    ],
  },
  {
    nome: "Teachable",
    slug: "teachable",
    tagline: "Crea e vendi corsi online con la tua accademia AI",
    descrizione:
      "Teachable e' la piattaforma leader per creare e vendere corsi online. Con AI integrata per generare outline dei corsi, quiz e materiali. Gestisce pagamenti, certificati e community degli studenti. Usato da oltre 100.000 creator nel mondo.",
    categoria: "ecommerce",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (commissione $1+10%), Basic $59/mese, Pro $159/mese",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.3,
    supportoItaliano: false,
    website: "https://teachable.com",
    sinergie: ["canva", "chatgpt", "zapier", "mailchimp", "brevo"],
    features: [
      "AI Course Outline Generator",
      "Page builder drag-and-drop",
      "Pagamenti e checkout integrati",
      "Quiz e certificati automatici",
      "Coaching e community integrati",
      "Funnel di vendita con upsell",
    ],
    casiUso: [
      "Creare un corso online completo da zero",
      "Monetizzare la propria expertise con video lezioni",
      "Costruire una membership con contenuti ricorrenti",
      "Vendere coaching 1:1 con calendario integrato",
    ],
    pro: [
      "Piattaforma completa tutto-in-uno per corsi",
      "AI per generare struttura del corso",
      "Pagamenti e tax compliance integrati",
      "Community e coaching nativi",
    ],
    contro: [
      "Piano gratuito con commissione alta",
      "Customizzazione design limitata",
      "Interfaccia solo in inglese",
    ],
  },
  {
    nome: "Printful",
    slug: "printful",
    tagline: "Print-on-demand con AI per creare un brand senza magazzino",
    descrizione:
      "Printful e' la piattaforma leader di print-on-demand con AI Design Maker integrato. Crea prodotti personalizzati (magliette, tazze, poster) senza investimento iniziale. L'AI genera design, l'integrazione con Shopify e Etsy gestisce gli ordini automaticamente.",
    categoria: "ecommerce",
    costo: "Freemium",
    dettaglioPrezzo: "Nessun costo fisso, paghi solo quando vendi (costo prodotto + spedizione)",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.2,
    supportoItaliano: true,
    website: "https://www.printful.com",
    sinergie: ["shopify", "canva", "midjourney", "leonardo-ai"],
    features: [
      "AI Design Maker per creare grafiche",
      "Catalogo 300+ prodotti personalizzabili",
      "Integrazione Shopify, Etsy, WooCommerce",
      "Mockup generator automatico",
      "Spedizione e fulfillment globale",
    ],
    casiUso: [
      "Lanciare un brand di abbigliamento senza magazzino",
      "Creare merchandise per il proprio brand personale",
      "Vendere prodotti personalizzati su Etsy",
    ],
    pro: [
      "Zero investimento iniziale",
      "AI per design inclusa gratis",
      "Integrazione automatica con e-commerce",
      "Qualita' stampa professionale",
    ],
    contro: [
      "Margini ridotti per prodotto",
      "Tempi di spedizione 5-12 giorni",
      "Controllo qualita' non diretto",
    ],
  },

  // ============================================================
  // AUDIO (voice, music, podcasting)
  // ============================================================
  {
    nome: "Suno",
    slug: "suno",
    tagline: "Crea musica completa con voce e strumenti usando solo testo",
    descrizione:
      "Suno e' il tool AI piu' rivoluzionario per la creazione musicale. Genera canzoni complete con voce, strumenti e arrangiamento da un semplice prompt testuale. Supporta ogni genere musicale e produce risultati di qualita' sorprendente. Perfetto per jingle, colonne sonore e contenuti musicali.",
    categoria: "audio",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (10 canzoni/giorno), Pro $10/mese (500 canzoni), Premier $30/mese",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.6,
    supportoItaliano: true,
    website: "https://suno.com",
    sinergie: ["elevenlabs", "capcut", "canva"],
    features: [
      "Generazione canzoni complete da prompt testuale",
      "Voce AI cantata in ogni lingua",
      "Tutti i generi musicali supportati",
      "Estensione e remix di canzoni",
      "Licenza commerciale nei piani a pagamento",
      "Testi personalizzabili o generati AI",
    ],
    casiUso: [
      "Creare jingle per brand e pubblicita'",
      "Produrre colonne sonore per video content",
      "Generare musica di sottofondo per podcast",
      "Comporre canzoni personalizzate per eventi",
    ],
    pro: [
      "Qualita' musicale sorprendente",
      "Semplicissimo da usare (scrivi e genera)",
      "Piano gratuito generoso",
      "Supporta canto in italiano",
    ],
    contro: [
      "Diritti commerciali solo nei piani a pagamento",
      "Voce AI riconoscibile in alcuni generi",
      "Non sostituisce produzione musicale professionale",
    ],
  },
  {
    nome: "Udio",
    slug: "udio",
    tagline: "Genera musica AI con qualita' da studio professionale",
    descrizione:
      "Udio compete con Suno come generatore musicale AI, con un focus sulla qualita' audio e la fedeltà ai generi musicali. Produce tracce con qualita' da studio, eccellente per musica strumentale, colonne sonore e generi specifici.",
    categoria: "audio",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (crediti giornalieri), Standard $10/mese, Pro $30/mese",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.4,
    supportoItaliano: false,
    website: "https://www.udio.com",
    sinergie: ["suno", "elevenlabs", "capcut", "runway"],
    features: [
      "Qualita' audio da studio professionale",
      "Fedele ai generi musicali specifici",
      "Estensione tracce fino a 15 minuti",
      "Inpainting audio (modifica sezioni)",
      "Remix e variazioni di tracce",
    ],
    casiUso: [
      "Creare colonne sonore per video e film",
      "Generare musica strumentale per meditazione/focus",
      "Produrre demo musicali per artisti",
    ],
    pro: [
      "Qualita' audio tra le migliori in assoluto",
      "Eccellente per musica strumentale",
      "Inpainting per editare sezioni specifiche",
    ],
    contro: [
      "Meno intuitivo di Suno per i principianti",
      "Supporto lingue limitato per il canto",
      "Controversie sui dati di training",
    ],
  },
  {
    nome: "Descript",
    slug: "descript",
    tagline: "Edita audio e video come se fossero un documento di testo",
    descrizione:
      "Descript rivoluziona l'editing audio/video: trascrive automaticamente il contenuto e permette di editarlo modificando il testo. Cancelli una parola dal trascritto e si cancella dall'audio. Include clonazione voce, rimozione filler words e Studio Sound per qualita' professionale.",
    categoria: "audio",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (1 ora), Hobbyist $24/mese, Pro $33/mese",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.5,
    supportoItaliano: false,
    website: "https://www.descript.com",
    sinergie: ["elevenlabs", "capcut", "otter-ai", "canva"],
    features: [
      "Editing audio/video basato su testo",
      "Rimozione automatica filler words (uhm, eh)",
      "Studio Sound (migliora qualita' come studio pro)",
      "Clonazione voce AI per correzioni",
      "Trascrizione automatica accurata",
      "Screen recording e video editing integrato",
    ],
    casiUso: [
      "Editare podcast in meta' del tempo",
      "Rimuovere errori audio senza competenze tecniche",
      "Creare clip social da video lunghi",
      "Registrare e montare screencast professionali",
    ],
    pro: [
      "Rivoluzionario editing basato su testo",
      "Studio Sound migliora drasticamente la qualita'",
      "Rimozione filler words con un click",
      "Tutto-in-uno: registra, edita, pubblica",
    ],
    contro: [
      "Trascrizione solo inglese di alta qualita'",
      "Piano gratuito molto limitato (1 ora)",
      "Performance pesante su computer non recenti",
    ],
  },
  {
    nome: "Riverside.fm",
    slug: "riverside-fm",
    tagline: "Registra podcast e interviste in qualita' studio da remoto",
    descrizione:
      "Riverside registra audio e video in qualita' locale (non compressa da internet) anche in chiamata remota. Include trascrizione AI, editing automatico e generazione clip social. La piattaforma ideale per podcaster e interviewer professionisti.",
    categoria: "audio",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (2 ore), Standard $15/mese, Pro $24/mese",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.4,
    supportoItaliano: false,
    website: "https://riverside.fm",
    sinergie: ["descript", "elevenlabs", "capcut", "canva"],
    features: [
      "Registrazione qualita' locale anche da remoto",
      "Trascrizione AI automatica",
      "AI clip generator per social media",
      "Editing video con layout multipli",
      "Teleprompter integrato",
      "Fino a 8 ospiti in una sessione",
    ],
    casiUso: [
      "Registrare podcast con ospiti remoti in alta qualita'",
      "Condurre interviste video professionali",
      "Creare clip social automatiche da registrazioni",
    ],
    pro: [
      "Qualita' audio/video superiore a Zoom",
      "AI clip generator risparmia ore di editing",
      "Setup semplicissimo per gli ospiti",
    ],
    contro: [
      "Trascrizione italiano non eccellente",
      "Piano gratuito con limiti stretti",
      "Funzionalita' editing base rispetto a Descript",
    ],
  },

  // ============================================================
  // DESIGN (UI/UX, graphic design)
  // ============================================================
  {
    nome: "Figma AI",
    slug: "figma-ai",
    tagline: "Lo standard del design UI/UX ora potenziato con AI",
    descrizione:
      "Figma, lo strumento di design piu' usato al mondo, ha integrato funzionalita' AI per generare layout, componenti e prototipi da prompt testuali. L'AI suggerisce design, auto-completa elementi e traduce i design in codice pronto per lo sviluppo.",
    categoria: "design",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (3 file), Professional $15/mese, Organization $45/mese",
    difficolta: "Intermedio",
    fasciaUtente: "Creator",
    rating: 4.7,
    supportoItaliano: true,
    website: "https://www.figma.com",
    sinergie: ["framer", "v0", "lovable", "canva"],
    features: [
      "AI generazione layout e componenti",
      "Auto-complete design intelligente",
      "Prototipazione interattiva avanzata",
      "Design-to-code con Dev Mode",
      "Collaborazione real-time illimitata",
      "Plugin ecosystem vastissimo",
    ],
    casiUso: [
      "Progettare interfacce app e siti web",
      "Creare design system per il proprio brand",
      "Prototipare interazioni prima dello sviluppo",
      "Collaborare con sviluppatori con Dev Mode",
    ],
    pro: [
      "Standard industriale per UI/UX design",
      "AI che velocizza il workflow di design",
      "Collaborazione real-time eccellente",
      "Piano gratuito funzionale",
    ],
    contro: [
      "Curva di apprendimento per principianti assoluti",
      "AI features ancora in evoluzione",
      "Richiede buon senso estetico di base",
    ],
  },
  {
    nome: "Looka",
    slug: "looka",
    tagline: "Crea il logo e l'identita' visiva del tuo brand con AI",
    descrizione:
      "Looka e' un AI logo maker che genera loghi professionali in pochi minuti. Dopo aver risposto a domande su stile, colori e settore, l'AI produce centinaia di varianti. Include anche brand kit completo con biglietti da visita, social media kit e guide colori.",
    categoria: "design",
    costo: "Freemium",
    dettaglioPrezzo: "Generazione gratuita, download logo da $20 (una tantum), Brand Kit $96/anno",
    difficolta: "Principiante",
    fasciaUtente: "Tutti",
    rating: 4.1,
    supportoItaliano: false,
    website: "https://looka.com",
    sinergie: ["canva", "figma-ai", "framer"],
    features: [
      "Generazione logo AI con centinaia di varianti",
      "Brand kit completo (colori, font, guide)",
      "Biglietti da visita e social media kit",
      "File vettoriali SVG e PNG alta risoluzione",
      "Mockup automatici su prodotti",
    ],
    casiUso: [
      "Creare logo per un nuovo business",
      "Generare brand identity completa da zero",
      "Produrre materiali marketing coordinati",
    ],
    pro: [
      "Logo professionale in 5 minuti",
      "Brand kit completo incluso",
      "Prezzo una tantum per il logo",
    ],
    contro: [
      "Design possono sembrare generici",
      "File vettoriali solo nei piani premium",
      "Personalizzazione limitata rispetto a un designer",
    ],
  },
  {
    nome: "Recraft",
    slug: "recraft",
    tagline: "Genera icone, illustrazioni e grafiche vettoriali con AI",
    descrizione:
      "Recraft e' specializzato nella generazione AI di grafica vettoriale: icone, illustrazioni, loghi e pattern. A differenza dei generatori di immagini classici, produce file vettoriali editabili (SVG). Ideale per designer e brand che necessitano di asset grafici scalabili.",
    categoria: "design",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (generazioni limitate), Pro $30/mese",
    difficolta: "Principiante",
    fasciaUtente: "Creator",
    rating: 4.3,
    supportoItaliano: false,
    website: "https://www.recraft.ai",
    sinergie: ["figma-ai", "canva", "framer", "ideogram"],
    features: [
      "Generazione grafica vettoriale (SVG)",
      "Stili multipli: flat, 3D, isometrico, ecc.",
      "Set di icone coerenti",
      "Illustrazioni con stile uniforme",
      "Export SVG editabile",
    ],
    casiUso: [
      "Creare set di icone per siti web e app",
      "Generare illustrazioni per presentazioni",
      "Produrre pattern e grafiche per brand identity",
    ],
    pro: [
      "Unico tool AI che genera vettoriali editabili",
      "Stile coerente per set di icone",
      "Qualita' output molto alta",
    ],
    contro: [
      "Meno versatile per immagini fotografiche",
      "Piano Pro costoso per uso occasionale",
      "Community piccola rispetto ai big player",
    ],
  },
  {
    nome: "Designify",
    slug: "designify",
    tagline: "Rimuovi sfondi e crea composizioni prodotto AI automaticamente",
    descrizione:
      "Designify e' uno strumento AI specializzato nella rimozione sfondo e composizione automatica di foto prodotto. Carica una foto del prodotto e l'AI rimuove lo sfondo, aggiunge ombre realistiche e lo posiziona in scene professionali. Perfetto per e-commerce.",
    categoria: "design",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (bassa risoluzione), Pro da $9/mese",
    difficolta: "Principiante",
    fasciaUtente: "Business",
    rating: 4.0,
    supportoItaliano: false,
    website: "https://www.designify.com",
    sinergie: ["canva", "shopify", "printful", "photoshop-ai-firefly"],
    features: [
      "Rimozione sfondo automatica AI",
      "Composizione scene prodotto professionali",
      "Ombre e riflessi realistici automatici",
      "Batch processing per centinaia di immagini",
      "Template scene personalizzabili",
    ],
    casiUso: [
      "Creare foto prodotto professionali per e-commerce",
      "Rimuovere sfondo da foto in batch",
      "Generare composizioni per cataloghi",
    ],
    pro: [
      "Automatico: carica e scarica risultato",
      "Batch processing per grandi volumi",
      "Risultati professionali immediati",
    ],
    contro: [
      "Solo per foto prodotto (non generico)",
      "Alta risoluzione solo nei piani Pro",
      "Meno versatile di Photoshop AI",
    ],
  },

  // ============================================================
  // AUTOMAZIONE (workflow, integrations)
  // ============================================================
  {
    nome: "n8n",
    slug: "n8n",
    tagline: "Automazione workflow open-source con AI nodes integrati",
    descrizione:
      "n8n e' una piattaforma di automazione open-source alternativa a Zapier e Make. Offre nodi AI nativi per integrare ChatGPT, Claude e altri modelli nei workflow. Puo' essere self-hosted (gratuito) o usato in cloud. Ideale per chi vuole automazioni potenti senza limiti.",
    categoria: "automazione",
    costo: "Freemium",
    dettaglioPrezzo: "Self-hosted gratuito, Cloud Starter EUR 24/mese, Pro EUR 60/mese",
    difficolta: "Intermedio",
    fasciaUtente: "Business",
    rating: 4.5,
    supportoItaliano: false,
    website: "https://n8n.io",
    sinergie: ["zapier", "make", "chatgpt", "claude", "notion-ai"],
    features: [
      "Nodi AI nativi (ChatGPT, Claude, Gemini)",
      "Open-source e self-hostable",
      "400+ integrazioni",
      "Workflow visivi drag-and-drop",
      "Code nodes per logica custom",
      "Webhook e trigger avanzati",
    ],
    casiUso: [
      "Creare automazioni AI per processare email",
      "Automatizzare pipeline di contenuti con AI",
      "Integrare sistemi aziendali senza codice",
      "Costruire agenti AI personalizzati",
    ],
    pro: [
      "Open-source (nessun costo se self-hosted)",
      "AI nodes nativi potentissimi",
      "Nessun limite di esecuzioni nel self-hosted",
      "Estrema flessibilita' con code nodes",
    ],
    contro: [
      "Self-hosting richiede competenze tecniche",
      "Interfaccia meno intuitiva di Zapier",
      "Community piu' piccola (ma in crescita rapida)",
    ],
  },
  {
    nome: "Bardeen",
    slug: "bardeen",
    tagline: "Automatizza task ripetitivi nel browser con un click",
    descrizione:
      "Bardeen e' un'estensione browser che automatizza task web ripetitivi. L'AI osserva le tue azioni e crea automazioni. Scraping dati, compilazione form, invio email, gestione CRM: tutto automatizzato senza scrivere codice. Perfetto per venditori e marketer.",
    categoria: "automazione",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (500 crediti/mese), Pro $10/mese per utente",
    difficolta: "Principiante",
    fasciaUtente: "Business",
    rating: 4.2,
    supportoItaliano: false,
    website: "https://www.bardeen.ai",
    sinergie: ["zapier", "make", "chatgpt", "notion-ai"],
    features: [
      "Automazione browser basata su AI",
      "Scraping dati da qualsiasi sito web",
      "Compilazione form automatica",
      "Integrazione con CRM e tool di vendita",
      "Template automazioni pronti all'uso",
      "Magic Box: descrivi l'automazione in linguaggio naturale",
    ],
    casiUso: [
      "Automatizzare ricerca lead da LinkedIn",
      "Estrarre dati da siti web senza API",
      "Compilare report automaticamente da piu' fonti",
    ],
    pro: [
      "AI che impara dalle tue azioni nel browser",
      "Nessuna conoscenza tecnica richiesta",
      "Prezzo molto accessibile",
    ],
    contro: [
      "Limitato alle azioni nel browser",
      "Solo Chrome come browser supportato",
      "Automazioni complesse possono essere fragili",
    ],
  },
  {
    nome: "Activepieces",
    slug: "activepieces",
    tagline: "Alternativa open-source a Zapier con AI integrata",
    descrizione:
      "Activepieces e' una piattaforma di automazione open-source che sfida Zapier con prezzi piu' accessibili e AI integrata. Offre un builder visuale intuitivo, centinaia di connettori e la possibilita' di creare automazioni con prompt in linguaggio naturale.",
    categoria: "automazione",
    costo: "Freemium",
    dettaglioPrezzo: "Self-hosted gratuito, Cloud Pro $10/mese (1000 task)",
    difficolta: "Principiante",
    fasciaUtente: "Business",
    rating: 4.1,
    supportoItaliano: false,
    website: "https://www.activepieces.com",
    sinergie: ["zapier", "make", "n8n", "chatgpt"],
    features: [
      "Builder automazioni visuale e intuitivo",
      "AI per creare automazioni da prompt",
      "Open-source e self-hostable",
      "200+ connettori pronti",
      "Webhook e schedule triggers",
    ],
    casiUso: [
      "Automatizzare workflow email e notifiche",
      "Sincronizzare dati tra piattaforme diverse",
      "Creare automazioni marketing senza codice",
    ],
    pro: [
      "Prezzo molto piu' basso di Zapier",
      "Open-source con opzione self-host",
      "Interfaccia piu' semplice di n8n",
    ],
    contro: [
      "Meno connettori di Zapier e Make",
      "Progetto relativamente giovane",
      "Documentazione in fase di crescita",
    ],
  },
  {
    nome: "Relevance AI",
    slug: "relevance-ai",
    tagline: "Crea agenti AI personalizzati senza codice per il tuo business",
    descrizione:
      "Relevance AI permette di creare agenti AI personalizzati che eseguono task complessi in autonomia. Crei un agente, gli dai istruzioni e tool, e lui lavora per te: ricerca, analisi, email, report. La piattaforma no-code rende l'AI agentica accessibile a tutti.",
    categoria: "automazione",
    costo: "Freemium",
    dettaglioPrezzo: "Piano gratuito (100 crediti/giorno), Team $19/mese per utente",
    difficolta: "Intermedio",
    fasciaUtente: "Business",
    rating: 4.3,
    supportoItaliano: false,
    website: "https://relevanceai.com",
    sinergie: ["chatgpt", "claude", "zapier", "make", "n8n"],
    features: [
      "Builder agenti AI no-code",
      "Tool personalizzabili per ogni agente",
      "Integrazione con API esterne",
      "Knowledge base per contesto personalizzato",
      "Task scheduling e trigger automatici",
      "Multi-step reasoning avanzato",
    ],
    casiUso: [
      "Creare un agente AI per customer support",
      "Automatizzare ricerche di mercato con agente AI",
      "Costruire agente per qualifica lead automatica",
      "Generare report automatici da dati multipli",
    ],
    pro: [
      "Agenti AI senza scrivere codice",
      "Estremamente flessibile e personalizzabile",
      "Piano gratuito per sperimentare",
      "Trend del futuro (AI agentica)",
    ],
    contro: [
      "Concetto ancora nuovo per molti utenti",
      "Richiede tempo per configurare agenti efficaci",
      "Solo in inglese",
    ],
  },
];

// ============================================================
// STACK DETTAGLIATI PER RISULTATI QUIZ
// ============================================================

export const quizStacks: QuizStack[] = [
  // ============================================================
  // 1. STACK WEBSITE - Per chi vuole creare un sito/web business
  // ============================================================
  {
    risultato: "Website / Web Business",
    slug: "website",
    descrizione:
      "Stack completi per creare un sito web professionale, landing page o web app per il tuo business digitale.",
    gratuito: {
      nome: "Stack Gratuito",
      budget: "EUR 0/mese",
      tools: [
        {
          slug: "chatgpt",
          ruolo: "Generazione contenuti e copy per il sito",
          nota: "Piano gratuito con GPT-3.5, sufficiente per copy base",
        },
        {
          slug: "framer",
          ruolo: "Website builder con AI e hosting gratuito",
          nota: "Piano gratuito con sottodominio framer.website",
        },
        {
          slug: "canva",
          ruolo: "Grafica, immagini e visual per il sito",
          nota: "Piano gratuito con template e elementi base",
        },
        {
          slug: "grammarly",
          ruolo: "Controllo testi e copy del sito",
          nota: "Piano gratuito per correzione grammaticale base",
        },
        {
          slug: "perplexity",
          ruolo: "Ricerca mercato e analisi competitor",
          nota: "Piano gratuito per ricerche illimitate base",
        },
      ],
    },
    medio: {
      nome: "Stack Medio",
      budget: "EUR 50-100/mese",
      tools: [
        {
          slug: "lovable",
          ruolo: "Builder principale per sito/web app completa",
          nota: "Piano Starter ~$20/mese, genera codice React production-ready",
        },
        {
          slug: "chatgpt",
          ruolo: "Copy, strategia contenuti e assistente AI",
          nota: "ChatGPT Plus $20/mese con GPT-4 e DALL-E 3",
        },
        {
          slug: "surfer-seo",
          ruolo: "Ottimizzazione SEO contenuti e pagine",
          nota: "Essential $89/mese, ma il content editor base e' sufficiente",
        },
        {
          slug: "canva",
          ruolo: "Grafica professionale e brand kit",
          nota: "Pro EUR 11.99/mese per template premium e brand kit",
        },
      ],
    },
    pro: {
      nome: "Stack Pro",
      budget: "EUR 200+/mese",
      tools: [
        {
          slug: "cursor",
          ruolo: "IDE AI per sviluppo sito/app personalizzata",
          nota: "Pro $20/mese, pieno controllo sul codice",
        },
        {
          slug: "figma-ai",
          ruolo: "Design professionale UI/UX prima dello sviluppo",
          nota: "Professional $15/mese per design system completo",
        },
        {
          slug: "semrush",
          ruolo: "SEO professionale, keyword research e monitoring",
          nota: "Pro $139.95/mese, suite completa per dominare la ricerca",
        },
        {
          slug: "chatgpt",
          ruolo: "Assistente AI per copy, strategia e analisi",
          nota: "ChatGPT Plus $20/mese o Team per collaborazione",
        },
        {
          slug: "vercel",
          ruolo: "Hosting professionale con deploy automatico",
          nota: "Pro $20/mese per performance e analytics avanzate",
        },
      ],
    },
  },

  // ============================================================
  // 2. STACK SOCIAL - Per chi vuole costruire una presenza social
  // ============================================================
  {
    risultato: "Social Media / Content Creation",
    slug: "social",
    descrizione:
      "Stack completi per creare contenuti social, crescere su Instagram, TikTok e YouTube, e costruire un personal brand.",
    gratuito: {
      nome: "Stack Gratuito",
      budget: "EUR 0/mese",
      tools: [
        {
          slug: "chatgpt",
          ruolo: "Scrittura caption, idee contenuti e strategia",
          nota: "Piano gratuito per brainstorming e copy social",
        },
        {
          slug: "canva",
          ruolo: "Grafica per post, storie e carousel",
          nota: "Piano gratuito con migliaia di template social",
        },
        {
          slug: "capcut",
          ruolo: "Editing video per Reels, TikTok e YouTube Shorts",
          nota: "Gratuito con funzionalita' AI (sottotitoli, effetti)",
        },
        {
          slug: "ideogram",
          ruolo: "Immagini AI per post con testo leggibile",
          nota: "Piano gratuito con 10 generazioni/giorno",
        },
        {
          slug: "suno",
          ruolo: "Musica originale per video e contenuti",
          nota: "Piano gratuito per 10 canzoni/giorno",
        },
      ],
    },
    medio: {
      nome: "Stack Medio",
      budget: "EUR 50-100/mese",
      tools: [
        {
          slug: "chatgpt",
          ruolo: "Content strategy, copy e pianificazione editoriale",
          nota: "Plus $20/mese con GPT-4 e analisi immagini",
        },
        {
          slug: "canva",
          ruolo: "Design professionale con brand kit e Magic Studio",
          nota: "Pro EUR 11.99/mese, tutto il pacchetto premium",
        },
        {
          slug: "capcut",
          ruolo: "Video editing avanzato con AI",
          nota: "Pro ~$8/mese per funzionalita' premium",
        },
        {
          slug: "heygen",
          ruolo: "Avatar AI per video senza metterci la faccia",
          nota: "Creator $24/mese per video con avatar personalizzato",
        },
        {
          slug: "elevenlabs",
          ruolo: "Voiceover professionale AI per video e podcast",
          nota: "Starter $5/mese per 30 min di voce al mese",
        },
      ],
    },
    pro: {
      nome: "Stack Pro",
      budget: "EUR 200+/mese",
      tools: [
        {
          slug: "chatgpt",
          ruolo: "Content strategy avanzata e assistenza creativa",
          nota: "Plus $20/mese",
        },
        {
          slug: "midjourney",
          ruolo: "Immagini AI di qualita' top per branding visivo",
          nota: "Standard $30/mese per generazioni illimitate",
        },
        {
          slug: "heygen",
          ruolo: "Video AI professionali con avatar personalizzato",
          nota: "Business $60/mese per video premium",
        },
        {
          slug: "runway",
          ruolo: "Effetti video AI e generazione clip cinematografiche",
          nota: "Standard $12/mese + crediti aggiuntivi",
        },
        {
          slug: "adcreative-ai",
          ruolo: "Creative ads ottimizzate per conversioni",
          nota: "Starter $29/mese per campagne paid",
        },
      ],
    },
  },

  // ============================================================
  // 3. STACK EMAIL - Per chi vuole fare email marketing / newsletter
  // ============================================================
  {
    risultato: "Email Marketing / Newsletter",
    slug: "email",
    descrizione:
      "Stack completi per costruire una lista email, creare funnel di vendita e monetizzare con newsletter e automazioni.",
    gratuito: {
      nome: "Stack Gratuito",
      budget: "EUR 0/mese",
      tools: [
        {
          slug: "brevo",
          ruolo: "Piattaforma email marketing principale",
          nota: "Piano gratuito con 300 email/giorno e automazioni base",
        },
        {
          slug: "chatgpt",
          ruolo: "Scrittura email, subject line e sequenze",
          nota: "Piano gratuito per generare copy email efficaci",
        },
        {
          slug: "canva",
          ruolo: "Grafica per lead magnet e header email",
          nota: "Piano gratuito per design email e PDF",
        },
        {
          slug: "framer",
          ruolo: "Landing page per catturare lead",
          nota: "Piano gratuito per landing page base con form",
        },
      ],
    },
    medio: {
      nome: "Stack Medio",
      budget: "EUR 50-100/mese",
      tools: [
        {
          slug: "mailchimp",
          ruolo: "Email marketing con AI per segmentazione e A/B test",
          nota: "Standard $20/mese con AI Creative Assistant",
        },
        {
          slug: "chatgpt",
          ruolo: "Copy email, strategia funnel e automazioni",
          nota: "Plus $20/mese per sequenze email complesse",
        },
        {
          slug: "canva",
          ruolo: "Design email template e lead magnet premium",
          nota: "Pro EUR 11.99/mese per brand kit coerente",
        },
        {
          slug: "lovable",
          ruolo: "Landing page personalizzate ad alta conversione",
          nota: "Starter ~$20/mese per pagine custom",
        },
        {
          slug: "zapier",
          ruolo: "Automazioni tra email, CRM e altri tool",
          nota: "Starter $19.99/mese per 750 task/mese",
        },
      ],
    },
    pro: {
      nome: "Stack Pro",
      budget: "EUR 200+/mese",
      tools: [
        {
          slug: "mailchimp",
          ruolo: "Email marketing avanzato con segmentazione AI",
          nota: "Premium $350/mese per audience avanzata e analytics",
        },
        {
          slug: "anyword",
          ruolo: "Copy email con score predittivo di conversione",
          nota: "Data-Driven $79/mese per A/B testing predittivo",
        },
        {
          slug: "jasper-marketing",
          ruolo: "Campagne email multi-formato con brand voice",
          nota: "Pro $69/mese per contenuti coordinati",
        },
        {
          slug: "make",
          ruolo: "Automazioni complesse multi-step",
          nota: "Pro $16/mese per workflow sofisticati",
        },
        {
          slug: "semrush",
          ruolo: "Content marketing e SEO per attrarre lead organici",
          nota: "Pro $139.95/mese per strategia contenuti completa",
        },
      ],
    },
  },

  // ============================================================
  // 4. STACK E-COMMERCE - Per chi vuole vendere prodotti online
  // ============================================================
  {
    risultato: "E-Commerce / Vendita Online",
    slug: "ecommerce",
    descrizione:
      "Stack completi per creare un negozio online, vendere prodotti fisici o digitali e scalare le vendite con AI.",
    gratuito: {
      nome: "Stack Gratuito",
      budget: "EUR 0/mese",
      tools: [
        {
          slug: "gumroad",
          ruolo: "Piattaforma vendita prodotti digitali",
          nota: "Nessun costo fisso, 10% commissione solo quando vendi",
        },
        {
          slug: "chatgpt",
          ruolo: "Descrizioni prodotto, copy vendita e strategia",
          nota: "Piano gratuito per generare copy e-commerce",
        },
        {
          slug: "canva",
          ruolo: "Grafiche prodotto, mockup e materiali marketing",
          nota: "Piano gratuito con template e-commerce",
        },
        {
          slug: "brevo",
          ruolo: "Email marketing per nurturing e recupero carrelli",
          nota: "Piano gratuito per 300 email/giorno",
        },
      ],
    },
    medio: {
      nome: "Stack Medio",
      budget: "EUR 50-100/mese",
      tools: [
        {
          slug: "shopify",
          ruolo: "Piattaforma e-commerce completa con AI",
          nota: "Basic $39/mese con Shopify Magic AI integrato",
        },
        {
          slug: "chatgpt",
          ruolo: "Descrizioni prodotto, email e assistenza clienti",
          nota: "Plus $20/mese per copy di qualita' superiore",
        },
        {
          slug: "canva",
          ruolo: "Foto prodotto, banner e materiali social",
          nota: "Pro EUR 11.99/mese per rimozione sfondo e brand kit",
        },
        {
          slug: "mailchimp",
          ruolo: "Email marketing con automazioni e-commerce",
          nota: "Essentials $13/mese con template e-commerce",
        },
      ],
    },
    pro: {
      nome: "Stack Pro",
      budget: "EUR 200+/mese",
      tools: [
        {
          slug: "shopify",
          ruolo: "E-commerce professionale con analytics avanzati",
          nota: "Shopify $105/mese per report e funzionalita' pro",
        },
        {
          slug: "adcreative-ai",
          ruolo: "Creative ads ottimizzate per ROAS massimo",
          nota: "Premium $59/mese per ads ad alta conversione",
        },
        {
          slug: "semrush",
          ruolo: "SEO e-commerce e keyword research prodotti",
          nota: "Pro $139.95/mese per dominare la ricerca prodotto",
        },
        {
          slug: "chatgpt",
          ruolo: "Strategia marketing, copy e analisi dati",
          nota: "Plus $20/mese",
        },
        {
          slug: "zapier",
          ruolo: "Automazioni tra Shopify, email, CRM e analytics",
          nota: "Professional $49.99/mese per 2000 task",
        },
      ],
    },
  },

  // ============================================================
  // 5. STACK COURSE - Per chi vuole creare e vendere corsi online
  // ============================================================
  {
    risultato: "Corsi Online / Formazione",
    slug: "course",
    descrizione:
      "Stack completi per creare, lanciare e vendere corsi online, membership e contenuti formativi.",
    gratuito: {
      nome: "Stack Gratuito",
      budget: "EUR 0/mese",
      tools: [
        {
          slug: "chatgpt",
          ruolo: "Creazione outline corso, lezioni e materiali",
          nota: "Piano gratuito per strutturare contenuti del corso",
        },
        {
          slug: "canva",
          ruolo: "Slide presentazioni, workbook e materiali studenti",
          nota: "Piano gratuito con template educativi",
        },
        {
          slug: "gamma",
          ruolo: "Presentazioni AI per lezioni e moduli",
          nota: "Piano gratuito per presentazioni interattive",
        },
        {
          slug: "capcut",
          ruolo: "Editing video lezioni con sottotitoli AI",
          nota: "Gratuito con sottotitoli automatici",
        },
        {
          slug: "gumroad",
          ruolo: "Vendita del corso senza costi fissi",
          nota: "10% commissione, zero setup",
        },
      ],
    },
    medio: {
      nome: "Stack Medio",
      budget: "EUR 50-100/mese",
      tools: [
        {
          slug: "teachable",
          ruolo: "Piattaforma corsi completa con checkout integrato",
          nota: "Basic $59/mese con AI outline e zero commissioni",
        },
        {
          slug: "chatgpt",
          ruolo: "Contenuti corso, quiz, esercizi e strategia",
          nota: "Plus $20/mese per lezioni dettagliate e materiali",
        },
        {
          slug: "canva",
          ruolo: "Slide, workbook e certificati professionali",
          nota: "Pro EUR 11.99/mese con brand kit coerente",
        },
        {
          slug: "heygen",
          ruolo: "Video lezioni con avatar AI senza telecamera",
          nota: "Creator $24/mese per lezioni video professionali",
        },
      ],
    },
    pro: {
      nome: "Stack Pro",
      budget: "EUR 200+/mese",
      tools: [
        {
          slug: "teachable",
          ruolo: "Piattaforma corsi premium con coaching e community",
          nota: "Pro $159/mese con affiliate, completions e analytics",
        },
        {
          slug: "synthesia",
          ruolo: "Video lezioni professionali con avatar AI multilingua",
          nota: "Creator $67/mese per video di alta qualita'",
        },
        {
          slug: "chatgpt",
          ruolo: "Creazione contenuti, strategia e automazione",
          nota: "Plus $20/mese",
        },
        {
          slug: "mailchimp",
          ruolo: "Funnel email per lancio e nurturing studenti",
          nota: "Standard $20/mese con automazioni avanzate",
        },
        {
          slug: "descript",
          ruolo: "Editing video/audio lezioni professionale",
          nota: "Pro $33/mese per editing basato su testo",
        },
      ],
    },
  },
];

// ============================================================
// HELPER: Lista completa categorie con metadati
// ============================================================

export const categorie: {
  slug: Categoria;
  nome: string;
  descrizione: string;
  icona: string;
}[] = [
  {
    slug: "scrittura",
    nome: "Scrittura & Copy",
    descrizione: "Tool AI per generare testi, articoli, copy pubblicitario e contenuti",
    icona: "PenLine",
  },
  {
    slug: "immagini",
    nome: "Immagini & Grafica",
    descrizione: "Generatori e editor di immagini potenziati da intelligenza artificiale",
    icona: "Image",
  },
  {
    slug: "video",
    nome: "Video & Animazione",
    descrizione: "Creazione e editing video con AI, avatar parlanti e effetti speciali",
    icona: "Video",
  },
  {
    slug: "codice",
    nome: "Codice & No-Code",
    descrizione: "Assistenti di programmazione AI e builder no-code per creare app e siti",
    icona: "Code",
  },
  {
    slug: "produttivita",
    nome: "Produttivita'",
    descrizione: "Task management, presentazioni, note e tool per lavorare meglio",
    icona: "Zap",
  },
  {
    slug: "marketing",
    nome: "Marketing & SEO",
    descrizione: "SEO, email marketing, advertising e analytics potenziati da AI",
    icona: "TrendingUp",
  },
  {
    slug: "ecommerce",
    nome: "E-Commerce",
    descrizione: "Piattaforme per vendere online, prodotti digitali e print-on-demand",
    icona: "ShoppingCart",
  },
  {
    slug: "audio",
    nome: "Audio & Musica",
    descrizione: "Generazione musica, voiceover, editing podcast e registrazione",
    icona: "Headphones",
  },
  {
    slug: "design",
    nome: "Design & UI/UX",
    descrizione: "Progettazione interfacce, loghi, icone e brand identity con AI",
    icona: "Palette",
  },
  {
    slug: "automazione",
    nome: "Automazione",
    descrizione: "Workflow automatizzati, integrazioni e agenti AI per il tuo business",
    icona: "Workflow",
  },
];

// ============================================================
// TOOL ESISTENTI (24 gia' nel dataset) - Riferimento slug
// ============================================================

export const toolEsistenti = [
  "chatgpt",
  "claude",
  "jasper",
  "notion-ai",
  "midjourney",
  "leonardo-ai",
  "canva",
  "photoshop-ai-firefly",
  "heygen",
  "capcut",
  "runway",
  "cursor",
  "github-copilot",
  "v0",
  "lovable",
  "zapier",
  "make",
  "surfer-seo",
  "brevo",
  "elevenlabs",
  "shopify",
  "grammarly",
  "gamma",
] as const;

// ============================================================
// CONTEGGIO FINALE
// ============================================================
// Tool esistenti: 24 (gia' nel dataset)
// Nuovi tool aggiunti: 40 (distribuiti su 10 categorie)
// Totale directory: 64 tool
//
// Distribuzione nuovi tool per categoria:
// - Scrittura: 4 (Writesonic, Copy.ai, Rytr, Anyword)
// - Immagini: 4 (Ideogram, DALL-E 3, Flux, Krea AI)
// - Video: 4 (Synthesia, Kling AI, Luma Dream Machine, Pika)
// - Codice: 4 (Bolt.new, Replit, Windsurf, Framer)
// - Produttivita': 4 (Tome, Todoist, Otter.ai, Perplexity)
// - Marketing: 4 (SEMrush, Mailchimp, AdCreative.ai, Jasper Marketing)
// - E-commerce: 4 (WooCommerce AI, Gumroad, Teachable, Printful)
// - Audio: 4 (Suno, Udio, Descript, Riverside.fm)
// - Design: 4 (Figma AI, Looka, Recraft, Designify)
// - Automazione: 4 (n8n, Bardeen, Activepieces, Relevance AI)
//
// Quiz Stack: 5 risultati x 3 tier = 15 stack totali
// - Website: Gratuito (5 tool) | Medio (4 tool) | Pro (5 tool)
// - Social: Gratuito (5 tool) | Medio (5 tool) | Pro (5 tool)
// - Email: Gratuito (4 tool) | Medio (5 tool) | Pro (5 tool)
// - E-commerce: Gratuito (4 tool) | Medio (4 tool) | Pro (5 tool)
// - Course: Gratuito (5 tool) | Medio (4 tool) | Pro (5 tool)
