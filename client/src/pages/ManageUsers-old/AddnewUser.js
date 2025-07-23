import React, { useEffect, useRef, useState } from 'react'
import { CardBody, Container, Row, Col, Card, Form, Input, Label, FormFeedback, Spinner, CardTitle } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { useFormik } from "formik";
import * as Yup from "yup";
import { retriveRoleData, createUserInfo, retriveUserInfo, validateExistValue } from '../../Slice/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setUserMailIdExist, setUserNumExist, setEditUserInfo, retrieveUserListAPI } from '../../Slice/userSlice';
import store from '../../store';
import _ from 'lodash';

const AddnewUser = (props) => {
  const { onCloseCanvas } = props

  const history = useNavigate()
  const dispatch = useDispatch()
  const userSlice = useSelector(state => state.userSlice)
  const sessionInfo = useSelector(state => state.sessionInfo)
  const authUser = sessionInfo.authUserInfo

  const [userInfo, setUserInfo] = useState(null)

  const [enabelIncdType, setEnableIncdType] = useState(false)
  const [dataLoaded, setdataLoaded] = useState(sessionStorage.getItem("userId") ? false : false)
  const [submitLoad, setSubmitLoad] = useState(false)
  const [checkedKeys, setcheckedKeys] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(false)
  const [disabledKeys, setDisabledKeys] = useState([]);
  const [navigate, setNavigate] = useState(sessionStorage.getItem("navigate"))
  const [countries, setCountries] = useState(sessionInfo.configInfo.countries)


  useEffect(() => {
    // const initialize = async () => {
    //   const userId = sessionStorage.getItem("userId");
    //   document.title = userId ? "Edit User | MCAdmin" : "Create User | MCAdmin";
    //   dispatch(setUserMailIdExist(false))
    //   dispatch(setUserNumExist(false))

    //   if (userId) {
    //     const userInfo = await dispatch(retriveUserInfo(userId));
    //     setUserInfo(userInfo)
    //     validation.setValues(userInfo);
    //     setdataLoaded(true)
    //   } else {
    //     dispatch(setEditUserInfo(null))
    //     validation.resetForm()
    //     setTimeout(() => {

    //       setdataLoaded(true)
    //     }, 500)

    //   }
    // };
    // initialize();
  }, []);

  const validation = useFormik({
    initialValues: {
      firstname: "" || sessionStorage.getItem("userId") ? userSlice.editUserInfo?.firstname : "",
      email_id: "",
      countrycode: "" || sessionStorage.getItem("userId") ? userSlice.editUserInfo?.countrycode === null ? "" : userSlice.editUserInfo?.countrycode : "",
      phone_number: "" || sessionStorage.getItem("userId") ? userSlice.editUserInfo?.phone_number === null ? "" : userSlice.editUserInfo?.phone_number : "",
    },

    validationSchema: Yup.object({
      firstname: Yup.string().required("Name is required")
        .matches(/\S+/, "Name cannot be just spaces"),
      email_id: Yup.string().email("Invalid email format")
       ,
      countrycode: Yup.string().nullable().test('countrycode-required', function (value) {
        const { phone_number } = this.parent;
        if (phone_number && phone_number.length > 0) {
          return !!value && value !== 'Select';
        }
        return true;
      }),
      phone_number: Yup.string().nullable().test('phone-required', 'Phone number is required if country code is provided', function (value) {
        const { countrycode } = this.parent;
        if (countrycode && countrycode !== 'Select') {
          return !!value;
        }
        return true;
      })
    }),
    onSubmit: async (values) => {
      var values = _.cloneDeep(values)
      setSelectedLocation(false)
      if (!userSlice?.userMailIdExist && !userSlice?.userNumExist) {
        if (!values.phone_number && !values.email_id) {
          validation.setErrors({
            phone_number: "Enter either Phone number or Email.",
            email_id: "Enter either Phone number or Email.",
          });
          return;
        }
        setSubmitLoad(true)
        values["username"] = values["email_id"]
        values["created_by"] = authUser._id
        values["fullNo"] = values.countrycode + values.phone_number === "undefined" ? undefined : values.countrycode + values.phone_number
        if (userInfo !== null) {
          values["_id"] = userInfo._id
          if (userInfo.phone_number === null && values.phone_number) {
            values["update"] = "phone_number"
          }
          else if ((userInfo.email_id === null || userInfo.email_id === "") && values.email_id) {
            values["update"] = "email"
          }
        }

        // var response = await dispatch(createUserInfo(values, history))
        // if (response) {
        //   await dispatch(retrieveUserListAPI())
        //   setSubmitLoad(false)
        //   onCloseCanvas();
        // }
      }
    }
  })


  const getAllKeys = (nodes) => {
    let keys = [];
    nodes.forEach((node) => {
      keys.push(node.key);
      if (node.children) {
        keys = keys.concat(getAllKeys(node.children));
      }
    });
    return keys;
  };

  const handleChangeRole = (event) => {
    validation.handleChange(event)
    var roleInfo = _.filter(userSlice.roleList, { _id: event.target.value })
    if (roleInfo.length > 0) {
      var getIncidentManage = _.find(roleInfo[0].facilities, { id: 11 })
      if (getIncidentManage !== undefined) {
        setEnableIncdType(getIncidentManage.active)
      }
    }

  }

  const addDisabledCheckboxToChildren = (data, targetKey, checked) => {
    data.forEach(node => {
      if (targetKey.includes(node.key)) {
        if (Array.isArray(node.children)) {
          node.children.forEach(child => {
            addDisabledToAllDescendants(child, checked);
          });
        }
      } else if (Array.isArray(node.children) && node.children.length > 0) {
        addDisabledCheckboxToChildren(node.children, targetKey, checked);
      }
    });

    return data; // Return the modified data
  }

  const addDisabledToAllDescendants = (node, checked) => {
    node.disableCheckbox = checked ? true : false;
    node.disabled = checked ? true : false;
    if (Array.isArray(node.children)) {
      node.children.forEach(child => {
        addDisabledToAllDescendants(child, checked);
      });
    }
  }

  const loopTree = (data) =>
    data.map((item) => ({
      ...item,
      disabled: disabledKeys.includes(item.key),
      children: item.children ? loopTree(item.children) : undefined,
    }));
  if (dataLoaded) {
    return (
      <React.Fragment>
        <Card className='bg-light'>
          <CardBody>
            <CardTitle className='text-muted mb-2'>User Information</CardTitle>
            <Form onSubmit={(e) => { e.preventDefault(); validation.handleSubmit(); }}>
              <Row className='mb-3'>
                <Col>
                  <Label className="form-label">Full Name :<span className='text-danger'>*</span></Label>
                  <Input
                    name={"firstname"}
                    type={"text"}
                    placeholder={"Enter the Full Name"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.firstname || ""}
                    invalid={validation.touched.firstname && validation.errors.firstname ? true : false}
                  />
                  {validation.touched.firstname && validation.errors.firstname ? (
                    <FormFeedback type="invalid">{validation.errors.firstname}</FormFeedback>
                  ) : null}
                </Col>
              </Row>
              <Row className='mb-3'>
                <Col>
                  <Label>Phone Number: <span className="text-danger"> *</span></Label>
                  <Row>
                    <Col md={4} className='pe-0' >
                      <select
                        name="countrycode"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        className={`form-select ${validation.touched.countrycode && validation.errors.countrycode ? 'is-invalid' : ''} `}
                        defaultValue={userSlice?.editUserInfo?.countrycode ? userSlice?.editUserInfo?.countrycode : "Select"}
                        required
                        style={{ borderRight: 'none', backgroundColor: userInfo?.countrycode ? '#E9E9E9' : '', cursor: userInfo?.countrycode ? 'not-allowed' : 'auto' }}
                        disabled={userInfo?.countrycode}
                      >
                        <option value="Select" disabled={true}>Select</option>
                        {
                          countries.map((c, idx) => (
                            <option key={idx} value={c.code}>
                              {c.code}{""}&nbsp;{c.label}
                            </option>
                          ))
                        }
                      </select>
                      {validation.touched.countrycode && validation.errors.countrycode && (
                        <div className="invalid-feedback d-block">{validation.errors.countrycode}</div>
                      )}
                    </Col>
                    <Col md={8} className='ps-0'>
                      <Input
                        name="phone_number"
                        type="number"
                        placeholder="Enter the Phone Number"
                        onChange={validation.handleChange}
                        disabled={userInfo?.phone_number}
                        onBlur={validation.handleBlur}
                        value={validation.values.phone_number ? validation.values.phone_number : "" || ""}
                        invalid={validation.touched.phone_number && validation.errors.phone_number ? true : false}
                        style={{ backgroundColor: userInfo?.phone_number ? '#E9E9E9' : '', cursor: userInfo?.phone_number ? 'not-allowed' : 'auto' }}
                      />
                      {validation.touched.phone_number && validation.errors.phone_number ? (
                        <FormFeedback type="invalid">{validation.errors.phone_number}</FormFeedback>
                      ) : null}
                      {userSlice?.userNumExist && (
                        <div style={{ fontSize: "smaller" }} className="text-danger">
                          Phone Number already assigned to another user.
                        </div>
                      )}
                    </Col>
                  </Row>

                </Col>
              </Row>
              <Row className='mb-3'>
                <Col>
                  <Label className="form-label">Email ID :<span className='text-danger'>*</span></Label>
                  <Input
                    name={"email_id"}
                    type={"text"}
                    placeholder={"Enter the Email ID"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email_id || ""}
                    invalid={validation.touched.email_id && validation.errors.email_id ? true : false}
                    disabled={userInfo?.email_id}
                    style={{ backgroundColor: userInfo?.email_id ? '#E9E9E9' : '', cursor: userInfo?.email_id ? 'not-allowed' : 'auto' }}

                  />
                  {validation.touched.email_id && validation.errors.email_id ? (
                    <FormFeedback type="invalid">{validation.errors.email_id}</FormFeedback>
                  ) : null}
                  {
                    userSlice?.userMailIdExist &&
                    <div style={{ fontSize: "smaller" }} className='text-danger'>Email ID already exist.</div>
                  }
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col>
                  <div className="text-end">
                    <button className="btn btn-sm w-md btn-danger me-2" type="button" onClick={async () => { 
                      await dispatch(setEditUserInfo(null)); 
                      
                      sessionStorage.removeItem("userId"); onCloseCanvas(); }} >
                      Cancel
                    </button>
                    <button className="btn btn-sm w-md btn-success" type='submit' onClick={() => { checkedKeys.length > 0 ? setSelectedLocation(false) : setSelectedLocation(true) }} disabled={submitLoad} >
                      {
                        submitLoad ? (
                          <>
                            <Spinner size="sm">...</Spinner> <span>{' '}Submitting...</span> </>
                        ) : (
                          <span>Submit</span>
                        )
                      }
                    </button>
                  </div>
                </Col>
              </Row>

            </Form>
          </CardBody>
        </Card>
      </React.Fragment>
    )
  }
  else {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div>Loading...</div>
        <Spinner color="primary" />
      </div>
    );
  }
}
export default AddnewUser;