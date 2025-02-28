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

export default function Property({ property }: PropertyProps) {
  console.log(property);
  return (
    <section className="flex flex-col items-center">
      <div className="flex flex-col gap-1 shadow-lg">
        <div className="h-[30vh] w-[95vw] p-1 rounded bg-[url('/images/image01.jpg')] bg-cover ">
          <p className="bg-black bg-opacity-75 p-[1px] w-fit text-white text-sm  rounded">
            2 days ago
          </p>
        </div>
        <div className="p-1 w-[95vw] ">
          <div className=" p-1 flex flex-row justify-between ">
            <p>
              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </p>
            <p className="text-green-900">{property.price}</p>
          </div>
          <div className="flex flex-row justify-between">
            <p>
              {property.number_rooms} rooms | {property.floor} floor |{" "}
              {property.space}m
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
    </section>
  );
}
