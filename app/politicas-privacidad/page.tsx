import Header from "../checkout/components/header";

export default function Tratamiento() {
  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 pr-24 pl-24 pb-24">
        <h1 className="text-[35px] font-bold text-gray-800 mb-2 text-center">Políticas de Privacidad</h1>
        <h2 className="text-[20px] font-bold text-black">1. Introducción</h2>

        <p>COMERCIALIZADORA AR LA CASA DEL CHANTILLY S.A.C., nos comprometemos a proteger la privacidad de nuestros clientes y usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos tu información personal, en cumplimiento con la Ley de Protección de Datos Personales (Ley N° 29733) y su reglamento.</p>

        <h2 className="text-[20px] font-bold text-black">2. Información que Recopilamos</h2>
        <ul>
            <li>Datos de contacto: nombres y apellidos, dirección, correo electrónico, número de teléfono.</li>
            <li>Información de pago: detalles de la tarjeta de crédito o débito, información de facturación.</li>
            <li>Datos de navegación: dirección IP, tipo de navegador, páginas visitadas, tiempo de navegación.</li>
        </ul>
        
        <h2 className="text-[20px] font-bold text-black">3. Uso de la Información</h2>
        <ul>
            <li>Procesar y gestionar tus pedidos.</li>
            <li>Mejorar nuestro sitio web y servicios.</li>
            <li>Enviar comunicaciones promocionales (solo si has dado tu consentimiento).</li>
            <li>Cumplir con obligaciones legales y regulatorias.</li>
        </ul>
        <h2 className="text-[20px] font-bold text-black">4. Compartir Información</h2>
        <ul>
            <li>No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto en los siguientes casos:</li>
            <li>Proveedores de servicios: compartimos información con terceros que nos ayudan a operar nuestro sitio web y procesar tus pedidos.</li>
            <li>Cumplimiento legal: podemos divulgar información si es requerido por la ley o en respuesta a solicitudes legales.</li>
        </ul>
        <h2 className="text-[20px] font-bold text-black">5. Seguridad de la Información</h2>
        <p>Implementamos medidas de seguridad adecuadas para proteger tu información personal contra el acceso no autorizado, la alteración, divulgación o destrucción, en cumplimiento con las normas de seguridad establecidas por la Ley N° 29733.</p>
        <h2 className="text-[20px] font-bold text-black">6. Cookies</h2>
        <p>Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio web. Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar la funcionalidad del sitio.</p>
        <h2 className="text-[20px] font-bold text-black">7. Derechos del Usuario</h2>
        <p>Tienes derecho a acceder, rectificar, cancelar y oponerte al tratamiento de tus datos personales. Para ejercer estos derechos, por favor contáctanos a través de comercializadora.chantilly@gmail.com. Responderemos a tu solicitud en los plazos establecidos por la ley.</p>
        <h2 className="text-[20px] font-bold text-black">8. Cambios en la Política de Privacidad</h2>

        <p>Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web. Te notificaremos sobre cualquier cambio significativo.</p>
        <h2 className="text-[20px] font-bold text-black">9. Contacto</h2>
        Si tienes alguna pregunta o inquietud sobre nuestra Política de Privacidad, no dudes en contactarnos a través de comercializadora.chantilly@gmail.com.
      </div>
    </>
  );
}
