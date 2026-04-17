import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicSiteProvider } from './context/PublicSiteContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Blog from './pages/Blog';
import ArticleDetail from './pages/ArticleDetail';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminBooks from './pages/admin/Books';
import AdminArticles from './pages/admin/Articles';
import AdminMedia from './pages/admin/Media';
import AdminPages from './pages/admin/Pages';
import AdminSettings from './pages/admin/Settings';

function App() {
  return (
    <AuthProvider>
      <PublicSiteProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/sobre" element={<Layout><About /></Layout>} />
            <Route path="/livros" element={<Layout><Books /></Layout>} />
            <Route path="/livros/:slug" element={<Layout><BookDetail /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><ArticleDetail /></Layout>} />
            <Route path="/contato" element={<Layout><Contact /></Layout>} />
            <Route path="/privacidade" element={<Layout><Privacy /></Layout>} />

            <Route path="/admin/login" element={<Login />} />

            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="livros" element={<AdminBooks />} />
                <Route path="artigos" element={<AdminArticles />} />
                <Route path="midia" element={<AdminMedia />} />
                <Route path="paginas" element={<AdminPages />} />
                <Route path="configuracoes" element={<AdminSettings />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </PublicSiteProvider>
    </AuthProvider>
  );
}

export default App;
