
import Link from 'next/link'


const Contact = () => {
    const showContactForm = false

    return <>

        <div className="page-header text-center py-5">
            <div className="container">
                <h2 className="page-title pt-2 mb-3 font-weight-bold">Contact Us</h2>
                <div className="page-intro single-col-max-width mx-auto mb-5">Want to get in touch?
                    Please, email us at <a href="mailto:support@decorebator.com">support@decorebator.com</a> with any doubt, question, suggestion or critic
                </div>
                <h5 className="mb-3">Follow Us</h5>
                <ul className="social-list list-inline mb-3">
                    <li className="list-inline-item"><a href="#"><i className="fab fa-twitter fa-fw fa-lg"></i></a></li>
                    <li className="list-inline-item"><a href="#"><i className="fab fa-facebook-f fa-fw fa-lg"></i></a></li>
                    <li className="list-inline-item"><a href="#"><i className="fab fa-instagram fa-fw fa-lg"></i></a></li>
                    <li className="list-inline-item"><a href="#"><i className="fab fa-youtube fa-fw fa-lg"></i></a></li>
                </ul>{/*social-list*/}

            </div>{/*container*/}
        </div>{/*page-header*/}


        {showContactForm && <section className="contact-form-section pb-5">
            <div className="container pb-5">
                <div className="form-wrapper shadow-lg single-col-max-width mx-auto p-5">
                    <form id="contact-form" className="contact-form" method="post" action="">
                        <h3 className="text-center mb-4">Contact Form</h3>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label className="sr-only" htmlFor="cname">Name</label>
                                <input type="text" className="form-control" id="cname" name="name" placeholder="Name" minLength={2} required aria-required="true" />
                            </div>
                            <div className="form-group col-md-6">
                                <label className="sr-only" htmlFor="cemail">Email</label>
                                <input type="email" className="form-control" id="cemail" name="email" placeholder="Email" required aria-required="true" />
                            </div>
                            <div className="form-group col-12">
                                <label className="sr-only" htmlFor="cmessage">Your message</label>
                                <textarea className="form-control" id="cmessage" name="message" placeholder="Enter your message" rows={10} required aria-required="true"></textarea>
                            </div>
                            <div className="form-group col-12">
                                <button type="submit" className="btn btn-block btn-primary py-2">Send It</button>
                            </div>
                        </div>{/*form-row*/}
                    </form>
                </div>
            </div>{/*container*/}
        </section>}

    </>
}

export default Contact;