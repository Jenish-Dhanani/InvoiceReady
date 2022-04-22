import React from 'react'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "./Dashboard-sidebar"
import DashboardNav from "./Dashboard-nav"
import { deleteInvoice, getcustomers, getInvoices } from '../services'
import moment from 'moment'

const Invoices = ({width, navExpanded, setNavExpanded, notify}) => {

const [isPending, setIsPending] = useState(true)
const [user,setUser] = useState({})
const [Invoices, setInvoices] = useState([])
const [customers, setCustomers] = useState([])

useEffect(async ()=>{
    setUser(JSON.parse(sessionStorage.getItem('user')))

    async function getData (){
        await getcustomers().then((list)=>{
            setCustomers(list.data)
        }).catch(error=>console.error(error))

        await getInvoices().then((list)=>{
            setInvoices(list.data)
            setIsPending(false)
        }).catch(error=>console.error(error))
    }
    await getData()
},[])


useEffect(()=>{
},[Invoices])

const navigate = useNavigate();
const handleLogout = () => {
sessionStorage.clear();
navigate("/");
};

const getCname = (invoice)=>{
    return customers.find(o => o._id === invoice.customerid).cname
}

const handleUpdate=(invoice)=>{
    // console.log(invoice)
    navigate(`/invoice/modify/${invoice._id}`)
}

const handleDelete = (invoice)=>{
    setIsPending(true)
    deleteInvoice(invoice._id).then((res)=>{
        if(res.data){
            setInvoices(res.data)
            setIsPending(false)
            notify("Invoice Deleted Successfully")
        }
    })
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
            {/* dashboard tiles */}
            {
                customers &&(<div className="container min-vh-100">
                <h3 className="title my-5">Invoices</h3>
                <div className='w-100 bg-light shadow mt-5 table-responsive'>
                <table className="table table-hover">
                    <thead>
                        <tr className='bg-primary text-light'>
                            <th scope="col">Invoice Id</th>
                            <th scope="col">client</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Date</th>
                            {/* <th scope="col">Status</th> */}
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Invoices.length > 0?
                            Invoices.map((invoice, index)=>{
                                return (
                                <tr key={index}>
                                    <td className='fw-bolder'>{invoice.invoiceno}</td>
                                    <td>
                                        {
                                            getCname(invoice)
                                        }
                                    </td>
                                    <td className='fw-bold'>{invoice.totalAmount}</td>
                                    <td>{moment(invoice.date).format('DD-MM-YYYY')}</td>
                                    {/* <td className={`${invoice.status==='unpaid'?'text-danger fw-bolder':'bg-success'}`}>{invoice.status}</td> */}
                                    <td className='cursor-pointer'>
                                        <i className="fa fa-edit" onClick={()=>{handleUpdate(invoice)}}></i>
                                    </td>
                                    <td className='cursor-pointer' onClick={()=>handleDelete(invoice)}>
                                        <i className="fas fa-trash"></i>
                                    </td>
                                </tr>)
                            }):<tr><td colSpan={7}>No inoices.</td></tr>
                        }
                    </tbody>
                </table>
                </div>
            </div>)
            }
        </div>
        }

    </section>
</div>
)
}

export default Invoices