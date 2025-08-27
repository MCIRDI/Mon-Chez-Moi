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
  MoreVertical,
} from "lucide-react";
import {
  deleteProperty,
  fatchPropertyById,
  removeFromFavorites,
  storeFavorites,
} from "@/Services/PropetyService";

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
    // add any other fields your property object has
  };

  const [property, setProperty] = useState<PropertyType | null>(null);
  const [liked, setLiked] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

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
        setProperty(result);
      };
      fetchProperty();
    }
  }, [property, id]);
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
        <div className="text-center py-10 text-gray-500">
          Loading property...
        </div>
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
                    <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100">
                      Share
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="  flex flex-row justify-center gap-2 h-[60vh] ">
            <div className="w-[96vw] md:w-[90vw] lg:w-[60vw] bg-[url('/images/MonChezMoi01.jpg')] bg-cover rounded flex flex-col justify-between p-2">
              <div className="flex flex-row justify-between">
                <p className="bg-white h-fit bg-opacity-75 p-[5px] w-fit text-black font-bold text-sm  rounded">
                  2 days ago
                </p>
                <div className="flex gap-4">
                  <div className="bg-white bg-opacity-60 rounded-full p-2 w-fit h-fit shadow-md flex items-center ">
                    <Share2 color="black" size={32} />
                  </div>

                  <div className="bg-white bg-opacity-60 rounded-full p-2 w-fit h-fit shadow-md flex items-center ">
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
                <div className="bg-white bg-opacity-75 rounded p-1 w-fit shadow-md flex gap-1">
                  <Image color="black" size={32} />
                  <p className="font-bold">23</p>
                </div>
              </div>
            </div>

            <div className="hidden   w-[20vw] lg:flex lg:flex-col gap-2">
              <div className="h-[50%] rounded-r bg-[url('/images/MonChezMoi01.jpg')] bg-cover"></div>
              <div className="h-[50%] rounded-r bg-[url('/images/MonChezMoi01.jpg')] bg-cover flex flex-col-reverse p-2">
                <div className="w-full flex flex-row-reverse ">
                  <div className="bg-white bg-opacity-75 rounded p-1 w-fit shadow-md flex gap-1">
                    <Image color="black" size={32} />
                    <p className="font-bold">23</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <p className="font-bold text-3xl text-gray-800">
                {property.type.charAt(0).toUpperCase() + property.type.slice(1)}{" "}
                for {property.rent_or_sale}
              </p>
              <p>
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
              <div className="flex gap-2 items-center">
                <Phone className=" text-green-500" /> <p>06751505</p>
              </div>
            </div>
            <p className="text-green-900 text-2xl font-bold">
              {"$" + property.price}
            </p>
          </div>
          <div className="flex flex-row gap-3 md:gap-6 ">
            <div className="flex gap-1 ">
              {property.number_rooms} beds{" "}
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
