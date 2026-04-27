/**
 * Edge Function: unsubscribe
 * Gestisce la disiscrizione via link email.
 * GET /unsubscribe?email=xxx → pagina conferma
 * POST /unsubscribe?email=xxx → esegue disiscrizione
 *
 * Deploy: supabase functions deploy unsubscribe --project-ref ppbbqchycxffsfavtsjp
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const queueId = url.searchParams.get("qid");

  if (!email) {
    return new Response("Email mancante", { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // One-Click Unsubscribe (RFC 8058) — POST diretto
  if (req.method === "POST") {
    return await doUnsubscribe(supabase, email, queueId);
  }

  // GET → mostra pagina conferma con auto-submit
  if (req.method === "GET") {
    // Esegui direttamente l'unsubscribe (UX migliore, 1 click)
    const result = await doUnsubscribe(supabase, email, queueId);
    if (result.status === 200) {
      return new Response(UNSUBSCRIBE_HTML, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
    return result;
  }

  return new Response("Method not allowed", { status: 405 });
});

async function doUnsubscribe(
  supabase: ReturnType<typeof createClient>,
  email: string,
  queueId: string | null
): Promise<Response> {
  // Aggiorna subscriber
  const { data, error } = await supabase
    .from("email_subscribers")
    .update({
      status: "unsubscribed",
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("email", email)
    .eq("status", "active")
    .select("id");

  if (error) {
    console.error("Errore unsubscribe:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Log evento
  if (data && data.length > 0) {
    await supabase.from("email_events").insert({
      queue_id: queueId || null,
      subscriber_id: data[0].id,
      event_type: "unsubscribe",
      metadata: { email, method: "link" },
    });
  }

  console.log(`🚫 Unsubscribed: ${email}`);
  return Response.json({ ok: true });
}

const UNSUBSCRIBE_HTML = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Disiscrizione — 362gradi</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F7FFF7; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
  .card { background: #fff; border-radius: 16px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  h1 { color: #1A535C; font-size: 28px; margin: 0 0 16px; }
  p { color: #555; font-size: 18px; line-height: 1.6; margin: 0 0 24px; }
  .logo { font-size: 36px; font-weight: 800; color: #1A535C; margin-bottom: 24px; }
  .logo span { font-weight: 300; }
  a { color: #4ECDC4; text-decoration: none; font-weight: 600; }
</style>
</head>
<body>
<div class="card">
  <div class="logo">362<span>gradi</span></div>
  <h1>Ti abbiamo disiscritto</h1>
  <p>Non riceverai più email da noi.<br>Se hai cambiato idea, puoi sempre riscriverti su <a href="https://362gradi.ae">362gradi.ae</a></p>
  <p style="color:#999;font-size:14px;">Ci mancherai! 💚</p>
</div>
</body>
</html>`;
