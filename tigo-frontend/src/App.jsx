import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import StoriesPage from './pages/StoriesPage';
import StatsPage from './pages/StatsPage';
import TagPage from './pages/TagPage';
import EditorPage from './pages/EditorPage';
import LibraryPage from './pages/LibraryPage';
import RefineRecommendationsPage from './pages/RefineRecommendationsPage';

import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-center" />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library/*" element={<LibraryPage />} />
            <Route path="/stories/*" element={<StoriesPage />} />
            <Route path="/stats/*" element={<StatsPage />} />
            <Route path="/me/following/*" element={<RefineRecommendationsPage />} />
            <Route path="/tag/:slug" element={<TagPage />} />
            <Route path="/post/:slug" element={<PostPage />} />
            <Route path="/profile/:userId/*" element={<ProfilePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/write" element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
