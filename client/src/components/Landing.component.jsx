import { Navbar } from "./Navbar";
import LandingImage from '../Images/Landing.svg';
import { Link } from "react-router-dom";

const Landing = ()=>{
    return (
        <>
        <Navbar/>
            <div className="container-fluid">
                <div className="row min-vh-100 bg-primary text-white">
                    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                        <span className="text-bold" style={{fontSize:"4rem"}}>Welcome to InvoiceReady.</span>
                        <br/>
                        <span className="fs-4">One place to manage your invoice.</span>
                        <br/>
                        <button className="btn btn-light btn-lg"><Link to="/sign-up">SignUp now!</Link></button>
                    </div>
                    {/* <div className="col-md-12 col-lg-6"></div> */}
                </div>
                <div className="container">
                    <div className="row min-vh-100">
                        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
                            <div className="row">
                                <div className="col-md-12 col-lg-6 p-4">
                                    <img src={LandingImage} alt="" srcset="" />
                                </div>
                                <div className="col-md-12 col-lg-6 d-flex flex-column justify-content-center text-start p-4">
                                    <span className="fs-1 fw-bolder">{"Make Bills & Share with your Customers"}</span>
                                    <span className="mt-4">A professional invoice stands for a brand's identity. By using InvoiceReady billing software, you can create bills that comply with the goods...</span>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-md-12 col-lg-6"></div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export {Landing}