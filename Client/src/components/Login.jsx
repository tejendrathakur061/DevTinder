import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/Constants";

const Login = () => {
  const location = useLocation();
  const [emailId, setEmailId] = useState(location.state?.emailId || "");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMessage("");
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        {
          withCredentials: true,
        },
      );
      setEmailId("");
      setPassword("");
      dispatch(addUser(res.data));
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response?.data || error.message);
    }
  };
  return (
    <div className="flex justify-center mt-38">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body p-8">
          <h2 className="card-title justify-center mb-4">Login</h2>
          {location.state?.signupSuccess && (
            <p role="status" className="mb-4 text-center text-sm text-success">
              Account created. Log in to continue.
            </p>
          )}

          <div className="space-y-4">
            <fieldset className="fieldset">
              <span className="fieldset-legend">Email ID</span>
              <input
                type="email"
                value={emailId}
                placeholder="Enter your email"
                onChange={(e) => {
                  setEmailId(e.target.value);
                  setErrorMessage("");
                }}
                className="input input-bordered w-full rounded-xl"
              />
            </fieldset>

            <fieldset className="fieldset">
              <span className="fieldset-legend">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  className="input input-bordered w-full rounded-xl pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent px-2 text-sm hover:bg-transparent active:bg-transparent"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </fieldset>
            {errorMessage && (
              <p role="alert" className="text-error text-sm">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="card-actions justify-center mt-6">
            <button
              onClick={handleLogin}
              className="btn btn-primary w-full rounded-xl"
            >
              Login
            </button>
          </div>
          <p className="mt-5 text-center text-sm">
            New here?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
