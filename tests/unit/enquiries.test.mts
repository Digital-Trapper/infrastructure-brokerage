import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import {
  buildEnquiryConfirmationEmail,
  buildEnquiryEmail,
  deliverEnquiry,
  type EnquiryEmailClient,
  type EnquirySubmission,
  validateEnquiryFormData,
} from "../../app/_lib/enquiries.ts";

const envKeys = ["RESEND_API_KEY", "ENQUIRY_FROM_EMAIL", "ENQUIRY_TO_EMAIL"] as const;
const originalEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));

const validSubmission: EnquirySubmission = {
  enquiryType: "buyer",
  assetCategory: "bess",
  approximateValue: "50k_250k",
  name: "Test User",
  company: "Test Company",
  email: "test@example.com",
  phone: "+44 20 7946 0018",
  message: "We are looking for BESS equipment.",
};

function configureEnv() {
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.ENQUIRY_FROM_EMAIL = "Gephyra Markets <enquiries@example.com>";
  process.env.ENQUIRY_TO_EMAIL = "leads@example.com";
}

function clearEnv() {
  for (const key of envKeys) {
    delete process.env[key];
  }
}

afterEach(() => {
  for (const key of envKeys) {
    const value = originalEnv[key];

    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

test("rejects invalid enquiry form data", () => {
  const formData = new FormData();
  formData.set("enquiry_type", "buyer");
  formData.set("asset_category", "bess");
  formData.set("email", "not-an-email");

  assert.deepEqual(validateEnquiryFormData(formData), {
    ok: false,
    error: "Please complete all required fields.",
  });
});

test("builds an email containing all submitted enquiry details", () => {
  const email = buildEnquiryEmail(
    validSubmission,
    "Gephyra Markets <enquiries@example.com>",
    "leads@example.com",
  );

  assert.equal(email.from, "Gephyra Markets <enquiries@example.com>");
  assert.equal(email.to, "leads@example.com");
  assert.equal(email.replyTo, "test@example.com");
  assert.match(email.subject, /Gephyra Markets enquiry: Buy equipment/);
  assert.match(email.text, /Equipment type: BESS \/ battery storage/);
  assert.match(email.text, /Approximate deal value: £50k-£250k/);
  assert.match(email.text, /Name: Test User/);
  assert.match(email.text, /Company: Test Company/);
  assert.match(email.text, /Email: test@example.com/);
  assert.match(email.text, /Phone \/ WhatsApp: \+44 20 7946 0018/);
  assert.match(email.text, /We are looking for BESS equipment\./);
});

test("builds a confirmation email for the submitter", () => {
  const email = buildEnquiryConfirmationEmail(
    validSubmission,
    "Gephyra Markets <enquiries@example.com>",
  );

  assert.equal(email.from, "Gephyra Markets <enquiries@example.com>");
  assert.equal(email.to, "test@example.com");
  assert.equal(email.replyTo, "Gephyra Markets <enquiries@example.com>");
  assert.equal(email.subject, "Gephyra Markets has received your enquiry");
  assert.match(email.text, /Hello Test User,/);
  assert.match(email.text, /We have received your enquiry\./);
  assert.match(email.text, /respond if there is a relevant buyer or seller opportunity/);
  assert.match(email.text, /Enquiry type: Buy equipment/);
  assert.match(email.text, /Equipment type: BESS \/ battery storage/);
  assert.match(email.text, /Approximate deal value: £50k-£250k/);
  assert.match(email.text, /Company: Test Company/);
  assert.match(email.text, /Contact email: test@example.com/);
});

test("returns configuration failure before calling Resend when env is missing", async () => {
  clearEnv();

  const client: EnquiryEmailClient = {
    emails: {
      send: async () => {
        throw new Error("Resend should not be called without configuration");
      },
    },
  };

  const result = await deliverEnquiry(validSubmission, client);

  assert.deepEqual(result, {
    ok: false,
    status: 503,
    error: "We could not submit this enquiry. Please try again.",
  });
});

test("returns success after internal notification and confirmation both send", async () => {
  configureEnv();

  const payloads: unknown[] = [];
  const client: EnquiryEmailClient = {
    emails: {
      send: async (payload) => {
        payloads.push(payload);

        return { data: { id: `email_${payloads.length}` } };
      },
    },
  };

  assert.deepEqual(await deliverEnquiry(validSubmission, client), {
    ok: true,
    id: "email_1",
  });
  assert.equal(payloads.length, 2);

  const [internalEmail, confirmationEmail] = payloads as Array<{
    from: string;
    to: string;
    replyTo: string;
    subject: string;
    text: string;
  }>;

  assert.equal(internalEmail.from, "Gephyra Markets <enquiries@example.com>");
  assert.equal(internalEmail.to, "leads@example.com");
  assert.equal(internalEmail.replyTo, "test@example.com");
  assert.match(internalEmail.text, /Requirement or asset:\nWe are looking for BESS equipment\./);

  assert.equal(confirmationEmail.from, "Gephyra Markets <enquiries@example.com>");
  assert.equal(confirmationEmail.to, "test@example.com");
  assert.equal(confirmationEmail.replyTo, "Gephyra Markets <enquiries@example.com>");
  assert.equal(confirmationEmail.subject, "Gephyra Markets has received your enquiry");
  assert.match(confirmationEmail.text, /Thank you for contacting Gephyra Markets/);
});

test("returns provider failure when Resend rejects the internal notification", async () => {
  configureEnv();

  let sendCount = 0;
  const client: EnquiryEmailClient = {
    emails: {
      send: async () => {
        sendCount += 1;

        return {
          data: null,
          error: { message: "Domain is not verified" },
        };
      },
    },
  };

  assert.deepEqual(await deliverEnquiry(validSubmission, client), {
    ok: false,
    status: 502,
    error: "We could not submit this enquiry. Please try again.",
  });
  assert.equal(sendCount, 1);
});

test("does not count a provider response without an id as success", async () => {
  configureEnv();

  const client: EnquiryEmailClient = {
    emails: {
      send: async () => ({
        data: {},
      }),
    },
  };

  assert.deepEqual(await deliverEnquiry(validSubmission, client), {
    ok: false,
    status: 502,
    error: "We could not submit this enquiry. Please try again.",
  });
});

test("returns success when confirmation fails after internal notification succeeds", async () => {
  configureEnv();

  const payloads: unknown[] = [];
  const client: EnquiryEmailClient = {
    emails: {
      send: async () => {
        payloads.push({});

        if (payloads.length === 2) {
          return {
            data: null,
            error: { message: "Confirmation recipient rejected" },
          };
        }

        return { data: { id: "internal_email_123" } };
      },
    },
  };

  assert.deepEqual(await deliverEnquiry(validSubmission, client), {
    ok: true,
    id: "internal_email_123",
  });
  assert.equal(payloads.length, 2);
});
