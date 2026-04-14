import { describe, it, expect } from "vitest";
import { render } from "@react-email/render";
import { ConfirmationEmail } from "./confirmation-email";

describe("ConfirmationEmail template", () => {
  it("renders greeting with client name", async () => {
    const html = await render(ConfirmationEmail({ name: "María López" }));

    expect(html).toContain("María López");
    expect(html).toContain("Recibimos tu mensaje");
    expect(html).toContain("24 horas");
  });

  it("includes WhatsApp CTA when waNumber is provided", async () => {
    const html = await render(
      ConfirmationEmail({ name: "Carlos", waNumber: "5219991234567" }),
    );

    expect(html).toContain("wa.me/5219991234567");
    expect(html).toContain("WhatsApp");
  });

  it("hides WhatsApp CTA when waNumber is not provided", async () => {
    const html = await render(ConfirmationEmail({ name: "Carlos" }));

    expect(html).not.toContain("wa.me");
  });

  it("includes the Moving Quicker header and footer", async () => {
    const html = await render(ConfirmationEmail({ name: "Test" }));

    expect(html).toContain("Moving Quicker");
    expect(html).toContain("movingquicker.com");
  });

  it("includes no-reply disclaimer", async () => {
    const html = await render(ConfirmationEmail({ name: "Test" }));

    expect(html).toContain("correo automático");
  });

  it("escapes HTML in the name", async () => {
    const html = await render(
      ConfirmationEmail({ name: '<script>alert("x")</script>' }),
    );

    expect(html).not.toContain("<script>");
  });
});
