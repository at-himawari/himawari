import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { HelmetProvider } from "react-helmet-async";

const Home = React.lazy(() => import("./Home"));
const VideoProduction = React.lazy(() => import("./VideoProduction"));
const SoftwareDevelopment = React.lazy(() => import("./SoftwareDevelopment"));
const PrivacyPolicy = React.lazy(() => import("./PrivacyPolicy"));
const ProjectPolicy = React.lazy(() => import("./ProjectPolicy"));
const License = React.lazy(() => import("./License"));
const Youtube = React.lazy(() => import("./YouTube"));

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video" element={<VideoProduction />} />
            <Route path="/software" element={<SoftwareDevelopment />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/project" element={<ProjectPolicy />} />
            <Route path="/license" element={<License />} />
            <Route path="/youtube" element={<Youtube />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
};

export default App;
