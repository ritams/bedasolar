import html2pdf from 'html2pdf.js';

export const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadPDF = (base64Data, filename = 'proposal.pdf') => {
  const pdfBlob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], { 
    type: 'application/pdf' 
  });
  downloadFile(pdfBlob, filename);
};

export const downloadProposalAsPDF = (elementId, filename = 'BEDA-Proposal.pdf') => {
  const element = document.getElementById(elementId);
  
  const options = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  return html2pdf().set(options).from(element).save();
}; 