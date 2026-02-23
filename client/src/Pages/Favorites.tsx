import { getUserFavorites } from "@/Services/PropetyService";
import { useEffect, useState } from "react";
import Properties from "./Properties";
import { Property } from "./Search";
import Loader from "@/ui/Loader";
import { useUiSettings } from "@/Context/UiSettingsContext";

type FavoriteItem = {
  id: number;
  id_user: number;
  id_property: number;
  property: Property;
};

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useUiSettings();

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const result = await getUserFavorites();
        setFavorites(result.favorites || []);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  if (loading) {
    return <Loader message={t("favorites.loading")} />;
  }

  return (
    <>
      {favorites && favorites.length > 0 ? (
        <div className="m-2 min-h-[60vh]">
          <h2 className="mb-4 text-2xl font-bold">{t("favorites.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((element) => (
              <Properties key={element.id} property={element.property} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh] w-full">
          <p className="text-lg text-slate-500 text-center dark:text-slate-300">
            {t("favorites.empty")}
          </p>
        </div>
      )}
    </>
  );
}
