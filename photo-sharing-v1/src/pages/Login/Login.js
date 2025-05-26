import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import "./Login.scss";
import { getCookie, setCookie } from "../../helpers/cookie";
import { checkLogin } from "../../stores/actions/login";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/auth/login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setCookie("token", response.data.result);
        dispatch(checkLogin(true));
        navigate("/");
      } else {
        console.error("Đăng nhập thất bại:", response.data);
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
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
        <label>Username: </label>
        <input type="text" {...register("username", { required: true })} />
        {errors.username && <p className="error">Username is required</p>}

        <label>Password: </label>
        <input type="password" {...register("password", { required: true })} />
        {errors.password && <p className="error">Password is required</p>}

        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default Login;
