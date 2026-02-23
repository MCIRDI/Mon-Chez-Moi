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
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              to="Search/buy"
              className="text-sm font-medium transition-colors hover:text-blue-500 lg:text-base"
            >
              {t("nav.buy")}
            </Link>
            <Link
              to="Search/rent"
              className="text-sm font-medium transition-colors hover:text-blue-500 lg:text-base"
            >
              {t("nav.rent")}
            </Link>
            <Link
              to="/Search"
              className="text-sm font-medium transition-colors hover:text-blue-500 lg:text-base"
            >
              {t("nav.search")}
            </Link>
          </div>
          <Link to="/" className="text-sm font-bold text-blue-500 lg:text-base">
            {t("nav.brand")}
          </Link>
          <div className="flex items-center gap-5">
            <Link
              to={user ? "Myproperties" : "#"}
              className="text-sm font-medium transition-colors hover:text-blue-500 lg:text-base"
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
              className="text-sm font-medium transition-colors hover:text-blue-500 lg:text-base"
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
                className="text-sm font-medium transition-colors hover:text-blue-500 lg:text-base"
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
