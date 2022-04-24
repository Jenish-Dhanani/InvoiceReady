import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Invoice.component.css'
import { Sidebar } from "./Dashboard-sidebar"
import DashboardNav from "./Dashboard-nav"
import { getcustomers,getInvoice, updateInvoice } from '../services'

function ModifyInvoice({width, navExpanded, setNavExpanded,notify}){
    const {id} = useParams()
    const [isPending, setIsPending] = useState(true)
    const [user,setUser] = useState({})
    const [customers, setCustomers] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState()
    const [invoiceNumber, setInvoiceNumber]= useState()
    const [isNotChanged, setIsNotChanged] = useState(true)

    const handleSelectCustomer=(event)=>{
        let obj = customers.find(o => o._id === event.target.value);
        setSelectedCustomer(obj)
    }

    useEffect(async ()=>{
        setUser(JSON.parse(sessionStorage.getItem('user')))

        let getedCustomers
        await getcustomers().then((list)=>{
            console.log(list.data)
            getedCustomers = list.data
            setCustomers(list.data)
        }).catch(error=>console.error(error))

        if(id){
            console.log(id)
            await getInvoice(id).then(res=>{
                if(res){
                    setIsPending(false)
                    setFields(res.data.items)
                    let obj = getedCustomers.find(o => o._id === res.data.customerid);
                    console.log(obj)
                    setSelectedCustomer(obj)
                    setInvoiceNumber(res.data.invoiceno)
                    document.getElementById('note').value = res.data.note

                }
            })
        }

    },[])


    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    const [fields, setFields] = useState([]);

    function addRow(){
        const row = [
            {placeholder:"Item Name",name:"itemName",value:"", type:"text"},
            {placeholder:"Unit",name:"Unit",value:0, type :"number"},
            {placeholder:"Amount",name:"Amount",value:0, type :"number"},
            {value:0}
        ];
        setFields([...fields,row]);
        if(isNotChanged) setIsNotChanged(false)
    }
    function deleteRow(index){
        fields.splice(index,1);
        setFields([...fields])
        if(isNotChanged) setIsNotChanged(false)
    }

    const preventMinus = (e) => {
        if (['-', 'Minus', 'NumpadSubtract'].includes(e.code)) {
            e.preventDefault()
        }
    };

    function handlechange(e,trindex,tdindex){
        let valuetoset = e.target.value;
        let copy = [...fields]
        copy[trindex][tdindex].value = valuetoset
        let amount = (copy[trindex][1].value * copy[trindex][2].value)
        copy[trindex][3].value = amount
        setFields(copy)
        if(isNotChanged) setIsNotChanged(false)
    }

    let [amount,setAmount] = useState(0);
    useEffect(()=>{
        let amount =0;
        setFields(
            fields.map((items)=>{
                items[3].value = items[1].value * items[2].value
                amount+=items[3].value
                return items
            })
        )
        setAmount(amount)
    },[])

    useEffect(()=>{
        let amount=0;
        fields.forEach((item)=>amount+=item[3].value)
        setAmount(amount)
    },[fields])

    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log(selectedCustomer)
        if(selectedCustomer===undefined){
            notify("Please select customer.")
        }else if(fields.length===0){
            notify("Please add some product.")
        }else if(amount ===0){
            notify("please add some items and amount should be grater than 0.")
        }
        else{
            let invoice = {
                invoiceId:id,
                items: fields,
                totalAmount:amount,
                note:document.getElementById('note').value,
                status:"unpaid"
            }
            console.log(invoice)
            updateInvoice(invoice).then((res)=>{
                if(res.data){
                    console.log(res.data)
                    notify("Invoice updated Successfully")
                    document.getElementById("open-model").click()
                }
            })
        }
    }

    const handlePrint = ()=>{
        var tempTitle = document.title;
        document.title = invoiceNumber;
        window.print();
        document.title = tempTitle;
    }

    const handleCloseModel = ()=>{
        document.getElementById("closeModel").click()
        navigate('/dashboard')
    }

    return (

    //layout updated
    <div>

        <section className="w-100" style={{height:"100vh", maxHeight:"100vh",overflowY:"auto" , backgroundColor:"#eee"}}>
        {width > 768 && <Sidebar navExpanded={navExpanded} handleLogout={handleLogout} user={user}  />}
        <DashboardNav width={width} handleLogout={handleLogout} setNavExpanded={setNavExpanded} navExpanded={navExpanded}/>
        {
            isPending || customers===undefined ?
            <div className="d-flex justify-content-center h-100 align-items-center">
                <div className="spinner-border text-dark" style={{width:"5rem",height:"5rem"}}  role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            :
            <div>
                {/* old */}
                <div className="container-fluid py-4 h-100 Invoice-wrapper">
                    <div className="d-flex justify-content-center row">
                        <div className="col-11 col-lg-6 shadow p-3 rounded-3 bg-white invoice-main">
                            <div className="p-3">
                                <div className="row">
                                    <div className={`${width>768?'text-start w-50':'text-center'} ps-md-5`}>
                                        <h4 className="text-danger fs-2">InvoiceReady</h4>
                                        <div className="mt-2">
                                            <span>
                                                <span className="fw-bold">{user.cname}</span><br/>
                                                {user.address}<br/>
                                                Gstin: {user.gstin}<br/>
                                                {user.email} </span>
                                            </div>
                                    </div>
                                    <div className={`${width>768?'text-end w-50':'mt-3 text-center'} pe-md-5 `}>
                                        <h1 className="text-uppercase fs-3">Invoice</h1>
                                        <div><span className="fw-bold text-uppercase">Invoice No:</span><span className="ms-2">{invoiceNumber}</span></div>
                                    </div>
                                </div>

                                <hr />
                                <div className="row mt-4 px-4 padding-for-mobile">
                                    <div className="col-7 text-start">
                                        <div><span className="fw-bold">Bill To</span></div>
                                        <div>
                                            <span>

                                                {customers &&
                                                    <select name="customer" id="customer" defaultValue="" className="form-select w-50 mt-2 customer-dropdown" onChange={handleSelectCustomer} value={selectedCustomer?._id} disabled={id} >
                                                        <option value="" disabled> select customer</option>
                                                        {
                                                            customers.map((customer)=>{
                                                                return <option value={customer._id} key={customer._id}>{customer.cname}</option>
                                                            })
                                                        }
                                                    </select>
                                                }
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <div><span>{selectedCustomer?.gstin}</span></div>
                                            <div><span>{selectedCustomer?.email}</span></div>
                                            <div><span>{selectedCustomer?.phone}</span></div>
                                            <div><span>{selectedCustomer?.address}</span></div>
                                        </div>
                                    </div>
                                    <div className="col-5 text-end">
                                        {/* <div className="group">
                                            <div><span className="text-uppercase">Status</span></div>
                                            <div><span className="text-uppercase text-danger fw-bold">Unpaid</span></div>
                                        </div> */}
                                        <div className="group">
                                            <div><span className="text-uppercase">Date</span></div>
                                            <div><span className="text-uppercase fw-bold">{new Date().toLocaleDateString()}</span></div>
                                        </div>
                                        <div className="group">
                                            <div><span className="text-uppercase">Amount</span></div>
                                            <div><span className="text-uppercase fw-bold fs-3">{amount}</span></div>
                                        </div>

                                    </div>
                                </div>
                                <hr />
                                <div className="mt-3">
                                    <div className="table-responsive py-2" >
                                        <table className="table table-striped" style={{minWidth:"600px"}}>
                                            <thead>
                                                <tr className="bg-dark text-light text-start">
                                                    <th>Product</th>
                                                    <th>Unit</th>
                                                    <th>Price</th>
                                                    <th>Total</th>
                                                    <th className="hidden-print">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    fields.length==0?<tr className="alert-danger p-2"><td colSpan={5}>No item</td></tr>:
                                                    fields.map((tr,trindex)=>{
                                                        return (<tr key={trindex}>
                                                            {tr.map((td,tdindex)=>{
                                                                return td.type?<td key={`${trindex} ${tdindex}`}>
                                                                <input type={td.type} value={td.value || ''}
                                                                        placeholder={td.placeholder}
                                                                        name={td.name}
                                                                        min="1"
                                                                        onChange={(event)=>{
                                                                            handlechange(event,trindex,tdindex);
                                                                        }}
                                                                        onKeyPress={preventMinus}
                                                                        onKeyDown={(event)=>{if(td.type ==="number"){
                                                                            (event.keyCode === 69 || event.keyCode === 190 ) && event.preventDefault()
                                                                        }}}
                                                                        style={{"width":"100%", "background": "transparent","border": "none","outline": "none", "maxWidth":"100%" }} />
                                                                </td>:<td key={`${trindex} ${tdindex}`}><span>{td.value}</span></td>
                                                            })}
                                                            <td className="hidden-print" ><button className="btn btn-sm hidden-print" onClick={()=>deleteRow(trindex)}>❌</button></td>
                                                        </tr>)
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <button className="btn btn-primary btn-sm mt-3 add-item-btn" onClick={()=>{addRow()}}>Add item</button>
                                </div>
                                <hr />
                                <div className="row mt-4">
                                    <div className="col text-start fw-bold">
                                        <p>Note/Info</p>
                                        <textarea name="note" id="note" rows="4" style={{width:"100%"}}></textarea>
                                    </div>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-center align-items-center">
                                    <div className="d-flex justify-content-evenly align-item-center mb-3 invoice-save-btn w-50">
                                        {isNotChanged? <>
                                        <button className="btn btn-danger invoice-save-btn" type="button" onClick={handleSubmit}>Save</button>
                                        <button className="btn btn-success invoice-save-btn" type="button" onClick={handlePrint}>Print</button></>
                                        :
                                        <button className="btn btn-danger invoice-save-btn" type="button" onClick={handleSubmit}>Save</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Model */}
                <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal" id="open-model" ></button>

                <div className="modal" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Invoice Saved Successfully.</h5>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModel}>close</button>
                            <button type="button" className="d-none" data-bs-dismiss="modal" id="closeModel">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handlePrint}>Print</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        }
        </section>
    </div>
    )
}

export {ModifyInvoice}