import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";
export type LanguageCode = "en" | "fr" | "pl" | "de";

const THEME_STORAGE_KEY = "mcm_theme";
const LANGUAGE_STORAGE_KEY = "mcm_language";

const translations = {
  en: {
    "nav.home": "Home",
    "nav.buy": "Buy",
    "nav.rent": "Rent",
    "nav.search": "Search",
    "nav.myProperties": "My Properties",
    "nav.favorites": "Favorites",
    "nav.signIn": "Sign In",
    "nav.brand": "MonChezMoi",
    "controls.theme": "Theme",
    "controls.language": "Language",
    "controls.light": "Light",
    "controls.dark": "Dark",
    "language.en": "English",
    "language.fr": "Francais",
    "language.pl": "Polski",
    "language.de": "Deutsch",
    "search.loading": "Loading properties...",
    "search.noProperties": "No properties found matching your filters. Try adjusting your search criteria.",
    "search.previous": "Previous",
    "search.next": "Next",
    "myProperties.loading": "Loading your properties...",
    "myProperties.addTitle": "Add a new property",
    "myProperties.addDescription": "Get the best value for your property with our expert guidance.",
    "myProperties.previous": "Previous",
    "myProperties.next": "Next",
    "filters.title": "Filters",
    "filters.rent": "Rent",
    "filters.sale": "Sale",
    "filters.selectState": "Select a state",
    "filters.price": "Price",
    "filters.type": "Type",
    "filters.orderBy": "Order by",
    "filters.allPrices": "All prices",
    "filters.allTypes": "All types",
    "filters.rentOrSell": "Rent or Sell",
    "filters.allStates": "All states",
    "filters.rentAndSale": "Rent & Sale",
    "filters.newest": "Newest",
    "filters.oldest": "Oldest",
    "filters.priceHighToLow": "Price: High to Low",
    "filters.priceLowToHigh": "Price: Low to High",
    "filters.below75k": "Below 75k",
    "filters.between75And100k": "75k-100k",
    "filters.between100And200k": "100k-200k",
    "filters.between200And500k": "200k-500k",
    "filters.between500kAnd1m": "500k-1M",
    "filters.between1mAnd3m": "1M-3M",
    "filters.above3m": "Above 3M",
    "favorites.loading": "Loading favorites...",
    "favorites.title": "My Favorites",
    "favorites.empty": "You don't have any favorites yet",
    "footer.contactInfo": "Contact Info",
    "footer.usefulLinks": "Useful Links",
    "footer.followMe": "Follow Me",
    "footer.about": "About",
    "footer.services": "Services",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "home.heroLine1": "The easiest way to",
    "home.heroLine2": "find your next address",
    "home.searchPlaceholder": "Enter a state from the USA",
    "home.exploreTitle": "Explore homes on MonChezMoi",
    "home.exploreDescription":
      "Take a deep dive and browse homes for sale or rent, original neighborhood photos, resident reviews and local insights to find what is right for you.",
    "home.viewHomes": "View Homes",
    "home.buyTitle": "Buy",
    "home.buyDescription":
      "Explore a wide range of properties tailored to your needs. From cozy apartments to luxurious villas, your perfect home is just a click away.",
    "home.buyCta": "View Properties",
    "home.rentTitle": "Rent",
    "home.rentDescription":
      "Discover budget-friendly rental options in prime locations. Flexible lease terms to suit your lifestyle.",
    "home.rentCta": "View Properties",
    "home.myPropertiesTitle": "My Properties",
    "home.myPropertiesDescription":
      "Get the best value for your property with our expert guidance. List your properties today and reach thousands of potential buyers and tenants.",
    "home.myPropertiesCta": "View Properties",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.buy": "Acheter",
    "nav.rent": "Louer",
    "nav.search": "Recherche",
    "nav.myProperties": "Mes biens",
    "nav.favorites": "Favoris",
    "nav.signIn": "Se connecter",
    "nav.brand": "MonChezMoi",
    "controls.theme": "Theme",
    "controls.language": "Langue",
    "controls.light": "Clair",
    "controls.dark": "Sombre",
    "language.en": "English",
    "language.fr": "Francais",
    "language.pl": "Polski",
    "language.de": "Deutsch",
    "search.loading": "Chargement des biens...",
    "search.noProperties": "Aucun bien ne correspond a vos filtres. Essayez de modifier vos criteres.",
    "search.previous": "Precedent",
    "search.next": "Suivant",
    "myProperties.loading": "Chargement de vos biens...",
    "myProperties.addTitle": "Ajouter un nouveau bien",
    "myProperties.addDescription": "Obtenez la meilleure valeur pour votre bien grace a notre accompagnement.",
    "myProperties.previous": "Precedent",
    "myProperties.next": "Suivant",
    "filters.title": "Filtres",
    "filters.rent": "Location",
    "filters.sale": "Vente",
    "filters.selectState": "Choisir un Etat",
    "filters.price": "Prix",
    "filters.type": "Type",
    "filters.orderBy": "Trier par",
    "filters.allPrices": "Tous les prix",
    "filters.allTypes": "Tous les types",
    "filters.rentOrSell": "Location ou vente",
    "filters.allStates": "Tous les Etats",
    "filters.rentAndSale": "Location et vente",
    "filters.newest": "Plus recent",
    "filters.oldest": "Plus ancien",
    "filters.priceHighToLow": "Prix : decroissant",
    "filters.priceLowToHigh": "Prix : croissant",
    "filters.below75k": "Moins de 75k",
    "filters.between75And100k": "75k-100k",
    "filters.between100And200k": "100k-200k",
    "filters.between200And500k": "200k-500k",
    "filters.between500kAnd1m": "500k-1M",
    "filters.between1mAnd3m": "1M-3M",
    "filters.above3m": "Plus de 3M",
    "favorites.loading": "Chargement des favoris...",
    "favorites.title": "Mes favoris",
    "favorites.empty": "Vous n'avez pas encore de favoris",
    "footer.contactInfo": "Contact",
    "footer.usefulLinks": "Liens utiles",
    "footer.followMe": "Suivez-moi",
    "footer.about": "A propos",
    "footer.services": "Services",
    "footer.contact": "Contact",
    "footer.rights": "Tous droits reserves.",
    "home.heroLine1": "Le moyen le plus simple de",
    "home.heroLine2": "trouver votre prochaine adresse",
    "home.searchPlaceholder": "Entrez un Etat des USA",
    "home.exploreTitle": "Decouvrez des logements sur MonChezMoi",
    "home.exploreDescription":
      "Parcourez les biens a vendre ou a louer, les photos des quartiers, les avis des residents et les informations locales pour trouver ce qui vous convient.",
    "home.viewHomes": "Voir les logements",
    "home.buyTitle": "Acheter",
    "home.buyDescription":
      "Explorez un large choix de biens adaptes a vos besoins. De l'appartement confortable a la villa de luxe, votre logement ideal est a un clic.",
    "home.buyCta": "Voir les biens",
    "home.rentTitle": "Louer",
    "home.rentDescription":
      "Decouvrez des options de location abordables dans des emplacements de choix, avec des contrats flexibles.",
    "home.rentCta": "Voir les biens",
    "home.myPropertiesTitle": "Mes biens",
    "home.myPropertiesDescription":
      "Obtenez la meilleure valeur pour votre bien avec notre accompagnement. Publiez vos biens et touchez des milliers d'acheteurs et locataires.",
    "home.myPropertiesCta": "Voir les biens",
  },
  pl: {
    "nav.home": "Strona glowna",
    "nav.buy": "Kup",
    "nav.rent": "Wynajem",
    "nav.search": "Szukaj",
    "nav.myProperties": "Moje nieruchomosci",
    "nav.favorites": "Ulubione",
    "nav.signIn": "Zaloguj sie",
    "nav.brand": "MonChezMoi",
    "controls.theme": "Motyw",
    "controls.language": "Jezyk",
    "controls.light": "Jasny",
    "controls.dark": "Ciemny",
    "language.en": "English",
    "language.fr": "Francais",
    "language.pl": "Polski",
    "language.de": "Deutsch",
    "search.loading": "Ladowanie ofert...",
    "search.noProperties": "Brak ofert pasujacych do filtrow. Sprobuj zmienic kryteria.",
    "search.previous": "Poprzednia",
    "search.next": "Nastepna",
    "myProperties.loading": "Ladowanie Twoich ofert...",
    "myProperties.addTitle": "Dodaj nowa nieruchomosc",
    "myProperties.addDescription": "Uzyskaj najlepsza wartosc swojej nieruchomosci dzieki naszemu wsparciu.",
    "myProperties.previous": "Poprzednia",
    "myProperties.next": "Nastepna",
    "filters.title": "Filtry",
    "filters.rent": "Wynajem",
    "filters.sale": "Sprzedaz",
    "filters.selectState": "Wybierz stan",
    "filters.price": "Cena",
    "filters.type": "Typ",
    "filters.orderBy": "Sortuj wedlug",
    "filters.allPrices": "Wszystkie ceny",
    "filters.allTypes": "Wszystkie typy",
    "filters.rentOrSell": "Wynajem lub sprzedaz",
    "filters.allStates": "Wszystkie stany",
    "filters.rentAndSale": "Wynajem i sprzedaz",
    "filters.newest": "Najnowsze",
    "filters.oldest": "Najstarsze",
    "filters.priceHighToLow": "Cena: od najwyzszej",
    "filters.priceLowToHigh": "Cena: od najnizszej",
    "filters.below75k": "Ponizej 75k",
    "filters.between75And100k": "75k-100k",
    "filters.between100And200k": "100k-200k",
    "filters.between200And500k": "200k-500k",
    "filters.between500kAnd1m": "500k-1M",
    "filters.between1mAnd3m": "1M-3M",
    "filters.above3m": "Powyzej 3M",
    "favorites.loading": "Ladowanie ulubionych...",
    "favorites.title": "Moje ulubione",
    "favorites.empty": "Nie masz jeszcze ulubionych ofert",
    "footer.contactInfo": "Kontakt",
    "footer.usefulLinks": "Przydatne linki",
    "footer.followMe": "Obserwuj mnie",
    "footer.about": "O nas",
    "footer.services": "Uslugi",
    "footer.contact": "Kontakt",
    "footer.rights": "Wszelkie prawa zastrzezone.",
    "home.heroLine1": "Najlatwiejszy sposob, aby",
    "home.heroLine2": "znalezc swoj kolejny adres",
    "home.searchPlaceholder": "Wpisz stan w USA",
    "home.exploreTitle": "Odkrywaj domy na MonChezMoi",
    "home.exploreDescription":
      "Przegladaj nieruchomosci na sprzedaz i wynajem, zdjecia okolicy, opinie mieszkancow i lokalne informacje, aby znalezc idealne miejsce.",
    "home.viewHomes": "Zobacz domy",
    "home.buyTitle": "Kup",
    "home.buyDescription":
      "Poznaj szeroki wybor nieruchomosci dopasowanych do Twoich potrzeb. Od przytulnych mieszkan po luksusowe wille.",
    "home.buyCta": "Zobacz oferty",
    "home.rentTitle": "Wynajem",
    "home.rentDescription":
      "Odkryj korzystne cenowo oferty wynajmu w najlepszych lokalizacjach i elastyczne warunki najmu.",
    "home.rentCta": "Zobacz oferty",
    "home.myPropertiesTitle": "Moje nieruchomosci",
    "home.myPropertiesDescription":
      "Uzyskaj najlepsza wartosc swojej nieruchomosci z naszym wsparciem. Dodaj oferte i dotrzyj do tysiecy kupujacych i najemcow.",
    "home.myPropertiesCta": "Zobacz oferty",
  },
  de: {
    "nav.home": "Startseite",
    "nav.buy": "Kaufen",
    "nav.rent": "Mieten",
    "nav.search": "Suche",
    "nav.myProperties": "Meine Immobilien",
    "nav.favorites": "Favoriten",
    "nav.signIn": "Anmelden",
    "nav.brand": "MonChezMoi",
    "controls.theme": "Thema",
    "controls.language": "Sprache",
    "controls.light": "Hell",
    "controls.dark": "Dunkel",
    "language.en": "English",
    "language.fr": "Francais",
    "language.pl": "Polski",
    "language.de": "Deutsch",
    "search.loading": "Immobilien werden geladen...",
    "search.noProperties": "Keine passenden Immobilien gefunden. Bitte Filter anpassen.",
    "search.previous": "Zurueck",
    "search.next": "Weiter",
    "myProperties.loading": "Deine Immobilien werden geladen...",
    "myProperties.addTitle": "Neue Immobilie hinzufuegen",
    "myProperties.addDescription": "Erziele den besten Wert fuer deine Immobilie mit unserer Unterstuetzung.",
    "myProperties.previous": "Zurueck",
    "myProperties.next": "Weiter",
    "filters.title": "Filter",
    "filters.rent": "Mieten",
    "filters.sale": "Kaufen",
    "filters.selectState": "Bundesstaat waehlen",
    "filters.price": "Preis",
    "filters.type": "Typ",
    "filters.orderBy": "Sortieren nach",
    "filters.allPrices": "Alle Preise",
    "filters.allTypes": "Alle Typen",
    "filters.rentOrSell": "Mieten oder kaufen",
    "filters.allStates": "Alle Bundesstaaten",
    "filters.rentAndSale": "Mieten und Kaufen",
    "filters.newest": "Neueste",
    "filters.oldest": "Aelteste",
    "filters.priceHighToLow": "Preis: absteigend",
    "filters.priceLowToHigh": "Preis: aufsteigend",
    "filters.below75k": "Unter 75k",
    "filters.between75And100k": "75k-100k",
    "filters.between100And200k": "100k-200k",
    "filters.between200And500k": "200k-500k",
    "filters.between500kAnd1m": "500k-1M",
    "filters.between1mAnd3m": "1M-3M",
    "filters.above3m": "Ueber 3M",
    "favorites.loading": "Favoriten werden geladen...",
    "favorites.title": "Meine Favoriten",
    "favorites.empty": "Du hast noch keine Favoriten",
    "footer.contactInfo": "Kontakt",
    "footer.usefulLinks": "Nuetzliche Links",
    "footer.followMe": "Folge mir",
    "footer.about": "Ueber uns",
    "footer.services": "Leistungen",
    "footer.contact": "Kontakt",
    "footer.rights": "Alle Rechte vorbehalten.",
    "home.heroLine1": "Der einfachste Weg, um",
    "home.heroLine2": "deine neue Adresse zu finden",
    "home.searchPlaceholder": "Gib einen US-Bundesstaat ein",
    "home.exploreTitle": "Entdecke Immobilien auf MonChezMoi",
    "home.exploreDescription":
      "Durchsuche Kauf- und Mietobjekte, Nachbarschaftsfotos, Bewertungen und lokale Einblicke, um das Richtige fuer dich zu finden.",
    "home.viewHomes": "Objekte ansehen",
    "home.buyTitle": "Kaufen",
    "home.buyDescription":
      "Entdecke eine grosse Auswahl an Immobilien fuer deine Beduerfnisse. Von gemuetlichen Apartments bis zu luxurioesen Villen.",
    "home.buyCta": "Angebote ansehen",
    "home.rentTitle": "Mieten",
    "home.rentDescription":
      "Finde preiswerte Mietangebote in Top-Lagen mit flexiblen Vertragsoptionen.",
    "home.rentCta": "Angebote ansehen",
    "home.myPropertiesTitle": "Meine Immobilien",
    "home.myPropertiesDescription":
      "Erhalte den besten Wert fuer deine Immobilie mit unserer Hilfe. Veroeffentliche deine Angebote und erreiche tausende Interessenten.",
    "home.myPropertiesCta": "Angebote ansehen",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

type UiSettingsContextType = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey) => string;
};

const UiSettingsContext = createContext<UiSettingsContextType | null>(null);

function getInitialTheme(): ThemeMode {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialLanguage(): LanguageCode {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage === "en" || savedLanguage === "fr" || savedLanguage === "pl" || savedLanguage === "de") {
    return savedLanguage;
  }

  return "en";
}

export function UiSettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const value = useMemo<UiSettingsContextType>(() => {
    const dictionary = translations[language];
    return {
      theme,
      setTheme,
      toggleTheme: () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
      },
      language,
      setLanguage,
      t: (key: TranslationKey) => dictionary[key] ?? translations.en[key],
    };
  }, [theme, language]);

  return <UiSettingsContext.Provider value={value}>{children}</UiSettingsContext.Provider>;
}

export function useUiSettings() {
  const context = useContext(UiSettingsContext);
  if (!context) {
    throw new Error("useUiSettings must be used inside UiSettingsProvider");
  }

  return context;
}
