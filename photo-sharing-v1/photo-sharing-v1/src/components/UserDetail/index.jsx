import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";

import "./styles.css";
import { Link, useParams } from "react-router-dom";
import models from "../../modelData/models";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const user = useParams();
  const infoUser = models.userModel(user.userId);
  return (
    <div className="wrapper">
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {user.first_name} {infoUser.last_name}
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {infoUser.location}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong> {infoUser.description}
          </Typography>
          <Typography variant="body1">
            <strong>Occupation:</strong> {infoUser.occupation}
          </Typography>
          <div className="button-view-photo">
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/photos/${user.userId}`}
            >
              View Photos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserDetail;
