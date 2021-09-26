
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import styles from './login.module.css'

const Login = () => {
    const allowSocialNetworkLogin = false
    const allowRememberMe = false
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoginInProgress, setLoginInProgress] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onFormSubmit = async (event: FormEvent) => {
        event.preventDefault()

        if (!process.env.NEXT_PUBLIC_AUTH_ENDPOINT) {
            throw new Error("Invalid auth endpoint");
        }

        if (!process.env.NEXT_PUBLIC_APP_URL) {
            throw new Error("Invalid app url");
        }

        const data = { login: email, password };
        setLoginInProgress(true)
        setErrorMessage('')

        try {
            const result = await fetch(process.env.NEXT_PUBLIC_AUTH_ENDPOINT, {
                method: "POST",
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            })

            if (!result.ok) {
                throw new Error("Invalid credentials");
            }

            const authorization = result.headers.get('authorization')
            if (authorization) {
                document.cookie = `authorization=${authorization};path=/;domain=decorebator.com`;
                window.location.href = process.env.NEXT_PUBLIC_APP_URL
            }
        } catch (error) {
            setErrorMessage((error as Error).message)
        } finally {
            setLoginInProgress(false)
        }
    }


    return <div className={`theme-bg-primary no-bg-xs pt-5 pb-0 mb-0 ${styles.login}`}>
        <div className="login-section auth-section" >

            <div className="auth-wrapper mx-auto  py-4 px-5 shadow-lg bg-white" >
                <h1 className="site-logo mb-3 text-center">
                    {/* <img className="svg-ie-fix logo-icon" src="assets/images/logo-icon.svg" alt="logo" /> */}
                    <Link href='/'>
                        <a className='navbar-brand mr-0'>
                            <span className="logo-text">
                                Decorebator <span className="alt rounded">Beta</span>                            </span>
                        </a>
                    </Link>
                </h1>

                <h2 className="auth-heading mb-4 text-center">Log in to your account</h2>

                {allowSocialNetworkLogin && <>
                    <div className="social-auth text-center mx-auto">
                        <ul className="social-buttons list-unstyled">
                            <li className="mb-3"><a href="#" className="btn btn-social btn-google btn-block"><span className="icon-holder"><i className="fab fa-google fa-fw" ></i></span><span className="btn-text">Log in with Google</span></a></li>
                            <li className="mb-3"><a href="#" className="btn btn-social btn-facebook btn-block"><span className="icon-holder"><i className="fab fa-facebook-f fa-fw" ></i></span><span className="btn-text">Log in with Facebook</span></a></li>
                            <li className="mb-3"><a href="#" className="btn btn-social btn-twitter btn-block"><span className="icon-holder"><i className="fab fa-twitter fa-fw" ></i></span><span className="btn-text">Log in with Twitter</span></a></li>
                        </ul>
                    </div>

                    <div className="divider my-5">
                        <span className="or-text">OR</span>
                    </div>
                </>}

                <div className="auth-form-container text-left mx-auto">
                    <form className="auth-form signup-form" onSubmit={onFormSubmit}>
                        <div className="form-group email">
                            <label className="sr-only" htmlFor="login-email">Email</label>
                            <input id="login-email" name="login-email" onChange={(event) => setEmail(event.currentTarget.value)} value={email} type="email" className="form-control login-email" placeholder="Email" required />
                        </div>{/*form-group*/}
                        <div className="form-group password">
                            <label className="sr-only" htmlFor="login-password">Password</label>
                            <input id="login-password" name="login-password" onChange={(event) => setPassword(event.currentTarget.value)} value={password} type="password" className="form-control login-password" placeholder="Password" required />
                            <div className="extra mt-2 position-relative">
                                <div className="checkbox remember">
                                    <label>
                                        {allowRememberMe && <><input type="checkbox" /> Remember me</>}
                                    </label>
                                </div>{/*check-box*/}
                                <div className="forgotten-password">
                                    <Link href='/password'>
                                        Forgotten password?
                                    </Link>
                                </div>
                            </div>{/*extra*/}
                        </div>{/*form-group*/}
                        {errorMessage && <div className="text-center error mx-auto mb-3 mt-0">
                            {errorMessage}
                        </div>}
                        <div className="text-center">
                            <button disabled={isLoginInProgress} type="submit" className="btn btn-primary theme-btn mx-auto">
                                {isLoginInProgress && <span><i className="fas fa-spinner fa-spin" /></span>} Log in
                            </button>
                        </div>
                    </form>
                </div>{/*auth-form-container*/}

                <div className="option-container mt-4 pt-3 text-center">
                    <div className="lead-text">Don&apos;t have an account?  <Link href='signup'>Sign up</Link> </div>

                </div>{/*option-container*/}

            </div>{/*auth-wrapper*/}

        </div>{/*signup-section*/}

    </div >
}

export default Login;