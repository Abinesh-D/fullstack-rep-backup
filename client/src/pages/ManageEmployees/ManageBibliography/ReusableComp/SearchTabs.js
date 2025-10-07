import { Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";

const SearchTabs = ({ activeTab, toggleTab }) => (
  <Nav tabs className="nav-tabs-custom nav-justified mb-4">
    {[
      { id: "1", label: "Quick Patent Search", icon: "fas fa-search" },
      { id: "2", label: "Normal Patent Search", icon: "fas fa-search-plus" }
    ].map(({ id, label, icon }) => (
      <NavItem key={id}>
        <NavLink
          style={{ cursor: "pointer" }}
          className={classnames({ active: activeTab === id })}
          onClick={() => toggleTab(id)}
        >
          <span className="d-block d-sm-none"><i className={icon}></i></span>
          <span className="d-none d-sm-block">{label}</span>
        </NavLink>
      </NavItem>
    ))}
  </Nav>
);

export default SearchTabs;
