import Carousel from "../components/pages/Home/Carousel";
import Kebutuhan from "../components/pages/Home/Kebutuhan";
import PilihKami from "../components/pages/Home/PilihKami";
import PopularDestinasi from "../components/pages/Home/PopularDestinasi/PopularDestinasi";
import QualitySection from "../components/pages/Home/QualitySection";
import SpecialPackages from "../components/pages/Home/SpecialPackages";
import Testimonials from "../components/pages/Home/Testimonials";

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
        </>
    );
}
