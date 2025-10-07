import React from "react";
import { Row, Col, Spinner, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { motion } from "framer-motion";
import PatentLookup from "../PatentLookup";
import EspaceComp from "../EspaceComp";
import LensData from "../LensData";
import { useSelector } from "react-redux";

const QuickPatentSearch = ({
  patentSlice,
  patentNumber,
  setPatentNumber,
  handleSubmit,
  setShowAlert,
  showAlert,
  alertType,
  customAlertMessage,
  loading,
  activeTab1,
  toggle1
}) => {

  const sliceLoading = useSelector(state => state.patentSlice.patentLoading);


  return (
    <TabPane tabId="1">
      <div className="p-4 bg-light rounded shadow-sm">
        <form
          onSubmit={(e) => {
            setShowAlert(false);
            handleSubmit(e);
          }}
        >
          <div className="mb-3">
            <label className="form-label fw-semibold">Enter Patent Number:</label>
            <input
              type="text"
              value={patentNumber?.trim()}
              onChange={(e) => setPatentNumber(e.target.value)}
              className={`form-control`}
              placeholder="(e.g., WO2007067176A2)"
            />
          </div>

          <Row className="align-items-center">
            <Col md="9" className="mb-2 mb-md-0">
              {showAlert && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`alert m-0 text-center d-flex align-items-center h-100 ${alertType === "success" ? "alert-success" : "alert-danger"}`}
                  style={{ minHeight: "42px" }}
                >
                  {customAlertMessage}
                </motion.div>
              )}
            </Col>
            <Col md="3" className="text-md-end text-center d-flex justify-content-md-end justify-content-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn btn-success d-inline-flex align-items-center justify-content-center px-3"
                disabled={loading}
                style={{ minWidth: loading ? "130px" : "auto", transition: "min-width 0.2s ease" }}
              >
                {loading && <Spinner size="sm" color="light" className="me-2" />}
                {loading ? "Searching..." : "Search"}
              </motion.button>
            </Col>
          </Row>
        </form>
      </div>

      {
        sliceLoading === false &&
        <>
          <Nav pills className="navtab-bg nav-justified my-4">
            {[
              { id: "5", label: "Espacenet Result" },
              { id: "6", label: "Lens Result" },
              { id: "7", label: "Google Result" },
              // { id: "8", label: "Free Ptn Result" }
            ].map(({ id, label }) => (
              <NavItem key={id}>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({ active: activeTab1 === id })}
                  onClick={() => toggle1(id)}
                >
                  <span className="d-none d-sm-block">
                    {label} {activeTab1 === id && <i className="fas fa-search ms-1"></i>}
                  </span>
                </NavLink>
              </NavItem>
            ))}
          </Nav>

          <TabContent activeTab={activeTab1}>
            <TabPane tabId="5">
              <motion.div
                key="google"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <EspaceComp data={patentSlice?.espaceApiData} />
               
              </motion.div>
            </TabPane>
            <TabPane tabId="6"> <LensData /></TabPane>
            <TabPane tabId="7"><PatentLookup /></TabPane>
            <TabPane tabId="8"><p className="text-center">Coming Soon...</p></TabPane>
          </TabContent>
        </>
      }
      {
        sliceLoading === true &&
        <>
          <div className="d-flex justify-content-center mt-4">
            <Spinner size="md" color="light" className="me-2" />
          </div>
        </>
      }

    </TabPane>
  );
};

export default QuickPatentSearch;
