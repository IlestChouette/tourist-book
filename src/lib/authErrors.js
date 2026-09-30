// Messages d'erreur d'authentification lisibles par un hôtelier, par code
// d'erreur Supabase — sans jamais afficher le texte technique anglais de
// Supabase ni de notes de développement.
const messages = {
  fr: {
    user_already_exists: "Un compte existe déjà avec cet email. Connectez-vous plutôt.",
    weak_password: "Mot de passe trop faible ou trop courant : choisissez-en un plus long et moins évident.",
    email_address_invalid: "Cette adresse email n'est pas valide.",
    validation_failed: "Vérifiez les informations saisies (email et mot de passe).",
    email_not_confirmed:
      "Votre email n'est pas encore confirmé. Ouvrez le lien que nous vous avons envoyé (pensez à vérifier vos spams).",
    invalid_credentials: "Email ou mot de passe incorrect.",
    over_email_send_rate_limit: "Trop d'emails envoyés pour le moment. Réessayez dans une minute.",
    over_request_rate_limit: "Trop de tentatives. Réessayez dans une minute.",
    fallback: "Une erreur est survenue. Réessayez dans un instant, ou écrivez-nous si le problème continue.",
  },
  en: {
    user_already_exists: "An account already exists with this email. Log in instead.",
    weak_password: "Password too weak or too common: choose a longer, less obvious one.",
    email_address_invalid: "This email address isn't valid.",
    validation_failed: "Check the details you entered (email and password).",
    email_not_confirmed:
      "Your email isn't confirmed yet. Open the link we sent you (check your spam folder too).",
    invalid_credentials: "Incorrect email or password.",
    over_email_send_rate_limit: "Too many emails sent right now. Try again in a minute.",
    over_request_rate_limit: "Too many attempts. Try again in a minute.",
    fallback: "Something went wrong. Try again in a moment, or write to us if it keeps happening.",
  },
  es: {
    user_already_exists: "Ya existe una cuenta con este email. Inicia sesión.",
    weak_password: "Contraseña demasiado débil o demasiado común: elige una más larga y menos obvia.",
    email_address_invalid: "Este email no es válido.",
    validation_failed: "Revisa los datos introducidos (email y contraseña).",
    email_not_confirmed:
      "Tu email todavía no está confirmado. Abre el enlace que te enviamos (revisa también el spam).",
    invalid_credentials: "Email o contraseña incorrectos.",
    over_email_send_rate_limit: "Demasiados emails enviados ahora mismo. Inténtalo de nuevo en un minuto.",
    over_request_rate_limit: "Demasiados intentos. Inténtalo de nuevo en un minuto.",
    fallback: "Ocurrió un error. Inténtalo de nuevo en un momento, o escríbenos si sigue pasando.",
  },
};

export function authErrorMessage(error, locale = "fr") {
  const m = messages[locale] ?? messages.fr;
  return m[error?.code] ?? m.fallback;
}
