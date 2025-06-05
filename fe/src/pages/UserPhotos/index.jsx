import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

import "./styles.css";
import LoadingUi from "../../components/LoadingUi/LoadingUi";
import CommentList from "../CommentList/CommentList";
import { getCookie } from "../../helpers/cookie";

function UserPhotos() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getCookie("token");

  useEffect(() => {
    const fetchUserAndPhotos = async () => {
      try {
        const userRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/users/${userId}`
        );
        setUser(userRes.data);

        const photoRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/photos/${userId}/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPhotos(photoRes.data.result);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPhotos();
  }, [token, userId]);

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
              image={require(`../../../../ba/images/${photo.file_name}`)}
              alt={`Photo by ${user ? user.first_name : ""}`}
            />

            <div className="photo-header">
              <Typography variant="body2" color="textSecondary">
                Posted on {formatDate(photo.date_time)}
              </Typography>

              <IconButton
                // onClick={() => handleDeletePhoto(photo._id)}
                className="delete-photo-button"
                aria-label="delete photo"
              >
                <DeleteIcon />
              </IconButton>
            </div>

            <CardContent>
              <CommentList photoId={photo._id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UserPhotos;
