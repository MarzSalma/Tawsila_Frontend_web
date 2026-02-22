import { Injectable, signal } from '@angular/core';

export type Lang = 'fr' | 'en' | 'ar';

export const TRANSLATIONS = {
  fr: {
    // Navigation
    monProfil: 'Mon profil',
    modifierInfos: 'Modifier les infos',
    changerMotDePasse: 'Changer le mot de passe',
    parametres: 'Paramètres',
    seDeconnecter: 'Se déconnecter',

    // Profile
    informationsPersonnelles: 'Vos informations personnelles',
    telephone: 'Téléphone',
    adresse: 'Adresse',
    modifierMesInformations: 'Modifier mes informations',
    informationsCoursier: 'Informations coursier',
    vehicule: 'Véhicule',
    immatriculation: 'Immatriculation',
    zoneLivraison: 'Zone de livraison',
    disponibilite: 'Disponibilité',
    disponible: 'Disponible',
    occupe: 'Occupé',

    // Formulaire
    prenom: 'Prénom',
    nom: 'Nom',
    votrePrénom: 'Votre prénom',
    votreNom: 'Votre nom',
    votreAdresse: 'Votre adresse',
    votreEmail: 'votre@email.com',
    choisir: 'Choisir...',
    velo: 'Vélo',
    moto: 'Moto',
    voiture: 'Voiture',
    camionnette: 'Camionnette',
    exZone: 'Ex: Tunis, Ariana',
    enregistrer: 'Enregistrer les modifications',
    enregistrement: 'Enregistrement...',

    // Password
    ancienMotDePasse: 'Ancien mot de passe',
    motDePasseActuel: 'Votre mot de passe actuel',
    nouveauMotDePasse: 'Nouveau mot de passe',
    minimum6: 'Minimum 6 caractères',
    confirmerMotDePasse: 'Confirmer le mot de passe',
    repeterMotDePasse: 'Répéter le mot de passe',
    changerMdp: 'Changer le mot de passe',
    modification: 'Modification...',
    requis: 'Requis',
    min6: 'Minimum 6 caractères',

    // Settings
    langue: 'Langue',
    choisirLangue: "Choisissez votre langue d'affichage",
    apparence: 'Apparence',
    themeAffichage: 'Thème et affichage',
    modeSombre: 'Mode sombre',
    themeSombreActif: 'Thème sombre activé',
    themeClairActif: 'Thème clair activé',
    notifications: 'Notifications',
    gererAlertes: 'Gérez vos alertes',
    notifPush: 'Notifications push',
    notifActivees: 'Notifications activées',
    notifDesactivees: 'Notifications désactivées',
    version: 'Tawsila v1.0.0 — Precision Delivery Platform',

    // Auth
    connexion: 'Connexion',
    bienvenue: 'Bon retour',
    continuer: 'Connectez-vous pour continuer',
    email: 'Email',
    motDePasse: 'Mot de passe',
    seConnecter: 'Se connecter',
    connexionEnCours: 'Connexion...',
    pasDeCompte: "Pas encore de compte ?",
    creerCompte: 'Créer un compte',
    motDePasseOublie: 'Mot de passe oublié ?',
    erreurConnexion: 'Email ou mot de passe incorrect.',

    // Toast
    modifEnregistrees: 'Modifications enregistrées avec succès !',
    retour: 'Retour',

    // Roles
    administrateur: 'Administrateur',
    coursier: 'Coursier',
    client: 'Client',

    // Forgot password
    motDePasseOublieTitle: 'Mot de passe oublié ?',
    entrerEmail: 'Entrez votre adresse email pour recevoir un code de vérification.',
    envoyerCode: 'Envoyer le code',
    envoiEnCours: 'Envoi en cours...',
    vousSouvenez: 'Vous vous souvenez ?',
    retourConnexion: 'Retour connexion',
    entrerCode: 'Entrez le code',
    codeEnvoye: 'Un code à 6 chiffres a été envoyé à',
    codeVerification: 'Code de vérification',
    verifierCode: 'Vérifier le code',
    verification: 'Vérification...',
    pasRecu: 'Pas reçu le code ?',
    renvoyer: 'Renvoyer',
    nouveauMdpTitle: 'Nouveau mot de passe',
    codeVerifie: 'Code vérifié ✅ Choisissez votre nouveau mot de passe.',
    motDePasseModifie: 'Mot de passe modifié !',
    reinitialisationReussie: 'Votre mot de passe a été réinitialisé avec succès.',
    seConnecterMaintenant: 'Se connecter maintenant',
    etape1: 'Étape 1 sur 3',
    etape2: 'Étape 2 sur 3',
    etape3: 'Étape 3 sur 3',
  },

  en: {
    monProfil: 'My profile',
    modifierInfos: 'Edit info',
    changerMotDePasse: 'Change password',
    parametres: 'Settings',
    seDeconnecter: 'Sign out',

    informationsPersonnelles: 'Your personal information',
    telephone: 'Phone',
    adresse: 'Address',
    modifierMesInformations: 'Edit my information',
    informationsCoursier: 'Courier information',
    vehicule: 'Vehicle',
    immatriculation: 'License plate',
    zoneLivraison: 'Delivery zone',
    disponibilite: 'Availability',
    disponible: 'Available',
    occupe: 'Busy',

    prenom: 'First name',
    nom: 'Last name',
    votrePrénom: 'Your first name',
    votreNom: 'Your last name',
    votreAdresse: 'Your address',
    votreEmail: 'your@email.com',
    choisir: 'Choose...',
    velo: 'Bicycle',
    moto: 'Motorcycle',
    voiture: 'Car',
    camionnette: 'Van',
    exZone: 'Ex: Tunis, Ariana',
    enregistrer: 'Save changes',
    enregistrement: 'Saving...',

    ancienMotDePasse: 'Current password',
    motDePasseActuel: 'Your current password',
    nouveauMotDePasse: 'New password',
    minimum6: 'Minimum 6 characters',
    confirmerMotDePasse: 'Confirm password',
    repeterMotDePasse: 'Repeat new password',
    changerMdp: 'Change password',
    modification: 'Updating...',
    requis: 'Required',
    min6: 'Minimum 6 characters',

    langue: 'Language',
    choisirLangue: 'Choose your display language',
    apparence: 'Appearance',
    themeAffichage: 'Theme and display',
    modeSombre: 'Dark mode',
    themeSombreActif: 'Dark theme enabled',
    themeClairActif: 'Light theme enabled',
    notifications: 'Notifications',
    gererAlertes: 'Manage your alerts',
    notifPush: 'Push notifications',
    notifActivees: 'Notifications enabled',
    notifDesactivees: 'Notifications disabled',
    version: 'Tawsila v1.0.0 — Precision Delivery Platform',

    connexion: 'Sign in',
    bienvenue: 'Welcome back',
    continuer: 'Sign in to continue',
    email: 'Email',
    motDePasse: 'Password',
    seConnecter: 'Sign in',
    connexionEnCours: 'Signing in...',
    pasDeCompte: "Don't have an account?",
    creerCompte: 'Create account',
    motDePasseOublie: 'Forgot password?',
    erreurConnexion: 'Incorrect email or password.',

    modifEnregistrees: 'Changes saved successfully!',
    retour: 'Back',

    administrateur: 'Administrator',
    coursier: 'Courier',
    client: 'Client',

    motDePasseOublieTitle: 'Forgot password?',
    entrerEmail: 'Enter your email address to receive a verification code.',
    envoyerCode: 'Send code',
    envoiEnCours: 'Sending...',
    vousSouvenez: 'Remember it?',
    retourConnexion: 'Back to login',
    entrerCode: 'Enter the code',
    codeEnvoye: 'A 6-digit code was sent to',
    codeVerification: 'Verification code',
    verifierCode: 'Verify code',
    verification: 'Verifying...',
    pasRecu: "Didn't receive the code?",
    renvoyer: 'Resend',
    nouveauMdpTitle: 'New password',
    codeVerifie: 'Code verified ✅ Choose your new password.',
    motDePasseModifie: 'Password changed!',
    reinitialisationReussie: 'Your password has been successfully reset.',
    seConnecterMaintenant: 'Sign in now',
    etape1: 'Step 1 of 3',
    etape2: 'Step 2 of 3',
    etape3: 'Step 3 of 3',
  },

  ar: {
    monProfil: 'ملفي الشخصي',
    modifierInfos: 'تعديل المعلومات',
    changerMotDePasse: 'تغيير كلمة المرور',
    parametres: 'الإعدادات',
    seDeconnecter: 'تسجيل الخروج',

    informationsPersonnelles: 'معلوماتك الشخصية',
    telephone: 'الهاتف',
    adresse: 'العنوان',
    modifierMesInformations: 'تعديل معلوماتي',
    informationsCoursier: 'معلومات المراسل',
    vehicule: 'المركبة',
    immatriculation: 'لوحة الترخيص',
    zoneLivraison: 'منطقة التوصيل',
    disponibilite: 'التوفر',
    disponible: 'متاح',
    occupe: 'مشغول',

    prenom: 'الاسم الأول',
    nom: 'اللقب',
    votrePrénom: 'اسمك الأول',
    votreNom: 'لقبك',
    votreAdresse: 'عنوانك',
    votreEmail: 'بريدك@الإلكتروني.com',
    choisir: 'اختر...',
    velo: 'دراجة هوائية',
    moto: 'دراجة نارية',
    voiture: 'سيارة',
    camionnette: 'شاحنة صغيرة',
    exZone: 'مثال: تونس، أريانة',
    enregistrer: 'حفظ التغييرات',
    enregistrement: 'جاري الحفظ...',

    ancienMotDePasse: 'كلمة المرور الحالية',
    motDePasseActuel: 'كلمة مرورك الحالية',
    nouveauMotDePasse: 'كلمة المرور الجديدة',
    minimum6: '6 أحرف على الأقل',
    confirmerMotDePasse: 'تأكيد كلمة المرور',
    repeterMotDePasse: 'أعد كلمة المرور الجديدة',
    changerMdp: 'تغيير كلمة المرور',
    modification: 'جاري التحديث...',
    requis: 'مطلوب',
    min6: '6 أحرف على الأقل',

    langue: 'اللغة',
    choisirLangue: 'اختر لغة العرض',
    apparence: 'المظهر',
    themeAffichage: 'الثيم والعرض',
    modeSombre: 'الوضع الداكن',
    themeSombreActif: 'تم تفعيل الثيم الداكن',
    themeClairActif: 'تم تفعيل الثيم الفاتح',
    notifications: 'الإشعارات',
    gererAlertes: 'إدارة التنبيهات',
    notifPush: 'إشعارات الدفع',
    notifActivees: 'الإشعارات مفعّلة',
    notifDesactivees: 'الإشعارات معطّلة',
    version: 'Tawsila v1.0.0 — منصة التوصيل الدقيق',

    connexion: 'تسجيل الدخول',
    bienvenue: 'مرحباً بعودتك',
    continuer: 'سجّل دخولك للمتابعة',
    email: 'البريد الإلكتروني',
    motDePasse: 'كلمة المرور',
    seConnecter: 'تسجيل الدخول',
    connexionEnCours: 'جاري الدخول...',
    pasDeCompte: 'ليس لديك حساب؟',
    creerCompte: 'إنشاء حساب',
    motDePasseOublie: 'نسيت كلمة المرور؟',
    erreurConnexion: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',

    modifEnregistrees: 'تم حفظ التغييرات بنجاح!',
    retour: 'رجوع',

    administrateur: 'مدير',
    coursier: 'مراسل',
    client: 'عميل',

    motDePasseOublieTitle: 'نسيت كلمة المرور؟',
    entrerEmail: 'أدخل بريدك الإلكتروني لتلقي رمز التحقق.',
    envoyerCode: 'إرسال الرمز',
    envoiEnCours: 'جاري الإرسال...',
    vousSouvenez: 'تذكرتها؟',
    retourConnexion: 'العودة للدخول',
    entrerCode: 'أدخل الرمز',
    codeEnvoye: 'تم إرسال رمز مكون من 6 أرقام إلى',
    codeVerification: 'رمز التحقق',
    verifierCode: 'التحقق من الرمز',
    verification: 'جاري التحقق...',
    pasRecu: 'لم تستلم الرمز؟',
    renvoyer: 'إعادة الإرسال',
    nouveauMdpTitle: 'كلمة مرور جديدة',
    codeVerifie: '✅ تم التحقق — اختر كلمة مرورك الجديدة.',
    motDePasseModifie: 'تم تغيير كلمة المرور!',
    reinitialisationReussie: 'تمت إعادة تعيين كلمة مرورك بنجاح.',
    seConnecterMaintenant: 'تسجيل الدخول الآن',
    etape1: 'الخطوة 1 من 3',
    etape2: 'الخطوة 2 من 3',
    etape3: 'الخطوة 3 من 3',
  }
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  currentLang = signal<Lang>(
    (localStorage.getItem('lang') as Lang) || 'fr'
  );

  t(key: keyof typeof TRANSLATIONS['fr']): string {
    const lang = this.currentLang();
    return TRANSLATIONS[lang][key] || TRANSLATIONS['fr'][key] || key;
  }

  setLang(lang: Lang) {
    this.currentLang.set(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }

  isDark(): boolean {
    return localStorage.getItem('darkMode') === 'true';
  }

  setDark(value: boolean) {
    localStorage.setItem('darkMode', String(value));
    if (value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  applyStoredSettings() {
    const lang = (localStorage.getItem('lang') as Lang) || 'fr';
    this.setLang(lang);
    this.setDark(this.isDark());
  }
}