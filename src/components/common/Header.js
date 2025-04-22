import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Trung tâm Ngoại ngữ
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/teachers">
                Giáo viên
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/assignments">
                Lịch dạy
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/attendance">
                Chấm công
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
