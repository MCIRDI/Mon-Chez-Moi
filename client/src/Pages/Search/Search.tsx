import { fetchProperties } from "@/Services/PropetyService";
import FilteringBar from "./FilteringBar";
import Property from "./Property";
import { useEffect, useState } from "react";
export default function Search() {
  const [Properties, setProperties] = useState([]);
  useEffect(() => {
    const fetchAndSetProperties = async () => {
      setProperties(await fetchProperties());
    };
    fetchAndSetProperties();
  }, []);

  return (
    <div className="mt-2 flex flex-col  gap-2">
      <FilteringBar />
      {Properties.map((element, index) => (
        <Property key={index} property={element} />
      ))}
    </div>
  );
}
