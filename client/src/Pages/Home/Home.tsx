import { useNavigate } from "react-router-dom";
import "./Home.css";
import AutocompleteSearch from "@/ui/AutocompleteSearch";
import { useUiSettings } from "@/Context/UiSettingsContext";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useUiSettings();

  function handleSearch(query: string) {
    if (query.trim()) {
      navigate("/Search/" + encodeURIComponent(query));
    }
  }
  return (
    <>
      <section>
        <div className=" bg-[url('/images/MonChezMoi01.jpg')] bg-cover h-[70vh] w-screen flex flex-col justify-center gap-5 pl-10 pb-2 relavive">
          <div className=" md:hidden top-4 relative flex-1">
            <h1 className="text-white text-center font-bold text-2xl cursor-pointer absolute left-1/2 -translate-x-1/2">
              Mon Chez Moi
            </h1>
          </div>

          <p className="text-white font-bold text-4xl drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] ">
            {t("home.heroLine1")}
          </p>
          <p className="text-white font-bold text-4xl drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
            {t("home.heroLine2")}
          </p>
          <AutocompleteSearch 
            onSearch={handleSearch}
            placeholder={t("home.searchPlaceholder")}
            className="w-[80vw] md:w-[600px]"
          />
        </div>
      </section>
      <section className="px-4 md:px-24 pt-16 flex flex-col items-center">
        <p className="font-bold text-3xl text-center text-slate-800 dark:text-slate-100">
          {t("home.exploreTitle")}
        </p>
        <p className="py-6 text-center text-slate-700 dark:text-slate-300">
          {t("home.exploreDescription")}
        </p>
      </section>
      <section className="flex flex-row overflow-x-auto  scrollbar-hide ">
        <div
          onClick={() => {
            navigate("Search/Washington");
          }}
          className="state-card ml-[2vh] h-[50vh]   min-h-[310px] bg-[url('/images/image05.jpg')] bg-cover"
        >
          <p>Washington</p>
          <a>
            {t("home.viewHomes")} <span className="text-xl">&gt;</span>
          </a>
        </div>
        <div
          onClick={() => {
            navigate("Search/Boston");
          }}
          className="ml-[2vh]"
        >
          <div className="state-card mb-[2vh] h-[24vh]  min-h-[150px] bg-[url('/images/image01.jpg')] bg-cover">
            <p>Boston</p>
            <a>
              {t("home.viewHomes")} <span className="text-xl">&gt;</span>
            </a>
          </div>
          <div
            onClick={() => {
              navigate("Search/Alabama");
            }}
            className="state-card h-[24vh]  min-h-[150px] bg-[url('/images/image02.jpg')] bg-cover"
          >
            <p>Alabama</p>
            <a>
              {t("home.viewHomes")} <span className="text-xl">&gt;</span>
            </a>
          </div>
        </div>
        <div
          onClick={() => {
            navigate("Search/New York");
          }}
          className="ml-[2vh]"
        >
          <div className="state-card mb-[2vh] h-[24vh]  min-h-[150px] bg-[url('/images/image04.jpg')] bg-cover">
            <p>New York</p>
            <a>
              {t("home.viewHomes")} <span className="text-xl">&gt;</span>
            </a>
          </div>
          <div
            onClick={() => {
              navigate("Search/Florida");
            }}
            className="state-card h-[24vh]  min-h-[150px] bg-[url('/images/image03.jpg')] bg-cover"
          >
            <p>Florida </p>
            <a>
              {t("home.viewHomes")} <span className="text-xl">&gt;</span>
            </a>
          </div>
        </div>
        <div
          onClick={() => {
            navigate("Search/California");
          }}
          className="state-card ml-[2vh] h-[50vh]   min-h-[310px] bg-[url('/images/image03.jpg')] bg-cover"
        >
          <p>California</p>
          <a>
            {t("home.viewHomes")} <span className="text-xl">&gt;</span>
          </a>
        </div>
        <div className="ml-[2vh]">
          <div
            onClick={() => {
              navigate("Search/Texas");
            }}
            className="state-card mb-[2vh] h-[24vh]  min-h-[150px]"
          >
            <p>Texas </p>
            <a>
              {t("home.viewHomes")} <span className="text-xl">&gt;</span>
            </a>
          </div>
          <div
            onClick={() => {
              navigate("Search/Nevada");
            }}
            className="state-card h-[24vh]  min-h-[150px]"
          >
            <p>Nevada </p>
            <a>
              {t("home.viewHomes")} <span className="text-xl">&gt;</span>
            </a>
          </div>
        </div>
        <div className="ml-[2vh]">
          <div
            onClick={() => {
              navigate("Search/Illinois");
            }}
            className="state-card mb-[2vh] h-[24vh]  min-h-[150px]"
          >
            <p>Illinois</p>
            <a>
              {t("home.viewHomes")} <span className="text-xl">&gt;</span>
            </a>
          </div>
          <div
            onClick={() => {
              navigate("Search/Massachusetts");
            }}
            className="state-card h-[24vh]  min-h-[150px]"
          >
            <p>Massachusetts </p>
            <a>
              {t("home.viewHomes")} <span className="text-xl">&gt;</span>
            </a>
          </div>
        </div>
        <div
          onClick={() => {
            navigate("Search/Oklahoma");
          }}
          className="state-card ml-[2vh] h-[50vh]   min-h-[310px] "
        >
          <p>Oklahoma</p>
          <a>
            {t("home.viewHomes")} <span className="text-xl">&gt;</span>
          </a>
        </div>
        <div
          onClick={() => {
            navigate("Search/Arizona");
          }}
          className="ml-[2vh]"
        >
          <div className="state-card mb-[2vh] h-[24vh]  min-h-[150px]">
            <p>Arizona</p>
            <a>
              {t("home.viewHomes")} <span className="text-xl">&gt;</span>
            </a>
          </div>
          <div
            onClick={() => {
              navigate("Search/Pennsylvania");
            }}
            className="state-card h-[24vh]  min-h-[150px]"
          >
            <p>Pennsylvania </p>
            <a>
              {t("home.viewHomes")} <span className="text-xl">&gt;</span>
            </a>
          </div>
        </div>
        <div className="ml-[2vh]">
          <div
            onClick={() => {
              navigate("Search/Colorado");
            }}
            className="state-card mb-[2vh] h-[24vh]  min-h-[150px]"
          >
            <p>Colorado</p>
            <a>
              {t("home.viewHomes")} <span className="text-xl">&gt;</span>
            </a>
          </div>
          <div
            onClick={() => {
              navigate("Search/Hawaii");
            }}
            className="state-card h-[24vh]  min-h-[150px]"
          >
            <p>Hawaii</p>
            <a>
              {t("home.viewHomes")} <span className="text-xl">&gt;</span>
            </a>
          </div>
        </div>
      </section>
      <section className="px-24 py-9 gap-6 flex flex-col lg:flex-row  justify-center items-center">
        <div
          onClick={() => {
            navigate("Search/buy");
          }}
          className="relative card bg-[#66BB6A]     group"
        >
          <h1>{t("home.buyTitle")}</h1>
          <p>
            {t("home.buyDescription")}
          </p>
          <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black text-center py-2 ">
            {t("home.buyCta")} &gt;
          </div>
        </div>

        <div
          onClick={() => {
            navigate("Search/rent");
          }}
          className="relative card bg-black text-white  group"
        >
          <h1>{t("home.rentTitle")}</h1>
          <p>
            {t("home.rentDescription")}
          </p>
          <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center py-2 ">
            {t("home.rentCta")} &gt;
          </div>
        </div>

        <div
          onClick={() => navigate("/Myproperties")}
          className="relative card bg-[#CE93D8]   group"
        >
          <h1>{t("home.myPropertiesTitle")}</h1>
          <p>
            {t("home.myPropertiesDescription")}
          </p>
          <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black text-center py-2 ">
            {t("home.myPropertiesCta")} &gt;
          </div>
        </div>
      </section>
    </>
  );
}
