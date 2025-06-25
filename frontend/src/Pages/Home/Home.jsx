import FeatureSection from "./Feature_Section";
import Footer from "./Footer_section";
import HeroSection from "./Hero_Section";
import HowWorks from "./How_Woerks_Section";
import PricingSection from "./Pricing_section";

const Home=()=>{

    return(
        <>
        <HeroSection/>
        <FeatureSection/>
        <HowWorks/>
        <PricingSection/>
        <Footer/>
        </>
    );
}

export default Home;