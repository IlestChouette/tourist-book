import Hero from "@/components/Hero";
import { getLocale } from "@/lib/i18n/locale";

const content = {
  fr: {
    metaTitle: "Politique de confidentialité — Tourist Book",
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
      "(check-in électronique) : nom (indiqué par l'hôtelier lors de la création de la réservation), téléphone, email, nationalité, numéro de pièce d'identité ou passeport, une photo de ce document et une photo type selfie pour vérification, ainsi que les dates du séjour.",
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
    s4Body2:
      "Ces prestataires peuvent héberger des données hors de l'Espace économique européen ; le cas échéant, le transfert repose sur les Clauses Contractuelles Types de la Commission européenne ou un autre mécanisme de transfert reconnu par le RGPD.",
    s5Title: "5. Durée de conservation",
    s5DocLabel: "Pièce d'identité et selfie de l'hôte",
    s5DocBody:
      ": stockés dans un espace privé non accessible publiquement, conservés uniquement pendant le séjour et le délai exigé par la réglementation locale d'enregistrement des voyageurs applicable au logement ; passé ce délai, ils sont supprimés définitivement.",
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
      "Nous utilisons uniquement des cookies techniques, strictement nécessaires au fonctionnement du service : maintenir la session de l'hôtelier connectée, mémoriser l'accès d'un hôte à son livret pendant le séjour, et retenir la langue choisie. Nous n'utilisons aucun cookie publicitaire ni de suivi tiers, ils ne nécessitent donc pas votre consentement préalable au regard de la réglementation sur les cookies (ePrivacy).",
    s9Title: "9. Mineurs",
    s9Body:
      "La plateforme ne s'adresse pas aux mineurs. La création d'un compte hôtelier requiert d'être majeur et d'avoir la capacité juridique de contracter.",
    s10Title: "10. Modifications",
    s10Body:
      "Nous pouvons mettre à jour cette politique pour refléter des changements légaux ou du service. La date de dernière mise à jour est indiquée en bas de cette page ; nous vous recommandons de la consulter régulièrement.",
    lastUpdated: "Dernière mise à jour : 1er septembre 2026.",
  },
  en: {
    metaTitle: "Privacy policy — Tourist Book",
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
      "(electronic check-in): name (entered by the host when creating the booking), phone, email, nationality, ID document or passport number, a photo of that document and a selfie-type photo for verification, and the stay dates.",
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
    s4Body2:
      "These providers may host data outside the European Economic Area; in that case, the transfer relies on the European Commission's Standard Contractual Clauses or another transfer mechanism recognized by the GDPR.",
    s5Title: "5. Retention period",
    s5DocLabel: "Guest's ID document and selfie",
    s5DocBody:
      ": stored in a private space not publicly accessible, kept only for the duration of the stay and the period required by the local traveler-registration regulation applicable to the property; after that period they are permanently deleted.",
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
      "We only use technical cookies, strictly necessary for the service to work: keeping the host's session logged in, remembering a guest's access to their welcome book during their stay, and remembering the chosen language. We do not use any advertising or third-party tracking cookies, so they do not require your prior consent under cookie regulation (ePrivacy).",
    s9Title: "9. Minors",
    s9Body:
      "The platform is not aimed at minors. Creating a host account requires being of legal age and having the legal capacity to contract.",
    s10Title: "10. Changes",
    s10Body:
      "We may update this policy to reflect legal or service changes. The last-updated date is shown at the bottom of this page; we recommend checking it periodically.",
    lastUpdated: "Last updated: September 1, 2026.",
  },
  es: {
    metaTitle: "Política de privacidad — Tourist Book",
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
      "(check-in electrónico): nombre (indicado por el hotelero al crear la reserva), teléfono, email, nacionalidad, número de documento de identidad o pasaporte, una fotografía de dicho documento y una fotografía tipo selfie para verificación, y las fechas de estancia.",
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
    s4Body2:
      "Estos proveedores pueden alojar datos fuera del Espacio Económico Europeo; en ese caso, la transferencia se realiza sobre la base de las Cláusulas Contractuales Tipo de la Comisión Europea u otro mecanismo de transferencia reconocido por el RGPD.",
    s5Title: "5. Plazo de conservación",
    s5DocLabel: "Documento de identidad y selfie del huésped",
    s5DocBody:
      ": se almacenan en un espacio privado no accesible públicamente y se conservan únicamente durante la estancia y el plazo que exija la normativa local de registro de viajeros aplicable al alojamiento; transcurrido ese plazo se eliminan de forma definitiva.",
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
      "Usamos únicamente cookies técnicas, estrictamente necesarias para el funcionamiento del servicio: mantener la sesión del hotelero iniciada, recordar el acceso de un huésped a su livret durante la estancia, y recordar el idioma elegido. No usamos cookies de publicidad ni de seguimiento de terceros, por lo que no requieren tu consentimiento previo conforme a la normativa de cookies (ePrivacy).",
    s9Title: "9. Menores de edad",
    s9Body:
      "La plataforma no está dirigida a menores de edad. La creación de una cuenta de hotelero requiere ser mayor de edad y tener capacidad legal para contratar.",
    s10Title: "10. Modificaciones",
    s10Body:
      "Podemos actualizar esta política para reflejar cambios legales o del servicio. La fecha de la última actualización se indica al pie de esta página; te recomendamos consultarla periódicamente.",
    lastUpdated: "Última actualización: 1 de septiembre de 2026.",
  },
};

export async function generateMetadata() {
  const locale = await getLocale();
  return { title: content[locale].metaTitle };
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
            <h2 className="font-display italic text-2xl text-ink">{t.s10Title}</h2>
            <p className="mt-2">{t.s10Body}</p>
            <p className="mt-4 text-sm text-ink/60">{t.lastUpdated}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
