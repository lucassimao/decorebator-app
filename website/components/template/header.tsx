import Link from 'next/link'

export default function Header() {
    return <header className="header">

        <div className="branding">

            <div className="container position-relative">

                <nav className="navbar navbar-expand-lg" >
                    <h1 className="site-logo">
                        <Link href="/">
                            <a className="navbar-brand" >
                                {/* <img className="logo-icon" src="/images/logo-icon.svg" alt="logo" /> */}
                                <span className="logo-text">Decorebator <span className="alt rounded">Beta</span></span></a>
                        </Link>
                    </h1>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse p-1 p-lg-0" id="navigation">
                        <ul className="navbar-nav ml-lg-auto">
                            <li className="nav-item active mr-lg-4">
                                <Link href='/'><span className="nav-link" >Home <span className="sr-only">(current)</span></span></Link>
                            </li>
                            <li className="nav-item mr-lg-4">
                                <Link href='features'><span className="nav-link">Features</span></Link>
                            </li>
                            <li className="nav-item mr-lg-4">
                                <Link href='pricing'><span className="nav-link">Pricing</span></Link>
                            </li>
                            <li className="nav-item mr-lg-4">
                                <Link href='about'><span className="nav-link" >About</span></Link>
                            </li>
                            <li className="nav-item mr-lg-4">
                                <Link href='contact'><span className="nav-link" >Contact</span></Link>
                            </li>

                            <li className="nav-item mr-0">
                                <Link href='signup'><span className="nav-link" >Sign Up</span></Link>
                            </li>

                        </ul>
                    </div>
                </nav>

                <ul className="social-list list-inline mb-0 position-absolute d-none">
                    <li className="list-inline-item"><a className="text-dark" href="#"><i className="fab fa-twitter fa-fw" /></a></li>
                    <li className="list-inline-item"><a className="text-dark" href="#"><i className="fab fa-facebook-f fa-fw" /></a></li>
                    <li className="list-inline-item"><a className="text-dark" href="#"><i className="fab fa-instagram fa-fw" /></a></li>
                    <li className="list-inline-item"><a className="text-dark" href="#"><i className="fab fa-youtube fa-fw" /></a></li>
                </ul>

            </div>

        </div>


    </header>
}