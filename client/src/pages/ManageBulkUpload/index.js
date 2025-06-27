import React from 'react'
import { Container } from 'reactstrap';
import BulkPatentExcel from './Components/BulkPatentExcel';


const index = () => {
    return (
        <div className='page-content'>
            <Container fluid>

                <BulkPatentExcel />

            </Container>

        </div>
    )
}

export default index;
