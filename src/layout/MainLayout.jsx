import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Topbar from './Topbar'
import Footer from './Footer'

const MainLayout = () => {
    return (
        <>
            <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
            
                {/* <Topbar /> */}
                <Sidebar />

                <div className="body-wrapper">

                    <Header />


                        <div className="body-wrapper-inner">
                            <div className="container-fluid">
                            
                                <div className="row">

                                    <Outlet />
                                </div>


                                <Footer />
                            </div>

                        </div>




                </div>
            </div>
        </>
    )
}

export default MainLayout