
import Link from 'next/link'


const Princing = () => {
    return <>

        <div className="page-header text-center py-5">
            <div className="container">
                <h2 className="page-title pt-2 mb-3 font-weight-bold">Pricing</h2>
                <div className="mb-lg-5 page-intro single-col-max-width mx-auto">Try Decorebator, no credit card required. Future updates are 100% FREE</div>
            </div>{/*container*/}
        </div>{/*page-header*/}

        <div className="section pricing-section pb-5">
            <div className="container">
                <div className="row pricing-table">
                    <div className="pricing-item col-12 col-lg-4 mb-5">
                        <div className="pricing-item-inner shadow-lg p-4 rounded h-100">
                            <div className="pricing-item-header text-center">
                                <h3 className="mb-0 pricing-plan-name text-primary font-weight-bold">Free</h3>
                                <div className="mb-3"></div>
                                <h4 className="price display-4 font-weight-light"><span className="price-currency">$</span><span className="price-number">0</span></h4>
                                <div><Link href='signup'><span className="btn btn-primary theme-btn-primary" >Try Decorebator</span></Link></div>
                            </div>{/*pricing-item-header*/}
                            <hr />
                            <div className="pricing-item-body">
                                <ul className="list-unstyled">
                                    <li className="mb-2"><i className="fas fa-check-circle mr-2 "></i>Limited to 5 wordlists</li>
                                    <li className="mb-2"><i className="fas fa-check-circle mr-2 "></i>English, french and spanish support</li>
                                    <li className="mb-2"><i className="fas fa-check-circle mr-2 "></i>
                                        Tests: words from meaning and meaning from word
                                    </li>
                                </ul>
                            </div>{/*pricing-item-body*/}
                        </div>
                        {/*pricing-item-inner*/}
                    </div>{/*pricing-item*/}

                    <div className="pricing-item pricing-item-highlighted col-12 col-lg-4 mb-5">
                        <div className="pricing-item-inner shadow-lg p-4 rounded-bottom position-relative h-100">
                            <div className="pricing-highlight rounded-top position-absolute text-center p-2">
                                POPULAR
                            </div>
                            <div className="pricing-item-header text-center">
                                <h3 className="mb-0 pricing-plan-name text-primary font-weight-bold">Monthly</h3>
                                <div className="mb-3"></div>
                                <h4 className="price display-4 font-weight-light"><span className="price-currency">$</span><span className="price-number">5</span></h4>
                                <div><Link href='signup'><span className="btn btn-primary theme-btn-primary" >Get it now</span></Link></div>

                            </div>{/*pricing-item-header*/}
                            <hr />
                            <div className="pricing-item-body">
                                <ul className="list-unstyled">
                                    <li className="mb-2"><i className="fas fa-check-circle mr-2 "></i>Unlimited wordlists</li>
                                    <li className="mb-2"><i className="fas fa-check-circle mr-2 "></i>English, french and spanish support</li>
                                    <li className="mb-2"><i className="fas fa-check-circle mr-2 "></i>
                                        All tests: words from meaning, meaning from word, synonyms, fill sentence and word from audio
                                    </li>
                                    <li className="mb-2"><i className="fas fa-check-circle  mr-2"></i>up to 50 words per wordlists</li>
                                    <li className="mb-2"><i className="fas fa-check-circle  mr-2"></i>Wordlists from youtube subtitles</li>
                                    <li className="mb-2"><i className="fas fa-check-circle  mr-2"></i>Wordlists from pdf files ( 2MB )</li>
                                    <li className="mb-2"><i className="fas fa-check-circle  mr-2"></i>Wordlists from image files ( 2MB )</li>
                                    <li className="mb-2"><i className="fas fa-check-circle  mr-2"></i>Wordlists from URL</li>
                                    {/* <li className="text-light"><i className="fas fa-times mr-2"></i>Premium support</li> */}
                                </ul>
                            </div>{/*pricing-item-body*/}

                        </div>{/*pricing-item-inner*/}
                    </div>{/*pricing-item*/}

                    <div className="pricing-item col-12 col-lg-4 mb-lg-5">
                        <div className="pricing-item-inner shadow-lg p-4 rounded h-100">
                            <div className="pricing-item-header text-center">
                                <h3 className="mb-0 pricing-plan-name text-primary font-weight-bold">Yearly</h3>
                                <div className="mb-3"></div>
                                <h4 className="price display-4 font-weight-light"><span className="price-currency">$</span><span className="price-number">50</span></h4>
                                <div><Link href='signup'><span className="btn btn-primary theme-btn-primary" >Get it now</span></Link></div>

                            </div>{/*pricing-item-header*/}
                            <hr />
                            <div className="pricing-item-body">
                                <ul className="list-unstyled">
                                    <li className="mb-2"><i className="fas fa-check-circle mr-2 "></i>Unlimited wordlists</li>
                                    <li className="mb-2"><i className="fas fa-check-circle mr-2 "></i>English, french and spanish support</li>
                                    <li className="mb-2"><i className="fas fa-check-circle mr-2 "></i>
                                        All tests: words from meaning, meaning from word, synonyms, fill sentence and word from audio
                                    </li>
                                    <li className="mb-2"><i className="fas fa-check-circle  mr-2"></i>Wordlists with any number of words</li>
                                    <li className="mb-2"><i className="fas fa-check-circle  mr-2"></i>Wordlists from youtube subtitles</li>
                                    <li className="mb-2"><i className="fas fa-check-circle  mr-2"></i>Wordlists from pdf files ( any size )</li>
                                    <li className="mb-2"><i className="fas fa-check-circle  mr-2"></i>Wordlists from image files ( any size )</li>
                                    <li className="mb-2"><i className="fas fa-check-circle  mr-2"></i>Wordlists from URL</li>
                                </ul>
                            </div>{/*pricing-item-body*/}
                        </div>{/*pricing-item-inner*/}
                    </div>{/*pricing-item*/}

                </div>{/*pricing-tabel*/}
            </div>
        </div>

    </>
}

export default Princing;