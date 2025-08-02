import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { isMobileDevice, isMobileScreen } from '../../utils/mobileUtils';
import Layout from './Layout';
import MobileHome from '../../pages/MobileHome';
import MobileAuthWrapper from './MobileAuthWrapper';

const MobileDesktopRouter: React.FC = () => {
  const isMobile = isMobileDevice() || isMobileScreen();
  const location = useLocation();

  if (isMobile) {
    // For mobile, render MobileHome for the index route, otherwise render outlet
    if (location.pathname === '/') {
      return (
        <MobileAuthWrapper>
          <MobileHome />
        </MobileAuthWrapper>
      );
    }
    return <Outlet />;
  }

  // For desktop, render with Layout
  return <Layout />;
};

export default MobileDesktopRouter; 