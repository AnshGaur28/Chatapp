import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  VStack,
} from "@chakra-ui/react";

import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [role, setRole] = useState();

  const handleClick = () => {
    setShow(!show);
  };

  const handleFormSubmit = async (e) => {
    // const { username, password, role } = e;
    try {
      // console.log("Request is made");
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
        role,
      });
      console.log(response);
      sessionStorage.setItem("token", response.data.jwt);
      sessionStorage.setItem("username", username);

      role == "admin" ? navigate("/dashboard") : navigate("/");
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
          
      <VStack>
      <FormControl isRequired>
        <FormLabel>Username</FormLabel>
        <Input
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Select
        placeholder="Select option"
        onChange={(e) => {
          setRole(e.target.value);
        }}
      >
        <option value="admin">Admin</option>
        <option value="client">Client</option>
      </Select>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleFormSubmit}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
