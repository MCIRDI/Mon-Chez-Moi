import { useEffect, useState } from "react";
import { fetchProperties, filterProperties } from "@/Services/PropetyService";
import FilteringBar from "../ui/FilteringBar";
import Properties from "./Properties";
import { useParams } from "react-router-dom";
import Loader from "@/ui/Loader";

export type Property = {
  id: number;
  id_user: number;
  type: string;
  rent_or_sale: "sale" | "rent";
  price: number;
  state: string;
  municipality: string;
  exact_address: string;
  space: number;
  number_rooms: number;
  floor: number;
  description: string;
  features: string[];
  photo1: string | null;
  photo2: string | null;
  photo3: string | null;
  created_at: string;
  updated_at: string;
};

export default function Search() {
  const [Propertiesliste, setPropertiesliste] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { filterFromParameter } = useParams<string>();

  useEffect(() => {
    const fetchAndSetPropertiesliste = async () => {
      setLoading(true);
      try {
        let data;
        if (filterFromParameter == "rent") {
          data = await filterProperties({ rent_or_sale: "rent" });
        } else if (filterFromParameter == "buy") {
          data = await filterProperties({ rent_or_sale: "sale" });
        } else if (filterFromParameter == undefined) {
          data = await fetchProperties();
        } else if (filterFromParameter !== undefined) {
          data = await filterProperties({ state: filterFromParameter });
        }

        //to sort properties by Newest by default
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setPropertiesliste(sorted);
        setCurrentPage(1); // Reset to first page when data changes
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndSetPropertiesliste();
  }, [filterFromParameter]);

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
    return <Loader message="Loading properties..." />;
  }

  return (
    <>
      <div className="m-2 min-h-[60vh] flex flex-col gap-2">
        <FilteringBar setPropertiesliste={setPropertiesliste} />
        
        {Propertiesliste.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === pageNumber
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-[50vh] w-full">
            <p className="text-gray-500 text-lg text-center">
              No properties found matching your filters. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
