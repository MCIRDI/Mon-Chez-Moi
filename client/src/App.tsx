import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home/Home";
import Search from "./Pages/Search/Search";
import Property from "./Pages/Search/Property";
import PropertyForm from "./AddProperty/AddProperty";
import MyProperties from "./AddProperty/MyProperies";
import Favorites from "./Pages/Favorites/Favorites";
import AuthPageMobile from "./Pages/Auth/AuthPageMobile";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Search/:filterFromParameter?" element={<Search />} />
          <Route path="search/property/:id" element={<Property />} />
          <Route path="Myproperties" element={<MyProperties />} />
          <Route path="AddProperty/:id?" element={<PropertyForm />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="AuthPageMobile" element={<AuthPageMobile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
