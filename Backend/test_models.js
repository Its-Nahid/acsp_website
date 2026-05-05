const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyDtilUhesVTSiai41WUwqiqkYoBe6Zw-nI");
async function run() {
  // wait there is no listModels on the genAI instance.
  // Actually, we can fetch from the REST api.
}
run();
