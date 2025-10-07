const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");

const VERSIONS = [
    "20250101",
    "20240101",
    "20230101",
    "20220101",
    "20210101",
    "20200101",
    "20190101",
    "20180101",
    "20170101",
    "20160101",
    "20150101",
    "20140101",
    "20130101",
    "20120101",
    "20110101",
    "20100101",
    "20090101"
];


router.get("/:symbol", async (req, res) => {
    const { symbol } = req.params;

    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        for (const version of VERSIONS) {
            try {
                const url = `https://ipcpub.wipo.int/?notion=scheme&version=${version}&symbol=${symbol}&menulang=en&lang=en&viewmode=f`;

                await page.goto(url, { waitUntil: "networkidle2", timeout: 3000000 });

                try {
                    await page.waitForSelector("a.symbol", { timeout: 1000000 });

                    const result = await page.evaluate((symbol) => {
                        const rows = document.querySelectorAll("tr");
                        for (let row of rows) {
                            const symbolLink = row.querySelector("a.symbol");
                            if (symbolLink && symbolLink.textContent.trim() === symbol) {
                                const titleDiv = row.querySelector("td[colspan='2'] div");
                                return {
                                    symbol,
                                    title: titleDiv?.textContent.trim() || "No title found",
                                    url: symbolLink.href,
                                };
                            }
                        }
                        return null;
                    }, symbol);

                    if (result) {
                        await browser.close();
                        return res.json({
                            ...result,
                            versionUsed: version
                        });
                    }
                } catch (e) {
                    console.log(`Version ${version} didn't work, trying next...`);
                    continue;
                }
            } catch (e) {
                console.log(`Error with version ${version}: ${e.message}`);
                continue;
            }
        }

        await browser.close();
        res.status(404).json({
            error: "Symbol not found in any available version",
            versionsTried: VERSIONS
        });

    } catch (err) {
        console.error("Puppeteer Error:", err.message);
        if (browser) await browser.close();
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;













// const express = require("express");
// const router = express.Router();
// const puppeteer = require("puppeteer");

// router.get("/:symbol", async (req, res) => {
//   const { symbol } = req.params;
//   const version = "";
//   const url = `https://ipcpub.wipo.int/?notion=scheme&version=${version}&symbol=${symbol}&menulang=en&lang=en&viewmode=f`;

//   try {
//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

//     await page.waitForSelector("a.symbol", { timeout: 100000 });

//     const result = await page.evaluate((symbol) => {
//       const rows = document.querySelectorAll("tr");
//       for (let row of rows) {
//         const symbolLink = row.querySelector("a.symbol");
//         if (symbolLink && symbolLink.textContent.trim() === symbol) {
//           const titleDiv = row.querySelector("td[colspan='2'] div");
//           return {
//             symbol,
//             title: titleDiv?.textContent.trim() || "No title found",
//             url: symbolLink.href,
//           };
//         }
//       }
//       return null;
//     }, symbol);

//     await browser.close();

//     if (result) {
//       res.json(result);
//     } else {
//       res.status(404).json({ error: "Symbol not found" });
//     }
//   } catch (err) {
//     console.error("Puppeteer Error:", err.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;
