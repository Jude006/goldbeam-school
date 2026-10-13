import React from "react";
import AboutPreview from "../../components/home/AboutPreview";
import Facilities from "../../components/home/Facilities";
import HighlightSection from "../../components/home/HighlightSection";
import SEO from "../../components/common/SEO";
import ScholarshipSection from "../../components/home/ScholarshipSection";
import HomeBanner from "../../components/home/HomeBanner";

const Home = () => {
  return (
    <>
      <SEO
        title="Welcome to Goldbeam Schools"
        description="Goldbeam Schools in Iroko Town, Ogun State is a leading citadel of learning nurturing academic excellence, discipline, and future leaders since 2005."
        keywords="Goldbeam Schools, Iroko Town school, best school in Ogun State, private school Iroko, nursery primary secondary school Ogun, quality education Nigeria"
        url="/"
        tags={["school", "education", "Goldbeam Schools", "Iroko Town", "Ogun State"]}
      />
      <HomeBanner />
      <AboutPreview />
      <HighlightSection />
      <ScholarshipSection />
      <Facilities />
    </>
  );
};

export default Home;