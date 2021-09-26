import Image from 'next/image'
import profilePic from './eu-2.jpg'

const About = () => {
    return <>

        <div className="page-header text-center py-5">
            <div className="container">
                <h2 className="page-title pt-2 mb-3 font-weight-bold">About Us</h2>
                <div className="page-intro single-col-max-width mx-auto mb-3">
                    Decorabator born out of the founder&apos;s necessity of speed up his own english learning journey!
                </div>

            </div>{/*container*/}
        </div>{/*page-header*/}

        <section className="team-section py-5">
            <div className="container">
                <div className="card-deck">
                    <div className="card border-0 shadow-lg pt-5 my-5 position-relative">
                        <div className="card-body">
                            <div className="member-profile position-absolute w-100 text-center">
                                <Image unoptimized className="rounded-circle mx-auto d-inline-block shadow-sm" src={profilePic} />

                            </div>
                            <div className="card-text pt-1">
                                <h5 className="member-name mb-0 text-center text-primary font-weight-bold">Lucas Simão</h5>
                                <div className="mb-3 text-center">Founder / CEO / CTO / Marketing / Sales / Product Manager / Developer / Designer / Support</div>
                                <div>
                                    Hey, I&apos;m a full stack software engineer with years of experience delivering
                                    large-scale and distribuited applications now focused on
                                    creating intelligent SaaS products
                                </div>
                            </div>
                        </div>{/*card-body*/}
                        <div className="card-footer theme-bg-primary border-0 text-center">
                            <ul className="social-list list-inline mb-0 mx-auto">
                                <li className="list-inline-item"><a className="text-dark" rel="noreferrer" target='_blank' href="https://www.linkedin.com/in/lucassimao/"><i className="fab fa-linkedin-in fa-fw"></i></a></li>
                                <li className="list-inline-item"><a className="text-dark" rel="noreferrer" target='_blank' href="https://twitter.com/lsimaocosta"><i className="fab fa-twitter fa-fw"></i></a></li>

                            </ul>{/*social-list*/}
                        </div>{/*card-footer*/}
                    </div>{/*card*/}

                    {/*card*/}

                </div>{/*card-deck*/}

            </div>

        </section>

    </>
}

export default About;