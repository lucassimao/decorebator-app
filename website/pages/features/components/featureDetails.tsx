
import Image from 'next/image'
import cogs from './images/icon-cogs.svg'
import padlock from './images/icon-padlock.svg'
import palette from './images/icon-palette.svg'
import phone from './images/icon-phone-chat.svg'
import piggy from './images/icon-piggy-bank.svg'
import profile from './images/icon-profile.svg'
import rocket from './images/icon-rocket.svg'
import target from './images/icon-target.svg'
import plane from './images/icon-plane.svg'


export const FeatureDetails = () => {
    return (<section className="feature-list py-5 text-center">
        <div className="container">
            <h3 className="font-weight-bold">Everything you need to promote your mobile app</h3>
            <div className="mb-3">You can list all your product features/benefits using this area.</div>
            <div className="row">
                <div className="item col-12 col-lg-4">
                    <div className="item-inner text-center p-3 p-lg-5">
                        <Image className="mb-3" src={target} alt="" />
                        <h5>Feature Lorem Ipsum</h5>
                        <div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.</div>
                    </div>{/*<!--//item-inner-->*/}
                </div>{/*<!--//item-->*/}
                <div className="item col-12 col-lg-4">
                    <div className="item-inner text-center p-3 p-lg-5">
                        <Image className="mb-3" src={rocket} alt="" />
                        <h5>Feature Lorem Ipsum</h5>
                        <div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis. </div>
                    </div>{/*<!--//item-inner-->*/}
                </div>{/*<!--//item-->*/}
                <div className="item col-12 col-lg-4">
                    <div className="item-inner text-center p-3 p-lg-5">
                        <Image className="mb-3" src={cogs} alt="" />
                        <h5>Feature Lorem Ipsum</h5>
                        <div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.</div>
                    </div>{/*<!--//item-inner-->*/}
                </div>{/*<!--//item-->*/}
                <div className="item col-12 col-lg-4">
                    <div className="item-inner text-center p-3 p-lg-5">
                        <Image className="mb-3" src={padlock} alt="" />
                        <h5>Feature Lorem Ipsum</h5>
                        <div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.</div>
                    </div>{/*<!--//item-inner-->*/}
                </div>{/*<!--//item-->*/}
                <div className="item col-12 col-lg-4">
                    <div className="item-inner text-center p-3 p-lg-5">
                        <Image className="mb-3" src={piggy} alt="" />
                        <h5>Feature Lorem Ipsum</h5>
                        <div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.</div>
                    </div>{/*<!--//item-inner-->*/}
                </div>{/*<!--//item-->*/}
                <div className="item col-12 col-lg-4">
                    <div className="item-inner text-center p-3 p-lg-5">
                        <Image className="mb-3" src={phone} alt="" />
                        <h5>Feature Lorem Ipsum</h5>
                        <div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.</div>
                    </div>{/*<!--//item-inner-->*/}
                </div>{/*<!--//item-->*/}
                <div className="item col-12 col-lg-4">
                    <div className="item-inner text-center p-3 p-lg-5">
                        <Image className="mb-3" src={profile} alt="" />
                        <h5>Feature Lorem Ipsum</h5>
                        <div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis. </div>
                    </div>{/*<!--//item-inner-->*/}
                </div>{/*<!--//item-->*/}
                <div className="item col-12 col-lg-4">
                    <div className="item-inner text-center p-3 p-lg-5">
                        <Image className="mb-3" src={palette} alt="" />
                        <h5>Feature Lorem Ipsum</h5>
                        <div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.</div>
                    </div>{/*<!--//item-inner-->*/}
                </div>{/*<!--//item-->*/}
                <div className="item col-12 col-lg-4">
                    <div className="item-inner text-center p-3 p-lg-5">
                        <Image className="mb-3" src={plane} alt="" />
                        <h5>Feature Lorem Ipsum</h5>
                        <div>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis.</div>
                    </div>{/*<!--//item-inner-->*/}
                </div>{/*<!--//item-->*/}
            </div>{/*<!--//row-->*/}
        </div>{/*<!--//container-->*/}
    </section>)
}

export default FeatureDetails