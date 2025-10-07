import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import Consversation from './Component/Conversation';


const Index = () => {

    return (
        <div className="page-content">
            <Container fluid>
                {/* <Row> */}
                    {/* <Col lg="12">
                        <Card>
                            <CardBody>
                                <Consversation />
                                

                            </CardBody>
                        </Card>
                    </Col> */}
                    <Consversation />
                {/* </Row> */}
            </Container>
        </div>
    );
};

export default Index;
