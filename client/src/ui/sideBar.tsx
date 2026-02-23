import { FC, useState, useRef, useEffect, useContext } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/Context/AppContext";
import UiControls from "@/ui/UiControls";
import { useUiSettings } from "@/Context/UiSettingsContext";

interface MenuItem {
  name: string;
  link: string;
}

const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const appContext = useContext(AppContext);
  const { t } = useUiSettings();

  const user = appContext?.user;

  // Close sidebar if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const menuItems: MenuItem[] = [
    { name: t("nav.home"), link: "/" },
    { name: t("nav.buy"), link: "Search/buy" },
    { name: t("nav.rent"), link: "Search/rent" },
    { name: t("nav.search"), link: "/Search" },
    { name: t("nav.myProperties"), link: user ? "Myproperties" : "/AuthPageMobile" },
    { name: t("nav.favorites"), link: user ? "favorites" : "/AuthPageMobile" },
    ...(!user ? [{ name: t("nav.signIn"), link: "/AuthPageMobile" }] : []),
  ];

  return (
    <div className="fixed top-0 left-0 h-screen z-[9999]">
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute left-2 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900"
        >
          <Menu className="text-white" size={30} />
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-[9998]"
        ></div>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-[9999] flex h-full w-[70vw] max-w-[300px] flex-col gap-4 rounded-r-xl bg-slate-100 transition-transform duration-300 dark:bg-slate-900
        ${isOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"}`}
      >
        <p
          onClick={() => {
            setIsOpen(false);
            navigate("/");
          }}
          className="shrink-0 cursor-pointer px-5 py-6 font-bold"
        >
          <span className="text-2xl text-blue-500">M</span>on chez moi
        </p>
        <div className="px-4">
          <UiControls compact />
        </div>

        <ul className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-6">
          {menuItems.map((item, index) => (
            <li
              onClick={() => {
                navigate(item.link);
                setIsOpen(false);
              }}
              key={index}
              className="cursor-pointer border-b border-slate-300 p-2 text-sm text-slate-700 duration-200 hover:text-blue-500 hover:underline dark:border-slate-700 dark:text-slate-200"
            >
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
