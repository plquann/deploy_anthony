import React from 'react'
import { Outlet } from 'react-router-dom';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
// import BottomTab from '../components/BottomTab';
// import ResponsiveItem from '../hoc/ResponsiveItem';
type Props = {}

// const divFunc:React.FC = (props)=> {return <div></div>}


const LoginTemplate = (props: Props) => {
    return (
        <div>
            {/* <ResponsiveItem component={HeaderHome} mobileComponent={divFunc} /> */}
            <Header />
            <div style={{ minHeight: 600 }}>
                <Outlet />
            </div>
            <Footer />
            {/* <ResponsiveItem component={divFunc} mobileComponent={BottomTab} /> */}
        </div>
    )
}

export default LoginTemplate