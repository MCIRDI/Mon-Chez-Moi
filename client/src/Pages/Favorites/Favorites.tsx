import { getUserFavorites } from "@/Services/PropetyService";
import { useEffect, useState } from "react";
import Properties from "../Search/Properties";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    async function fetchFavorites() {
      const result = await getUserFavorites();
      setFavorites(result);
    }
    fetchFavorites();
  }, []);

  return (
    <>
      {favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((element, index) => (
            <Properties key={index} property={element} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh] w-full">
          <p className="text-gray-500 text-lg">
            You don’t have any favorites yet
          </p>
        </div>
      )}
    </>
  );
}
