import React from "react";
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
import models from "../../modelData/models";

function UserPhotos() {
  const { userId } = useParams();
  const photos = models.photoOfUserModel(userId);
  console.log(photos);
  const user = models.userModel(userId);
  console.log(user);

  // Helper function to format date string
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

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
