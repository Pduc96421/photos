import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import axios from "axios";
import { getCookie } from "../../helpers/cookie";

function SendComment({ photoId, onCommentSent }) {
  const [commentText, setCommentText] = useState("");
  const token = getCookie("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/comments/${photoId}`,
        { comment: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCommentText("");
        onCommentSent();
      }
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="comment-form"
      mt={2}
    >
      <TextField
        label="Viết bình luận..."
        variant="outlined"
        fullWidth
        size="small"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <Button type="submit" variant="contained" sx={{ mt: 1 }}>
        Gửi
      </Button>
    </Box>
  );
}

export default SendComment;
