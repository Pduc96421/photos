import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 * Displays the user's name on the left and context-specific information on the right.
 */
function TopBar() {
  const location = useLocation();
  const pathParts = location.pathname.split("/");

  let userId = null;
  let contextInfo = "";

  // Check for user details or photos route
  if (pathParts.length >= 3) {
    if (pathParts[1] === "users" || pathParts[1] === "photos") {
      userId = pathParts[2];

      // If we have a userId, fetch the user information
      if (userId) {
        const user = models.userModel(userId);
        if (user) {
          const userName = `${user.first_name} ${user.last_name || ""}`;

          // Determine what to display based on the current route
          if (pathParts[1] === "photos") {
            contextInfo = `Photos of ${userName}`;
          } else if (pathParts[1] === "users") {
            contextInfo = userName;
          }
        }
      }
    }
  }

  return (
    <AppBar position="fixed">
      <Toolbar>
        {/* Left side - Your name */}
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Phạm Văn Đức
        </Typography>

        {/* Right side - Context information */}
        {contextInfo && <Typography variant="body1">{contextInfo}</Typography>}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
