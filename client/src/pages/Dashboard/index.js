import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/Common/Breadcrumb";


const Dashboard = (props) => {
  document.title = "Dashboard | mytool Admin";


  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title={props.t("Dashboards")}
          breadcrumbItem={props.t("Dashboard")}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Row className="align-items-center">
            {/* <AnimatedHeader /> */}

              {/* <motion.img
                src={sampleImage}
                alt="Dashboard Illustration"
                className="img-fluid"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ maxHeight: "420px", borderRadius: "1rem" }}
              /> */}


          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(Dashboard);













// import PropTypes from "prop-types";
// import React from "react";
// import { Container} from "reactstrap";

// //Import Breadcrumb
// import Breadcrumbs from "../../components/Common/Breadcrumb";

// //i18n
// import { withTranslation } from "react-i18next";

// const Dashboard = props => {
//   //meta title
//   document.title = "Dashboard | mytool Admin";

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <Breadcrumbs
//             title={props.t("Dashboards")}
//             breadcrumbItem={props.t("Dashboard")}
//           />

//         </Container>
//       </div>

   
//     </React.Fragment>
//   );
// };

// Dashboard.propTypes = {
//   t: PropTypes.any,
//   chartsData: PropTypes.any,
//   onGetChartsData: PropTypes.func,
// };

// export default withTranslation()(Dashboard);
