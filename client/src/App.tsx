import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home/Home";
import Search from "./Pages/Search";
import Property from "./Pages/Property";
import PropertyForm from "./Pages/AddProperty";
import MyProperties from "./Pages/MyProperies";
import Favorites from "./Pages/Favorites";
import AuthPageMobile from "./Pages/Auth/AuthPageMobile";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
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
          <Route path="ForgotPassword" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
