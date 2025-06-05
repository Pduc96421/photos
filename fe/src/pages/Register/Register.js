import { useForm } from "react-hook-form";
import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch, // lấy ra giá trị watch để so sánh mật khẩu
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/users/auth/register`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        navigate("/auth/login");
      } else {
        console.error("Đăng kí thất bại:", response.data.message);
      }
    } catch (error) {
      console.error("Đăng kí thất bại:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <h2>Register</h2>

        <label htmlFor="username">Username: </label>
        <input
          id="username"
          type="text"
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && <p className="error">{errors.username.message}</p>}

        <label htmlFor="password">Password: </label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <label htmlFor="confirmPassword">Confirm Password: </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}

        <label htmlFor="firstName">First Name: </label>
        <input id="firstName" type="text" {...register("firstName")} />

        <label htmlFor="lastName">Last Name: </label>
        <input id="lastName" type="text" {...register("lastName")} />

        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/auth/login">Login</Link>
        </p>
      </form>
    </>
  );
}

export default Register;
