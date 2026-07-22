import { Resend } from "resend";

export type EnquirySubmission = {
  enquiryType: "buyer" | "seller";
  assetCategory: string;
  approximateValue: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

type ValidationResult =
  | { ok: true; submission: EnquirySubmission }
  | { ok: false; error: string };

type DeliveryResult =
  | { ok: true; id: string }
  | { ok: false; error: string; status: number };

type EmailPayload = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

export type EnquiryEmailClient = {
  emails: {
    send: (payload: EmailPayload) => Promise<{
      data?: { id?: string } | null;
      error?: { message?: string } | string | null;
    }>;
  };
};

const enquiryTypes = new Set(["buyer", "seller"]);
const assetCategories = new Set([
  "generators",
  "bess",
  "ups",
  "data_centre",
  "networking",
  "other_power",
  "other",
]);
const approximateValues = new Set([
  "",
  "under_50k",
  "50k_250k",
  "250k_1m",
  "1m_5m",
  "5m_plus",
  "not_sure",
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s.-]{7,32}$/;
const clientSafeDeliveryError = "We could not submit this enquiry. Please try again.";

const enquiryTypeLabels: Record<EnquirySubmission["enquiryType"], string> = {
  buyer: "Buy equipment",
  seller: "Sell equipment",
};

const assetCategoryLabels: Record<string, string> = {
  generators: "Generators",
  bess: "BESS / battery storage",
  ups: "UPS systems",
  data_centre: "Data centre equipment",
  networking: "Networking equipment",
  other_power: "Other power infrastructure",
  other: "Other",
};

const approximateValueLabels: Record<string, string> = {
  "": "Not provided",
  under_50k: "Under £50k",
  "50k_250k": "£50k-£250k",
  "250k_1m": "£250k-£1m",
  "1m_5m": "£1m-£5m",
  "5m_plus": "£5m+",
  not_sure: "Not sure",
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function tooLong(value: string, maxLength: number) {
  return value.length > maxLength;
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function formatProviderError(error: { message?: string } | string | null | undefined) {
  if (typeof error === "string") {
    return error;
  }

  return error?.message ?? "Resend rejected the enquiry email.";
}

export function buildEnquiryEmail(submission: EnquirySubmission, from: string, to: string): EmailPayload {
  const submittedAt = new Date().toISOString();
  const subject = `Gephyra Markets enquiry: ${enquiryTypeLabels[submission.enquiryType]}`;
  const text = [
    "New Gephyra Markets enquiry",
    "",
    `Submitted at: ${submittedAt}`,
    `Enquiry type: ${enquiryTypeLabels[submission.enquiryType]}`,
    `Equipment type: ${assetCategoryLabels[submission.assetCategory]}`,
    `Approximate deal value: ${approximateValueLabels[submission.approximateValue]}`,
    "",
    `Name: ${submission.name}`,
    `Company: ${submission.company || "Not provided"}`,
    `Email: ${submission.email}`,
    `Phone / WhatsApp: ${submission.phone || "Not provided"}`,
    "",
    "Requirement or asset:",
    submission.message,
  ].join("\n");

  return {
    from,
    to,
    replyTo: submission.email,
    subject,
    text,
  };
}

export function buildEnquiryConfirmationEmail(submission: EnquirySubmission, from: string): EmailPayload {
  const subject = "Gephyra Markets has received your enquiry";
  const summary = [
    `Enquiry type: ${enquiryTypeLabels[submission.enquiryType]}`,
    `Equipment type: ${assetCategoryLabels[submission.assetCategory]}`,
    `Approximate deal value: ${approximateValueLabels[submission.approximateValue]}`,
    `Company: ${submission.company || "Not provided"}`,
    `Contact email: ${submission.email}`,
  ];
  const text = [
    `Hello ${submission.name},`,
    "",
    "Thank you for contacting Gephyra Markets. We have received your enquiry.",
    "",
    "We will review the requirement and respond if there is a relevant buyer or seller opportunity.",
    "",
    "Submitted summary:",
    ...summary,
    "",
    "Regards,",
    "Gephyra Markets",
  ].join("\n");

  return {
    from,
    to: submission.email,
    replyTo: from,
    subject,
    text,
  };
}

export function validateEnquiryFormData(formData: FormData): ValidationResult {
  const website = readText(formData, "website");

  if (website) {
    return { ok: false, error: "We could not submit this enquiry. Please try again." };
  }

  const submission: EnquirySubmission = {
    enquiryType: readText(formData, "enquiry_type") as EnquirySubmission["enquiryType"],
    assetCategory: readText(formData, "asset_category"),
    approximateValue: readText(formData, "approximate_value"),
    name: readText(formData, "name"),
    company: readText(formData, "company"),
    email: readText(formData, "email").toLowerCase(),
    phone: readText(formData, "phone"),
    message: readText(formData, "message"),
  };

  if (
    !submission.enquiryType ||
    !submission.assetCategory ||
    !submission.name ||
    !submission.email ||
    !submission.message
  ) {
    return { ok: false, error: "Please complete all required fields." };
  }

  if (!enquiryTypes.has(submission.enquiryType) || !assetCategories.has(submission.assetCategory)) {
    return { ok: false, error: "Please check the selected enquiry details." };
  }

  if (!approximateValues.has(submission.approximateValue)) {
    return { ok: false, error: "Please check the selected deal value." };
  }

  if (!emailPattern.test(submission.email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (submission.phone && !phonePattern.test(submission.phone)) {
    return { ok: false, error: "Please enter a valid phone number." };
  }

  if (
    tooLong(submission.name, 120) ||
    tooLong(submission.company, 160) ||
    tooLong(submission.email, 254) ||
    tooLong(submission.phone, 32) ||
    tooLong(submission.message, 3000)
  ) {
    return { ok: false, error: "Please shorten the enquiry details and try again." };
  }

  return { ok: true, submission };
}

export async function deliverEnquiry(
  submission: EnquirySubmission,
  emailClient?: EnquiryEmailClient,
): Promise<DeliveryResult> {
  const apiKey = getRequiredEnv("RESEND_API_KEY");
  const from = getRequiredEnv("ENQUIRY_FROM_EMAIL");
  const to = getRequiredEnv("ENQUIRY_TO_EMAIL");

  if (!apiKey || !from || !to) {
    console.error("Enquiry email delivery is missing required Resend configuration.", {
      hasApiKey: Boolean(apiKey),
      hasFrom: Boolean(from),
      hasTo: Boolean(to),
    });

    return {
      ok: false,
      status: 503,
      error: clientSafeDeliveryError,
    };
  }

  const client = emailClient ?? new Resend(apiKey);
  const payload = buildEnquiryEmail(submission, from, to);

  try {
    const result = await client.emails.send(payload);

    if (result.error) {
      console.error("Resend rejected enquiry email.", {
        error: formatProviderError(result.error),
      });

      return {
        ok: false,
        status: 502,
        error: clientSafeDeliveryError,
      };
    }

    if (!result.data?.id) {
      console.error("Resend did not return an email id for enquiry delivery.");

      return {
        ok: false,
        status: 502,
        error: clientSafeDeliveryError,
      };
    }

    try {
      const confirmationPayload = buildEnquiryConfirmationEmail(submission, from);
      const confirmationResult = await client.emails.send(confirmationPayload);

      if (confirmationResult.error) {
        console.error("Resend rejected enquiry confirmation email.", {
          error: formatProviderError(confirmationResult.error),
        });

        return { ok: true, id: result.data.id };
      }

      if (!confirmationResult.data?.id) {
        console.error("Resend did not return an email id for enquiry confirmation delivery.");
      }
    } catch (error) {
      console.error("Resend enquiry confirmation delivery failed unexpectedly.", { error });
    }

    return { ok: true, id: result.data.id };
  } catch (error) {
    console.error("Resend enquiry delivery failed unexpectedly.", { error });

    return {
      ok: false,
      status: 502,
      error: clientSafeDeliveryError,
    };
  }
}
