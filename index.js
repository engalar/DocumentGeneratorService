const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/executeCloudService", (req, res) => {
    const {
        requestId,
        securityToken,
        timezoneId,
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
    console.log("Timezone ID:", timezoneId);
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

    // You can add the logic to process the parameters and send a response here

    res.status(200).send("Request received successfully");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
