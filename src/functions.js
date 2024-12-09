import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import your AuthContext

const useNavigationHelpers = () => {
  const navigate = useNavigate();
  const { clearAuthState } = useAuth(); // Correctly access the clearAuthState function from useAuth

  const goToMyListings = () => {
    navigate("/mylistings");
  };

  const goToNewListing = () => {
    navigate("/newlisting");
  };

  const logout = () => {
    // Clear local storage (optional, since this is handled in clearAuthState)
    localStorage.removeItem("authState");

    // Clear global auth state and local storage
    clearAuthState();

    // Redirect to login page
    navigate("/login");

    console.log("User logged out and global state cleared");
  };

  return { goToMyListings, goToNewListing, logout };
};

export default useNavigationHelpers;
