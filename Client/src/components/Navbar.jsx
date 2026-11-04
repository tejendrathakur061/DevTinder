import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/Constants";
import { removeUser } from "../utils/userSlice";
import { removeConnections } from "../utils/connectionSlice";
import { clearRequests } from "../utils/requestSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `btn btn-ghost btn-sm ${isActive ? "text-primary" : ""}`;

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeConnections());
      dispatch(clearRequests());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 shadow-sm backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost gap-2 px-2 text-xl font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm text-primary-content">
              D
            </span>
            DevTinder
          </Link>
        </div>

        {user && (
          <>
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-1 md:flex"
            >
              <NavLink to="/" end className={navLinkClass}>
                Discover
              </NavLink>
              <NavLink to="/connections" className={navLinkClass}>
                Connections
              </NavLink>
              <NavLink to="/requests" className={navLinkClass}>
                Requests
              </NavLink>
            </nav>

            <div className="dropdown dropdown-end ml-2">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost gap-2 rounded-full px-2"
                aria-label="Open account menu"
              >
                <div className="avatar">
                  <div className="w-9 rounded-full bg-primary/10">
                    {user.imgURL ? (
                      <img alt="" src={user.imgURL} />
                    ) : (
                      <span className="grid h-full place-items-center font-semibold text-primary">
                        {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </div>
                <span className="hidden max-w-32 truncate sm:inline">
                  {user.firstName}
                </span>
                <span aria-hidden="true" className="text-xs opacity-60">
                  ▼
                </span>
              </button>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-10 mt-3 w-52 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
              >
                <li className="md:hidden">
                  <NavLink to="/" end>
                    Discover
                  </NavLink>
                </li>
                <li className="md:hidden">
                  <NavLink to="/connections">Connections</NavLink>
                </li>
                <li className="md:hidden">
                  <NavLink to="/requests">Requests</NavLink>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button type="button" onClick={handleLogout}>
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
