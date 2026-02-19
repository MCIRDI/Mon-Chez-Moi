import { createProperty, updateProperty, fatchPropertyById } from "@/Services/PropetyService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Image as ImageIcon, X } from "lucide-react";
import LoadingSpinner from "@/ui/LoadingSpinner";
import ErrorDisplay from "@/ui/ErrorDisplay";

interface PropertyFormData {
  rent_or_sale: "rent" | "sale" | "";
  price: number | "";
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

type PhotoKey = "photo1" | "photo2" | "photo3";

export default function PropertyForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<PropertyFormData>({
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

  const [photos, setPhotos] = useState<Record<PhotoKey, File | null>>({
    photo1: null,
    photo2: null,
    photo3: null,
  });

  const [previews, setPreviews] = useState<Record<PhotoKey, string | null>>({
    photo1: null,
    photo2: null,
    photo3: null,
  });

  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Array<{field: string; message: string}> | null>(null);

  // Fetch property if editing
  useEffect(() => {
    if (!id) return;
    fatchPropertyById(Number(id)).then((data: PropertyFormData) => {
      console.log("Fetched property data:", data);
      setFormData(data);
    });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "number_rooms", "space", "floor"].includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
    // Clear errors when user starts typing
    if (validationErrors) {
      setValidationErrors(null);
    }
    if (confirmationMessage && confirmationMessage.startsWith("Error:")) {
      setConfirmationMessage("");
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id as PhotoKey;
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotos((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const removePhoto = (key: PhotoKey) => {
    setPhotos((prev) => ({ ...prev, [key]: null }));
    setPreviews((prev) => ({ ...prev, [key]: null }));
  };

  const addFeature = () =>
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));

  const updateFeature = (i: number, value: string) => {
    const features = [...formData.features];
    features[i] = value;
    setFormData((prev) => ({ ...prev, features }));
  };

  const removeFeature = (i: number) =>
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== i),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Current formData before submission:", formData);
    console.log("Current photos before submission:", photos);

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      console.log(`Processing field: ${key}, value:`, value);
      if (key === "features") {
        // Filter out empty features and append as array
        const validFeatures = (value as string[]).filter(f => f.trim() !== "");
        validFeatures.forEach((f: string, i: number) =>
          form.append(`features[${i}]`, f),
        );
      } else {
        form.append(key, String(value));
      }
    });

    Object.entries(photos).forEach(([key, file]) => {
      if (file) form.append(key, file); // photo1, photo2, photo3
    });

    try {
      if (id) {
        // Editing existing property
        console.log("Updating property with ID:", id);
        console.log("Form data:", Object.fromEntries(form));
        const result = await updateProperty(Number(id), form);
        console.log("Update result:", result);
        setConfirmationMessage("Property updated successfully!");
        setValidationErrors(null);
      } else {
        // Creating new property
        await createProperty(form);
        setConfirmationMessage("Property created successfully!");
        setValidationErrors(null);
      }
      navigate(-1);
    } catch (error: any) {
      console.error("Error details:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      // Handle validation errors
      if (error.response?.status === 422 && error.response?.data?.error_details) {
        setValidationErrors(error.response.data.error_details);
        setConfirmationMessage("");
      } else if (error.response?.data?.message) {
        setConfirmationMessage(`Error: ${error.response.data.message}`);
        setValidationErrors(null);
      } else {
        setConfirmationMessage(id ? "Error updating property. Please try again." : "Error creating property. Please try again.");
        setValidationErrors(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{id ? "Edit Property" : "Add Property"}</h2>

      {/* Error Display */}
      {validationErrors && (
        <ErrorDisplay 
          errors={validationErrors} 
          onDismiss={() => setValidationErrors(null)}
          className="mb-4"
        />
      )}

      {/* Success/Error Message */}
      {confirmationMessage && !confirmationMessage.startsWith("Error:") && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800">{confirmationMessage}</p>
        </div>
      )}

      {/* General Error Message */}
      {confirmationMessage && confirmationMessage.startsWith("Error:") && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{confirmationMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="rent_or_sale"
          value={formData.rent_or_sale}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Rent or Sale</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full border p-2 rounded"
        />

        <select
          value={formData.state}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, state: e.target.value }))
          }
          className="w-full border p-2 rounded"
        >
          <option value="">Select State</option>
          {usaStates.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {[
          "municipality",
          "exact_address",
          "number_rooms",
          "space",
          "floor",
        ].map((f) => (
          <input
            key={f}
            name={f}
            value={formData[f as keyof PropertyFormData]}
            onChange={handleChange}
            placeholder={f.replace("_", " ")}
            type={
              ["number_rooms", "space", "floor"].includes(f) ? "number" : "text"
            }
            className="w-full border p-2 rounded"
            required
          />
        ))}

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Property Type</option>
          <option value="House">House</option>
          <option value="Villa">Villa</option>
          <option value="Apartment">Apartment</option>
        </select>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        {/* Images */}
        <div className="flex gap-4 justify-center">
          {(["photo1", "photo2", "photo3"] as PhotoKey[]).map((key) => {
            const selected = !!previews[key];

            return (
              <label
                key={key}
                htmlFor={key}
                className={`relative w-24 h-24 rounded-lg border-2 flex items-center justify-center cursor-pointer transition
                  ${
                    selected
                      ? "border-green-500 bg-green-50"
                      : "border-dashed border-gray-400 hover:border-blue-400"
                  }`}
              >
                {selected ? (
                  <>
                    <img
                      src={previews[key]!}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(key)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <ImageIcon size={26} />
                    <span className="text-xs mt-1">Add image</span>
                  </div>
                )}
                <input
                  id={key}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  hidden
                />
              </label>
            );
          })}
        </div>

        {/* Features */}
        {formData.features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={f}
              onChange={(e) => updateFeature(i, e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            <button
              type="button"
              onClick={() => removeFeature(i)}
              className="bg-red-500 text-white px-2 rounded"
            >
              X
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addFeature}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add Feature
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 text-white p-2 rounded disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              {id ? "Updating..." : "Submitting..."}
            </>
          ) : (
            id ? "Update Property" : "Submit"
          )}
        </button>

              </form>
    </div>
  );
}
