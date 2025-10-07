import React, { useMemo, useEffect  } from "react";
import { Row, Col, Label, Button } from "reactstrap";
import SavedSuccess from "../../../../components/Common/SavedSuccess";
import { useSelector } from "react-redux";
import { handleTranslateText } from "../../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";

const Appendix2 = ({
    appendix2Patents,
    appendix2PatentsSaved,
    setAppendix2Patents,
    handleSaveAppendix2Patents,
    appendix2NPL,
    setAppendix2NPL,
    appendix2NPLSaved,
    handleSaveAppendix2NPL,
    dynamicFieldValues,
}) => {
    const singleProject = useSelector(state => state.patentSlice.singleProject);


    const mappedDbName = useMemo(() => {
        if (dynamicFieldValues) {
            return dynamicFieldValues
                .slice(1)
                .filter(tb => tb.keyStrings.length > 0)
                .map(item => item.databaseName);
        }
        return [];
    }, [dynamicFieldValues]);

    useEffect(() => {
        if (mappedDbName.length > 0) {
            setAppendix2Patents(mappedDbName);
        }
        if (mappedDbName.length === 0) {
             setAppendix2Patents("");
        }
    }, [mappedDbName, setAppendix2Patents]);

    const handlePatentsChange = (e) => {
        setAppendix2Patents(e.target.value);
    };


    const appendixFields = [
        {
            id: "appendix2-patents",
            label: "Patents",
            placeholder: "Enter relevant patent references or notes here",
            value: appendix2Patents,
            onChange: handlePatentsChange,
            onSave: handleSaveAppendix2Patents,
            isSaved: appendix2PatentsSaved,
        },
        {
            id: "appendix2-npl",
            label: "Non-Patent Literature",
            placeholder: "Enter non-patent literature references or notes here",
            value: appendix2NPL,
            onChange: (e) => setAppendix2NPL(e.target.value),
            onSave: handleSaveAppendix2NPL,
            isSaved: appendix2NPLSaved,
        },
    ];

    return (
        <>
            <h4 className="fw-bold mb-3">
                {singleProject.projectTypeId === "0002" ? "Appendix" : "Appendix 2"} (Databases)
            </h4>

            {appendixFields.map(field => (
                <React.Fragment key={field.id}>
                    <Row>
                        <Col lg="12">
                            <div className="mb-3">
                                <Label for={field.id}>{field.label}</Label>
                                <textarea
                                    id={field.id}
                                    className="form-control"
                                    rows="4"
                                    placeholder={field.placeholder}
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg="2">
                            <div className="mb-3">
                                <Button
                                    color="warning"
                                    className="w-100"
                                    onClick={field.onSave}
                                >
                                    Save Summary
                                </Button>
                            </div>
                        </Col>
                        <Col>
                            <SavedSuccess show={field.isSaved} />
                            {/* {field.id === "appendix2-patents" &&
                                mappedDbName.length > 0 &&
                                !field.isSaved && (
                                    <span className="ms-3 text-danger fw-semibold">
                                        Please save your changes (KeyStrings updated).
                                    </span>
                                )} */}
                        </Col>
                    </Row>
                </React.Fragment>
            ))}
        </>
    );
};

export default Appendix2;
















// import React, { useMemo, useEffect } from "react";
// import { Row, Col, Label, Button } from "reactstrap";
// import SavedSuccess from "../../../../components/Common/SavedSuccess";
// import { useSelector } from "react-redux";

// const Appendix2 = ({
//     appendix2Patents,
//     appendix2PatentsSaved,
//     setAppendix2Patents,
//     handleSaveAppendix2Patents,
//     appendix2NPL,
//     setAppendix2NPL,
//     appendix2NPLSaved,
//     handleSaveAppendix2NPL,

//     dynamicFieldValues,
// }) => {

//     const singleProject = useSelector(state => state.patentSlice.singleProject);

//     const mappedDbName = useMemo(() => {
//         if (dynamicFieldValues) {
//             const fieldValues = dynamicFieldValues
//                 .slice(1)
//                 .filter(tb => tb.keyStrings.length > 0);

//             return fieldValues.map(item => item.databaseName);
//         }
//         return [];
//     }, [dynamicFieldValues]);

//     console.log('mappedDbName', mappedDbName);

//     if (mappedDbName.length > 0) {
//         setAppendix2Patents(mappedDbName);
//     } else if (mappedDbName.length === 0) {
//         setAppendix2Patents("");
//     }
//     console.log('appendix2Patents', appendix2Patents)

