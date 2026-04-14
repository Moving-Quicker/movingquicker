import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Hr,
  Preview,
} from "@react-email/components";

export interface ContactEmailProps {
  name: string;
  email: string;
  whatsapp?: string;
  businessType?: string;
  message: string;
}

const colors = {
  primary: "#0D9488",
  bg: "#f8fafc",
  white: "#ffffff",
  text: "#334155",
  textDark: "#0f172a",
  textLight: "#64748b",
  border: "#e2e8f0",
  codeBg: "#f1f5f9",
};

export function ContactEmail({
  name,
  email,
  whatsapp,
  businessType,
  message,
}: ContactEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Nuevo contacto de {name} — Moving Quicker</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={headerTextStyle}>Nuevo mensaje — Moving Quicker</Text>
          </Section>

          <Section style={contentStyle}>
            <table
              role="presentation"
              width="100%"
              cellSpacing={0}
              cellPadding={0}
              style={{ borderCollapse: "collapse" }}
            >
              <tbody>
                <Row>
                  <Column style={labelCell}>Nombre</Column>
                  <Column style={valueCell}>{name}</Column>
                </Row>
                <Row>
                  <Column style={labelCell}>Correo</Column>
                  <Column style={valueCell}>{email}</Column>
                </Row>
                {whatsapp && (
                  <Row>
                    <Column style={labelCell}>WhatsApp</Column>
                    <Column style={valueCell}>{whatsapp}</Column>
                  </Row>
                )}
                <Row>
                  <Column style={labelCell}>Tipo de negocio</Column>
                  <Column style={valueCell}>{businessType || "—"}</Column>
                </Row>
              </tbody>
            </table>

            <Hr style={hrStyle} />

            <Text style={messageLabelStyle}>Mensaje</Text>
            <table
              role="presentation"
              width="100%"
              cellSpacing={0}
              cellPadding={0}
              style={{ borderCollapse: "collapse" }}
            >
              <tbody>
                <Row>
                  <Column style={messageBoxStyle}>
                    <Text style={messageTextStyle}>{message}</Text>
                  </Column>
                </Row>
              </tbody>
            </table>
          </Section>

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Este correo fue generado automáticamente desde movingquicker.com
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
  padding: 24,
};

const labelCell: React.CSSProperties = {
  padding: "10px 0",
  borderBottom: `1px solid ${colors.border}`,
  fontWeight: 600,
  width: 140,
  verticalAlign: "top",
  fontSize: 15,
  color: colors.text,
};

const valueCell: React.CSSProperties = {
  padding: "10px 0",
  borderBottom: `1px solid ${colors.border}`,
  fontSize: 15,
  color: colors.text,
};

const hrStyle: React.CSSProperties = {
  borderColor: colors.border,
  margin: "20px 0 16px",
};

const messageLabelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 14,
  color: colors.textDark,
  margin: "0 0 8px",
};

const messageBoxStyle: React.CSSProperties = {
  backgroundColor: colors.codeBg,
  borderLeft: `4px solid ${colors.primary}`,
  borderRadius: "0 8px 8px 0",
  padding: "16px 18px",
  width: "100%",
};

const messageTextStyle: React.CSSProperties = {
  fontSize: 15,
  lineHeight: "1.6",
  color: "#1e293b",
  margin: 0,
  whiteSpace: "pre-wrap",
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
