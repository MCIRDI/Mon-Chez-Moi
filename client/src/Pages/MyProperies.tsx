import Properties from "@/Pages/Properties";
import { Myproperties } from "@/Services/PropetyService";
import Loader from "@/ui/Loader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Property } from "./Search";

export default function MyProperties() {
  const [Propertiesliste, setPropertiesliste] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndSetPropertiesliste = async () => {
      try {
        setPropertiesliste(await Myproperties());
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
    return <Loader message="Loading your properties..." />;
  }

  return (
    <div className="m-2 min-h-[60vh] flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          onClick={() => navigate("/AddProperty")}
          className="bg-blue-100 min-h-[30vh] w-[95vw] md:w-[45vw] lg:w-[32vw] flex flex-col justify-around items-center p-2 rounded hover:cursor-pointer shadow-lg"
        >
          <p className="font-bold ">Add a new property</p>
          <p className="text-center">
            Get the best value for your property with our expert guidance
          </p>
          <div className="w-10 h-10 flex items-center justify-center bg-blue-200 rounded-full  shadow-lg">
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
    </div>
  );
}
