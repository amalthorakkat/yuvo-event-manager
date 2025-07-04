import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLayouts from "./layouts/UserLayouts";
import Home from "./components/home/Home";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserLayouts />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
