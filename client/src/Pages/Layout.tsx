import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";
import { useEffect, useState, useRef, useContext } from "react";
import AuthenticationForms from "./Auth/AuthenticationForms";
import { AppContext } from "@/Context/AppContext";
import Sidebar from "@/ui/sideBar";
import UiControls from "@/ui/UiControls";
import { useUiSettings } from "@/Context/UiSettingsContext";
export default function Layout() {
  const [authForms, setAuthForms] = useState(false);
  const authFormsRef = useRef<HTMLDivElement>(null);
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const { t } = useUiSettings();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        authFormsRef.current &&
        !authFormsRef.current.contains(event.target as Node)
      ) {
        setAuthForms(false);
      }
    };

    if (authForms) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [authForms]);

  useEffect(() => {
    if (authForms) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Nettoyage au démontage
    };
  }, [authForms]);

  // Listen for custom event to open auth forms
  useEffect(() => {
    const handleOpenAuthForms = () => {
      setAuthForms(true);
    };

    window.addEventListener('openAuthForms', handleOpenAuthForms);

    return () => {
      window.removeEventListener('openAuthForms', handleOpenAuthForms);
    };
  }, []);
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="absolute py-5  md:hidden ">
        <Sidebar />
      </header>
      <header className="hidden border-b border-slate-300 bg-white/90 px-4 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 md:block">
        <nav className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center gap-2 justify-self-start">
            <Link
              to="Search/buy"
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 lg:text-base"
            >
              {t("nav.buy")}
            </Link>
            <Link
              to="Search/rent"
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 lg:text-base"
            >
              {t("nav.rent")}
            </Link>
            <Link
              to="/Search"
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 lg:text-base"
            >
              {t("nav.search")}
            </Link>
          </div>

          <Link
            to="/"
            className="justify-self-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-extrabold tracking-wide text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60 lg:text-base"
          >
            {t("nav.brand")}
          </Link>

          <div className="flex items-center gap-2 justify-self-end">
            <Link
              to={user ? "Myproperties" : "#"}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 lg:text-base"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  setAuthForms(true);
                }
              }}
            >
              {t("nav.myProperties")}
            </Link>
            <Link
              to={user ? "favorites" : "#"}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 lg:text-base"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  setAuthForms(true);
                }
              }}
            >
              {t("nav.favorites")}
            </Link>
            {!user && (
              <button
                onClick={() => {
                  setAuthForms(true);
                }}
                className="rounded-full border border-blue-500 bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 lg:text-base"
              >
                {t("nav.signIn")}
              </button>
            )}
            <UiControls />
          </div>
        </nav>
      </header>
      <main className="flex-1">
        {authForms && (
          <div className="bg-black h-screen w-screen fixed top-0 left-0 z-50 bg-opacity-50">
            <div ref={authFormsRef}>
              <AuthenticationForms closeAuthForms={() => setAuthForms(false)} />
            </div>
          </div>
        )}
        <Outlet context={setAuthForms}></Outlet>
      </main>

      <Footer />
    </div>
  );
}
