import React, { useState, useEffect, } from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { motion } from 'framer-motion';
import { fetchESPData, googleBiblioData } from '../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice';
import { useDispatch, useSelector } from 'react-redux';
import { mapFamilyMemberData } from '../ReusableComp/Functions';
import { FaFileWord } from "react-icons/fa";
import { generateWordDoc } from '../ReusableComp/generateWordDoc';
import ParagraphDescription from './ParagraphDescription ';
import TiffViewer from '../ReusableComp/TiffViewer';



const ReleventComp = () => {

    const dispatch = useDispatch();
    const data = useSelector(state => state.patentSlice.fetchESPData);
    const releventBiblioGoogleData = useSelector(state => state.patentSlice.releventBiblioGoogleData);

    const googleClassCPC = releventBiblioGoogleData.classifications?.map(map => map.leafCode).join(', ');

    const [patentNumber, setPatentNumber] = useState('');
    const [famId, setfamId] = useState("");
    const [loading, setLoading] = useState(false);
    const [filteredDescriptions, setFilteredDescriptions] = useState({});
    const [errorValidation, setErrorValidation] = useState(false);


    const handleFetchPatentData = async () => {
        const trimmedNumber = patentNumber.trim();
        setLoading(true);
        try {
            await fetchESPData(trimmedNumber, dispatch, 'relevant');
        } catch (error) {
            setErrorValidation(true);
            setfamId("");

            try {
                setErrorValidation(false);
                await googleBiblioData(trimmedNumber, dispatch, 'relevant');
            } catch (googleError) {
                setErrorValidation(true);
                console.error("❌ Google fallback failed:", googleError);
            }

            console.error("Espacenet fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    function getEnglishAbstract(biblio) {
        const abstractArray = biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.abstract;
        if (Array.isArray(abstractArray)) {
            const englishEntry = abstractArray.find(entry => entry?.$?.lang === 'en');
            return englishEntry?.p || 'No English abstract found.';
        } else if (typeof abstractArray === 'object') {
            return abstractArray.p;
        }

        return null;
    }

    const abstractData = getEnglishAbstract(data.biblio);


    function convertDescriptionToKeyValue(descriptionText) {
        const result = {};
        const text = descriptionText || '';

        const matches = text.matchAll(/\[\d{4}\][\s\S]*?(?=\[\d{4}\]|$)/g);

        for (const match of matches) {
            const entry = match[0].trim();
            const keyMatch = entry.match(/^\[(\d{4})\]/);
            if (keyMatch) {
                const key = keyMatch[1];
                const value = entry.replace(/^\[\d{4}\]/, '').trim();
                result[key] = value;
            }
        }

        return result;
    };

    const descArray = data.descriptionData?.['world-patent-data']?.['fulltext-documents']?.['fulltext-document']?.description.p;

    const descriptionText = descArray?.join('\n') || '';
    const formattedDescriptions = convertDescriptionToKeyValue(descriptionText);

    useEffect(() => {
        if (data?.patentNumber !== undefined) {
            let familyIDs = [];
            const familyMember = data.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
            if (Array.isArray(familyMember)) {
                familyIDs = data.familyData["world-patent-data"]?.["patent-family"]?.["family-member"][0]?.["$"]?.["family-id"];
            } else if (typeof familyMember === 'object') {
                familyIDs = data.familyData["world-patent-data"]?.["patent-family"]?.["family-member"]?.["$"]?.["family-id"];
            }
            setfamId(`https://worldwide.espacenet.com/patent/search/family/0${familyIDs}/publication/${data?.patentNumber}?q=${data?.patentNumber}`);
        }
    }, [data])

    const biblioData = data?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];
    const inventorsData = biblioData?.parties?.inventors?.inventor;

    const inventorsArray = Array.isArray(inventorsData) ? inventorsData : inventorsData ? [inventorsData] : [];

    const inventorNames = inventorsArray.filter(item =>
        ['epodoc', 'original', 'docdb'].includes(item?.$?.['data-format'])).map(item => item?.['inventor-name']?.name
            ?.replace(/,\s*;/g, ';')?.replace(/,\s*$/, '')?.trim()).filter(Boolean).join('; ');

    const applicantsData = biblioData?.parties?.applicants?.applicant;

    const applicantsArray = Array.isArray(applicantsData) ? applicantsData : applicantsData ? [applicantsData] : [];

    const applicantNames = applicantsArray.filter(app => ['epodoc', 'original', 'docdb'].includes(app?.$?.['data-format']))
        .map(app => app?.['applicant-name']?.name?.replace(/,+$/, '').trim()).filter(Boolean).join(', ');

    const inventionTitle = () => {
        const titleData = biblioData?.['invention-title'];

        if (Array.isArray(titleData)) {
            const enTitle = titleData.find(t => t?.$?.lang === 'en');
            if (enTitle) {
                return enTitle._ || '';
            }
            return titleData[0]._ || '';
        }
        else if (titleData?.$?.lang === 'en') {
            return titleData._ || '';
        }
        return titleData?._ || '';
    }

    const title = inventionTitle();

    const applicationDate = () => {
        const docIds = biblioData?.['application-reference']?.['document-id'];

        const epodocDate = Array.isArray(docIds)
            ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
            : docIds?.$?.['document-id-type'] === 'epodoc'
                ? docIds.date
                : null;

        const formatDate = (dateStr) =>
            dateStr && /^\d{8}$/.test(dateStr)
                ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
                : '';

        return formatDate(epodocDate);
    }

    const aplDate = applicationDate();

    const publicationDate = () => {
        const docIds = biblioData?.['publication-reference']?.['document-id'];

        const epodocDate = Array.isArray(docIds)
            ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
            : docIds?.$?.['document-id-type'] === 'epodoc'
                ? docIds.date
                : null;

        const formatDate = (dateStr) =>
            dateStr && /^\d{8}$/.test(dateStr)
                ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
                : '';

        return formatDate(epodocDate);
    }

    const pubDate = publicationDate();


    const getPriorityDates = (biblioData) => {
        let claims = biblioData?.['priority-claims']?.['priority-claim'];
        if (!claims) return '';

        if (!Array.isArray(claims)) claims = [claims];

        for (const claim of claims) {
            let doc = claim?.['document-id'];
            if (!doc) continue;

            if (!Array.isArray(doc)) doc = [doc];

            const epodoc = doc.find(d => d?.$?.['document-id-type'] === 'epodoc');
            const rawDate = epodoc?.date?.trim();

            if (rawDate && /^\d{8}$/.test(rawDate)) {
                return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
            }
        }
        return '';
    };

    const priorityDates = getPriorityDates(biblioData);

    const classifications = () => {
        const patentClassifications = biblioData?.['patent-classifications']?.['patent-classification'];

        if (!Array.isArray(patentClassifications)) {
            return { cpc: '', US_Classification: '' };
        }

        const cpcSet = new Set();
        const usSet = new Set();

        patentClassifications.forEach((item) => {
            const { 'classification-scheme': scheme, section, class: classValue, subclass, 'main-group': mainGroup, subgroup } = item;

            if (scheme?.$?.scheme === 'CPCI' && section && classValue && subclass && mainGroup && subgroup) {
                const cpcCode = `${section}${classValue}${subclass}${mainGroup}/${subgroup}`;
                cpcSet.add(cpcCode);
            }

            if (scheme?.$?.scheme === 'UC') {
                const classificationSymbol = item['classification-symbol'];
                if (classificationSymbol) {
                    usSet.add(classificationSymbol);
                }
            }
        });

        return {
            cpc: cpcSet.size ? Array.from(cpcSet).join(', ') : '',
            US_Classification: usSet.size ? Array.from(usSet).join(', ') : ''
        };
    };

    const classData = classifications();

    const ipcrRaw = biblioData?.['classifications-ipcr']?.['classification-ipcr'];
    const ipc = biblioData?.['classification-ipc']?.text || '';

    const extractIPCCode = (text) => {
        const match = text?.match(/[A-H][0-9]{2}[A-Z]\s*\d+\/\s*\d+/);
        return match ? match[0].replace(/\s+/g, '') : '';
    };

    const ipcrText = Array.isArray(ipcrRaw)
        ? ipcrRaw.map(item => extractIPCCode(item?.text)).filter(Boolean).join(', ')
        : extractIPCCode(ipcrRaw?.text) || '';

    const ipcFormatted = ipc ? `${ipc}, ` : '';
    const ipcrFormatted = ipcrText ? `${ipcrText}, ` : '';

    const classificationsSymbol = `${ipcrFormatted}${ipcFormatted}${classData.cpc}`;

    const famData = mapFamilyMemberData(data);

    const familyMemData = famData?.map(f => f?.familyPatent).join(', ');

    useEffect(() => {
        const isAnyMissing = [
            inventorNames,
            title,
            applicantNames,
            pubDate,
            aplDate,
            priorityDates,
            classificationsSymbol,
            familyMemData,
            // abstractData,
            // filteredDescriptions
        ].some(
            (val) =>
                val === undefined ||
                val === null ||
                (typeof val === 'string' && val.trim() === '') ||
                (Array.isArray(val) && val.length === 0)
        );

        if (data.biblio && isAnyMissing) {
            (async () => {
                try {
                    setErrorValidation(false);
                    await googleBiblioData(patentNumber.trim(), dispatch, 'relevant');
                } catch (googleError) {
                    setErrorValidation(true);
                    console.error('❌ Google fallback failed:', googleError);
                }
            })();
        }
    }, [
        inventorNames,
        title,
        applicantNames,
        pubDate,
        aplDate,
        priorityDates,
        classificationsSymbol,
        familyMemData,
        // abstractData,
        // filteredDescriptions
    ]);


    return (

        <Container className="mt-4 mb-5">
            <Row className="mb-3 align-items-center justify-content-between">
                <Col>
                    <motion.h4
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-primary fw-bold"
                    >
                        Relevant References
                    </motion.h4>
                </Col>

                <Col className="d-flex justify-content-end">
                    <button
                        onClick={() => generateWordDoc({
                            publicationNumber: patentNumber || releventBiblioGoogleData.patentNumber,
                            publicationUrl: famId || releventBiblioGoogleData.pageUrl,
                            title: title || releventBiblioGoogleData.title,
                            inventors: inventorNames || releventBiblioGoogleData.inventors,
                            assignees: applicantNames || releventBiblioGoogleData.assignees,
                            publicationDate: pubDate || releventBiblioGoogleData.publicationDate,
                            applicationDate: aplDate || releventBiblioGoogleData.applicationDate,
                            priorityDate: priorityDates || releventBiblioGoogleData.priorityDate,
                            familyMembers: familyMemData || releventBiblioGoogleData,
                            abstract: abstractData || releventBiblioGoogleData.abstract,
                            ipcCpcClassification: classificationsSymbol || googleClassCPC,
                            // usClassification: classData.US_Classification,
                            filteredDescriptions: filteredDescriptions,
                        })}
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
                    >
                        <FaFileWord size={15} /> Download
                    </button>
                </Col>
            </Row>
            {loading ? (
                <div className="blur-loading-overlay text-center mt-4">
                    <Spinner color="primary" />
                    <p className="mt-2 text-primary">Loading Relevant References...</p>
                </div>

            ) : (

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-light p-4 rounded shadow-sm"
                    noValidate
                >
                    <Row className="mb-3 align-items-center">
                        <Col md={4}><label className="form-label fw-semibold" htmlFor="publicationNum">Publication Number</label></Col>
                        <Col md={5}>
                            <motion.input
                                whileFocus={{ scale: 1.02 }}
                                type="text"
                                className="form-control form-control-sm"
                                id="publicationNum"
                                value={patentNumber?.trim() || ''}
                                onChange={(e) => { setPatentNumber(e.target.value); setErrorValidation(false) }}
                                placeholder="Enter Publication Number"
                                style={{ border: errorValidation ? '1px solid red' : '' }}
                            />
                            {errorValidation && <div className="text-danger mt-2">*Please enter a valid publication number.</div>}

                        </Col>
                        <Col md={3}>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                className="btn btn-primary btn-sm w-100"
                                onClick={handleFetchPatentData}
                            >
                                Submit
                            </motion.button>
                        </Col>
                    </Row>
                    {[
                        { label: 'Publication Number (URL)', value: famId || releventBiblioGoogleData.pageUrl, icon: 'fas fa-link', id: 'url', placeholder: 'Enter URL' },
                        { label: 'Title', value: title || releventBiblioGoogleData.title?.trim(), id: 'title', placeholder: 'Enter Title' },
                        { label: 'Inventor(s)', value: inventorNames || releventBiblioGoogleData.inventors, icon: 'fas fa-users', id: 'inventors', placeholder: 'Semicolon (;) separated' },
                        { label: 'Assignee(s)', value: applicantNames || releventBiblioGoogleData.assignees, icon: 'fas fa-user', id: 'assignees', placeholder: 'Comma (,) separated' }
                    ].map(({ label, value, icon, id, placeholder }, i) => (
                        <Row key={i} className="mb-3 align-items-center">
                            <Col md={4}><label htmlFor={id} className="form-label fw-semibold">{label}</label></Col>
                            <Col md={8}>
                                <motion.div whileHover={{ scale: 1.01 }}>
                                    <div className="input-group input-group-sm">
                                        {icon && (
                                            <span className="input-group-text">
                                                <i className={icon}></i>
                                            </span>
                                        )}
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={id}
                                            placeholder={placeholder}
                                            value={value || ''}
                                            readOnly={typeof value === 'function'}
                                        />
                                    </div>
                                </motion.div>
                            </Col>
                        </Row>
                    ))}

                    {[
                        { label: 'Grant/Publication Date', value: pubDate || releventBiblioGoogleData.publicationDate, id: 'pubDate' },
                        { label: 'Filing/Application Date (Optional)', value: aplDate || releventBiblioGoogleData.applicationDate, id: 'applicationDate' },
                        { label: 'Priority Date (Optional)', value: priorityDates || releventBiblioGoogleData.priorityDate, id: 'priorityDate' }
                    ].map(({ label, value, id }, i) => (
                        <Row key={i} className="mb-3 align-items-center">
                            <Col md={4}><label htmlFor={id} className="form-label fw-semibold">{label}</label></Col>
                            <Col md={4}>
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    type="date"
                                    className="form-control form-control-sm"
                                    id={id}
                                    value={value || ''}
                                />
                            </Col>
                        </Row>
                    ))}

                    {[
                        { label: 'IPC/CPC Classification', value: classificationsSymbol || googleClassCPC, id: 'ipc' },
                        { label: 'US Classification (Optional)', value: classData.US_Classification, id: 'usClassification' },
                        { label: 'Family Member(s)', value: familyMemData, id: 'familyMember' }
                    ].map(({ label, value, id }, i) => (
                        <Row key={i} className="mb-3 align-items-center">
                            <Col md={4}><label htmlFor={id} className="form-label fw-semibold">{label}</label></Col>
                            <Col md={8}>
                                <motion.textarea
                                    whileFocus={{ scale: 1.01 }}
                                    className="form-control"
                                    id={id}
                                    placeholder={`Enter ${label}`}
                                    rows={3}
                                    value={value || ''}
                                />
                            </Col>
                        </Row>
                    ))}
                    {/* <div>
                        {console.log('data.drawings :>> ', data.drawings)}
                        <TiffViewer base64Data={data.drawings} />
                    </div> */}

                    {/* <div>
                            <ParagraphDescription
                                paragraphData={formattedDescriptions}
                                filteredDescriptions={filteredDescriptions}
                                setFilteredDescriptions={setFilteredDescriptions}
                                patentId={patentNumber}
                            />
                        </div> */}
                </motion.form>

            )}
        </Container>
    );
};

export default ReleventComp;
