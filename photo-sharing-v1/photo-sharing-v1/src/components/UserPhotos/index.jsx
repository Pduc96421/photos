import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Link as MuiLink,
  Box,
  Divider,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import "./styles.css";
import axios from "axios";

function UserPhotos() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndPhotos = async () => {
      try {
        const userRes = await axios.get(
          `http://localhost:8080/api/v1/users/${userId}`
        );
        setUser(userRes.data);

        const photoRes = await axios.get(
          `http://localhost:8080/api/v1/photos/user/${userId}`
        );
        setPhotos(photoRes.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPhotos();
  }, [userId]);

  // Helper function to format date string
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <Typography>Đang tải dữ liệu...</Typography>;
  if (error) return <Typography color="error">Lỗi: {error}</Typography>;
  if (!user) return <Typography>Không tìm thấy người dùng.</Typography>;

  return (
    <div className="user-photos">
      <Typography variant="h4" className="photos-header">
        Photos of {user ? `${user.first_name} ${user.last_name || ""}` : ""}
      </Typography>

      <div className="photos-container">
        {photos.map((photo) => (
          <Card key={photo._id} className="photo-card">
            <CardMedia
              component="img"
              className="photo-image"
              image={require(`../../images/${photo.file_name}`)}
              alt={`Photo by ${user ? user.first_name : ""}`}
            />

            <CardContent>
              <Typography variant="body2" color="textSecondary">
                Posted on {formatDate(photo.date_time)}
              </Typography>

              {photo.comments && photo.comments.length > 0 && (
                <Box className="comments-section" mt={2}>
                  <Typography variant="h6">Comments</Typography>
                  <Divider />

                  {photo.comments.map((comment, index) => {
                    return (
                      <Box key={index} className="comment" mt={1} mb={1}>
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(comment.date_time)} -
                          <MuiLink
                            component={Link}
                            to={`/users/${comment.user._id}`}
                            className="user-link"
                          >
                            {comment.user
                              ? `${comment.user.first_name} ${
                                  comment.user.last_name || ""
                                }`
                              : "Unknown User"}
                          </MuiLink>
                        </Typography>
                        <Typography variant="body1" className="comment-text">
                          {comment.comment}
                        </Typography>
                        {index < photo.comments.length - 1 && (
                          <Divider variant="middle" />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UserPhotos;
