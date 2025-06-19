import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [downloadFiles, setDownloadFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const fetchData = async () => {
    const uploads = await fetch('/api/uploads').then((r) => r.json());
    const downloads = await fetch('/api/downloads').then((r) => r.json());
    setUploadedFiles(uploads);
    setDownloadFiles(downloads);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => formData.append('files', file));
    await fetch('/api/upload', { method: 'POST', body: formData });
    setSelectedFiles(null);
    fetchData();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            File Server
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upload Files
              </Typography>
              <label htmlFor="upload-input">
                <Input id="upload-input" type="file" multiple onChange={handleFileChange} />
                <Button variant="contained" component="span">
                  Choose Files
                </Button>
              </label>
              <Button sx={{ ml: 2 }} variant="contained" onClick={handleUpload} disabled={!selectedFiles}>
                Upload
              </Button>
            </Paper>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6">Uploaded Files</Typography>
              <List>
                {uploadedFiles.map((file) => (
                  <ListItem key={file} disablePadding>
                    <ListItemText>
                      <a href={`/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                        {file}
                      </a>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Download Files</Typography>
              <List>
                {downloadFiles.map((file) => (
                  <ListItem key={file} disablePadding>
                    <ListItemText>
                      <a href={`/api/files/${file}`} download>
                        {file}
                      </a>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default App;
