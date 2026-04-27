/**
 * Edge Function: track
 * Gestisce tracking open (pixel 1x1) e click (redirect)
 *
 * GET /track?type=open&qid=xxx → pixel 1x1 trasparente + log evento
 * GET /track?type=click&qid=xxx&url=xxx → log evento + redirect
 *
 * Deploy: supabase functions deploy track --project-ref ppbbqchycxffsfavtsjp
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Pixel GIF 1x1 trasparente
const TRANSPARENT_PIXEL = new Uint8Array([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00,
  0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00,
  0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
  0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b,
]);

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const queueId = url.searchParams.get("qid");
  const redirectUrl = url.searchParams.get("url");

  if (!type || !queueId) {
    return new Response("Missing params", { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Trova subscriber_id dal queue_id
  let subscriberId: string | null = null;
  const { data: queueRow } = await supabase
    .from("email_queue")
    .select("subscriber_id")
    .eq("id", queueId)
    .single();

  if (queueRow) {
    subscriberId = queueRow.subscriber_id;
  }

  // Log evento (fire and forget per non rallentare il response)
  const eventPromise = supabase.from("email_events").insert({
    queue_id: queueId,
    subscriber_id: subscriberId,
    event_type: type === "click" ? "click" : "open",
    metadata: {
      url: redirectUrl || null,
      user_agent: req.headers.get("user-agent") || null,
      ip: req.headers.get("x-forwarded-for") || null,
    },
  });

  // Aggiorna timestamp first-open / first-click su email_queue (solo se ancora null)
  const queueUpdatePromise = (async () => {
    const col = type === "click" ? "clicked_at" : "opened_at";
    const nowIso = new Date().toISOString();
    await supabase
      .from("email_queue")
      .update({ [col]: nowIso })
      .eq("id", queueId)
      .is(col, null);
  })().catch((e) => console.error("Queue update error:", e));

  if (type === "open") {
    // Rispondi subito con pixel, logga in background
    eventPromise.catch((e) => console.error("Track open error:", e));
    queueUpdatePromise.catch(() => {});
    return new Response(TRANSPARENT_PIXEL, {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  }

  if (type === "click" && redirectUrl) {
    // Logga + aggiorna queue + redirect (in parallelo, ma non blocchiamo troppo)
    await Promise.allSettled([eventPromise, queueUpdatePromise]);
    return Response.redirect(decodeURIComponent(redirectUrl), 302);
  }

  return new Response("Invalid request", { status: 400 });
});
