import { Outlet } from "react-router-dom";
import Footer from "../Pages/Home/Footer_section";
import Navbar from "../Pages/Home/NavBar"; // Replace with your actual navbar component

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
