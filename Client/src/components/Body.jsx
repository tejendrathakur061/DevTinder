import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/Constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile`, {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      const isPublicRoute =
        location.pathname === "/login" || location.pathname === "/signup";
      if (err.response?.status === 401 && !isPublicRoute) {
        navigate("/login");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Body;
