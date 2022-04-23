import './App.css';
import { useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom"
import { Login } from './components/Login.component'
import { Signup } from './components/Signup.component'
import { Dashboard } from './components/Dashboard-component'
import { Invoice } from './components/Invoice.component'
import { PrivateRouter , isAuthenticated } from './services/PrivateRoute'
import Customers from './components/Customers.component';
import { ToastContainer, toast } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import Invoices from './components/Invoices.component';
import { ModifyInvoice } from './components/Modify.invoice.component';
import PageNotFound from './components/PageNotFound';
import { Profile } from './components/Profile.component';
import { Landing } from './components/Landing.component';
if (typeof window !== "undefined") {
  injectStyle();
}

function App() {

  const [isLogin, setIsLogin] = useState(isAuthenticated());
  //const userInfo = sessionStorage.getItem("userData");
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);

  const [navExpanded, setNavExpanded] = useState(true)

  function notify(msg) {
    toast.dark(msg);
  }

  return (
      <Router>
        <div className="App">
              <Routes>
                {/* <Route exact path='/' element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />} /> */}
                <Route exact path='/' element={<Landing />} />
                <Route path="/sign-in" element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />} />
                <Route path="/sign-up" element={<Signup notify={notify}/>} />

                <Route element={<PrivateRouter/>}>
                  <Route path="/dashboard" element ={<Dashboard width={width} navExpanded={navExpanded} setNavExpanded={setNavExpanded}  />}/>
                  <Route path="/invoice" element ={<Invoice width={width} navExpanded={navExpanded} notify={notify} setNavExpanded={setNavExpanded} />}/>
                  <Route path="/invoice/modify/:id" element ={<ModifyInvoice width={width} navExpanded={navExpanded} notify={notify} setNavExpanded={setNavExpanded} />}/>
                  <Route path="/customers" element ={<Customers width={width} navExpanded={navExpanded} notify={notify} setNavExpanded={setNavExpanded} />}/>
                  <Route path="/invoices" element ={<Invoices width={width} navExpanded={navExpanded} notify={notify} setNavExpanded={setNavExpanded} />}/>
                  <Route path="/profile" element ={<Profile width={width} navExpanded={navExpanded} notify={notify} setNavExpanded={setNavExpanded} />}/>
                </Route>
                <Route path="*" element={<PageNotFound/>} />
              </Routes>
              <ToastContainer />
          </div>
      </Router>
  );
}

export default App;
