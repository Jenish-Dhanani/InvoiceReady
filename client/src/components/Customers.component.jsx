import React from 'react'
import { useEffect, useState } from "react"
import { Link,Outlet,useNavigate } from "react-router-dom"
import { Sidebar } from "./Dashboard-sidebar"
import DashboardNav from "./Dashboard-nav"
import { getcustomers,addCustomer, saveCustomerTodb } from '../services'

const Customers = ({width, navExpanded, setNavExpanded, notify}) => {

const [isPending, setIsPending] = useState(true)
const [user,setUser] = useState({})
const [customers, setCustomers] = useState([])

const [customer, setCustomer] = useState({cid:"",cnameinput:"",cemailinput:"",cphoneinput:"",caddressinput:""})
const [dataIsCorrect, setDataIsCorrect] = useState(false)
const [errors, setErrors] = useState({})
const [isAddNew, setIsAddNew] = useState(false)
const [isUpdate, setIsUpdate] = useState(false)

useEffect(()=>{
setUser(JSON.parse(sessionStorage.getItem('user')))
getcustomers().then((list)=>{
    setCustomers(list.data)
    setIsPending(false)
}).catch(error=>console.error(error))
},[])

useEffect(()=>{

},[customers])

useEffect(()=>{
    if(Object.keys(errors).length===0 && dataIsCorrect && isAddNew && !isUpdate){
        // cnameinput:"",cemailinput:"",cphoneinput:"",caddressinput:""
        addCustomer(customer).then((res)=>{
            if(res.data){
                setCustomers(res.data)
                notify("customer added successfully")
            }
        })
        setIsAddNew(false)
    }
    if(Object.keys(errors).length===0 && dataIsCorrect && !isAddNew && isUpdate){
        // cnameinput:"",cemailinput:"",cphoneinput:"",caddressinput:""
        saveCustomerTodb(customer).then(res=>{
            if(res.data){
                setCustomers(res.data)
                setIsPending(false)
                notify("user Updated.")
            }
        })
        setIsUpdate(false)
    }

    setIsPending(false)
},[errors])

const navigate = useNavigate();
const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
};

const handleChange = (event)=>{
    setCustomer({
        ...customer,
        [event.target.name]:event.target.value
    })
}

const validateForm=(values)=>{
    let err={}

    if(!values.cnameinput){
        err.cnameinput = "Customer name is required."
    }
    if(!values.cemailinput){
        err.cemailinput = "Customer email is invalid"
    }
    if(!values.cphoneinput){
        err.cphoneinput = "Customer phone no is required."
    }
    if(!values.caddressinput){
        err.caddressinput = "Customer address is required."
    }
    return err
}

const saveCustomer = (e)=>{
    e.preventDefault()
    console.log(customer)
    setErrors(validateForm(customer))
    setDataIsCorrect(true)

}

const updateCustomer = (customer)=>{
    setIsUpdate(true)
    document.getElementById('update-open-model').click()
    setCustomer({
        cid:customer._id,
        cnameinput:customer.cname,
        cemailinput:customer.email,
        cphoneinput:customer.phone,
        caddressinput:customer.address
    })
}

const saveUpdatedCustomer =(e)=>{
    e.preventDefault()
    setIsPending(true)
    setErrors(validateForm(customer))
    setDataIsCorrect(true)
}


const handleModelClose = (e)=>{
    e.preventDefault()
    setIsUpdate(false)
    setIsAddNew(false)
    setCustomer({cid:"",cnameinput:"",cemailinput:"",cphoneinput:"",caddressinput:""})
    setTimeout(()=>{setErrors({cnameinput:"",cemailinput:"",cphoneinput:"",caddressinput:""})},100)
    document.getElementById('closeModel').click();
}

