import { Globe, Moon, Sun } from "lucide-react";
import { LanguageCode, useUiSettings } from "@/Context/UiSettingsContext";

const languageOptions: LanguageCode[] = ["en", "fr", "pl", "de"];

export default function UiControls({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, theme, toggleTheme, t } = useUiSettings();

  return (
    <div
      className={`flex ${compact ? "flex-col items-stretch gap-2" : "items-center gap-2"}`}
    >
      <div className="relative">
        <Globe
          size={14}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300"
        />
        <select
          aria-label={t("controls.language")}
          value={language}
          onChange={(event) => setLanguage(event.target.value as LanguageCode)}
          className="h-8 rounded-full border border-slate-300 bg-white pl-7 pr-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        >
          {languageOptions.map((option) => (
            <option key={option} value={option}>
              {t(`language.${option}` as const)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={t("controls.theme")}
        title={t("controls.theme")}
        className="inline-flex h-8 items-center gap-1 rounded-full border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
      >
        {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
        <span>{theme === "dark" ? t("controls.dark") : t("controls.light")}</span>
      </button>
    </div>
  );
}
