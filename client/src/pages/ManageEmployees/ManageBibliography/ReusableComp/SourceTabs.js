const SourceTabs = ({ activeTab, toggle }) => {
    const sources = [
      { id: "5", label: "Google Result" },
      { id: "6", label: "Espacenet Result" },
      { id: "7", label: "Lens Org Result" },
      { id: "8", label: "Patent Free Result" }
    ];
  
    return (
      <Nav pills className="navtab-bg nav-justified my-4">
        {sources.map(({ id, label }) => (
          <NavItem key={id}>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({ active: activeTab === id })}
              onClick={() => toggle(id)}
            >
              <span className="d-none d-sm-block">
                {label} {activeTab === id && <i className="fas fa-search ms-1"></i>}
              </span>
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    );
  };
  
  export default SourceTabs;
  