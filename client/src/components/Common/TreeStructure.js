import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, UncontrolledTooltip, DropdownMenu, DropdownToggle, UncontrolledDropdown, Tooltip } from "reactstrap"
import { AvForm, AvField } from 'availity-reactstrap-validation';
import SortableTree from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import {  addNode, crudNode, dndNode, setMenuName, setTreeData, deleteNode, getNodeData, setState, updateTreeData, editNode, updateNode, onTreeChange  } from '../../Slice/TreeSlice';

const TreeStructure = () => {
    const dispatch = useDispatch();
    const [dataLoaded, setDataLoaded] = useState(true);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [dropdownStates, setDropdownStates] = useState({});
    
    const treeData = useSelector(updateTreeData);
    const state = useSelector(state => state.treeData);

    const toggle = () => {
        dispatch(setState({ mainToggle: !state.mainToggle }));
    };

    const addCrudNode = (values) => {        
        const action = state.crudStatus === 2 ? updateNode : crudNode;
        dispatch(action(values));
        setDropdownStates({})
    };

    const toggleToolTip = () => {
    };

    const handleTreeChange = (newTreeData) => {
        onTreeChange(newTreeData, dispatch);
    };

    const handleBackButtonClick = () => {
        dispatch(setTreeData([])); 
        dispatch(setState({}));
        
    };
    const toggleDropdown = (id) => {
        setDropdownStates({
            ...dropdownStates,
            [id]: !dropdownStates[id] 
        });
    };

    return (
        <React.Fragment>
            {dataLoaded ? (
                    <Container fluid>
                        <div className="d-flex flex-row" style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
                            <div style={{ background: "white", width: "100%", transition: "width .35s ease-in-out", position: "absolute", float: "left", }} className="p-3 me-2" >
                                <div className="row">
                                    <div className="mb-2 col-10 ">
                                        <UncontrolledDropdown isOpen={state.mainToggle} toggle={toggle}>
                                            <DropdownToggle className="btn btn-primary" color="#eff2f7" onClick={() => dispatch(setState({  path: [], crud: true, crudStatus: 0, type: 0, children: [], mainToggle: true })) } >
                                                <i className="mdi mdi-plus me-1 "></i> Create New
                                            </DropdownToggle>
                                            <DropdownMenu style={{ width: 250 }} className="">
                                                <div className="px-4">
                                                    <AvForm onValidSubmit={addCrudNode}>
                                                        <div className="my-2">
                                                            <AvField name="title" label="Menu Name " placeholder="Enter Menu" type="text" errorMessage="Enter Menu" validate={{ required: { value: true }, minLength: { value: 4, errorMessage: "Min 4 chars.", } }} defaultValue={""} onChange={(e) => { dispatch(setMenuName(e.target.value)) }} />
                                                        </div>
                                                        <div className="my-3">
                                                            <button className="btn btn-primary btn-block m-1" type="submit" style={{ marginRight: 5 }}>
                                                                Add Menu
                                                            </button>
                                                        </div>
                                                    </AvForm>
                                                </div>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                 
                                </div>
                                <div style={{ overflow: "auto", height: "90vh", }}>
                                    <SortableTree
                                        treeData={treeData}
                                        onChange={handleTreeChange}
                                        onMoveNode={(object) => dispatch(dndNode(object))}
                                        canDrop={(object) => object.nextParent !== undefined && object.nextParent.type == 2 ? false : true}
                                        scaffoldBlockPxWidth={40}
                                        slideRegionSize={25}
                                        generateNodeProps={({ node, path }) => {
                                            const updatedPath = [...path];
                                            return {
                                                listIndex: 0,
                                                lowerSiblingCounts: [],
                                                className: node.type === 2 ? "icon-a" : "icon-b",
                                                onClick: (event) => {
                                                    if (event.target.className.includes("collapseButton") || event.target.className.includes("expandButton")) {
                                                    } else {
                                                        setSelectedNodeId(node.id);
                                                        dispatch(getNodeData(node));
                                                    }
                                                },
                                                style: {
                                                    border: selectedNodeId === node.id ? "2px solid #556EE6" : '1px solid #c3cacd',
                                                    backgroundImage: "url('../../../../assets/images/drag-and-drop-7.png')"
                                                },
                                                title: (
                                                    <div>
                                                        <div style={{ maxWidth: 450 }} key={`div-${node.id}`}>
                                                            {state.editcrud && state.id === node.id ? (
                                                                <AvForm onValidSubmit={addCrudNode}>
                                                                    <div className="d-flex flex-row align-items-center">
                                                                        <div className="me-2 p-0">
                                                                            <input name="title" placeholder="Enter Menu Name" className="form-control py-1 m-0" type="text" value={state.menuName} onChange={(e) => { dispatch(setMenuName(e.target.value)) }} />
                                                                        </div>
                                                                        <div className="d-flex flex-row">
                                                                            <button className="btn btn-sm btn-secondary " type="submit" style={{ marginRight: 3 }}>
                                                                                Update
                                                                            </button>
                                                                            <Link to="#" className="btn btn-sm btn-soft-danger" onClick={() => { dispatch(setState({ editcrud: false, id: null })) }} id={`closetooltip-${node.id}`} >
                                                                                <i className="mdi mdi-close" />
                                                                                <UncontrolledTooltip placement="top" target={`closetooltip-${node.id}`} >
                                                                                    {"Close"}
                                                                                </UncontrolledTooltip>
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </AvForm>
                                                            ) : (
                                                                <div>
                                                                    <Tooltip
                                                                        placement="bottom"
                                                                        target={`btn-${node.id}`}
                                                                        toggle={() => toggleToolTip(`btn-${node.id}`)}
                                                                    >
                                                                        {node.title}
                                                                    </Tooltip>
                                                                    <Link
                                                                        to="#"
                                                                        id={`btn-${node.id}`}
                                                                        style={{ fontSize: 12, fontWeight: 400 }}
                                                                    >
                                                                        {String(node.title).slice(0, 40) +
                                                                            (node.title?.length > 40 ? "..." : "")}
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                                buttons: [
                                                    <Row className="" key={node.id}>
                                                        <ul className="list-unstyled hstack gap-1 mb-0 justify-content-end">
                                                            {state.editcrud && state.id === node.id ? null : (
                                                                <li>
                                                                    <Link
                                                                        to="#"
                                                                        className="btn btn-sm btn-soft-info"
                                                                        onClick={() => node.type !== 2 &&  dispatch(editNode(updatedPath, node))}
                                                                        id={`edittooltip-${node.id}`}
                                                                    >
                                                                        <i className="mdi mdi-pencil-outline" />
                                                                        <UncontrolledTooltip placement="top" target={`edittooltip-${node.id}`} >
                                                                            {node.type !== 2 && "Edit Menu"}
                                                                        </UncontrolledTooltip>
                                                                    </Link>
                                                                </li>
                                                            )}
                                                            {node.type === 0 && (
                                                                    <UncontrolledDropdown direction="end" isOpen={dropdownStates[node.id]} toggle={() => toggleDropdown(node.id)}>
                                                                    <DropdownToggle className="card-drop" tag="a">
                                                                        <Link to="#" className="btn btn-sm btn-soft-primary" id={`viewtooltip-${node.id}`} onClick={() => dispatch(addNode(node, updatedPath, 0))} >
                                                                            <i className="mdi mdi-file-tree" />
                                                                            <UncontrolledTooltip placement="top" target={`viewtooltip-${node.id}`}>
                                                                                Add Submenu
                                                                            </UncontrolledTooltip>
                                                                        </Link>
                                                                    </DropdownToggle>
                                                                        <DropdownMenu className="dropdown-menu-end " style={{ width: 220 }} id={"dp" + String(node.id)}>
                                                                            <div className="px-4">
                                                                                <AvForm onValidSubmit={addCrudNode} >
                                                                                    <div className="my-2">
                                                                                        <AvField
                                                                                            name="title"
                                                                                            label="Sub Menu Name "
                                                                                            placeholder="Enter Sub Menu"
                                                                                            type="text"
                                                                                            errorMessage="Enter Menu"
                                                                                            validate={{
                                                                                                required: { value: true },
                                                                                                minLength: {
                                                                                                    value: 4,
                                                                                                    errorMessage: "Min 4 chars.",
                                                                                                },
                                                                                            }}
                                                                                            defaultValue={""}
                                                                                            onChange={(e) => {
                                                                                                dispatch(setMenuName(e.target.value));
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="my-3">
                                                                                        <button className="btn btn-primary btn-block m-1" type="submit" style={{ marginRight: 5 }}>
                                                                                            Add Menu
                                                                                        </button>
                                                                                    </div>
                                                                                </AvForm>
                                                                            </div>
                                                                        </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            )}

                                                            <li>
                                                                <Link
                                                                    to="#"
                                                                    className="btn btn-sm btn-soft-danger"
                                                                    onClick={() => dispatch(deleteNode(node, path, "udp" + String(node.id), "dp" + String(node.id)))}
                                                                    id={`deletetooltip-${node.id}`}
                                                                >
                                                                    <i className="mdi mdi-delete-outline" />
                                                                    <UncontrolledTooltip placement="top" target={`deletetooltip-${node.id}`}>
                                                                        {node.type !== 2 && "Delete Menu"}
                                                                    </UncontrolledTooltip>
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </Row>
                                                ],
                                            };
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Container>
            ) : (
                <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <div className="spinner-border text-secondary m-1" role="status"> </div>
                        <div>Loading, Please wait.</div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default TreeStructure;
