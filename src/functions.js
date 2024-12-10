import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; 

const useNavigationHelpers = () => {
  const navigate = useNavigate();
  const { clearAuthState } = useAuth(); 

  const goToMyListings = () => {
    navigate("/mylistings");
  };

  const goToNewListing = () => {
    navigate("/newlisting");
  };

  const logout = () => {
    localStorage.removeItem("authState");

    clearAuthState();

    navigate("/login");

    console.log("User logged out and global state cleared");
  };

  return { goToMyListings, goToNewListing, logout };
};

export default useNavigationHelpers;
