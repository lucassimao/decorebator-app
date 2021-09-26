
import Image from 'next/image'
import user1 from './images/users/user-1.jpg'
import user2 from './images/users/user-2.jpg'
import user3 from './images/users/user-3.jpg'
import user4 from './images/users/user-4.jpg'
import user5 from './images/users/user-5.jpg'
import user6 from './images/users/user-6.jpg'
import user7 from './images/users/user-7.jpg'
// import user8 from './images/users/user-8.svg'

export function Testimonials() {
    return <section id="quote" className="testimonial-section py-5">
        <div className="container py-lg-5">
            <h3 className="mb-1 mb-md-5 text-center">Loved by thousands of app developers like you</h3>

            <div id="flipster-carousel" className="flipster-carousel pt-md-3">
                <div className="flip-items pb-5">
                    <div className="flip-item text-center text-md-left">
                        <div className="item-inner shadow-lg rounded">
                            <h5 className="mb-2">Amazing App!</h5>
                            <div className="ratings text-primary mb-3"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                            <div className="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
                            </div>
                            <div className="source media flex-column flex-md-row">
                                <Image className="source-profile rounded-circle mr-md-3 mx-auto mx-md-0" src={user1} alt="" />
                                <div className="source-info media-body pt-3">
                                    <div>Tony Carter</div>
                                    <div>London, UK</div>
                                </div>
                            </div>
                        </div>{/*item-inner*/}
                    </div>{/*flip-item*/}

                    <div className="flip-item">
                        <div className="item-inner shadow-lg rounded">
                            <h5 className="mb-2">Marvellous!</h5>
                            <div className="ratings text-primary mb-3"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half"></i></div>
                            <div className="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
                            </div>
                            <div className="source media ">
                                <Image className="source-profile rounded-circle mr-3" src={user2} alt="" />
                                <div className="source-info media-body pt-3">
                                    <div>Helen Owens</div>
                                    <div>New York, US</div>
                                </div>
                            </div>
                        </div>{/*item-inner*/}
                    </div>{/*flip-item*/}

                    <div className="flip-item">
                        <div className="item-inner shadow-lg rounded">
                            <h5 className="mb-2">Actually Impressive!</h5>
                            <div className="ratings text-primary mb-3"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                            <div className="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
                            </div>
                            <div className="source media">
                                <Image className="source-profile rounded-circle mr-3" src={user3} alt="" />
                                <div className="source-info media-body pt-3">
                                    <div>Scott Rivera</div>
                                    <div>Florida, US</div>
                                </div>
                            </div>
                        </div>{/*item-inner*/}
                    </div>{/*flip-item*/}

                    <div className="flip-item">
                        <div className="item-inner shadow-lg rounded">
                            <h5 className="mb-2">Total Game Changer!</h5>
                            <div className="ratings text-primary mb-3"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                            <div className="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
                            </div>
                            <div className="source media">
                                <Image className="source-profile rounded-circle mr-3" src={user4} alt="" />
                                <div className="source-info media-body pt-3">
                                    <div>Charles Brewer</div>
                                    <div>San Francisco, US</div>
                                </div>
                            </div>
                        </div>{/*item-inner*/}
                    </div>{/*flip-item*/}

                    <div className="flip-item">
                        <div className="item-inner shadow-lg rounded">
                            <h5 className="mb-2">Just Perfect!</h5>
                            <div className="ratings text-primary mb-3"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                            <div className="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
                            </div>
                            <div className="source media">
                                <Image className="source-profile rounded-circle mr-3" src={user5} alt="" />
                                <div className="source-info media-body pt-3">
                                    <div>Deborah Reed</div>
                                    <div>Paris, France</div>
                                </div>
                            </div>
                        </div>{/*item-inner*/}
                    </div>{/*flip-item*/}

                    <div className="flip-item">
                        <div className="item-inner shadow-lg rounded">
                            <h5 className="mb-2">Great App!</h5>
                            <div className="ratings text-primary mb-3"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                            <div className="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
                            </div>
                            <div className="source media">
                                <Image className="source-profile rounded-circle mr-3" src={user6} alt="" />
                                <div className="source-info media-body pt-3">
                                    <div>Tony Cheng</div>
                                    <div>San Francisco, US</div>
                                </div>
                            </div>
                        </div>{/*item-inner*/}
                    </div>{/*flip-item*/}

                    <div className="flip-item">
                        <div className="item-inner shadow-lg rounded">
                            <h5 className="mb-2">Exceptional!</h5>
                            <div className="ratings text-primary mb-3"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                            <div className="mb-3">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
                            </div>
                            <div className="source media">
                                <Image className="source-profile rounded-circle mr-3" src={user7} alt="" />
                                <div className="source-info media-body pt-3">
                                    <div>Kimberly Wells</div>
                                    <div>London, UK</div>
                                </div>
                            </div>
                        </div>{/*item-inner*/}
                    </div>{/*flip-item*/}

                </div>{/*items-wrapper*/}
                <div className="pt-5 text-center">
                    <a className="btn btn-primary theme-btn font-weight-bold" href="#">Try Nova Now</a>
                </div>

            </div>
        </div>{/*container*/}

    </section>
}