import {NavLink, Link} from 'react-router-dom'

const DashboardNav = ({width, handleLogout,setNavExpanded,navExpanded,user }) => {
  return (
    <nav className="navbar navbar-expand-md text-light position-static bg-dark">
                <div className="container-fluid">
                    <div className={`${width<768?'w-100 d-flex justify-content-between':''}`}>
                        <h1>InvoiceReady</h1>
                        {width < 768 &&
                        <Link to="/profile" className="text-white text-decoration-none">
                            <div className="bg-secondary p-1 rounded d-flex justify-content-center align-items-center cursor-pointer shadow-lg text-truncate "
                                data-toggle="tooltip" data-placement="top" title="Profile">
                                <div className="text-truncate fs-6">
                                    <i className="fa fa-user" ></i>
                                    {" "}
                                    <span>{user?.fname}</span>
                                </div>
                            </div>
                        </Link>
                        }
                    </div>
                    <div className={` ${width>768? 'ms-auto':'w-100'}`}>
                        {width > 768 ?
                            <button className="btn btn-primary ms-auto" id="menu-btn" onClick={()=>{navExpanded?setNavExpanded(false):setNavExpanded(true)}}>☰</button>
                            :<ul className="navbar-nav flex-row justify-content-between text-light">
                                <li className="nav-item btn">
                                    <NavLink to="/dashboard" className={(navData) => (navData.isActive ? 'text-danger' : 'text-white')}><i className="fas fa-grip-horizontal fs-1"></i></NavLink>
                                </li>
                                <li className="nav-item btn">
                                    <NavLink to="/invoice" className={(navData) => (navData.isActive ? 'text-danger' : 'text-white')}><i className="fa fa-plus fs-1" ></i></NavLink>
                                </li>
                                <li className="nav-item btn">
                                    <NavLink to="/invoices" className={(navData) => (navData.isActive ? 'text-danger' : 'text-white')}><i className="fas fa-file-invoice-dollar fs-1"></i></NavLink>
                                </li>
                                <li className="nav-item btn">
                                    <NavLink to="/customers" className={(navData) => (navData.isActive ? 'text-danger' : 'text-white')}><i className="fas fa-users fs-1"></i></NavLink>
                                </li>
                                <li className="nav-item btn" onClick={()=>{handleLogout()}}>
                                    <i className="fas fa-sign-out-alt text-light fs-1"></i>
                                </li>
                            </ul>
                        }

                    </div>
                </div>
            </nav>
  )
}

export default DashboardNav