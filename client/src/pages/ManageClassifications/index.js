import { Container } from "reactstrap";

import Breadcrumbs from '../../components/Common/Breadcrumb';
import CPCUpload from "./Components/CPCUpload ";

export default function index() {

    return (
        <div className='page-content'>
            <Breadcrumbs title="Classification Search" />
            <Container fluid>

                <CPCUpload />
            </Container>
        </div>
    )
}
