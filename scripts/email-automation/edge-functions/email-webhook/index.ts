/**
 * Edge Function: email-webhook
 * Riceve webhook da Resend (delivered, opened, clicked, bounced, complained)
 * e logga eventi in email_events.
 *
 * Configurare su Resend Dashboard → Webhooks:
 * URL: https://ppbbqchycxffsfavtsjp.supabase.co/functions/v1/email-webhook
 * Events: email.delivered, email.opened, email.clicked, email.bounced, email.complained
 *
 * Deploy: supabase functions deploy email-webhook --project-ref ppbbqchycxffsfavtsjp
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_WEBHOOK_SECRET = Deno.env.get("RESEND_WEBHOOK_SECRET") || "";

// Mappa eventi Resend → nostri tipi
const EVENT_MAP: Record<string, string> = {
  "email.delivered": "delivered",
  "email.opened": "open",
  "email.clicked": "click",
  "email.bounced": "bounce",
  "email.complained": "complaint",
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const eventType = body.type;

    // Verifica che sia un evento che ci interessa
    const mappedType = EVENT_MAP[eventType];
    if (!mappedType) {
      return Response.json({ ignored: true, type: eventType });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const emailData = body.data;

    // Trova queue_id dal header X-Queue-Id o dal resend_id
    let queueId: string | null = null;
    let subscriberId: string | null = null;

    // Prova prima con l'header custom
    const headers = emailData.headers || [];
    const qidHeader = headers.find(
      (h: { name: string; value: string }) => h.name === "X-Queue-Id"
    );
    if (qidHeader) {
      queueId = qidHeader.value;
    }

    // Fallback: cerca per resend_id
    if (!queueId && emailData.email_id) {
      const { data: queueRow } = await supabase
        .from("email_queue")
        .select("id, subscriber_id")
        .eq("resend_id", emailData.email_id)
        .single();

      if (queueRow) {
        queueId = queueRow.id;
        subscriberId = queueRow.subscriber_id;
      }
    }

    // Se abbiamo queue_id, trova subscriber_id
    if (queueId && !subscriberId) {
      const { data: queueRow } = await supabase
        .from("email_queue")
        .select("subscriber_id")
        .eq("id", queueId)
        .single();

      if (queueRow) {
        subscriberId = queueRow.subscriber_id;
      }
    }

    // Fallback: cerca subscriber per email
    if (!subscriberId && emailData.to?.[0]) {
      const { data: sub } = await supabase
        .from("email_subscribers")
        .select("id")
        .eq("email", emailData.to[0])
        .single();

      if (sub) {
        subscriberId = sub.id;
      }
    }

    // Inserisci evento
    const { error: insertError } = await supabase
      .from("email_events")
      .insert({
        queue_id: queueId,
        subscriber_id: subscriberId,
        event_type: mappedType,
        metadata: {
          resend_event: eventType,
          email_id: emailData.email_id,
          to: emailData.to,
          click_url: emailData.click?.url || null,
          bounce_type: emailData.bounce?.type || null,
          timestamp: body.created_at,
        },
      });

    if (insertError) {
      console.error("Errore inserimento evento:", insertError);
    }

    // Aggiorna email_queue.opened_at / clicked_at sul primo evento (solo se null)
    if (queueId && (mappedType === "open" || mappedType === "click")) {
      const col = mappedType === "click" ? "clicked_at" : "opened_at";
      await supabase
        .from("email_queue")
        .update({ [col]: new Date().toISOString() })
        .eq("id", queueId)
        .is(col, null);
    }

    // Se bounce o complaint → aggiorna subscriber status
    if (mappedType === "bounce" && subscriberId) {
      await supabase
        .from("email_subscribers")
        .update({ status: "bounced" })
        .eq("id", subscriberId);
    }

    if (mappedType === "complaint" && subscriberId) {
      await supabase
        .from("email_subscribers")
        .update({ status: "complained" })
        .eq("id", subscriberId);
    }

    console.log(
      `📨 Webhook: ${mappedType} — queue=${queueId} sub=${subscriberId}`
    );

    return Response.json({ ok: true, event: mappedType });
  } catch (err) {
    console.error("Webhook error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
});
