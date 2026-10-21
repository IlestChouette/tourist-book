import Hero from "@/components/Hero";
import { getLocale } from "@/lib/i18n/locale";

const content = {
  fr: {
    metaTitle: "Politique de confidentialité — Tourist Book",
    metaDescription: "Politique de confidentialité de Tourist Book, le livret d'accueil numérique pour hôtes Airbnb de la Côte d'Azur.",
    eyebrow: "Légal",
    title: "Politique de confidentialité",
    notice:
      "Modèle de départ rédigé conformément aux principes du Règlement (UE) 2016/679 (RGPD), pas un avis juridique. Complétez-le avec les données exactes de votre entreprise et faites-le relire par un spécialiste avant d'opérer avec de vrais clients — en particulier pour le traitement des pièces d'identité (offre Premium).",
    s1Title: "1. Responsable du traitement",
    s1Body1: "Tourist Book est un service exploité par",
    s1Body2:
      ", SAS unipersonnelle domiciliée au 143 Promenade des Anglais, 06200 Nice, France (SIREN 942 069 949, RCS Nice). Pour toute question relative à vos données personnelles, vous pouvez écrire à",
    s2Title: "2. Quelles données nous collectons, et de qui",
    s2HostLabel: "De l'hôtelier",
    s2HostBody:
      "(compte du panel) : nom, email, mot de passe (stocké chiffré), logo, données des propriétés gérées, et données de facturation gérées directement par Stripe (nous ne stockons pas les numéros de carte).",
    s2BasicLabel: "De l'hôte, offre Essentiel",
    s2BasicBody:
      "(accès par code) : aucune donnée personnelle — l'accès se fait avec un code numérique partagé par l'hôtelier, sans inscription.",
    s2PremiumLabel: "De l'hôte, offre Premium",
    s2PremiumBody:
      "(check-in électronique) : nom (indiqué par l'hôtelier lors de la création de la réservation), téléphone, email, nationalité, numéro de pièce d'identité ou passeport, une photo de ce document, une photo type selfie pour vérification, une signature électronique, ainsi que les dates du séjour.",
    s2TechLabel: "Données techniques",
    s2TechBody: "cookies strictement nécessaires au maintien de la session et à l'accès au livret, et à la mémorisation de la langue choisie (voir section 8).",
    s3Title: "3. Finalité et base juridique",
    s3ContractLabel: "Exécution du contrat",
    s3ContractBody:
      "(art. 6.1.b RGPD) : créer et gérer le compte de l'hôtelier, générer le livret d'accueil, traiter le check-in électronique et donner à l'hôte accès aux informations de son logement pendant son séjour.",
    s3LegalLabel: "Respect d'une obligation légale",
    s3LegalBody:
      "(art. 6.1.c RGPD) : lorsque la réglementation locale d'enregistrement des voyageurs applicable au logement l'exige, l'hôtelier peut avoir besoin de conserver ou de communiquer les données d'identité de l'hôte aux autorités compétentes.",
    s3InterestLabel: "Intérêt légitime",
    s3InterestBody: "(art. 6.1.f RGPD) : sécurité du service, prévention de la fraude et amélioration de la plateforme.",
    s3Footer:
      "Nous n'utilisons pas les données des hôtes à des fins marketing, ni ne les vendons ni ne les cédons à des tiers autres que ceux indiqués à la section 4.",
    s4Title: "4. Destinataires et sous-traitants",
    s4Body1:
      "Les données d'identité d'un hôte ne sont accessibles qu'à l'hôtelier du logement concerné, pour vérifier manuellement le check-in. Tourist Book n'y accède pas, sauf besoin technique ponctuel (par exemple, support en cas d'incident) ou obligation légale. Nous utilisons les sous-traitants suivants, soumis à un accord de traitement des données :",
    s4Supabase: "Supabase (base de données, authentification et stockage des documents)",
    s4Stripe: "Stripe (traitement des paiements et facturation de l'abonnement)",
    s4More: "Autres prestataires : Vercel (hébergement du site), Resend (envoi des emails) et Anthropic (assistant IA du livret Premium : les questions du voyageur et le contenu du livret lui sont transmis pour répondre). Certains sont situés aux États-Unis ; les transferts reposent sur les clauses contractuelles types ou le cadre de protection des données UE–États-Unis.",
    s4Body2:
      "Ces prestataires peuvent héberger des données hors de l'Espace économique européen ; le cas échéant, le transfert repose sur les Clauses Contractuelles Types de la Commission européenne ou un autre mécanisme de transfert reconnu par le RGPD.",
    s5Title: "5. Durée de conservation",
    s5DocLabel: "Pièce d'identité, selfie et signature de l'hôte",
    s5DocBody:
      ": stockés dans un espace privé non accessible publiquement et conservés 6 mois après le départ de l'hôte, conformément à l'obligation légale de conservation de la fiche individuelle de police pour les voyageurs étrangers (article R.611-42 du CESEDA) ; passé ce délai, ils sont supprimés définitivement. Si l'hôtelier a besoin d'y accéder après le départ de l'hôte pour un motif légal, il doit nous en faire la demande via notre page de contact, en indiquant le nom de l'hôte et les dates du séjour, afin que nous puissions localiser l'enregistrement correspondant.",
    s5RestLabel: "Autres données de l'hôte",
    s5RestBody:
      "(nom, contact, dates) : conservées tant que le compte lié à la réservation reste actif, et supprimées peu après la date de départ sauf obligation légale de les conserver plus longtemps.",
    s5HostLabel: "Données de l'hôtelier",
    s5HostBody: "conservées tant que le compte est actif, et jusqu'à 5 ans après sa fermeture pour respecter les obligations comptables et fiscales.",
    s6Title: "6. Sécurité",
    s6Body:
      "Les mots de passe sont stockés chiffrés (jamais en texte clair). Les pièces d'identité sont conservées dans un espace de stockage privé, cloisonné par hôtelier, avec accès restreint via des liens temporaires à usage unique. Les communications avec la plateforme voyagent chiffrées (HTTPS).",
    s7Title: "7. Vos droits",
    s7Body1:
      "Vous pouvez demander à tout moment l'accès, la rectification, l'effacement, la limitation du traitement, la portabilité de vos données, ou vous opposer à leur traitement, en écrivant à",
    s7Body2:
      ". Nous répondrons dans un délai d'un mois à compter de la demande. Si vous estimez que le traitement de vos données n'est pas conforme à la réglementation, vous avez le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente (par exemple la CNIL en France — www.cnil.fr — ou l'autorité de protection des données de votre pays de résidence).",
    s7Body3:
      "Si vous êtes un hôte et souhaitez exercer ces droits sur vos données de check-in, vous pouvez vous adresser directement à l'hôtelier du logement (responsable de votre réservation) ou à nous, et nous transmettrons la demande.",
    s8Title: "8. Cookies",
    s8Body:
      "Nous utilisons des cookies techniques, strictement nécessaires au fonctionnement du service (maintenir la session de l'hôtelier connectée, mémoriser l'accès d'un hôte à son livret pendant le séjour, retenir la langue et le choix de cookies) : ceux-ci ne nécessitent pas votre consentement au regard de la réglementation (ePrivacy). Avec votre accord, nous utilisons aussi Google Analytics pour mesurer la fréquentation du site (pages consultées, provenance du trafic) — ces cookies ne sont déposés qu'après que vous ayez cliqué sur « Accepter » dans le bandeau affiché en bas de page, et vous pouvez changer d'avis à tout moment en effaçant les cookies de votre navigateur pour ce site.",
    s9Title: "9. Mineurs",
    s9Body:
      "La plateforme ne s'adresse pas aux mineurs. La création d'un compte hôtelier requiert d'être majeur et d'avoir la capacité juridique de contracter.",
    cahierTitle: "Cahier de consignes des hôtels",
    cahierItems: [
      "Rôles : l'hôtel est responsable du traitement de ses consignes et des données de son équipe ; Tourist Book agit comme sous-traitant (art. 28 RGPD) et fournit un accord de sous-traitance sur demande à allo@ilestchouette.fr.",
      "Données traitées : le texte des consignes (écrit librement par l'hôtel), le nom des personnes de l'équipe, leur code personnel à 4 chiffres (jamais conservé en clair : seulement une empreinte signée par une clé du serveur), l'historique de qui a écrit et validé chaque consigne, et les adresses email de relève choisies par l'hôtel.",
      "Visibilité : le personnel voit uniquement l'état des consignes (écrite, faite). Seuls le manager et les responsables de service qu'il désigne voient qui a écrit et qui a validé, et uniquement pour leurs services.",
      "Minimisation : n'écrivez dans une consigne que ce qui est utile au service. Évitez les données sensibles sur les clients (santé, religion, opinions) et les informations sans lien avec l'exploitation.",
      "Durée de conservation : les consignes sont supprimées automatiquement 36 mois après leur date. Le manager est prévenu par email 3 mois avant, avec un lien pour les télécharger, et peut les exporter (PDF, Excel) à tout moment. Trois mois après la fin de l'abonnement, toutes les données du cahier de l'hôtel (consignes, équipe, services, accès) sont supprimées définitivement ; un email d'avertissement avec un lien de téléchargement est envoyé un mois avant. Nous recommandons de faire une copie avant de résilier. La suppression peut aussi être demandée à allo@ilestchouette.fr.",
      "Emails de relève : envoyés aux adresses indiquées par l'hôtel (6h55, 14h55 et 22h55) ; chaque email contient un lien pour retirer l'adresse du destinataire.",
    ],
    s10Title: "10. Modifications",
    s10Body:
      "Nous pouvons mettre à jour cette politique pour refléter des changements légaux ou du service. La date de dernière mise à jour est indiquée en bas de cette page ; nous vous recommandons de la consulter régulièrement.",
    lastUpdated: "Dernière mise à jour : 1er septembre 2026.",
  },
  en: {
    metaTitle: "Privacy policy — Tourist Book",
    metaDescription: "Privacy policy for Tourist Book, the digital welcome book for Airbnb hosts on the French Riviera.",
    eyebrow: "Legal",
    title: "Privacy policy",
    notice:
      "Starting template drafted in line with the principles of Regulation (EU) 2016/679 (GDPR), not legal advice. Fill it in with your company's exact details and have it reviewed by a specialist before operating with real customers — particularly for the processing of ID documents (Premium plan).",
    s1Title: "1. Data controller",
    s1Body1: "Tourist Book is a service operated by",
    s1Body2:
      ", a single-shareholder SAS based at 143 Promenade des Anglais, 06200 Nice, France (SIREN 942 069 949, RCS Nice). For any question about your personal data you can write to",
    s2Title: "2. What data we collect, and from whom",
    s2HostLabel: "From the host",
    s2HostBody:
      "(panel account): name, email, password (stored encrypted), logo, data of the properties managed, and billing data handled directly by Stripe (we do not store card numbers).",
    s2BasicLabel: "From the guest, Essential plan",
    s2BasicBody:
      "(code-based access): no personal data — access is done with a numeric code shared by the host, no sign-up required.",
    s2PremiumLabel: "From the guest, Premium plan",
    s2PremiumBody:
      "(electronic check-in): name (entered by the host when creating the booking), phone, email, nationality, ID document or passport number, a photo of that document, a selfie-type photo for verification, an electronic signature, and the stay dates.",
    s2TechLabel: "Technical data",
    s2TechBody: "cookies strictly necessary to keep the session active, give access to the welcome book, and remember the chosen language (see section 8).",
    s3Title: "3. Purpose and legal basis",
    s3ContractLabel: "Performance of the contract",
    s3ContractBody:
      "(art. 6.1.b GDPR): creating and managing the host's account, generating the welcome book, processing electronic check-in, and giving the guest access to their property's information during their stay.",
    s3LegalLabel: "Compliance with a legal obligation",
    s3LegalBody:
      "(art. 6.1.c GDPR): where the local traveler-registration regulation applicable to the property requires it, the host may need to keep or report the guest's identity data to the competent authorities.",
    s3InterestLabel: "Legitimate interest",
    s3InterestBody: "(art. 6.1.f GDPR): service security, fraud prevention and platform improvement.",
    s3Footer:
      "We do not use guest data for marketing purposes, nor do we sell it or share it with third parties other than those listed in section 4.",
    s4Title: "4. Recipients and processors",
    s4Body1:
      "A guest's identity data is only accessible to the host of the corresponding property, to manually verify check-in. Tourist Book does not review or access it except for occasional technical needs (e.g. support during an incident) or legal obligation. We use the following processors, subject to a data processing agreement:",
    s4Supabase: "Supabase (database, authentication and document storage)",
    s4Stripe: "Stripe (payment processing and subscription billing)",
    s4More: "Other providers: Vercel (site hosting), Resend (email delivery) and Anthropic (AI assistant of the Premium welcome book: the guest's questions and the book content are sent to it to answer). Some are located in the United States; transfers rely on standard contractual clauses or the EU–US data protection framework.",
    s4Body2:
      "These providers may host data outside the European Economic Area; in that case, the transfer relies on the European Commission's Standard Contractual Clauses or another transfer mechanism recognized by the GDPR.",
    s5Title: "5. Retention period",
    s5DocLabel: "Guest's ID document, selfie and signature",
    s5DocBody:
      ": stored in a private space not publicly accessible and kept for 6 months after the guest's departure, in line with the legal requirement to retain the individual police record for foreign travelers (Article R.611-42 of the CESEDA); after that period they are permanently deleted. If the host needs access to them after the guest's departure for a legal reason, they must request it through our contact page, providing the guest's name and stay dates so we can locate the corresponding record.",
    s5RestLabel: "Other guest data",
    s5RestBody:
      "(name, contact, dates): kept while the account linked to the booking remains active, and deleted shortly after the departure date unless there is a legal obligation to keep it longer.",
    s5HostLabel: "Host data",
    s5HostBody: "kept while the account is active, and up to 5 years after it closes to meet accounting and tax obligations.",
    s6Title: "6. Security",
    s6Body:
      "Passwords are stored encrypted (never in plain text). ID documents are kept in private storage, isolated per host, with access restricted through single-use temporary links. Communications with the platform travel encrypted (HTTPS).",
    s7Title: "7. Your rights",
    s7Body1:
      "You can request access, rectification, erasure, restriction of processing, data portability, or object to its processing at any time, by writing to",
    s7Body2:
      ". We will respond within one month of the request. If you believe the processing of your data does not comply with the regulation, you have the right to lodge a complaint with the competent supervisory authority (for example the CNIL in France — www.cnil.fr — or the data protection authority in your country of residence).",
    s7Body3:
      "If you are a guest and want to exercise these rights over your check-in data, you can contact the host of the property (responsible for your booking) directly, or contact us and we will forward the request.",
    s8Title: "8. Cookies",
    s8Body:
      "We use technical cookies, strictly necessary for the service to work (keeping the host's session logged in, remembering a guest's access to their welcome book during their stay, remembering the chosen language and cookie choice): these do not require your consent under cookie regulation (ePrivacy). With your consent, we also use Google Analytics to measure site traffic (pages viewed, traffic source) — these cookies are only set after you click \"Accept\" on the banner shown at the bottom of the page, and you can change your mind at any time by clearing this site's cookies in your browser.",
    s9Title: "9. Minors",
    s9Body:
      "The platform is not aimed at minors. Creating a host account requires being of legal age and having the legal capacity to contract.",
    cahierTitle: "Hotel instruction logbook",
    cahierItems: [
      "Roles: the hotel is the controller of its instructions and of its team's data; Tourist Book acts as processor (GDPR art. 28) and provides a data processing agreement on request at allo@ilestchouette.fr.",
      "Data processed: the text of the instructions (freely written by the hotel), team members' names, their 4-digit personal code (never stored in clear: only a fingerprint signed with a server key), the history of who wrote and who validated each instruction, and the handover email addresses chosen by the hotel.",
      "Visibility: staff only see the status of instructions (written, done). Only the manager and the service supervisors they appoint see who wrote and who validated, and only for their own services.",
      "Minimisation: write only what the service needs in an instruction. Avoid sensitive guest data (health, religion, opinions) and information unrelated to operations.",
      "Retention: instructions are deleted automatically 36 months after their date. The manager is warned by email 3 months ahead, with a download link, and can export them (PDF, Excel) at any time. Three months after the subscription ends, all the hotel's logbook data (instructions, team, services, access) is permanently deleted; a warning email with a download link is sent one month before. We recommend making a copy before cancelling. Deletion can also be requested at allo@ilestchouette.fr.",
      "Handover emails: sent to the addresses given by the hotel (6:55, 14:55 and 22:55); each email contains a link to remove the recipient's address.",
    ],
    s10Title: "10. Changes",
    s10Body:
      "We may update this policy to reflect legal or service changes. The last-updated date is shown at the bottom of this page; we recommend checking it periodically.",
    lastUpdated: "Last updated: September 1, 2026.",
  },
  es: {
    metaTitle: "Política de privacidad — Tourist Book",
    metaDescription: "Política de privacidad de Tourist Book, el livret de bienvenida digital para anfitriones Airbnb en la Costa Azul.",
    eyebrow: "Legal",
    title: "Política de privacidad",
    notice:
      "Plantilla de partida redactada conforme a los principios del Reglamento (UE) 2016/679 (RGPD), no asesoría legal. Complétala con los datos exactos de tu empresa y hazla revisar por un especialista antes de operar con clientes reales — en particular por el tratamiento de documentos de identidad (plan Premium).",
    s1Title: "1. Responsable del tratamiento",
    s1Body1: "Tourist Book es un servicio operado por",
    s1Body2:
      ", SAS unipersonal con domicilio en 143 Promenade des Anglais, 06200 Niza, Francia (SIREN 942 069 949, RCS Nice). Para cualquier cuestión relativa a tus datos personales puedes escribir a",
    s2Title: "2. Qué datos recogemos y de quién",
    s2HostLabel: "Del hotelero",
    s2HostBody:
      "(cuenta del panel): nombre, email, contraseña (almacenada cifrada), logotipo, datos de las propiedades gestionadas, y datos de facturación gestionados directamente por Stripe (no almacenamos números de tarjeta).",
    s2BasicLabel: "Del huésped, plan Básico",
    s2BasicBody:
      "(acceso por código): ningún dato personal — el acceso se hace con un código numérico compartido por el hotelero, sin registro.",
    s2PremiumLabel: "Del huésped, plan Premium",
    s2PremiumBody:
      "(check-in electrónico): nombre (indicado por el hotelero al crear la reserva), teléfono, email, nacionalidad, número de documento de identidad o pasaporte, una fotografía de dicho documento, una fotografía tipo selfie para verificación, una firma electrónica, y las fechas de estancia.",
    s2TechLabel: "Datos técnicos",
    s2TechBody: "cookies estrictamente necesarias para mantener la sesión iniciada, el acceso al livret, y recordar el idioma elegido (ver sección 8).",
    s3Title: "3. Finalidad y base jurídica",
    s3ContractLabel: "Ejecución del contrato",
    s3ContractBody:
      "(art. 6.1.b RGPD): crear y gestionar la cuenta del hotelero, generar el livret de acogida, procesar el check-in electrónico y dar acceso al huésped a la información de su alojamiento durante su estancia.",
    s3LegalLabel: "Cumplimiento de una obligación legal",
    s3LegalBody:
      "(art. 6.1.c RGPD): cuando la normativa local de registro de viajeros aplicable al alojamiento lo exija, el hotelero puede necesitar conservar o comunicar los datos de identidad del huésped a las autoridades competentes.",
    s3InterestLabel: "Interés legítimo",
    s3InterestBody: "(art. 6.1.f RGPD): seguridad del servicio, prevención de fraude y mejora de la plataforma.",
    s3Footer:
      "No utilizamos los datos de los huéspedes con fines de marketing ni los vendemos ni cedemos a terceros distintos de los indicados en la sección 4.",
    s4Title: "4. Destinatarios y encargados del tratamiento",
    s4Body1:
      "Los datos de identidad de un huésped solo son accesibles por el hotelero de la propiedad correspondiente, para verificar manualmente el check-in. Tourist Book no los revisa ni accede a ellos salvo requerimiento técnico puntual (por ejemplo, soporte ante un incidente) o obligación legal. Utilizamos los siguientes encargados del tratamiento, sujetos a acuerdo de tratamiento de datos:",
    s4Supabase: "Supabase (base de datos, autenticación y almacenamiento de documentos)",
    s4Stripe: "Stripe (procesamiento de pagos y facturación de la suscripción)",
    s4More: "Otros proveedores: Vercel (alojamiento del sitio), Resend (envío de correos) y Anthropic (asistente de IA del livret Premium: se le envían las preguntas del huésped y el contenido del livret para responder). Algunos están en Estados Unidos; las transferencias se basan en cláusulas contractuales tipo o en el marco de protección de datos UE–EE. UU.",
    s4Body2:
      "Estos proveedores pueden alojar datos fuera del Espacio Económico Europeo; en ese caso, la transferencia se realiza sobre la base de las Cláusulas Contractuales Tipo de la Comisión Europea u otro mecanismo de transferencia reconocido por el RGPD.",
    s5Title: "5. Plazo de conservación",
    s5DocLabel: "Documento de identidad, selfie y firma del huésped",
    s5DocBody:
      ": se almacenan en un espacio privado no accesible públicamente y se conservan 6 meses después de la salida del huésped, conforme a la obligación legal de conservar la ficha individual de policía para viajeros extranjeros (artículo R.611-42 del CESEDA); transcurrido ese plazo se eliminan de forma definitiva. Si el hotelero necesita acceder a ellos después de la salida del huésped por un motivo legal, debe solicitarlo a través de nuestra página de contacto, indicando el nombre del huésped y las fechas de la estancia, para que podamos localizar el registro correspondiente.",
    s5RestLabel: "Resto de datos del huésped",
    s5RestBody:
      "(nombre, contacto, fechas): se conservan mientras la cuenta ligada a la reserva permanezca activa, y se eliminan poco después de la fecha de salida salvo obligación legal de conservarlos más tiempo.",
    s5HostLabel: "Datos del hotelero",
    s5HostBody: "se conservan mientras la cuenta esté activa, y hasta 5 años tras su cierre para cumplir obligaciones contables y fiscales.",
    s6Title: "6. Seguridad",
    s6Body:
      "Las contraseñas se almacenan cifradas (nunca en texto plano). Los documentos de identidad se guardan en un almacenamiento privado, aislado por hotelero, con acceso restringido mediante enlaces temporales de un solo uso. Las comunicaciones con la plataforma viajan cifradas (HTTPS).",
    s7Title: "7. Tus derechos",
    s7Body1:
      "Puedes solicitar en cualquier momento el acceso, la rectificación, la supresión, la limitación del tratamiento, la portabilidad de tus datos, o oponerte a su tratamiento, escribiendo a",
    s7Body2:
      ". Responderemos en el plazo de un mes desde la solicitud. Si consideras que el tratamiento de tus datos no se ajusta a la normativa, tienes derecho a presentar una reclamación ante la autoridad de control competente (por ejemplo, la CNIL en Francia — www.cnil.fr — o la autoridad de protección de datos de tu país de residencia).",
    s7Body3:
      "Si eres huésped y quieres ejercer estos derechos sobre tus datos de check-in, puedes dirigirte directamente al hotelero de la propiedad (responsable de tu reserva) o a nosotros, y trasladaremos la solicitud.",
    s8Title: "8. Cookies",
    s8Body:
      "Usamos cookies técnicas, estrictamente necesarias para el funcionamiento del servicio (mantener la sesión del hotelero iniciada, recordar el acceso de un huésped a su livret durante la estancia, recordar el idioma y la elección de cookies): estas no requieren tu consentimiento conforme a la normativa (ePrivacy). Con tu consentimiento, también usamos Google Analytics para medir la audiencia del sitio (páginas visitadas, origen del tráfico) — estas cookies solo se activan si hacés clic en \"Aceptar\" en el aviso que aparece al pie de la página, y podés cambiar de opinión en cualquier momento borrando las cookies de este sitio en tu navegador.",
    s9Title: "9. Menores de edad",
    s9Body:
      "La plataforma no está dirigida a menores de edad. La creación de una cuenta de hotelero requiere ser mayor de edad y tener capacidad legal para contratar.",
    cahierTitle: "Cuaderno de consignas de hoteles",
    cahierItems: [
      "Roles: el hotel es el responsable del tratamiento de sus consignas y de los datos de su equipo; Tourist Book actúa como encargado del tratamiento (art. 28 RGPD) y facilita un contrato de encargo a petición en allo@ilestchouette.fr.",
      "Datos tratados: el texto de las consignas (escrito libremente por el hotel), el nombre de las personas del equipo, su código personal de 4 cifras (nunca se guarda en claro: solo una huella firmada con una clave del servidor), el historial de quién escribió y quién validó cada consigna, y los correos de relevo elegidos por el hotel.",
      "Visibilidad: el personal solo ve el estado de las consignas (escrita, hecha). Solo el manager y los responsables de servicio que él designe ven quién escribió y quién validó, y únicamente en sus servicios.",
      "Minimización: escribe en una consigna solo lo que el servicio necesita. Evita datos sensibles de clientes (salud, religión, opiniones) e información ajena a la explotación.",
      "Plazo de conservación: las consignas se eliminan automáticamente 36 meses después de su fecha. El manager recibe un aviso por correo 3 meses antes, con un enlace de descarga, y puede exportarlas (PDF, Excel) en cualquier momento. Tres meses después de terminar la suscripción, todos los datos del cuaderno del hotel (consignas, equipo, servicios, accesos) se eliminan definitivamente; un mes antes se envía un correo de aviso con un enlace de descarga. Recomendamos hacer una copia antes de cancelar. La eliminación también puede solicitarse en allo@ilestchouette.fr.",
      "Correos de relevo: se envían a las direcciones indicadas por el hotel (6:55, 14:55 y 22:55); cada correo incluye un enlace para retirar la dirección del destinatario.",
    ],
    s10Title: "10. Modificaciones",
    s10Body:
      "Podemos actualizar esta política para reflejar cambios legales o del servicio. La fecha de la última actualización se indica al pie de esta página; te recomendamos consultarla periódicamente.",
    lastUpdated: "Última actualización: 1 de septiembre de 2026.",
  },
};

