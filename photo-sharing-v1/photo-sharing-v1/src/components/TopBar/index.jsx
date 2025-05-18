import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function TopBar() {
  const location = useLocation();
  const pathParts = location.pathname.split("/");

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

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Phạm Văn Đức
        </Typography>

        {contextInfo && <Typography variant="body1">{contextInfo}</Typography>}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
