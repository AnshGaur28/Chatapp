import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const { handleSubmit, register } = useForm();
  const navigate = useNavigate();
  const handleFormSubmit = async (e) => {
    const { username, password , role } = e;
    try {
        // console.log("Request is made");
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
        role,
      });
      console.log(response);
      sessionStorage.setItem("token", response.data.jwt);
      
      role=='admin'? navigate('/dashboard') : navigate("/");
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return (
    <div className="p-2 m-2 ">
      <div className="flex flex-col flex justify-center items-center">
        <h1 className="text-3xl font-semibold flex ">Login Page</h1>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <span className="flex flex-row my-2 mx-2">
            <label>Username: </label>
            <input
              className=" border-2 border-gray-400 flex flex-row mx-2 "
              placeholder="Enter your username"
              name="username"
              {...register("username")}
            />
          </span>
          <span className="flex flex-row my-2 mx-2">
            <label>Password: </label>
            <input
              className=" border-2 border-gray-400 flex flex-row mx-2 "
              placeholder="Enter your password"
              name="password"
              {...register("password")}
            />
          </span>

          <span className="flex flex-row my-2 mx-2">
            <label>Role:</label>
            <select id="role" name="role" {...register("role")}>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
          </span>

          <button className="p-2 m-2 bg-blue-600 rounded-lg hover:bg-blue-400">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
