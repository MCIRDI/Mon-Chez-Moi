import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || "http://127.0.0.1:8000/storage";

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
    photo1: string | null;
    photo2: string | null;
    photo3: string | null;
    created_at: string;
    updated_at: string;
  };
}

function formatRelativeTime(isoDate: string) {
  const date = new Date(isoDate);
  const diffMs = date.getTime() - Date.now();

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];

  for (const [unit, unitMs] of units) {
    const value = diffMs / unitMs;
    if (Math.abs(value) >= 1) {
      const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
      return rtf.format(Math.round(value), unit);
    }
  }

  return "just now";
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
      <div
        className="h-[30vh] p-1 rounded bg-cover bg-center"
        style={{
          backgroundImage: property.photo1
            ? `url(${API_BASE_URL}/${property.photo1})`
            : "url('/images/image01.jpg')",
        }}
      >
        <p className="bg-black bg-opacity-75 p-[1px] w-fit text-white text-sm  rounded">
          {formatRelativeTime(property.created_at)}
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
