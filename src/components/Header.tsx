import React from "react";

const Header: React.FC = () => {
  return (
    <a href="/">
      <header className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <img
              src="/himawari.png"
              alt="Himawari Project Logo"
              className="h-8 mr-3"
              loading="lazy"
            />
            <h1 className="text-2xl">
              <span className="font-bold text-orange-500">H</span>
              <span className="text-gray-500">imawari</span>{" "}
              <span className="font-bold text-orange-500">P</span>
              <span className="text-gray-500">roject</span>
            </h1>
          </div>
        </div>
      </header>
    </a>
  );
};

export default Header;
