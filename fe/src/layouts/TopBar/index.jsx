import { useEffect, useRef, useState } from "react";
import { AppBar, Typography, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";

import "./styles.scss";
import { deleteCookie, getCookie } from "../../helpers/cookie";
import { checkLogin } from "../../stores/actions/login";

function TopBar() {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const token = getCookie("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [contextInfo, setContextInfo] = useState("");
  const [username, setUsername] = useState("");
  const fileInputRef = useRef(null);

  const userId =
    pathParts.length >= 3 &&
    (pathParts[1] === "users" || pathParts[1] === "photos")
      ? pathParts[2]
      : null;

  useEffect(() => {
    const decodeToken = jwtDecode(token);
    // console.log("Decoded Token:", decodeToken);
    setUsername(`${decodeToken.first_name} ${decodeToken.last_name}`);
  }, [token]);

  const handleFileChange = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    const formData = new FormData();
    formData.append("file_name", image);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/photos/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data.message, response.data.result);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error in file upload:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8080/api/v1/users/${userId}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Lỗi lấy user:", err);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [userId]);

  useEffect(() => {
    if (user) {
      const userName = `${user.first_name} ${user.last_name || ""}`;
      if (pathParts[1] === "photos") {
        setContextInfo(`Photos of ${userName}`);
      } else if (pathParts[1] === "users") {
        setContextInfo(userName);
      }
    } else {
      setContextInfo("");
    }
  }, [user, pathParts]);

  const handleLogout = () => {
    deleteCookie("token");
    dispatch(checkLogin(false));
    navigate("/auth/login");
  };

  return (
    <AppBar position="fixed" className="topbar">
      <Box className="topbar-container">
        {!token ? (
          <Box className="auth-buttons">
            <button className="login-btn">Login</button>
            <button className="register-btn">Register</button>
          </Box>
        ) : (
          <Box className="user-info">
            <Typography variant="body1" className="username-info">
              Xin chào, <strong>{username}</strong>
            </Typography>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <button
              className="upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              upload
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </Box>
        )}
        {contextInfo && (
          <Typography variant="body1" className="context-info">
            {contextInfo}
          </Typography>
        )}
      </Box>
    </AppBar>
  );
}

export default TopBar;
