
import Link from 'next/link'
import styles from './signup.module.css'

const SignUp = () => {

    const allowSignup = false

    return <div className={`theme-bg-primary no-bg-xs pt-5 pb-0 mb-0 ${styles.signup}`}><div className="signup-section auth-section">

        <div className="row m-0">
            <div className="auth-col-main bg-white col-12 col-lg-8 order-2 text-center p-5 h-100 align-self-stretch">
                <h1 className="site-logo mb-3">
                    {/* <img className="svg-ie-fix logo-icon" src="assets/images/logo-icon.svg" alt="logo" /> */}
                    <Link href='/'>
                        <a className='navbar-brand mr-0'>
                            <span className="logo-text">
                                Decorebator <span className="alt rounded">Beta</span>                            </span>
                        </a>
                    </Link>
                </h1>


                <div className="page-header text-center py-5">
                    <div className="container">
                        <h2 className="page-title pt-2 mb-3 font-weight-bold">Beta period</h2>
                        <div className="page-intro single-col-max-width mx-auto mb-3">
                            We&apos;re working to give you the best experience!
                            Since we&apos;re still in beta, do you want help us testing the app?
                            If so, please get in touch through <a href="mailto:support@decorebator.com">support@decorebator.com</a>
                        </div>

                    </div>{/*container*/}
                </div>{/*page-header*/}


                <div className="auth-wrapper mx-auto">

                    {allowSignup && <>
                        <h2 className="auth-heading mb-2">Create your free account</h2>
                        <div className="auth-intro mb-4">Try Decorebator for free. No credit card needed.</div>


                        <div className="social-auth text-center mx-auto">
                            <ul className="social-buttons list-unstyled">
                                <li className="mb-3"><a href="#" className="btn btn-social btn-google btn-block"><span className="icon-holder"><i className="fab fa-google fa-fw" ></i></span><span className="btn-text">Sign up with Google</span></a></li>
                                <li className="mb-3"><a href="#" className="btn btn-social btn-facebook btn-block"><span className="icon-holder"><i className="fab fa-facebook-f fa-fw" ></i></span><span className="btn-text">Sign up with Facebook</span></a></li>
                                <li className="mb-3"><a href="#" className="btn btn-social btn-twitter btn-block"><span className="icon-holder"><i className="fab fa-twitter fa-fw" ></i></span><span className="btn-text">Sign up with Twitter</span></a></li>
                            </ul>
                        </div>

                        <div className="divider my-5">
                            <span className="or-text">OR</span>
                        </div>

                        <div className="auth-form-container text-left mx-auto">
                            <form className="auth-form signup-form">
                                <div className="form-group full-name">
                                    <label className="sr-only" htmlFor="signup-fullname">Name</label>
                                    <input id="signup-fullname" name="signup-fullname" type="text" className="form-control signup-email" placeholder="Name" required />
                                </div>{/*form-group*/}
                                <div className="form-group email">
                                    <label className="sr-only" htmlFor="signup-email">Your Email</label>
                                    <input id="signup-email" name="signup-email" type="email" className="form-control signup-email" placeholder="Your email" required />
                                </div>{/*form-group*/}
                                <div className="form-group password">
                                    <label className="sr-only" htmlFor="signup-password">Password</label>
                                    <input id="signup-password" name="signup-password" type="password" className="form-control signup-password"
                                        placeholder="Create a password" required />
                                </div>{/*form-group*/}
                                <div className="legal-note mb-3 text-light text-center">By signing up, you agree to our <a href="#" className="text-light">terms of service</a> and <a href="#" className="text-light">privacy policy</a>.</div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary theme-btn mx-auto">Sign up for free</button>
                                </div>

                            </form>
                        </div>{/*auth-form-container*/}

                    </>}

                    <div className="option-container my-4 pt-3">
                        <div className="lead-text">Already have an account? <Link href="login">Log in</Link> </div>
                    </div>{/*option-container*/}

                </div>{/*auth-wrapper*/}


            </div>{/*col-auth*/}

            <div className="auth-col-promo col-lg-4 d-none d-lg-block order-1 theme-bg-primary h-100 align-self-stretch">
                <div className="auth-col-promo-inner h-100 position-relative p-0">
                    <div className="auth-quote-box mt-5 mb-3 px-3 py-4 rounded text-center shadow-lg bg-white mx-auto">
                        <h5 className="auth-quote-title">An absolute time-saver!</h5>
                        <div>I&apos;m in love with Decorabator!</div>
                    </div>
                    <div className="auth-user-figure-holder mt-5">

                    </div>
                </div>

            </div>{/*col-promo*/}

        </div>{/*row*/}

    </div></div>
}

export default SignUp;