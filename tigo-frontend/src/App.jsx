import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function Navigation() {
  const { user, signOut } = useAuth();
  
  return (
    <nav className="flex justify-between items-center p-4 border-b border-border mb-8">
      <Link to="/" className="text-2xl font-bold text-accent">TIGO</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <img src={user.image} alt="avatar" className="w-8 h-8 rounded-full bg-border" />
              <span>{user.name}</span>
            </div>
            <button onClick={signOut} className="text-sm underline text-text-h">Sign Out</button>
          </>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-accent text-white rounded">Sign In</Link>
        )}
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div>
      <h1 className="text-4xl mb-4">Latest Posts</h1>
      <p>Content coming soon...</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <div className="max-w-4xl mx-auto w-full text-left">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/write" element={
              <ProtectedRoute>
                <div>Editor goes here</div>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
