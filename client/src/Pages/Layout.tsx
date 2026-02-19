import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";
import { useEffect, useState, useRef, useContext } from "react";
import AuthenticationForms from "./Auth/AuthenticationForms";
import { AppContext } from "@/Context/AppContext";
import Sidebar from "@/ui/sideBar";
export default function Layout() {
  const [authForms, setAuthForms] = useState(false);
  const authFormsRef = useRef<HTMLDivElement>(null);
  const appContext = useContext(AppContext);
  const user = appContext?.user;
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
    <div className="relative">
      <header className="absolute py-5  md:hidden ">
        <Sidebar />
      </header>
      <header className="py-5 px-2 border-b-[1px] border-gray-300 hidden md:block">
        <nav className="flex flex-row justify-evenly">
          <div className="w-2/5 flex flex-row justify-center  ">
            <Link
              to="Search/buy"
              className="text-sm lg:text-base hover:text-blue-500 mr-7"
            >
              Buy
            </Link>
            <Link
              to="Search/rent"
              className="text-sm lg:text-base hover:text-blue-500 mr-7"
            >
              Rent
            </Link>
            <Link
              to="/Search"
              className="text-sm lg:text-base hover:text-blue-500 mr-7"
            >
              Search
            </Link>
          </div>
          <Link to="/" className="text-sm lg:text-base text-blue-500 font-bold">
            MonChezMoi
          </Link>
          <div className="w-2/5 flex flex-row  justify-center">
            <Link
              to={
                user
                  ? "Myproperties"
                  : window.innerWidth < 768
                    ? "/AuthPageMobile"
                    : "#"
              }
              className="text-sm lg:text-base hover:text-blue-500 mr-7"
              onClick={(e) => {
                if (!user && !(window.innerWidth < 768)) {
                  e.preventDefault();
                  setAuthForms(true);
                }
              }}
            >
              My properities
            </Link>
            <Link
              to={
                user
                  ? "favorites"
                  : window.innerWidth < 768
                    ? "/AuthPageMobile"
                    : "#"
              }
              className="text-sm lg:text-base hover:text-blue-500 mr-7"
              onClick={(e) => {
                if (!user && !(window.innerWidth < 768)) {
                  e.preventDefault();
                  setAuthForms(true);
                }
              }}
            >
              Favorites
            </Link>
            {/* <Link
              to="/favorites"
              className="text-sm lg:text-base hover:text-blue-500 mr-7"
            >
              Favorites
            </Link> */}
            {!user && (
              <button
                onClick={() => {
                  setAuthForms(true);
                }}
                className="text-sm lg:text-base hover:text-blue-500"
              >
                Sign IN
              </button>
            )}
          </div>
        </nav>
      </header>
      <main>
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
