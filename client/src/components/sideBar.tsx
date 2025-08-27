import React, { FC, useState, useRef, useEffect, useContext } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/Context/AppContext";

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
    { name: "Home", link: "/" },
    { name: "Buy", link: "Search/buy" },
    { name: "Rent", link: "Search/rent" },
    { name: "Search", link: "/Search" },
    { name: "My properties", link: user ? "Myproperties" : "/AuthPageMobile" },
    { name: "Favorites", link: user ? "favorites" : "/AuthPageMobile" },
    ...(!user ? [{ name: "Login", link: "/AuthPageMobile" }] : []),
  ];

  return (
    <div className="fixed top-0 left-0 h-screen z-[9999]">
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute left-2 top-4 w-8 h-8 border border-gray-700 rounded-full flex items-center justify-center bg-gray-800"
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
        className={`fixed top-0 left-0 flex flex-col h-full w-[40vw] gap-6 rounded transition-transform duration-300 bg-slate-100 z-[9999]
        ${isOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"}`}
      >
        <p
          onClick={() => {
            setIsOpen(false);
            navigate("/");
          }}
          className="font-bold px-5 py-6 shrink-0 cursor-pointer"
        >
          <span className="text-blue-500 text-2xl">M</span>on chez moi
        </p>

        <ul className="flex-1 overflow-y-auto px-3 pb-6 flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <li
              onClick={() => {
                navigate(item.link);
                setIsOpen(false);
              }}
              key={index}
              className="flex items-center gap-x-4 p-2 text-sm hover:text-blue-500 hover:underline duration-200 cursor-pointer border-b border-gray-300"
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
