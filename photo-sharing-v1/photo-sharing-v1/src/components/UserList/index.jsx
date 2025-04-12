import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

/**
 * Define UserList, a React component of Project 4.
 * This component displays a list of all users in the system and
 * allows navigation to individual user details when clicked.
 */
function UserList() {
  const users = models.userListModel();
  
  return (
    <div className="user-list">
      <Typography variant="h6" className="user-list-header">
        Users
      </Typography>
      
      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem 
              button 
              component={Link} 
              to={`/users/${user._id}`}
              className="user-list-item"
            >
              <ListItemText 
                primary={`${user.first_name} ${user.last_name || ''}`} 
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;