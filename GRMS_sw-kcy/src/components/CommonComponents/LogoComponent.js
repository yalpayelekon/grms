// LogoComponent.js
import React, { useState, useEffect } from 'react';
import gloriaSerenity from '../../assets/icons/generic/gloriaSerenity.png';
import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const LogoComponent = () => {
  
  // admin
  const adminLogoComponentHideLogo = UISettingsData.adminLogoComponentHideLogo; // false
  const adminLogoComponentLogoWidth = UISettingsData.adminLogoComponentLogoWidth; // 250
  const adminLogoComponentLogoHeight = UISettingsData.adminLogoComponentLogoHeight; // 140 

  if (adminLogoComponentHideLogo) {
    return null; // Eğer adminLogoComponentHideLogo true ise, logo hiç gösterilmez
  }

  return (
    <div style={{ marginLeft: "auto" }}>
      <img 
        src={gloriaSerenity} 
        alt="Logo" 
        style={{ 
          height: adminLogoComponentLogoHeight, 
          width: adminLogoComponentLogoWidth 
        }} 
      />
    </div>
  );
};

export default LogoComponent;
