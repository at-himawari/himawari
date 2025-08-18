import React, { useState } from "react";
import newsData from "../content/newsdata.json";

export interface NewsItem {
  title: string;
  date: string;
  content: string;
  link?: string;
}

const NewsSection: React.FC = () => {
  const newsItems: NewsItem[] = newsData.newsItems || [];
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  if (!newsItems || newsItems.length === 0) {
    return (
      <section id="news" className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-800">ニュース</h3>
          <p className="mt-6">ニュースを読み込んでいます...</p>
        </div>
      </section>
    );
  }

  const totalPages = Math.ceil(newsItems.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = newsItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="news" className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-gray-800">ニュース</h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item: NewsItem, index: number) => {
            const cardContent = (
              <>
                <p className="text-orange-500 font-bold">{item.title}</p>
                <p className="text-gray-700 mt-2">{item.date}</p>
                <div className="mt-4 text-gray-600">
                  <p>{item.content}</p>
                </div>
              </>
            );

            if (item.link) {
              return (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white shadow-md rounded-lg p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <div key={index} className="bg-white shadow rounded-lg p-6">
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* ページネーションコントロール */}
        <div className="mt-8 flex justify-center space-x-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`py-2 px-4 rounded ${
                currentPage === index + 1
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
