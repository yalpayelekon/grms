// WelcomeMessage.js
import React from 'react';
import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const WelcomeMessage = ({username}) => {
  
    // admin
    const adminWelcomeMessageWelcomeMessage = UISettingsData.adminWelcomeMessageWelcomeMessage; // "Welcome back, zaaaaa asd "
    const adminWelcomeMessageWelcomeMessageColor = UISettingsData.adminWelcomeMessageWelcomeMessageColor; // "#301934"
    const adminWelcomeMessageLogedFontFamily = UISettingsData.adminWelcomeMessageLogedFontFamily; // "poppins"
    const adminWelcomeMessageSubTitleColor = UISettingsData.adminWelcomeMessageSubTitleColor; // "#FF69B4"
    const adminWelcomeMessageSubTitleMessage = UISettingsData.adminWelcomeMessageSubTitleMessage; // "hosgeldiniz ASD "

    const logedName = username;
    return (
        <div style={{ fontFamily: adminWelcomeMessageLogedFontFamily }}>
        <h3 style={{ color: adminWelcomeMessageWelcomeMessageColor }}>
            {adminWelcomeMessageWelcomeMessage} {logedName}
        </h3>
        <h6 style={{ color: adminWelcomeMessageSubTitleColor }}>
            {adminWelcomeMessageSubTitleMessage}
        </h6>
        </div>
    );
};

export default WelcomeMessage;
