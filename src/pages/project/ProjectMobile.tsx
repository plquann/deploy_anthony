import React, { useEffect } from 'react'
import { DispatchType, RootState } from '../../redux/configStore'
import { useDispatch, useSelector } from 'react-redux'
import { getProjectApi, ProjectModel } from '../../redux/reducers/projectReducer'
import { NavLink } from 'react-router-dom'

type Props = {}

const ProjectMobile:React.FC = (props: Props):JSX.Element => {
    const { arrProject } = useSelector((state: RootState) => state.projectReducer)
    const dispatch: DispatchType = useDispatch();
    console.log(arrProject);
    useEffect(() => {
        const actionAsync = getProjectApi();
        dispatch(actionAsync);
    }, []);
    //-------ui----------
    const renderProject = () => {
        let arrJSX: JSX.Element[] = [];

        for (let i = 0; i < 5; i += 1) {
            const jsx: JSX.Element = <div className='row' key={i}>
                <div className='col-5'>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                </div>
                <div className='col-7'>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                </div>               
            </div>
            arrJSX.push(jsx);
        };
        return arrJSX;
    }

    return (
        <div className='container'>
            {renderProject()}
        </div>
    )
}


export default ProjectMobile