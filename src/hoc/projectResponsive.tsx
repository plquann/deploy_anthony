import React, { useEffect, useState } from 'react'

type Props = {
    component: React.FC,
    mobileComponent?: React.FC
}

const projectResponsive = (props: Props) => {
    const [screen, setScreen] = useState({
        width: window.innerWidth
    });

    const setScreenUI = () => {
        setScreen({
            width:window.innerWidth
        })
    };
    
    useEffect(() => {
        window.onresize = setScreenUI;
        return () => {
            window.removeEventListener('resize',setScreenUI);
        }
    },[]);
    let Component = props.component;   //mặc định sẽ desktop component
    if(screen.width <768 && props.mobileComponent) {
        Component = props.mobileComponent;
    }
    return (
        <Component />
    )
}

export default projectResponsive