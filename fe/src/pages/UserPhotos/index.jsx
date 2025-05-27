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
import LoadingUi from "../../components/LoadingUi/LoadingUi";
import CommentList from "../CommentList/CommentList";

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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading)
    return (
      <div className="loading">
        <LoadingUi />
      </div>
    );
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
                <CommentList photoId={photo._id} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UserPhotos;
