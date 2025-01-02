import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigate'ı içe aktarın
import Grid from '@material-ui/core/Grid';
import TempDate from '../CommonComponents/TemperatureDate'
import WelcomeMessage from '../CommonComponents/WelcomeMessage'
import LogoComponent from '../CommonComponents/LogoComponent'
import {Stack} from '@mui/material';
import { useMediaQuery } from '@mui/material';

import gloriaHomePageImg from '../../assets/icons/anaSayfa/gloriaHomePageImg.png';
import UISettingsData from '../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik
import UISettingsAnaSayfa from '../../assets/jsonFiles/UISettingsAnaSayfaRoomStatus.json'; // JSON dosyasını import ettik
import Button from '@material-ui/core/Button';

import '../../css/Badge.css';  // Yeni CSS dosyasını ekliyoruz

function AnaSayfa({ weatherData, dateData, setActiveLink, blokKatAlarmNumberData, fetchAlarmsData, blokKatDelayedRoomServiceNumberData, fetchRoomServiceData, username}) {
   
    //admin
    const adminAnaSayfaButtonFontFamiy = UISettingsData.adminAnaSayfaButtonFontFamiy || "Poppins";
    const adminAnaSayfaButtonFontSize = UISettingsData.adminAnaSayfaButtonFontSize || 26;
    const adminAnaSayfaBadgeSize = UISettingsData.adminAnaSayfaBadgeSize || 36;

    const adminNavbarAlarmsWarningButtonFontSize = UISettingsData.adminNavbarAlarmsWarningButtonFontSize || 15;
    const adminNavbarRoomServiceWarningButtonFontSize = UISettingsData.adminNavbarRoomServiceWarningButtonFontSize || 15;

    // responsive
    const anaSayfaResponsiveBadgeFontRate = 0.5;
    const anaSayfaResponsiveButtonFontRate = 0.5;
    const anaSayfaResponsiveBadgeSizeRate = 0.5;

    const gloriaHomePageImgWidthOrj = 1719;
    const gloriaHomePageImgHeightOrj = 725; 

    const homePageImgWidthOrj = 1920;
    const homePageImgHeightOrj = 1080;

    const [gloriaHomePageImgWidth, setGloriaHomePageImgWidth] = useState(gloriaHomePageImgWidthOrj);
    const [gloriaHomePageImgHeight, setGloriaHomePageImgHeight] = useState(gloriaHomePageImgHeightOrj);
    const [widthRate, setWidthRate] = useState(1);

    const isSmallScreen = useMediaQuery('(max-width:1200px)'); 
    
    // En ve boy değerlerini tutan state
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        // Resize olayını dinlemek için event listener ekleyelim
        const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        };

        window.addEventListener('resize', handleResize);

        // Bileşen unmount olduğunda event listener'ı temizleyelim
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);

    // En ve boy değerlerini konsola yazdırma
    useEffect(() => {
        setWidthRate(windowSize.width/homePageImgWidthOrj)
        setGloriaHomePageImgWidth(gloriaHomePageImgWidthOrj*(windowSize.width/homePageImgWidthOrj))
        setGloriaHomePageImgHeight(gloriaHomePageImgHeightOrj*(windowSize.width/homePageImgWidthOrj))
    }, [windowSize]);

    console.log("blokKatAlarmNumberData:",blokKatAlarmNumberData)
    console.log("blokKatDelayedRoomServiceNumberData:",blokKatDelayedRoomServiceNumberData)

    const [localBlokKatAlarmNumberData, setLocalBlokKatAlarmNumberData] = useState(blokKatAlarmNumberData);
    const [localBlokKatDelayedRoomServiceNumberData, setLocalBlokKatDelayedRoomServiceNumberData] = useState(blokKatDelayedRoomServiceNumberData);
    useEffect(() => {
        setActiveLink('home'); // Örneğin, activeLink'i 'home' olarak güncelliyoruz
        fetchAlarmsData();
        fetchRoomServiceData();
    }, []); // Boş dependency array, sadece component ilk kez render edildiğinde useEffect'in çalışmasını sağlar

    useEffect(() => {
        setLocalBlokKatAlarmNumberData(blokKatAlarmNumberData)
    }, [blokKatAlarmNumberData]);

    useEffect(() => {
        setLocalBlokKatDelayedRoomServiceNumberData(blokKatDelayedRoomServiceNumberData)
    }, [blokKatDelayedRoomServiceNumberData]);

    // console.log("weatherData: ", weatherData)
    const navigate = useNavigate();  // useNavigate hook'unu kullanarak navigate işlevini oluşturun
  
    const { temperature, seaTemperature } = weatherData;
    const { formattedDate, formattedTime } = dateData;

    const homePageBlokButtons = UISettingsAnaSayfa.homePageBlokButtons;
    const polyPointsData = UISettingsAnaSayfa.polyPointsData;

    // Ölçekleme ve path oluşturma
    const paths = polyPointsData.map(({ points, fill }) => {
        const scaledPoints = points.map(point => ({
            x: (point.x / gloriaHomePageImgWidthOrj) * gloriaHomePageImgWidth,
            y: (point.y / gloriaHomePageImgHeightOrj) * gloriaHomePageImgHeight
        }));

        const pathData = `M${scaledPoints.map(point => `${point.x},${point.y}`).join('L')}Z`;

        return { d: pathData, fill };
    });

    // const homePageBlokButtons = [
    //     { ui_display_name:"Owner Villa", button_name: "Owner Villalar", x_coordinate: 340 , y_coordinate: 229 , active: true},
    //     { ui_display_name:"5200 East", button_name: "5200 Doğu", x_coordinate: 285 , y_coordinate: 300, active: true},
    //     { ui_display_name:"5900", button_name: "5900", x_coordinate: 235 , y_coordinate: 380, active: true},
    //     { ui_display_name:"5800", button_name: "5800", x_coordinate: 175 , y_coordinate: 448, active: true},
    //     { ui_display_name:"A Block", button_name: "A", x_coordinate: 529 , y_coordinate: 370, active: true},
    //     { ui_display_name:"Indoor Pool - SPA", button_name: "Kapalı Havuz SPA", x_coordinate: 551 , y_coordinate: 452, active: false},
    //     { ui_display_name:"General Area", button_name: "Genel Mahal", x_coordinate: 910 , y_coordinate: 401, active: false},
    //     { ui_display_name:"F Block", button_name: "F", x_coordinate: 1198 , y_coordinate: 401, active: true},
    //     { ui_display_name:"Convention Center", button_name: "Convention Center", x_coordinate: 29 , y_coordinate: 591, active: false},
    //     { ui_display_name:"Fitness", button_name: "Fitness", x_coordinate: 525 , y_coordinate: 561, active: false},
    //     { ui_display_name:"Gogi Kids Club", button_name: "Gogi Kids Club", x_coordinate: 1000 , y_coordinate: 684, active: false},
    //     { ui_display_name:"5200 West", button_name: "5200 Batı", x_coordinate: 1200 , y_coordinate: 272, active: true},
    //     { ui_display_name:"5300", button_name: "5300", x_coordinate: 1365 , y_coordinate: 305, active: true},
    //     { ui_display_name:"5500", button_name: "5500", x_coordinate: 1450 , y_coordinate: 330, active: false},
    //     { ui_display_name:"5600", button_name: "5600", x_coordinate: 1506 , y_coordinate: 376, active: false},
    //     { ui_display_name:"5700", button_name: "5700", x_coordinate: 1574 , y_coordinate: 441, active: false},
    //     { ui_display_name:"5000", button_name: "5000", x_coordinate: 1505 , y_coordinate: 501, active: true},
    //     { ui_display_name:"5100", button_name: "5100", x_coordinate: 1598 , y_coordinate: 542, active: true},
    //     { ui_display_name:"Gogi Fun Jungle", button_name: "Gogi Fun Jungle", x_coordinate: 1465 , y_coordinate: 629, active: false},

    // ];

    // const polyPointsData = [
    //     { 
    //         points: [
    //             { x: 322, y: 168 },
    //             { x: 630, y: 173 },
    //             { x: 222, y: 527 },
    //             { x: 55, y: 521 }
    //         ], 
    //         fill: '#86CCFF80' 
    //     },
    //     { 
    //         points: [
    //             { x: 600, y: 283 },
    //             { x: 730, y: 287 },
    //             { x: 692, y: 409 },
    //             { x: 394, y: 405 },
    //             { x: 464, y: 317 },
    //             { x: 583, y: 320 }
    //         ], 
    //         fill: '#49EEBE80' 
    //     },
    //     { 
    //         points: [
    //             { x: 705, y: 368 },
    //             { x: 797, y: 373 },
    //             { x: 725, y: 471 },
    //             { x: 522, y: 471 },
    //             { x: 557, y: 408 },
    //             { x: 690, y: 411 }
    //         ], 
    //         fill: '#AEAEFF80' 
    //     },
    //     { 
    //         points: [
    //             { x: 719, y: 329 },
    //             { x: 1094, y: 346 },
    //             { x: 1103, y: 424 },
    //             { x: 1164, y: 450 },
    //             { x: 1040, y: 513 },
    //             { x: 897, y: 432 },
    //             { x: 903, y: 378 },
    //             { x: 874, y: 378 },
    //             { x: 872, y: 408 },
    //             { x: 817, y: 407 },
    //             { x: 823, y: 375 },
    //             { x: 705, y: 368 },
    //         ], 
    //         fill: '#FFD55B80' 
    //     },
    //     { 
    //         points: [
    //             { x: 1051, y: 303 },
    //             { x: 1177, y: 304 }, 
    //             { x: 1190, y: 348 },
    //             { x: 1318, y: 352 }, 
    //             { x: 1351, y: 405 },
    //             { x: 1340, y: 460 },
    //             { x: 1164, y: 450 },
    //             { x: 1103, y: 424 },
    //             { x: 1094, y: 346 }, 
    //             { x: 1057, y: 346 }, 
    //         ], 
    //         fill: '#BB0BBF80' 
    //     },
    //     { 
    //         points: [
    //             { x: 69, y: 535 },
    //             { x: 300, y: 545 }, 
    //             { x: 240, y: 632 },
    //             { x: 347, y: 632 }, 
    //             { x: 290, y: 724 },
    //             { x: 17, y: 724 },
    //             { x: 5, y: 718 },
    //             { x: 3, y: 716 },
    //             { x: 1, y: 705 },
    //             { x: 0, y: 654 },
    //             { x: 35, y: 613 },
    //             { x: 0, y: 607 },
    //             { x: 0, y: 598 },
    //         ], 
    //         fill: '#51E85A80' 
    //     },
    //     { 
    //         points: [
    //             { x: 536, y: 530 },
    //             { x: 612, y: 534 }, 
    //             { x: 593, y: 578 },
    //             { x: 517, y: 572 }, 
    //         ], 
    //         fill: '#8DBD0680' 
    //     },
    //     { 
    //         points: [
    //             { x: 864, y: 725 },
    //             { x: 1132, y: 570 }, 
    //             { x: 1268, y: 635 },
    //             { x: 1187, y: 725 }, 
    //         ], 
    //         fill: '#24C1D480' 
    //     },
    //     { 
    //         points: [
    //             { x: 1145, y: 241 },
    //             { x: 1223, y: 239 }, 
    //             { x: 1330, y: 241 },
    //             { x: 1485, y: 273 },
    //             { x: 1629, y: 358 },
    //             { x: 1750, y: 488 },
    //             { x: 1750, y: 626 },
    //             { x: 1559, y: 724 },
    //             { x: 1346, y: 724 },
    //             { x: 1388, y: 628 },
    //             { x: 1483, y: 501 },
    //             { x: 1422, y: 387 },
    //             { x: 1288, y: 335 },
    //             { x: 1186, y: 296 },
    //         ], 
    //         fill: '#86CCFF80' 
    //     },
    // ];

        // // Koordinatları sayfaya göre ölçekleme
    // const scaledPolyDoguVilla = polyPointsDoguVilla.map(point => ({
    //     x: (point.x / gloriaHomePageImgWidthOrj) * gloriaHomePageImgWidth,
    //     y: (point.y / gloriaHomePageImgHeightOrj) * gloriaHomePageImgHeight
    // }));

    // // Koordinatları sayfaya göre ölçekleme
    // const scaledPolyABlok = polyPointsABlok.map(point => ({
    //     x: (point.x / gloriaHomePageImgWidthOrj) * gloriaHomePageImgWidth,
    //     y: (point.y / gloriaHomePageImgHeightOrj) * gloriaHomePageImgHeight
    // }));

    // // Koordinatları sayfaya göre ölçekleme
    // const scaledPolyKapaliHavuz = polyPointsKapaliHavuz.map(point => ({
    //     x: (point.x / gloriaHomePageImgWidthOrj) * gloriaHomePageImgWidth,
    //     y: (point.y / gloriaHomePageImgHeightOrj) * gloriaHomePageImgHeight
    // }));

    // // Koordinatları sayfaya göre ölçekleme
    // const scaledPolyFBlok = polyPointsFBlok.map(point => ({
    //     x: (point.x / gloriaHomePageImgWidthOrj) * gloriaHomePageImgWidth,
    //     y: (point.y / gloriaHomePageImgHeightOrj) * gloriaHomePageImgHeight
    // }));
    // // Koordinatları sayfaya göre ölçekleme
    // const scaledPolyGenelMahal = polyPointsGenelMahal.map(point => ({
    //     x: (point.x / gloriaHomePageImgWidthOrj) * gloriaHomePageImgWidth,
    //     y: (point.y / gloriaHomePageImgHeightOrj) * gloriaHomePageImgHeight
    // }));
    // // Koordinatları sayfaya göre ölçekleme
    // const scaledPolyConventionCenter = polyPointsConventionCenter.map(point => ({
    //     x: (point.x / gloriaHomePageImgWidthOrj) * gloriaHomePageImgWidth,
    //     y: (point.y / gloriaHomePageImgHeightOrj) * gloriaHomePageImgHeight
    // }));

    // const scaledPolyFitness = polyPointsFitness.map(point => ({
    //     x: (point.x / gloriaHomePageImgWidthOrj) * gloriaHomePageImgWidth,
    //     y: (point.y / gloriaHomePageImgHeightOrj) * gloriaHomePageImgHeight
    // }));

    // const scaledPolyGogiKidsClub = polyPointsGogiKidsClub.map(point => ({
    //     x: (point.x / gloriaHomePageImgWidthOrj) * gloriaHomePageImgWidth,
    //     y: (point.y / gloriaHomePageImgHeightOrj) * gloriaHomePageImgHeight
    // }));
    // const scaledPolyBatiVilla = polyPointsBatiVilla.map(point => ({
    //     x: (point.x / gloriaHomePageImgWidthOrj) * gloriaHomePageImgWidth,
    //     y: (point.y / gloriaHomePageImgHeightOrj) * gloriaHomePageImgHeight
    // }));

    // SVG path için dize oluşturma
    // const polyPathDoguVilla = `M${scaledPolyDoguVilla.map(point => `${point.x},${point.y}`).join('L')}Z`;
    // const polyPathABlok = `M${scaledPolyABlok.map(point => `${point.x},${point.y}`).join('L')}Z`;
    // const polyPathKapaliHavuz = `M${scaledPolyKapaliHavuz.map(point => `${point.x},${point.y}`).join('L')}Z`;
    // const polyPathGenelMahal = `M${scaledPolyGenelMahal.map(point => `${point.x},${point.y}`).join('L')}Z`;
    // const polyPathFBlok = `M${scaledPolyFBlok.map(point => `${point.x},${point.y}`).join('L')}Z`;
    // const polyPathConventionCenter = `M${scaledPolyConventionCenter.map(point => `${point.x},${point.y}`).join('L')}Z`;
    // const polyPathFitness = `M${scaledPolyFitness.map(point => `${point.x},${point.y}`).join('L')}Z`;
    // const polyPathGogiKidsClub = `M${scaledPolyGogiKidsClub.map(point => `${point.x},${point.y}`).join('L')}Z`;
    // const polyPathBatiVilla = `M${scaledPolyBatiVilla.map(point => `${point.x},${point.y}`).join('L')}Z`;

    // const paths = [
    //     {d: polyPathDoguVilla, fill: '#86CCFF', opacity: pathOpacity},
    //     {d: polyPathABlok, fill: '#49EEBE', opacity: pathOpacity},
    //     {d: polyPathKapaliHavuz, fill: '#AEAEFF', opacity: pathOpacity},
    //     {d: polyPathGenelMahal, fill: '#FFD55B', opacity: pathOpacity},
    //     {d: polyPathFBlok, fill: '#BB0BBF', opacity: pathOpacity},
    //     {d: polyPathConventionCenter, fill: '#51E85A', opacity: pathOpacity},
    //     {d: polyPathFitness, fill: '#8DBD06', opacity: pathOpacity},
    //     {d: polyPathGogiKidsClub, fill: '#24C1D4', opacity: pathOpacity},
    //     {d: polyPathBatiVilla, fill: '#86CCFF', opacity: pathOpacity},
    // ];

    // Butona tıklanma işlevi
    const handleButtonClick = (buttonName) => {
        console.log("anasayfa buttonName:",buttonName);
        navigate('/roomStatus', { state: { blokNumarasi: buttonName } });
    };

     // Her buton için blokKatAlarmNumberData'dan alarm sayısını alacak fonksiyon
    const getAlarmCount = (buttonName) => {
        // `blokKatAlarmNumberData` tanımlı ve içinde `buttonName` mevcut mu kontrol edin
        if (!localBlokKatAlarmNumberData || !localBlokKatAlarmNumberData[buttonName]) return 0;
        return Object.values(localBlokKatAlarmNumberData[buttonName]).reduce((total, count) => total + count, 0);
    };

    const getRoomServiceCount = (buttonName) => {
        // `localBlokKatDelayedRoomServiceNumberData` tanımlı ve içinde `buttonName` mevcut mu kontrol edin
        if (!localBlokKatDelayedRoomServiceNumberData || !localBlokKatDelayedRoomServiceNumberData[buttonName]) return 0;
        return Object.values(localBlokKatDelayedRoomServiceNumberData[buttonName]).reduce((total, count) => total + count, 0);
    };
    return (
        <div style={{ position: "relative", top: 10, width: `calc(100% - ${200*widthRate}px)`, height: '100%', margin: `0 ${100*widthRate}px` }}>

            <Grid container spacing={2} style={{ padding: '16px'}}>
                <Grid item sx={12} sm={12} md={12} lg={12} style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>
                    <Stack width="100%" display="flex" flexDirection="row" flexWrap="wrap" gap={isSmallScreen ? 0 : 2}            
                                        justifyContent="flex-start" alignItems="center">        
                        <WelcomeMessage username={username}/>
                        <div style={{ marginLeft: isSmallScreen ? 'auto' : 'auto' }}>
                            <TempDate formattedDate={formattedDate} formattedTime={formattedTime} temperature={temperature} seaTemperature={seaTemperature} />
                        </div>
                    </Stack>
                </Grid>
            </Grid>

            <Grid container spacing={2} style={{  borderRadius: "15px" }}>
                <Grid item sx={12} sm={12} md={12} lg={12} style={{ height: 'auto', position: 'relative', padding: '0', margin: '10px' }}>
                    <img src={gloriaHomePageImg} alt="Home Page" style={{ width: gloriaHomePageImgWidth, height: gloriaHomePageImgHeight, borderRadius: '5px' }} />
                    
                    <svg
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        viewBox={`0 0 ${gloriaHomePageImgWidth} ${gloriaHomePageImgHeight}`}
                    >
                    {paths.map((path, index) => (
                        <path
                            key={index}
                            d={path.d}
                            fill={path.fill}
                        />
                    ))}
                    </svg>
                    
                    {homePageBlokButtons.map((button, index) => {
                        const scaledX = (button.x_coordinate / gloriaHomePageImgWidthOrj) * gloriaHomePageImgWidth - 20;
                        const scaledY = (button.y_coordinate / gloriaHomePageImgHeightOrj) * gloriaHomePageImgHeight + 20;
                        const alarmCount = getAlarmCount(button.button_name);
                        const roomServiceCount = getRoomServiceCount(button.button_name);
                        return (
                            <Button
                                key={index}
                                variant="contained"
                                onClick={() => handleButtonClick(button.button_name)} // Butona tıklanma işlevi
                                style={{
                                    position: 'absolute',
                                    top: `${scaledY}px`,
                                    left: `${scaledX}px`,
                                    transform: 'translate(0%, -100%)',
                                    backgroundColor: 'rgba(0, 0, 0, 0)',
                                    color: button.active ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 1)', // Yazı renhi
                                    fontFamily: adminAnaSayfaButtonFontFamiy,
                                    fontWeight: 'bold',
                                    fontSize: isSmallScreen ? adminAnaSayfaButtonFontSize*anaSayfaResponsiveButtonFontRate : adminAnaSayfaButtonFontSize,
                                    border: 'none',
                                    textTransform: 'none',  // Yazıyı büyük harfe çevirmez
                                    boxShadow: 'none',  // Gölgeyi kaldırır
                                    cursor: button.active ? 'pointer' : 'default',  // Aktifse tıklanabilir, değilse tıklanamaz
                                    pointerEvents: button.active ? 'auto' : 'none',  // Aktifse tıklanabilir, değilse tıklanamaz
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'// Yazı gölgesi

                                }}
                            >
                                {button.ui_display_name}
                                {alarmCount > 0 && button.active && (
                                    <span className="badgeHomeAlarms" 
                                    style={{fontSize: isSmallScreen ? adminNavbarAlarmsWarningButtonFontSize*anaSayfaResponsiveBadgeFontRate:adminNavbarAlarmsWarningButtonFontSize, 
                                        fontFamily: adminAnaSayfaButtonFontFamiy,
                                        width: isSmallScreen ? adminAnaSayfaBadgeSize*anaSayfaResponsiveBadgeSizeRate: adminAnaSayfaBadgeSize,
                                        height: isSmallScreen ? adminAnaSayfaBadgeSize*anaSayfaResponsiveBadgeSizeRate: adminAnaSayfaBadgeSize,
                                        transform: 'translate(-100%, -100%)',
                                    }}>{alarmCount}</span>
                                )}
                                {roomServiceCount > 0 && button.active && (
                                    <span className="badgeHomeRoomService" 
                                            style={{fontSize: isSmallScreen ? adminNavbarRoomServiceWarningButtonFontSize*anaSayfaResponsiveBadgeFontRate:adminNavbarRoomServiceWarningButtonFontSize, 
                                                    fontFamily: adminAnaSayfaButtonFontFamiy,
                                                    width: isSmallScreen ? adminAnaSayfaBadgeSize*anaSayfaResponsiveBadgeSizeRate: adminAnaSayfaBadgeSize,
                                                    height: isSmallScreen ? adminAnaSayfaBadgeSize*anaSayfaResponsiveBadgeSizeRate: adminAnaSayfaBadgeSize,
                                                    transform: 'translate(0%, -100%)',
                                                }}>
                                            {roomServiceCount}
                                    </span>
                                )}
                            </Button>
                            
                        );
                    })}
                </Grid>
                <Grid item sx={2} sm={2} md={2} lg={2}>
            
            </Grid>
            <Grid item sx={10} sm={10} md={10} lg={10} style={{  textAlign:"right" }}>
              <LogoComponent/>          
            </Grid>  
            </Grid>

        </div>
    );
}

export default AnaSayfa;
