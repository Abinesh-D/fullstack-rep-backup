import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Col, Container, Form, Row, Input, Label, FormFeedback, Spinner, Button, Alert } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUserInfo } from "../../Slice/manageSessionSlice";
import { userAuthenticate, verifyShortName, setauthLoad, setInvalidCredentials, setaccActivationErr, confirmNewPwd, setInvalidErrMsg } from "../../Slice/authSlice";



const Login2 = () => {
  const history = useNavigate();
  const dispatch = useDispatch();


  const [errorMsg, setErrorMsg] = useState("");

  const [passwordShow, setPasswordShow] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [alert, setAlert] = useState({ visible: false, message: "", color: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitLoad, setsubmitLoad] = useState(false);

  const countryCodes = [
    { code: "+1", name: "USA" },
    { code: "+44", name: "UK" },
    { code: "+91", name: "India" },
  ];


  const IrSlice = useSelector(state => state.auth);
  const authLoad = IrSlice.authLoad;






  document.title = "Login | mytool Admin";

  useEffect(() => {
    dispatch(setauthLoad(false))
    // dispatch(getConfiguration());
  }, [dispatch]);

  

  // const handleChange = (e) => {
  //   dispatch(invalidAuth(null));
  //   validation.handleChange(e);
  // };



  const handleInputChange = (e) => {
    let value = e.target.value;
    if (/\S+@\S+\.\S+/.test(value)) {
      setIsPhone(false);
    } else if (/^\d+$/.test(value)) {
      setIsPhone(true);
      if (value.length > 10) {
        value = value.slice(0, 10); // Limit to 10 characters
      }
    } else {
      setIsPhone(false);
    }
    validation.setFieldValue("username", value);
  };


  const newPwd = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: '',
      new_password: '',
      confrm_password: ''
    },
    validationSchema: Yup.object({
      new_password: Yup.string()
        .required("Please Enter Your New Password"),
      confrm_password: Yup.string()
        .required("Please Enter Your Confirm Password")
        .oneOf([Yup.ref('new_password'), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      setsubmitLoad(true)
      values["session"] = IrSlice?.pwdSession; // Assuming this is defined
      values["username"] = isPhone ? countryCode + String(validation.values.username) : validation.values.username; // Assuming validation is defined
      values["user_info"] = validation.values.username;
      // values["user_info"] = validation.values.username;
      console.log('newPasswrd values', values)

      // await dispatch(confirmNewPwd(values)); // Assuming confirmNewPwd is defined
      // setsubmitLoad(false)

    }
  });


  const validCredentials = [
    { username: 'Abinesh', password: '12345' },
    { username: 'user2', password: 'password2' },
    { username: 'user3', password: 'password3' },
    { username: 'user4', password: 'password4' },
    { username: 'user5', password: 'password5' },
    { username: 'user6', password: 'password6' },
    { username: 'user7', password: 'password7' },
    { username: 'user8', password: 'password8' },
    { username: 'user9', password: 'password9' },
    { username: 'user10', password: 'password10' },
  ];

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: '',
      password: '',
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .required("Please Enter Your Username")
        .test('is-registered-username', 'Username not found', function(value) {
          return validCredentials.some(cred => cred.username === value);
        }),
      password: Yup.string()
        .required("Please Enter Your Password")
        .test('is-valid-password', 'Invalid password', function(value) {
          const { username } = this.parent;
          return validCredentials.some(cred => cred.username === username && cred.password === value);
        }),
    }),
    
    // validationSchema: Yup.object({
    //   username: Yup.string().required("Please Enter Your Username"),
    //   // password: Yup.string().required("Please Enter Your Password"),
    //   password: Yup.string().required("Please Enter Your Password")
    //   .test('is-valid-credential', 'Invalid username or password', function(value) {
    //     const { username } = this.parent;
 
    //     return validCredentials.some(cred => cred.username === username && cred.password === value);
    //   }),
    // }),
    onSubmit: async (values) => {
      console.log('isPhone', isPhone)
      if (isPhone) {
        values["country_code"] = countryCode
      }
      console.log('values', values)
      dispatch(setauthLoad(true));
      history('/dashboard');


      // dispatch(setauthLoad(true));
      // var response = await dispatch(userAuthenticate(values, history));
      // console.log('response', response)
      // let data = response.data;
      // if (response.code === 200) {
      //   console.log('idcondition', data);
      //   sessionStorage.setItem("authUser", JSON.stringify(data[0]))
      //   dispatch(setAuthUserInfo(data[0]))
      //   dispatch(updateUserInfo(data[0]))
      //   dispatch(invalidAuth(null))
      //   setTimeout(() => {
      //     history('/dashboard');
      //   }, 100);
      //   setErrorMsg("");
      // } else {
      //   console.log('else if condition ');
      //   setErrorMsg("User not found. Please check your credentials.");
      //   setTimeout(() => {
      //     setErrorMsg('')
      //   }, 5000);

      // }

    }
  });





  return (
    <div className="login-page" 
    >
      <Container fluid className="vh-100">
        <Row className="h-100">
          <Col lg={8} md={7} className="d-none d-md-block">
          </Col>
          <Col lg={4} md={5} sm={12} className="d-flex align-items-center justify-content-center">
            <div className="auth-content p-4 rounded">
              <div className="text-center mb-4">
                {/* <img src={MC_logo_text} alt="MCs mytool Logo" className="img-fluid" style={{ width: '150px' }} /> */}
                <p className="text-muted mt-4">Sign in to continue to mytool Admin</p>
              </div>

              {
                IrSlice.showVerifyPwd ?
                  <div className="mt-4">
                    <Form className="form-horizontal" onSubmit={(e) => { e.preventDefault(); newPwd.handleSubmit(); return false; }}>
                      <div className="mb-3">
                        <Label className="form-label">Username :</Label>
                        <Input
                          name="username"
                          className="form-control"
                          placeholder="Enter Email ID"
                          type="username"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.username || ""}
                          disabled={validation.values.username}
                          invalid={validation.touched.username && validation.errors.username ? true : false}
                        />
                        {validation.touched.username && validation.errors.username ? (
                          <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">New Password :</Label>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            name="new_password"
                            className="form-control"
                            placeholder="Enter New Password"
                            type={showNewPassword ? "text" : "password"}
                            onChange={newPwd.handleChange}
                            onBlur={newPwd.handleBlur}
                            value={newPwd.values.new_password || ""}
                            invalid={newPwd.touched.new_password && newPwd.errors.new_password ? true : false}
                            autoComplete='new-password'
                          />
                          <button
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="btn text-dark"
                            style={{ background: 'gainsboro' }}
                            type="button"
                            id="password-addon"
                          >
                            <i className={showNewPassword ? "mdi mdi-eye-off" : "mdi mdi-eye-outline"}></i>
                          </button>

                          {newPwd.touched.new_password && newPwd.errors.new_password ? (
                            <FormFeedback type="invalid">{newPwd.errors.new_password}</FormFeedback>
                          ) : null}
                        </div>



                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Confirm Password :</Label>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            name="confrm_password"
                            className="form-control"
                            placeholder="Enter Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            onChange={newPwd.handleChange}
                            onBlur={newPwd.handleBlur}
                            value={newPwd.values.confrm_password || ""}
                            invalid={newPwd.touched.confrm_password && newPwd.errors.confrm_password ? true : false}
                            autoComplete='new-password'
                          />
                          <button
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="btn text-dark"
                            style={{ background: 'gainsboro' }}
                            type="button"
                            id="confirm-password-addon"
                          >
                            <i className={showConfirmPassword ? "mdi mdi-eye-off" : "mdi mdi-eye-outline"}></i>
                          </button>
                          {newPwd.touched.confrm_password && newPwd.errors.confrm_password ? (
                            <FormFeedback type="invalid">{newPwd.errors.confrm_password}</FormFeedback>
                          ) : null}
                        </div>

                      </div>

                      <div className="mt-3 text-end">
                        <Button disabled={submitLoad || IrSlice.updateMsg} color="primary" className="btn btn-sm w-md" type="submit">
                          {
                            submitLoad ? (
                              <>
                                <Spinner size={"sm"}>...</Spinner>
                                <span>{' '}Submitting...</span>
                              </>
                            ) : (
                              <>Submit</>
                            )}

                        </Button>
                      </div>
                      {
                        IrSlice.updateMsg &&
                        <div className="alert alert-success text-center mb-4" role="alert">Password updated successfully.</div>

                      }
                    </Form>

                  </div>
                  :
                  <div className="mt-4">
                    <Form className="form-horizontal" onSubmit={(e) => { e.preventDefault(); validation.handleSubmit(); return false; }} >
                      <div className="mb-3">
                        <div>
                          <Label className='m-0 fw-bold'>EMPLOYEE CODE/Username</Label>
                          {/* <Label className='m-0 fw-bold'>E-MAIL / MOBILE NUMBER</Label> */}
                        </div>
                        <div className="font-size-11 text-secondary text-opacity-75 mb-2">Enter your employee code or username to proceed</div>
                        {/* <div className="font-size-11 text-secondary text-opacity-75 mb-2">Enter your mobile number or e-mail to proceed</div> */}

                        <div className={`${isPhone ? 'd-flex' : ''}`} >
                          {/* {isPhone &&
                            <Input
                              type="select"
                              className="form-control w-auto me-1"
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                            >
                              {countryCodes.map((country) => (
                                <option key={country.code} value={country.code}>
                                  {country.name} ({country.code})
                                </option>
                              ))}
                            </Input>
                          } */}
                          <Input
                            name="username"
                            className="form-control"
                            placeholder="Enter Employee code or username"
                            // placeholder="Enter Email ID / Phone Number"
                            type={`${isPhone ? 'number' : 'text'}`}
                            onChange={handleInputChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.username || ""}
                            invalid={validation.touched.username && validation.errors.username ? true : false}
                            min={isPhone ? "0" : undefined}
                          />
                          {validation.touched.username && validation.errors.username ? (
                            <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                          ) : null}
                        </div>
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={passwordShow ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={validation.touched.password && validation.errors.password ? true : false}
                          />
                          <button onClick={() => setPasswordShow(!passwordShow)} className="btn text-dark" style={{ background: 'ghostwhite', border: '1px solid #e9e9e9' }} type="button" id="password-addon">
                            <i className="mdi mdi-eye-outline"></i>
                          </button>
                        </div>
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>

                      <Alert color={alert.color} isOpen={alert.visible} toggle={() => setAlert({ ...alert, visible: false })}>
                        {alert.message}
                      </Alert>
                      {IrSlice.invalidErrMsg !== "" && (
                        <Alert color="danger" isOpen={true}>
                          {IrSlice.invalidErrMsg}
                        </Alert>
                      )}
                      {IrSlice.invalidCredentials && (
                        <Alert color="danger" isOpen={true}>
                          Invalid Username or Password
                        </Alert>
                      )}
                      {IrSlice.accActivationErr && (
                        <Alert color="danger" isOpen={true}>
                          Your account is not activated.
                        </Alert>
                      )}

                      <div className="mt-3 d-grid">
                        <button className="btn btn-block text-white" style={{ background: '#ee5e34' }} type="submit" disabled={authLoad}>
                          {authLoad ? (
                            <span> <Spinner size="sm">...</Spinner> <span>{' '}Authenticating</span> </span>
                          ) : (
                            <span>Log In</span>
                          )}
                        </button>
                      </div>
                      {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
                    </Form>
                  </div>
              }         
              <div className="text-center mt-4">
                <p>Designed & Developed by <span className="fw-bold text-primary">mytool Pvt Ltd</span></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login2;
















// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Col, Container, Form, Row, Input, Label, FormFeedback, Spinner, Button, Alert } from "reactstrap";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import { useSelector, useDispatch } from "react-redux";
// import { loginAuthentication, invalidAuth, getConfiguration, updateUserInfo } from '../../Slice/authSlice'
// // import backgroundImage from "../../assets/images/mytool-bg-layout.jpg";
// // import MC_logo_text from '../../assets/images/MC_logo_text.png'
// import { setAuthUserInfo } from "../../Slice/manageSessionSlice";
// import { userAuthenticate, verifyShortName, setauthLoad, setInvalidCredentials, setaccActivationErr, confirmNewPwd, setInvalidErrMsg } from "../../Slice/authSlice";



// const Login2 = () => {
//   const history = useNavigate();
//   const dispatch = useDispatch();


//   const [errorMsg, setErrorMsg] = useState("");

//   const [passwordShow, setPasswordShow] = useState(false);
//   const [isPhone, setIsPhone] = useState(false);
//   const [countryCode, setCountryCode] = useState("+91");
//   const [alert, setAlert] = useState({ visible: false, message: "", color: "" });
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [submitLoad, setsubmitLoad] = useState(false);

//   const countryCodes = [
//     { code: "+1", name: "USA" },
//     { code: "+44", name: "UK" },
//     { code: "+91", name: "India" },
//   ];


//   const IrSlice = useSelector(state => state.auth);
//   const authLoad = IrSlice.authLoad;






//   document.title = "Login | mytool Admin";

//   useEffect(() => {
//     // dispatch(getConfiguration());
//   }, [dispatch]);

  

//   const handleChange = (e) => {
//     dispatch(invalidAuth(null));
//     validation.handleChange(e);
//   };



//   const handleInputChange = (e) => {
//     let value = e.target.value;
//     if (/\S+@\S+\.\S+/.test(value)) {
//       setIsPhone(false);
//     } else if (/^\d+$/.test(value)) {
//       setIsPhone(true);
//       if (value.length > 10) {
//         value = value.slice(0, 10); // Limit to 10 characters
//       }
//     } else {
//       setIsPhone(false);
//     }
//     validation.setFieldValue("username", value);
//   };


//   const newPwd = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       username: '',
//       new_password: '',
//       confrm_password: ''
//     },
//     validationSchema: Yup.object({
//       new_password: Yup.string()
//         .required("Please Enter Your New Password"),
//       confrm_password: Yup.string()
//         .required("Please Enter Your Confirm Password")
//         .oneOf([Yup.ref('new_password'), null], "Passwords must match"),
//     }),
//     onSubmit: async (values) => {
//       setsubmitLoad(true)
//       values["session"] = IrSlice?.pwdSession; // Assuming this is defined
//       values["username"] = isPhone ? countryCode + String(validation.values.username) : validation.values.username; // Assuming validation is defined
//       values["user_info"] = validation.values.username;
//       // values["user_info"] = validation.values.username;
//       console.log('newPasswrd values', values)

//       await dispatch(confirmNewPwd(values)); // Assuming confirmNewPwd is defined
//       setsubmitLoad(false)

//     }
//   });

//   const validation = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       username: '',
//       password: '',
//     },
//     validationSchema: Yup.object({
//       username: Yup.string().required("Please Enter Your Username"),
//       password: Yup.string().required("Please Enter Your Password"),
//     }),
//     onSubmit: async (values) => {
//       // values["db_name"] = IrSlice.clientData.database_name;
//       // values["database_url"] = IrSlice.clientData.database_url;
//       // values["short_name"] = IrSlice.clientData.short_name;
//       console.log('isPhone', isPhone)
//       if (isPhone) {
//         values["country_code"] = countryCode
//       }
//       console.log('values', values)

//       dispatch(setauthLoad(true));
//       var response = await dispatch(userAuthenticate(values, history));
//       console.log('response', response)
//       let data = response.data;
//       if (response.code === 200) {
//         console.log('idcondition', data);
//         sessionStorage.setItem("authUser", JSON.stringify(data[0]))
//         dispatch(setAuthUserInfo(data[0]))
//         dispatch(updateUserInfo(data[0]))
//         dispatch(invalidAuth(null))
//         setTimeout(() => {
//           history('/dashboard');
//         }, 100);
//         setErrorMsg("");
//       } else {
//         console.log('else if condition ');
//         setErrorMsg("User not found. Please check your credentials.");
//         setTimeout(() => {
//           setErrorMsg('')
//         }, 5000);

//       }

//     }
//   });





//   return (
//     <div className="login-page" 
//     //  style={{ background: `url(${backgroundImage}) no-repeat center center/cover`, }} 
    
//     >
//       <Container fluid className="vh-100">
//         <Row className="h-100">
//           <Col lg={8} md={7} className="d-none d-md-block">
//           </Col>
//           <Col lg={4} md={5} sm={12} className="d-flex align-items-center justify-content-center">
//             <div className="auth-content p-4 rounded">
//               <div className="text-center mb-4">
//                 {/* <img src={MC_logo_text} alt="MCs mytool Logo" className="img-fluid" style={{ width: '150px' }} /> */}
//                 <p className="text-muted mt-4">Sign in to continue to mytool Admin</p>
//               </div>

//               {
//                 IrSlice.showVerifyPwd ?
//                   <div className="mt-4">
//                     <Form className="form-horizontal" onSubmit={(e) => { e.preventDefault(); newPwd.handleSubmit(); return false; }}>
//                       <div className="mb-3">
//                         <Label className="form-label">Username :</Label>
//                         <Input
//                           name="username"
//                           className="form-control"
//                           placeholder="Enter Email ID"
//                           type="username"
//                           onChange={validation.handleChange}
//                           onBlur={validation.handleBlur}
//                           value={validation.values.username || ""}
//                           disabled={validation.values.username}
//                           invalid={validation.touched.username && validation.errors.username ? true : false}
//                         />
//                         {validation.touched.username && validation.errors.username ? (
//                           <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
//                         ) : null}
//                       </div>

//                       <div className="mb-3">
//                         <Label className="form-label">New Password :</Label>
//                         <div className="input-group auth-pass-inputgroup">
//                           <Input
//                             name="new_password"
//                             className="form-control"
//                             placeholder="Enter New Password"
//                             type={showNewPassword ? "text" : "password"}
//                             onChange={newPwd.handleChange}
//                             onBlur={newPwd.handleBlur}
//                             value={newPwd.values.new_password || ""}
//                             invalid={newPwd.touched.new_password && newPwd.errors.new_password ? true : false}
//                             autoComplete='new-password'
//                           />
//                           <button
//                             onClick={() => setShowNewPassword(!showNewPassword)}
//                             className="btn text-dark"
//                             style={{ background: 'gainsboro' }}
//                             type="button"
//                             id="password-addon"
//                           >
//                             <i className={showNewPassword ? "mdi mdi-eye-off" : "mdi mdi-eye-outline"}></i>
//                           </button>

//                           {newPwd.touched.new_password && newPwd.errors.new_password ? (
//                             <FormFeedback type="invalid">{newPwd.errors.new_password}</FormFeedback>
//                           ) : null}
//                         </div>



//                       </div>

//                       <div className="mb-3">
//                         <Label className="form-label">Confirm Password :</Label>
//                         <div className="input-group auth-pass-inputgroup">
//                           <Input
//                             name="confrm_password"
//                             className="form-control"
//                             placeholder="Enter Confirm Password"
//                             type={showConfirmPassword ? "text" : "password"}
//                             onChange={newPwd.handleChange}
//                             onBlur={newPwd.handleBlur}
//                             value={newPwd.values.confrm_password || ""}
//                             invalid={newPwd.touched.confrm_password && newPwd.errors.confrm_password ? true : false}
//                             autoComplete='new-password'
//                           />
//                           <button
//                             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                             className="btn text-dark"
//                             style={{ background: 'gainsboro' }}
//                             type="button"
//                             id="confirm-password-addon"
//                           >
//                             <i className={showConfirmPassword ? "mdi mdi-eye-off" : "mdi mdi-eye-outline"}></i>
//                           </button>
//                           {newPwd.touched.confrm_password && newPwd.errors.confrm_password ? (
//                             <FormFeedback type="invalid">{newPwd.errors.confrm_password}</FormFeedback>
//                           ) : null}
//                         </div>

//                       </div>

//                       <div className="mt-3 text-end">
//                         <Button disabled={submitLoad || IrSlice.updateMsg} color="primary" className="btn btn-sm w-md" type="submit">
//                           {
//                             submitLoad ? (
//                               <>
//                                 <Spinner size={"sm"}>...</Spinner>
//                                 <span>{' '}Submitting...</span>
//                               </>
//                             ) : (
//                               <>Submit</>
//                             )}

//                         </Button>
//                       </div>
//                       {
//                         IrSlice.updateMsg &&
//                         <div className="alert alert-success text-center mb-4" role="alert">Password updated successfully.</div>

//                       }
//                     </Form>

//                   </div>
//                   :
//                   <div className="mt-4">
//                     <Form className="form-horizontal" onSubmit={(e) => { e.preventDefault(); validation.handleSubmit(); return false; }} >
//                       <div className="mb-3">
//                         <div>
//                           <Label className='m-0 fw-bold'>E-MAIL / MOBILE NUMBER</Label>
//                         </div>
//                         <div className="font-size-11 text-secondary text-opacity-75 mb-2">Enter your mobile number or e-mail to proceed</div>

//                         <div className={`${isPhone ? 'd-flex' : ''}`} >
//                           {isPhone &&
//                             <Input
//                               type="select"
//                               className="form-control w-auto me-1"
//                               value={countryCode}
//                               onChange={(e) => setCountryCode(e.target.value)}
//                             >
//                               {countryCodes.map((country) => (
//                                 <option key={country.code} value={country.code}>
//                                   {country.name} ({country.code})
//                                 </option>
//                               ))}
//                             </Input>
//                           }
//                           <Input
//                             name="username"
//                             className="form-control"
//                             placeholder="Enter Email ID / Phone Number"
//                             type={`${isPhone ? 'number' : 'text'}`}
//                             onChange={handleInputChange}
//                             onBlur={validation.handleBlur}
//                             value={validation.values.username || ""}
//                             invalid={validation.touched.username && validation.errors.username ? true : false}
//                             min={isPhone ? "0" : undefined}
//                           />
//                           {validation.touched.username && validation.errors.username ? (
//                             <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
//                           ) : null}
//                         </div>
//                       </div>

//                       <div className="mb-3">
//                         {/* <div className="float-end">
//  <Link to="/auth-recoverpw-2" className="text-muted">Forgot password?</Link>
//  </div> */}
//                         <Label className="form-label">Password</Label>
//                         <div className="input-group auth-pass-inputgroup">
//                           <Input
//                             name="password"
//                             value={validation.values.password || ""}
//                             type={passwordShow ? "text" : "password"}
//                             placeholder="Enter Password"
//                             onChange={validation.handleChange}
//                             onBlur={validation.handleBlur}
//                             invalid={validation.touched.password && validation.errors.password ? true : false}
//                           />
//                           <button onClick={() => setPasswordShow(!passwordShow)} className="btn text-dark" style={{ background: 'ghostwhite', border: '1px solid #e9e9e9' }} type="button" id="password-addon">
//                             <i className="mdi mdi-eye-outline"></i>
//                           </button>
//                         </div>
//                         {validation.touched.password && validation.errors.password ? (
//                           <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
//                         ) : null}
//                       </div>

//                       <Alert color={alert.color} isOpen={alert.visible} toggle={() => setAlert({ ...alert, visible: false })}>
//                         {alert.message}
//                       </Alert>
//                       {IrSlice.invalidErrMsg !== "" && (
//                         <Alert color="danger" isOpen={true}>
//                           {IrSlice.invalidErrMsg}
//                         </Alert>
//                       )}
//                       {IrSlice.invalidCredentials && (
//                         <Alert color="danger" isOpen={true}>
//                           Invalid Username or Password
//                         </Alert>
//                       )}
//                       {IrSlice.accActivationErr && (
//                         <Alert color="danger" isOpen={true}>
//                           Your account is not activated.
//                         </Alert>
//                       )}

//                       <div className="mt-3 d-grid">
//                         <button className="btn btn-block text-white" style={{ background: '#852F33' }} type="submit" disabled={authLoad}>
//                           {authLoad ? (
//                             <span> <Spinner size="sm">...</Spinner> <span>{' '}Authenticating</span> </span>
//                           ) : (
//                             <span>Log In</span>
//                           )}
//                         </button>
//                       </div>
//                       {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
//                     </Form>
//                   </div>
//               }

         
//               <div className="text-center mt-4">
//                 <p>Designed & Developed by <span className="fw-bold text-primary">mytool Pvt Ltd</span></p>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Login2;