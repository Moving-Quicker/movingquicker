import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
  Link,
} from "@react-email/components";

export interface ConfirmationEmailProps {
  name: string;
  waNumber?: string;
}

const colors = {
  primary: "#0D9488",
  bg: "#f8fafc",
  white: "#ffffff",
  text: "#334155",
  textDark: "#0f172a",
  textLight: "#64748b",
  border: "#e2e8f0",
};

export function ConfirmationEmail({ name, waNumber }: ConfirmationEmailProps) {
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=Hola%2C%20acabo%20de%20enviar%20un%20formulario%20en%20movingquicker.com`
    : null;

  return (
    <Html lang="es">
      <Head />
      <Preview>Recibimos tu mensaje, {name} — Moving Quicker</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={headerTextStyle}>Moving Quicker</Text>
          </Section>

          <Section style={contentStyle}>
            <Text style={greetingStyle}>¡Hola {name}!</Text>

            <Text style={paragraphStyle}>
              Recibimos tu mensaje correctamente. Nuestro equipo lo revisará y
              te contactaremos en las próximas <strong>24 horas hábiles</strong>.
            </Text>

            {waLink && (
              <>
                <Text style={paragraphStyle}>
                  Si tu proyecto es urgente, puedes escribirnos directamente por
                  WhatsApp:
                </Text>

                <Section style={ctaContainer}>
                  <Link href={waLink} style={ctaStyle}>
                    Escríbenos por WhatsApp
                  </Link>
                </Section>
              </>
            )}

            <Hr style={hrStyle} />

            <Text style={smallText}>
              Este es un correo automático. No es necesario responder.
            </Text>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              © {new Date().getFullYear()} Moving Quicker · movingquicker.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  backgroundColor: colors.bg,
  fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 560,
  margin: "24px auto",
  backgroundColor: colors.white,
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
};

const headerStyle: React.CSSProperties = {
  backgroundColor: colors.primary,
  padding: "20px 24px",
};

const headerTextStyle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: 20,
  fontWeight: 700,
  margin: 0,
};

const contentStyle: React.CSSProperties = {
  padding: "28px 24px",
};

const greetingStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: colors.textDark,
  margin: "0 0 16px",
};

const paragraphStyle: React.CSSProperties = {
  fontSize: 15,
  lineHeight: "1.6",
  color: colors.text,
  margin: "0 0 14px",
};

const ctaContainer: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const ctaStyle: React.CSSProperties = {
  backgroundColor: colors.primary,
  color: "#ffffff",
  padding: "12px 28px",
  borderRadius: 8,
  fontSize: 15,
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
};

const hrStyle: React.CSSProperties = {
  borderColor: colors.border,
  margin: "24px 0 16px",
};

const smallText: React.CSSProperties = {
  fontSize: 13,
  color: colors.textLight,
  margin: 0,
};

const footerStyle: React.CSSProperties = {
  padding: "12px 24px",
  backgroundColor: colors.bg,
};

const footerTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: colors.textLight,
  textAlign: "center" as const,
  margin: 0,
};
