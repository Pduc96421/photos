import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import LoadingUi from "../../components/LoadingUi/LoadingUi";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/users/list`
        );
        setUsers(response.data);
      } catch (err) {
        console.error("Lỗi khi fetch user:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="loading">
        <LoadingUi />
      </div>
    );

  if (error) {
    return <Typography color="error">Lỗi: {error}</Typography>;
  }

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
                primary={`${user.first_name} ${user.last_name || ""}`}
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
