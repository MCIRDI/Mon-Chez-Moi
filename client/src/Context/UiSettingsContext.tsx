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
    "language.fr": "Français",
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
    "controls.theme": "Thème",
    "controls.language": "Langue",
    "controls.light": "Clair",
    "controls.dark": "Sombre",
    "language.en": "English",
    "language.fr": "Français",
    "language.pl": "Polski",
    "language.de": "Deutsch",
    "search.loading": "Chargement des biens...",
    "search.noProperties": "Aucun bien ne correspond à vos filtres. Essayez de modifier vos critères.",
    "search.previous": "Précédent",
    "search.next": "Suivant",
    "myProperties.loading": "Chargement de vos biens...",
    "myProperties.addTitle": "Ajouter un nouveau bien",
    "myProperties.addDescription": "Obtenez la meilleure valeur pour votre bien grâce à notre accompagnement.",
    "myProperties.previous": "Précédent",
    "myProperties.next": "Suivant",
    "filters.title": "Filtres",
    "filters.rent": "Location",
    "filters.sale": "Vente",
    "filters.selectState": "Choisir un État",
    "filters.price": "Prix",
    "filters.type": "Type",
    "filters.orderBy": "Trier par",
    "filters.allPrices": "Tous les prix",
    "filters.allTypes": "Tous les types",
    "filters.rentOrSell": "Location ou vente",
    "filters.allStates": "Tous les États",
    "filters.rentAndSale": "Location & Vente",
    "filters.newest": "Plus récent",
    "filters.oldest": "Plus ancien",
    "filters.priceHighToLow": "Prix : décroissant",
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
    "footer.about": "À propos",
    "footer.services": "Services",
    "footer.contact": "Contact",
    "footer.rights": "Tous droits réservés.",
  },
  pl: {
    "nav.home": "Strona główna",
    "nav.buy": "Kup",
    "nav.rent": "Wynajem",
    "nav.search": "Szukaj",
    "nav.myProperties": "Moje nieruchomości",
    "nav.favorites": "Ulubione",
    "nav.signIn": "Zaloguj się",
    "nav.brand": "MonChezMoi",
    "controls.theme": "Motyw",
    "controls.language": "Język",
    "controls.light": "Jasny",
    "controls.dark": "Ciemny",
    "language.en": "English",
    "language.fr": "Français",
    "language.pl": "Polski",
    "language.de": "Deutsch",
    "search.loading": "Ładowanie ofert...",
    "search.noProperties": "Brak ofert pasujących do filtrów. Spróbuj zmienić kryteria.",
    "search.previous": "Poprzednia",
    "search.next": "Następna",
    "myProperties.loading": "Ładowanie Twoich ofert...",
    "myProperties.addTitle": "Dodaj nową nieruchomość",
    "myProperties.addDescription": "Uzyskaj najlepszą wartość swojej nieruchomości dzięki naszemu wsparciu.",
    "myProperties.previous": "Poprzednia",
    "myProperties.next": "Następna",
    "filters.title": "Filtry",
    "filters.rent": "Wynajem",
    "filters.sale": "Sprzedaż",
    "filters.selectState": "Wybierz stan",
    "filters.price": "Cena",
    "filters.type": "Typ",
    "filters.orderBy": "Sortuj według",
    "filters.allPrices": "Wszystkie ceny",
    "filters.allTypes": "Wszystkie typy",
    "filters.rentOrSell": "Wynajem lub sprzedaż",
    "filters.allStates": "Wszystkie stany",
    "filters.rentAndSale": "Wynajem i sprzedaż",
    "filters.newest": "Najnowsze",
    "filters.oldest": "Najstarsze",
    "filters.priceHighToLow": "Cena: od najwyższej",
    "filters.priceLowToHigh": "Cena: od najniższej",
    "filters.below75k": "Poniżej 75k",
    "filters.between75And100k": "75k-100k",
    "filters.between100And200k": "100k-200k",
    "filters.between200And500k": "200k-500k",
    "filters.between500kAnd1m": "500k-1M",
    "filters.between1mAnd3m": "1M-3M",
    "filters.above3m": "Powyżej 3M",
    "favorites.loading": "Ładowanie ulubionych...",
    "favorites.title": "Moje ulubione",
    "favorites.empty": "Nie masz jeszcze ulubionych ofert",
    "footer.contactInfo": "Kontakt",
    "footer.usefulLinks": "Przydatne linki",
    "footer.followMe": "Obserwuj mnie",
    "footer.about": "O nas",
    "footer.services": "Usługi",
    "footer.contact": "Kontakt",
    "footer.rights": "Wszelkie prawa zastrzeżone.",
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
    "language.fr": "Français",
    "language.pl": "Polski",
    "language.de": "Deutsch",
    "search.loading": "Immobilien werden geladen...",
    "search.noProperties": "Keine passenden Immobilien gefunden. Bitte Filter anpassen.",
    "search.previous": "Zurück",
    "search.next": "Weiter",
    "myProperties.loading": "Deine Immobilien werden geladen...",
    "myProperties.addTitle": "Neue Immobilie hinzufügen",
    "myProperties.addDescription": "Erziele den besten Wert für deine Immobilie mit unserer Unterstützung.",
    "myProperties.previous": "Zurück",
    "myProperties.next": "Weiter",
    "filters.title": "Filter",
    "filters.rent": "Mieten",
    "filters.sale": "Kaufen",
    "filters.selectState": "Bundesstaat wählen",
    "filters.price": "Preis",
    "filters.type": "Typ",
    "filters.orderBy": "Sortieren nach",
    "filters.allPrices": "Alle Preise",
    "filters.allTypes": "Alle Typen",
    "filters.rentOrSell": "Mieten oder kaufen",
    "filters.allStates": "Alle Bundesstaaten",
    "filters.rentAndSale": "Mieten & Kaufen",
    "filters.newest": "Neueste",
    "filters.oldest": "Älteste",
    "filters.priceHighToLow": "Preis: absteigend",
    "filters.priceLowToHigh": "Preis: aufsteigend",
    "filters.below75k": "Unter 75k",
    "filters.between75And100k": "75k-100k",
    "filters.between100And200k": "100k-200k",
    "filters.between200And500k": "200k-500k",
    "filters.between500kAnd1m": "500k-1M",
    "filters.between1mAnd3m": "1M-3M",
    "filters.above3m": "Über 3M",
    "favorites.loading": "Favoriten werden geladen...",
    "favorites.title": "Meine Favoriten",
    "favorites.empty": "Du hast noch keine Favoriten",
    "footer.contactInfo": "Kontakt",
    "footer.usefulLinks": "Nützliche Links",
    "footer.followMe": "Folge mir",
    "footer.about": "Über uns",
    "footer.services": "Leistungen",
    "footer.contact": "Kontakt",
    "footer.rights": "Alle Rechte vorbehalten.",
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

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
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
