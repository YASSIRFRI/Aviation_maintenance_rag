import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  ClipboardCheck, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Plane
} from 'lucide-react';
import { cn } from '../utils/cn';
import Avatar from './ui/Avatar';
import { currentUser } from '../data/mockData';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/get-assistance', label: 'Get Assistance', icon: <MessageSquareText size={20} /> },
    { path: '/validate-logs', label: 'Validate Logs', icon: <ClipboardCheck size={20} /> },
    { path: '/log-writing', label: 'Log Writing', icon: <FileText size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-slate-800 p-2 rounded-md shadow-md"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out',
          'flex flex-col h-full',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        )}
      >
        <div className="p-5 flex items-center space-x-3 border-b border-slate-700">
          <Plane size={28} className="text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">AeroMaint</h1>
            <p className="text-xs text-slate-400">AI Maintenance Assistant</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm rounded-md transition-colors',
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700 mt-auto">
          <div className="flex items-center">
            <Avatar 
              src={currentUser.avatar} 
              name={currentUser.name} 
              size="sm" 
            />
            <div className="ml-3">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-slate-400">{currentUser.role}</p>
            </div>
          </div>
          <button className="flex items-center w-full mt-4 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors">
            <LogOut size={18} className="mr-2" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;