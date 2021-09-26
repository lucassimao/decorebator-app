
import Link from 'next/link'
import styles from './password.module.css'

const Password = () => {

    return <div className={`theme-bg-primary no-bg-xs pt-5 pb-0 mb-0 ${styles.password}`}><div className="password-section auth-section">

        <div className="auth-wrapper mx-auto my-md-5 py-4 px-5 shadow-lg bg-white">

            <h1 className="site-logo mb-3 text-center">
                {/* <img className="svg-ie-fix logo-icon" src="assets/images/logo-icon.svg" alt="logo" /> */}
                <Link href='/'>
                    <a className='navbar-brand mr-0'>
                        <span className="logo-text">
                            Decorebator <span className="alt rounded">Beta</span>                            </span>
                    </a>
                </Link>
            </h1>

            <h2 className="auth-heading mb-2 text-center">Forgot your password?</h2>
            <div className="auth-intro mb-4 text-center">We&apos;ll email you a link to a page where you can easily create a new password.</div>

            <div className="auth-form-container text-left mx-auto">

                <form className="auth-form resetpass-form">
                    <div className="form-group email">
                        <label className="sr-only" htmlFor="reg-email">Your Email</label>
                        <input id="reg-email" name="reg-email" type="email" className="form-control login-email" placeholder="Your Email" required />
                    </div>{/*form-group*/}
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary theme-btn mx-auto w-100">Reset Password</button>
                    </div>
                </form>
            </div>{/*auth-form-container*/}

            <div className="option-container mt-4 pt-3 text-center">
                <div className="lead-text">I want to <Link href="/login">return to login</Link></div>
            </div>{/*option-container*/}

        </div>{/*auth-wrapper*/}
    </div> {/*signup-section*/}
    </div>

}

export default Password;