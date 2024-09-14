import { useParams } from "react-router-dom";
import useSWR from "swr";
import {
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import DescriptionIcon from "@mui/icons-material/Description";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

interface Pest {
  _id: string;
  name: string;
  description: string;
  text: string;
  imageUrl: string;
  category: "negative" | "positive" | "neutral";
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: pest, error } = useSWR<Pest>(
    `http://localhost:8080/api/v1/pest/${id}`,
    fetcher
  );

  const getCategoryColor = (category: Pest["category"]) => {
    switch (category) {
      case "negative":
        return "error";
      case "positive":
        return "success";
      case "neutral":
        return "default";
    }
  };

  if (error)
    return (
      <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
        <Typography color="error">Failed to load pest details</Typography>
      </Box>
    );
  if (!pest)
    return (
      <Box sx={{ maxWidth: 800, margin: "auto", mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4, p: 2 }}>
      <Paper elevation={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="100%"
              image={pest.imageUrl}
              alt={pest.name}
              sx={{ borderRadius: "4px 0 0 4px" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {pest.name}
              </Typography>
              <Chip
                icon={<BugReportIcon />}
                label={pest.category}
                color={getCategoryColor(pest.category)}
                sx={{ mb: 2 }}
              />
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <DescriptionIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Description</Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {pest.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TextSnippetIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Additional Information</Typography>
              </Box>
              <Typography variant="body2">{pest.text}</Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PestDetailsPage;
