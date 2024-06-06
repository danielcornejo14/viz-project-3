import { Inter } from "next/font/google";
import DiseasesSimulation from "./components/DiseasesSimulations";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <DiseasesSimulation></DiseasesSimulation>
    </div>
  );
}
