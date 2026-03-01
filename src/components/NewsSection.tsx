import React, { useState } from "react";

export interface NewsItem {
  title: string;
  date: string;
  content: string;
  link?: string;
}
interface NewsSectionProps {
  newsItems: NewsItem[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ newsItems = [] }) => {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  if (!newsItems || newsItems.length === 0) {
    return (
      <section id="news" className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-800">ニュース</h3>
          <p className="mt-6 text-gray-500">現在、お知らせはありません。</p>
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
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          {" "}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            ニュース
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            最新情報をご紹介します
          </p>
          <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {displayedItems.map((item: NewsItem, index: number) => {
              const listContent = (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <span className="text-gray-500 text-sm sm:text-base whitespace-nowrap">
                    {item.date}
                  </span>
                  <span className="text-orange-500 font-semibold text-sm sm:text-base">
                    {item.title}
                  </span>
                  <span className="text-gray-700 text-sm sm:text-base flex-1">
                    {item.content}
                  </span>
                </div>
              );

              if (item.link) {
                return (
                  <li key={index}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      {listContent}
                    </a>
                  </li>
                );
              }

              return (
                <li key={index} className="px-4 sm:px-6 py-4">
                  {listContent}
                </li>
              );
            })}
          </ul>
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
