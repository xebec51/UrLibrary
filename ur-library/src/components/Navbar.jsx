import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          UrLibrary
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Beranda</Link>
          </li>
          <li>
            <Link to="/login">Login Admin</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;