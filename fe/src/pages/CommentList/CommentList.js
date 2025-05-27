import { Typography, Box, Divider, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import "./CommentList.scss";
import { useEffect, useState } from "react";
import axios from "axios";

function CommentList({ photoId }) {
  const [comments, setComments] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/comments/${photoId}`
        );

        if (res.status === 200) {
          setComments(res.data.result || []);
        }
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
      }
    };

    if (photoId) {
      fetchComments();
    }
  }, [photoId]);

  if (!comments || comments.length === 0) return null;

  return (
    <Box className="comments-section" mt={2}>
      <Typography variant="h6">Comments</Typography>
      <Divider />

      {comments.map((comment, index) => (
        <Box key={index} className="comment" mt={1} mb={1}>
          <Typography variant="body2" color="textSecondary">
            {formatDate(comment.date_time)} -{" "}
            <MuiLink
              component={Link}
              to={`/users/${comment.user._id}`}
              className="user-link"
            >
              {comment.user
                ? `${comment.user.first_name} ${comment.user.last_name || ""}`
                : "Unknown User"}
            </MuiLink>
          </Typography>
          <Typography variant="body1" className="comment-text">
            {comment.comment}
          </Typography>
          {index < comments.length - 1 && <Divider variant="middle" />}
        </Box>
      ))}
    </Box>
  );
}

export default CommentList;
