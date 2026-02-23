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
import { useUiSettings } from "@/Context/UiSettingsContext";

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
  const { t } = useUiSettings();

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
        <section className="z-20 h-full w-full rounded border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:hidden">
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
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }`}
              >
                {t("filters.rent")}
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
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }`}
              >
                {t("filters.sale")}
              </button>
            </div>

            {/* State Filter for small and medium size divices*/}
            <Select onValueChange={(value) => handleSearch({ state: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("filters.selectState")} />
              </SelectTrigger>
              <SelectContent className="bg-white text-black dark:bg-slate-900 dark:text-slate-100">
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
                <SelectValue placeholder={t("filters.price")} />
              </SelectTrigger>
              <SelectContent className="bg-white text-black dark:bg-slate-900 dark:text-slate-100">
                <SelectItem value="0">{t("filters.allPrices")}</SelectItem>
                <SelectItem value="[0,75000]">{t("filters.below75k")}</SelectItem>
                <SelectItem value="[75000,100000]">{t("filters.between75And100k")}</SelectItem>
                <SelectItem value="[100000,200000]">{t("filters.between100And200k")}</SelectItem>
                <SelectItem value="[200000,500000]">{t("filters.between200And500k")}</SelectItem>
                <SelectItem value="[500000,1000000]">{t("filters.between500kAnd1m")}</SelectItem>
                <SelectItem value="[1000000,3000000]">{t("filters.between1mAnd3m")}</SelectItem>
                <SelectItem value="[3000000,99999999999999]">
                  {t("filters.above3m")}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter for small and medium size divices*/}
            <Select onValueChange={(value) => handleSearch({ type: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("filters.type")} />
              </SelectTrigger>
              <SelectContent className="bg-white text-black dark:bg-slate-900 dark:text-slate-100">
                <SelectItem value="0">{t("filters.allTypes")}</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Shop">Shop</SelectItem>
              </SelectContent>
            </Select>

            {/* Order Filter for small and medium size divices*/}
            <Select onValueChange={(value) => handleSearch({ order: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("filters.orderBy")} />
              </SelectTrigger>
              <SelectContent className="bg-white text-black dark:bg-slate-900 dark:text-slate-100">
                <SelectItem value="Newest">{t("filters.newest")}</SelectItem>
                <SelectItem value="Oldest">{t("filters.oldest")}</SelectItem>
                <SelectItem value="HTL">{t("filters.priceHighToLow")}</SelectItem>
                <SelectItem value="LTH">{t("filters.priceLowToHigh")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
      )}
      <section className=" w-[100%] flex justify-center">
        <div
          onClick={() => setopen(!open)}
          className="flex h-[10%] w-[80%] flex-row items-center justify-center gap-1 rounded border-2 border-slate-400 text-lg font-bold hover:cursor-pointer hover:border-slate-200 hover:bg-slate-200 dark:border-slate-700 dark:hover:border-slate-700 dark:hover:bg-slate-800 lg:hidden"
        >
          <ListFilterIcon className="inline mr-2" />
          <p>{t("filters.title")}</p>
        </div>
      </section>
      <section className="hidden lg:block">
        <div className="flex flex-row justify-start gap-5">
          {/* Rent or Sale Filter for large size divices */}
          <Select
            onValueChange={(value) => handleSearch({ rent_or_sale: value })}
          >
            <SelectTrigger className="w-fit px-6 gap-4 font-bold rounded">
              <SelectValue placeholder={t("filters.rentOrSell")} />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-slate-900 dark:text-slate-100">
              <SelectItem value="0">{t("filters.rentAndSale")}</SelectItem>

              <SelectItem value="rent">{t("filters.rent")}</SelectItem>
              <SelectItem value="sale">{t("filters.sale")}</SelectItem>
            </SelectContent>
          </Select>
          {/* State Filter */}
          <Select onValueChange={(value) => handleSearch({ state: value })}>
            <SelectTrigger className="w-fit px-6 gap-4 font-bold rounded">
              <SelectValue placeholder={t("filters.selectState")} />
            </SelectTrigger>
            <SelectContent className="max-h-40 overflow-y-auto bg-white text-black dark:bg-slate-900 dark:text-slate-100">
              <SelectItem value="0">{t("filters.allStates")}</SelectItem>
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
              <SelectValue placeholder={t("filters.price")} />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-slate-900 dark:text-slate-100">
              <SelectItem value="0">{t("filters.allPrices")}</SelectItem>

              <SelectItem value="[0,75000]">{t("filters.below75k")}</SelectItem>
              <SelectItem value="[75000,100000]">{t("filters.between75And100k")}</SelectItem>
              <SelectItem value="[100000,200000]">{t("filters.between100And200k")}</SelectItem>
              <SelectItem value="[200000,500000]">{t("filters.between200And500k")}</SelectItem>
              <SelectItem value="[500000,1000000]">{t("filters.between500kAnd1m")}</SelectItem>
              <SelectItem value="[1000000,3000000]">{t("filters.between1mAnd3m")}</SelectItem>
              <SelectItem value="[3000000,99999999999999]">{t("filters.above3m")}</SelectItem>
            </SelectContent>
          </Select>
          {/* Type Filter for large size divices */}
          <Select onValueChange={(value) => handleSearch({ type: value })}>
            <SelectTrigger className="w-fit px-6 gap-4 font-bold rounded">
              <SelectValue placeholder={t("filters.type")} />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-slate-900 dark:text-slate-100">
              <SelectItem value="0">{t("filters.allTypes")}</SelectItem>

              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Shop">Shop</SelectItem>
            </SelectContent>
          </Select>
          {/* Order Filter for large size divices */}
          <Select onValueChange={(value) => handleSearch({ order: value })}>
            <SelectTrigger className="w-fit px-6 gap-4 font-bold rounded">
              <SelectValue placeholder={t("filters.orderBy")} />
            </SelectTrigger>
            <SelectContent className="bg-white text-black dark:bg-slate-900 dark:text-slate-100">
              <SelectItem value="Newest">{t("filters.newest")}</SelectItem>
              <SelectItem value="Oldest">{t("filters.oldest")}</SelectItem>
              <SelectItem value="HTL">{t("filters.priceHighToLow")}</SelectItem>
              <SelectItem value="LTH">{t("filters.priceLowToHigh")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>
    </>
  );
}
