import { GetStaticProps, GetStaticPaths } from "next";
import articles from "../../articles";
import Article from "../../components/Article";
import Layout from "../../components/Layout";
import fs from "fs";

type Props = { md: string; type: "ok" } | { type: "err" };

const ArticleComponent = (props: Props) => {
  if (props.type === "err") {
    return (
      <Layout title="error">
        <div />
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Article md={props.md} />
      </Layout>
    );
  }
};

export default ArticleComponent;

type Param = {
  id: string;
};

export const getStaticPaths: GetStaticPaths<Param> = async () => {
  const paths = articles.map((article) => ({
    params: { id: article.filename.replace(/.md$/, "") },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (params === undefined) {
    return { props: { type: "err" } };
  } else {
    const filename = params.id + ".md";
    const data = await fs.promises.readFile(`articles/${filename}`, "utf-8");
    return { props: { type: "ok", md: data } };
  }
};
