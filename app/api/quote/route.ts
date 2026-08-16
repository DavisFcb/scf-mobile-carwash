import https from "node:https";
import { NextResponse } from "next/server";

const EMAIL_TO = "selfcarefragrances@gmail.com";

async function sendResendEmail(payload: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const useInsecureLocalTls =
    process.env.NODE_ENV !== "production" && process.env.ALLOW_INSECURE_LOCAL_TLS === "true";

  return new Promise<{ statusCode: number; body: string }>((resolve, reject) => {
    const req = https.request(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        ...(useInsecureLocalTls ? { agent: new https.Agent({ rejectUnauthorized: false }) } : {}),
      },
      (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk.toString();
        });

        res.on("end", () => {
          resolve({ statusCode: res.statusCode ?? 500, body });
        });
      },
    );

    req.on("error", reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;

    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const service = body.service?.trim();
    const vehicle = body.vehicle?.trim();
    const preferredTime = body.preferredTime?.trim();
    const details = body.details?.trim();

    if (!name || !phone || !service || !vehicle || !details) {
      return NextResponse.json(
        { message: "Please complete the required fields before submitting your request." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey === "re_your_api_key_here") {
      return NextResponse.json(
        { message: "Email service is not configured yet. Please contact us directly." },
        { status: 500 },
      );
    }

    const rows: [string, string][] = [
      ["Name", name],
      ["Phone", phone],
      ["Service", service],
      ["Vehicle type", vehicle],
      ...(preferredTime ? [["Preferred time", preferredTime]] as [string, string][] : []),
      ["Details", details],
    ];

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
        <h2 style="color: #0369a1; margin-bottom: 16px;">New car wash quote request</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${rows
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding: 10px 12px; font-weight: 700; background: #f1f5f9; width: 170px; vertical-align: top;">${label}</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${value}</td>
            </tr>`
            )
            .join("")}
        </table>
      </div>
    `;

    const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

    const payload = {
      from: "SCF Car & Body Care <onboarding@resend.dev>",
      to: [EMAIL_TO],
      subject: `Quote request from ${name} — ${service}`,
      html,
      text,
    };

    const response = await sendResendEmail(payload);

    if (response.statusCode >= 400) {
      console.error("Resend error:", response.statusCode, response.body);
      return NextResponse.json(
        { message: "Failed to send your request. Please try again or contact us directly." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Thanks! Your quote request has been sent. We’ll get back to you shortly.",
    });
  } catch (error) {
    console.error("Quote route exception:", error);
    return NextResponse.json(
      { message: "We could not submit your request right now. Please try again." },
      { status: 500 },
    );
  }
}
