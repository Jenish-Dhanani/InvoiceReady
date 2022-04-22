import {useNavigate} from 'react-router-dom'

const PageNotFound = ()=>{

    const navigate = useNavigate()

    return (<div className="vh-100 bg-primary text-white d-flex justify-content-center align-items-center text-center">
        <span>
            <span style={{fontSize:"8rem"}}>404</span>
            <br/>
            <span className="fs-1">Page Not Found</span>
            <br/>
            <span className="btn btn-danger mt-4" onClick={()=>{navigate("/dashboard")}}>Go to home.</span>
        </span>
    </div>)
}

export default PageNotFound