import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Pane from '../components/left_pane/Pane';
import { toast } from 'react-toastify';
import { getCategoryApi } from '../redux/reducers/projectReducer';
import { useAppDispatch } from '../redux/reduxHooks';
import { ICustomErrType } from '../util/config';

// import BottomTab from '../components/BottomTab';
// import ResponsiveItem from '../hoc/ResponsiveItem';
type Props = {}

// const divFunc:React.FC = (props)=> {return <div></div>}


const ManageTemplate = (props: Props) => {
    const dispatch = useAppDispatch();

    const getCat = () => {
        try {
          dispatch(getCategoryApi());
        } catch (e) {
          const error = e as ICustomErrType as any;
          if (error && error.response) {
            toast.error(error.response.data.message);
          }
        }
      };
      useEffect(() => {
        getCat();
      }, []);
    
    return (
        <div>
            {/* <ResponsiveItem component={HeaderHome} mobileComponent={divFunc} /> */}
            <Header />
            <div className="container mt-6">
                <div className="row" >
                    <Pane />
                    <div className="col-lg-9">
                        <Outlet />
                    </div>
                </div>
            </div>
            <Footer />
            {/* <ResponsiveItem component={divFunc} mobileComponent={BottomTab} /> */}
        </div>
    )
}

export default ManageTemplate