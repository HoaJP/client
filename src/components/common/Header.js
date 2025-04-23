// client/src/components/common/Header.js (cập nhật)
import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span class="badge fs-4 text-bg-warning">Mạnh Hòa Language</span>
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
              <Link className="fs-3 mx-4 nav-link" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="fs-3 mx-4 nav-link" to="/teachers">
                Giáo viên
              </Link>
            </li>
            <li className="nav-item">
              <Link className="fs-3 mx-4 nav-link" to="/assignments">
                Lịch dạy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
