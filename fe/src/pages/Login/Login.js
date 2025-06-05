import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import "./Login.scss";
import { getCookie, setCookie } from "../../helpers/cookie";
import { checkLogin } from "../../stores/actions/login";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/users/auth/login`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setCookie("token", response.data.result);

      const decodeToken = jwtDecode(response.data.result);
      localStorage.setItem("user", JSON.stringify(decodeToken));

      dispatch(checkLogin(true));
      navigate("/");
    } catch (error) {
      setServerError(error.response?.data?.message);
      console.error("Thất bại:", error.response.data);
    }
  };

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h2>Login</h2>

        <label htmlFor="username">Username: </label>
        <input
          id="username"
          type="text"
          {...register("username", { required: true })}
        />
        {errors.username && <p className="error">Username is required</p>}

        <label htmlFor="password">Password: </label>
        <input
          id="password"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && <p className="error">Password is required</p>}

        {/* <label htmlFor="username">Username: </label>
        <input
          id="username"
          type="text"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 4,
              message: "Username must be at least 4 characters",
            },
          })}
        />
        {errors.username && <p className="error">{errors.username.message}</p>}

        <label htmlFor="password">Password: </label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
              message: "Password must contain at least one letter and one number",
            },
            validate: (value) => {
              if (value === "admin") return "Tên này bị cấm";
              if (value.length < 4) return "Phải ít nhất 4 ký tự";
              return true; // đúng thì trả về true
            },
          })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>} */}

        {serverError && <p className="error">{serverError}</p>}

        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/auth/register">Register</Link>
        </p>
      </form>
    </>
  );
}

export default Login;
