import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from "reactstrap";

const Breadcrumbs = ({
  title,
  isBackButtonEnable,
  gotoBack,
  enableButton,
  btnLabel1Style,
  btnLabel2Style,
  btnLabel1Fun,
  btnLabel2Fun,
  btnLabel1,
  btnLabel2,
  labelName
}) => {


  return (
    <React.Fragment>
      <Row className='my-3'>
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div className="mb-0 mt-2 m-2 font-size-14 fw-bold">{title}</div>
          </div>
        </Col>
        {isBackButtonEnable && (
          <Col className='d-flex align-items-center justify-content-end gap-1 mx-2'>
            {enableButton && (
              <>
                <button className={btnLabel1Style} onClick={btnLabel1Fun}>
                  {btnLabel1}
                </button>
                <button className={btnLabel2Style} onClick={btnLabel2Fun}>
                  {btnLabel2}
                </button>
              </>
            )}
            <button
              className='btn btn-outline-primary btn-sm'
              color="primary me-2"
              onClick={gotoBack}
            >
              {labelName} <i className="mdi mdi-arrow-left"></i>
            </button>
          </Col>
        )}
      </Row>
    </React.Fragment>
  );
};

Breadcrumbs.propTypes = {
  title: PropTypes.string.isRequired,
  isBackButtonEnable: PropTypes.bool,
  gotoBack: PropTypes.func,
  enableButton: PropTypes.bool,
  btnLabel1Style: PropTypes.string,
  btnLabel2Style: PropTypes.string,
  btnLabel1Fun: PropTypes.func,
  btnLabel2Fun: PropTypes.func,
  btnLabel1: PropTypes.string,
  btnLabel2: PropTypes.string,
  labelName: PropTypes.string,
};

export default Breadcrumbs;

