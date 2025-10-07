import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { motion } from "framer-motion";
import ReleventComp from "./ReleventComp";
import RelatedComp from "./RelatedComp";
import './PatentReferenceTabs.css'


const PatentReferenceTabs = ({ espaceData }) => {
  const [activeTab, setActiveTab] = useState("1");

  const tabs = [
    { id: "1", label: "Relevant References", component: <ReleventComp activeTab={activeTab} /> },
    { id: "2", label: "Related References", component: < RelatedComp activeTab={activeTab} /> },
    
  ];

  return (
    <>
      {/* <Nav pills className="navtab-bg nav-justified my-4">
        {tabs.map(({ id, label }) => (
          <NavItem key={id}>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({ active: activeTab === id })}
              onClick={() => setActiveTab(id)}
            >
              <span className="d-none d-sm-block">
                {label} {activeTab === id &&  <i className="fas fa-search ms-1"></i>}
              </span>
            </NavLink>
          </NavItem>
        ))}
      </Nav> */}



      <Nav pills className="navtab-bg nav-justified my-4">
        {tabs.map(({ id, label }) => (
          <NavItem key={id}>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({ active: activeTab === id })}
              onClick={() => setActiveTab(id)}
            >
              <span className="d-none d-sm-block">
                {activeTab === id && id === '1' && <em className="me-2 iconBlock fas fa-lightbulb"></em>}
                {activeTab === id && id === '2' && <em className="me-2 iconBlock fab fa-yandex-international"></em>}
                {label}
              </span>
            </NavLink>
          </NavItem>
        ))}
      </Nav>


      <TabContent activeTab={activeTab}>
        {tabs.map(({ id, component }) => (
          <TabPane key={id} tabId={id}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {component}
            </motion.div>
          </TabPane>
        ))}
      </TabContent>
    </>
  );
};

export default PatentReferenceTabs;
