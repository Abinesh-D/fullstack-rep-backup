import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from './Components/TableContainer';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleFlowChartCreate = () => {
    navigate('/create-flow-chart');
  };

  return (
    <div className="page-content">
      <Row className="me-1">
        <Col>
          <Breadcrumbs title="Flow Charts" />
        </Col>
        <Col className="d-flex align-items-center justify-content-end">
          <button className="btn btn-primary" onClick={handleFlowChartCreate}>
            Create Flow Chart
          </button>
        </Col>
      </Row>

      <Container fluid>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <TableContainer
                  isPagination={true}
                  columns={[]}
                  data={[]}
                  isGlobalFilter={true}
                  isShowingPageLength={true}
                  isCustomPageSizeOptions={true}
                  customPageSize={10}
                  tableClass="table align-middle table-nowrap table-hover"
                  theadClass="table-light"
                  paginationDiv="col-sm-12 col-md-7"
                  pagination="pagination pagination-rounded justify-content-start mt-4"
                  filteredValue={[]}
                  setFilter={[]}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Index;
