// import React from "react";
// // import axios from "axios";
// // import api from "./Services/api";
// import { fatchPropertyById } from "./Services/PropetyService";

// export default function App() {
//   // async function fetchData() {
//   //   try {
//   //     const response = await api.get("/properties/5");

//   //     // axios.get(
//   //     //   "http://127.0.0.1:8000/api/properties/5"
//   //     // );
//   //     console.log(response.data); // axios automatically parses JSON
//   //   } catch (error) {
//   //     console.error("Error fetching data:", error);
//   //   }
//   // }
//   const data = fatchPropertyById(4);
//   console.log(data);

//   return <div>App</div>;
// }

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Home from "./Pages/Home/Home";
import Search from "./Pages/Search/Search";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Search" element={<Search />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
