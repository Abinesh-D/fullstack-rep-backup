import React, { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import { Link, } from "react-router-dom";
import withRouter from '../../components/Common/withRouter';
import { withTranslation } from "react-i18next";



const SidebarContent = (props) => {
  const ref = useRef();
  const location = useLocation();

  const activateParentDropdown = useCallback((item) => {
    if (!item) return;

    item.classList.add("active");
    let parent = item.parentElement;

    while (parent) {
      if (parent.tagName === "UL" || parent.tagName === "LI") {
        parent.classList.add("mm-active");
      }
      if (parent.classList.contains("has-arrow")) {
        parent.classList.add("mm-show");
      }
      parent = parent.parentElement;
    }
  }, []);

  const removeActiveClasses = (menuItems) => {
    Array.from(menuItems).forEach((item) => {
      item.classList.remove("active");
      item.closest("li")?.classList.remove("mm-active");
      item.closest("ul")?.classList.remove("mm-show");
    });
  };

  const highlightActiveMenu = useCallback(() => {
    const menuItems = document.querySelectorAll("#side-menu a");
    removeActiveClasses(menuItems);

    const currentPath = location.pathname;

    const matchingMenuItem = Array.from(menuItems).find(
      (item) => item.pathname === currentPath
    );

    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [location.pathname, activateParentDropdown]);

  useEffect(() => {
    new MetisMenu("#side-menu");
    highlightActiveMenu();
  }, [highlightActiveMenu]);

  useEffect(() => {
    highlightActiveMenu();
  }, [location.pathname, highlightActiveMenu]);

  const scrollToActiveItem = (item) => {
    if (item && ref.current) {
      const simpleBar = ref.current.getScrollElement();
      const itemPosition = item.offsetTop;

      if (itemPosition > window.innerHeight) {
        simpleBar.scrollTop = itemPosition - 100;
      }
    }
  };



  const getMenuLinkStyle = (route) => {
    return location.pathname === route
      ? { fontWeight: "bold", color: "#00b894", backgroundColor: "#2A3042" }
      : {};
  };

  const menuItems = [
    {
      path: "/dashboard",
      label: props.t("Dashboard"),
      iconClass: "bx bx-home-circle font-size-20 text-white",
    },
    {
      path: "/manage-patent",
      label: props.t("Manage Automation"),
      iconClass: "bx bx-user-circle font-size-20 text-white",
    },
    {
      path: "/manage-prior-format",
      label: props.t("Prior Format"),
      iconClass: "bx bxs-parking font-size-15 text-white",
    },

    {
      path: "/manage-mapping",
      label: props.t("Manage Mapping"),
      iconClass: "mdi mdi-microsoft-word font-size-15 text-white",
    },


    {
      path: "/manage-bulk-upload",
      label: props.t("Bulk Upload"),
      iconClass: "bx bx-bold font-size-15 text-white",
    },


    // {
    //   path: "/manage-employees",
    //   label: props.t("Manage Employees"),
    //   iconClass: "bx bx-user-circle font-size-20 text-white",
    // },

    {
      path: "/mind-map-flow-chart",
      label: props.t("Manage Mind Map"),
      iconClass: "bx bx-sitemap font-size-20 text-white",
    },

     {
      path: "/chat-box",
      label: props.t("Chat Box"),
      iconClass: "bx bx-chat font-size-20 text-white",
    },

    {
      path: "/classify-menu",
      label: props.t("Classifications"),
      iconClass: "mdi mdi-file-tree font-size-20 text-white",
    },
    {
      path: "/manage-template",
      label: props.t("Template"),
      iconClass: "mdi mdi-microsoft-powerpoint",
    },














    // {
    //   path: "/report",
    //   label: props.t("Manage Report"),
    //   iconClass: "bx bx-line-chart font-size-20 text-white",
    // },
    // {
    //   path: "/murs",
    //   label: props.t("Manage Users"),
    //   iconClass: "bx bx-user font-size-20 text-white",
    // },
  ];

  const getIconStyle = (route) => {
    return location.pathname === route
      ? { fontWeight: "bold", color: "#00b894" }
      : {};
  };

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title text-white">{props.t("Menu")}</li>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link to={item.path} style={getMenuLinkStyle(item.path)}>
                  <i className={item.iconClass} style={getIconStyle(item.path)} ></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));