import { useForm } from "react-hook-form";
import { TextField, Typography } from "@mui/material";
import { getCookie } from "../../helpers/cookie";
import "./UpdateUser.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingUi from "../../components/LoadingUi/LoadingUi";
import { message } from "antd";

function UpdateUser() {
  const token = getCookie("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setValue("username", userData.username);
      setValue("first_name", userData.first_name);
      setValue("last_name", userData.last_name);
      setValue("occupation", userData.occupation);
      setValue("description", userData.description);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/users/update`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.error("Update user success", 3);
      setLoading(true);
      console.log("Cập nhật người dùng thành công:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data.result));
      navigate(`/users/${response.data.result._id}`);
      // window.location.reload();
    } catch (error) {
      console.error("Cập nhập người dùng thất bại:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom className="update-user-title">
        Update User Information
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="update-user-form">
        <TextField
          {...register("username", { required: "Username is required" })}
          label="Username"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        {errors.username && <p className="error">{errors.username.message}</p>}

        <TextField
          {...register("first_name")}
          label="First Name"
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <TextField
          {...register("last_name")}
          label="Last Name"
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <TextField
          {...register("occupation")}
          label="Occupation"
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <TextField
          {...register("description")}
          label="Description"
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
        />

        {loading ? (
          <div className="loading">
            <LoadingUi />
          </div>
        ) : (
          <button type="submit" className="update-user-button">
            Cập nhật
          </button>
        )}
      </form>
    </>
  );
}

export default UpdateUser;
