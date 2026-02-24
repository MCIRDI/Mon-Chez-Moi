import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { AppContext } from "@/Context/AppContext";
import {
  Image,
  Share2,
  Heart,
  Phone,
  Bed,
  Layers,
  Expand,
  Check,
  Copy,
  MoreVertical,
} from "lucide-react";
import {
  deleteProperty,
  fatchPropertyById,
  getUserFavorites,
  removeFromFavorites,
  storeFavorites,
} from "@/Services/PropetyService";
import Loader from "@/ui/Loader";
import { resolvePropertyPhotoUrl } from "@/lib/media";

export default function Property() {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("AppContext is not provided");
  }
  const { user } = appContext;
  const [opendropdown, setOpendropdown] = useState(false);
  const [openDeleteConfirmation, setOpendDeleteConfirmation] = useState(false);

  type PropertyType = {
    id: number;
    id_user: number;
    description: string;
    exact_address: string;
    features: string[];
    floor: number;
    municipality: string;
    number_rooms: number;
    price: number;
    rent_or_sale: string;
    space: number;
    state: string;
    type: string;
    phone_number: string | null;
    photo1: string | null;
    photo2: string | null;
    photo3: string | null;
    created_at: string;
  };

  const getRelativeTime = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 0) return "Just now";
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return mins === 1 ? "1 minute ago" : `${mins} minutes ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return days === 1 ? "1 day ago" : `${days} days ago`;
    }
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }
    const years = Math.floor(diffInSeconds / 31536000);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  };

  const [property, setProperty] = useState<PropertyType | null>(null);
  const [liked, setLiked] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const mainPhotoUrl = resolvePropertyPhotoUrl(
    property?.id,
    "photo1",
    property?.photo1,
    "/images/MonChezMoi01.jpg",
  );
  const secondPhotoUrl = property?.photo2
    ? resolvePropertyPhotoUrl(
        property?.id,
        "photo2",
        property?.photo2,
        "/images/MonChezMoi01.jpg",
      )
    : mainPhotoUrl;
  const thirdPhotoUrl = property?.photo3
    ? resolvePropertyPhotoUrl(
        property?.id,
        "photo3",
        property?.photo3,
        "/images/MonChezMoi01.jpg",
      )
    : mainPhotoUrl;

  const phoneNumber = property?.phone_number?.trim() || "N/A";
  const canCopyPhone = Boolean(property?.phone_number?.trim());

  const handleCopyPhone = async () => {
    const value = property?.phone_number?.trim();
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1600);
    } catch (error) {
      console.error("Failed to copy phone number:", error);
      setCopyStatus("error");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    }
  };

  const setAuthForms = useOutletContext<
    React.Dispatch<React.SetStateAction<boolean>> | undefined
  >();

  useEffect(() => {
    // Check if property is empty (null or undefined or has no keys)
    const isEmpty =
      !property ||
      (typeof property === "object" &&
        property !== null &&
        Object.keys(property).length === 0);

    if (isEmpty && id !== undefined) {
      const fetchProperty = async () => {
        const result = await fatchPropertyById(Number(id));
        console.log("Property API response:", result);
        console.log("created_at value:", result?.created_at);
        setProperty(result);
      };
      fetchProperty();
    }
  }, [property, id]);

  // Check if property is already in user's favorites
  useEffect(() => {
    const checkIfFavorited = async () => {
      if (!user || !id) return;
      try {
        const response = await getUserFavorites();
        const favorites = response.favorites || [];
        const isFavorited = favorites.some(
          (fav: { id_property: number }) => fav.id_property === Number(id)
        );
        setLiked(isFavorited);
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };
    checkIfFavorited();
  }, [user, id]);
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLDivElement).contains(event.target as Node)
      ) {
        setOpendropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <section className="px-[2vw] pb-6 md:px-[5vw] lg:px-[10vw] flex flex-col gap-5">
      {!property ? (
        <Loader message="Loading property..." />
      ) : (
        <>
          {openDeleteConfirmation && (
            <div>
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg text-center">
                  <h2 className="text-xl font-bold mb-4">
                    Delete Confirmation
                  </h2>
                  <p>Are you sure you want to delete this property?</p>
                  <div className="mt-4 flex justify-evenly gap-2">
                    <button
                      onClick={() => setOpendDeleteConfirmation(false)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        deleteProperty(property.id);
                        console.log("Property deleted");
                        navigate(-1);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {user && user.id === property.id_user && (
            <div ref={dropdownRef} className="flex justify-end gap-5">
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setOpendropdown(!opendropdown)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical />
                </button>

                {opendropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                    <button
                      onClick={() => navigate("/AddProperty/" + property.id)}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 "
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setOpendDeleteConfirmation(true)}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Image Gallery Modal */}
          {showGallery && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={() => setShowGallery(false)}
            >
              <button
                onClick={() => setShowGallery(false)}
                className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300"
              >
                ✕
              </button>
              <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Property"
                    className="w-full max-h-[70vh] object-contain rounded-lg mb-4"
                  />
                )}
                <div className="flex justify-center gap-2 flex-wrap">
                  {(
                    [
                      { slot: "photo1", value: property.photo1 },
                      { slot: "photo2", value: property.photo2 },
                      { slot: "photo3", value: property.photo3 },
                    ] as const
                  )
                    .filter((item) => Boolean(item.value))
                    .map((item, index) => {
                      const imageUrl = resolvePropertyPhotoUrl(
                        property.id,
                        item.slot,
                        item.value,
                        "/images/MonChezMoi01.jpg",
                      );

                      return (
                        <img
                          key={`${item.slot}-${index}`}
                          src={imageUrl}
                          alt={`Property ${index + 1}`}
                          onClick={() => setSelectedImage(imageUrl)}
                          className={`w-20 h-20 md:w-24 md:h-24 object-cover rounded cursor-pointer border-2 ${
                            selectedImage === imageUrl
                              ? "border-white"
                              : "border-transparent"
                          }`}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-row justify-center gap-2 h-[60vh]">
            <div
              className="w-[96vw] md:w-[90vw] lg:w-[60vw] bg-cover bg-center rounded flex flex-col justify-between p-2"
              style={{
                backgroundImage: `url(${mainPhotoUrl})`,
              }}
            >
              <div className="flex flex-row justify-between">
                {property.created_at && (
                  <p className="bg-white h-fit bg-opacity-75 p-[5px] w-fit text-black font-bold text-sm rounded">
                    {getRelativeTime(property.created_at)}
                  </p>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      const shareUrl = window.location.href;
                      const shareData = {
                        title: `${property.type} for ${property.rent_or_sale}`,
                        text: `Check out this ${property.type} in ${property.municipality}, ${property.state} - $${property.price}`,
                        url: shareUrl,
                      };

                      try {
                        if (navigator.share) {
                          await navigator.share(shareData);
                        } else {
                          await navigator.clipboard.writeText(shareUrl);
                          alert("Link copied to clipboard!");
                        }
                      } catch (error) {
                        console.error("Error sharing:", error);
                      }
                    }}
                    className="bg-white bg-opacity-60 rounded-full p-2 w-fit h-fit shadow-md flex items-center hover:bg-opacity-100 transition-all"
                  >
                    <Share2 color="black" size={32} />
                  </button>

                  <div className="bg-white bg-opacity-60 rounded-full p-2 w-fit h-fit shadow-md flex items-center">
                    <button
                      onClick={() => {
                        if (user) {
                          setLiked((prev) => {
                            const newLiked = !prev;
                            if (newLiked) {
                              storeFavorites(property.id);
                            } else {
                              removeFromFavorites(property.id);
                            }
                            return newLiked;
                          });
                        } else if (setAuthForms) {
                          setAuthForms(true);
                        }
                      }}
                      className="inline-flex"
                    >
                      <Heart
                        color={liked ? "red" : "black"}
                        size={32}
                        fill={liked ? "red" : "none"}
                        className="transition-all duration-200 ease-in-out"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row-reverse lg:hidden">
                <button
                  onClick={() => {
                    setSelectedImage(mainPhotoUrl);
                    setShowGallery(true);
                  }}
                  className="bg-white bg-opacity-75 rounded p-1 w-fit shadow-md flex gap-1 hover:bg-opacity-100 transition-all"
                >
                  <Image color="black" size={32} />
                  <p className="font-bold">
                    {[property.photo1, property.photo2, property.photo3].filter(Boolean).length}
                  </p>
                </button>
              </div>
            </div>

            <div className="hidden w-[20vw] lg:flex lg:flex-col gap-2">
              <div
                className="h-[50%] rounded-r bg-cover bg-center cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  backgroundImage: `url(${secondPhotoUrl})`,
                }}
                onClick={() => {
                  setSelectedImage(secondPhotoUrl);
                  setShowGallery(true);
                }}
              ></div>
              <div
                className="h-[50%] rounded-r bg-cover bg-center flex flex-col-reverse p-2 cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  backgroundImage: `url(${thirdPhotoUrl})`,
                }}
                onClick={() => {
                  setSelectedImage(thirdPhotoUrl);
                  setShowGallery(true);
                }}
              >
                <div className="w-full flex flex-row-reverse">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(mainPhotoUrl);
                      setShowGallery(true);
                    }}
                    className="bg-white bg-opacity-75 rounded p-1 w-fit shadow-md flex gap-1 hover:bg-opacity-100 transition-all"
                  >
                    <Image color="black" size={32} />
                    <p className="font-bold">
                      {[property.photo1, property.photo2, property.photo3].filter(Boolean).length}
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <p className="font-bold text-3xl text-slate-900 dark:text-slate-100">
                {property.type.charAt(0).toUpperCase() + property.type.slice(1)}{" "}
                for {property.rent_or_sale}
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                {" "}
                {property.exact_address.charAt(0).toUpperCase() +
                  property.exact_address.slice(1)}
                ,{" "}
                {property.municipality.charAt(0).toUpperCase() +
                  property.municipality.slice(1)}
                ,{" "}
                {property.state.charAt(0).toUpperCase() +
                  property.state.slice(1)}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-slate-800 dark:text-slate-200">
                <Phone className="text-green-500" />
                <p className="font-medium">{phoneNumber}</p>
                {canCopyPhone && (
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="inline-flex items-center gap-1 rounded border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Copy size={14} />
                    {copyStatus === "copied" ? "Copied" : "Copy"}
                  </button>
                )}
                {copyStatus === "error" && (
                  <span className="text-xs text-red-600 dark:text-red-400">
                    Copy failed
                  </span>
                )}
              </div>
            </div>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {"$" + property.price}
            </p>
          </div>
          <div className="flex flex-row gap-3 md:gap-6 ">
            <div className="flex gap-1 ">
              {property.number_rooms} rooms{" "}
              <Bed className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex gap-1">
              {property.floor} floors
              <Layers className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex gap-1">
              {property.space} m²
              <Expand className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div>
            <p className="font-bold text-xl">Facts & features</p>
            <div className="grid gap-4 lg:grid-cols-3 grid-cols-2">
              {property.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className=" text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold text-xl">Description</p>
            <p>{property.description}</p>
          </div>
        </>
      )}
    </section>
  );
}
