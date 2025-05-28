import { useForm } from "react-hook-form";
import "./Register.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/auth/register",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log( response.data.message);
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

        <label htmlFor="confirmPassword">Confirm Password: </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword", {
            required: true,
            validate: (value) =>
              value ===
              document.querySelector('input[name="password"]').value ||
              "Passwords do not match",
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
          Already have an account? <a href="/auth/login">Login</a>
        </p>
      </form>
    </>
  );
}

export default Register;
