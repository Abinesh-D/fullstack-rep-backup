import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import withRouter from '../../components/Common/withRouter';

//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";

// import logo from "../../assets/images/logo.svg";
// import logoLightPng from "../../assets/images/logo-light.png";
// import logoLightSvg from "../../assets/images/logo-light.svg";
// import logoDark from "../../assets/images/logo-dark.png";

// import McLogoSm from '../../assets/images/mc-logo-sm.png'

const Sidebar = props => {

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/dashboard" className="logo logo-dark">
            <span className="logo-sm">
              {/* <img src={McLogoSm} alt="" height="22" /> */}
            </span>
            <span className="logo-lg">
            </span>
          </Link>

          <a href="https://mcresearch.co.in/" target="_blank" rel="noopener noreferrer" className="logo logo-light">
            <span className="logo-sm" >
            </span>
            <span className="logo-lg me-4">
            </span>
          </a>




          {/* <Link to="/dashboard" className="logo logo-light">
            <span className="logo-sm">
              <img src={MClogotransparent} alt="" height="40" />
            </span>
            <span className="logo-lg">
              <img src={MClogo} alt="" height="40" />
            </span>
          </Link> */}
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));

