import HeroCarousel from "./components/HeroCarousel";
import Navbar from "./components/Navbar";
import PopularDestinasi from "./components/PopularDestinasi";


export default function Home() {
  return (
    <>
      <Navbar />
      <HeroCarousel />
      <PopularDestinasi />
    </>
  );
}
