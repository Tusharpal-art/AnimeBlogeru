import {Link} from 'react-router-dom'

function Sidebar(){
    return(
        <aside className='asidebar'>
           <Link to={"/dashboard"} className='nav-link text-white'><p>Dashboard</p></Link>  
           <Link to={"/dashboard/addpost"} className='nav-link text-white'> <p>Add Blog</p></Link> 
            <Link to={"/dashboard/allpost"} className='nav-link text-white'><p>All Blog</p></Link> 
            <Link to={"/dashboard/users"} className='nav-link text-white'><p>All User</p></Link> 
             
        </aside>
    )
}

export default Sidebar