import Image from 'next/image'
import Link from 'next/link'
import { Feature } from './components/feature'
import { FeatureDetails } from './components/featureDetails'
import arrow from './components/images/icon-arrow.svg'

type Feature = {
  title: string
  description: string
  image: string,
  showTwitterTestimonial?: boolean
}
const features: Feature[] = [
  {
    title: 'Create wordlists',
    description: `Type each word or give us a text file, pdf file, image file, youtube video link or an URL to any article in the WEB`,
    image: '',
  },
  {
    title: 'Automatically generated tests based on your worlists',
    description: `Practice different kinds of quizzes to help you with the words you need to learn: words from meaning, meaning from word, synonyms, fill sentence and word from audio`,
    image: '',
  },
  {
    title: 'Support for 3 languages',
    description: `Decorebator supports English, Spanish and French. We'll be adding more languages soon!`,
    image: '',
  }

]

export default function Features() {
  const showDemoVideo = false
  const showFeatureDetails = false

  return (
    <>

      <div className="page-header text-center py-5">
        <div className="container">
          <h2 className="page-title pt-2 mb-3 font-weight-bold">Features</h2>
          <div className="mb-3 page-intro">We&apos;ll speed up your language learnning process by leveraging spaced repetition techiniques <br /> and different sources of data to practice. </div>
          {showDemoVideo && <div className="feature-intro-figure-holder d-flex justify-content-center position-relative">

            <a className="video-play-trigger align-self-center" data-toggle="modal" data-target="#modal-video" >
              <Image className="play-icon" src={arrow} alt="" />
            </a>

          </div>}
        </div>{/*{/*<!--//container-->*/}
      </div>{/*{/*<!--//page-header-->*/}


      {features.map((feature, idx) => <Feature key={idx}  {...feature} right={idx % 2 > 0} />)}


      {showFeatureDetails && <FeatureDetails />}

      <section className="cta-section py-5 theme-bg-secondary text-center">
        <div className="container">
          <h3 className="text-white font-weight-bold mb-3">Ready to get your language learnning to the next level ?</h3>
          <div className="text-white mx-auto single-col-max-width section-intro">We leverage different strategies to help you memorize and make real use of new words and expressions in the language that you are learnning </div>
          <Link href="/signup"><span className="btn theme-btn theme-btn-ghost theme-btn-on-bg mt-4">Sign up Now - It&apos;s FREE</span></Link>
        </div>
      </section>{/*cta-section*/}

    </>
  )
}
