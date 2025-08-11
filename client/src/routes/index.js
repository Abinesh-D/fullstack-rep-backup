import React from "react";
import { Navigate } from "react-router-dom";

// Profile
import UserProfile from "../pages/Authentication/user-profile";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

//  // Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login";


import Login2 from "../pages/AuthenticationInner/Login2";
import LoginPage from "../pages/AuthenticationInner/LoginPage";




import Register1 from "../pages/AuthenticationInner/Register";
import Register2 from "../pages/AuthenticationInner/Register2";
import Recoverpw from "../pages/AuthenticationInner/Recoverpw";
import Recoverpw2 from "../pages/AuthenticationInner/Recoverpw2";
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";
import ForgetPwd2 from "../pages/AuthenticationInner/ForgetPassword2";
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen";
import LockScreen2 from "../pages/AuthenticationInner/auth-lock-screen-2";
import ConfirmMail from "../pages/AuthenticationInner/page-confirm-mail";
import ConfirmMail2 from "../pages/AuthenticationInner/page-confirm-mail-2";
import EmailVerification from "../pages/AuthenticationInner/auth-email-verification";
import EmailVerification2 from "../pages/AuthenticationInner/auth-email-verification-2";
import TwostepVerification from "../pages/AuthenticationInner/auth-two-step-verification";
import TwostepVerification2 from "../pages/AuthenticationInner/auth-two-step-verification-2";

// Dashboard
import Dashboard from "../pages/Dashboard/index";

/// Manage Incentive
// import ManageIncentive from '../pages/ManageIncentive/index'
// import CreateIncentive from '../pages/ManageIncentive/CreateIncentive'

/// manage employee
import ManagePatents from '../pages/ManageEmployees/index';
import ManagePrior from '../pages/ManagePriorFormat/index';

// Manage Mapping
import ManageMapping from "../pages/ManageMapping/index";

// manage bulk uload
import ManageBulkUpload from "../pages/ManageBulkUpload/index";


// manage Template
import ManageTemplate from "../pages/ManageTemplate/index";



///manage report
// import ReportTemplate from "../pages/ReportD3";
// import PageTree from "../pages/ReportD3/PageTree";
// import LayoutInfo from "../pages/ReportD3/LayoutInfo";
// import PreviewReport from '../pages/ReportD3/NoRespGridLayOut'

//Manage Users
// import ManageUsers from "../pages/ManageUsers/musr";
// import AddNewUser from '../pages/ManageUsers/AddnewUser'

// Manage Mind Map
import MindMapIndex from '../pages/ManageMindMap/index';
import MindMap from "../pages/ManageMindMap/Components/MindMap";

// Manage Conversation
import ManageChat from '../pages/ManageConversation/index';

// Manage Classification
import ManageClassification from "../pages/ManageClassifications/index";
import MappingProjectCreation from "../pages/ManageMapping/components/MappingProjectCreation";



//Pages
import PagesStarter from "../pages/Utility/pages-starter";
import PagesMaintenance from "../pages/Utility/pages-maintenance";
import PagesComingsoon from "../pages/Utility/pages-comingsoon";
import PagesFaqs from "../pages/Utility/pages-faqs";
import PagesPricing from "../pages/Utility/pages-pricing";
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  // //profile
  { path: "/profile", component: <UserProfile /> },

  //Utility
  { path: "/pages-starter", component: <PagesStarter /> },
  // { path: "/pages-timeline", component: <PagesTimeline /> },
  { path: "/pages-faqs", component: <PagesFaqs /> },
  { path: "/pages-pricing", component: <PagesPricing /> },


  // Manage Employees
  { path: "/manage-patent", component: <ManagePatents /> },
  { path: "/manage-prior-format", component: <ManagePrior /> },

  // Manage Mapping
  { path: "/manage-mapping", component: <ManageMapping /> },
  { path: "/project-mapping-creation", component: <MappingProjectCreation /> },


  // Manage Bulk Upload
  { path: "/manage-bulk-upload", component: <ManageBulkUpload /> },

  // Manage Template
  { path: "/manage-template", component: <ManageTemplate /> },

  
  // Manage Conversation
  { path: "/chat-box", component: <ManageChat /> },

  // Manage Classification
  { path: "/classify-menu", component: <ManageClassification /> },

  /// manage report 
  // { path: "/report", component: <ReportTemplate /> },
  // { path: "/page_tree", component: <PageTree /> },
  // { path: "/report_page", component: <LayoutInfo /> },
  // { path: "/preview-report", component: <PreviewReport /> },


  //manage Users
  // { path:"/add-new-user" , component: <AddNewUser/> },
  // { path: "/murs", component: <ManageUsers/> },


  // Manage Mind Map Flow Chart
  { path: "/mind-map-flow-chart", component: <MindMapIndex /> },
  { path: "/create-flow-chart", component: <MindMap /> },
  





  {
    path: "/",
    exact: true,
    component: <Navigate to="/login" />,
  },
];

const publicRoutes = [
  { path: "/pages-login-2", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },

  { path: "/pages-maintenance", component: <PagesMaintenance /> },
  { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  { path: "/pages-404", component: <Pages404 /> },
  { path: "/pages-500", component: <Pages500 /> },

  // Authentication Inner
  { path: "/pages-login", component: <Login1 /> },
  { path: "/login", component: <Login2 /> },




  { path: "/login-page", component: <LoginPage /> },



  { path: "/pages-register", component: <Register1 /> },
  { path: "/pages-register-2", component: <Register2 /> },
  { path: "/page-recoverpw", component: <Recoverpw /> },
  { path: "/page-recoverpw-2", component: <Recoverpw2 /> },
  { path: "/pages-forgot-pwd", component: <ForgetPwd1 /> },
  { path: "/auth-recoverpw-2", component: <ForgetPwd2 /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
  { path: "/auth-lock-screen-2", component: <LockScreen2 /> },
  { path: "/page-confirm-mail", component: <ConfirmMail /> },
  { path: "/page-confirm-mail-2", component: <ConfirmMail2 /> },
  { path: "/auth-email-verification", component: <EmailVerification /> },
  { path: "/auth-email-verification-2", component: <EmailVerification2 /> },
  { path: "/auth-two-step-verification", component: <TwostepVerification /> },
  { path: "/auth-two-step-verification-2", component: <TwostepVerification2 /> },
];

export { authProtectedRoutes, publicRoutes };
