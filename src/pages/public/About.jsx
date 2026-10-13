import React from "react";
import AboutBanner from "../../components/about/AboutBanner";
import AboutHistory from "../../components/about/AboutHistory";
import AboutMissionVision from "../../components/about/AboutMissionVision";
import SchoolFacilities from "../../components/about/SchoolFacilities";
import SEO from "../../components/common/SEO";

const About = () => {
  return (
    <>
      <SEO
        title="About Us - Our History, Mission & Vision"
        description="Learn about Amazing Grace Academy's rich history since 2002, our mission, vision, core values, and commitment to academic excellence and moral integrity."
        keywords="about Marian Foundation Academy, school history Oraukwu, Catholic school mission, school vision and values"
        url="/about"
        tags={["history", "mission", "vision", "values", "Catholic education"]}
      />
      <AboutBanner />
      <AboutHistory />
      <AboutMissionVision />
      <SchoolFacilities />
    </>
  );
};

export default About;
