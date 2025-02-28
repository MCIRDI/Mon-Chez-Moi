import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header className="py-5 px-2 border-b-[1px] border-gray-300 hidden md:block">
        <nav className="flex flex-row justify-evenly">
          <div className="w-2/5 flex flex-row justify-center ">
            <Link
              to="/"
              className="text-sm lg:text-base hover:text-blue-500 mr-7"
            >
              Sell
            </Link>
            <Link
              to="/"
              className="text-sm lg:text-base hover:text-blue-500 mr-7"
            >
              Buy
            </Link>
            <Link
              to="/"
              className="text-sm lg:text-base hover:text-blue-500 mr-7"
            >
              Rent
            </Link>
          </div>
          <Link to="/" className="text-sm lg:text-base text-blue-500 font-bold">
            MonChezMoi
          </Link>
          <div className="w-2/5 flex flex-row justify-center">
            <Link
              to="/Search"
              className="text-sm lg:text-base hover:text-blue-500 mr-7"
            >
              Search
            </Link>
            <Link
              to="/"
              className="text-sm lg:text-base hover:text-blue-500 mr-7"
            >
              My properities
            </Link>
            <Link
              to="/favorites"
              className="text-sm lg:text-base hover:text-blue-500 mr-7"
            >
              Favorites
            </Link>
            <Link
              to="/signIn"
              className="text-sm lg:text-base hover:text-blue-500"
            >
              Sign IN
            </Link>
          </div>
        </nav>
      </header>
      <main>
        <Outlet></Outlet>
      </main>
    </>
  );
}
