const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mern_db";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// API Routes
const nodeRoutes = require("./routes/nodeRoutes");
const edgeRoutes = require("./routes/edgeRoutes");
const patentRoutes = require("./routes/patentRoutes");
// const classification = require("./utils/Classifications");
const lensRoutes = require("./routes/lensRoutes");
const espRoutes = require("./routes/espAPiRoutes");
const espAPiRoutes = require("./routes/espPatentRoute");
const espLegalStatus = require("./routes/espLegalStatusRoute");
const classifyRoute = require("./routes/classifyRoute");
const wipoClassRoutes = require("./routes/wipoClassRoutes");
const chatRoute = require("./routes/chatRoute");
const cpcGoogleRoutes = require("./routes/cpcGoogleRoutes");
const bulkBiblioData = require("./routes/bulkBiblioRoute");
// const DatabaseSourceRoutes  = require("./routes/livePatentRoute/databaseSources");

const bulkClassificationTEsting = require("./routes/bulkClassificationTEsting");

// ipc route
const ipcRoute = require("./routes/ipcRoute");
app.use("/api/ipc-definition", ipcRoute);


const descriptionRoute = require("./routes/descriptionRoute");

app.use("/esp/patentdata", espAPiRoutes);
app.use("/esp/legalStatus", espLegalStatus);

app.use("/cpc/classify", classifyRoute);
app.use("/class",bulkClassificationTEsting );

app.use("/description/data", descriptionRoute);
app.use("/api/chatbox", chatRoute);
app.use("/cpc/google", cpcGoogleRoutes);

app.use("/bulk/biblio", bulkBiblioData);



app.use("/api/classification", wipoClassRoutes);

app.use("/mindmap", nodeRoutes);
app.use("/mindmapedge", edgeRoutes);

app.use("/patent", patentRoutes);
// app.use("/api/classification", classification);

app.use("/api/lens", lensRoutes)
app.use("/api/espacenet", espRoutes)

// Ket str database
// app.use("/keystrings/sources", DatabaseSourceRoutes )






              //  --------------------- LIVE ------------------------------ 

// ESP Routes
const liveEspPatentBiblioRoute = require("./routes/liveEspPatentBiblioRoute");
app.use("/live/espbiblio", liveEspPatentBiblioRoute);

// Google Routes
const liveGoogPatentBiblioRoute = require("./routes/liveGooglePatentBiblioRoute");
app.use("/live/googlebiblio", liveGoogPatentBiblioRoute);

// Project Scema
const cln_project_schema = require("./routes/livePatentRoute/projectRoutes");
app.use("/live/projectname", cln_project_schema);

// Feedback patent number
const feedbackPatentNumber = require("./routes/livePatentRoute/feedbackRoute");
app.use("/live/feedback", feedbackPatentNumber);


// Text translation route
const translationRoute = require("./routes/utilsRoute/translationRoute");
app.use("/text/translate", translationRoute);

// Bulk Translate
const bulkTranlate = require("./routes/bulkTranlate");
app.use("/translation", bulkTranlate);






const wordRoute = require("./routes/wordConvertRoute");

app.use(bodyParser.json({ limit: "10mb" }));

// Register route
app.use("/api/word", wordRoute);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const bodyParser = require('body-parser');
// const { BigQuery } = require('@google-cloud/bigquery');

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_db";

// // MongoDB Connection
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("MongoDB connected"))
// .catch((err) => console.error("MongoDB connection error:", err));

// // API Routes
// const nodeRoutes = require("./routes/nodeRoutes");
// const edgeRoutes = require("./routes/edgeRoutes");


// app.use("/mindmap", nodeRoutes);
// app.use("/mindmapedge", edgeRoutes);


// // Default Route
// app.get("/", (req, res) => res.send("API is running..."));

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });













// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// app.post('/api/patent', async (req, res) => {
//   const { patentNumber } = req.body;

//   try {
//     const response = await axios.get(`https://api.patentsview.org/patents/query`, {
//       params: {
//         q: JSON.stringify({ patent_number: patentNumber }),
//         f: JSON.stringify([
//           "patent_number",
//           "patent_title",
//           "patent_date",
//           "application_date",
//           "inventor_first_name",
//           "inventor_last_name",
//           "assignee_organization",
//           "cpc_subgroup_id"
//         ])
//       }
//     });

//     const result = response.data.patents?.[0];
//     if (!result) {
//       return res.status(404).json({ error: "Patent not found" });
//     }

//     const data = {
//       publicationNo: result.patent_number,
//       title: result.patent_title,
//       inventors: result.inventors?.map(inv => `${inv.inventor_first_name} ${inv.inventor_last_name}`).join('; '),
//       assignee: result.assignees?.[0]?.assignee_organization || "N/A",
//       publicationDate: result.patent_date,
//       filingDate: result.application_date,
//       classification: result.cpcs?.map(cpc => cpc.cpc_subgroup_id).join('; ') || "N/A"
//     };

