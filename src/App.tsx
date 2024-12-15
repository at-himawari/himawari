import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import VideoProduction from "./VideoProduction";
import SoftwareDevelopment from "./SoftwareDevelopment";
import PrivacyPolicy from "./PrivacyPolicy";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video" element={<VideoProduction />} />
        <Route path="/software" element={<SoftwareDevelopment />} />
        <Route path="/policy/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
};

export default App;