return (
<div>

    <section className="w-100" style={{height:"100vh", maxHeight:"100vh",overflowY:"auto" , backgroundColor:"#eee"}}>
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
        <div>
            <div className="container min-vh-100">
                <h3 className="title my-5">Customers</h3>
                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#exampleModal" id="open-model" onClick={()=>setIsAddNew(true)}> Add Customer</button>
                <div className='w-100 bg-light shadow mt-5 p-5 table-responsive'>

                <table className="table table-hover">
                    <tbody>
                        {
                            customers.length >0?
                            customers.map((customer, index)=>{
                                return (
                                <tr key={index}>
                                    <td><div className='d-flex justify-content-center align-items-center fs-3 rounded-circle bg-success text-white text-uppercase' style={{width:"2.5rem", height:"2.5rem"}}> {customer.cname[0]} </div></td>
                                    <td className='fw-bold align-middle'>{customer.cname}</td>
                                    <td className='align-middle'>{customer.email}</td>
                                    <td className='align-middle'>{customer.phone}</td>
                                    <td className='align-middle'>{customer.address}</td>
                                    <td className='cursor-pointer'>
                                        <button className='btn btn-primary' onClick={()=>{updateCustomer(customer)}}><i className='fa fa-edit'></i></button>
                                    </td>
                                </tr>)
                            })
                            :
                            <tr><td className='w-100'>No customers</td></tr>
                        }
                    </tbody>
                </table>
                </div>
            </div>
        </div>
        }
        {/* model */}

        {/* <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal" id="open-model" ></button> */}
            <div className="modal" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
                <div className="modal-dialog">
                    <form onSubmit={saveCustomer}>
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add new Customer</h5>
                    </div>
                    <div className="modal-body">
                        <table>
                            <tbody>
                                <tr>
                                    <td className='w-50 align-baseline' ><label className='form-control-placeholder'>Customer Name</label></td>
                                    <td>
                                        <input type="text" className={`form-control ${errors.cnameinput? "is-invalid":""}`} name="cnameinput" onChange={handleChange} value={customer.cnameinput}></input>
                                        {errors.cnameinput &&<div className="alert-danger my-3 p-2">{errors.cnameinput}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='w-50 align-baseline' ><label className='form-control-placeholder'>Email</label></td>
                                    <td>
                                        <input type="email" className={`form-control ${errors.cemailinput? "is-invalid":""}`} name="cemailinput" onChange={handleChange} value={customer.cemailinput}></input>
                                        {errors.cemailinput &&<div className="alert-danger my-3 p-2">{errors.cemailinput}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='w-50 align-baseline' ><label className='form-control-placeholder'>Phone Number</label></td>
                                    <td>
                                        <input type="number" className={`form-control ${errors.cphoneinput? "is-invalid":""}`} name="cphoneinput" onChange={handleChange} value={customer.cphoneinput}></input>
                                        {errors.cphoneinput &&<div className="alert-danger my-3 p-2">{errors.cphoneinput}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='w-50 align-baseline' ><label className='form-control-placeholder'>Address</label></td>
                                    <td>
                                        <textarea className={`form-control ${errors.caddressinput? "is-invalid":""}`} name="caddressinput" onChange={handleChange} value={customer.caddressinput}></textarea>
                                        {errors.caddressinput &&<div className="alert-danger my-3 p-2">{errors.caddressinput}</div>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={(e)=>{handleModelClose(e)}}>Close</button>
                        <button type="submit" className="btn btn-primary" >Save</button>
                        <button type="submit" className="btn btn-primary d-none" data-bs-dismiss="modal" id="closeModel" >Save</button>
                    </div>
                    </div>
                    </form>
                </div>
            </div>
            {/* update model */}
            <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#updateModel" id="update-open-model" ></button>
            <div className="modal" id="updateModel" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
                <div className="modal-dialog">
                    <form onSubmit={saveUpdatedCustomer}>
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">update Customer</h5>
                    </div>
                    <div className="modal-body">
                        <table>
                            <tbody>
                                <tr>
                                    <td className='w-50 align-baseline' ><label className='form-control-placeholder'>Customer Name</label></td>
                                    <td>
                                        <input type="text" className={`form-control ${errors.cnameinput? "is-invalid":""}`} name="cnameinput" onChange={handleChange} value={customer.cnameinput}></input>
                                        {errors.cnameinput &&<div className="alert-danger my-3 p-2">{errors.cnameinput}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='w-50 align-baseline' ><label className='form-control-placeholder'>Email</label></td>
                                    <td>
                                        <input type="email" className={`form-control ${errors.cemailinput? "is-invalid":""}`} name="cemailinput" onChange={handleChange} value={customer.cemailinput}></input>
                                        {errors.cemailinput &&<div className="alert-danger my-3 p-2">{errors.cemailinput}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='w-50 align-baseline' ><label className='form-control-placeholder'>Phone Number</label></td>
                                    <td>
                                        <input type="number" className={`form-control ${errors.cphoneinput? "is-invalid":""}`} name="cphoneinput" onChange={handleChange} value={customer.cphoneinput}></input>
                                        {errors.cphoneinput &&<div className="alert-danger my-3 p-2">{errors.cphoneinput}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='w-50 align-baseline' ><label className='form-control-placeholder'>Address</label></td>
                                    <td>
                                        <textarea className={`form-control ${errors.caddressinput? "is-invalid":""}`} name="caddressinput" onChange={handleChange} value={customer.caddressinput}></textarea>
                                        {errors.caddressinput &&<div className="alert-danger my-3 p-2">{errors.caddressinput}</div>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary" >Update</button>
                        <button type="button" className="btn btn-primary d-none" data-bs-dismiss="modal" id="closeModel" >Save</button>
                    </div>
                    </div>
                    </form>
                </div>
            </div>
    </section>
</div>
)
}

export default Customers