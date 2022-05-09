import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
function App() {
  return (
    <div className="App">
      <Header />
      <div className="container container-fluid">
        <Routes>
          <Route path="/" element={<Home />} exact></Route>
          <Route path="/product/:id" element={<ProductDetails />} exact></Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
