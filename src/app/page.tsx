import Carousel from "./components/Carousel";
import Kebutuhan from "./components/Kebutuhan";
import Newsletter from "./components/Newsletter";
import PilihKami from "./components/PilihKami";
import PopularDestinasi from "./components/populardestinasi/PopularDestinasi";
import QualitySection from "./components/QualitySection";
import SpecialPackages from "./components/SpecialPackages";
import Testimonials from "./components/Testimonials";


export default function Home() {
  return (
    <>
      <Carousel />
      <PopularDestinasi />
      <PilihKami />
      <SpecialPackages />
      <QualitySection />
      <Testimonials />
      <Kebutuhan />
      <Newsletter />
    </>
  );
}
