
import React, { useEffect } from 'react'
import { Container } from "reactstrap";
import { useDispatch } from "react-redux";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import MappingProjectList from "./components/MappingProjectList";

export default function index() {



    // useEffect(() => {
    //     fetchIncentives();
    //     fetchCaptainMappings();
    // }, []);


    // const fetchIncentives = async () => {
    //     try {
    //         const response = await dispatch(retrieveEmployeeListAPI());
    //         if (response) {

    //         }
    //     } catch (error) {
    //         console.error('Error fetching incentives:', error);
    //     }
    // };

    // const fetchCaptainMappings = async () => {
    //     try {
    //         const formData = { "action": "readAll", };
    //         const data = await dispatch(retrieveCaptainData(formData));
    //         if (data) {
    //             dispatch(setSameCaptainAndWaiter(data));
    //         }
    //     } catch (error) {
    //         console.error('Failed to fetch captain mappings:', error);
    //     }
    // };

    return (
        <div className='page-content'>
            <Breadcrumbs title=" Mapping Project Details" />
            <Container fluid>

                <MappingProjectList />

            </Container>
        </div>
    )
}
