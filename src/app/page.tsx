import HeroCarousel from "./components/HeroCarousel";
import Navbar from "./components/Navbar";
import PilihKami from "./components/PilihKami";
import PopularDestinasi from "./components/PopularDestinasi";
import SpecialPackages from "./components/SpecialPackages";


export default function Home() {
  return (
    <>
      <Navbar />
      <HeroCarousel />
      <PopularDestinasi />
      <PilihKami />
      <SpecialPackages />
    </>
  );
}
