import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function ClientForm() {
    const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (e) => {
    try {
      const role = "client";
      const { username, mobile, email } = e;
      const response = await axios.post("http://localhost:3000/auth/saveClient", {
        username,
        email,
        role,
        mobile,
      });
      sessionStorage.setItem('token' , response.data.jwt)
      sessionStorage.setItem("username", username);
      navigate('/');
    } catch (error) {
      console.log("Error Occurred", error.message);
    }
  };
  return (
    <div
      className="h-screen flex flex-col  justify-center items-center "
      style={{
        backgroundImage:
          "url('/—Pngtree—flat business login box login_1319176.jpg')", // Adjust the path as needed
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: "100%",
      }}
    >
      <div className="my-3">
        <h1 className="flex justify-center text-4xl w-[500px] font-bold text-white border-[1px] border-white rounded-lg px-10 py-2">
          User Registration
        </h1>
      </div>

      <div className="border-2 flex flex-col justify-center border-gray-400 shadow-lg items-center w-[500px] h-[400px] p-5 bg-white rounded-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-10 w-full h-full justify-center "
        >
          <label>Username</label>
          <input
            {...register("username", { required: "Username is required" })}
            className="my-2 rounded-sm p-2 border-gray-400 border-2 w-full"
            placeholder="Enter username"
          />
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}
          <label>Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Enter a valid email address",
              },
            })}
            className="my-2 rounded-sm p-2 border-gray-400 border-2 w-full"
            placeholder="Enter email"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          <label>Mobile</label>
          <input
            {...register("mobile", {
              required: "Mobile is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid mobile number (10 digits)",
              },
            })}
            className="my-2 rounded-sm p-2  border-gray-400 border-2"
            placeholder="Enter mobile number"
          />
          {errors.mobile && <p className="text-red-500">{errors.mobile.message}</p>}
          <button
            className="w-full bg-purple-600 p-2 rounded-md my-5 text-white"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
