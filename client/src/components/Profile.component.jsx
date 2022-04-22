import React from 'react'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "./Dashboard-sidebar"
import DashboardNav from "./Dashboard-nav"
import { toast } from 'react-toastify'
import { updateUser } from '../services'

const Profile = ({width, navExpanded, setNavExpanded, notify})=>{

    const [isPending, setIsPending] = useState(true)
    const [user,setUser] = useState({})
    const [userUpdate,setUserUpdate] = useState({})
    const [errors, setErrors] = useState({})

    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    useEffect(()=>{
        setUser(JSON.parse(sessionStorage.getItem('user')))
        setUserUpdate(JSON.parse(sessionStorage.getItem('user')))
        setIsPending(false)
    },[])


    const handleOnChange = (e)=>{
        setUserUpdate({
            ...userUpdate,
            [e.target.name]:e.target.value
        })
    }

    useEffect(()=>{
        let errorString = ""

        Object.keys(errors).map((key)=>{
                errorString+=errors[key]
        })
        if(errorString.length>0){
            toast.error(errorString)
        }

    },[errors])

    const handleSubmit = (e)=>{
        e.preventDefault()
        setErrors(validateForm(userUpdate))
        let err = validateForm(userUpdate)

        if(Object.keys(err).length===0){
            setIsPending(true)
            updateUser(userUpdate).then(res=>{
                if(res){
                    console.log(res.data)
                    let {address,cname, email, fname, lname, gstin} = res.data.result
                    sessionStorage.setItem("user",JSON.stringify({address,cname, email, fname, lname, gstin}))
                    setUser({address,cname, email, fname, lname, gstin});
                    notify("Profile Updated.")
                    setIsPending(false)
                }
            })
        }
    }

    const validateForm=(values)=>{
        let err={}
        if(!values.fname){
            err.fname = "First name is required."
        }
        if(!values.lname){
            err.lname = "Last name is required."
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

    return (<section className="w-100" style={{height:"100vh", maxHeight:"100vh",overflowY:"auto" , backgroundColor:"#eee"}}>
    {width > 768 &&
    <Sidebar navExpanded={navExpanded} handleLogout={handleLogout} user={user} />}

    <DashboardNav width={width} handleLogout={handleLogout} setNavExpanded={setNavExpanded}
        navExpanded={navExpanded} user={user} />

    {
    isPending?
    <div className="d-flex justify-content-center h-100 align-items-center">
        <div className="spinner-border text-dark" style={{width:"5rem",height:"5rem"}} role="status">
            <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    :
    <div className='d-flex justify-content-center h-100 align-items-center'>
        {
            <div className='col-md-6 bg-white p-5 d-flex justify-content-center align-items-center'>
                <form onSubmit={handleSubmit} className='w-100'>
                <h1 className='bg-primary text-white p-3'>User Profile</h1>
                <table style={{borderSpacing:"0 15px", borderCollapse:"separate"}} className='w-100'>
                    <tbody className='text-start'>
                        <tr className='my-2 mb-3'>
                            <td className='w-50'>First Name</td>
                            <td><input type="text" className={`form-control ${errors.fname? "is-invalid":""} ` } name="fname" value={userUpdate.fname} onChange={handleOnChange} />
                            </td>
                        </tr>
                        <tr>
                            <td className='w-50'>Last Name</td>
                            <td><input type="text" className={`form-control ${errors.lname? "is-invalid":""} ` } name="lname" value={userUpdate.lname} onChange={handleOnChange} /></td>
                        </tr>
                        <tr>
                            <td className='w-50'>Company Name</td>
                            <td><input type="text" className={`form-control ${errors.cname? "is-invalid":""} ` } name="cname" value={userUpdate.cname} onChange={handleOnChange} /></td>
                        </tr>
                        <tr>
                            <td className='w-50'>GST number</td>
                            <td><input type="text" className={`form-control ${errors.gstin? "is-invalid":""} ` } name="gstin"  value={userUpdate.gstin} onChange={handleOnChange} /></td>
                        </tr>
                        <tr>
                            <td className='w-50'>Address</td>
                            <td><textarea className={`form-control ${errors.address? "is-invalid":""} ` } name="address" value={userUpdate.address} onChange={handleOnChange}> </textarea></td>
                        </tr>
                        <tr>
                            <td colSpan={2} className='text-end'>
                                <button type='submit' className="btn btn-primary">Save</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </form>
            </div>
        }
    </div>
    }

</section>)
}

export {Profile}