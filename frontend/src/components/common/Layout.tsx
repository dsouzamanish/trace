import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/blockers', label: 'My Blockers', icon: '🚧' },
  { path: '/ai-reports', label: 'AI Insights', icon: '🤖' },
];

const managerNavItems = [{ path: '/team', label: 'My Team', icon: '👥' }];

export default function Layout() {
  const { user, isManager, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allNavItems = isManager ? [...navItems, ...managerNavItems] : navItems;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-bg-secondary)] border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-accent-500">⚡</span>
            Momentum
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Blockers Tracker & Insights
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {allNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] truncate">
                {user?.designation || 'Team Member'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full btn-secondary text-sm flex items-center justify-center gap-2"
          >
            <span>🚪</span>
            Sign Out
          </button>
        </div>

        {/* Footer - Powered by Contentstack */}
        <div className="p-4 border-t border-white/5">
          <a 
            href="https://www.contentstack.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-[var(--color-text-secondary)] hover:text-white transition-colors group"
          >
            <span className="text-xs opacity-60">Powered by</span>
            <img 
              src="https://images.contentstack.io/v3/assets/blt284d669c0cc29fe6/blta1cc38ef8330b5aa/695bf328c510a00de51ac88f/contentstack.jpeg"
              alt="Contentstack"
              className="h-5 w-auto opacity-70 group-hover:opacity-100 transition-opacity"
            />
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

