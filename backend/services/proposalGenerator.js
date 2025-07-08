import PDFDocument from 'pdfkit';

const template = (data) => `Proposal for ${data.name}

Invoice Number: ${data.invoiceNumber}

Address:
${data.address}

We are submitting this proposal based on your request. Feel free to reach out at ${data.email}.`;

export const generatePDF = async (data) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks = [];
    
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    
    doc.fontSize(16).text('Proposal for ' + data.name, 50, 50);
    doc.fontSize(12).text(`Invoice Number: ${data.invoiceNumber}`, 50, 100);
    doc.text('Address:', 50, 130);
    doc.text(data.address, 50, 150);
    doc.text(`We are submitting this proposal based on your request. Feel free to reach out at ${data.email}.`, 50, 200);
    
    doc.end();
  });
};

export const generateHTML = (data) => `
<!DOCTYPE html>
<html><head><title>Proposal</title></head>
<body style="font-family: Arial; margin: 40px;">
<h1>Proposal for ${data.name}</h1>
<p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
<p><strong>Address:</strong><br>${data.address}</p>
<p>We are submitting this proposal based on your request. Feel free to reach out at ${data.email}.</p>
</body></html>
`; 