export async function generateMetadata() {
  const locale = await getLocale();
  return {
    title: content[locale].metaTitle,
    description: content[locale].metaDescription,
    alternates: { canonical: "/privacidad" },
  };
}

export default async function PrivacidadPage() {
  const locale = await getLocale();
  const t = content[locale];

  return (
    <main className="flex-1">
      <Hero eyebrow={t.eyebrow} title={t.title} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-terracotta bg-sand-card p-4 text-sm text-ink/80">{t.notice}</div>

        <div className="mt-8 grid gap-6 text-ink/80">
          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s1Title}</h2>
            <p className="mt-2">
              {t.s1Body1} <span className="font-bold">Il est chouette</span>
              {t.s1Body2} <span className="font-bold">allo@ilestchouette.fr</span>.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s2Title}</h2>
            <ul className="mt-2 grid gap-1">
              <li>• <span className="font-bold">{t.s2HostLabel}</span> {t.s2HostBody}</li>
              <li>• <span className="font-bold">{t.s2BasicLabel}</span> {t.s2BasicBody}</li>
              <li>• <span className="font-bold">{t.s2PremiumLabel}</span> {t.s2PremiumBody}</li>
              <li>• <span className="font-bold">{t.s2TechLabel}</span>: {t.s2TechBody}</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s3Title}</h2>
            <ul className="mt-2 grid gap-1">
              <li>• <span className="font-bold">{t.s3ContractLabel}</span> {t.s3ContractBody}</li>
              <li>• <span className="font-bold">{t.s3LegalLabel}</span> {t.s3LegalBody}</li>
              <li>• <span className="font-bold">{t.s3InterestLabel}</span> {t.s3InterestBody}</li>
            </ul>
            <p className="mt-2">{t.s3Footer}</p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s4Title}</h2>
            <p className="mt-2">{t.s4Body1}</p>
            <ul className="mt-2 grid gap-1">
              <li>• {t.s4Supabase}</li>
              <li>• {t.s4Stripe}</li>
            </ul>
            <p className="mt-2">{t.s4More}</p>
            <p className="mt-2">{t.s4Body2}</p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s5Title}</h2>
            <ul className="mt-2 grid gap-1">
              <li>• <span className="font-bold">{t.s5DocLabel}</span>{t.s5DocBody}</li>
              <li>• <span className="font-bold">{t.s5RestLabel}</span> {t.s5RestBody}</li>
              <li>• <span className="font-bold">{t.s5HostLabel}</span>: {t.s5HostBody}</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s6Title}</h2>
            <p className="mt-2">{t.s6Body}</p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s7Title}</h2>
            <p className="mt-2">
              {t.s7Body1} <span className="font-bold">allo@ilestchouette.fr</span>
              {t.s7Body2}
            </p>
            <p className="mt-2">{t.s7Body3}</p>
          </div>

          <div id="cookies">
            <h2 className="font-display italic text-2xl text-ink">{t.s8Title}</h2>
            <p className="mt-2">{t.s8Body}</p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s9Title}</h2>
            <p className="mt-2">{t.s9Body}</p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.cahierTitle}</h2>
            <ul className="mt-2 grid gap-1">
              {t.cahierItems.map((x) => (
                <li key={x}>• {x}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s10Title}</h2>
            <p className="mt-2">{t.s10Body}</p>
            <p className="mt-4 text-sm text-ink/60">{t.lastUpdated}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
