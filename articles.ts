export type Article = {
  filename: string;
  title: string;
};

const articles: Article[] = [
  {
    filename: "typescript",
    title: "TypeScriptの型定義について",
  },
  {
    filename: "react_immutable",
    title: "Reactではオブジェクトを変更してはいけない",
  },
  {
    filename: "how_to_use_reducer",
    title: "useReducerの簡単な使い方",
  },
];

export default articles;
