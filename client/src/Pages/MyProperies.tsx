import Properties from "@/Pages/Properties";
import { Myproperties } from "@/Services/PropetyService";
import Loader from "@/ui/Loader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Property } from "./Search";
import { useUiSettings } from "@/Context/UiSettingsContext";

export default function MyProperties() {
  const [Propertiesliste, setPropertiesliste] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const { t } = useUiSettings();

  useEffect(() => {
    const fetchAndSetPropertiesliste = async () => {
      try {
        const properties = await Myproperties();
        const sortedProperties = [...properties].sort(
          (a: Property, b: Property) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setPropertiesliste(sortedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndSetPropertiesliste();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(Propertiesliste.length / itemsPerPage);
  const indexOfLastProperty = currentPage * itemsPerPage;
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;
  const currentProperties = Propertiesliste.slice(indexOfFirstProperty, indexOfLastProperty);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top when changing page
  };

  if (loading) {
    return <Loader message={t("myProperties.loading")} />;
  }

  return (
    <div className="m-2 min-h-[60vh] flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          onClick={() => navigate("/AddProperty")}
          className="flex min-h-[30vh] w-[95vw] flex-col items-center justify-around rounded bg-blue-100 p-2 shadow-lg transition-transform hover:cursor-pointer hover:scale-[1.01] dark:bg-slate-800 md:w-[45vw] lg:w-[32vw]"
        >
          <p className="font-bold">{t("myProperties.addTitle")}</p>
          <p className="text-center text-sm text-slate-700 dark:text-slate-200">
            {t("myProperties.addDescription")}
          </p>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-200 text-xl shadow-lg dark:bg-slate-700">
            +
          </div>
        </div>

        {currentProperties.map((element, index) => (
          <Properties key={index} property={element} />
        ))}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded border border-slate-300 px-3 py-1 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {t("myProperties.previous")}
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-1 rounded border ${
                currentPage === pageNumber
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              }`}
            >
              {pageNumber}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded border border-slate-300 px-3 py-1 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {t("myProperties.next")}
          </button>
        </div>
      )}
    </div>
  );
}
