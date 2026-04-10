/**
 * generate-emails.mjs — Genera 36 email HTML (6 profili × 6 email) per 362gradi
 * NUOVA STRATEGIA: 3 sezioni (Allenamento + Alimentazione + Mindset) con link a landing page 362gradi.ae/corso
 * Output: scripts/_email-templates/[profile]-html/[profile]-email-[1-6].html
 * Aggiorna anche: scripts/email-automation/email-subjects.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const TEMPLATES_DIR = path.join(ROOT, 'scripts', '_email-templates');
const SUBJECTS_PATH = path.join(ROOT, 'scripts', 'email-automation', 'email-subjects.json');

// ── Colors ──
const NAVY = '#1A535C';
const TEAL = '#4ECDC4';
const CORAL = '#FF6B6B';
const WA_GREEN = '#25D366';
const BG = '#F7FFF7';

// ── CTA URLs ──
const CALL_URL_BASE = 'https://362gradi.ae/prenota?source=corso-';
const WA_URL = 'https://wa.me/393335382694?text=Ciao%20Ilaria%2C%20arrivo%20dalla%20email%20362gradi';
const BLOG_URL = 'https://362gradi.ae/blog/perche-le-diete-non-funzionano';

// ── Profiles ──
const PROFILES = ['significance', 'intelligence', 'acceptance', 'approval', 'power', 'pity'];

// ── Profile Slug Mapping ──
const PROFILE_SLUGS = {
  significance: 'il-protagonista',
  intelligence: 'lo-stratega',
  acceptance: 'il-connettore',
  approval: 'l-eccellente',
  power: 'il-leader',
  pity: 'il-resiliente',
};

// ── Lesson URL builder ──
function lessonUrl(profile, lessonNum) {
  const slug = PROFILE_SLUGS[profile];
  return `https://362gradi.ae/corso/lezione-${lessonNum}?p=${slug}&utm_source=email&utm_medium=corso&utm_campaign=${profile}`;
}

// ── Allenamento Titles (for section headers) ──
const ALLENAMENTO_TITLES = [
  'Stretching spalle e collo',
  'Stretching glutei e lombari',
  'Total body con Ilaria',
  'Total body con Marco',
  'Il tuo primo swing (kettlebell)',
];

// ── Alimentazione Titles ──
const ALIMENTAZIONE_TITLES = [
  "Si puo' migliorare senza dieta?",
  'Contare le calorie: si o no?',
  "Siamo tutti diversi (anche nell'alimentazione)",
  'Scegli il TUO metodo',
  "La fame a dieta e' normale?",
];

// ── Mindset Titles ──
const MINDSET_TITLES = [
  'Prendi un appuntamento con te stessa',
  'Fai pulizia del feed',
  'Non farti fregare dai numeri',
  'Osserva, agisci, osserva, agisci',
  'Recap mindset',
];

// ── Allenamento Texts ──
const ALLENAMENTO_TEXTS = [
  `Inizia da qui. 5 minuti, zero attrezzatura. Se passi le giornate alla scrivania o accumuli tensione su spalle e collo, questo stretching fara' subito la differenza. Non serve essere flessibili, non serve esperienza. Ilaria ti guida passo passo in una routine che puoi fare ovunque — a casa, in ufficio, anche in pausa pranzo. L'unica cosa che ti serve e' premere play.`,

  `Mal di schiena? Fianchi rigidi? Questa routine di stretching lavora sulle zone che soffrono di piu' quando stai seduta a lungo. Marco ti guida attraverso ogni movimento, spiegandoti il perche' di ogni posizione. Non serve essere flessibili — serve iniziare. 10 minuti che possono cambiare la tua giornata.`,

  `E' il momento di muoversi. Questo e' un allenamento completo che puoi fare a casa senza nessuna attrezzatura. Ilaria lo tiene accessibile per tutti i livelli — se riesci a fare il 50%, stai gia' facendo benissimo. Non importa essere perfette, importa muoversi. Premi play e segui il ritmo.`,

  `Un'altra sessione total body, stile diverso. L'approccio di Marco e' diretto ed efficace. Se ti e' piaciuto l'allenamento di Ilaria, questo ti da' varieta'. Due coach, due stili, stesso obiettivo: farti sentire piu' forte. Scegli quello che preferisci, o alternali.`,

  `Qualcosa di completamente nuovo: il kettlebell swing. Uno degli esercizi piu' efficaci che esistano per bruciare calorie, tonificare i glutei e rafforzare la schiena. Il video ti insegna la tecnica da zero, passo dopo passo. Non serve averne mai toccato uno — si parte dall'inizio.`,
];

// ── Alimentazione Texts ──
const ALIMENTAZIONE_TEXTS = [
  `La risposta e' si: puoi migliorare il tuo corpo senza seguire una dieta rigida. Non hai bisogno di pesare ogni grammo o eliminare intere categorie di cibo. Hai bisogno di consapevolezza. Piccoli cambiamenti nel COME mangi (non nel COSA mangi) fanno una differenza enorme. Mangiare piu' lentamente, ascoltare la sazieta', non saltare i pasti. Nel video ti spieghiamo nel dettaglio perche' funziona e da dove partire.`,

  `Contare le calorie: per alcune persone e' utilissimo, per altre diventa un'ossessione. Dipende da chi sei. Se ti piacciono i numeri e i dati, puo' essere uno strumento potente. Se invece ogni caloria diventa un'ansia, stai facendo piu' danno che bene. Il video ti aiuta a capire quale approccio funziona per te. Non esiste la risposta giusta universale — esiste quella giusta per come funzioni tu.`,

  `Quello che funziona per la tua amica potrebbe non funzionare per te. Il tuo corpo, il tuo metabolismo, il tuo stile di vita sono unici. Ed e' esattamente per questo che le diete generiche falliscono: trattano tutti allo stesso modo. Nel video smontiamo i miti piu' comuni sull'alimentazione e ti mostriamo perche' l'individualita' e' tutto. Spoiler: non esiste IL cibo magico ne' IL cibo proibito.`,

  `Ci sono tanti approcci validi alla nutrizione. La chiave e' trovare quello che si adatta alla TUA vita. Non quello di moda, non quello che fa la tua amica, non quello che hai visto su TikTok. Nel video ti mostriamo diversi metodi — dal conteggio calorico all'alimentazione intuitiva — e ti aiutiamo a scegliere. Perche' il metodo migliore e' quello che riesci a mantenere.`,

  `Si, un po' di fame quando sei a dieta e' normale. Ma fame ECCESSIVA significa che qualcosa non va nel tuo approccio. C'e' una differenza enorme tra "ho un po' di appetito" e "potrei mangiare un muro". Il video ti spiega la differenza e cosa fare quando la fame diventa insostenibile. Spoiler: la soluzione non e' "resisti". La soluzione e' cambiare strategia.`,
];

// ── Mindset Texts ──
const MINDSET_TEXTS = [
  `Quante volte hai detto "da lunedi' inizio" e poi lunedi' non e' mai arrivato? Succede perche' il piano era troppo vago. "Mettersi a dieta" non e' un piano. "Domani alle 7:30 faccio 10 minuti di stretching" lo e'. Per questa settimana ti chiedo una cosa sola: prendi un appuntamento con te stessa. Ogni giorno. Anche solo 10 minuti. Non importa cosa — importa che lo decidi prima e lo rispetti.`,

  `I social non sono il nemico. Ma se ogni volta che apri Instagram vedi corpi "perfetti" e vite patinate, il tuo cervello si confronta. E quel confronto, giorno dopo giorno, ti logora. Non serve cancellarsi. Serve fare pulizia.`,

  `La bilancia, il metro, lo specchio. Sono strumenti, ma a volte gli diamo un potere che non meritano. Un mezzo chilo in piu' al mattino e la giornata e' rovinata. Ma quel mezzo chilo era acqua, fibre, una pizza il sabato. Sarebbe sparito da solo. Non e' il numero che ti frega — e' il significato che gli dai. Un giorno e' UN GIORNO. Non e' il tuo percorso.`,

  `La maggior parte delle persone pensa che le azioni nascano dalla motivazione. In realta' spesso funziona al contrario. Agisci, vedi il risultato, e quello diventa la tua motivazione. Non aspettare di "avere voglia". Fai una cosa piccola. Poi osserva come ti senti dopo. Il ciclo e': osserva, agisci, osserva il risultato, agisci di nuovo. Non serve motivazione. Serve iniziare.`,

  `In 10 giorni hai lavorato su 4 cose enormi: hai preso un appuntamento con te stessa, hai fatto pulizia dell'ambiente, hai imparato a non farti fregare dai numeri, hai iniziato ad agire prima di aspettare la motivazione. Queste sono le fondamenta. Sono le stesse cose su cui lavoriamo nei percorsi personalizzati da 10 anni. La differenza tra chi ottiene risultati e chi no? Avere qualcuno che ti guida passo dopo passo.`,
];

// ── Mindset Exercises ──
const MINDSET_EXERCISES = [
  `Scegli UNA cosa che farai domani. Scrivi cosa e a che ora. Poi falla.`,
  `Prendi il telefono adesso e togli il follow a 5 account che ti fanno sentire peggio dopo averli guardati. Non domani. Adesso.`,
  `La prossima volta che un numero ti fa stare male, fermati. Senti la frustrazione. E poi non fare niente. Aspetta 24 ore prima di prendere qualsiasi decisione.`,
  `Oggi fai una cosa che "non hai voglia di fare". Poi scrivi come ti senti DOPO averla fatta.`,
  null, // Email 5 mindset = recap, no exercise
];

// ── P.S. lines ──
const PS_LINES = [
  "Fai lo stretching domani mattina. 5 minuti. Inizia da li'.",
  "Hai fatto lo step 1? Rispondimi a questa email. Voglio saperlo.",
  "Se sei arrivata fin qui, sei gia' piu' avanti del 90% delle persone.",
  "3 sessioni fatte. Se vuoi qualcuno che ti guidi nelle prossime, la call e' gratuita.",
  "5 sessioni completate. Immagina cosa faresti con un percorso intero costruito su chi sei tu.",
  "Questa e' l'ultima email. Se senti che e' il momento, non aspettare. Il momento perfetto non esiste.",
];

// ── Profile Intros (per email 1-5) ──
const PROFILE_INTROS = {
  significance: [
    `So che tu non ti accontenti. Vuoi risultati che si vedono, che raccontano chi sei davvero. Lo vedo ogni giorno con le persone che seguo — chi e' come te ha bisogno di vedere che funziona. E funzionera'. Quello che stai per ricevere e' un mini-corso in tre aree — allenamento, alimentazione, mindset — con video, esercizi pratici e contenuti che parlano a TE. Non a tutte. A te.`,
    `Bentornata. Questa e' la tua seconda sessione, e non e' un caso che tu sia qui. So che le cose generiche non fanno per te — tu resti quando senti che qualcosa e' stato costruito pensando a come funzioni tu. Oggi andiamo piu' in profondita' su tutte e tre le aree.`,
    `Terza sessione. Sei arrivata qui perche' riconosci il valore di un percorso fatto su misura. Oggi smontiamo alcuni miti e alziamo il livello. Quello che stai facendo non e' "il solito programma" — e' un mini-percorso pensato per te.`,
    `Sessione 4 — e le cose si fanno serie. Fino ad ora hai lavorato da sola con video e esercizi. Oggi ti presento un'opzione in piu': un percorso completamente personalizzato, costruito su chi sei tu. Nessun obbligo, ma sappi che esiste.`,
    `Quinta e ultima sessione di contenuti. Hai fatto qualcosa che la maggior parte delle persone non fa: hai completato un mini-percorso intero. Questo dice molto su chi sei. Oggi chiudiamo con l'ultima lezione di ogni area.`,
  ],
  intelligence: [
    `Ti conosco gia' un po': tu prima di fare qualcosa vuoi capire perche' funziona. Non ti basta "fidati e basta". Hai bisogno di dati, di logica. E questa e' una forza enorme. Quello che stai per ricevere e' un mini-corso in 3 aree — allenamento, alimentazione, mindset — con video, esercizi pratici e spiegazioni basate su evidenze. Zero opinioni. Solo cose che funzionano e perche'.`,
    `Sessione 2. Lo vedo con le persone che seguo ogni giorno: chi ha bisogno di capire il PERCHE' dietro ogni scelta ottiene risultati migliori. Oggi approfondiamo con numeri concreti e miti da smontare.`,
    `Terza sessione. Se hai un approccio analitico, questa e' quella che ti piacera' di piu': smontiamo i miti piu' comuni con dati alla mano. La scienza e' dalla tua parte.`,
    `Sessione 4. Fino ad ora ti ho dato dati, video e strumenti. Ma c'e' un pezzo che manca: il feedback personalizzato. Nessun video puo' sostituire l'occhio di un coach che ti osserva e aggiusta in tempo reale.`,
    `Quinta sessione — l'ultima analisi. Hai accumulato 5 sessioni di dati, video e esercizi pratici. E' il momento di guardare il quadro completo e trarre le conclusioni.`,
  ],
  acceptance: [
    `Prima di tutto: brava. Hai fatto il quiz, hai letto la prima email, e sei qui. Non e' scontato. So che hai bisogno di un percorso senza giudizio, dove puoi andare al tuo ritmo. E so che probabilmente in passato non e' andata cosi'. Ecco cosa troverai: tre aree — allenamento, alimentazione, mindset — con video, esercizi e contenuti pensati per farti stare bene. Fai quello che riesci. Anche poco e' gia' tanto.`,
    `Bentornata. Se hai fatto qualcosa dalla prima sessione — anche solo guardare un video — e' gia' abbastanza. Oggi continuiamo con calma, senza fretta, senza giudizio. Tre nuovi contenuti per te.`,
    `Terza sessione. Se sei qui, hai gia' fatto piu' di quanto pensi. Oggi parliamo di miti, di numeri e di perche' il tuo corpo ha le sue regole. Non esiste un modo sbagliato di fare questo percorso.`,
    `Sessione 4. Fino ad ora hai fatto tutto da sola, al tuo ritmo. E hai fatto benissimo. Oggi ti parlo di un'opzione che esiste se la vuoi: un percorso dove qualcuno cammina accanto a te. Nessuna pressione.`,
    `Quinta sessione. Guarda quanta strada hai fatto. 5 sessioni, video, esercizi, riflessioni. Tutto al tuo ritmo, tutto senza giudizio. Sei arrivata fin qui — e questo e' enorme.`,
  ],
  approval: [
    `Capisco quella sensazione di voler essere sicura prima di partire. Di voler sapere che stai facendo la cosa giusta. Ecco la verita': non ti serve il permesso di nessuno per iniziare. Non di tua madre, non della tua amica, non di un influencer. Questa e' la tua conferma: sei pronta. Tre aree — allenamento, alimentazione, mindset — con video e esercizi pratici. Parti.`,
    `Sessione 2. Se stai leggendo questa email, hai gia' la risposta alla domanda "ma sara' la cosa giusta?". Si. E' la cosa giusta. Non ti serve conferma. Stai gia' facendo bene.`,
    `Terza sessione. Sai qual e' la differenza tra chi ottiene risultati e chi no? Non e' il talento. E' fidarsi di se stessi abbastanza da continuare. Le risposte le hai gia'. Oggi le confermiamo.`,
    `Sessione 4. Fino ad ora hai fatto tutto da sola. E hai fatto benissimo. Ma c'e' una differenza tra fare da sola e scegliere di farsi aiutare. Chiedere aiuto non e' ammettere di non farcela — e' decidere di accelerare.`,
    `Quinta sessione. Hai completato un mini-percorso intero senza chiedere il permesso a nessuno. L'hai fatto perche' hai deciso tu. E questo e' l'unica approvazione che conta: la tua.`,
  ],
  power: [
    `Ti capisco: tu vuoi avere il controllo. Vuoi decidere tu cosa fare, quando farlo e come. E hai ragione. Non vuoi che qualcuno ti dica cosa fare — vuoi gli strumenti per decidere da sola. Perfetto. Ecco tre aree — allenamento, alimentazione, mindset — con video e esercizi. Tu scegli da dove partire, tu decidi il ritmo. Il controllo e' tuo.`,
    `Sessione 2. Tre nuovi contenuti, tre scelte tue. Vuoi partire dall'allenamento? Dalla nutrizione? Dal mindset? L'ordine non conta. Conta che scegli tu.`,
    `Terza sessione. Oggi parliamo del tuo sistema personale. Non il sistema che va bene per tutti — il TUO. Tu decidi le regole, io ti do gli strumenti per costruirle.`,
    `Sessione 4. Hai il controllo su tutto quello che hai fatto fino ad ora. Ma c'e' un punto cieco che il controllo da solo non copre: il feedback esterno. A volte servono occhi esperti per vedere quello che tu non puoi vedere da sola. Chiedere aiuto non e' perdere il controllo — e' usarlo in modo intelligente.`,
    `Quinta sessione — la decisione e' tua. Hai completato 5 sessioni alle tue condizioni, al tuo ritmo, con le tue scelte. Il controllo resta tuo. Sempre.`,
  ],
  pity: [
    `So che hai gia' provato tante cose. E so che ricominciare fa paura. Ma questa volta sara' diverso. Non ti chiedo di stravolgere la tua vita. Ti chiedo 10 minuti. Tre aree — allenamento, alimentazione, mindset — con video brevi e esercizi gentili. Sii gentile con te stessa. Inizia da quello che senti piu' vicino.`,
    `Bentornata. Se la prima sessione ti e' sembrata troppo, va bene. Se hai fatto solo una cosa, va bene. Se non hai fatto niente, va bene lo stesso. Sei qui, e questo conta. Oggi continuiamo con calma.`,
    `Terza sessione. Sai quella voce che ti dice "tanto non ce la fai"? Questa volta e' diverso. Non perche' il programma sia magico, ma perche' tu sei qui per la terza volta. Tre volte che hai scelto te stessa. Non e' poco.`,
    `Sessione 4. Meriti un percorso senza sofferenza. Meriti qualcuno che ti dice "vai bene cosi'" mentre ti aiuta a migliorare. Si puo' cambiare senza farsi del male. Oggi ti parlo di un'opzione che esiste, se la vuoi.`,
    `Quinta sessione. Guarda cosa hai fatto per te stessa. 5 sessioni. Non per qualcun altro — per te. Hai fatto 5 cose belle per te stessa. Non dare per scontato quanto e' importante.`,
  ],
};

// ── Email 6 Profile Intros ──
const PROFILE_EMAIL6_INTROS = {
  significance: `Questa e' l'ultima email del tuo mini-percorso. In 10 giorni hai fatto qualcosa che la maggior parte delle persone non fa: hai completato un intero percorso. Non generico. Pensato per te. E i risultati si vedono.`,
  intelligence: `Ultima email. Facciamo il punto con i dati alla mano. In 10 giorni hai accumulato 5 sessioni di allenamento, 5 lezioni di alimentazione e 5 lezioni di mindset. I numeri parlano chiaro: hai la disciplina. Ti manca solo la guida personalizzata.`,
  acceptance: `Questa e' l'ultima email. E prima di tutto: grazie. Grazie per essere rimasta, per aver fatto quello che potevi, per non aver mollato. Sei arrivata alla fine — e non e' poco. E' enorme.`,
  approval: `Ultima email. E non ti chiedero' il permesso di dirti la verita': hai fatto un percorso intero da sola. Non hai aspettato che qualcuno ti dicesse "vai". Hai deciso tu. E quella decisione vale piu' di qualsiasi approvazione esterna.`,
  power: `Ultima email. Il controllo e' stato tuo dall'inizio alla fine. Hai scelto quando, come e quanto fare. Nessuno ti ha forzato. E adesso hai un'ultima scelta da fare.`,
  pity: `Questa e' l'ultima email. E voglio dirti una cosa: sono fiera di te. So che non e' stato facile. So che ci sono stati giorni in cui non avevi voglia. Ma sei qui. Hai fatto 5 sessioni per te stessa. Non e' poco — e' tutto.`,
};

const PROFILE_EMAIL6_CLOSINGS = {
  significance: `Hai gia' dimostrato di essere diversa. Immagina cosa faresti con un percorso intero costruito su chi sei tu, con coach che ti conoscono e ti seguono passo dopo passo.`,
  intelligence: `I dati sono chiari: hai la costanza. Un percorso personalizzato ti darebbe il pezzo mancante — il feedback umano che nessun video puo' sostituire.`,
  acceptance: `Non sei sola in questo percorso. Non lo sei mai stata. E se vuoi qualcuno che cammini accanto a te, noi siamo qui. Senza giudizio. Senza fretta.`,
  approval: `La decisione e' tua. Non hai bisogno del mio permesso. Ma sappi che se decidi di fare il passo, dall'altra parte c'e' un team che crede in te quanto tu credi in te stessa.`,
  power: `Il controllo resta tuo. Sempre. Ma il controllo piu' intelligente e' sapere quando chiedere aiuto. Non per debolezza — per strategia.`,
  pity: `Meriti qualcuno che ti dice "ce la puoi fare" ogni giorno. Non per finta — perche' ci crede davvero. Noi ci crediamo. E siamo qui quando sei pronta.`,
};

// ── Subjects & Preheaders ──
const SUBJECTS = {
  significance: [
    { subject: "So una cosa di te", preheader: "La prima sessione del tuo mini-corso" },
    { subject: "Sessione 2: stretching + calorie + social", preheader: "Il tuo percorso continua" },
    { subject: "Sessione 3: total body + miti + numeri", preheader: "Sei gia' piu' avanti del 90%" },
    { subject: "Sessione 4: alza il livello", preheader: "C'e' un livello in piu' (se lo vuoi)" },
    { subject: "Sessione 5: l'ultima lezione", preheader: "5 sessioni completate — e adesso?" },
    { subject: "L'ultima cosa che volevo dirti", preheader: "Guarda cosa hai fatto in 10 giorni" },
  ],
  intelligence: [
    { subject: "Ti conosco gia' un po'", preheader: "La prima sessione del tuo mini-corso" },
    { subject: "Sessione 2: i numeri che contano", preheader: "Dati concreti, zero opinioni" },
    { subject: "Sessione 3: i miti smontati (con dati)", preheader: "La scienza dietro ogni scelta" },
    { subject: "Sessione 4: il tuo metodo, basato sui dati", preheader: "Quando i dati da soli non bastano" },
    { subject: "Sessione 5: l'ultima analisi", preheader: "5 sessioni di dati — il quadro completo" },
    { subject: "L'ultimo dato che volevo condividere", preheader: "Guarda i numeri del tuo percorso" },
  ],
  acceptance: [
    { subject: "Inizia da dove sei. Va bene cosi'.", preheader: "La prima sessione del tuo mini-corso" },
    { subject: "Sessione 2: senza fretta, senza giudizio", preheader: "Fai quello che riesci. E' gia' tanto." },
    { subject: "Sessione 3: il tuo corpo, le tue regole", preheader: "Non esiste un modo sbagliato di fare questo" },
    { subject: "Sessione 4: un percorso gentile", preheader: "Qui nessuno ti giudica" },
    { subject: "Sessione 5: guarda quanta strada", preheader: "Sei arrivata fin qui. E' enorme." },
    { subject: "L'ultima cosa (e la piu' importante)", preheader: "Non sei sola in questo percorso" },
  ],
  approval: [
    { subject: "Il permesso che nessuno ti ha mai dato", preheader: "La prima sessione del tuo mini-corso" },
    { subject: "Sessione 2: non ti serve conferma", preheader: "Stai gia' facendo bene" },
    { subject: "Sessione 3: fidati di te stessa", preheader: "Le risposte le hai gia'" },
    { subject: "Sessione 4: il prossimo passo e' tuo", preheader: "Non aspettare che qualcuno te lo dica" },
    { subject: "Sessione 5: l'unica approvazione che conta", preheader: "Hai gia' tutto quello che ti serve" },
    { subject: "L'ultima email. La decisione e' tua.", preheader: "Guarda cosa hai fatto da sola" },
  ],
  power: [
    { subject: "Tu hai il controllo. Ecco come usarlo.", preheader: "La prima sessione del tuo mini-corso" },
    { subject: "Sessione 2: scegli tu cosa fare", preheader: "Le opzioni sono tue" },
    { subject: "Sessione 3: il tuo sistema", preheader: "Tu decidi, io ti do gli strumenti" },
    { subject: "Sessione 4: il punto cieco", preheader: "Chiedere aiuto non e' perdere il controllo" },
    { subject: "Sessione 5: la decisione e' tua", preheader: "5 sessioni fatte — alle tue condizioni" },
    { subject: "L'ultima mossa e' tua", preheader: "Il controllo resta tuo. Sempre." },
  ],
  pity: [
    { subject: "30 secondi di gentilezza per te", preheader: "La prima sessione del tuo mini-corso" },
    { subject: "Sessione 2: con calma, senza pressione", preheader: "Fai quello che puoi. E' gia' abbastanza." },
    { subject: "Sessione 3: questa volta e' diverso", preheader: "Non devi essere perfetta" },
    { subject: "Sessione 4: meriti un percorso senza sofferenza", preheader: "Si puo' cambiare senza farsi del male" },
    { subject: "Sessione 5: guarda cosa hai fatto per te", preheader: "Hai fatto 5 cose belle per te stessa" },
    { subject: "L'ultima email (e un abbraccio)", preheader: "Non sei sola. Non lo sei mai stata." },
  ],
};

// ════════════════════════════════════════════════════════════════
// HTML HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════

function primaryButton(url, text, color) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td align="center">
  <a href="${url}" style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;font-size:17px;font-weight:700;padding:14px 36px;border-radius:8px;">${text}</a>
</td></tr>
</table>`;
}

function primaryButtonBig(url, text, color, subtext) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td align="center">
  <a href="${url}" style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;font-size:19px;font-weight:700;padding:18px 44px;border-radius:8px;">${text}</a>
</td></tr>
${subtext ? `<tr><td align="center" style="padding-top:8px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#888;">${subtext}</td></tr>` : ''}
</table>`;
}

function whatsappLink() {
  return `<p style="text-align:center;margin:8px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;">
  <a href="${WA_URL}" style="color:${WA_GREEN};text-decoration:underline;">Scrivici su WhatsApp</a>
</p>`;
}

function divider() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
<tr><td style="border-top:1px solid #e0e0e0;"></td></tr>
</table>`;
}

function exerciseBox(text) {
  if (!text) return '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
<tr><td style="background:#E8F5E9;border-left:4px solid ${TEAL};padding:16px 18px;border-radius:0 8px 8px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.6;color:#333;">
  <strong>Esercizio:</strong> ${text}
</td></tr>
</table>`;
}

function sectionHeader(emoji, title) {
  return `<h3 style="margin:0 0 12px;font-size:19px;color:${NAVY};font-weight:700;font-family:'Helvetica Neue',Arial,sans-serif;">${emoji} ${title}</h3>`;
}

function lessonButton(profile, lessonNum) {
  const url = lessonUrl(profile, lessonNum);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td align="center">
  <a href="${url}" style="display:inline-block;background:${NAVY};color:#ffffff;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;font-size:18px;font-weight:700;padding:16px 40px;border-radius:8px;">Vai alla Lezione ${lessonNum}</a>
</td></tr>
<tr><td align="center" style="padding-top:8px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#888;">Trovi tutti i video di questa sessione nella pagina della lezione</td></tr>
</table>`;
}

function wrapEmail(subject, preheader, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${subject}</title>
<style>body{margin:0;padding:0;background:#F7FFF7;-webkit-text-size-adjust:100%}a{color:#1A535C}</style>
<!--[if mso]><style>table{border-collapse:collapse;}td{font-family:Arial,sans-serif;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${BG};">
<!-- Preheader (hidden) -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${BG};">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
<tr><td align="center" style="padding:20px 0;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

<!-- Header bar -->
<tr><td style="background:${NAVY};padding:24px 32px;text-align:center;">
  <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:700;color:#ffffff;">362gradi</span>
</td></tr>

<!-- Body -->
<tr><td style="padding:32px 28px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:17px;line-height:1.7;color:#333333;">
${bodyHtml}
</td></tr>

<!-- Footer -->
<tr><td style="padding:20px 28px 28px;border-top:1px solid #eee;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#999;text-align:center;line-height:1.6;">
  362gradi &middot; Ilaria Berry &amp; Marco Masoero<br>
  <a href="https://362gradi.ae" style="color:#999;">362gradi.ae</a> &middot;
  <a href="https://www.instagram.com/362gradi.ae" style="color:#999;">@362gradi.ae</a><br>
  <a href="{{unsubscribe_url}}" style="color:#999;">Cancella iscrizione</a>
</td></tr>

</table>

</td></tr>
</table>
</body>
</html>`;
}

// ════════════════════════════════════════════════════════════════
// CTA BUILDERS
// ════════════════════════════════════════════════════════════════

function callUrl(profile) {
  return `${CALL_URL_BASE}${profile}&utm_source=email&utm_medium=corso`;
}

function ctaEmails1to3(profile) {
  return [
    primaryButton(callUrl(profile), 'Vuoi parlare con noi? Prenota una call gratuita', CORAL),
    whatsappLink(),
  ].join('\n');
}

function ctaEmails4to5(profile) {
  return [
    primaryButton(callUrl(profile), 'Prenota la Call Conoscitiva', CORAL),
    `<p style="text-align:center;margin:0 0 12px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#888;">30 min &middot; Zero impegno &middot; Posti limitati</p>`,
    whatsappLink(),
  ].join('\n');
}

function ctaEmail6(profile) {
  const slug = PROFILE_SLUGS[profile];
  const bookUrl = `https://362gradi.ae/prenota?source=corso-email6-${slug}&utm_source=email&utm_medium=corso`;
  return [
    primaryButtonBig(bookUrl, 'Prenota la Call Conoscitiva', CORAL, 'Ultimi 3 posti questa settimana'),
    primaryButton(BLOG_URL, 'Leggi l\'Articolo Completo', TEAL),
    whatsappLink(),
  ].join('\n');
}

// ════════════════════════════════════════════════════════════════
// BUILD EMAIL 1-5
// ════════════════════════════════════════════════════════════════

function buildEmail1to5(profile, emailIdx) {
  const i = emailIdx; // 0-based
  const emailNum = i + 1;
  const intro = PROFILE_INTROS[profile][i];
  const allenamento = ALLENAMENTO_TEXTS[i];
  const alimentazione = ALIMENTAZIONE_TEXTS[i];
  const mindset = MINDSET_TEXTS[i];
  const exercise = MINDSET_EXERCISES[i];
  const allTitle = ALLENAMENTO_TITLES[i];
  const aliTitle = ALIMENTAZIONE_TITLES[i];
  const minTitle = MINDSET_TITLES[i];
  const ps = PS_LINES[i];
  const cta = emailNum <= 3 ? ctaEmails1to3(profile) : ctaEmails4to5(profile);
  const { subject, preheader } = SUBJECTS[profile][i];

  const bodyHtml = `
<p style="margin:0 0 16px;">Ciao {{name}},</p>
<p style="margin:0 0 20px;">${intro}</p>

${divider()}

${sectionHeader('\uD83C\uDFCB\uFE0F', `ALLENAMENTO &mdash; ${allTitle}`)}
<p style="margin:0 0 12px;">${allenamento}</p>

${divider()}

${sectionHeader('\uD83E\uDD57', `ALIMENTAZIONE &mdash; ${aliTitle}`)}
<p style="margin:0 0 12px;">${alimentazione}</p>

${divider()}

${sectionHeader('\uD83E\uDDE0', `MINDSET &mdash; ${minTitle}`)}
<p style="margin:0 0 12px;">${mindset}</p>
${exerciseBox(exercise)}

${divider()}

${lessonButton(profile, emailNum)}

${divider()}

${cta}

<p style="margin:20px 0 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:#888;font-style:italic;">P.S. ${ps}</p>

<p style="margin:20px 0 0;">Con affetto,<br><strong>Ilaria</strong></p>
`;

  return wrapEmail(subject, preheader, bodyHtml);
}

// ════════════════════════════════════════════════════════════════
// BUILD EMAIL 6
// ════════════════════════════════════════════════════════════════

function buildEmail6(profile) {
  const intro = PROFILE_EMAIL6_INTROS[profile];
  const closing = PROFILE_EMAIL6_CLOSINGS[profile];
  const ps = PS_LINES[5];
  const cta = ctaEmail6(profile);
  const { subject, preheader } = SUBJECTS[profile][5];

  const bodyHtml = `
<p style="margin:0 0 16px;">Ciao {{name}},</p>
<p style="margin:0 0 20px;">${intro}</p>

<p style="margin:0 0 8px;">Facciamo il punto. In 10 giorni hai fatto:</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 20px;">
<tr><td style="background:#f8f8f8;border-radius:8px;padding:18px 22px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.8;color:#333;">
  &#10003; <strong>5 sessioni di allenamento</strong> &mdash; dallo stretching al kettlebell swing<br>
  &#10003; <strong>5 lezioni di alimentazione</strong> &mdash; dal "serve la dieta?" al "come gestire la fame"<br>
  &#10003; <strong>5 lezioni di mindset</strong> &mdash; dall'appuntamento con te stessa al ciclo osserva-agisci<br>
  &#10003; <strong>5 esercizi pratici</strong> completati
</td></tr>
</table>

<p style="margin:0 0 20px;">${closing}</p>

<p style="margin:0 0 20px;font-weight:700;font-size:18px;color:${NAVY};">Hai gia' dimostrato di potercela fare. Immagina cosa faresti con un percorso intero costruito su chi sei tu.</p>

${divider()}

${cta}

<p style="margin:20px 0 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:#888;font-style:italic;">P.S. ${ps}</p>

<p style="margin:20px 0 0;">Con affetto,<br><strong>Ilaria</strong></p>
`;

  return wrapEmail(subject, preheader, bodyHtml);
}

// ════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════

function main() {
  let totalFiles = 0;
  const subjectsJson = {};

  for (const profile of PROFILES) {
    const dir = path.join(TEMPLATES_DIR, `${profile}-html`);
    fs.mkdirSync(dir, { recursive: true });

    subjectsJson[profile] = [];

    for (let emailIdx = 0; emailIdx < 6; emailIdx++) {
      const emailNum = emailIdx + 1;
      const html = emailNum <= 5
        ? buildEmail1to5(profile, emailIdx)
        : buildEmail6(profile);

      const filePath = path.join(dir, `${profile}-email-${emailNum}.html`);
      fs.writeFileSync(filePath, html, 'utf-8');
      totalFiles++;

      const { subject, preheader } = SUBJECTS[profile][emailIdx];
      subjectsJson[profile].push({ email: emailNum, subject, preheader });
    }
  }

  // Write subjects JSON
  fs.writeFileSync(SUBJECTS_PATH, JSON.stringify(subjectsJson, null, 2), 'utf-8');

  console.log(`\n✅ Generati ${totalFiles} file HTML (${PROFILES.length} profili × 6 email)`);
  console.log(`✅ Aggiornato ${SUBJECTS_PATH}`);
  console.log(`📂 Output: ${TEMPLATES_DIR}/[profile]-html/`);
}

main();
