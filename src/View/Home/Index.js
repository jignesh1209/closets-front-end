import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  InputLabel,
} from "@mui/material";
import AppNavBar from "../../components/Navbar";
import AppTheme from "../../theme/AppTheme";
import { GeneratePDFService } from "../../services/GeneratePDFService";
import jsPDF from "jspdf";

// Overlay style for locked sections
const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(255,255,255,0.9)",
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Home = (props) => {
  // Track touched state for instant validation
  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Section 1: Client Details
  const [jobID, setJobID] = useState("");
  const [clientName, setClientName] = useState("");
  const [designerName, setDesignerName] = useState("");
  const [installLocation, setInstallLocation] = useState("");

  // Section 2: Collection Fields
  const [collectionList, setCollectionList] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Section 3: Door Fields
  const [doorSelection, setDoorSelection] = useState("no");
  const [doorQuantity, setDoorQuantity] = useState("");
  const [doorDecoStyle, setDoorDecoStyle] = useState("");
  const [doorSelectedSeries, setDoorSelectedSeries] = useState("");
  const [doorSelectedVariant, setDoorSelectedVariant] = useState("");

  // Section 4: Drawer Fields
  const [drawerSelection, setDrawerSelection] = useState("no");
  const [drawerQuantity, setDrawerQuantity] = useState("");
  const [drawerDecoStyle, setDrawerDecoStyle] = useState("");
  const [drawerSelectedSeries, setDrawerSelectedSeries] = useState("");
  const [drawerSelectedVariant, setDrawerSelectedVariant] = useState("");

  // PDF state and controls
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [showPdf, setShowPdf] = useState(false);

  // Options as provided
  const colorOptions = {
    Everyday: ["White", "Antique White", "Grey"],
    Classic: ["White", "Antique White"],
    Brio: ["Winter Fun", "Sunset Cruise"],
  };

  const seriesOptions = {
    Deco: ["Deco 00", "Deco 01", "Deco 70"],
    Avanti: ["Avanti Shaker 90"],
  };

  const variantOptions = {
    "Deco 00": ["Variant 100"],
    "Deco 01": ["Variant 101", "Variant 201"],
    "Deco 70": ["Variant 170", "Variant 270"],
  };

  // Dynamic grid for Client Details section (2x2 layout)
  const clientDetailsColumns = 2;
  const gridWidth = 12 / clientDetailsColumns;
  const clientDetails = [
    {
      label: "Job ID",
      value: jobID,
      setValue: setJobID,
      // Only numbers allowed; we filter out non-digit onChange
      error: touched.jobID && !/^\d{6}$/.test(jobID),
      helperText: touched.jobID && !/^\d{6}$/.test(jobID) ? "Enter a 6-digit Job ID" : "",
      inputProps: { pattern: "\\d{6}" },
      type: "text",
      onChange: (e) => setJobID(e.target.value.replace(/\D/g, "")),
    },
    {
      label: "Client Name",
      value: clientName,
      setValue: setClientName,
      error: touched.clientName && !/^[A-Za-z ]+$/.test(clientName),
      helperText: touched.clientName && !/^[A-Za-z ]+$/.test(clientName) ? "Only letters allowed" : "",
      inputProps: { inputMode: "text", pattern: "[A-Za-z ]+" },
      type: "text",
    },
    {
      label: "Designer Name",
      value: designerName,
      setValue: setDesignerName,
      error: touched.designerName && !/^[A-Za-z ]+$/.test(designerName),
      helperText: touched.designerName && !/^[A-Za-z ]+$/.test(designerName) ? "Only letters allowed" : "",
      inputProps: { inputMode: "text", pattern: "[A-Za-z ]+" },
      type: "text",
    },
    {
      label: "Install Location",
      value: installLocation,
      setValue: setInstallLocation,
      error: touched.installLocation && !/^[A-Za-z]+$/.test(installLocation),
      helperText: touched.installLocation && !/^[A-Za-z]+$/.test(installLocation) ? "Invalid characters" : "",
      inputProps: { inputMode: "text", pattern: "[A-Za-z]+" },
      type: "text",
    },
  ];

  // Section Validations
  const isSection1Complete =
    /^\d{6}$/.test(jobID) &&
    clientName.trim() &&
    designerName.trim() &&
    installLocation.trim() &&
    /^[A-Za-z ]+$/.test(clientName) &&
    /^[A-Za-z ]+$/.test(designerName) &&
    /^[A-Za-z0-9 ,.-]+$/.test(installLocation);
  const isSection2Complete = collectionList && selectedColor;
  const isSection3Complete =
    doorSelection === "no" ||
    (doorSelection === "yes" &&
      doorQuantity.trim() &&
      doorDecoStyle &&
      (doorDecoStyle === "Slab" || (doorSelectedSeries && doorSelectedVariant)));
  const isSection4Complete =
    drawerSelection === "no" ||
    (drawerSelection === "yes" &&
      drawerQuantity.trim() &&
      drawerDecoStyle &&
      (drawerDecoStyle === "Slab" || (drawerSelectedSeries && drawerSelectedVariant)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields as touched
    setTouched({
      jobID: true,
      clientName: true,
      designerName: true,
      installLocation: true,
      collectionList: true,
      selectedColor: true,
      doorQuantity: true,
      doorDecoStyle: true,
      doorSelectedSeries: true,
      doorSelectedVariant: true,
      drawerQuantity: true,
      drawerDecoStyle: true,
      drawerSelectedSeries: true,
      drawerSelectedVariant: true,
    });

    if (!isSection1Complete) {
      alert("Please complete all Client Details correctly.");
      return;
    }
    if (!isSection2Complete) {
      alert("Please complete all Collection Fields.");
      return;
    }
    if (!isSection3Complete) {
      alert("Please complete Door Fields or select 'No' for Door.");
      return;
    }
    if (!isSection4Complete) {
      alert("Please complete Drawer Fields or select 'No' for Drawer.");
      return;
    }

    // Call service as before
    const filters = {
      jobId: jobID,
      clientName: clientName,
      userId: localStorage.getItem("userID"),
    };

    await GeneratePDFService.FilterToPDF(filters);

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Contract Agreement", 105, 20, { align: "center" });

    // Optional: add a logo if needed
    // const logoBase64 = '';
    // doc.addImage(logoBase64, "PNG", 4, 4, 40, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let yPos = 40;

    // Date info
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear().toString().slice(-2);
    const formattedDate = `${day}-${month}-${year}`;
    doc.text(`Date: ${formattedDate}`, 10, yPos);
    yPos += 15;

    // Client Details Section
    clientDetails.forEach((field) => {
      doc.text(`${field.label}: ${field.value}`, 10, yPos);
      yPos += 10;
    });

    // Collection Section
    doc.text(`Collection: ${collectionList} - ${selectedColor}`, 10, yPos);
    yPos += 10;

    // Door Section
    if (doorSelection === "yes") {
      doc.text(`Door Quantity: ${doorQuantity}`, 10, yPos);
      yPos += 10;
      doc.text(
        `Door Deco: ${doorDecoStyle}${doorDecoStyle !== "Slab" ? ` / ${doorSelectedSeries} / ${doorSelectedVariant}` : ""}`,
        10,
        yPos
      );
      yPos += 10;
    }

    // Drawer Section
    if (drawerSelection === "yes") {
      doc.text(`Drawer Quantity: ${drawerQuantity}`, 10, yPos);
      yPos += 10;
      doc.text(
        `Drawer Deco: ${drawerDecoStyle}${drawerDecoStyle !== "Slab" ? ` / ${drawerSelectedSeries} / ${drawerSelectedVariant}` : ""}`,
        10,
        yPos
      );
      yPos += 10;
    }

    // Terms and Conditions Section
    doc.setFont("helvetica", "bold");
    doc.text("Terms and Conditions", 10, yPos);
    yPos += 10;
    doc.setFont("helvetica", "normal");
    const terms =
      "1. The client agrees to the terms as outlined in this document.\n" +
      "2. Payment terms are net 30 days from the date of invoice.\n" +
      "3. Both parties agree to resolve any disputes amicably.\n" +
      "4. This contract is governed by the laws of [Your Jurisdiction].\n";
    const splitTerms = doc.splitTextToSize(terms, 180);
    doc.text(splitTerms, 10, yPos);
    yPos += splitTerms.length * 7;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text("Authorized Signature:", 10, yPos + 20);
    doc.line(60, yPos + 18, 150, yPos + 18);
    doc.text("Client Signature:", 10, yPos + 40);
    doc.line(60, yPos + 38, 150, yPos + 38);

    // Generate Blob URL for mobile-friendly PDF display
    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    setPdfBlobUrl(blobUrl);
  };

  return (
    <AppTheme {...props}>
      <AppNavBar />
      <Box sx={{ p: 2, backgroundColor: "#ffffff" }} component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Section 1: Client Details */}
          <Grid item xs={12} sm={8} md={6}>
            <Card variant="outlined" sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Client Details
                </Typography>
                <Grid container spacing={1}>
                  {clientDetails.map((field, index) => (
                    <Grid item xs={gridWidth} key={index}>
                      <FormControl fullWidth required size="small" error={field.error}>
                        <FormLabel>{field.label}</FormLabel>
                        <TextField
                          id="outlined-basic"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange ? field.onChange(e) : field.setValue(e.target.value)
                          }
                          onBlur={() => handleBlur(field.label.replace(" ", "").toLowerCase())}
                          variant="outlined"
                          type={field.type || "text"}
                          inputProps={field.inputProps || {}}
                          helperText={field.helperText}
                        />
                      </FormControl>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Section 2: Collection Fields */}
          <Grid item xs={12} sm={8} md={6}>
            <Card variant="outlined" sx={{ mb: 2, boxShadow: 2, borderRadius: 2, position: "relative" }}>
              {!isSection1Complete && (
                <Box sx={overlayStyle}>
                  <Typography variant="body2" color="textSecondary">
                    Complete Client Details to continue.
                  </Typography>
                </Box>
              )}
              <CardContent sx={{ opacity: isSection1Complete ? 1 : 0.5 }}>
                <Typography variant="h6" gutterBottom>
                  Collection
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <FormControl fullWidth required size="small" error={touched.collectionList && !collectionList}>
                      <InputLabel id="collection-list-label">Collection List</InputLabel>
                      <Select
                        labelId="collection-list-label"
                        value={collectionList}
                        onChange={(e) => {
                          setCollectionList(e.target.value);
                          handleBlur("collectionList");
                        }}
                        variant="outlined"
                        label="Collection List"
                      >
                        <MenuItem value="Everyday">Everyday</MenuItem>
                        <MenuItem value="Classic">Classic</MenuItem>
                        <MenuItem value="Brio">Brio</MenuItem>
                      </Select>
                      {touched.collectionList && !collectionList && <FormHelperText>Required</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required size="small" error={touched.selectedColor && !selectedColor}>
                      <InputLabel id="collection-color-label">Collection Color</InputLabel>
                      <Select
                        labelId="collection-color-label"
                        value={selectedColor}
                        onChange={(e) => {
                          setSelectedColor(e.target.value);
                          handleBlur("selectedColor");
                        }}
                        disabled={!collectionList}
                        variant="outlined"
                        label="Collection Color"
                      >
                        {collectionList &&
                          colorOptions[collectionList] &&
                          colorOptions[collectionList].map((color) => (
                            <MenuItem key={color} value={color}>
                              {color}
                            </MenuItem>
                          ))}
                      </Select>
                      {touched.selectedColor && !selectedColor && <FormHelperText>Required</FormHelperText>}
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Section 3: Door & Drawer Fields */}
          <Grid item xs={12} sm={8} md={6} sx={{ position: "relative" }}>
            <Card variant="outlined" sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
              {(!isSection1Complete || !isSection2Complete) && (
                <Box sx={overlayStyle}>
                  <Typography variant="body2" color="textSecondary">
                    Complete Client & Collection Fields to continue.
                  </Typography>
                </Box>
              )}
              <CardContent sx={{ opacity: isSection1Complete && isSection2Complete ? 1 : 0.5 }}>
                <Typography variant="h6" gutterBottom>
                  Door & Drawer
                </Typography>
                <Grid container spacing={1}>
                  {/* Door Fields */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset" size="small">
                      <FormLabel component="legend">Door Selection</FormLabel>
                      <RadioGroup
                        row
                        value={doorSelection}
                        onChange={(e) => setDoorSelection(e.target.value)}
                      >
                        <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  {doorSelection === "yes" && (
                    <>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth required size="small" error={touched.doorQuantity && !doorQuantity}>
                          <TextField
                            id="outlined-basic"
                            label="Door Quantity"
                            value={doorQuantity}
                            onChange={(e) => setDoorQuantity(e.target.value)}
                            onBlur={() => handleBlur("doorQuantity")}
                            variant="outlined"
                            type="number"
                          />
                          {touched.doorQuantity && !doorQuantity && <FormHelperText>Required</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth required size="small" error={touched.doorDecoStyle && !doorDecoStyle}>
                          <InputLabel id="door-deco-style-label">Door Deco Style</InputLabel>
                          <Select
                            labelId="door-deco-style-label"
                            value={doorDecoStyle}
                            onChange={(e) => {
                              setDoorDecoStyle(e.target.value);
                              handleBlur("doorDecoStyle");
                              if (e.target.value === "Slab") {
                                setDoorSelectedSeries("");
                                setDoorSelectedVariant("");
                              }
                            }}
                            variant="outlined"
                            label="Door Deco Style"
                          >
                            <MenuItem value="Deco">Deco</MenuItem>
                            <MenuItem value="Avanti">Avanti</MenuItem>
                            <MenuItem value="Slab">Slab</MenuItem>
                          </Select>
                          {touched.doorDecoStyle && !doorDecoStyle && <FormHelperText>Required</FormHelperText>}
                        </FormControl>
                      </Grid>
                      {doorDecoStyle !== "Slab" && (
                        <>
                          <Grid item xs={12} sm={4}>
                            <FormControl fullWidth required size="small" error={touched.doorSelectedSeries && !doorSelectedSeries}>
                              <InputLabel id="door-deco-series-label">Door Deco Series</InputLabel>
                              <Select
                                labelId="door-deco-series-label"
                                value={doorSelectedSeries}
                                onChange={(e) => {
                                  setDoorSelectedSeries(e.target.value);
                                  handleBlur("doorSelectedSeries");
                                }}
                                disabled={!doorDecoStyle || doorDecoStyle === "Slab"}
                                variant="outlined"
                                label="Door Deco Series"
                              >
                                {(doorDecoStyle === "Deco"
                                  ? seriesOptions.Deco
                                  : doorDecoStyle === "Avanti"
                                  ? seriesOptions.Avanti
                                  : []
                                ).map((series) => (
                                  <MenuItem key={series} value={series}>
                                    {series}
                                  </MenuItem>
                                ))}
                              </Select>
                              {touched.doorSelectedSeries && !doorSelectedSeries && <FormHelperText>Required</FormHelperText>}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <FormControl fullWidth required size="small" error={touched.doorSelectedVariant && !doorSelectedVariant}>
                              <InputLabel id="door-deco-variant-label">Door Deco Variant</InputLabel>
                              <Select
                                labelId="door-deco-variant-label"
                                value={doorSelectedVariant}
                                onChange={(e) => {
                                  setDoorSelectedVariant(e.target.value);
                                  handleBlur("doorSelectedVariant");
                                }}
                                disabled={!doorSelectedSeries || !variantOptions[doorSelectedSeries]}
                                variant="outlined"
                                label="Door Deco Variant"
                              >
                                {doorSelectedSeries &&
                                  variantOptions[doorSelectedSeries] &&
                                  variantOptions[doorSelectedSeries].map((variant) => (
                                    <MenuItem key={variant} value={variant}>
                                      {variant}
                                    </MenuItem>
                                  ))}
                              </Select>
                              {touched.doorSelectedVariant && !doorSelectedVariant && <FormHelperText>Required</FormHelperText>}
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    </>
                  )}

                  {/* Drawer Fields */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset" size="small">
                      <FormLabel component="legend">Drawer Selection</FormLabel>
                      <RadioGroup
                        row
                        value={drawerSelection}
                        onChange={(e) => setDrawerSelection(e.target.value)}
                      >
                        <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  {drawerSelection === "yes" && (
                    <>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth required size="small" error={touched.drawerQuantity && !drawerQuantity}>
                          <TextField
                            id="outlined-basic"
                            label="Drawer Quantity"
                            value={drawerQuantity}
                            onChange={(e) => setDrawerQuantity(e.target.value)}
                            onBlur={() => handleBlur("drawerQuantity")}
                            variant="outlined"
                            type="number"
                          />
                          {touched.drawerQuantity && !drawerQuantity && <FormHelperText>Required</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth required size="small" error={touched.drawerDecoStyle && !drawerDecoStyle}>
                          <InputLabel id="drawer-deco-style-label">Drawer Deco Style</InputLabel>
                          <Select
                            labelId="drawer-deco-style-label"
                            value={drawerDecoStyle}
                            onChange={(e) => {
                              setDrawerDecoStyle(e.target.value);
                              handleBlur("drawerDecoStyle");
                              if (e.target.value === "Slab") {
                                setDrawerSelectedSeries("");
                                setDrawerSelectedVariant("");
                              }
                            }}
                            variant="outlined"
                            label="Drawer Deco Style"
                          >
                            <MenuItem value="Deco">Deco</MenuItem>
                            <MenuItem value="Avanti">Avanti</MenuItem>
                            <MenuItem value="Slab">Slab</MenuItem>
                          </Select>
                          {touched.drawerDecoStyle && !drawerDecoStyle && <FormHelperText>Required</FormHelperText>}
                        </FormControl>
                      </Grid>
                      {drawerDecoStyle !== "Slab" && (
                        <>
                          <Grid item xs={12} sm={4}>
                            <FormControl fullWidth required size="small" error={touched.drawerSelectedSeries && !drawerSelectedSeries}>
                              <InputLabel id="drawer-deco-series-label">Drawer Deco Series</InputLabel>
                              <Select
                                labelId="drawer-deco-series-label"
                                value={drawerSelectedSeries}
                                onChange={(e) => {
                                  setDrawerSelectedSeries(e.target.value);
                                  handleBlur("drawerSelectedSeries");
                                }}
                                disabled={!drawerDecoStyle || drawerDecoStyle === "Slab"}
                                variant="outlined"
                                label="Drawer Deco Series"
                              >
                                {(drawerDecoStyle === "Deco"
                                  ? seriesOptions.Deco
                                  : drawerDecoStyle === "Avanti"
                                  ? seriesOptions.Avanti
                                  : []
                                ).map((series) => (
                                  <MenuItem key={series} value={series}>
                                    {series}
                                  </MenuItem>
                                ))}
                              </Select>
                              {touched.drawerSelectedSeries && !drawerSelectedSeries && <FormHelperText>Required</FormHelperText>}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <FormControl fullWidth required size="small" error={touched.drawerSelectedVariant && !drawerSelectedVariant}>
                              <InputLabel id="drawer-deco-variant-label">Drawer Deco Variant</InputLabel>
                              <Select
                                labelId="drawer-deco-variant-label"
                                value={drawerSelectedVariant}
                                onChange={(e) => {
                                  setDrawerSelectedVariant(e.target.value);
                                  handleBlur("drawerSelectedVariant");
                                }}
                                disabled={!drawerSelectedSeries || !variantOptions[drawerSelectedSeries]}
                                variant="outlined"
                                label="Drawer Deco Variant"
                              >
                                {drawerSelectedSeries &&
                                  variantOptions[drawerSelectedSeries] &&
                                  variantOptions[drawerSelectedSeries].map((variant) => (
                                    <MenuItem key={variant} value={variant}>
                                      {variant}
                                    </MenuItem>
                                  ))}
                              </Select>
                              {touched.drawerSelectedVariant && !drawerSelectedVariant && <FormHelperText>Required</FormHelperText>}
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ pt: 2, textAlign: "center" }}>
          <Button variant="contained" color="info" type="submit" size="small">
            Generate PDF
          </Button>
          {pdfBlobUrl && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => window.open(pdfBlobUrl, "_blank")}
              size="small"
              sx={{ ml: 2 }}
            >
              Open PDF
            </Button>
          )}
          {pdfBlobUrl && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setPdfBlobUrl(null)}
              size="small"
              sx={{ ml: 2 }}
            >
              Hide PDF
            </Button>
          )}
        </Box>
        {pdfBlobUrl && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <iframe
              src={pdfBlobUrl}
              style={{ border: "none", width: "100%", maxWidth: "600px", height: "400px" }}
              title="PDF Preview"
            />
          </Box>
        )}
      </Box>
    </AppTheme>
  );
};

export default Home;
