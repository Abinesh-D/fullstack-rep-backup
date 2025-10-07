
import React from 'react'
import { Container } from "reactstrap";

import Breadcrumbs from '../../components/Common/Breadcrumb';
import PatentReferenceTabs from './Component/PatentReferenceTabs';


export default function index() {


    return (
        <div className='page-content'>
            <Breadcrumbs title="Prior Format" />
            <Container fluid>
                <PatentReferenceTabs />

            </Container>
        </div>
    )
};
