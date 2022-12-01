import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {signupToServer} from '../services/index'
import { Navbar } from "./Navbar";
import Banner from '../Images/Banner.svg';


function Signup({notify}){

    const formInitialValue = {
        fname:"",
        lname:"",
        email:"",
        password:"",
        confirmPassword:"",
        cname:"",
        gstin:"",
        address:""
    }

    const [values, setValues] = useState(formInitialValue)
    const [sucessMessage, setMessage] = useState("")
    const [errors, setErrors] = useState({})
    const [dataIsCorrect, setDataIsCorrect] = useState(false)

    const handleChange = (event)=>{
        setValues({
            ...values,
            [event.target.name]:event.target.value
        })
    }

    function handleSubmit(event){
        event.preventDefault()
        setErrors(validateForm(values))
        setDataIsCorrect(true)
    }

    useEffect(()=>{
        if(Object.keys(errors).length ===0 && dataIsCorrect){

            let data = {
                fname:values.fname,
                lname:values.lname,
                email:values.email,
                password:values.password,
                cname:values.cname,
                gstin:values.gstin,
                address:values.address,
            }
            signupToServer(data).then(
                (res)=>{
                    console.log(res)
                    setMessage("Registration successful")
                    notify("Registration successful")
                    setTimeout(()=>{
                        setValues(formInitialValue)
                        setMessage("")
                    },5000)
                }
            ).catch((error)=>{
                const res = error.response
                if(res.status===422){
                    console.log(res.data.error)
                    setErrors({email:res.data.error})
                }
            })
        }
    },[errors])

    const validateForm=(values)=>{
        let err={}
        if(!values.fname){
            err.fname = "First name is required."
        }
        if(!values.lname){
            err.lname = "Last name is required."
        }
        if(!values.email){
            err.email = "Email is required."
        }else if(!/\S+@\S+\.\S+/.test(values.email)){
            err.email = "Email is invalid"
        }
        if(!values.password){
            err.password = "Password is required."
        }
        if(!values.confirmPassword){
            err.confirmPassword = "Confirm password is required."
        }
        if(values.password !== values.confirmPassword){
            err.confirmPassword = "Password and confirm password not matching."
        }
        if(!values.cname){
            err.cname = "Company name is required."
        }
        if(!values.gstin){
            err.gstin = "GSTIN numnber is required."
        }
        if(!values.address){
            err.address = "Address is required."
        }
        return err
    }

return (
    <>
	<Navbar/>
<div className="container">
    <div className="row justify-content-center my-4">
        <div className="col-md-7 col-lg-5 shadow p-3">
            <div className="rounded w-100"
                style={{backgroundImage: `url(${Banner})`,height:"200px", backgroundPosition:'center', backgroundRepeat:'no-repeat'}}>
            </div>
            <div className="p-3">
                <div className="d-flex">
                    <div className="w-100">
                        <h1 className="mb-4 fw-bold">Sign Up</h1>
                    </div>
                </div>
                {sucessMessage.length!==0 && <div className="alert alert-success">{sucessMessage}</div>}
                <form onSubmit={handleSubmit} name="signup">
                    <div className="form-group my-3 text-start">
                        <label className="form-control-placeholder">First Name</label>
                        <input type="text" className={`form-control ${errors.fname? "is-invalid":""} ` } name="fname" value={values.fname} onChange={handleChange}  />
                        {errors.fname &&<div className="alert-danger my-3 p-2">{errors.fname}</div>}
                    </div>
                    <div className="form-group my-3 text-start">
                        <label className="form-control-placeholder">Last Name</label>
                        <input type="text" className={`form-control ${errors.lname? "is-invalid":""} ` } name="lname" value={values.lname} onChange={handleChange}  />
                        {errors.lname &&<div className="alert-danger my-3 p-2">{errors.lname}</div>}
                    </div>
                    <div className="form-group my-3 text-start">
                        <label className="form-control-placeholder">Email</label>
                        <input type="email" className={`form-control ${errors.email? "is-invalid":""}`} name="email" value={values.email} onChange={handleChange} />
                        {errors.email &&<div className="alert-danger my-3 p-2">{errors.email}</div>}
                    </div>
                    <div className="form-group my-3 text-start">
                        <label className="form-control-placeholder">Password</label>
                        <input type="password" className={`form-control ${errors.password? "is-invalid":""}`} name="password" value={values.password} onChange={handleChange} />
                        {errors.password &&<div className="alert-danger my-3 p-2">{errors.password}</div>}
                    </div>
                    <div className="form-group my-3 text-start">
                        <label className="form-control-placeholder">Confirm Password</label>
                        <input type="password" className={`form-control ${errors.confirmPassword? "is-invalid":""}`} name="confirmPassword" value={values.confirmPassword} onChange={handleChange} />
                        {errors.confirmPassword &&<div className="alert-danger my-3 p-2">{errors.confirmPassword}</div>}
                    </div>
                    <div className="form-group my-3 text-start">
                        <label className="form-control-placeholder">Company Name</label>
                        <input type="text" className={`form-control ${errors.cname? "is-invalid":""} ` } name="cname" value={values.cname} onChange={handleChange}  />
                        {errors.cname &&<div className="alert-danger my-3 p-2">{errors.cname}</div>}
                    </div>
                    <div className="form-group my-3 text-start">
                        <label className="form-control-placeholder">GST Number</label>
                        <input type="text" className={`form-control ${errors.gstin? "is-invalid":""} ` } name="gstin" value={values.gstin} onChange={handleChange}  />
                        {errors.gstin &&<div className="alert-danger my-3 p-2">{errors.gstin}</div>}
                    </div>
                    <div className="form-group my-3 text-start">
                        <label className="form-control-placeholder">Address</label>
                        <textarea className={`form-control ${errors.address? "is-invalid":""} ` } name="address" value={values.address} onChange={handleChange}  />
                        {errors.address &&<div className="alert-danger my-3 p-2">{errors.address}</div>}
                    </div>

                    <div className="form-group my-3">
                        <button type="submit" className="form-control btn btn-primary rounded submit px-3">Sign
                            Up</button>
                    </div>
                    <div className="form-group mt-5">
						<div className="w-100 text-end">
							<p>Not a member?
								{" "}<Link data-toggle="tab" to="/sign-in">SignIn</Link>
							</p>
						</div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</>
);
}

export {Signup}