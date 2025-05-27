import { useEffect, useState } from "react";
import { AppBar, Typography, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

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

  const userId =
    pathParts.length >= 3 &&
    (pathParts[1] === "users" || pathParts[1] === "photos")
      ? pathParts[2]
      : null;

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
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
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
