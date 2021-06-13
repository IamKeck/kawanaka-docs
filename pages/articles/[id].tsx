import { GetStaticProps, GetStaticPaths } from "next";
import articles from "../../articles";
import Article from "../../components/Article";
import Layout from "../../components/Layout";
import fs from "fs";

type Props = { md: string; type: "ok"; title: string } | { type: "err" };

const ArticleComponent = (props: Props) => {
  if (props.type === "err") {
    return (
      <Layout title="error">
        <div />
      </Layout>
    );
  } else {
    return (
      <Layout title={props.title}>
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

export const getStaticProps: GetStaticProps<Props, Param> = async ({
  params,
}) => {
  if (params === undefined) {
    return { props: { type: "err" } };
  } else {
    const filename = params.id + ".md";
    const data = await fs.promises.readFile(`articles/${filename}`, "utf-8");
    const title = articles.find(
      (article) => article.filename === params.id
    ).title;
    return { props: { type: "ok", md: data, title: title } };
  }
};
