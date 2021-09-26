
import Image from 'next/image'
import figure1 from './images/product-figure-1.png'
import figure2 from './images/product-figure-2.png'

export function FeatureHightlights() {
    return <section className="features-section py-5">
        <div className="container py-lg-5">
            <h3 className="mb-3 text-center font-weight-bold section-heading">Feature Highlights</h3>
            <div className="row pt-5 mb-5">

                <div className="col-12 col-md-6 col-xl-5 offset-xl-1 d-none d-md-block">
                    <Image className="product-figure product-figure-1 img-fluid" src={figure1} alt="" />
                </div>

                <div className="col-12 col-md-6 col-xl-5 pr-xl-3 pt-md-3">
                    <div className="card rounded border-0 shadow-lg  mb-5">
                        <div className="card-body p-4">
                            <h5 className="card-title"><i className="far fa-chart-bar mr-2 mr-lg-3 text-primary fa-lg fa-fw"></i>Feature Lorem Ipsum</h5>
                            <p className="card-text">List one of your product&apos;s main features here. The screenshots used in this template are taken from <a href="https://themes.3rdwavemedia.com/bootstrap-templates/product/appify-bootstrap-4-admin-template-for-app-developers/" target="_blank" rel="noreferrer">Bootstrap 4 admin template Appify</a>. </p>
                            <a href="#" >Learn more <span className="more-arrow">&rarr;</span></a>
                        </div>
                    </div>{/*card*/}

                    <div className="card rounded border-0 shadow-lg mb-5">
                        <div className="card-body p-4">
                            <h5 className="card-title"><i className="fas fa-laptop-code mr-2 mr-lg-3 text-primary fa-lg fa-fw"></i>Feature Consectetuer</h5>
                            <p className="card-text">List one of your product&apos;s main features here. The screenshots used in this template are taken from <a href="https://themes.3rdwavemedia.com/bootstrap-templates/product/appify-bootstrap-4-admin-template-for-app-developers/" target="_blank" rel="noreferrer">Bootstrap 4 admin template Appify</a>.</p>
                            <a href="#" >Learn more <span className="more-arrow">&rarr;</span></a>
                        </div>
                    </div>{/*card*/}
                    <div className="card rounded border-0 shadow-lg">
                        <div className="card-body p-4">
                            <h5 className="card-title"><i className="far fa-calendar-alt mr-2 mr-lg-3 text-primary fa-lg fa-fw"></i>Feature Lorem Ipsum</h5>
                            <p className="card-text">List one of your product&apos;s main features here. The screenshots used in this template are taken from <a href="https://themes.3rdwavemedia.com/bootstrap-templates/product/appify-bootstrap-4-admin-template-for-app-developers/" target="_blank" rel="noreferrer">Bootstrap 4 admin template Appify</a>.</p>
                            <a href="#" >Learn more <span className="more-arrow">&rarr;</span></a>
                        </div>
                    </div>{/*card*/}
                </div>


            </div>

            <div className="row">
                <div className="col-12 col-md-6 col-xl-5 order-md-2 pr-xl-3 d-none d-md-block">
                    <Image className="product-figure product-figure-2 img-fluid" src={figure2} alt="" />
                </div>
                <div className="col-12 col-md-6 col-xl-5 order-md-1 offset-xl-1 pt-xl-5">
                    <div className="card rounded border-0 shadow-lg  mb-5">
                        <div className="card-body p-4">
                            <h5 className="card-title"><i className="fas fa-microphone-alt mr-2 mr-lg-3 text-primary fa-lg fa-fw"></i>Feature Commodo</h5>
                            <p className="card-text">List one of your product&apos;s main features here. The screenshots used in this template are taken from <a href="https://themes.3rdwavemedia.com/bootstrap-templates/product/appify-bootstrap-4-admin-template-for-app-developers/" target="_blank" rel="noreferrer">Bootstrap 4 admin template Appify</a>. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. </p>
                            <a href="#" >Learn more <span className="more-arrow">&rarr;</span></a>
                        </div>
                    </div>{/*card*/}

                    <div className="card rounded border-0 shadow-lg">
                        <div className="card-body p-4">
                            <h5 className="card-title"><i className="far fa-comments mr-2 mr-lg-3 text-primary fa-lg fa-fw"></i>Feature  Ligula Eget</h5>
                            <p className="card-text">List one of your product&apos;s main features here. Lorem ipsum dolor sit amet. The screenshots used in this template are taken from <a href="https://themes.3rdwavemedia.com/bootstrap-templates/product/appify-bootstrap-4-admin-template-for-app-developers/" target="_blank" rel="noreferrer">Bootstrap 4 admin template Appify</a>.</p>
                            <a href="#" >Learn more <span className="more-arrow">&rarr;</span></a>
                        </div>
                    </div>{/*card*/}
                </div>

            </div>

            <div className="pt-5 text-center">
                <a className="btn btn-primary theme-btn theme-btn-ghost font-weight-bold" href="#">View all features</a>
            </div>
        </div>{/*container*/}

    </section>
}