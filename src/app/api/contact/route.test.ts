import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSendContactEmail = vi.fn<() => Promise<boolean>>();
const mockSendConfirmationEmail = vi.fn<() => Promise<boolean>>();
const mockIsEmailConfigured = vi.fn<() => boolean>();
const mockPrismaLeadCreate = vi.fn();

vi.mock("@/lib/email", () => ({
  sendContactEmail: (...args: unknown[]) => mockSendContactEmail(...(args as [])),
  sendConfirmationEmail: (...args: unknown[]) => mockSendConfirmationEmail(...(args as [])),
  isEmailConfigured: () => mockIsEmailConfigured(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    lead: { create: (...args: unknown[]) => mockPrismaLeadCreate(...args) },
  },
}));

import { POST } from "./route";

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  name: "Carlos Ruiz",
  email: "carlos@ejemplo.com",
  whatsapp: "9991234567",
  businessType: "Comercio local",
  message: "Quiero una landing page para mi tienda.",
  source: "form",
  _t: Date.now() - 5000,
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsEmailConfigured.mockReturnValue(true);
    mockSendContactEmail.mockResolvedValue(true);
    mockSendConfirmationEmail.mockResolvedValue(true);
    mockPrismaLeadCreate.mockResolvedValue({ id: "lead-1" });
  });

  it("returns 200 and saves lead + sends email with valid data", async () => {
    const res = await POST(jsonRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ success: true });

    expect(mockPrismaLeadCreate).toHaveBeenCalledWith({
      data: {
        name: "Carlos Ruiz",
        email: "carlos@ejemplo.com",
        whatsapp: "9991234567",
        businessType: "Comercio local",
        message: "Quiero una landing page para mi tienda.",
        source: "form",
      },
    });

    expect(mockSendContactEmail).toHaveBeenCalledWith({
      name: "Carlos Ruiz",
      email: "carlos@ejemplo.com",
      whatsapp: "9991234567",
      businessType: "Comercio local",
      message: "Quiero una landing page para mi tienda.",
    });

    expect(mockSendConfirmationEmail).toHaveBeenCalledWith(
      "carlos@ejemplo.com",
      "Carlos Ruiz",
    );
  });

  it("returns 200 with optional businessType missing", async () => {
    const { businessType, ...body } = validBody;
    const res = await POST(jsonRequest(body));

    expect(res.status).toBe(200);
    expect(mockSendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({ businessType: undefined }),
    );
  });

  it("returns 200 without whatsapp (optional)", async () => {
    const { whatsapp, ...body } = validBody;
    const res = await POST(jsonRequest(body));

    expect(res.status).toBe(200);
    expect(mockSendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({ whatsapp: undefined }),
    );
  });

  it("trims whitespace and lowercases email", async () => {
    const res = await POST(
      jsonRequest({
        ...validBody,
        name: "  Carlos Ruiz  ",
        email: " Carlos@Ejemplo.COM ",
        message: "  Mi mensaje  ",
      }),
    );

    expect(res.status).toBe(200);
    expect(mockSendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Carlos Ruiz",
        email: "carlos@ejemplo.com",
        message: "Mi mensaje",
      }),
    );
  });

  it("strips HTML tags from inputs", async () => {
    const res = await POST(
      jsonRequest({
        ...validBody,
        name: '<script>alert("x")</script>Carlos',
        message: '<img src=x onerror=alert(1)>Hola mundo',
      }),
    );

    expect(res.status).toBe(200);
    expect(mockSendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'alert("x")Carlos',
        message: "Hola mundo",
      }),
    );
  });

  it("returns 503 when email is not configured", async () => {
    mockIsEmailConfigured.mockReturnValue(false);
    const res = await POST(jsonRequest(validBody));

    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toMatch(/configurado/i);
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/JSON/i);
  });

  it("returns 400 when name is missing", async () => {
    const { name, ...body } = validBody;
    const res = await POST(jsonRequest(body));

    expect(res.status).toBe(400);
  });

  it("returns 400 when email is invalid", async () => {
    const res = await POST(jsonRequest({ ...validBody, email: "not-an-email" }));

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/correo/i);
  });

  it("returns 400 when message is missing", async () => {
    const { message, ...body } = validBody;
    const res = await POST(jsonRequest(body));

    expect(res.status).toBe(400);
  });

  it("silently accepts honeypot submissions", async () => {
    const res = await POST(jsonRequest({ ...validBody, _hp: "gotcha" }));

    expect(res.status).toBe(200);
    expect(mockSendContactEmail).not.toHaveBeenCalled();
    expect(mockPrismaLeadCreate).not.toHaveBeenCalled();
  });

  it("silently accepts submissions that are too fast", async () => {
    const res = await POST(jsonRequest({ ...validBody, _t: Date.now() }));

    expect(res.status).toBe(200);
    expect(mockSendContactEmail).not.toHaveBeenCalled();
    expect(mockPrismaLeadCreate).not.toHaveBeenCalled();
  });

  it("returns 502 when email sending fails", async () => {
    mockSendContactEmail.mockResolvedValue(false);
    const res = await POST(jsonRequest(validBody));

    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error).toMatch(/no se pudo/i);
  });

  it("still sends email if DB save fails", async () => {
    mockPrismaLeadCreate.mockRejectedValue(new Error("DB down"));
    const res = await POST(jsonRequest(validBody));

    expect(res.status).toBe(200);
    expect(mockSendContactEmail).toHaveBeenCalled();
  });
});