//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });













// server.js
// const express = require("express");
// const { BigQuery } = require("@google-cloud/bigquery");
// const app = express();
// const PORT = process.env.PORT || 5000;

// // TODO: replace with the path to your service account key JSON file
// const bigquery = new BigQuery({
//   keyFilename: "./service-account-key.json",
// });

// app.get("/patent/:id", async (req, res) => {
//   const publicationNumber = req.params.id;

//   const query = `
//     SELECT
//       publication_number,
//       title_localized.text AS title,
//       filing_date,
//       publication_date,
//       priority_date,
//       ARRAY(SELECT CONCAT(inv.name_first, ' ', inv.name_last) FROM UNNEST(inventor_harmonized) AS inv) AS inventors,
//       ARRAY(SELECT assignee.name FROM UNNEST(assignee_harmonized) AS assignee) AS assignees,
//       ARRAY(SELECT ipc.code FROM UNNEST(ipc) AS ipc) AS ipc_codes,
//       ARRAY(SELECT cpc.code FROM UNNEST(cpc) AS cpc) AS cpc_codes
//     FROM `bigquery-public-data.patents.publications`
//     WHERE publication_number = @pubNum
//     LIMIT 1;
//   `;

//   const options = {
//     query: query,
//     params: { pubNum: publicationNumber },
//     location: "US",
//   };

//   try {
//     const [job] = await bigquery.createQueryJob(options);
//     const [rows] = await job.getQueryResults();

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Patent not found" });
//     }

//     const data = rows[0];
//     res.json({
//       publication_number: data.publication_number,
//       title: data.title,
//       inventors: data.inventors || [],
//       assignees: data.assignees || [],
//       publication_date: data.publication_date,
//       application_date: data.filing_date,
//       priority_date: data.priority_date,
//       ipc: data.ipc_codes.join('; ') || 'Nil',
//       cpc: data.cpc_codes.join('; ') || 'Nil',
//       family_member: "Nil", // Static since dataset lacks family info
//     });
//   } catch (error) {
//     console.error("BigQuery Error:", error);
//     res.status(500).json({ error: "Failed to fetch patent data" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });






// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const bodyParser = require('body-parser');
// const { BigQuery } = require('@google-cloud/bigquery');

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_db";

// // MongoDB Connection
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("MongoDB connected"))
// .catch((err) => console.error("MongoDB connection error:", err));

// // API Routes
// const nodeRoutes = require("./routes/nodeRoutes");
// const edgeRoutes = require("./routes/edgeRoutes");

// const patentRouter = require("./routes/patent")

// app.use("/mindmap", nodeRoutes);
// app.use("/mindmapedge", edgeRoutes);


// app.use('/api', patentRouter);


// // const bigquery = new BigQuery({
// //   keyFilename: './gcloud-service-account.json',
// // });

// // app.post('/patent', async (req, res) => {
// //   const { patentNumber } = req.body;
// //   console.log('patentNumber :>> ', patentNumber);

// //   const query = `
// //     SELECT
// //       publication_number,
// //       title_localized.en AS title,
// //       filing_date,
// //       publication_date,
// //       priority_date,
// //       ARRAY_TO_STRING(ARRAY(SELECT name FROM UNNEST(inventor_harmonized)), ", ") AS inventors,
// //       ARRAY_TO_STRING(ARRAY(SELECT name FROM UNNEST(assignee_harmonized)), ", ") AS assignee,
// //       ARRAY_TO_STRING(ARRAY(SELECT code FROM UNNEST(cpc)), ", ") AS classification
// //     FROM \`patents-public-data.patents.publications\`
// //     WHERE publication_number = '${patentNumber}'
// //     LIMIT 1
// //   `;

// //   try {
// //     const [rows] = await bigquery.query({ query });

// //     if (rows.length === 0) return res.status(404).json({ message: 'Patent not found' });

// //     const row = rows[0];

// //     console.log('Output Details:', row);

// //     res.json({
// //       patentNumber: row.publication_number,
// //       title: row.title || 'N/A',
// //       inventors: row.inventors || 'N/A',
// //       assignee: row.assignee || 'N/A',
// //       publicationDate: row.publication_date || 'N/A',
// //       filingDate: row.filing_date || 'N/A',
// //       priorityDate: row.priority_date || 'N/A',
// //       classification: row.classification || 'N/A',
// //       usClassification: 'N/A',
// //       familyMembers: 'N/A',
// //     });

// //   } catch (err) {
// //     console.error('Error querying BigQuery:', err);
// //     res.status(500).send('Internal server error');
// //   }
// // });




// // Default Route
// app.get("/", (req, res) => res.send("API is running..."));

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
