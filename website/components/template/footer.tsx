import Link from 'next/link'

export default function Footer() {
    return <footer className="footer theme-bg-primary">
        <div className="container py-5 mb-3">
            <div className="row">
                <div className="footer-col col-6 col-lg-3">
                    <h4 className="col-heading">About</h4>
                    <ul className="list-unstyled">
                        {/* <li><a href="#">Our Story</a></li> */}
                        <li><Link href='princing'>Pricing</Link></li>
                        <li><Link href='contact'>Contact</Link></li>
                        {/* <li><a href="#">Jobs</a></li> */}

                    </ul>
                </div>{/*footer-col*/}
                <div className="footer-col col-6 col-lg-3">
                    <h4 className="col-heading">Resources</h4>
                    <ul className="list-unstyled">
                        {/* <li><a href="#">FAQs</a></li> */}
                        <li><Link href='contact'>Support</Link></li>
                    </ul>
                </div>{/*footer-col*/}
                <div className="footer-col col-6 col-lg-3">
                    <h4 className="col-heading">Legal</h4>
                    <ul className="list-unstyled">
                        {/* <li><a href="#">Privacy</a></li> */}
                        <li><Link href='termsOfService'>Terms of Services</Link></li>
                        {/* <li><a href="#">Security</a></li> */}
                    </ul>
                </div>{/*footer-col*/}
                <div className="footer-col col-6 col-lg-3">
                    <h4 className="col-heading">Stay Connected</h4>
                    <ul className="social-list list-unstyled mb-0">
                        <li className="list-inline-item"><a href="https://www.instagram.com/decorebator"><i className="fab fa-instagram fa-fw"></i></a></li>
                        <li className="list-inline-item"><a href="https://twitter.com/decorebator"><i className="fab fa-twitter fa-fw"></i></a></li>
                        <li className="list-inline-item"><a href="https://pt-br.facebook.com/decorebator/"><i className="fab fa-facebook-f fa-fw"></i></a></li>
                        {/* <li className="list-inline-item"><a href="#"><i className="fab fa-youtube fa-fw"></i></a></li> */}
                    </ul>{/*social-list*/}

                    <div className="mb-2">
                        {/* Decorebator<br /> */}
                    </div>
                    <div>
                        {/* <a href="#">hello@yourcompany.com</a> */}
                    </div>

                </div>{/*footer-col*/}
            </div>{/*row*/}
        </div>{/*container*/}
        <div className="container">
            <hr />
        </div>
        {/* <div className="download-area py-4">
            <div className="container text-center">
                <h3 className="mb-3">Get the app</h3>
                <div className="section-intro mb-4 single-col-max-width mx-auto">Download our apps now. lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis. </div>
                <ul className="app-stores list-unstyled list-inline mx-auto  d-inline-block">
                    <li className="list-inline-item mr-3"><a href="#"><img className="ios" src="/images/appstore-apple.svg" alt="app-store" /></a></li>
                    <li className="list-inline-item"><a href="#"><img className="android" src="/images/appstore-android.svg" alt="google play" /></a></li>
                </ul>
            </div>
        </div>
        */}
        <div className="footer-bottom text-center pb-5">
            <small className="copyright">Copyright &copy; <a href="https://lucassimao.com/" target="_blank" rel="noreferrer">Lucas Simão</a></small>
        </div>

        {/* Javascript */}
        <script async type="text/javascript" src="/plugins/jquery-3.4.1.min.js"></script>
        <script async type="text/javascript" src="/plugins/popper.min.js"></script>
        <script async type="text/javascript" src="/plugins/bootstrap/js/bootstrap.min.js"></script>

        {/* Page Specific JS */}
        <script async type="text/javascript" src="/plugins/jquery-flipster/dist/jquery.flipster.min.js"></script>
        <script async type="text/javascript" src="/js/flipster-custom.js"></script>


    </footer>
}