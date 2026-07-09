import { deliverEnquiry, validateEnquiryFormData } from "@/app/_lib/enquiries";

const maxRequestBodyBytes = 16 * 1024;
const supportedContentTypes = new Set(["application/json", "application/x-www-form-urlencoded"]);

type BodyReadResult =
  | { ok: true; body: string }
  | { ok: false; status: 413; message: string };

function wantsHtml(request: Request) {
  return request.headers.get("accept")?.includes("text/html") ?? false;
}

function getRequestContentType(request: Request) {
  return request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() ?? "";
}

function getRequestHost(request: Request) {
  return (
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim().toLowerCase() ??
    request.headers.get("host")?.trim().toLowerCase() ??
    ""
  );
}

function isSameOriginPost(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    // Non-browser clients and some older form flows may omit Origin; reject only clear mismatches.
    return true;
  }

  try {
    const originHost = new URL(origin).host.toLowerCase();
    return originHost === getRequestHost(request);
  } catch {
    return false;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function htmlResponse(body: { ok: boolean; message: string }, status: number) {
  const title = body.ok ? "Enquiry submitted" : "Enquiry not submitted";

  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><main><h1>${title}</h1><p>${escapeHtml(body.message)}</p><p><a href="/#contact">Return to Gephyra Markets</a></p></main></body></html>`,
    {
      status,
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
}

function respond(request: Request, body: { ok: boolean; message: string }, status: number) {
  if (wantsHtml(request)) {
    return htmlResponse(body, status);
  }

  return Response.json(body, { status });
}

async function readRequestBody(request: Request): Promise<BodyReadResult> {
  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > maxRequestBodyBytes) {
    return {
      ok: false,
      status: 413,
      message: "Please shorten the enquiry details and try again.",
    };
  }

  if (!request.body) {
    return { ok: true, body: "" };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    receivedBytes += value.byteLength;

    if (receivedBytes > maxRequestBodyBytes) {
      await reader.cancel();

      return {
        ok: false,
        status: 413,
        message: "Please shorten the enquiry details and try again.",
      };
    }

    chunks.push(value);
  }

  const bytes = new Uint8Array(receivedBytes);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const body = new TextDecoder().decode(bytes);

  return { ok: true, body };
}

function formDataFromJson(body: string) {
  const parsed = JSON.parse(body) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Expected an object payload.");
  }

  const formData = new FormData();

  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === "string") {
      formData.set(key, value);
    }
  }

  return formData;
}

function formDataFromUrlEncoded(body: string) {
  const params = new URLSearchParams(body);
  const formData = new FormData();

  params.forEach((value, key) => {
    formData.set(key, value);
  });

  return formData;
}

async function parseRequestFormData(request: Request) {
  const contentType = getRequestContentType(request);

  if (!supportedContentTypes.has(contentType)) {
    return {
      ok: false as const,
      status: 415,
      message: "Please submit the enquiry form again.",
    };
  }

  const body = await readRequestBody(request);

  if (!body.ok) {
    return { ok: false as const, status: body.status, message: body.message };
  }

  try {
    return {
      ok: true as const,
      formData:
        contentType === "application/json"
          ? formDataFromJson(body.body)
          : formDataFromUrlEncoded(body.body),
    };
  } catch {
    return {
      ok: false as const,
      status: 400,
      message: "Please submit the enquiry form again.",
    };
  }
}

export async function POST(request: Request) {
  if (!isSameOriginPost(request)) {
    console.warn("Rejected cross-origin enquiry submission.", {
      origin: request.headers.get("origin"),
      host: getRequestHost(request),
    });

    return respond(request, { ok: false, message: "Please submit the enquiry form again." }, 403);
  }

  const parsed = await parseRequestFormData(request);

  if (!parsed.ok) {
    return respond(request, { ok: false, message: parsed.message }, parsed.status);
  }

  const validation = validateEnquiryFormData(parsed.formData);

  if (!validation.ok) {
    return respond(request, { ok: false, message: validation.error }, 400);
  }

  const delivery = await deliverEnquiry(validation.submission);

  if (!delivery.ok) {
    return respond(
      request,
      { ok: false, message: delivery.error },
      delivery.status,
    );
  }

  return respond(
    request,
    {
      ok: true,
      message: "Thanks. Your enquiry has been submitted.",
    },
    200,
  );
}
