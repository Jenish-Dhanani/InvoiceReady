import { NavLink, Link } from "react-router-dom"
const Sidebar = ({navExpanded,handleLogout,user})=>{

    return (
            <nav className="navbar navbar-expand flex-column text-white bg-dark position-absolute shadow-lg sidenav"
                style={navExpanded? { left:"-280px"}: { left:"0px"}}>
                <div className="d-flex w-100 mb-3 justify-content-center align-items-center">
                    <div className="mx-3 w-100 fs-1 text-success"></div>
                </div>
                <ul className="nav nav-pills flex-column mb-auto">

                    <NavLink className={(navData)=>navData.isActive?"text-light bg-secondary":"text-light" + " text-decoration-none"} to="/dashboard">
                        <li className="nav-item my-link fs-4 p-2">
                            <i className="fas fa-grip-horizontal"></i><br/><span>Dashboard</span>
                        </li>
                    </NavLink>
                    <NavLink className={(navData)=>navData.isActive?"text-light bg-secondary":"text-light" + " text-decoration-none"} to="/invoice">
                        <li className="nav-item my-link fs-4 p-2">
                                <i className="fa fa-plus"></i><br/><span>Create</span>
                        </li>
                    </NavLink>
                    <NavLink className={(navData)=>navData.isActive?"text-light bg-secondary":"text-light" + " text-decoration-none"} to="/invoices">
                        <li className="nav-item my-link fs-4 p-2">
                                <i className="fas fa-file-invoice-dollar"></i><br/><span>Invoices</span>
                        </li>
                    </NavLink>
                    <NavLink className={(navData)=>navData.isActive?"text-light bg-secondary":"text-light" + " text-decoration-none"} to="/customers">
                        <li className="nav-item my-link fs-4 p-2">
                                <i className="fas fa-users "></i><br/><span>Customers</span>
                        </li>
                    </NavLink>
                </ul>

                <Link to="/profile" className="text-white text-decoration-none">
                    <div className="bg-secondary p-3 rounded d-flex fs-5 justify-content-center align-items-center m-3 cursor-pointer shadow-lg text-truncate"
                        style={{width:"245px"}}
                        data-toggle="tooltip" data-placement="top" title="Profile">
                        <div className="">
                            <img src="https://picsum.photos/50/50?random=1" alt="" className="rounded-circle" />
                        </div>
                        <div className="ms-3 text-truncate">
                            <span>{user?.fname+ " "+ user?.lname}</span>
                        </div>
                    </div>
                </Link>
                <div className="d-flex w-100 mb-3 justify-content-center align-items-center">
                    <div className="mx-3 w-100 btn btn-danger" onClick={()=>handleLogout()}>Logout</div>
                </div>
            </nav>
    )
}

export {Sidebar}