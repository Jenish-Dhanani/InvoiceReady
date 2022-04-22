import axios from "axios"


axios.defaults.baseURL="/"

const signupToServer= (userDetails)=>{
    return axios.post("signup", userDetails)
}

const login= (userDetails)=>{
    return axios.post("signin", userDetails)
}

const getuser = ()=>{
    return axios.get("user",{
        headers:{'Authorization':"Bearer "+sessionStorage.getItem('token')}
    })
}

const getcustomers = ()=>{
    return axios.get("customers",{
        headers:{'Authorization':"Bearer "+sessionStorage.getItem('token')}
    })
}

const getInvoice = (id)=>{
    return axios.get(`invoice/${id}`,{
        headers:{'Authorization':"Bearer "+sessionStorage.getItem('token')}
    })
}

const getInvoices = ()=>{
    return axios.get("invoice/all",{
        headers:{'Authorization':"Bearer "+sessionStorage.getItem('token')}
    })
}

const updateInvoice = (data)=>{
    return axios.put("invoice/",data, {
        headers:{'Authorization':"Bearer "+sessionStorage.getItem('token')}
    })
}

const getInvoiceNumber = ()=>{
    return axios.get('invoice/getnumber',{
        headers:{'Authorization':"Bearer "+sessionStorage.getItem('token')}
    })
}

const addInvoice = (invoice)=>{
    return axios.post('invoice/add',invoice,{
        headers:{'Authorization':"Bearer "+sessionStorage.getItem('token')}
    })
}

const addCustomer = (data)=>{
    let customer = {
        cname:data.cnameinput,
        email:data.cemailinput,
        phone:data.cphoneinput,
        address:data.caddressinput
    }
    return axios.post('customers/add', customer, {
        headers:{'Authorization':"Bearer "+sessionStorage.getItem('token')}
    })
}

const deleteInvoice = (invoiceId)=>{
    return axios.delete(`invoice/delete/${invoiceId}`,{
        headers:{'Authorization':"Bearer "+sessionStorage.getItem('token')}
    })
}

const saveCustomerTodb = (customer)=>{
    return axios.put('/customer',customer,{
        headers:{'Authorization':"Bearer "+sessionStorage.getItem('token')}
    })
}

const updateUser = (user)=>{
    return axios.put('/user/',user,{
        headers:{'Authorization':"Bearer "+sessionStorage.getItem('token')}
    })
}

const dashboardData = ()=>{
    return axios.get('/dashboard',{
        headers:{'Authorization':"Bearer "+sessionStorage.getItem('token')}
    })
}

export {signupToServer, login, getuser, getcustomers, getInvoiceNumber,addInvoice, getInvoices, addCustomer,deleteInvoice,saveCustomerTodb, getInvoice, updateInvoice, dashboardData,updateUser}