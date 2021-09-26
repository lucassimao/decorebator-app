import Image from 'next/image'
import Link from 'next/link'
import { TrustedBy } from '../components/index/trustedBy'
import { FeatureHightlights } from '../components/index/featureHighlights'
import { Testimonials } from '../components/index/testimonials'

import rocket from '../components/index/images/icon-rocket.svg'
import languages from '../components/index/images/icon-languages.svg'
import target from '../components/index/images/icon-target.svg'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "woven-gist-296814.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: "woven-gist-296814.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
}

export default function Index() {
  const showTrustedBy = false
  const showFeatureHightlights = false
  const showTestimonials = false


  return (
    <>

      <section className="hero-section">
        <div className="container">
          <div className="row figure-holder">
            <div className="col-12 col-md-6 pt-3 pt-md-4">
              <h2 className="site-headline font-weight-bold mt-lg-5 pt-lg-5">The best way to expand your vocabulary.</h2>
              <div className="site-tagline mb-3">Just tell us which words you want to learn.
                We&apos;ll automatically build quizzes and tests to help you master all of them.</div>
              <div className="cta-btns">
                <div className="mb-4"><Link href="/signup"><span className="btn btn-primary font-weight-bold theme-btn" >Try Decorebator for FREE</span></Link></div>
                {/* <ul className="app-stores list-unstyled list-inline mx-auto mx-md-0 d-inline-block">
                  <li className="list-inline-item mr-3"><a href="#"><img className="ios" src="/images/appstore-apple.svg" alt="app-store" /></a></li>
                  <li className="list-inline-item"><a href="#"><img className="android" src="/images/appstore-android.svg" alt="google play" /></a></li>
                </ul> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {showTrustedBy && <TrustedBy />}



      <section className="theme-bg-primary benefits-section py-5">

        <div className="container py-lg-5">
          <h3 className="mb-5 text-center font-weight-bold">Learn all subtleties behind words and expressions used by native speakers</h3>
          <div className="row">
            <div className="item col-12 col-lg-4">
              <div className="item-inner text-center p-3 p-lg-5">
                <Image unoptimized src={target} alt="" />
                <h5>Focused on your needs</h5>
                <div>Learn words and expressions based on what you are currently interested: books, movies, web articles, songs etc..</div>
              </div>{/*item-inner*/}
            </div>{/*item*/}
            <div className="item col-12 col-lg-4">
              <div className="item-inner text-center p-3 p-lg-5">
                <Image unoptimized src={rocket} />
                <h5>Speed up your jorney</h5>
                <div>Don&apos;t waste your time creating wordlists in paper! Create wordlists in decorebator and we&apos;ll leverage spaced repetition to help you master meanings, synonyms and use cases.
                </div>
              </div>{/*item-inner*/}
            </div>{/*item*/}
            <div className="item col-12 col-lg-4">
              <div className="item-inner text-center p-3 p-lg-5">
                <Image unoptimized src={languages} alt="icon-cogs.svg" />
                <h5>Language support</h5>
                <div> We currently support English, Spanish and French. We&apos;ll support new languages soon!</div>
              </div>{/*item-inner*/}
            </div>{/*item*/}
          </div>{/*row*/}
          <div className="pt-3 text-center">
            <Link href="/features"><span className="btn btn-primary theme-btn theme-btn-ghost font-weight-bold" >Learn More</span></Link>
          </div>
        </div>

      </section>{/*benefits-section*/}


      {showFeatureHightlights && <FeatureHightlights />}



      <section className="cta-section py-5 theme-bg-secondary text-center">
        <div className="container">
          <h3 className="text-white font-weight-bold mb-3">Ready to get your language learnning to the next level ?</h3>
          <div className="text-white mx-auto single-col-max-width section-intro">We leverage different strategies to help you memorize and make real use of new words and expressions in the language that you are learnning </div>
          <Link href="/signup"><span className="btn theme-btn theme-btn-ghost theme-btn-on-bg mt-4">Sign up Now - It&apos;s FREE</span></Link>
        </div>
      </section>{/*cta-section*/}


      {/*testimonial-section*/}
      {showTestimonials && <Testimonials />}
    </>
  )
}
