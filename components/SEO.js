import Head from "next/head";

const SEO = ({ pageTitle, pageDescription }) => (
    <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <script src="https://kit.fontawesome.com/79e484b493.js" crossorigin="anonymous"></script>
    </Head>
);

export default SEO;