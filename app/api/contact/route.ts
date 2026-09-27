const headers = { "Cache-Control": "no-store" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export async function GET() {
  return Response.json(
    { emailDeliveryAvailable: Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL) },
    { headers },
  );
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Please send this from the contact page." }, { status: 403, headers });
  }
  if (Number(request.headers.get("content-length") || 0) > 16_000) {
    return Response.json({ error: "Please keep the inquiry concise." }, { status: 413, headers });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Please check the form and try again." }, { status: 400, headers });
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 254).toLowerCase();
  const message = clean(payload.message, 4_000);
  const service = clean(payload.service, 120);
  const stage = clean(payload.stage, 120);
  const projectUrl = clean(payload.projectUrl, 500);
  const timeline = clean(payload.timeline, 120);
  const budget = clean(payload.budget, 120);
  const source = clean(payload.source, 120);

  if (payload.website) return Response.json({ received: true, emailed: true }, { status: 201, headers });
  if (name.length < 2) return Response.json({ error: "Please enter your name." }, { status: 400, headers });
  if (!emailPattern.test(email)) return Response.json({ error: "Please enter a valid email address." }, { status: 400, headers });
  if (message.length < 3) return Response.json({ error: "Please tell me a little about your project." }, { status: 400, headers });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    return Response.json({ received: true, emailed: false }, { status: 201, headers });
  }

  const detailLines = [
    `Name: ${name}`,
    `Email: ${email}`,
    service && `Service: ${service}`,
    stage && `Current stage: ${stage}`,
    projectUrl && `Useful link: ${projectUrl}`,
    timeline && `Timeline: ${timeline}`,
    budget && `Budget range: ${budget}`,
    source && `Source: ${source}`,
  ].filter(Boolean).join("\n");
  const detail = `${detailLines}\n\n${message}`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from,
        to: ["mabdullah.built@gmail.com"],
        reply_to: email,
        subject: `AbdullahBuilt inquiry from ${name}${service ? ` — ${service}` : ""}`,
        text: detail,
      }),
    });
    if (!response.ok) {
      console.error("Inquiry email failed", response.status);
      return Response.json({ received: true, emailed: false }, { status: 201, headers });
    }
    return Response.json({ received: true, emailed: true }, { status: 201, headers });
  } catch (error) {
    console.error("Inquiry email failed", error);
    return Response.json({ received: true, emailed: false }, { status: 201, headers });
  }
}
