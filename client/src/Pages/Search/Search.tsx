import { useEffect, useState } from "react";
import { fetchProperties, filterProperties } from "@/Services/PropetyService";
import FilteringBar from "./FilteringBar";
import Properties from "./Properties";
import { useParams } from "react-router-dom";

// Shared type for properties
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
  created_at: string;
  updated_at: string;
};

export default function Search() {
  const [Propertiesliste, setPropertiesliste] = useState<Property[]>([]);
  const { filterFromParameter } = useParams<string>();

  useEffect(() => {
    const fetchAndSetPropertiesliste = async () => {
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
    };
    fetchAndSetPropertiesliste();
  }, [filterFromParameter]);

  return (
    <div className="m-2 min-h-[60vh] flex flex-col gap-2">
      <FilteringBar setPropertiesliste={setPropertiesliste} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Propertiesliste.map((element, index) => (
          <Properties key={index} property={element} />
        ))}
      </div>
    </div>
  );
}
