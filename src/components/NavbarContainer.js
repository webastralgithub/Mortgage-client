import "./NavbarContainer.css";
const NavbarContainer = () => {
  return (
    <div className="top-navbar">
      <div className="separator" />
      <div className="search-group">
       <input type="text" placeholder="Search here"/>
       <img src="search.svg" />
      </div>
      <div className="profile-parent">
        <div className="profile3">
          <div className="hello-samantha">
            <span>{`Hello, `}</span>
            <span className="samantha">Admin</span>
          </div>
        </div>
        <div className="avatar3">
          <img className="placeholder-icon3" alt="" src="/placeholder@2x.png" />
        </div>
      </div>
      <div className="icon-dashboard">
        <div className="icon-dashboard-child" />
        <div className="icon-dashboard-item" />
        <img className="icon-dashboard1" alt="" src="/icon-dashboard.svg" />
        <img className="icon-dashboard2" alt="" src="/icon-dashboard1.svg" />
        <div className="background-group">
          <div className="background6" />
          <div className="div3">21</div>
        </div>
      </div>
    </div>
  );
};

export default NavbarContainer;
