import React from "react";
import { FaXTwitter, FaGithub, FaInstagram, FaYoutube } from "react-icons/fa6";

const Footer: React.FC = () => {
    
  return (
      <footer className="bg-gray-800 py-12 text-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
          <div>
            <h4 className="text-lg font-bold">Himawari Project</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="/software" className="hover:underline">ソフトウェア開発</a></li>
              <li><a href="/video" className="hover:underline">映像制作</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold">プロダクト</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="https://aimensetsu.pages.dev/" className="hover:underline">AI面接コーチ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold">利用規約</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:underline">プライバシーポリシー</a></li>
              <li><a href="#" className="hover:underline">ライセンス</a></li>
              <li><a href="#" className="hover:underline">プロジェクトポリシー</a></li>
            </ul>
          </div>
        </div>
        {/* SNS Links */}
        <div className="mt-8 flex justify-center space-x-6 text-2xl">
          <a href="#" className="hover:text-gray-400" aria-label="X">
            <FaXTwitter />
          </a>
          <a href="#" className="hover:text-gray-400" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="#" className="hover:text-gray-400" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-gray-400" aria-label="YouTube">
            <FaYoutube />
          </a>
          <a href="https://qiita.com/at_himawari" className="hover:text-gray-400" aria-label="Qiita">
  <img src="/qiita-icon.png" width="25px" height="25px"/>
</a>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          © 2024 Himawari Project
        </div>
      </footer>
  );
};

export default Footer;

