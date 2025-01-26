import React, { useState } from "react";
import { newsItems, NewsItem } from "../data/newsData";

const NewsSection: React.FC = () => {
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

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
          {displayedItems.map((item: NewsItem, index: number) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <p className="text-orange-500 font-bold">{item.title}</p>
              <p className="text-gray-700 mt-2">{item.date}</p>
              <p className="mt-4 text-gray-600">{item.content}</p>
            </div>
          ))}
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
