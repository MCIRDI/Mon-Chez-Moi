import "./Home.css";
import { Search } from "lucide-react";
export default function Home() {
  return (
    <>
      <section>
        <div className=" bg-[url('/images/MonChezMoi01.jpg')] bg-cover h-[70vh] w-screen flex flex-col justify-center gap-5 pl-10">
          <p className="text-white font-bold text-4xl drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] ">
            The easiest way to
          </p>
          <p className="text-white font-bold text-4xl drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
            find your next address
          </p>
          <div className=" bg-white flex items-center rounded-2xl shadow-lg p-3 w-[80vw] md:w-[600px] ">
            <Search className="text-slate-800" />
            <input
              type="text"
              placeholder="Enter address, neighborhood, city"
              className="ml-2 w-full border-none outline-none bg-transparent placeholder-slate-800"
            />
          </div>
        </div>
      </section>
      <section className="px-4 md:px-24 pt-16 flex flex-col items-center">
        <p className="font-bold text-3xl text-center  text-gray-800">
          Explore homes on MonChezMoi
        </p>
        <p className="py-6 text-center text-gray-800">
          Take a deep dive and browse homes for sale or rent, original
          neighborhood photos, resident reviews and local insights to find what
          is right for you.
        </p>
      </section>
      <section className="flex flex-row overflow-x-auto  scrollbar-hide ">
        <div className="state-card ml-[2vh] h-[50vh]   min-h-[310px] bg-[url('/images/image05.jpg')] bg-cover">
          <p>Atlanta</p>
          <a>
            View Homes <span className="text-xl">&gt;</span>
          </a>
        </div>
        <div className="ml-[2vh]">
          <div className="state-card mb-[2vh] h-[24vh]  min-h-[150px] bg-[url('/images/image01.jpg')] bg-cover">
            <p>Boston</p>
            <a>
              View Homes <span className="text-xl">&gt;</span>
            </a>
          </div>
          <div className="state-card h-[24vh]  min-h-[150px] bg-[url('/images/image02.jpg')] bg-cover">
            <p>Philadelphia</p>
            <a>
              View Homes <span className="text-xl">&gt;</span>
            </a>
          </div>
        </div>
        <div className="ml-[2vh]">
          <div className="state-card mb-[2vh] h-[24vh]  min-h-[150px] bg-[url('/images/image04.jpg')] bg-cover">
            <p>New York</p>
            <a>
              View Homes <span className="text-xl">&gt;</span>
            </a>
          </div>
          <div className="state-card h-[24vh]  min-h-[150px] bg-[url('/images/image03.jpg')] bg-cover">
            <p>Florida </p>
            <a>
              View Homes <span className="text-xl">&gt;</span>
            </a>
          </div>
        </div>
        <div className="state-card ml-[2vh] h-[50vh]   min-h-[310px] bg-[url('/images/image03.jpg')] bg-cover">
          <p>California</p>
          <a>
            View Homes <span className="text-xl">&gt;</span>
          </a>
        </div>
        <div className="ml-[2vh]">
          <div className="state-card mb-[2vh] h-[24vh]  min-h-[150px]">
            <p>Texas </p>
            <a>
              View Homes <span className="text-xl">&gt;</span>
            </a>
          </div>
          <div className="state-card h-[24vh]  min-h-[150px]">
            <p>Nevada </p>
            <a>
              View Homes <span className="text-xl">&gt;</span>
            </a>
          </div>
        </div>
        <div className="ml-[2vh]">
          <div className="state-card mb-[2vh] h-[24vh]  min-h-[150px]">
            <p>Illinois</p>
            <a>
              View Homes <span className="text-xl">&gt;</span>
            </a>
          </div>
          <div className="state-card h-[24vh]  min-h-[150px]">
            <p>Massachusetts </p>
            <a>
              View Homes <span className="text-xl">&gt;</span>
            </a>
          </div>
        </div>
        <div className="state-card ml-[2vh] h-[50vh]   min-h-[310px] ">
          <p>Washington</p>
          <a>
            View Homes <span className="text-xl">&gt;</span>
          </a>
        </div>
        <div className="ml-[2vh]">
          <div className="state-card mb-[2vh] h-[24vh]  min-h-[150px]">
            <p>Arizona</p>
            <a>
              View Homes <span className="text-xl">&gt;</span>
            </a>
          </div>
          <div className="state-card h-[24vh]  min-h-[150px]">
            <p>Pennsylvania </p>
            <a>
              View Homes <span className="text-xl">&gt;</span>
            </a>
          </div>
        </div>
        <div className="ml-[2vh]">
          <div className="state-card mb-[2vh] h-[24vh]  min-h-[150px]">
            <p>Colorado</p>
            <a>
              View Homes <span className="text-xl">&gt;</span>
            </a>
          </div>
          <div className="state-card h-[24vh]  min-h-[150px]">
            <p>Hawaii</p>
            <a>
              View Homes <span className="text-xl">&gt;</span>
            </a>
          </div>
        </div>
      </section>
      <section className="px-24 py-9 gap-6 flex flex-col lg:flex-row  justify-center items-center">
        <div className="relative card bg-[#66BB6A]     group">
          <h1>Buy</h1>
          <p>
            Explore a wide range of properties tailored to your needs. From cozy
            apartments to luxurious villas, your perfect home is just a click
            away.
          </p>
          <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black text-center py-2 ">
            View Properties &gt;
          </div>
        </div>

        <div className="relative card bg-black text-white  group">
          <h1>Rent</h1>
          <p>
            Discover budget-friendly rental options in prime locations. Flexible
            lease terms to suit your lifestyle.
          </p>
          <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center py-2 ">
            View Properties &gt;
          </div>
        </div>

        <div className="relative card bg-[#CE93D8]   group">
          <h1>My Properties</h1>
          <p>
            Get the best value for your property with our expert guidance. List
            your Properties today and reach thousands of potential buyers and
            tenants.
          </p>
          <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black text-center py-2 ">
            View Properties &gt;
          </div>
        </div>
      </section>
    </>
  );
}
