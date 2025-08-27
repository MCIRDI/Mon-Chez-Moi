import { useNavigate } from "react-router-dom";

interface PropertyProps {
  property: {
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
}

export default function Properties({ property }: PropertyProps) {
  const navigate = useNavigate();
  function goToProperty() {
    navigate(`/search/property/${property.id}`);
  }
  return (
    <div
      onClick={goToProperty}
      className="py-2 pl-1 w-[95vw] md:w-[45vw] lg:w-[32vw] flex flex-col gap-1 shadow-lg hover:cursor-pointer"
    >
      <div className="h-[30vh] p-1 rounded bg-[url('/images/image01.jpg')] bg-cover ">
        <p className="bg-black bg-opacity-75 p-[1px] w-fit text-white text-sm  rounded">
          2 days ago
        </p>
      </div>
      <div className="p-1 w-[100%] ">
        <div className=" p-1 flex flex-row justify-between ">
          <p>
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </p>
          <p className="text-green-900">{property.price}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p>
            {property.number_rooms} rooms | {property.floor} floor |{" "}
            {property.space}m²
          </p>
          <p className="text-green-950 ">
            {property.rent_or_sale.charAt(0).toUpperCase() +
              property.rent_or_sale.slice(1)}
          </p>
        </div>
        <p>
          {property.exact_address.charAt(0).toUpperCase() +
            property.exact_address.slice(1)}
          ,{" "}
          {property.municipality.charAt(0).toUpperCase() +
            property.municipality.slice(1)}
          , {property.state.charAt(0).toUpperCase() + property.state.slice(1)}
        </p>
      </div>
    </div>
  );
}
