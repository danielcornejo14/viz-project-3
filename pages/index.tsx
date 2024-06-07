import { Inter } from "next/font/google";
import DiseasesSimulation from "./components/DiseasesSimulations";
import EurosisSimulation from "./components/EurosisSimulation";
import SchoolSimulation from "./components/SchoolSimulation";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <DiseasesSimulation></DiseasesSimulation>
      <EurosisSimulation></EurosisSimulation>
      <SchoolSimulation></SchoolSimulation>
    </div>
  );
}
