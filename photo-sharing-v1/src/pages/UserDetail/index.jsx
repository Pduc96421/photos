import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import "./styles.css";
import LoadingUi from "../../components/LoadingUi/LoadingUi";

function UserDetail() {
  const { userId } = useParams();
  const [infoUser, setInfoUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/users/${userId}`
        );
        setInfoUser(res.data);
      } catch (err) {
        setError(err.message || "Lỗi khi lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading)
    return (
      <div className="loading">
        <LoadingUi />
      </div>
    );
  if (error) return <Typography color="error">Lỗi: {error}</Typography>;
  if (!infoUser) return <Typography>Không tìm thấy người dùng.</Typography>;

  return (
    <div className="wrapper">
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {infoUser.first_name} {infoUser.last_name}
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
              to={`/photos/${userId}`}
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
