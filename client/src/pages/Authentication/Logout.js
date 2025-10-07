import React, { useEffect } from "react";
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";

//redux
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const history = useNavigate();
  
  useEffect(() => {
    localStorage.clear();

    history("/login")
  }, []);

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);