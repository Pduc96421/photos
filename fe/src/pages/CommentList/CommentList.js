import {
  Typography,
  Box,
  Divider,
  Link as MuiLink,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

import "./CommentList.scss";
import { getCookie } from "../../helpers/cookie";
import SendComment from "../SendComment/SendComment";

function CommentList({ photoId }) {
  const [comments, setComments] = useState([]);
  const token = getCookie("token");
  const [myProfile, setMyProfile] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setMyProfile(user);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const fetchComments = async () => {
    try {
      const resComments = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/comments/${photoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(resComments.data.result || []);
      console.log(resComments.data.result);
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error.response.data);
    }
  };

  useEffect(() => {
    if (photoId) {
      fetchComments();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoId, token]);

  return (
    <Box className="comments-section" mt={2}>
      <Typography variant="h6">Comments</Typography>
      <SendComment photoId={photoId} onCommentSent={fetchComments} />

      <Divider sx={{ my: 2 }} />

      {comments.map((comment, index) => (
        <Box key={comment._id} className="comment" mt={1} mb={1}>
          <Typography variant="body2" color="textSecondary" component="div">
            {formatDate(comment.date_time)} -{" "}
            <MuiLink
              component={Link}
              to={`/users/${comment.user_id?._id}`}
              className="user-link"
            >
              {comment.user_id
                ? `${comment.user_id.first_name} ${
                    comment.user_id.last_name || ""
                  }`
                : "Unknown User"}
            </MuiLink>
          </Typography>

          <Typography variant="body1" className="comment-text">
            {comment.comment}
          </Typography>

          {myProfile.id === comment.user_id._id && (
            <IconButton className="delete-button" aria-label="delete photo">
              {/* <DeleteIcon /> */}
            </IconButton>
          )}

          {index < comments.length - 1 && <Divider variant="middle" />}
        </Box>
      ))}
    </Box>
  );
}

export default CommentList;
