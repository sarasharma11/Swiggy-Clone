import * as React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        localStorage.removeItem("userid");
        navigate("/login");
      }}
    >
      Logout
    </Button>
  );
}
