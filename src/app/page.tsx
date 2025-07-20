import HeroCarousel from "./components/HeroCarousel";
import Navbar from "./components/Navbar";
import PilihKami from "./components/PilihKami";
import PopularDestinasi from "./components/PopularDestinasi";


export default function Home() {
  return (
    <>
      <Navbar />
      <HeroCarousel />
      <PopularDestinasi />
      <PilihKami />
    </>
  );
}
