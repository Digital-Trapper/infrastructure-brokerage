import { spawn } from "node:child_process";
import { createServer } from "node:http";

const appPort = process.env.PORT ?? "3000";
const mockPort = process.env.RESEND_MOCK_PORT ?? "3101";
const sendCountsByText = new Map();

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

function recordAcceptedSend(text) {
  sendCountsByText.set(text, (sendCountsByText.get(text) ?? 0) + 1);
}

const resendMock = createServer(async (request, response) => {
  if (request.method === "GET" && request.url?.startsWith("/__resend-mock/count")) {
    const url = new URL(request.url, `http://127.0.0.1:${mockPort}`);
    const contains = url.searchParams.get("contains") ?? "";
    let count = 0;

    for (const [text, sendCount] of sendCountsByText.entries()) {
      if (text.includes(contains)) {
        count += sendCount;
      }
    }

    sendJson(response, 200, { count });
    return;
  }

  if (request.method !== "POST" || request.url !== "/emails") {
    sendJson(response, 404, { message: "Not found" });
    return;
  }

  if (request.headers.authorization !== "Bearer re_test_key") {
    sendJson(response, 401, {
      name: "authentication_error",
      message: "Mock provider received an invalid Authorization header",
      statusCode: 401,
    });
    return;
  }

  if (!request.headers["content-type"]?.startsWith("application/json")) {
    sendJson(response, 415, {
      name: "validation_error",
      message: "Mock provider expected application/json",
      statusCode: 415,
    });
    return;
  }

  const body = JSON.parse(await readRequestBody(request));
  const text = body.text ?? "";
  const submitterEmail = body.to === "leads@example.com" ? body.reply_to : body.to;
  const requiredInternalDetails = [
    "New Gephyra Markets enquiry",
    "Enquiry type: Buy equipment",
    "Approximate deal value: £50k-£250k",
    "Name: Test User",
    "Company: Test Company",
    `Email: ${submitterEmail}`,
    "Phone / WhatsApp: +44 20 7946 0018",
    "Requirement or asset:",
  ];
  const requiredConfirmationDetails = [
    "Thank you for contacting Gephyra Markets. We have received your enquiry.",
    "We will review the requirement and respond if there is a relevant buyer or seller opportunity.",
    "Submitted summary:",
    "Enquiry type: Buy equipment",
    "Approximate deal value: £50k-£250k",
    "Company: Test Company",
    `Contact email: ${body.to}`,
  ];
  const hasSupportedEquipmentType = [
    "Equipment type: BESS / battery storage",
    "Equipment type: Generators",
  ].some((detail) => text.includes(detail));

  if (text.includes("Provider failure")) {
    sendJson(response, 422, {
      name: "validation_error",
      message: "Mock provider rejected send",
      statusCode: 422,
    });
    return;
  }

  if (text.includes("No id response")) {
    sendJson(response, 200, {});
    return;
  }

  if (body.to === "confirmation-failure@example.com") {
    sendJson(response, 422, {
      name: "validation_error",
      message: "Mock provider rejected confirmation send",
      statusCode: 422,
    });
    return;
  }

  if (body.to === "leads@example.com") {
    if (
      body.from !== "Gephyra Markets <enquiries@example.com>" ||
      typeof body.reply_to !== "string" ||
      !body.reply_to.includes("@") ||
      !hasSupportedEquipmentType ||
      !requiredInternalDetails.every((detail) => text.includes(detail))
    ) {
      sendJson(response, 422, {
        name: "validation_error",
        message: "Mock provider received an incomplete enquiry email",
        statusCode: 422,
      });
      return;
    }

    recordAcceptedSend(text);
    sendJson(response, 200, { id: "email_mock_123" });
    return;
  }

  if (
    body.from !== "Gephyra Markets <enquiries@example.com>" ||
    body.reply_to !== "Gephyra Markets <enquiries@example.com>" ||
    body.subject !== "Gephyra Markets has received your enquiry" ||
    !hasSupportedEquipmentType ||
    !requiredConfirmationDetails.every((detail) => text.includes(detail))
  ) {
    sendJson(response, 422, {
      name: "validation_error",
      message: "Mock provider received an incomplete confirmation email",
      statusCode: 422,
    });
    return;
  }

  recordAcceptedSend(text);
  sendJson(response, 200, { id: "email_confirmation_mock_123" });
});

resendMock.listen(Number(mockPort), "127.0.0.1", () => {
  const next = spawn(
    "npm",
    ["run", "start", "--", "--port", appPort, "--hostname", "127.0.0.1"],
    {
      env: {
        ...process.env,
        RESEND_API_KEY: "re_test_key",
        RESEND_BASE_URL: `http://127.0.0.1:${mockPort}`,
        ENQUIRY_FROM_EMAIL: "Gephyra Markets <enquiries@example.com>",
        ENQUIRY_TO_EMAIL: "leads@example.com",
      },
      stdio: "inherit",
    },
  );

  const shutdown = () => {
    next.kill("SIGTERM");
    resendMock.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  next.on("exit", (code) => {
    resendMock.close(() => process.exit(code ?? 0));
  });
});
