
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MobileDesktopRouter from './components/layout/MobileDesktopRouter';
import Home from './pages/Home';
import MobileSearch from './pages/MobileSearch';
import MobileLibrary from './pages/MobileLibrary';
import MobileProfile from './pages/MobileProfile';
import MobileTVShows from './pages/MobileTVShows';
import MobileMovies from './pages/MobileMovies';
import MobileAccount from './pages/MobileAccount';
import MobileSettings from './pages/MobileSettings';
import MobileViewingActivity from './pages/MobileViewingActivity';
import MobilePrivacySecurity from './pages/MobilePrivacySecurity';
import MobileHelpSupport from './pages/MobileHelpSupport';
import MobileAbout from './pages/MobileAbout';
import MobileAuthWrapper from './components/layout/MobileAuthWrapper';
import Watch from './pages/Watch';
import MobileWatch from './pages/MobileWatch';
import Library from './pages/Library';
import About from './pages/About';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import TrailerModal from './components/modal/TrailerModal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Main routes with mobile/desktop routing logic */}
        <Route path="/" element={<MobileDesktopRouter />}>
          <Route index element={<Home />} />
          <Route path="watch/:mediaType/:tmdbId" element={<Watch />} />
          <Route path="library" element={<Library />} />
          <Route path="about" element={<About />} />
        </Route>
        
        {/* Mobile-specific routes (outside the main router) */}
        <Route path="/search" element={
          <MobileAuthWrapper>
            <MobileSearch />
          </MobileAuthWrapper>
        } />
        <Route path="/mobile/library" element={
          <MobileAuthWrapper>
            <MobileLibrary />
          </MobileAuthWrapper>
        } />
        <Route path="/mobile/profile" element={
          <MobileAuthWrapper>
            <MobileProfile />
          </MobileAuthWrapper>
        } />
        <Route path="/mobile/tv-shows" element={
          <MobileAuthWrapper>
            <MobileTVShows />
          </MobileAuthWrapper>
        } />
        <Route path="/mobile/movies" element={
          <MobileAuthWrapper>
            <MobileMovies />
          </MobileAuthWrapper>
        } />
        <Route path="/mobile/account" element={
          <MobileAuthWrapper>
            <MobileAccount />
          </MobileAuthWrapper>
        } />
        <Route path="/mobile/settings" element={
          <MobileAuthWrapper>
            <MobileSettings />
          </MobileAuthWrapper>
        } />
        <Route path="/mobile/viewing-activity" element={
          <MobileAuthWrapper>
            <MobileViewingActivity />
          </MobileAuthWrapper>
        } />
        <Route path="/mobile/privacy-security" element={
          <MobileAuthWrapper>
            <MobilePrivacySecurity />
          </MobileAuthWrapper>
        } />
        <Route path="/mobile/help-support" element={
          <MobileAuthWrapper>
            <MobileHelpSupport />
          </MobileAuthWrapper>
        } />
        <Route path="/mobile/about" element={
          <MobileAuthWrapper>
            <MobileAbout />
          </MobileAuthWrapper>
        } />
        <Route path="/mobile/watch/:mediaType/:tmdbId" element={
          <MobileAuthWrapper>
            <MobileWatch />
          </MobileAuthWrapper>
        } />
      </Routes>
      <TrailerModal />
    </Router>
  );
}

export default App;
