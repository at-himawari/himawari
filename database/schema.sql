CREATE DATABASE IF NOT EXISTS himawari_cms;
USE himawari_cms;

CREATE TABLE news_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO news_items (title, date, content) VALUES
('Webページリリース', '2025.1.26', 'プロダクト1期に、「Youtube」を追加しました。'),
('YouTube', '2025.1.18', '北海道大学総合博物館飛来してきました。https://youtu.be/BcSbeY-UHYY?si=40hMQSsTRoOlupgX'),
('お知らせ', '2025.1.11', '当サイトのソースコードを公開しました。https://github.com/at-himawari/himawari');

INSERT INTO videos (title, description, video_url) VALUES
('羽田空港 ANA 777-300ER 搭乗記', 'ANA国際線ビジネスクラスの搭乗体験をお届けします', 'https://youtu.be/BcSbeY-UHYY?si=40hMQSsTRoOlupgX'),
('成田空港 JAL 787-9 離陸シーン', 'JALの最新鋭機787-9の美しい離陸シーンです', 'https://youtu.be/example2'),
('関西空港 夜景フライト', '関西空港の美しい夜景を空から撮影しました', 'https://youtu.be/example3');
