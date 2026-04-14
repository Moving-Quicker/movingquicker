import { describe, it, expect } from "vitest";
import { render } from "@react-email/render";
import { ContactEmail } from "./contact-email";

describe("ContactEmail template", () => {
  const baseProps = {
    name: "María López",
    whatsapp: "9991234567",
    businessType: "Restaurante / cafetería",
    message: "Necesito una página para mi restaurante con menú y reservaciones.",
  };

  it("renders valid HTML with all contact fields", async () => {
    const html = await render(ContactEmail(baseProps));

    expect(html).toContain("María López");
    expect(html).toContain("9991234567");
    expect(html).toContain("Restaurante / cafetería");
    expect(html).toContain(
      "Necesito una página para mi restaurante con menú y reservaciones.",
    );
  });

  it("includes preview text with the contact name", async () => {
    const html = await render(ContactEmail(baseProps));
    expect(html).toContain("Nuevo contacto de María López");
  });

  it("includes the Moving Quicker header", async () => {
    const html = await render(ContactEmail(baseProps));
    expect(html).toContain("Nuevo mensaje — Moving Quicker");
  });

  it("shows dash when businessType is undefined", async () => {
    const html = await render(
      ContactEmail({ ...baseProps, businessType: undefined }),
    );
    expect(html).toContain("—");
    expect(html).not.toContain("Restaurante");
  });

  it("escapes HTML entities in user-provided fields", async () => {
    const html = await render(
      ContactEmail({
        ...baseProps,
        name: '<script>alert("xss")</script>',
        message: "Test <b>bold</b> & special chars",
      }),
    );
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('<b>bold</b>');
  });

  it("preserves newlines in message via white-space pre-wrap", async () => {
    const html = await render(
      ContactEmail({
        ...baseProps,
        message: "Línea 1\nLínea 2\nLínea 3",
      }),
    );
    expect(html).toContain("white-space:pre-wrap");
  });

  it("renders the footer disclaimer", async () => {
    const html = await render(ContactEmail(baseProps));
    expect(html).toContain("movingquicker.com");
  });
});
