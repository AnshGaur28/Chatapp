// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { Box, Container, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";

export default function LoginPage() {
  // const { handleSubmit, register } = useForm();
  // const navigate = useNavigate();
  // const handleFormSubmit = async (e) => {
  //   const { username, password, role } = e;
  //   try {
  //     // console.log("Request is made");
  //     const response = await axios.post("http://localhost:3000/auth/login", {
  //       username,
  //       password,
  //       role,
  //     });
  //     console.log(response);
  //     sessionStorage.setItem("token", response.data.jwt);

  //     role == "admin" ? navigate("/dashboard") : navigate("/");
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // };
  return (
    <Box  bg="radial-gradient(circle, rgba(244,236,214,0.9), rgba(255,255,255,1))"  minH="100vh">
      <Container maxW="xl" centerContent>
        <Box
          d="flex"
          justifyContent="center"
          p={3}
          bg="radial-gradient(circle, rgba(238,154,158,0.4), rgba(152,205,238,1))"
          w="100%"
          m="40px 0 45px 0"
          borderRadius="lg"
          borderWidth="1px"
          shadow="md"
        >
          <Text fontSize="4xl" fontWeight="bold"   p="20px" color="GrayText" textAlign="center">
            User Authentication
          </Text>
        </Box>
        <Box
          bg="white"
          w="100%"
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          shadow="md"
        >
          <Tabs variant="soft-rounded" >
            <TabList mb="1em">
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Signup</Tab>
            </TabList>
            <TabPanels>
              <TabPanel >
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>

    // <div className="p-2 m-2 ">
    //   <div className="flex flex-col flex justify-center items-center">
    //     <h1 className="text-3xl font-semibold flex ">Login Page</h1>
    //     <form onSubmit={handleSubmit(handleFormSubmit)}>
    //       <span className="flex flex-row my-2 mx-2">
    //         <label>Username: </label>
    //         <input
    //           className=" border-2 border-gray-400 flex flex-row mx-2 "
    //           placeholder="Enter your username"
    //           name="username"
    //           {...register("username")}
    //         />
    //       </span>
    //       <span className="flex flex-row my-2 mx-2">
    //         <label>Password: </label>
    //         <input
    //           className=" border-2 border-gray-400 flex flex-row mx-2 "
    //           placeholder="Enter your password"
    //           name="password"
    //           {...register("password")}
    //         />
    //       </span>

    //       <span className="flex flex-row my-2 mx-2">
    //         <label>Role:</label>
    //         <select id="role" name="role" {...register("role")}>
    //           <option value="admin">Admin</option>
    //           <option value="client">Client</option>
    //         </select>
    //       </span>

    //       <button className="p-2 m-2 bg-blue-600 rounded-lg hover:bg-blue-400">
    //         Login
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
}
