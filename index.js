const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inicializa el cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth() // Guarda las credenciales localmente
});

// Mapa para almacenar los contextos de los usuarios
const userContexts = {};

// Genera el código QR para autenticarte en WhatsApp Web
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Escanea el código QR con WhatsApp Web para conectar');
});

// Evento cuando el cliente está listo
client.on('ready', () => {
    console.log('¡Cliente WhatsApp está listo!');
});

// Responde a los mensajes entrantes
client.on('message', message => {
    const userId = message.from; // Identificador único del usuario
    if (!userContexts[userId]) {
        userContexts[userId] = { step: "inicio" }; // Inicializa el contexto del usuario
    }

    const context = userContexts[userId];

    if (message.body.toLowerCase() === 'hola') {
        const welcomeMessage = "*👋 Hola y bienvenido a Nexium Studios* \nSomos un equipo dedicado a crear soluciones tecnológicas personalizadas para ti. \n¿Cómo podemos ayudarte hoy? Responde con *\"ayuda\"* para descubrir más.";
        message.reply(welcomeMessage);
        context.step = "esperando_ayuda"; // Actualiza el contexto
    } 
    else if (message.body.toLowerCase() === 'ayuda' && context.step === "esperando_ayuda") {
        const helpMessage = "*💡 Bienvenido a Nexium Studios* 🚀 \nSomos líderes en desarrollo de tecnología a medida, con un enfoque en: \n➡️ **Diseño y desarrollo de páginas web y aplicaciones**. \n➡️ **Creación de servidores especializados para juegos**. \n➡️ **Servicios de Hosting en la nube**. \n➡️ **Consultoría tecnológica personalizada**. \n💬 *¿Qué necesitas hoy?* \nElige uno de los siguientes comandos para continuar: \n1️⃣ *Servicios* - Descubre todo lo que podemos ofrecer. \n2️⃣ *Contacto* - Comunícate directamente con un asesor. \n3️⃣ *Soporte* - Soluciona problemas técnicos con nuestra ayuda.";
        message.reply(helpMessage);
        context.step = "ayuda_mostrada"; // Avanza el contexto
    } 
    else if (message.body.toLowerCase() === 'servicios' && context.step === "ayuda_mostrada") {
        const servicesMessage = "*🌟 Nuestros Servicios 🌟* \n📌 **Desarrollo Web:** Creamos páginas únicas y plataformas personalizadas para tu negocio. \n📌 **Aplicaciones:** Diseñamos y desarrollamos apps móviles y de escritorio según tus necesidades. \n📌 **Consultoría TI:** Recibe asesoría profesional para optimizar tu tecnología. \n📌 **Hosting & Cloud Solutions:** Soluciones confiables para almacenar y gestionar tus proyectos en la nube. \n💡 ¿Quieres más información? ¡Escríbenos y te responderemos en breve!";
        message.reply(servicesMessage);
        context.step = "servicios_mostrados"; // Actualiza el contexto
    } 
    else if (message.body.toLowerCase() === 'contacto' && context.step === "ayuda_mostrada") {
        const contactMessage = "*📞 Contacto Directo* \n¿Listo para hablar con un experto? Estamos aquí para ti: \n📧 **Email:** contacto@nexiumstudios.com \n📱 **WhatsApp:** Responde directamente a este mensaje. \nUn asesor se pondrá en contacto contigo para atender tus necesidades.";
        message.reply(contactMessage);
        context.step = "contacto_mostrado"; // Actualiza el contexto
    } 
    else if (message.body.toLowerCase() === 'soporte' && context.step === "ayuda_mostrada") {
        const supportMessage = "*🛠️ Soporte Técnico a tu Alcance* \n🔧 ¿Tienes un problema técnico? Estamos listos para ayudarte. \nPor favor, proporciona los detalles de tu problema y uno de nuestros expertos te responderá lo antes posible. \n📞 Tu solución está a un mensaje de distancia. ¡Estamos aquí para ti!";
        message.reply(supportMessage);
        context.step = "soporte_mostrado"; // Actualiza el contexto
    } 
    else {
        message.reply("🚫 *Lo sentimos, no entendimos tu solicitud.* \nPor favor, escribe *\"hola\"* o *\"ayuda\"* para iniciar.");
    }
});

// Inicia el cliente
client.initialize();
