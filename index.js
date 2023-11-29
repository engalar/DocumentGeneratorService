const express = require("express");
const bodyParser = require("body-parser");

// copy from service
import formatSize from "pretty-bytes";

import { createBrowser } from "./service/components/browser.js";
import { createRequestAnalyzer } from "./service/components/request-analyzer.js";
import { createDocumentGenerator } from "./service/components/document-generator.js";
import { createModuleConnector } from "./service/components/module-connector.js";
import { logLevel, logMessage } from "./service/components/logging.js";

const maxDocumentSize = 25000000; // 25 MB

const requestAnalyzer = enableMetrics ? createRequestAnalyzer() : undefined;
const moduleConnector = createModuleConnector(maxDocumentSize);

// end
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/executeCloudService", async (req, res) => {
    const {
        requestId,
        securityToken,
        timezone,
        timeout,
        applicationUrl,
        generatePath,
        resultPath,
        waitForResult,
        useScreenMediaType,
        waitForIdleNetwork,
        moduleVersion,
        runtimeVersion,
        projectId,
    } = req.body;

    console.log("Received parameters:");
    console.log("Request ID:", requestId);
    console.log("Security Token:", securityToken);
    console.log("Timezone:", timezone);
    console.log("Timeout:", timeout);
    console.log("Application URL:", applicationUrl);
    console.log("Generate Path:", generatePath);
    console.log("Result Path:", resultPath);
    console.log("Wait for Result:", waitForResult);
    console.log("Use Screen Media Type:", useScreenMediaType);
    console.log("Wait for Idle Network:", waitForIdleNetwork);
    console.log("Module Version:", moduleVersion);
    console.log("Runtime Version:", runtimeVersion);
    console.log("Project ID:", projectId);

    // params mapping
    const appUrl = applicationUrl,
        enableMetrics = false;

    // copy from service
    await withBrowser(async (browser) => {
        const documentGenerator = createDocumentGenerator(
            browser,
            requestAnalyzer
        );
        await documentGenerator.initialize();

        const pageUrl = new URL(`${appUrl}/${generatePath}?id=${requestId}`)
            .href;
        const resultUrl = new URL(`${appUrl}/${resultPath}?id=${requestId}`)
            .href;

        const document = await documentGenerator.generateDocument(
            appUrl,
            pageUrl,
            securityToken,
            timezone,
            useScreenMediaType,
            waitForIdleNetwork
        );

        if (document === undefined)
            throw new Error(`Failed to generate document. Document is empty`);

        const documentSize = formatSize(document.length, {
            minimumFractionDigits: 3,
        });

        logMessage(`Document size: ${documentSize}`);

        if (enableMetrics) {
            const metrics = await documentGenerator.getPageMetrics();
            logMessage(`Page metrics: ${JSON.stringify(metrics)}`);

            const requestStatistics = documentGenerator.getRequestStatistics();
            logMessage(
                `Request statistics: ${JSON.stringify(requestStatistics)}`
            );
        }

        await moduleConnector.sendResult(resultUrl, document, securityToken);
    }).catch((error) => {
        logMessage(error.message, logLevel.error);
        process.exit(1);
    });

    async function withBrowser(fn) {
        const browser = createBrowser(chromePath);
        await browser.initialize();

        try {
            await fn(browser).catch((error) => {
                throw error;
            });
        } finally {
            await browser.close();
        }
    }
    //end

    res.status(200).send("Request received successfully");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
