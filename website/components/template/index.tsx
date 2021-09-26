import Head from 'next/head'
import Footer from './footer'
import Header from './header'

type TemplateProps = {
    children: React.ReactNode;
    fullWindow: boolean;
}

export default function Template(props: TemplateProps) {
    return <>
        <Head>
            <title>Decorebator</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="description" content="Decorebator app" />

            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="Decorebator app" />
            <meta name="author" content="Lucas Simão" />

            {/* Google Font */}
            <link href="https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700|Nunito:400,600,700" rel="stylesheet" />

            {/* FontAwesome JS */}
            <script defer src="/fontawesome/js/all.js"></script>

            {/*  Plugins CSS  */}
            <link rel="stylesheet" href="/plugins/jquery-flipster/dist/jquery.flipster.min.css" />


            {/*Theme CSS - comes from /styles/global.css */}
            {/* <link id="theme-style" rel="stylesheet" href="/assets/css/theme.css" /> */}


        </Head>
        {!props.fullWindow && <Header />}

        {props.children}

        {!props.fullWindow && <Footer />}

    </>
}