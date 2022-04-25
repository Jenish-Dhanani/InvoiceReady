import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { dashboardData } from "../services"
import { Sidebar } from "./Dashboard-sidebar"
import "./Dashboard-component.css"
import DashboardNav from "./Dashboard-nav"


function Dashboard({width, navExpanded, setNavExpanded}){
const [isPending, setIsPending] = useState(true)
const [user,setUser] = useState({})
const [dashboardTiles,setDasboardTiles] = useState([])
useEffect(()=>{
    setUser(JSON.parse(sessionStorage.getItem('user')))
    dashboardData().then((res)=>{
        if(res){
            setDasboardTiles(res.data)
            setIsPending(false)
        }
    })
},[])

const navigate = useNavigate();
const handleLogout = () => {
  sessionStorage.clear();
  navigate("/");
};


return (
    <div>

        <section className="w-100" style={{height:"100vh", maxHeight:"100vh",overflowY:"auto" , backgroundColor:"#eee"}}>
            {width > 768 && <Sidebar navExpanded={navExpanded} handleLogout={handleLogout} user={user}  />}

            <DashboardNav width={width} handleLogout={handleLogout} setNavExpanded={setNavExpanded} navExpanded={navExpanded} user={user}/>

            {
                isPending?
                <div className="d-flex justify-content-center h-100 align-items-center">
                    <div className="spinner-border text-dark" style={{width:"5rem",height:"5rem"}}  role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                :
                <div>
                {/* dashboard tiles */}
                    <div className="container">
                            <h1 className="my-4">Welcome {user?.fname + " " +user?.lname}</h1>
                        <div className="d-flex mt-4 mb-4 fs-4 flex-wrap justify-content-center align-items-center" style={{gap:"1em"}}>
                            {
                                dashboardTiles.map((item,index)=>{
                                    return (<div className="dashboard-tile" key={index}>
                                            <div className={`shadow rounded dashboard-tile-content bg-primary text-light`}>
                                                <span>
                                                    <span className="fw-bolder fs-2">{item.value}</span>
                                                    <br />
                                                    <span className="text-white">{item.name}</span>
                                                </span>
                                            </div>
                                    </div>)
                                })
                            }
                        </div>
                    </div>

                    {/* payment History */}
                    {/* <div className="container d-flex justify-content-center flex-column">
                    <hr />
                        <h1>Payment History</h1>
                        <p>No payment yet</p>
                    </div> */}
                </div>
            }

        </section>
    </div>
)
}

export {Dashboard}