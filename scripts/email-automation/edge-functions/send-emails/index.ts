/**
 * Edge Function: send-emails
 * Chiamata da pg_cron ogni 5 minuti.
 * Prende le email in coda che sono "due" e le invia via Resend.
 *
 * Deploy: supabase functions deploy send-emails --project-ref ppbbqchycxffsfavtsjp
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

const FUNCTION_BASE_URL = `${SUPABASE_URL}/functions/v1`;
const FROM_EMAIL = "Ilaria · 362gradi <info@362gradi.ae>";
const REPLY_TO = "info@362gradi.ae";
const BATCH_SIZE = 20;

interface DueEmail {
  queue_id: string;
  subscriber_email: string;
  subscriber_name: string | null;
  subject: string;
  preheader: string;
  html_body: string;
  profile: string;
  position: number;
}

Deno.serve(async (req) => {
  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Prendi email in coda
    const { data: dueEmails, error: fetchError } = await supabase.rpc(
      "get_due_emails",
      { batch_size: BATCH_SIZE }
    );

    if (fetchError) {
      console.error("Errore fetch due emails:", fetchError);
      return Response.json({ error: fetchError.message }, { status: 500 });
    }

    if (!dueEmails || dueEmails.length === 0) {
      return Response.json({ sent: 0, message: "Nessuna email in coda" });
    }

    console.log(`📧 ${dueEmails.length} email da inviare`);

    let sentCount = 0;
    let failCount = 0;

    for (const email of dueEmails as DueEmail[]) {
      try {
        // Personalizza HTML
        const personalizedHtml = personalizeHtml(
          email.html_body,
          email.subscriber_email,
          email.subscriber_name,
          email.queue_id
        );

        // Invia via Resend
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [email.subscriber_email],
            reply_to: REPLY_TO,
            subject: email.subject,
            html: personalizedHtml,
            headers: {
              "X-Queue-Id": email.queue_id,
              "List-Unsubscribe": `<${FUNCTION_BASE_URL}/unsubscribe?email=${encodeURIComponent(email.subscriber_email)}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          }),
        });

        if (!resendResponse.ok) {
          const errText = await resendResponse.text();
          throw new Error(`Resend ${resendResponse.status}: ${errText}`);
        }

        const resendData = await resendResponse.json();

        // Segna come inviata
        await supabase.rpc("mark_email_sent", {
          p_queue_id: email.queue_id,
          p_resend_id: resendData.id,
        });

        sentCount++;
        console.log(
          `✅ Inviata: ${email.subscriber_email} — ${email.profile}#${email.position}`
        );
      } catch (sendError) {
        console.error(
          `❌ Errore invio ${email.subscriber_email}:`,
          sendError
        );

        // Segna come fallita (con retry automatico)
        await supabase.rpc("mark_email_failed", {
          p_queue_id: email.queue_id,
          p_error: String(sendError),
        });

        failCount++;
      }
    }

    return Response.json({
      sent: sentCount,
      failed: failCount,
      total: dueEmails.length,
    });
  } catch (err) {
    console.error("Errore fatale:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
});

/**
 * Personalizza l'HTML con i dati del subscriber + tracking pixel + link tracking
 */
function personalizeHtml(
  html: string,
  email: string,
  name: string | null,
  queueId: string
): string {
  const encodedEmail = encodeURIComponent(email);
  const unsubscribeUrl = `${FUNCTION_BASE_URL}/unsubscribe?email=${encodedEmail}&qid=${queueId}`;
  const trackPixelUrl = `${FUNCTION_BASE_URL}/track?type=open&qid=${queueId}`;

  // Replace all variable formats using string split+join ($ is special in regex)
  let result = html
    .split('{$name}').join(name ? ` ${name}` : "")
    .replace(/\{\{name\}\}/g, name ? ` ${name}` : "")
    .split('{$unsubscribe}').join(unsubscribeUrl)
    .replace(/\{\{unsubscribe_url\}\}/g, unsubscribeUrl);

  // Aggiungi tracking pixel prima di </body>
  const trackPixel = `<img src="${trackPixelUrl}" width="1" height="1" alt="" style="display:none;width:1px;height:1px;border:0;" />`;
  result = result.replace("</body>", `${trackPixel}\n</body>`);

  // Riscrivi link per click tracking (escludi unsubscribe e mailto)
  result = result.replace(
    /href="(https?:\/\/[^"]+)"/g,
    (match, url) => {
      // Non tracciare unsubscribe link e link interni al sistema
      if (url.includes("/unsubscribe") || url.includes("/track")) {
        return match;
      }
      const trackUrl = `${FUNCTION_BASE_URL}/track?type=click&qid=${queueId}&url=${encodeURIComponent(url)}`;
      return `href="${trackUrl}"`;
    }
  );

  return result;
}
