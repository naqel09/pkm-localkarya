import Carousel from "./components/hero/Carousel";
import Kebutuhan from "./components/kebutuhan/Kebutuhan";
import Newsletter from "./components/newsletter/Newsletter";
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
