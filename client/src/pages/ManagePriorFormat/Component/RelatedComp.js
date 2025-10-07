import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { fetchESPData, googleBiblioData } from '../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const RelatedComp = ({ activeTab }) => {

    const dispatch = useDispatch();
    const data = useSelector(state => state.patentSlice.espData);
    const relatedBiblioGoogleData = useSelector(state => state.patentSlice.relatedBiblioGoogleData);

    const [patentNumber, setPatentNumber] = useState('');
    const [famId, setfamId] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorValidation, setErrorValidation] = useState(false);

    const handleFetchPatentData = async () => {
        const trimmedNumber = patentNumber.trim();
        setLoading(true);
        try {
            await fetchESPData(trimmedNumber, dispatch, 'related');
        } catch (error) {
            setErrorValidation(true);
            setfamId("");

            try {
                setErrorValidation(false);
                await googleBiblioData(trimmedNumber, dispatch, 'related');
            } catch (googleError) {
                setErrorValidation(true);
                console.error("❌ Google fallback failed:", googleError);
            }

            console.error("Espacenet fetch error:", error);
        } finally {
            setLoading(false);
        }
    };




    //  const handleFetchPatentData = async () => {
    //         const trimmedNumber = patentNumber.trim();
    //         setLoading(true);
    //         try {
    //             await fetchESPData(trimmedNumber, dispatch, 'relevant');
    //         } catch (error) {
    //             setErrorValidation(true);
    //             setfamId("");
    
    //             try {
    //                 setErrorValidation(false);
    //                 await googleBiblioData(trimmedNumber, dispatch);
    //                 console.log("✅ Google fallback succeeded");
    //             } catch (googleError) {
    //                 setErrorValidation(true);
    //                 console.error("❌ Google fallback failed:", googleError);
    //             }
    
    //             console.error("Espacenet fetch error:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };




    useEffect(() => {
        if (data?.patentNumber) {
            const familyMember = data.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
            const firstFamily = Array.isArray(familyMember) ? familyMember[0] : familyMember;
            const familyId = firstFamily?.["$"]?.["family-id"];
            if (familyId) {
                setfamId(`https://worldwide.espacenet.com/patent/search/family/0${familyId}/publication/${data?.patentNumber}?q=${data?.patentNumber}`);
            }
        }
    }, [data]);

    const biblioData = data?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];

    const inventorNames = useMemo(() => {
        const inventors = biblioData?.parties?.inventors?.inventor;
        const array = Array.isArray(inventors) ? inventors : inventors ? [inventors] : [];
        return array
            .filter(item => ['epodoc', 'original', 'docdb'].includes(item?.$?.['data-format']))
            .map(item => item?.['inventor-name']?.name?.replace(/,\s*;/g, ';')?.replace(/,\s*$/, '')?.trim())
            .filter(Boolean)
            .join('; ');
    }, [biblioData]);

    const applicantNames = useMemo(() => {
        const applicants = biblioData?.parties?.applicants?.applicant;
        const array = Array.isArray(applicants) ? applicants : applicants ? [applicants] : [];
        return array
            .filter(app => ['epodoc', 'original', 'docdb'].includes(app?.$?.['data-format']))
            .map(app => app?.['applicant-name']?.name?.replace(/,+$/, '').trim())
            .filter(Boolean)
            .join('; ');
    }, [biblioData]);

    const assigneeAndInventorsName = useMemo(() => {
        return applicantNames && inventorNames ? `${applicantNames} / ${inventorNames}` : '';
    }, [applicantNames, inventorNames]);

    const glAssigneesAndInventor = useMemo(() => {
        return relatedBiblioGoogleData.intentor && relatedBiblioGoogleData.assignees ?` ${relatedBiblioGoogleData.assignees} / ${relatedBiblioGoogleData.inventors}` : ''

    }, [relatedBiblioGoogleData.intentors, relatedBiblioGoogleData.assignees]);

    const inventionTitle = () => {
        const titleData = biblioData?.['invention-title'];
        if (Array.isArray(titleData)) {
            const enTitle = titleData.find(t => t?.$?.lang === 'en');
            return enTitle?._ || titleData[0]?._ || '';
        }
        return titleData?._ || '';
    };

    const publicationDate = () => {
        const docIds = biblioData?.['publication-reference']?.['document-id'];
        const date =
            Array.isArray(docIds)
                ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
                : docIds?.$?.['document-id-type'] === 'epodoc'
                    ? docIds.date
                    : null;
        return date && /^\d{8}$/.test(date) ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}` : '';
    };

    const famData = useMemo(() => {
        const familyMembers = data.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
        const familyArray = Array.isArray(familyMembers) ? familyMembers : familyMembers ? [familyMembers] : [];
        return familyArray.map(member => {
            const docs = member?.["publication-reference"]?.["document-id"] || [];
            const publicationInfo = (Array.isArray(docs) ? docs : [docs])
                .filter(doc => doc?.["$"]?.["document-id-type"] === "docdb")
                .map(doc => `${doc?.["country"]}${doc?.["doc-number"]}${doc?.["kind"]}`)
                .join('');
            return {
                familyId: member?.["$"]?.["family-id"],
                familyPatent: publicationInfo
            };
        });
    }, [data]);


    const memoInventionTitle = useMemo(() => inventionTitle(), [biblioData]);
    const memoPubDate = useMemo(() => publicationDate(), [biblioData]);

    return (

        <Container className="mt-4">
            <Row className="mb-3">
                <Col>
                    <motion.h4
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-primary fw-bold"
                    >
                        Related References
                    </motion.h4>
                </Col>
            </Row>

            {loading ? (
                <div className="blur-loading-overlay text-center mt-4">
                    <Spinner color="primary" />
                    <p className="mt-2 text-primary">Loading Related References...</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <form className="bg-light p-4 rounded shadow-sm" noValidate>
                        <Row className="mb-3 align-items-center">
                            <Col md={4}>
                                <label htmlFor="publicationNum" className="form-label fw-semibold">
                                    Publication Number
                                </label>
                            </Col>
                            <Col md={5}>
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    whileHover={{ scale: 1.01 }}
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="publicationNum"
                                    value={patentNumber?.trim() || ''}
                                    onChange={(e) => {setPatentNumber(e.target.value); setErrorValidation(false)}}
                                    placeholder="Enter Publication Number"
                                    style={{ border: errorValidation ? '1px solid red' : '' }}
                                />
                                {errorValidation && (
                                    <div className="text-danger mt-1">
                                        *Please enter a valid publication number.
                                    </div>
                                )}
                            </Col>
                            <Col md={3}>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    className="btn btn-primary btn-sm w-100"
                                    onClick={handleFetchPatentData}
                                    disabled={loading}
                                >
                                    {loading ? <Spinner size="sm" color="light" /> : 'Submit'}
                                </motion.button>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={4}>
                                <label htmlFor="url" className="form-label fw-semibold">
                                    Publication Number (URL)
                                </label>
                            </Col>
                            <Col md={8}>
                                <motion.div whileHover={{ scale: 1.01 }}>
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text">
                                            <i className="fas fa-link" />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="url"
                                            placeholder="Enter Publication Number URL"
                                            value={famId || relatedBiblioGoogleData.pageUrl}
                                        />
                                    </div>
                                </motion.div>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={4}>
                                <label htmlFor="title" className="form-label fw-semibold">Title</label>
                            </Col>
                            <Col md={8}>
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="title"
                                    value={memoInventionTitle || relatedBiblioGoogleData.title}
                                    placeholder="Enter Title"
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={4}>
                                <label htmlFor="inventors" className="form-label fw-semibold">
                                    Assignee(s)/Inventor(s)
                                </label>
                            </Col>
                            <Col md={8}>
                                <motion.div whileHover={{ scale: 1.01 }}>
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text">
                                            <i className="fas fa-users" />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inventors"
                                            value={assigneeAndInventorsName || glAssigneesAndInventor}
                                            placeholder="Semicolon (;) separated"
                                        />
                                    </div>
                                </motion.div>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={4}>
                                <label htmlFor="pubDate" className="form-label fw-semibold">
                                    Publication Date
                                </label>
                            </Col>
                            <Col md={4}>
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    type="date"
                                    className="form-control form-control-sm"
                                    id="pubDate"
                                    value={memoPubDate || relatedBiblioGoogleData.publicationDate}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <label htmlFor="familyMember" className="form-label fw-semibold">
                                    Family Member(s)
                                </label>
                            </Col>
                            <Col md={8}>
                                <motion.textarea
                                    whileFocus={{ scale: 1.01 }}
                                    className="form-control"
                                    id="familyMember"
                                    placeholder="Comma (,) separated"
                                    rows={3}
                                    value={famData?.map(f => f?.familyPatent).join(', ') || ''}
                                />
                            </Col>
                        </Row>
                    </form>
                </motion.div>
            )}
        </Container>
    )
}
export default RelatedComp;