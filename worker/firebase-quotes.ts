import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { SignJWT, importPKCS8 } from "jose";

type QuoteEnv = { FIREBASE_SERVICE_ACCOUNT_JSON?: string };
type ServiceAccount = { project_id?: string; client_email?: string; private_key?: string; private_key_id?: string };
const peopleOptions = ["10인 이하", "11~30인", "31~50인", "51인 이상"];
const furnitureOptions = ["사무용 의자", "파티션", "소파", "책상"];
const serviceOptions = ["세척", "상태점검", "간단수리", "정기관리"];
const clean = (v: unknown, max: number) => typeof v === "string" ? v.trim().slice(0, max) : "";

async function googleAccessToken(account: ServiceAccount): Promise<string> {
  if (!account.client_email || !account.private_key || !account.project_id || !/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(account.project_id)) throw new Error("invalid service account");
  const privateKey = await importPKCS8(account.private_key, "RS256");
  const assertion = await new SignJWT({ scope: "https://www.googleapis.com/auth/datastore" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT", ...(account.private_key_id ? { kid: account.private_key_id } : {}) })
    .setIssuer(account.client_email).setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt().setExpirationTime("1h").sign(privateKey);
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!response.ok) throw new Error("firebase token request failed");
  const result = await response.json() as { access_token?: string };
  if (!result.access_token) throw new Error("firebase token missing");
  return result.access_token;
}

const quoteRoutes = new Hono<{ Bindings: QuoteEnv }>();
quoteRoutes.use("*", async (c, next) => {
  await next();
  c.header("cache-control", "no-store");
  c.header("x-robots-tag", "noindex");
});
quoteRoutes.post("/api/quote-requests", bodyLimit({ maxSize: 8192, onError: c => c.json({ error: "입력 내용이 너무 길어요." }, 413) }), async c => {
  const body: unknown = await c.req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) return c.json({ error: "신청 내용을 확인해 주세요." }, 400);
  const b = body as Record<string, unknown>;
  const requestId = clean(b.requestId, 36), name = clean(b.name, 40), phone = clean(b.phone, 30), people = clean(b.people, 20);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) return c.json({ error: "다시 시작한 뒤 신청해 주세요." }, 400);
  if (!name || !phone || phone.replace(/\D/g, "").length < 8) return c.json({ error: "이름과 연락 가능한 번호를 입력해 주세요." }, 400);
  if (!peopleOptions.includes(people) || b.consent !== true) return c.json({ error: "선택 내용과 개인정보 수집 동의를 확인해 주세요." }, 400);
  if (!Array.isArray(b.furniture) || b.furniture.length < 1 || b.furniture.length > furnitureOptions.length) return c.json({ error: "관리할 가구를 선택해 주세요." }, 400);
  const furniture = b.furniture as Array<{ name?: unknown; quantity?: unknown }>;
  if (furniture.some(item => !item || typeof item !== "object" || typeof item.name !== "string" || !furnitureOptions.includes(item.name) || !Number.isInteger(item.quantity) || Number(item.quantity) < 1 || Number(item.quantity) > 999) || new Set(furniture.map(item => item.name)).size !== furniture.length) return c.json({ error: "가구 종류와 수량을 확인해 주세요." }, 400);
  if (!Array.isArray(b.services) || b.services.length < 1 || b.services.length > serviceOptions.length || b.services.some(s => typeof s !== "string" || !serviceOptions.includes(s)) || new Set(b.services).size !== b.services.length) return c.json({ error: "서비스를 선택해 주세요." }, 400);
  if (!c.env.FIREBASE_SERVICE_ACCOUNT_JSON) return c.json({ error: "신청이 접수되지 않았어요. 사이트 관리자에게 문의해 주세요." }, 503);

  try {
    const account = JSON.parse(c.env.FIREBASE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
    const token = await googleAccessToken(account);
    const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(account.project_id!)}/databases/(default)/documents/quote_requests?documentId=${encodeURIComponent(requestId)}`;
    const response = await fetch(url, {
      method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ fields: {
        name: { stringValue: name }, phone: { stringValue: phone }, people: { stringValue: people },
        furniture: { arrayValue: { values: furniture.map(item => ({ mapValue: { fields: { name: { stringValue: item.name }, quantity: { integerValue: String(item.quantity) } } } })) } },
        services: { arrayValue: { values: (b.services as string[]).map(service => ({ stringValue: service })) } },
        consent: { booleanValue: true }, created_at: { timestampValue: new Date().toISOString() },
      } }),
    });
    if (response.ok || response.status === 409) return c.json({ ok: true }, response.ok ? 201 : 200);
    console.error(`Firebase 신청 저장 실패 (${response.status})`);
  } catch {
    console.error("Firebase 신청 저장 연결 실패");
  }
  return c.json({ error: "신청하지 못했어요. 잠시 뒤 다시 시도해 주세요." }, 503);
});

export default quoteRoutes;
