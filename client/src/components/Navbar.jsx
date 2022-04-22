import { Link } from "react-router-dom"

const Navbar = ()=>{
    return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">InvoiceReady</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse ms-auto" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {/* {(!isLogin || pathname=='/sign-in' || pathname=='/sign-up') &&<> */}
            <li className="nav-item">
              <Link className="nav-link" to="/sign-in">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sign-up">Signup</Link>
            </li>
        </ul>
      </div>
    </div>
    </nav>);
}

export {Navbar}