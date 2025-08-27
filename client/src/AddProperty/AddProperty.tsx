import { createProperty, fatchPropertyById } from "@/Services/PropetyService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface PropertyFormData {
  rent_or_sale: "rent" | "sale" | "";
  price: string;
  state: string;
  municipality: string;
  exact_address: string;
  number_rooms: number | "";
  space: number | "";
  type: "House" | "Villa" | "Apartment" | "";
  floor: number | "";
  description: string;
  features: string[];
}

const usaStates = [
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
];

export default function PropertyForm() {
  const defaultFormData: PropertyFormData = {
    rent_or_sale: "",
    price: "",
    state: "",
    municipality: "",
    exact_address: "",
    number_rooms: "",
    space: "",
    type: "",
    floor: "",
    description: "",
    features: [],
  };

  const [formData, setFormData] = useState<PropertyFormData>({
    ...defaultFormData,
  });

  const [comnfirmationMessage, setConfirmationMessage] = useState("");
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const result = await fatchPropertyById(Number(id));
        setFormData(result);
      };
      fetchData();
    } else {
      setFormData({
        rent_or_sale: "",
        price: "",
        state: "",
        municipality: "",
        exact_address: "",
        number_rooms: "",
        space: "",
        type: "",
        floor: "",
        description: "",
        features: [],
      });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["number_rooms", "space", "price", "floor"].includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    createProperty(JSON.parse(JSON.stringify(formData)))
      .then((response: { data: { id: string; message: string } }) => {
        console.log("Property created successfully", response.data);
        setConfirmationMessage("Property created successfully !!!");
        setFormData({
          rent_or_sale: "",
          price: "",
          state: "",
          municipality: "",
          exact_address: "",
          number_rooms: "",
          space: "",
          type: "",
          floor: "",
          description: "",
          features: [],
        });
      })
      .catch((error: unknown) => {
        console.error("Error creating property:", error);
        setConfirmationMessage("Error creating property !!! Please try again.");
      });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Add Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rent or Sale */}
        <label className="block">
          <span className="text-gray-700">Rent or Sale</span>
          <select
            name="rent_or_sale"
            value={formData.rent_or_sale}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          >
            <option value="">Select</option>
            <option value="rent">Rent</option>
            <option value="sale">Sale</option>
          </select>
        </label>

        {/* Price (Dropdown) */}
        <label className="block">
          <span className="text-gray-700">Price Range</span>
          <input
            name="price"
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            type="number"
            required
          ></input>
        </label>

        {/* State (Dropdown + Custom Input) */}
        <label className="block">
          <span className="text-gray-700">State</span>
          <select
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            className="mt-1 block w-full p-2 border rounded"
          >
            <option value="">Select a U.S. State</option>
            {usaStates.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>

        {/* Other Fields */}
        {[
          "municipality",
          "exact_address",
          "number_rooms",
          "space",
          "floor",
        ].map((field) => (
          <label key={field} className="block">
            <span className="text-gray-700 capitalize">
              {field.replace("_", " ")}
            </span>
            <input
              type={
                field.includes("number") ||
                field === "space" ||
                field === "floor"
                  ? "number"
                  : "text"
              }
              name={field}
              value={formData[field as keyof PropertyFormData]}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded"
              required
            />
          </label>
        ))}

        {/* Type */}
        <label className="block">
          <span className="text-gray-700">Property Type</span>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          >
            <option value="">Select</option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Apartment">Apartment</option>
          </select>
        </label>

        {/* Description */}
        <label className="block">
          <span className="text-gray-700">Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded"
          />
        </label>

        {/* Features */}
        <div>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 mt-1">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="p-2 border rounded w-full"
                maxLength={30}
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Add Feature
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Submit
        </button>
        {comnfirmationMessage &&
          (comnfirmationMessage === "Property created successfully !!!" ? (
            <div className="mt-4 bold text-green-600">
              {comnfirmationMessage}
            </div>
          ) : (
            <div className="mt-4  text-red-600">{comnfirmationMessage}</div>
          ))}
      </form>
    </div>
  );
}
