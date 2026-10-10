import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import About from "../../components/About/About";
import Classes from "../../components/Classes/Classes";
import WhyChoose from "../../components/WhyChoose/WhyChoose";
import Teachers from "../../components/Teachers/Teachers";
import Testimonials from "../../components/Testimonials/Testimonials";
import Contact from "../../components/Contact/Contact";
function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Classes />
      <WhyChoose />
      <Teachers />
      <Testimonials />
      <Contact />
    </>
  );
}

export default Home;