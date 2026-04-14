import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Moving Quicker",
  description:
    "Términos y condiciones de los servicios de desarrollo web, software y consultoría digital de Moving Quicker.",
  alternates: { canonical: "/terminos" },
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = "contacto@movingquicker.com";
const LAST_UPDATED = "9 de abril de 2026";

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

export default function TerminosPage() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pt: { xs: 12, sm: 14 }, pb: 8 }}>
      <Container maxWidth="md">
        <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
          LEGAL
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, mt: 1 }}>
          Términos y Condiciones
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Última actualización: {LAST_UPDATED}
        </Typography>
        <Divider sx={{ mb: 5 }} />

        <Section title="1. Quiénes somos">
          <P>
            Moving Quicker es un estudio de desarrollo digital con sede en Yucatán, México. Ofrecemos
            servicios de diseño y desarrollo de sitios web, software a la medida y consultoría digital
            para negocios e instituciones.
          </P>
          <P>
            Al contratar cualquiera de nuestros servicios, aceptas los presentes términos y condiciones.
            Si tienes dudas, escríbenos a{" "}
            <strong>{CONTACT_EMAIL}</strong> antes de iniciar un proyecto.
          </P>
        </Section>

        <Section title="2. Servicios">
          <P>
            Nuestros servicios incluyen, sin limitarse a: landing pages, sitios web, aplicaciones web,
            sistemas de gestión, integración de APIs, consultoría digital y mantenimiento. El alcance
            específico de cada proyecto se define en una propuesta o cotización formal antes de iniciar.
          </P>
          <P>
            No iniciamos trabajo sin una propuesta aceptada por ambas partes que especifique: alcance,
            entregables, tiempos estimados y precio.
          </P>
        </Section>

        <Section title="3. Cotizaciones y precios">
          <P>
            Los rangos de precio publicados en el sitio son orientativos. El precio final se determina
            en la cotización formal según el alcance y complejidad del proyecto.
          </P>
          <P>
            Las cotizaciones tienen una vigencia de 15 días naturales a partir de su emisión, salvo que
            se indique otro plazo. Después de este periodo, los precios pueden cambiar.
          </P>
        </Section>

        <Section title="4. Forma de pago">
          <P>
            Aceptamos transferencia bancaria, pagos con tarjeta (Stripe), PayPal y efectivo. La
            estructura de pago se acuerda en la propuesta de cada proyecto y puede incluir anticipos,
            pagos por hitos o liquidación al entregar.
          </P>
          <P>
            Emitimos factura por cada proyecto. Los precios publicados no incluyen IVA salvo que se
            indique expresamente.
          </P>
        </Section>

        <Section title="5. Proceso de trabajo y revisiones">
          <P>
            Trabajamos con aprobaciones por etapa. El cliente recibe avances y da retroalimentación
            antes de continuar. El número de rondas de revisiones se define en la propuesta de cada
            proyecto.
          </P>
          <P>
            Cambios que excedan el alcance original se consideran trabajo adicional y se cotizan por
            separado.
          </P>
        </Section>

        <Section title="6. Plazos de entrega">
          <P>
            Los tiempos de entrega se estiman en la propuesta y dependen de la complejidad del proyecto
            y la rapidez con la que el cliente proporcione contenido, retroalimentación y aprobaciones.
          </P>
          <P>
            Retrasos causados por falta de respuesta del cliente no son responsabilidad de Moving Quicker
            y pueden extender los plazos de entrega.
          </P>
        </Section>

        <Section title="7. Propiedad intelectual">
          <P>
            Al liquidar el 100% del pago acordado, el cliente recibe la propiedad completa del código
            fuente, diseños y demás entregables del proyecto. Esto incluye el derecho a modificar,
            distribuir y usar el producto sin restricciones.
          </P>
          <P>
            Moving Quicker se reserva el derecho de usar el proyecto como referencia en su portafolio,
            salvo que el cliente solicite confidencialidad por escrito.
          </P>
        </Section>

        <Section title="8. Confidencialidad">
          <P>
            Toda la información que el cliente comparta durante el proyecto se trata como confidencial.
            No compartimos datos, accesos ni contenido con terceros sin autorización del cliente.
          </P>
          <P>
            Si el proyecto lo requiere, firmamos un acuerdo de confidencialidad (NDA) antes de iniciar.
          </P>
        </Section>

        <Section title="9. Cancelación y reembolsos">
          <P>
            Si el cliente decide cancelar un proyecto en curso, se cobra proporcionalmente el trabajo
            ya realizado hasta la fecha de cancelación. El anticipo cubre las horas invertidas en
            planeación, diseño o desarrollo hasta ese momento.
          </P>
          <P>
            Si Moving Quicker cancela el proyecto por causas propias, se reembolsa el 100% de los
            pagos realizados por trabajo no entregado.
          </P>
        </Section>

        <Section title="10. Mantenimiento y soporte">
          <P>
            Las condiciones de mantenimiento post-entrega se definen en la propuesta de cada proyecto.
            Pueden incluir un periodo de soporte gratuito, un plan mensual o esquemas específicos según
            la naturaleza del trabajo.
          </P>
          <P>
            Correcciones de errores (bugs) introducidos por Moving Quicker durante el desarrollo se
            resuelven sin costo adicional dentro de los 30 días posteriores a la entrega.
          </P>
        </Section>

        <Section title="11. Hosting y servicios de terceros">
          <P>
            Moving Quicker no es responsable de la disponibilidad, rendimiento ni políticas de servicios
            de terceros (hosting, dominios, APIs, pasarelas de pago). Ayudamos al cliente a configurar
            estos servicios, pero los costos y la relación contractual son directamente entre el cliente
            y el proveedor.
          </P>
        </Section>

        <Section title="12. Limitación de responsabilidad">
          <P>
            Moving Quicker no es responsable por pérdidas indirectas, lucro cesante ni daños
            consecuenciales derivados del uso del producto entregado. Nuestra responsabilidad máxima
            se limita al monto total pagado por el proyecto en cuestión.
          </P>
        </Section>

        <Section title="13. Jurisdicción">
          <P>
            Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier
            controversia, las partes se someten a la jurisdicción de los tribunales competentes en
            Mérida, Yucatán, renunciando a cualquier otro fuero que pudiera corresponderles.
          </P>
        </Section>

        <Section title="14. Cambios a estos términos">
          <P>
            Moving Quicker puede actualizar estos términos en cualquier momento. Los cambios entran en
            vigor al publicarse en esta página. Los proyectos en curso se rigen por los términos
            vigentes al momento de aceptar la propuesta.
          </P>
        </Section>

        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary">
          ¿Dudas? Escríbenos a <strong>{CONTACT_EMAIL}</strong>.
        </Typography>
      </Container>
    </Box>
  );
}
