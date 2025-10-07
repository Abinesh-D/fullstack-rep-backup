import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import { withTranslation } from "react-i18next";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "../../../components/Common/withRouter";



const ProfileMenu = props => {

  const sessionInfo = useSelector(state => state.sessionInfo)
  var authUser = sessionInfo.authUserInfo

  const [menu, setMenu] = useState(false);
  const [username, setusername] = useState("Admin");
  const [userEmail, setUserEmail] = useState(""); 

  useEffect(() => {
    // if (sessionStorage.getItem("authUser")) {
    //   const obj = JSON.parse(sessionStorage.getItem("authUser"));
    //   setusername(obj.full_name);
    //   setUserEmail(obj.email)
    // }
  }, []);
  

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >

        <DropdownToggle
          className="btn header-item d-flex align-items-center"
          id="page-header-user-dropdown"
          tag="button"
        >
          <div className="rounded-circle avatar-xs header-profile-user d-flex align-items-center justify-content-center bg-primary text-white">
            {authUser.username?.charAt(0).toUpperCase()}
          </div>
          <span className="d-none d-xl-inline-block ms-2 me-1">{authUser?.username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
};

const mapStatetoProps = state => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
