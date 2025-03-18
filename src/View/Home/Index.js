import {
  Box,
  FormControl,
  FormLabel,
  Grid2,
  TextField,
  Button,
} from "@mui/material";
import AppNavBar from "../../components/Navbar";
import AppTheme from "../../theme/AppTheme";
import { styled } from "@mui/material/styles";
import { GeneratePDFService } from "../../services/GeneratePDFService";
import { useState } from "react";
import jsPDF from "jspdf";


const FormGrid = styled(Grid2)(() => ({
  display: "flex",
  flexDirection: "column",
}));

function Home(props) {
  const [jobID,setJobID] = useState('');
  const [clientName,setClientName] = useState('');
  const [pdfView, setPdfView] = useState(null);    

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const filters = {
      jobId: jobID,
      clientName: clientName,
      userId: localStorage.getItem("userID")
    }
  
    await GeneratePDFService.FilterToPDF(filters);
   
    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
	
		// Set up some default styles
		doc.setFont("helvetica", "bold");
		doc.setFontSize(18);
		doc.text("Contract Agreement", 105, 20, { align: "center" });
		
    // Add a logo if desired (x, y, width, height)
		// Assuming you have a base64 string for the logo
		// const logoBase64 = '';
		// doc.addImage(logoBase64, "PNG", 4, 4, 40, 20);


		// Add contract data (reset font style)
		doc.setFont("helvetica", "normal");
		doc.setFontSize(12);
		var yPos = 40;
		
		// Insert form data
		const today = new Date();
		const day = today.getDate().toString().padStart(2, '0');
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const month = monthNames[today.getMonth()];
		const year = today.getFullYear().toString().slice(-2);
		const formattedDate = `${day}-${month}-${year}`;
		
		doc.text(`Date: ${formattedDate}`, 10, yPos);
		yPos += 15;
		doc.text(`Job ID: ${jobID}`, 10, yPos);
		yPos += 10;
		doc.text(`Client Name: ${clientName}`, 10, yPos);
		yPos += 10;
		
		// Terms and Conditions Section
		doc.setFont("helvetica", "bold");
		doc.text("Terms and Conditions", 10, yPos);
		yPos += 10;
		doc.setFont("helvetica", "normal");
		
		// Static terms and conditions text (this can be dynamic if needed)
		const terms = "1. The client agrees to the terms as outlined in this document.\n" +
					"2. Payment terms are net 30 days from the date of invoice.\n" +
					"3. Both parties agree to resolve any disputes amicably.\n" +
					"4. This contract is governed by the laws of [Your Jurisdiction].\n";
		const splitTerms = doc.splitTextToSize(terms, 180); // Wrap text to 180mm width
		doc.text(splitTerms, 10, yPos);
		yPos += splitTerms.length * 7;
		
		// Add a page break if needed
		if (yPos > 250) {
		  doc.addPage();
		    yPos = 20;
		  }
		
		// Signature Fields
		doc.setFont("helvetica", "bold");
		doc.text("Authorized Signature:", 10, yPos + 20);
		// Draw a line for signature (x1, y1, x2, y2)
		doc.line(60, yPos + 18, 150, yPos + 18);
		
		doc.text("Client Signature:", 10, yPos + 40);
		doc.line(60, yPos + 38, 150, yPos + 38);
		
		const pdfDataUri = doc.output('datauristring');
    setPdfView(pdfDataUri);
  };

  return (
    <AppTheme {...props}>
      <AppNavBar></AppNavBar>
      <Box sx={{ padding: "10px" }} component="form" onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          <FormGrid sx={{ xs: 12, md: 6, sm: 6 }}>
            <FormControl>
              <FormLabel htmlFor="job-id">Job ID</FormLabel>
              <TextField
                id="job-id"
                variant="outlined"
                placeholder="Enter Job ID"
                value={jobID}
                type="text"
                onChange={(e) => setJobID(e.target.value)}
              />
            </FormControl>
          </FormGrid>
          <FormGrid sx={{ xs: 12, md: 6, sm: 6 }}>
            <FormControl>
              <FormLabel htmlFor="client-name">Client Name</FormLabel>
              <TextField
                id="client-name"
                name="Client Name"
                variant="outlined"
                placeholder="Enter Client Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                type="text"
              />
            </FormControl>
          </FormGrid>
        </Grid2>
        <Grid2 sx={{padding: '5px'}}>          
            <Button
              variant="contained"
              color="info"
              sx={{ fontWeight: "bold", letterSpacing: "1px" }}
              type="submit"
            >
              Generate PDF
            </Button>          
        </Grid2>
        <Grid2>
          <iframe src={pdfView} width="600" height="400"></iframe>
        </Grid2>
      </Box>
    </AppTheme>
  );
}

export default Home;
