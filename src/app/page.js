import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Dashboard from "./dashboard";
import Layout from "../../components/Layout";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Layout />

      {/* Footer sticks to bottom */}
      <Footer />
    </div>
  );
}
