const DatabaseSource = require("../models/cln_keystrings_database_name");
const cln_prior_report_schema = require("../models/livePatentScema/cln_prior_report_schema");

export const initializeAppendix1KeyStrings = async (projectId) => {
    const project = await cln_prior_report_schema.findById(projectId);
    if (!project) throw new Error("Project not found");

    if (!project.stages.appendix1 || project.stages.appendix1.length === 0) {
        const sourcesDoc = await DatabaseSource.findOne();
        const sources = sourcesDoc?.sources || [];

        const keyStringsMap = new Map();
        sources.forEach((s) => {
            if (s.value !== "addNew") keyStringsMap.set(s.value, []);
        });

        project.stages.appendix1 = [
            {
                keyStrings: keyStringsMap,
            }
        ];

        await project.save();
    }

    return project.stages.appendix1[0].keyStrings;
};