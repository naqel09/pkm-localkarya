import Carousel from "../../components/users/pages/Home/Carousel";
import Kebutuhan from "../../components/users/pages/Home/Kebutuhan";
import PilihKami from "../../components/users/pages/Home/PilihKami";
import PopularDestinasi from "../../components/users/pages/Home/PopularDestinasi/PopularDestinasi";
import QualitySection from "../../components/users/pages/Home/QualitySection";
import SpecialPackages from "../../components/users/pages/Home/SpecialPackages";
import Testimonials from "../../components/users/pages/Home/Testimonials";

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
