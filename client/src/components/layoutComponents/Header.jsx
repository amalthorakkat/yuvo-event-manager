import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">YUVO</h1>
        <div className="space-x-4">
          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? 'underline font-semibold' : 'hover:underline'
            }
          >
            Events
          </NavLink>
          {user && user.role === 'admin' && (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  isActive ? 'underline font-semibold' : 'hover:underline'
                }
              >
                Admin Dashboard
              </NavLink>
              <NavLink
                to="/admin/wages"
                className={({ isActive }) =>
                  isActive ? 'underline font-semibold' : 'hover:underline'
                }
              >
                Wage Config
              </NavLink>
            </>
          )}
          {user && user.role === 'supervisor' && (
            <NavLink
              to="/supervisor"
              className={({ isActive }) =>
                isActive ? 'underline font-semibold' : 'hover:underline'
              }
            >
              Supervisor Dashboard
            </NavLink>
          )}
          {user && (user.role === 'employee' || user.role === 'supervisor') && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? 'underline font-semibold' : 'hover:underline'
              }
            >
              My Dashboard
            </NavLink>
          )}
          {user ? (
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'underline font-semibold' : 'hover:underline'
              }
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;