//     const appendixFields = [
//         {
//             id: "appendix2-patents",
//             label: "Patents",
//             placeholder: "Enter relevant patent references or notes here",
//             value: appendix2Patents,
//             // value: patentsDatabaseValues,
//             setValue: setAppendix2Patents,
//             onSave: handleSaveAppendix2Patents,
//             isSaved: appendix2PatentsSaved,
//         },
//         {
//             id: "appendix2-npl",
//             label: "Non-Patent Literature",
//             placeholder: "Enter non-patent literature references or notes here",
//             value: appendix2NPL,
//             setValue: setAppendix2NPL,
//             onSave: handleSaveAppendix2NPL,
//             isSaved: appendix2NPLSaved,
//         },
//     ];

//     return (
//         <>
//             <h4 className="fw-bold mb-3">
//                 {singleProject.projectTypeId === "0002" ? "Appendix" : "Appendix 2"} (Databases)
//             </h4>

//             {appendixFields.map(field => (
//                 <React.Fragment key={field.id}>
//                     <Row>
//                         <Col lg="12">
//                             <div className="mb-3">
//                                 <Label for={field.id}>{field.label}</Label>
//                                 <textarea
//                                     id={field.id}
//                                     className="form-control"
//                                     rows="4"
//                                     placeholder={field.placeholder}
//                                     value={field.value || ""}
//                                     onChange={(e) => field.setValue(e.target.value)}
//                                 />
//                             </div>
//                         </Col>
//                     </Row>

//                     <Row>
//                         <Col lg="2">
//                             <div className="mb-3">
//                                 <Button
//                                     color="warning"
//                                     className="w-100"
//                                     onClick={field.onSave}
//                                 >
//                                     Save Summary
//                                 </Button>
//                             </div>
//                         </Col>
//                         <Col>
//                             <SavedSuccess show={field.isSaved} />
//                         </Col>
//                     </Row>
//                 </React.Fragment>
//             ))}
//         </>
//     );
// };

// export default Appendix2;














// import React from "react";
// import { Row, Col, Label, Button } from "reactstrap";
// import SavedSuccess from "../../../../components/Common/SavedSuccess";
// import { useSelector } from "react-redux";

// const Appendix2 = ({
//     appendix2Patents,
//     appendix2PatentsSaved,
//     setAppendix2Patents,
//     handleSaveAppendix2Patents,
//     appendix2NPL,
//     setAppendix2NPL,
//     appendix2NPLSaved,
//     handleSaveAppendix2NPL,

// }) => {

//     const singleProject = useSelector(state => state.patentSlice.singleProject);

//     return (
//         <>
//             <h4 className="fw-bold mb-3">{singleProject.projectTypeId === "0002" ? "Appendix" : "Appendix 2"} (Databases)</h4>

//             <Row>
//                 <Col lg="12">
//                     <div className="mb-3">
//                         <Label for="appendix2-patents">Patents</Label>
//                         <textarea
//                             id="appendix2-patents"
//                             className="form-control"
//                             rows="4"
//                             placeholder="Enter relevant patent references or notes here"
//                             value={appendix2Patents || ""}
//                             onChange={(e) => setAppendix2Patents(e.target.value)}
//                         />
//                     </div>
//                 </Col>
//             </Row>
//             <Row>
//                 <Col lg="2">
//                     <div className="mb-3">
//                         <Button
//                             color="warning"
//                             className="w-100"
//                             onClick={handleSaveAppendix2Patents}
//                         >
//                             Save Summary
//                         </Button>
//                     </div>
//                 </Col>

//                 <Col>
//                     <SavedSuccess show={appendix2PatentsSaved} />
//                 </Col>

//             </Row>

//             <Row>
//                 <Col lg="12">
//                     <div className="mb-3">
//                         <Label for="appendix2-npl">Non-Patent Literature</Label>
//                         <textarea
//                             id="appendix2-npl"
//                             className="form-control"
//                             rows="4"
//                             placeholder="Enter non-patent literature references or notes here"
//                             value={appendix2NPL || ""}
//                             onChange={(e) => setAppendix2NPL(e.target.value)}
//                         />
//                     </div>
//                 </Col>
//             </Row>
//             <Row>
//                 <Col lg="2">
//                     <div className="mb-3">
//                         <Button
//                             color="warning"
//                             className="w-100"
//                             onClick={handleSaveAppendix2NPL}
//                         >
//                             Save Summary
//                         </Button>
//                     </div>
//                 </Col>
//                 <Col>
//                     <SavedSuccess show={appendix2NPLSaved} />
//                 </Col>
//             </Row>

//         </>
//     );
// };

// export default Appendix2;
