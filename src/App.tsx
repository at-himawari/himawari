import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import VideoProduction from "./VideoProduction";
import SoftwareDevelopment from "./SoftwareDevelopment";
import PrivacyPolicy from "./PrivacyPolicy";
import ProjectPolicy from "./ProjectPolicy";
import License from "./License";
import Bcafe from "./Bcafe";
import Youtube from "./YouTube";
import ScrollToTop from "./components/ScrollToTop";

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video" element={<VideoProduction />} />
        <Route path="/software" element={<SoftwareDevelopment />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/project" element={<ProjectPolicy />} />
        <Route path="/license" element={<License />} />
        <Route path="/bcafe" element={<Bcafe />} />
        <Route path="/youtube" element={<Youtube />} />
      </Routes>
    </Router>
  );
};

export default App;
