import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import HomeSection from "./section/HomeSection";
import AboutSection from "./section/AboutSection";
import OfficialTalentSection from "./section/OfficialTalentSection";
import CreatorPlusSection from "./section/CreatorPlusSection";
import ServiceSection from "./section/ServiceSection";
import PricelistSection from "./section/PricelistSection";
import ActivitySection from "./section/ActivitySection";
import TestimonySection from "./section/TestimonySection";
import ContactSection from "./section/ContactSection";
import CreatorSection from "./section/CreatorSection";
import LoadingScreen from "./section/LoadingScreen";

import logoHainick from "../../storage/logo/logo512.png";

const LandingPage = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Jika semua resource sudah selesai load sebelum komponen mount
    if (document.readyState === "complete") {
      setTimeout(() => setReady(true), 600);
    } else {
      const handler = () => setTimeout(() => setReady(true), 600);
      window.addEventListener("load", handler);
      return () => window.removeEventListener("load", handler);
    }
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        color: "#0a0a0a",
      }}
    >
      {/* Loading screen — fade out otomatis setelah semua resource siap */}
      <LoadingScreen visible={!ready} logo={logoHainick} />

      <Header />
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0px",
        }}
      >
        <HomeSection />
        <AboutSection />
        <OfficialTalentSection />
        <CreatorPlusSection />
        <CreatorSection />
        <ServiceSection />
        <PricelistSection />
        <ActivitySection />
        <TestimonySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
