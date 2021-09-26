
import styles from './feature.module.css'

import Image from 'next/image'


type TwitterQuote = {
    text: string
    userProfilePic: string
    userName: string
    slug: string
    detail: string
}
type FeatureProps = {
    right?: boolean
    title: string
    description: string
    image: string
    twitterQuote?: TwitterQuote
}

export const Feature = (props: FeatureProps) => {
    return (<section className={`feature-item pt-5 ${styles.borderlessFeature}`} id={props.title} >
        <div className="container">
            <div className="row ">
                <div className={`col-12 col-lg-6 align-self-center ${props.right ? 'order-lg-2' : ''}`}>
                    <h4>{props.title}</h4>
                    <div className="mb-5">{props.description}</div>

                    {props.twitterQuote && <div className="feature-quote d-flex mb-4 mb-lg-0">
                        <div className="align-self-center mr-4">
                            <Image className="feature-quote-profile  rounded-circle shadow-sm" src={props.twitterQuote.userProfilePic} height={0} width={0} alt="" />
                        </div>
                        <div className="feature-quote-box shadow-lg p-4 rounded position-relative">
                            <blockquote>
                                <p>&quot;{props.twitterQuote.text}&quot;</p>
                            </blockquote>
                            <div className="source">
                                <div><a href={`https://twitter.com/${props.twitterQuote.slug}`} target='_blank' rel="noreferrer" >
                                    {`${props.twitterQuote.userName} (${props.twitterQuote.slug})`}</a></div>
                                <div>{props.twitterQuote.detail}</div>
                            </div>{/*<!--//source-->*/}
                            <div className="source-icon position-absolute">
                                <i className="fab fa-twitter text-light"></i>
                            </div>
                        </div>{/*<!--//quote-box-->*/}
                    </div>}{/*<!--//feature-quote-->*/}
                </div>
                <div className="col-12 col-lg-6">
                    {/* <Image className={styles.image} src={props.image} height={500} width={360} /> */}
                </div>

            </div>{/*<!--//row-->*/}
        </div>
    </section >); {/*<!--//feature-item-->*/ }
}

export default Feature