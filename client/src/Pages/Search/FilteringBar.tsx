import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilteringBar() {
  return (
    <section className="hidden lg:block">
      <div className="flex flex-row justify-evenly ">
        <Select>
          <SelectTrigger className="w-fit px-6 gap-4 font-bold  rounded">
            <SelectValue placeholder="Rent or Sell" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Rent</SelectItem>
            <SelectItem value="dark">Sale</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-fit px-6 gap-4 font-bold  rounded">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>

          <SelectContent className="max-h-40 overflow-y-auto">
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
        <Select>
          <SelectTrigger className="w-fit px-6 gap-4 font-bold  rounded ">
            <SelectValue placeholder="Price " />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">below 75k</SelectItem>
            <SelectItem value="1">75k-100k</SelectItem>
            <SelectItem value="2">100k-200k</SelectItem>
            <SelectItem value="3">200k-500k</SelectItem>
            <SelectItem value="4">500k-1M</SelectItem>
            <SelectItem value="5">1M-3M</SelectItem>
            <SelectItem value="6">Above 3M</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-fit px-6 gap-4 font-bold  rounded ">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Apartment</SelectItem>
            <SelectItem value="light">House</SelectItem>
            <SelectItem value="system">Villa</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-fit px-6 gap-4 font-bold  rounded ">
            <SelectValue placeholder="Order by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Newest</SelectItem>
            <SelectItem value="dark">Oldest</SelectItem>
            <SelectItem value="system">Price: High to Low</SelectItem>
            <SelectItem value="system1">Price: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
