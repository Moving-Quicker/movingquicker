import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSendContactEmail = vi.fn<() => Promise<boolean>>();
const mockIsEmailConfigured = vi.fn<() => boolean>();
const mockPrismaLeadCreate = vi.fn();

vi.mock("@/lib/email", () => ({
  sendContactEmail: (...args: unknown[]) => mockSendContactEmail(...(args as [])),
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
  whatsapp: "9991234567",
  businessType: "Comercio local",
  message: "Quiero una landing page para mi tienda.",
  visitorId: "visitor-abc-123",
  source: "form",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsEmailConfigured.mockReturnValue(true);
    mockSendContactEmail.mockResolvedValue(true);
    mockPrismaLeadCreate.mockResolvedValue({ id: "lead-1" });
  });

  // ── Happy path ──

  it("returns 200 and saves lead + sends email with valid data", async () => {
    const res = await POST(jsonRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ success: true });

    expect(mockPrismaLeadCreate).toHaveBeenCalledWith({
      data: {
        visitorId: "visitor-abc-123",
        name: "Carlos Ruiz",
        whatsapp: "9991234567",
        businessType: "Comercio local",
        message: "Quiero una landing page para mi tienda.",
        source: "form",
      },
    });

    expect(mockSendContactEmail).toHaveBeenCalledWith({
      name: "Carlos Ruiz",
      whatsapp: "9991234567",
      businessType: "Comercio local",
      message: "Quiero una landing page para mi tienda.",
    });
  });

  it("returns 200 even without visitorId (skips DB save)", async () => {
    const { visitorId, ...body } = validBody;
    const res = await POST(jsonRequest(body));

    expect(res.status).toBe(200);
    expect(mockPrismaLeadCreate).not.toHaveBeenCalled();
    expect(mockSendContactEmail).toHaveBeenCalled();
  });

  it("returns 200 with optional businessType missing", async () => {
    const { businessType, ...body } = validBody;
    const res = await POST(jsonRequest(body));

    expect(res.status).toBe(200);
    expect(mockSendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({ businessType: undefined }),
    );
  });

  it("trims whitespace from all fields", async () => {
    const res = await POST(
      jsonRequest({
        ...validBody,
        name: "  Carlos Ruiz  ",
        whatsapp: " 9991234567 ",
        message: "  Mi mensaje  ",
      }),
    );

    expect(res.status).toBe(200);
    expect(mockSendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Carlos Ruiz",
        whatsapp: "9991234567",
        message: "Mi mensaje",
      }),
    );
  });

  it("handles chat source from the chat-quote flow", async () => {
    const res = await POST(
      jsonRequest({
        ...validBody,
        source: "chat",
        message:
          "[Chat Quote] Tipo: landing, Páginas: 5, Extras: seo. Mensaje: Necesito presencia web.",
      }),
    );

    expect(res.status).toBe(200);
    expect(mockPrismaLeadCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ source: "chat" }),
      }),
    );
  });

  // ── Validation errors ──

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
    const data = await res.json();
    expect(data.error).toMatch(/nombre/i);
  });

  it("returns 400 when name is empty string", async () => {
    const res = await POST(jsonRequest({ ...validBody, name: "   " }));

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/nombre/i);
  });

  it("returns 400 when whatsapp is missing", async () => {
    const { whatsapp, ...body } = validBody;
    const res = await POST(jsonRequest(body));

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/WhatsApp/i);
  });

  it("returns 400 when message is missing", async () => {
    const { message, ...body } = validBody;
    const res = await POST(jsonRequest(body));

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/mensaje/i);
  });

  // ── Error handling ──

  it("returns 502 when email sending fails", async () => {
    mockSendContactEmail.mockResolvedValue(false);
    const res = await POST(jsonRequest(validBody));

    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error).toMatch(/no se pudo/i);
  });

  it("still sends email if DB save fails (graceful degradation)", async () => {
    mockPrismaLeadCreate.mockRejectedValue(new Error("DB down"));
    const res = await POST(jsonRequest(validBody));

    expect(res.status).toBe(200);
    expect(mockSendContactEmail).toHaveBeenCalled();
  });
});
