import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Snackbar,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useLocation } from "react-router-dom";
import { createKnowledgeBaseEntry } from "../../api/InterfaceApis/InterfaceApis.ts";
import { SetSessionStorage } from "../interface/utils/InterfaceUtils.ts";

function RagCompoonent() {
  const { search } = useLocation();
  const [isInitialized, setIsInitialized] = React.useState(false);
  const { token } = JSON.parse(
    new URLSearchParams(search).get("ragDetails") || "{}"
  );
  const [open] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null); // State to hold the uploaded file
  const [alert, setAlert] = React.useState<{
    show: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    show: false,
    message: "",
    severity: "success",
  });

  React.useEffect(() => {
    if (token) {
      SetSessionStorage("ragToken", token);
      window?.parent?.postMessage({ type: "ragLoaded" }, "*");
      setIsInitialized(true);
    }
  }, [token]);

  const handleSave = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target);

    // Create payload object
    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
    };

    // Convert payload to FormData
    const payloadFormData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null) {
        payloadFormData.append(key, value);
      }
    });

    // Add file to FormData if present
    if (file) {
      payloadFormData.append("file", file);
    } else {
      const url = formData.get("url");
      if (url) {
        payloadFormData.append("doc_url", url.toString());
      }
    }

    try {
      const response = await createKnowledgeBaseEntry(payloadFormData);
      if (response?.data) {
        setAlert({
          show: true,
          message: "Document uploaded successfully!",
          severity: "success",
        });
        setFile(null); // Reset file state after submission
        window.parent.postMessage({ type: "rag", data: response.data }, "*");
      } else {
        throw new Error("Failed to upload document");
      }
    } catch (error) {
      console.error("Error saving:", error);
      setAlert({
        show: true,
        message:
          error?.response?.data?.message ||
          "Failed to upload document. Please try again.",
        severity: "error",
      });
      return; // Exit early on error
    } finally {
      setIsLoading(false);
      setFile(null);
      event.target.reset();
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const validFileTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/csv",
    ];

    if (selectedFile && validFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      setAlert({
        show: true,
        message: "Please upload a valid file (PDF, Word, or CSV).",
        severity: "error",
      });
      setFile(null);
    }
  };

  const handleClose = () => {
    window.parent.postMessage({ type: "closeRag" }, "*");
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          window.parent.postMessage({ type: "closeRag" }, "*");
        }}
        TransitionComponent={Fade}
        maxWidth="md"
        fullWidth
      >
        {isLoading && <LinearProgress color="success" />}
        <DialogTitle>KnowlegeBase Configuration</DialogTitle>
        {isInitialized ? (
          <form onSubmit={handleSave}>
            <DialogContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Document Name <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                name="name"
                fullWidth
                required
                placeholder="Enter document name"
                helperText="Name of the document to be uploaded"
                variant="outlined"
              />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Document Description <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                name="description"
                fullWidth
                required
                placeholder="Enter document description"
                helperText="Description of the document to be uploaded"
                variant="outlined"
              />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Document URL
              </Typography>
              <TextField
                name="url"
                type="url"
                fullWidth
                placeholder="https://example.com/documentation"
                helperText="URL where the document can be accessed"
                variant="outlined"
              />
              <Divider sx={{ my: 2 }}>OR</Divider>
              <Box
                sx={{
                  mt: 2,
                  border: "2px dashed #ccc",
                  borderRadius: "4px",
                  p: 3,
                  textAlign: "center",
                  cursor: file ? "default" : "pointer",
                  "&:hover": {
                    borderColor: file ? "#ccc" : "primary.main",
                    backgroundColor: file
                      ? "transparent"
                      : "rgba(0, 0, 0, 0.04)",
                  },
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!file) {
                    const droppedFile = e.dataTransfer.files[0];
                    handleFileChange({ target: { files: [droppedFile] } });
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onClick={() => {
                  if (!file) {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".pdf,.doc,.docx,.csv";
                    input.onchange = handleFileChange;
                    input.click();
                  }
                }}
              >
                <Typography
                  variant="body1"
                  color={file ? "success.main" : "text.primary"}
                >
                  {file
                    ? "File selected"
                    : "Drag and drop a file here, or click to select a file"}
                </Typography>
                {file ? (
                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={`Selected file: ${file.name}`}
                      color="primary"
                      onDelete={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    />
                  </Box>
                ) : (
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    className="mt-2"
                  >
                    Upload file
                  </Button>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button variant="contained" onClick={handleClose}>
                Cancel
              </Button>
            </DialogActions>
          </form>
        ) : (
          <Box sx={{ width: "100%" }}>
            <LinearProgress color="success" />
          </Box>
        )}
      </Dialog>

      <Snackbar
        open={alert.show}
        autoHideDuration={6000}
        onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
      >
        <Alert
          onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
          severity={alert.severity}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default RagCompoonent;
