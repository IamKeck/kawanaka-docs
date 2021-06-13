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
];

export default articles;
