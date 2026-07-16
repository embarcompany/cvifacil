type LeadSubmissionPayload = Record<string, unknown>;

export const runtime = "nodejs";

const getString = (payload: LeadSubmissionPayload, key: string) => {
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
};

const getNumber = (payload: LeadSubmissionPayload, key: string) => {
  const value = payload[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return 0;
};

const getBoolean = (payload: LeadSubmissionPayload, key: string) => payload[key] === true;

export async function POST(request: Request) {
  let payload: LeadSubmissionPayload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const tableName = process.env.SUPABASE_LEADS_TABLE || "cvi_leads";

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("[cvi-leads] Supabase env vars missing. Lead was not persisted.");
    return Response.json(
      { ok: false, skipped: true, reason: "missing_supabase_env" },
      { status: 202 }
    );
  }

  const nomeTutor = getString(payload, "nome_tutor");
  const whatsapp = getString(payload, "whatsapp");

  if (!nomeTutor || !whatsapp) {
    return Response.json(
      { ok: false, error: "missing_required_fields" },
      { status: 400 }
    );
  }

  const row = {
    submitted_at: getString(payload, "submitted_at"),
    nome_tutor: nomeTutor,
    whatsapp: whatsapp,
    email_opcional: getString(payload, "email_opcional"),
    cidade_origem: getString(payload, "cidade_origem"),
    pais_destino: getString(payload, "pais_destino"),
    pais_destino_outro: getString(payload, "pais_destino_outro"),
    destino_final: getString(payload, "destino_final"),
    data_viagem: getString(payload, "data_viagem"),
    qtd_gatos: getNumber(payload, "qtd_gatos"),
    qtd_cachorros: getNumber(payload, "qtd_cachorros"),
    total_pets: getNumber(payload, "total_pets"),
    pet_summary: getString(payload, "pet_summary"),
    mais_de_um_pet: getBoolean(payload, "mais_de_um_pet"),
    tipo_pet: getString(payload, "tipo_pet"),
    page_url: getString(payload, "page_url"),
    user_agent: getString(payload, "user_agent"),
    utm_source: getString(payload, "utm_source"),
    utm_medium: getString(payload, "utm_medium"),
    utm_campaign: getString(payload, "utm_campaign"),
    utm_term: getString(payload, "utm_term"),
    utm_content: getString(payload, "utm_content"),
    gclid: getString(payload, "gclid"),
    fbclid: getString(payload, "fbclid"),
    raw_payload: payload,
  };

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
      cache: "no-store",
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("[cvi-leads] Supabase insert failed", response.status, responseText);
      return Response.json(
        { ok: false, error: "supabase_insert_failed" },
        { status: 502 }
      );
    }

    const lead = responseText ? JSON.parse(responseText) : null;
    return Response.json({ ok: true, lead });
  } catch (error) {
    console.error("[cvi-leads] Lead persistence failed", error);
    return Response.json(
      { ok: false, error: "lead_persistence_failed" },
      { status: 500 }
    );
  }
}
