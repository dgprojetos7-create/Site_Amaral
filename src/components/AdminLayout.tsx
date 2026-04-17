import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Book,
  ChevronLeft,
  FileCog,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import Button from './Button';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/livros', label: 'Livros', icon: <Book size={20} /> },
    { path: '/admin/artigos', label: 'Artigos', icon: <FileText size={20} /> },
    { path: '/admin/midia', label: 'Mídia', icon: <ImageIcon size={20} /> },
    { path: '/admin/paginas', label: 'Textos do Site', icon: <FileCog size={20} /> },
    { path: '/admin/configuracoes', label: 'Configurações', icon: <Settings size={20} /> },
  ];

  const currentSection = navItems.find((item) => item.path === location.pathname)?.label || 'Painel';
  const isDashboard = location.pathname === '/admin';

  return (
    <div className="admin-wrapper">
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'collapsed'} desktop-only`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="logo-mark">NA</span>
            {isSidebarOpen && (
              <div className="sidebar-brand-copy">
                <span className="logo-text">Nilton Amaral</span>
                <span className="logo-subtext">Painel administrativo</span>
              </div>
            )}
          </div>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <ChevronLeft size={20} style={{ transform: isSidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {isSidebarOpen && (
            <Button to="/admin/livros" variant="secondary" className="sidebar-primary-action">
              <Plus size={18} />
              <span>Novo Livro</span>
            </Button>
          )}

          <button className="logout-btn" onClick={() => void handleLogout()}>
            <LogOut size={20} />
            {isSidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      <header className="admin-topbar mobile-only">
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="logo-text">Admin</span>
        <div className="user-avatar">
          <User size={20} />
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <nav className="mobile-admin-menu" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Menu Administrativo</h3>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            <Button to="/admin/livros" variant="secondary" className="mobile-primary-action">
              <Plus size={18} />
              <span>Novo Livro</span>
            </Button>

            <button className="mobile-logout-btn" onClick={() => void handleLogout()}>
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </nav>
        </div>
      )}

      <main className="admin-main">
        <header className="admin-content-header desktop-only">
          <div className="admin-header-copy">
            <span className="admin-overline">Painel administrativo</span>
            <h2 className="section-title">{currentSection}</h2>
            <p className="admin-section-description">
              {isDashboard
                ? 'Acompanhe métricas, pendências e os conteúdos mais recentes em um só lugar.'
                : 'Gerencie o conteúdo do site com clareza e uma navegação simples para usuários não técnicos.'}
            </p>
          </div>

          <div className="admin-header-actions">
            <Button to="/admin/livros" variant="secondary" className="header-primary-action">
              <Plus size={18} />
              <span>Novo Livro</span>
            </Button>

            <div className="admin-user-info">
              <div>
                <span className="admin-user-label">{user?.name || 'Administrador'}</span>
                <span className="admin-user-role">{user?.email || 'Acesso completo'}</span>
              </div>
              <div className="user-avatar">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        <header className="admin-mobile-header mobile-only">
          <div>
            <span className="admin-overline">Painel administrativo</span>
            <h2 className="section-title">{currentSection}</h2>
          </div>

          <Button to="/admin/livros" variant="secondary" className="header-primary-action">
            <Plus size={18} />
            <span>Novo Livro</span>
          </Button>
        </header>

        <div className="admin-content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
