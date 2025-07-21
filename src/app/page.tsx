import Footer from "./components/Footer";
import HeroCarousel from "./components/HeroCarousel";
import Kebutuhan from "./components/Kebutuhan";
import Navbar from "./components/Navbar";
import Newsletter from "./components/Newsletter";
import PilihKami from "./components/PilihKami";
import PopularDestinasi from "./components/PopularDestinasi";
import QualitySection from "./components/QualitySection";
import SpecialPackages from "./components/SpecialPackages";
import Testimonials from "./components/Testimonials";


export default function Home() {
  return (
    <>
      <Navbar />
      <HeroCarousel />
      <PopularDestinasi />
      <PilihKami />
      <SpecialPackages />
      <QualitySection />
      <Testimonials />
      <Kebutuhan />
      <Newsletter />
      <Footer />
    </>
  );
}
