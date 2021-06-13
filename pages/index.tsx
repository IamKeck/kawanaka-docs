import Link from "next/link";
import Layout from "../components/Layout";
import Articles, { Article } from "../articles";
import { GetStaticProps } from "next";

type Props = {
  articles: Article[];
};
const IndexPage = (props: Props) => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <h2>記事一覧</h2>
      <ul>
        {props.articles.map((article) => (
          <li key={article.filename}>
            <Link href={`/articles/${article.filename}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </p>
  </Layout>
);

export default IndexPage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  return { props: { articles: Articles } };
};
