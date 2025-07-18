import React, { memo } from "react";
import twemoji from "@twemoji/api";

type TwemojiProps = {
  emoji: string;
};

const Twemoji: React.FC<TwemojiProps> = ({ emoji = null }) => {
  const randomEmoji = emoji || getRandomEmoji();
  const html = twemoji.parse(randomEmoji, {
    folder: "svg",
    ext: ".svg",
    className: "emoji mx-auto w-12 mt-2 mb-4",
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

// randomで絵文字を出す関数
const getRandomEmoji = (): string => {
  const emojis = [
    "😀",
    "😂",
    "😍",
    "🥳",
    "🤔",
    "😎",
    "🤖",
    "👻",
    "💻",
    "🎉",
    "🚀",
    "🌟",
    "🍕",
    "🍣",
    "🏆",
    "🎨",
    "🎶",
    "📚",
    "🧩",
    "🧸",
  ];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

export default memo(Twemoji);
