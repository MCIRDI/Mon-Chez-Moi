import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { filterProperties } from "@/Services/PropetyService";
import { useEffect, useState } from "react";
import { Property } from "../Pages/Search";
import { ListFilterIcon } from "lucide-react";
import { useParams } from "react-router-dom";

type Filter = Record<string, string | number>;
type FilteringBarProps = {
  setPropertiesliste: React.Dispatch<React.SetStateAction<Property[]>>;
};

export default function FilteringBar({
  setPropertiesliste,
}: FilteringBarProps) {
  const { filterFromParameter } = useParams();
  const [filters, setFilters] = useState<Filter>({ order: "Newest" });
  const [open, setopen] = useState(false);
  const [rentSaleButton, setRentSaleButton] = useState("sale & rent");

  useEffect(() => {
    console.log("filterFromParameter:", filterFromParameter);
    if (filterFromParameter == "rent") {
      setRentSaleButton("rent");
    }
    if (filterFromParameter == "buy") {
      setRentSaleButton("sale");
    }
  }, [filterFromParameter]);

  useEffect(() => {
    setopen(false);
  }, [filterFromParameter]);

  async function handleSearch(filter: Filter) {
    const updatedFilters = { ...filters, ...filter };
    // Clean empty filters (e.g. user removed a filter)
    const cleanedFilters = Object.fromEntries(
      Object.entries(updatedFilters).filter(([, v]) => v !== "0")
    );
    setFilters(cleanedFilters);
    // Separate 'order' from the rest of the filters
    const { order, ...filterWithoutOrder } = cleanedFilters;
    const properties = await filterProperties(filterWithoutOrder);
    // Copy properties to a new array for sorting
    const sortedProperties = [...properties];
    // Apply sorting based on 'order'
    switch (order) {
      case "Newest":
        sortedProperties.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "Oldest":
        sortedProperties.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "HTL":
        sortedProperties.sort((a, b) => b.price - a.price);
        break;
      case "LTH":
        sortedProperties.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }
    setPropertiesliste(sortedProperties);
  }
  return (
    <>
      {open && (
        <section className=" lg:hidden w-full h-full z-20  p-4 bg-white border border-gray-200 rounded shadow-sm">
          <div className="flex flex-col gap-4">
            {/* Rent or Sale Buttons for small and medium size divices */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (rentSaleButton === "sale") {
                    handleSearch({ rent_or_sale: "0" });
                    setRentSaleButton("sale & rent");
                  } else if (rentSaleButton === "sale & rent") {
                    handleSearch({ rent_or_sale: "sale" });
                    setRentSaleButton("sale");
                  } else {
                    handleSearch({ rent_or_sale: "0" });
                    setRentSaleButton("sale & rent");
                  }
                }}
                className={`px-4 py-2 rounded border font-semibold w-full ${
                  rentSaleButton === "rent" || rentSaleButton === "sale & rent"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                Rent
              </button>

              <button
                onClick={() => {
                  if (rentSaleButton === "rent") {
                    handleSearch({ rent_or_sale: "0" });
                    setRentSaleButton("sale & rent");
                  } else if (rentSaleButton === "sale & rent") {
                    handleSearch({ rent_or_sale: "rent" });
                    setRentSaleButton("rent");
                  } else {
                    handleSearch({ rent_or_sale: "0" });
                    setRentSaleButton("sale & rent");
                  }
                }}
                className={`px-4 py-2 rounded border font-semibold w-full ${
                  rentSaleButton === "sale" || rentSaleButton === "sale & rent"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                Sale
              </button>
            </div>

            {/* State Filter for small and medium size divices*/}
            <Select onValueChange={(value) => handleSearch({ state: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {[
                  "Alabama",
                  "Alaska",
                  "Arizona",
                  "California",
                  "Colorado",
                  "Connecticut",
                  "Delaware",
                  "Florida",
                  "Georgia",
                  "Hawaii",
                  "Idaho",
                  "Illinois",
                  "Indiana",
                  "Iowa",
                  "Kansas",
                  "Kentucky",
                  "Louisiana",
                  "Maine",
                  "Maryland",
                  "Massachusetts",
                  "Michigan",
                  "Minnesota",
                  "Mississippi",
                  "Missouri",
                  "Montana",
                  "Nebraska",
                  "Nevada",
                  "New Hampshire",
                  "New Jersey",
                  "New Mexico",
                  "New York",
                  "North Carolina",
                  "North Dakota",
                  "Ohio",
                  "Oklahoma",
                  "Oregon",
                  "Pennsylvania",
                  "Rhode Island",
                  "South Carolina",
                  "South Dakota",
                  "Tennessee",
                  "Texas",
                  "Utah",
                  "Vermont",
                  "Virginia",
                  "Washington",
                  "West Virginia",
                  "Wisconsin",
                  "Wyoming",
                ].map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Filter for small and medium size divices*/}
            <Select onValueChange={(value) => handleSearch({ price: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="0">all Prices</SelectItem>
                <SelectItem value="[0,75000]">Below 75k</SelectItem>
                <SelectItem value="[75000,100000]">75k-100k</SelectItem>
                <SelectItem value="[100000,200000]">100k-200k</SelectItem>
                <SelectItem value="[200000,500000]">200k-500k</SelectItem>
                <SelectItem value="[500000,1000000]">500k-1M</SelectItem>
                <SelectItem value="[1000000,3000000]">1M-3M</SelectItem>
                <SelectItem value="[3000000,99999999999999]">
                  Above 3M
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter for small and medium size divices*/}
            <Select onValueChange={(value) => handleSearch({ type: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="0">all Types</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Shop">Shop</SelectItem>
              </SelectContent>
            </Select>

            {/* Order Filter for small and medium size divices*/}
            <Select onValueChange={(value) => handleSearch({ order: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Order by" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="Newest">Newest</SelectItem>
                <SelectItem value="Oldest">Oldest</SelectItem>
                <SelectItem value="HTL">Price: High to Low</SelectItem>
                <SelectItem value="LTH">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
      )}
      <section className=" w-[100%] flex justify-center">
        <div
          onClick={() => setopen(!open)}
          className="flex lg:hidden h-[10%] w-[80%] flex-row gap-1 justify-center items-center  text-lg font-bold border-2 border-gray-400 rounded hover:bg-gray-200 hover:border-gray-200 hover:cursor-pointer "
        >
          <ListFilterIcon className="inline mr-2" />
          <p>Filters</p>
        </div>
      </section>
      <section className="hidden lg:block">
        <div className="flex flex-row justify-start gap-5">
          {/* Rent or Sale Filter for large size divices */}
          <Select
            onValueChange={(value) => handleSearch({ rent_or_sale: value })}
          >
            <SelectTrigger className="w-fit px-6 gap-4 font-bold rounded">
              <SelectValue placeholder="Rent or Sell" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="0">rent & salle</SelectItem>

              <SelectItem value="Rent">Rent</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
            </SelectContent>
          </Select>
          {/* State Filter */}
          <Select onValueChange={(value) => handleSearch({ state: value })}>
            <SelectTrigger className="w-fit px-6 gap-4 font-bold rounded">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent className="max-h-40 overflow-y-auto bg-white text-black">
              <SelectItem value="0">all states</SelectItem>
              {[
                "Alabama",
                "Alaska",
                "Arizona",
                "Arkansas",
                "California",
                "Colorado",
                "Connecticut",
                "Delaware",
                "Florida",
                "Georgia",
                "Hawaii",
                "Idaho",
                "Illinois",
                "Indiana",
                "Iowa",
                "Kansas",
                "Kentucky",
                "Louisiana",
                "Maine",
                "Maryland",
                "Massachusetts",
                "Michigan",
                "Minnesota",
                "Mississippi",
                "Missouri",
                "Montana",
                "Nebraska",
                "Nevada",
                "New Hampshire",
                "New Jersey",
                "New Mexico",
                "New York",
                "North Carolina",
                "North Dakota",
                "Ohio",
                "Oklahoma",
                "Oregon",
                "Pennsylvania",
                "Rhode Island",
                "South Carolina",
                "South Dakota",
                "Tennessee",
                "Texas",
                "Utah",
                "Vermont",
                "Virginia",
                "Washington",
                "West Virginia",
                "Wisconsin",
                "Wyoming",
              ].map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Price Filter for large size divices */}
          <Select onValueChange={(value) => handleSearch({ price: value })}>
            <SelectTrigger className="w-fit px-6 gap-4 font-bold rounded">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="0">all Prices</SelectItem>

              <SelectItem value="[0,75000]">Below 75k</SelectItem>
              <SelectItem value="[75000,100000]">75k-100k</SelectItem>
              <SelectItem value="[100000,200000]">100k-200k</SelectItem>
              <SelectItem value="[200000,500000]">200k-500k</SelectItem>
              <SelectItem value="[500000,1000000]">500k-1M</SelectItem>
              <SelectItem value="[1000000,3000000]">1M-3M</SelectItem>
              <SelectItem value="[3000000,99999999999999]">Above 3M</SelectItem>
            </SelectContent>
          </Select>
          {/* Type Filter for large size divices */}
          <Select onValueChange={(value) => handleSearch({ type: value })}>
            <SelectTrigger className="w-fit px-6 gap-4 font-bold rounded">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="0">all Types</SelectItem>

              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Shop">Shop</SelectItem>
            </SelectContent>
          </Select>
          {/* Order Filter for large size divices */}
          <Select onValueChange={(value) => handleSearch({ order: value })}>
            <SelectTrigger className="w-fit px-6 gap-4 font-bold rounded">
              <SelectValue placeholder="Order by" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="Newest">Newest</SelectItem>
              <SelectItem value="Oldest">Oldest</SelectItem>
              <SelectItem value="HTL">Price: High to Low</SelectItem>
              <SelectItem value="LTH">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>
    </>
  );
}
