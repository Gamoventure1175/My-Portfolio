import Hero from "@/components/sections/Hero";
import NamePanel from "@/components/ui/NamePanel";
import NavBar from "@/components/ui/NavBar";
import ExperienceSection from "@/components/sections/ExperienceSection";

export default function Home() {
  return (
    <main className="">
      <NavBar />
      <NamePanel />
      <Hero />
      <ExperienceSection />
    </main>

  );
}
