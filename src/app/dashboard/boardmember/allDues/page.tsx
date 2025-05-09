"use client"
import Navbar from '@/components/layout/dashboard/Navbar';
import Sidebar from '@/components/layout/dashboard/Sidebar';
import ProtectedPage from '@/components/ProtectedPage';
import AdminDues from '@/components/ui/dashboard/AdminDues';
import UsersApproval from '@/components/ui/dashboard/UsersApproval';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [isNavClosed, setIsNavClosed] = useState(false);
    const responsiveBreakpoint = 991;
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= responsiveBreakpoint) {
                setIsNavClosed(true);
            } else {
                setIsNavClosed(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const toggleNav = () => {
        setIsNavClosed(!isNavClosed);
    };
    return (
        <ProtectedPage allowedRoles={['board member']}>
            <section className={`myheader ${isNavClosed ? 'nav-closed' : ''}`}>
                <div className="">
                    <Navbar toggleNav={toggleNav} />
                    <div className="">
                        <div className="main">
                            <Sidebar isNavClosed={isNavClosed} />
                            <div className="page-content" onClick={() => setIsNavClosed(window.innerWidth <= responsiveBreakpoint ? true : false)}>
                                <AdminDues />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedPage>
    )
}

export default page
