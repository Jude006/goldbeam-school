import React from "react";
import ContactSection from "../../components/contact/ContactSection";
import Map from "../../components/contact/Map";
import SEO from "../../components/common/SEO";

const Contact = () => {
  return (
    <>
      <SEO
        title="Contact Us - Get in Touch with Marian Foundation Academy"
        description="Contact Amazing Grace Academy in Oraukwu, Anambra State. Call 08140728109 or email mfacademyschool@gmail.com for inquiries about admissions and school programs."
        keywords="contact Marian Foundation Academy, school phone number, school address Oraukwu, school email"
        url="/contact"
        tags={["contact", "phone", "email", "address", "location"]}
      />
      <ContactSection />
      <Map />
    </>
  );
};

export default Contact;
