import { createProperty, updateProperty, fatchPropertyById } from "@/Services/PropetyService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Image as ImageIcon, X } from "lucide-react";
import LoadingSpinner from "@/ui/LoadingSpinner";
import ErrorDisplay from "@/ui/ErrorDisplay";
import { resolvePropertyPhotoUrl } from "@/lib/media";

interface PropertyFormData {
  rent_or_sale: "rent" | "sale" | "";
  price: number | "";
  state: string;
  municipality: string;
  exact_address: string;
  phone_number: string;
  number_rooms: number | "";
  space: number | "";
  type: "House" | "Villa" | "Apartment" | "Shop" | "";
  floor: number | "";
  description: string;
  features: string[];
}

interface PropertyApiResponse {
  id: number;
  rent_or_sale: "rent" | "sale";
  price: number;
  state: string;
  municipality: string;
  exact_address: string;
  phone_number?: string | null;
  number_rooms: number;
  space: number;
  type: "House" | "Villa" | "Apartment" | "Shop";
  floor: number | null;
  description: string | null;
  features: string[] | null;
  photo1: string | null;
  photo2: string | null;
  photo3: string | null;
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
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_SIZE_LABEL = "10MB";

const photoLabels: Record<PhotoKey, string> = {
  photo1: "Main Photo",
  photo2: "Second Photo",
  photo3: "Third Photo",
};

const fieldClassName =
  "w-full rounded border border-slate-300 bg-white p-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400";

export default function PropertyForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<PropertyFormData>({
    rent_or_sale: "",
    price: "",
    state: "",
    municipality: "",
    exact_address: "",
    phone_number: "",
    number_rooms: "",
    space: "",
    type: "",
    floor: "",
    description: "",
    features: [""],
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
    fatchPropertyById(Number(id)).then((data: PropertyApiResponse) => {
      const normalizedFeatures =
        Array.isArray(data.features) && data.features.length > 0
          ? data.features
          : [""];

      setFormData({
        rent_or_sale: data.rent_or_sale ?? "",
        price: data.price ?? "",
        state: data.state ?? "",
        municipality: data.municipality ?? "",
        exact_address: data.exact_address ?? "",
        phone_number: data.phone_number ?? "",
        number_rooms: data.number_rooms ?? "",
        space: data.space ?? "",
        type: data.type ?? "",
        floor: data.floor ?? "",
        description: data.description ?? "",
        features: normalizedFeatures,
      });

      setPreviews({
        photo1: data.photo1
          ? resolvePropertyPhotoUrl(data.id, "photo1", data.photo1, "")
          : null,
        photo2: data.photo2
          ? resolvePropertyPhotoUrl(data.id, "photo2", data.photo2, "")
          : null,
        photo3: data.photo3
          ? resolvePropertyPhotoUrl(data.id, "photo3", data.photo3, "")
          : null,
      });
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

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setPhotos((prev) => ({ ...prev, [key]: null }));
      setPreviews((prev) => ({ ...prev, [key]: null }));
      setValidationErrors([
        {
          field: photoLabels[key],
          message: `Image is too large. Maximum file size is ${MAX_IMAGE_SIZE_LABEL}.`,
        },
      ]);
      setConfirmationMessage("");
      e.target.value = "";
      return;
    }

    setPhotos((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
    if (validationErrors) {
      setValidationErrors(null);
    }
  };

  const removePhoto = (key: PhotoKey) => {
    setPhotos((prev) => ({ ...prev, [key]: null }));
    setPreviews((prev) => ({ ...prev, [key]: null }));
    const photoInput = document.getElementById(key) as HTMLInputElement | null;
    if (photoInput) {
      photoInput.value = "";
    }
  };

  const addFeature = () =>
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));

  const updateFeature = (i: number, value: string) => {
    const features = [...formData.features];
    features[i] = value;
    setFormData((prev) => ({ ...prev, features }));
  };

  const removeFeature = (i: number) =>
    setFormData((prev) => {
      const nextFeatures = prev.features.filter((_, idx) => idx !== i);
      return {
        ...prev,
        features: nextFeatures.length > 0 ? nextFeatures : [""],
      };
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedFeatures = formData.features
      .map((feature) => feature.trim())
      .filter((feature) => feature.length > 0);
    const missingPhotoKeys = (["photo1", "photo2", "photo3"] as PhotoKey[]).filter(
      (key) => !photos[key] && !previews[key],
    );

    if (normalizedFeatures.length === 0) {
      setValidationErrors([
        { field: "Features", message: "At least one feature is required." },
      ]);
      setConfirmationMessage("");
      return;
    }

    if (missingPhotoKeys.length > 0) {
      setValidationErrors(
        missingPhotoKeys.map((key) => ({
          field: photoLabels[key],
          message: "This field is required.",
        })),
      );
      setConfirmationMessage("");
      return;
    }

    setIsSubmitting(true);

    console.log("Current formData before submission:", formData);
    console.log("Current photos before submission:", photos);

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      console.log(`Processing field: ${key}, value:`, value);
      if (key === "features") {
        normalizedFeatures.forEach((f: string, i: number) =>
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
      if (error.response?.status === 422) {
        const responseData = error.response?.data;

        if (Array.isArray(responseData?.error_details) && responseData.error_details.length > 0) {
          setValidationErrors(responseData.error_details);
          setConfirmationMessage("");
        } else if (responseData?.errors && typeof responseData.errors === "object") {
          const flattenedErrors = Object.entries(responseData.errors).flatMap(([field, messages]) => {
            const safeMessages = Array.isArray(messages) ? messages : [String(messages)];
            return safeMessages.map((message) => ({
              field: field.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
              message: String(message),
            }));
          });

          setValidationErrors(
            flattenedErrors.length > 0
              ? flattenedErrors
              : [{ field: "Validation", message: "Please review the form fields." }],
          );
          setConfirmationMessage("");
        } else {
          setConfirmationMessage("Error: Validation failed. Please review your input.");
          setValidationErrors(null);
        }
      } else if (error.response?.status === 413) {
        setValidationErrors([
          {
            field: "Images",
            message: `Upload payload is too large. Please use files up to ${MAX_IMAGE_SIZE_LABEL} each.`,
          },
        ]);
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
    <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
        {id ? "Edit Property" : "Add Property"}
      </h2>

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
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-700 dark:bg-green-950/30">
          <p className="text-green-800 dark:text-green-300">{confirmationMessage}</p>
        </div>
      )}

      {/* General Error Message */}
      {confirmationMessage && confirmationMessage.startsWith("Error:") && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-700 dark:bg-red-950/30">
          <p className="text-red-800 dark:text-red-300">{confirmationMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="rent_or_sale"
          value={formData.rent_or_sale}
          onChange={handleChange}
          required
          className={fieldClassName}
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
          className={fieldClassName}
        />

        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
          className={fieldClassName}
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
          "phone_number",
          "number_rooms",
          "space",
          "floor",
        ].map((f) => (
          <input
            key={f}
            name={f}
            value={formData[f as keyof PropertyFormData]}
            onChange={handleChange}
            placeholder={f.replace(/_/g, " ")}
            type={
              ["number_rooms", "space", "floor"].includes(f)
                ? "number"
                : f === "phone_number"
                  ? "tel"
                  : "text"
            }
            pattern={f === "phone_number" ? "^\\+?[0-9\\s\\-()]{7,20}$" : undefined}
            className={fieldClassName}
            required
          />
        ))}

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className={fieldClassName}
        >
          <option value="">Property Type</option>
          <option value="House">House</option>
          <option value="Villa">Villa</option>
          <option value="Apartment">Apartment</option>
          <option value="Shop">Shop</option>
        </select>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className={fieldClassName}
        />

        {/* Images */}
        <div className="flex justify-center gap-4">
          {(["photo1", "photo2", "photo3"] as PhotoKey[]).map((key) => {
            const selected = !!previews[key];

            return (
              <label
                key={key}
                htmlFor={key}
                className={`relative w-24 h-24 rounded-lg border-2 flex items-center justify-center cursor-pointer transition
                  ${
                    selected
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-dashed border-slate-400 hover:border-blue-400 dark:border-slate-600"
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
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-500 dark:text-slate-300">
                    <ImageIcon size={26} />
                    <span className="text-xs mt-1">Add image</span>
                  </div>
                )}
                <input
                  id={key}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  required={!previews[key]}
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
              placeholder="Feature"
              required
              className={`flex-1 ${fieldClassName}`}
            />
            <button
              type="button"
              onClick={() => removeFeature(i)}
              className="rounded bg-red-500 px-2 text-white transition-colors hover:bg-red-600"
            >
              X
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addFeature}
          className="rounded bg-blue-500 px-3 py-1 text-white transition-colors hover:bg-blue-600"
        >
          Add Feature
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded bg-green-500 p-2 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
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
