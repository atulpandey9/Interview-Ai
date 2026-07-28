const puppeteer = require("puppeteer");

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
 
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
 
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}
 
module.exports = {
  generatePdfFromHtml,
};