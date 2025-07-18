import React, { useState, useEffect } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsSection from "./components/NewsSection";
import { Helmet } from "react-helmet-async";

interface Slide {
  image: string;
  title: string;
  text: string;
  link: string;
}

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    fetch("/content/slides.json")
      .then((res) => res.json())
      .then((data) => setSlides(data.slides));
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="font-sans overflow-x-hidden">
      <Helmet>
        <title>Himawari Project</title>
        <meta property="og:title" content="Himawari Project" />
        <meta
          property="og:description"
          content="映像とITの融合領域にチャレンジするプロジェクト"
        />
        <meta
          property="og:image"
          content="https://at-himawari.com/avatar.png"
        />
        <meta property="og:url" content="https://at-himawari.com/" />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Header */}
      <Header />
      {/* Hero Section - Slideshow */}
      <section id="software" className="relative h-96 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative container mx-auto h-full flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8">
              <h2 className="text-white text-3xl font-bold">{slide.title}</h2>
              <p className="text-white mt-2">{slide.text}</p>
              <Link
                to={slides[currentSlide].link}
                className="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
              >
                詳しく見る
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* News Section */}
      <NewsSection />

      {/* Profile Section */}
      <section id="profile" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-800">プロフィール</h3>
          <div className="mt-6 flex items-center">
            <img
              src="/avatar.jpg"
              alt="Avatar"
              className="h-16 w-16 rounded-full mr-4"
              loading="lazy"
            />
            <div>
              <p className="text-gray-600">羽ばたくエンジニア</p>
              <p className="mt-2 text-gray-500 flex items-center">
                <FaXTwitter className="mr-2" /> @at_himawari
              </p>
              <p className="mt-2 text-gray-600">
                北海道出身のITコンサルタント。2022年某総合大学卒。クラウドを得意とし基板設計や開発環境整備等の職務に従事してきた。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
