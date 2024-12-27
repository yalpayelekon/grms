import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import homeInactive from '../../icons/navbar/homeInactive.png';
import '../../css/Badge.css';  // Yeni CSS dosyasını ekliyoruz
import homeActive from '../../icons/navbar/homeActive.png';
import dashboardInactive from '../../icons/navbar/dashboardInactive.png';
import dashboardActive from '../../icons/navbar/dashboardActive.png';
import roomStatusInactive from '../../icons/navbar/roomStatusInactive.png';
import roomStatusActive from '../../icons/navbar/roomStatusActive.png';
import roomServicesInactive from '../../icons/navbar/roomServicesInactive.png';
import roomServicesActive from '../../icons/navbar/roomServicesActive.png';
import reportsInactive from '../../icons/navbar/reportsInactive.png';
import reportsActive from '../../icons/navbar/reportsActive.png';
import alarmsInactive from '../../icons/navbar/alarmsInactive.png';
import alarmsActive from '../../icons/navbar/alarmsActive.png';
import exit from '../../icons/navbar/exit.png';

import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const Navbar = ({ activeLink, setActiveLink, roomServiceAlarmNumber, totalAlarmsNumber, adminNavbar, handleLogout, userData }) => {

  // admin
  const adminNavbarFontFamily = UISettingsData.adminNavbarFontFamily; // 'Ariel' - Poppins - Ariel
  const adminNavbarBackgroundColor = UISettingsData.adminNavbarBackgroundColor; // "#64646480"
  const adminNavbarFontSize = UISettingsData.adminNavbarFontSize; // 22 (px olmadan integer) 
  const adminNavbarIconFontSize = UISettingsData.adminNavbarIconFontSize; // 32 (px olmadan integer)
  const adminNavBarFontColor = UISettingsData.adminNavBarFontColor; // '#00FFF0'
  const adminNavBarIconFontMargin = UISettingsData.adminNavBarIconFontMargin; // 10 (px olmadan integer)
  const adminNavBarClickUnderlineColor = UISettingsData.adminNavBarClickUnderlineColor; // '#FF00FF'
  const adminNavbarAlarmsWarningButtonTopPosition = UISettingsData.adminNavbarAlarmsWarningButtonTopPosition; // 18 (px olmadan integer)
  const adminNavbarAlarmsWarningButtonLeftPosition = UISettingsData.adminNavbarAlarmsWarningButtonLeftPosition; // 10 (px olmadan integer)
  const adminNavbarAlarmsWarningButtonBackgroundColor = UISettingsData.adminNavbarAlarmsWarningButtonBackgroundColor; // "#FFFFFF"
  const adminNavbarAlarmsWarningButtonColor = UISettingsData.adminNavbarAlarmsWarningButtonColor; // "#00FFF0"
  const adminNavbarAlarmsWarningButtonFontSize = UISettingsData.adminNavbarAlarmsWarningButtonFontSize; // 20 (px olmadan integer)
  const adminNavbarRoomServiceWarningButtonTopPosition = UISettingsData.adminNavbarRoomServiceWarningButtonTopPosition; // 18 (px olmadan integer)
  const adminNavbarRoomServiceWarningButtonLeftPosition = UISettingsData.adminNavbarRoomServiceWarningButtonLeftPosition; // 10 (px olmadan integer)
  const adminNavbarRoomServiceWarningButtonBackgroundColor = UISettingsData.adminNavbarRoomServiceWarningButtonBackgroundColor; // "#FFFFFF"
  const adminNavbarRoomServiceWarningButtonColor = UISettingsData.adminNavbarRoomServiceWarningButtonColor; // "#00FFF0"
  const adminNavbarRoomServiceWarningButtonFontSize = UISettingsData.adminNavbarRoomServiceWarningButtonFontSize; // 22 (px olmadan integer) 

  const adminNavbarHomeText = UISettingsData.adminNavbarHomeText; //"Ana Menü";
  const adminNavbarDashboardText = UISettingsData.adminNavbarDashboardText; //"Dashboard";
  const adminNavbarRoomStatusText = UISettingsData.adminNavbarRoomStatusText; //"Room Status";
  const adminNavbarAlarmsText = UISettingsData.adminNavbarAlarmsText; //"Alarms";
  const adminNavbarRoomServicesText = UISettingsData.adminNavbarRoomServicesText; //"Oda Servisi";
  const adminNavbarReportsText = UISettingsData.adminNavbarReportsText; // "Raporlar";
  const adminNavbarExitText = UISettingsData.adminNavbarExitText; //"Çıkış";

  const navItemStyle = {
    fontFamily: adminNavbarFontFamily,
    fontSize: adminNavbarFontSize,
    color: adminNavBarFontColor,
    paddingLeft: '40px', // Sol taraftaki boşluk için padding ayarı
    paddingRight: '40px', // Sağ taraftaki boşluk için padding ayarı
    fontWeight: "normal",
  };

  const iconMap = {
    home: { inactive: homeInactive, active: homeActive },
    dashboard: { inactive: dashboardInactive, active: dashboardActive },
    roomStatus: { inactive: roomStatusInactive, active: roomStatusActive },
    roomServices: { inactive: roomServicesInactive, active: roomServicesActive },
    reports: { inactive: reportsInactive, active: reportsActive },
    alarms: { inactive: alarmsInactive, active: alarmsActive },
    exit: { inactive: exit, active: exit },
  };

  const handleLinkClick = (id) => {
    setActiveLink(id);
  };

  const [isLargeScreen, setIsLargeScreen] = useState(true); // Track if screen width is larger than 1400px

  // Handle screen resize to update isMobile state
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1600); // Check if screen width is larger than 1400px
    };

    // Initial check and resize listener
    handleResize();
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNavbarToggle = () => {
    setIsLargeScreen(true);
  };
  return (
    
    <nav className="navbar navbar-expand-xl" style={{ backgroundColor: adminNavbarBackgroundColor, margin: '0px 100px', borderRadius: '15px' }}>
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" onClick={handleNavbarToggle}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
          <ul className="navbar-nav text-center" style={{ paddingInline: '20px', overflow: 'visible'}}>

            {/* Home is always visible */}
            <li className="nav-item">
              <Link to="/home" className="nav-link" style={{ ...navItemStyle, textDecoration: activeLink === 'home' ? 'underline' : 'none', textDecorationColor: activeLink === 'home' ? adminNavBarClickUnderlineColor : 'transparent' }} onClick={() => handleLinkClick('home')}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={activeLink === 'home' ? iconMap.home.active : iconMap.home.inactive} alt="Home Icon" className="icon" style={{ width: adminNavbarIconFontSize, height: adminNavbarIconFontSize, marginRight: adminNavBarIconFontMargin }} />
                  {isLargeScreen && adminNavbarHomeText}
                </span>
              </Link>
            </li>

            {adminNavbar.includes("dashboard") && userData.dashboardAccess === 'ACCESS' &&(
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link" style={{ ...navItemStyle, textDecoration: activeLink === 'dashboard' ? 'underline' : 'none', textDecorationColor: activeLink === 'dashboard' ? adminNavBarClickUnderlineColor : 'transparent' }} onClick={() => handleLinkClick('dashboard')}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={activeLink === 'dashboard' ? iconMap.dashboard.active : iconMap.dashboard.inactive} alt="Dashboard Icon" className="icon" style={{ width: adminNavbarIconFontSize, height: adminNavbarIconFontSize, marginRight: adminNavBarIconFontMargin }} />
                    {isLargeScreen && adminNavbarDashboardText}
                  </span>
                </Link>
              </li>
            )}

            {adminNavbar.includes("roomStatus") && userData.roomStatusAccess === 'ACCESS' &&(
              <li className="nav-item">
                <Link to="/roomStatus" className="nav-link" style={{ ...navItemStyle, textDecoration: activeLink === 'roomStatus' ? 'underline' : 'none', textDecorationColor: activeLink === 'roomStatus' ? adminNavBarClickUnderlineColor : 'transparent' }} onClick={() => handleLinkClick('roomStatus')}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={activeLink === 'roomStatus' ? iconMap.roomStatus.active : iconMap.roomStatus.inactive} alt="Room Status Icon" className="icon" style={{ width: adminNavbarIconFontSize, height: adminNavbarIconFontSize, marginRight: adminNavBarIconFontMargin }} />
                    {isLargeScreen && adminNavbarRoomStatusText}
                  </span>
                </Link>
              </li>
            )}

            {adminNavbar.includes("alarms") && userData.alarmsAccess === 'ACCESS' &&(
              <li className="nav-item">
                <Link to="/alarms" className="nav-link" style={{ ...navItemStyle, textDecoration: activeLink === 'alarms' ? 'underline' : 'none', textDecorationColor: activeLink === 'alarms' ? adminNavBarClickUnderlineColor : 'transparent' }} onClick={() => handleLinkClick('alarms')}>
                  <span style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <img src={activeLink === 'alarms' ? iconMap.alarms.active : iconMap.alarms.inactive} alt="Alarms Icon" className="icon" style={{ width: adminNavbarIconFontSize, height: adminNavbarIconFontSize, marginRight: adminNavBarIconFontMargin }} /> 
                    {isLargeScreen && adminNavbarAlarmsText}
                    {totalAlarmsNumber > 0 && (
                      <span className="badgeNavbarAlarms" style={{ top: adminNavbarAlarmsWarningButtonTopPosition, left: adminNavbarAlarmsWarningButtonLeftPosition, backgroundColor: adminNavbarAlarmsWarningButtonBackgroundColor, color: adminNavbarAlarmsWarningButtonColor, fontSize: adminNavbarAlarmsWarningButtonFontSize }}>
                        {totalAlarmsNumber}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            )}

            {adminNavbar.includes("roomServices") && userData.roomServicesAccess === 'ACCESS' &&(
              <li className="nav-item">
                <Link to="/roomServices" className="nav-link" style={{ ...navItemStyle, textDecoration: activeLink === 'roomServices' ? 'underline' : 'none', textDecorationColor: activeLink === 'roomServices' ? adminNavBarClickUnderlineColor : 'transparent' }} onClick={() => handleLinkClick('roomServices')}>
                  <span style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <img src={activeLink === 'roomServices' ? iconMap.roomServices.active : iconMap.roomServices.inactive} alt="Room Services Icon" className="icon" style={{ width: adminNavbarIconFontSize, height: adminNavbarIconFontSize, marginRight: adminNavBarIconFontMargin }} />

                    {isLargeScreen && adminNavbarRoomServicesText}
                    {roomServiceAlarmNumber > 0 && (
                      <span className="badgeNavbarRoomService" style={{ top: adminNavbarRoomServiceWarningButtonTopPosition, left: adminNavbarRoomServiceWarningButtonLeftPosition, backgroundColor: adminNavbarRoomServiceWarningButtonBackgroundColor, color: adminNavbarRoomServiceWarningButtonColor, fontSize: adminNavbarRoomServiceWarningButtonFontSize }}>
                        {roomServiceAlarmNumber}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            )}

            {adminNavbar.includes("reports") && userData.reportsAccess === 'ACCESS' &&(
              <li className="nav-item">
                <Link to="/reports" className="nav-link" style={{ ...navItemStyle, textDecoration: activeLink === 'reports' ? 'underline' : 'none', textDecorationColor: activeLink === 'reports' ? adminNavBarClickUnderlineColor : 'transparent' }} onClick={() => handleLinkClick('reports')}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={activeLink === 'reports' ? iconMap.reports.active : iconMap.reports.inactive} alt="Reports Icon" className="icon" style={{ width: adminNavbarIconFontSize, height: adminNavbarIconFontSize, marginRight: adminNavBarIconFontMargin }} />
                    {isLargeScreen && adminNavbarReportsText}
                  </span>
                </Link>
              </li>
            )}

            {/* Çıkış Yap Butonu */}
            <li className="nav-item">
              <Link to="/login" className="nav-link" style={{ ...navItemStyle}} onClick={handleLogout}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={iconMap.exit.active} alt="Exit Icon" className="icon" style={{ width: adminNavbarIconFontSize, height: adminNavbarIconFontSize, marginRight: adminNavBarIconFontMargin }} />
                  {isLargeScreen && adminNavbarExitText}
                </span>
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
