import { useState, useEffect } from "react";
import { FaXTwitter } from "react-icons/fa6";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NewsSection from "../../components/NewsSection";
import slidesData from "../../content/slides.json"; // JSONを直接インポート

interface Slide {
  image: string;
  title: string;
  text: string;
  link: string;
}
export default function Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides: Slide[] = slidesData.slides;

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
      <Header />
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
              <a
                href={slides[currentSlide].link}
                className="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
              >
                詳しく見る
              </a>
            </div>
          </div>
        ))}
      </section>
      <NewsSection />
      <section id="profile" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-800">プロフィール</h3>
          <div className="mt-6 flex items-start">
            <img
              src="https://dq7c5b6uxkdk2.cloudfront.net/posts/images/avatar.jpg"
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
                2022年理工学部情報系学科卒。新卒でITコンサルティング会社に入社する。
              </p>
              <p className="mt-2 text-gray-600">
                VueやReactなどのフロントエンド技術の他に、PythonやJavaなどのバックエンド技術も扱う。
              </p>
              <p className="mt-2 text-gray-600">
                本プロジェクトでは、AWS,GCP,Azure,などを使ったプロダクトやVikeとさくらのインターネットを使ったホームページの開発を行っている。
              </p>
              <p className="mt-2 text-gray-600">
                サカナクションと同じ北海道出身で、NF Member。
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
