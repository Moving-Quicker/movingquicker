import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | Moving Quicker",
  description:
    "Aviso de privacidad integral: cómo Moving Quicker recopila, usa y protege tus datos personales al visitar el sitio o contactarnos.",
  alternates: { canonical: "/privacidad" },
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = "contacto@movingquicker.com";
const LAST_UPDATED = "14 de abril de 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
      {children}
    </Typography>
  );
}

export default function PrivacidadPage() {
  return (
    <>
    <SiteHeader />
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pt: { xs: 12, sm: 14 }, pb: 8 }}>
      <Container maxWidth="md">
        <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
          LEGAL
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, mt: 1 }}>
          Aviso de Privacidad
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Última actualización: {LAST_UPDATED}
        </Typography>
        <Divider sx={{ mb: 5 }} />

        <Section title="1. Responsable del tratamiento de datos">
          <P>
            Moving Quicker, con domicilio en Mérida, Yucatán, México, es responsable del tratamiento de
            los datos personales que nos proporciones a través de este sitio web o por medios
            asociados (correo electrónico, formularios de contacto, etc.).
          </P>
          <P>
            Para cualquier asunto relacionado con este aviso o el ejercicio de tus derechos, puedes
            contactarnos en <strong>{CONTACT_EMAIL}</strong>.
          </P>
        </Section>

        <Section title="2. Datos que recopilamos">
          <P>
            Cuando utilizas nuestro formulario de contacto u otros medios de comunicación, podemos
            recopilar: nombre, correo electrónico, número de WhatsApp, tipo de negocio o proyecto, y el
            mensaje o consulta que nos envíes.
          </P>
          <P>
            No solicitamos datos sensibles (origen étnico, salud, creencias, etc.) a través del sitio.
            Te pedimos que no incluyas ese tipo de información en tus mensajes salvo que sea estrictamente
            necesario para el servicio y con tu consentimiento explícito.
          </P>
        </Section>

        <Section title="3. Finalidades del tratamiento">
          <P>
            Utilizamos tus datos para: responder a tus consultas, elaborar y enviar cotizaciones,
            dar seguimiento a posibles proyectos, y mantener la comunicación necesaria relacionada con
            los servicios de desarrollo web, software y consultoría digital que ofrece Moving Quicker.
          </P>
          <P>
            No utilizamos tus datos con fines distintos a los anteriores sin informarte y, cuando la
            ley lo requiera, sin obtener tu consentimiento.
          </P>
        </Section>

        <Section title="4. Transferencias y encargados">
          <P>
            Para operar el sitio y atender tus solicitudes, podemos recurrir a proveedores que tratan
            datos en nuestro nombre: <strong>PostHog</strong> para análisis de uso de forma mayormente
            anónima o agregada, y el envío de correos electrónicos a través de <strong>Gmail (SMTP)</strong>{" "}
            cuando respondemos o enviamos información relacionada con tu consulta.
          </P>
          <P>
            Estos proveedores están obligados contractualmente a proteger la información y a utilizarla
            únicamente para los fines que les encomendamos. No vendemos tus datos personales a terceros.
          </P>
        </Section>

        <Section title="5. Cookies y tecnologías similares">
          <P>
            El sitio puede utilizar cookies y tecnologías similares. En particular, PostHog puede
            establecer una cookie para fines de análisis y mejora del sitio (por ejemplo, entender de
            forma agregada cómo se usa la página).
          </P>
          <P>
            Puedes configurar tu navegador para rechazar cookies; ten en cuenta que algunas funciones del
            sitio podrían verse limitadas.
          </P>
        </Section>

        <Section title="6. Derechos ARCO y limitación del uso">
          <P>
            De conformidad con la legislación aplicable en México, tienes derecho a acceder,
            rectificar, cancelar u oponerte al tratamiento de tus datos personales, así como a revocar
            el consentimiento que nos hayas otorgado, en los casos procedentes.
          </P>
          <P>
            Para ejercer estos derechos o solicitar la eliminación de tus datos de nuestros registros
            de contacto, escríbenos a <strong>{CONTACT_EMAIL}</strong> indicando tu solicitud y, en su
            caso, los datos que deseas consultar o actualizar. Responderemos en un plazo razonable.
          </P>
        </Section>

        <Section title="7. Conservación de los datos">
          <P>
            Conservamos tus datos el tiempo necesario para cumplir las finalidades descritas, atender
            obligaciones legales o contractuales, y resolver disputas. Los periodos concretos dependen
            del tipo de dato y del contexto (por ejemplo, mensajes de contacto frente a relación
            contractual en curso).
          </P>
          <P>
            Cuando ya no sean necesarios, los datos se suprimen o anonimizan de acuerdo con nuestras
            prácticas internas y la ley.
          </P>
        </Section>

        <Section title="8. Cambios a este aviso">
          <P>
            Moving Quicker puede actualizar este aviso de privacidad en cualquier momento. Los cambios
            se publicarán en esta página y, cuando corresponda, actualizaremos la fecha indicada al
            inicio de este aviso. Te recomendamos revisar este documento periódicamente.
          </P>
        </Section>

        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary">
          ¿Dudas sobre privacidad? Escríbenos a <strong>{CONTACT_EMAIL}</strong>.
        </Typography>
      </Container>
    </Box>
    </>
  );
}
