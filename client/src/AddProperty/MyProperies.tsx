import Properties from "@/Pages/Search/Properties";
import { Myproperties } from "@/Services/PropetyService";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function MyProperties() {
  const [Propertiesliste, setPropertiesliste] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAndSetPropertiesliste = async () => {
      setPropertiesliste(await Myproperties());
    };
    fetchAndSetPropertiesliste();
  }, []);
  return (
    <div className="m-2 min-h-[60vh]">
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

        {Propertiesliste.map((element, index) => (
          <Properties key={index} property={element} />
        ))}
      </div>
    </div>
  );
}
