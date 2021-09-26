import Image from 'next/image'
import logo1 from './images/logos/logo-1.svg'
import logo2 from './images/logos/logo-2.svg'
import logo3 from './images/logos/logo-3.svg'
import logo4 from './images/logos/logo-4.svg'
import logo5 from './images/logos/logo-5.svg'
import logo6 from './images/logos/logo-6.svg'


export function TrustedBy() {
    return <section className="logos-section theme-bg-primary py-5 text-center">
        <div className="container">
            <h3 className="mb-5">Trusted by hundreds of software businesses</h3>
            <div className="logos-row row mx-auto">
                <div className="item col-6 col-md-4 col-lg-2 mb-3 mb-lg-0">
                    <div className="item-inner">
                        <Image src={logo1} alt="logo" />
                    </div>{/*item-inner*/}
                </div>{/*item*/}
                <div className="item col-6 col-md-4 col-lg-2 mb-3 mb-lg-0">
                    <div className="item-inner">
                        <Image src={logo2} alt="logo" />
                    </div>{/*item-inner*/}
                </div>{/*item*/}
                <div className="item col-6 col-md-4 col-lg-2 mb-3 mb-lg-0">
                    <div className="item-inner">
                        <Image src={logo3} alt="logo" />
                    </div>{/*item-inner*/}
                </div>{/*item*/}
                <div className="item col-6 col-md-4 col-lg-2 mb-3 mb-lg-0">
                    <div className="item-inner">
                        <Image src={logo4} alt="logo" />
                    </div>{/*item-inner*/}
                </div>{/*item*/}
                <div className="item col-6 col-md-4 col-lg-2 mb-3 mb-lg-0">
                    <div className="item-inner">
                        <Image src={logo5} alt="logo" />
                    </div>{/*item-inner*/}
                </div>{/*item*/}
                <div className="item col-6 col-md-4 col-lg-2 mb-3 mb-lg-0">
                    <div className="item-inner">
                        <Image src={logo6} alt="logo" />
                    </div>{/*item-inner*/}
                </div>{/*item*/}

            </div>

        </div>{/*container*/}
    </section>
}