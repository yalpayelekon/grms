import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // useLocation'ı içe aktarın
import { useMediaQuery } from '@mui/material';
import {Stack} from '@mui/material';
import Grid from '@material-ui/core/Grid';

import ErrorAlert from '../CommonComponents/ErrorAlert'
import ModalItem from './ModalItem';
import RoomStatusCheckBox from './RoomStatusCheckBox'; 
import RoomStatusSearchField from './RoomStatusSearchField'; 
import IconWithText from './IconWithText'; 
import CheckmarksFilterRoomStatus from "./CheckmarksFilterRoomStatus";
import MekanikModal from "./Mekanik/MekanikModal";
import LightingModal from "./Lighting/LightingModal";
import HKModal from "./HK/HKModal";

import filterIcon from '../../icons/generic/filterIcon.png';
import greenadamvaliz from '../../icons/roomStatus/greenadamvaliz.png';
import greenhousekeeping from '../../icons/roomStatus/greenhousekeeping.png';
import greenvaliz from '../../icons/roomStatus/greenvaliz.png';
import whitehousekeeping from '../../icons/roomStatus/whitehousekeeping.png';
import white from '../../icons/roomStatus/white.png';
import onlyRed from '../../icons/roomStatus/onlyRed.png';

import LogoComponent from '../CommonComponents/LogoComponent';

import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

function RoomStatus({ setActiveLink, blokKatAlarmNumberData }) {
    
    const isSmallScreen = useMediaQuery('(max-width:1200px)'); 

    // admin
    const adminRoomStatusLightingCheckboxText = UISettingsData.adminRoomStatusLightingCheckboxText; // "Işıklar"
    const adminRoomStatusHVACCheckboxText = UISettingsData.adminRoomStatusHVACCheckboxText; // "Havalandırmaa"
    const adminRoomStatusHouseKeepingCheckboxText = UISettingsData.adminRoomStatusHouseKeepingCheckboxText; // "Oda Temizliğği Temizliğği"

    const adminRoomStatusHideLightingChechbox = UISettingsData.adminRoomStatusHideLightingChechbox; // true
    const adminRoomStatusHideHVACChechbox = UISettingsData.adminRoomStatusHideHVACChechbox; // false
    const adminRoomStatusHideHouseKeepingChechbox = UISettingsData.adminRoomStatusHideHouseKeepingChechbox; // false
    const adminRoomStatusBackgroundColor = UISettingsData.adminRoomStatusBackgroundColor; 

    const adminRoomStatusFontFamily = UISettingsData.adminRoomStatusFontFamily || "Poppins";

    const topTextLineRentedOccupied = UISettingsData.topTextLineRentedOccupied || "Rented Occupied";
    const topTextLineRentedHK = UISettingsData.topTextLineRentedHK || "Rented HK";
    const topTextLineRentedVacant = UISettingsData.topTextLineRentedVacant || "Rented Vacant";
    const topTextLineUnrentedHK = UISettingsData.topTextLineUnrentedHK || "Unrented HK";
    const topTextLineUnrentedVacant = UISettingsData.topTextLineUnrentedVacant || "Unrented Vacant";
    const topTextLineMalfunctionAlarms = UISettingsData.topTextLineMalfunctionAlarms || "Malfunction/Alarms";

    const location = useLocation();
    const initialBlokNumarasi = location.state?.blokNumarasi || "A"; // URL durumundan blokNumarasi alınır veya varsayılan "A" kullanılır
    // console.log("initialBlokNumarasi: ",initialBlokNumarasi)

    const categoryNamesBlokKatMap = {
        "A": ['1', '2', '3', '4'], // Blok A için kat seçenekleri
        "F": ['1', '2', '3', '4'], // Blok F için kat seçenekleri
        "Owner Villalar": ['Zemin'], // Owner Villalar için kat seçenekleri
        "5000": ['Zemin'],                  
        "5100": ['Zemin'],
        "5200 Batı": ['Zemin'],
        "5200 Doğu": ['Zemin'],     
        "5300": ['Zemin'],                  
        "5800": ['Zemin'],                  
        "5900": ['Zemin'],                            
        "A-F Yatak Kat Koridor": ["Zemin", '1', '2', '3'],   
        "Çevre Aydınlatma": ['Zemin']
    };
    const categoryNamesBlok = Object.keys(categoryNamesBlokKatMap) 

    const OPACITY_VALUE = 0.05;

    const [data, setData] = useState([]); // room status data
    const [selectedHVACOda, setSelectedHVACOda] = useState(null);
    const [selectedLightingOda, setSelectedLightingOda] = useState(null);
    const [selectedHKOda, setSelectedHKOda] = useState(null);
    const [roomNumber, setRoomNumber] = useState(null);
    const [roomNumberForHK, setRoomNumberForHK] = useState(null);
    const [blokNumarasi, setBlokNumarasi] = useState(initialBlokNumarasi); // kcy burayi ilklendirmek gerekiyor yoksa ilk acildiginda null olarak goruyor, db den veri gelince dgismesi lazim
    const [katNumarasi, setKatNumarasi] = useState(categoryNamesBlokKatMap[initialBlokNumarasi][0]); // kcy burayi ilklendirmek gerekiyor yoksa ilk acildiginda null olarak goruyor, db den veri gelince dgismesi lazim

    const [categoryBlokName, setCategoryBlokName] = useState(initialBlokNumarasi);
    const [categoryKatName, setCategoryKatName] = useState(categoryNamesBlokKatMap[initialBlokNumarasi][0]);

    const [opacityUnrentedVacant, setOpacityUnrentedVacant] = useState(1);
    const [opacityUnrentedHK, setOpacityUnrentedHK] = useState(1);
    const [opacityRentedVacant, setOpacityRentedVacant] = useState(1);
    const [opacityRentedOccupied, setOpacityRentedOccupied] = useState(1);
    const [opacityRentedHK, setOpacityRentedHK] = useState(1);
    const [opacityMalfunction, setOpacityMalfunction] = useState(1);

    const [additionalData, setAdditionalData] = useState(Array.from({ length: 40 }, (_, index) => ({opacity: 1})));

    // HVAC Modal useState and functions
    const [isHVACModalOpen, setIsHVACModalOpen] = useState(false);

    // Lighting Modal useState and functions
    const [isLightingModalOpen, setIsLightingModalOpen] = useState(false);

    const [isHKModalOpen, setIsHKModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [isMatchFound, setIsMatchFound] = useState(false);

    // Light, HVAC HK Buttons visibility
    const [isLightingVisible, setIsLightingVisible] = useState(!adminRoomStatusHideLightingChechbox); 
    const [isHVACVisible, setIsHVACVisible] = useState(!adminRoomStatusHideHVACChechbox);
    const [isHKVisible, setIsHKVisible] = useState(!adminRoomStatusHideHouseKeepingChechbox);

    const [error, setError] = useState(null);
    const [roomStateNumber, setRoomStateNumber] = useState([15,5,5,5,5,5]);

    const [katErrorCounts, setKatErrorCounts] = useState({}); // Kat hata sayımlarını saklamak için state

    const [isGenelMahal, setIsGenelMahal] = useState("0");

    // Resimleri dinamik olarak yüklemek için require.context
    const images = require.context('../../../config', false, /\.png$/);

    const getImage = (blok, kat, oda) => {
        const imageName = `blok_${blok}_kat_${kat}_oda_${oda}.png`;
        try {
            return images(`./${imageName}`);
        } catch (error) {
            console.error("Resim bulunamadı:", error);
            return null;
        }
    };

    const openLightingModal = (oda_number) => { 
        const blokNumarasi = categoryBlokName;
        const katNumarasi = categoryKatName;
        const odaNumarasi = oda_number;
    
        // tridiumBackend'den veri okuma
        const url = `http://127.0.0.1:8000/getRoomStatusOutputDeviceData/${blokNumarasi}/${katNumarasi}/${odaNumarasi}`;
        fetch(url)
            .then(res => res.json())
            .then(roomStatusOutputDeviceData => {
                if (roomStatusOutputDeviceData && roomStatusOutputDeviceData.outputDevices.length !== 0) {
                    console.log("FROM DB roomStatusOutputDeviceData", roomStatusOutputDeviceData);
    
                    // Resim verisini al
                    const image = getImage(blokNumarasi, katNumarasi, odaNumarasi);
                    console.log("image", image);
    
                    // Dinamik JSON dosyasını yükleme
                    import(`../../../config/blok_${blokNumarasi}_kat_${katNumarasi}_oda_${odaNumarasi}.json`)
                        .then(module => {
                            const coordinatesData = module.default;
    
                            // Koordinat bilgilerini JSON dosyasından alma
                            const outputDevicesWithButtons = roomStatusOutputDeviceData.outputDevices.map(device => {
                                const coordinates = coordinatesData.filter(coord => coord.address === device.address);

                                if (coordinates.length > 0) {
                                    device.roomButton = coordinates.map(coord => ({
                                        x1: coord.x1 || "",
                                        y1: coord.y1 || "",
                                        x2: coord.x2 || "",
                                        y2: coord.y2 || "",
                                        type: coord.type || ""
                                    }));
                                } else {
                                    device.roomButton = []; // Koordinat bulunamazsa boş dizi
                                }
    
                                return device;
                            });
    
                            // Güncellenmiş verileri state'e set ediyoruz
                            setSelectedLightingOda({
                                ...roomStatusOutputDeviceData,
                                outputDevices: outputDevicesWithButtons,
                                roomPlanImage: image // Resim verisini ekliyoruz
                            });
    
                            setIsLightingModalOpen(true);
                        })
                        .catch(error => {
                            console.error("Koordinat verisi alınamadı:", error);

                            // Koordinat verisi yüklenemezse, roomButton'ları boş dizi olarak ayarla
                            const outputDevicesWithButtons = roomStatusOutputDeviceData.outputDevices.map(device => ({
                                ...device,
                                roomButton: []
                            }));

                            // Güncellenmiş verileri state'e set ediyoruz
                            setSelectedLightingOda({
                                ...roomStatusOutputDeviceData,
                                outputDevices: outputDevicesWithButtons,
                                roomPlanImage: image // Resim verisini ekliyoruz
                            });

                            setIsLightingModalOpen(true);
                            });
                }
            })
            .catch(error => {
                console.error("Veri alınamadı:", error);
            });
    };

    const openHVACModal = (oda_number) => { // tridium verisinin okundugu kisim

        const blokNumber = categoryBlokName
        const katNumber = categoryKatName

        // tridiumBackend den veri okuma hh
        const url = `http://127.0.0.1:8000/getRoomStatusHVACData/${blokNumber}/${katNumber}/${oda_number}/`;
        fetch(url)
            .then(res => {
            return res.json();
            })
            .then(roomStatusHVACData => {
                if (roomStatusHVACData) {
                    console.log("FROM DB roomStatusHVACData", roomStatusHVACData)
                    setSelectedHVACOda(roomStatusHVACData) // veriyi okuyamaz ise hvac modal acilmaz
                    setIsHVACModalOpen(true);
                }
            })
            .catch(error => {
                // Hata durumunda burada işlem yapabilirsiniz
                console.error("Veri alinamadi:", error);
                setError("HVAC data not found");
        });

    };

    
    const openHKModal = (oda_number) => {
        const blokNumber = categoryBlokName
        const katNumber = categoryKatName
        setRoomNumberForHK(oda_number)
        const url = `http://127.0.0.1:8000/getRoomDetailsData/${blokNumber}/${katNumber}/${oda_number}/`;
        fetch(url)
            .then(res => {
            return res.json();
            })
            .then(data => {
            if (data && data.roomDetail) {
                console.log("getRoomDetailsData", data)
                console.log("getRoomDetailsData.roomDetail", data.roomDetail)
                setSelectedHKOda(data.roomDetail) // veriyi okuyamaz ise hvac modal acilmaz
                setIsHKModalOpen(true);
            }
            })
            .catch(error => {
            console.error("Veri alinamadi:", error);
            });
    };

    const calculateKatErrorCounts = (data, selectedBlock) => {
        let katErrors = {};
        if (data && selectedBlock && data[selectedBlock]) {
          Object.entries(data[selectedBlock]).forEach(([kat, count]) => {
            katErrors[kat] = count;
          });
        }
        return katErrors;
      };

    useEffect(() => {

        if (blokKatAlarmNumberData && blokKatAlarmNumberData.hasOwnProperty(categoryBlokName)) {
            const newKatErrorCounts = calculateKatErrorCounts(blokKatAlarmNumberData, categoryBlokName);
            setKatErrorCounts(newKatErrorCounts);
        }
    }, [blokKatAlarmNumberData]); // Boş bağımlılık dizisi ile sayfa yüklendiğinde bir kez çalışır

    const handleCategoryBlokChange = (event) => {
        console.log("handleCategoryBlokChange", event.target)
        const {
            target: { value },
          } = event;

        setCategoryBlokName(value);
        console.log("categoryNamesBlokKatMap[blokNumarasi][0]: ",categoryNamesBlokKatMap[value][0])
        setCategoryKatName(categoryNamesBlokKatMap[value][0]);

        setOpacityUnrentedVacant(1)
        setOpacityUnrentedHK(1)
        setOpacityRentedVacant(1)
        setOpacityRentedOccupied(1)
        setOpacityRentedHK(1)
        setOpacityMalfunction(1)

        setBlokNumarasi(value)

        const selectedValue = event.target.value;

        // Eğer seçilen değer blokKatAlarmNumberData'nın anahtarlarından biri ise
        if (blokKatAlarmNumberData.hasOwnProperty(selectedValue)) {        
          // Kat hata sayımlarını hesapla
          const newKatErrorCounts = calculateKatErrorCounts(blokKatAlarmNumberData, selectedValue);        
          // Kat hata sayımlarını state ile güncelle
          setKatErrorCounts(newKatErrorCounts);
        } 

    };
    const handleCategoryKatChange = (event) => {
        console.log("handleCategoryKatChange", event.target)
        const {
            target: { value },
          } = event;

        setCategoryKatName(value);

        setOpacityUnrentedVacant(1)
        setOpacityUnrentedHK(1)
        setOpacityRentedVacant(1)
        setOpacityRentedOccupied(1)
        setOpacityRentedHK(1)
        setOpacityMalfunction(1)

        setKatNumarasi(value)
    };
        
    // Light, HVAC HK checkbox change
    const handleLightingCheckboxChange = (event) => {
        setIsLightingVisible(event.target.checked); // Checkbox durumuna göre setIsLightingVisible() çağrılır
        console.log("handleLightingCheckboxChange", event.target.checked)
    };

    const handleHVACCheckboxChange = (event) => {
        setIsHVACVisible(event.target.checked); // Checkbox durumuna göre setIsLightingVisible() çağrılır
    };

    const handleHKCheckboxChange = (event) => {
        setIsHKVisible(event.target.checked); // Checkbox durumuna göre setIsLightingVisible() çağrılır
    };

    const checkRoomNumber = (term) => {
        const match = data.some(item => item.odaNumarasi === term);
        setIsMatchFound(match);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            console.log(searchTerm);
            checkRoomNumber(searchTerm);
        }
    };

    const handleSearchClick = () => {
        console.log(searchTerm);
        checkRoomNumber(searchTerm);
    };

    const setSearchTermFunction = (e) => { // TextField -> onChange
        setSearchTerm(e.target.value);
    };

    const handleClickUnrentedVacantFilter = () => {  
        // Opacity değerini toggle et
        const newOpacity = opacityUnrentedVacant === 1 ? OPACITY_VALUE : 1;
        setOpacityUnrentedVacant(newOpacity);

        // data listesini dolaşarak koşula göre additionalData'yı güncelle
        const updatedData = data.map((item, index) => {
            if (item.roomStatus.roomState === "0") {
                return {
                    ...additionalData[index],
                    opacity: newOpacity,
                };
            } else {
                return additionalData[index];
            }
        });
        setAdditionalData(updatedData);
    };


    const handleClickUnrentedHKFilter = () => {
        
        // Opacity değerini toggle et
        const newOpacity = opacityUnrentedHK === 1 ? OPACITY_VALUE : 1;
        setOpacityUnrentedHK(newOpacity);

        // data listesini dolaşarak koşula göre additionalData'yı güncelle
        const updatedData = data.map((item, index) => {
            if (item.roomStatus.roomState === "1") {
                return {
                    ...additionalData[index],
                    opacity: newOpacity,
                };
            } else {
                return additionalData[index];
            }
        });
        setAdditionalData(updatedData);
    };

    const handleClickRentedVacantFilter = () => {
        
        // Opacity değerini toggle et
        const newOpacity = opacityRentedVacant === 1 ? OPACITY_VALUE : 1;
        setOpacityRentedVacant(newOpacity);

        // data listesini dolaşarak koşula göre additionalData'yı güncelle
        const updatedData = data.map((item, index) => {
            if (item.roomStatus.roomState === "2") {
                return {
                    ...additionalData[index],
                    opacity: newOpacity,
                };
            } else {
                return additionalData[index];
            }
        });
        setAdditionalData(updatedData);
    };

    const handleClickRentedOccupiedFilter = () => {
        
        // Opacity değerini toggle et
        const newOpacity = opacityRentedOccupied === 1 ? OPACITY_VALUE : 1;
        setOpacityRentedOccupied(newOpacity);

        // data listesini dolaşarak koşula göre additionalData'yı güncelle
        const updatedData = data.map((item, index) => {
            if (item.roomStatus.roomState === "3") {
                return {
                    ...additionalData[index],
                    opacity: newOpacity,
                };
            } else {
                return additionalData[index];
            }
        });
        setAdditionalData(updatedData);
    };
    
    const handleClickRentedHKFilter = () => {
        
        // Opacity değerini toggle et
        const newOpacity = opacityRentedHK === 1 ? OPACITY_VALUE : 1;
        setOpacityRentedHK(newOpacity);

        // data listesini dolaşarak koşula göre additionalData'yı güncelle
        const updatedData = data.map((item, index) => {
            if (item.roomStatus.roomState === "4") {        
                return {
                    ...additionalData[index],
                    opacity: newOpacity,
                };
            } else {
                return additionalData[index];
            }
        });
        setAdditionalData(updatedData);
    };

    const handleClickMalfunctionFilter = () => {
        
        // Opacity değerini toggle et
        const newOpacity = opacityMalfunction === 1 ? OPACITY_VALUE : 1;
        setOpacityMalfunction(newOpacity);

        // data listesini dolaşarak koşula göre additionalData'yı güncelle
        const updatedData = data.map((item, index) => {
            if (item.roomStatus.roomState === "5" | item.roomStatus.roomState === "6" | item.roomStatus.roomState === "7" | item.roomStatus.roomState === "8") {
                return {
                    ...additionalData[index],
                    opacity: newOpacity,
                };
            } else {
                return additionalData[index];
            }
        });
        setAdditionalData(updatedData);
    };

    const handleCloseError = () => {
        setError(null);
    };

    const getRoomStatusDataFromDB = () => { // tridium verisinin okundugu kisim

        // json dosyasindan veri okuma
        /* const blokNumber = categoryBlokName.split('-')[1]; // 'Blok-1' -> '1'
        const katNumber = categoryKatName.split('-')[1]; // 'Kat-1' -> '1' */
        const blokNumber = categoryBlokName
        const katNumber = categoryKatName
    
        // tridiumBackend den veri okuma 
        const url = `http://127.0.0.1:8000/getRoomStatusData/${blokNumber}/${katNumber}/`;
        fetch(url)
            .then(res => {
            return res.json();
            })
            .then(roomStatusData => {
                if (roomStatusData) {
                    console.log("FROM DB roomStatusData", roomStatusData.roomStatusData)
                    console.log("FROM DB roomStateNumber", roomStatusData.roomStateNumber)
                    console.log("FROM DB isGenelMahal", roomStatusData.isGenelMahal)
                    const filteredData = roomStatusData.roomStatusData
                    setData(filteredData); // Set data to be used in the component
                    setRoomNumber(filteredData.length)
                    setAdditionalData((Array.from({ length: filteredData.length }, (_, index) => ({opacity: 1}))))
                    setRoomStateNumber(roomStatusData.roomStateNumber)
                    setIsGenelMahal(roomStatusData.isGenelMahal)
                }
            })
            .catch(error => {
                // Hata durumunda burada işlem yapabilirsiniz
                console.error("Veri alinamadi:", error);
        });

    };

    useEffect(() => { // room status

        setActiveLink('roomStatus');
        
        getRoomStatusDataFromDB();
        const intervalId = setInterval(getRoomStatusDataFromDB, 5000);

        return () => clearInterval(intervalId);
        
    }, [categoryBlokName, categoryKatName]);
    

    if (error) {
        return <ErrorAlert message={error} onClose={handleCloseError} />;
    }

    return (
        <div style={{ position: "relative", width: 'calc(100% - 200px)', height: '100%', margin: '0 100px' }}>
            <Grid container spacing={2} style={{ padding: '16px' }}>
                <Grid item sx={12} sm={12} md={12} lg={12}  style={{fontFamily: adminRoomStatusFontFamily, display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>
                    <Stack display="flex" flexDirection="row" flexWrap="wrap" gap={isSmallScreen ? 0 : 2}            
                        justifyContent="flex-start" alignItems="center">
                            {/* <img src={filterIcon} alt="Alarm Filter Icon" style={{ height: 'auto', width: '40px' }} /> */}
                        
                            {!adminRoomStatusHideLightingChechbox && (
                                <RoomStatusCheckBox checkboxName={adminRoomStatusLightingCheckboxText} onChange={handleLightingCheckboxChange} />
                            )}
                            {!adminRoomStatusHideHVACChechbox && (
                                <RoomStatusCheckBox checkboxName={adminRoomStatusHVACCheckboxText} onChange={handleHVACCheckboxChange} />
                            )}
                            {!adminRoomStatusHideHouseKeepingChechbox && (
                                <RoomStatusCheckBox checkboxName={adminRoomStatusHouseKeepingCheckboxText} onChange={handleHKCheckboxChange} />
                            )}
                            <CheckmarksFilterRoomStatus category={"Blok"} categoryNames={categoryNamesBlok} onChange={handleCategoryBlokChange} categoryName={categoryBlokName} width={350} blokKatAlarmNumberData={blokKatAlarmNumberData} katErrorCounts={katErrorCounts}/>
                            <CheckmarksFilterRoomStatus category={"Kat"} categoryNames={categoryNamesBlokKatMap[categoryBlokName]} onChange={handleCategoryKatChange} categoryName={categoryKatName} width={200} blokKatAlarmNumberData={blokKatAlarmNumberData} katErrorCounts={katErrorCounts}/>
                            <div style={{ marginLeft: '8px' }}>
                                <RoomStatusSearchField searchTerm={searchTerm} setSearchTermFunction={setSearchTermFunction} handleKeyDown={handleKeyDown} handleSearchClick={handleSearchClick} />
                            </div>
                            
                    </Stack>
                </Grid>
            </Grid>
  
            <Grid container spacing={1} style={{ padding: '16px', backgroundColor: adminRoomStatusBackgroundColor, borderRadius: "15px"}}>
                <Grid item sx={12} sm={12} md={12} lg={12} style={{ height: 'auto' }}>
                    <Stack display="flex" flexDirection="row" flexWrap="wrap" gap={isSmallScreen ? 0 : 2} justifyContent="center" alignItems="center" marginLeft={isSmallScreen ? "-30px" : 0} marginRight={isSmallScreen ? "-30px" : 0}>
                        {isMatchFound ? (
                            data.filter(item => item.odaNumarasi === searchTerm).map((item, index) => (
                                <ModalItem
                                    key={item.odaNumarasi}
                                    onClickHVAC={openHVACModal}
                                    onClickLighting={openLightingModal}
                                    onClickHK={openHKModal}
                                    number={item.odaNumarasi}
                                    roomStatus={item.roomStatus}
                                    isLigthingVisible={isLightingVisible}
                                    isHVACVisible={isHVACVisible}
                                    isHKVisible={isHKVisible}
                                    opacity={additionalData[index].opacity}
                                    roomStateErrorList = {item.roomStateErrorList}
                                />
                            ))
                        ) : (
                            data.map((item, index) => (
                                <ModalItem
                                    key={item.odaNumarasi}
                                    onClickHVAC={openHVACModal}
                                    onClickLighting={openLightingModal}
                                    onClickHK={openHKModal}
                                    number={item.odaNumarasi}
                                    roomStatus={item.roomStatus}
                                    isLigthingVisible={isLightingVisible}
                                    isHVACVisible={isHVACVisible}
                                    isHKVisible={isHKVisible}
                                    opacity={additionalData[index].opacity}
                                    roomStateErrorList = {item.roomStateErrorList}
                                />
                            ))
                        )}
                    </Stack>
                </Grid>

                <Grid item sx={12} sm={12} md={12} lg={12}>
                    <Stack display="flex" flexDirection="row" flexWrap="wrap" gap={isSmallScreen ? 0 : 2} justifyContent="left" alignItems="center" borderRadius="50px">
                        {/* <img src={filterIcon} alt="Alarm Filter Icon" style={{ height: 'auto', width: '40px' ,marginTop: -25}} /> Sağa kaydırmak için marginLeft ekledik */}
                        {isGenelMahal !== "1" && (
                            <>
                            <IconWithText iconSrc={greenadamvaliz} topTextLine={topTextLineRentedOccupied} bottomText={roomStateNumber[0]} roomNumber={roomNumber} opacity={opacityRentedOccupied} onClick={handleClickRentedOccupiedFilter} adminRoomStatusFontFamily={adminRoomStatusFontFamily}/>                 
                            <IconWithText iconSrc={greenhousekeeping} topTextLine={topTextLineRentedHK} bottomText={roomStateNumber[1]} roomNumber={roomNumber} opacity={opacityRentedHK} onClick={handleClickRentedHKFilter} adminRoomStatusFontFamily={adminRoomStatusFontFamily}/>  
                            <IconWithText iconSrc={greenvaliz} topTextLine={topTextLineRentedVacant} bottomText={roomStateNumber[2]} roomNumber={roomNumber} opacity={opacityRentedVacant} onClick={handleClickRentedVacantFilter} adminRoomStatusFontFamily={adminRoomStatusFontFamily}/>  
                            <IconWithText iconSrc={whitehousekeeping} topTextLine={topTextLineUnrentedHK} bottomText={roomStateNumber[3]} roomNumber={roomNumber} opacity={opacityUnrentedHK} onClick={handleClickUnrentedHKFilter} adminRoomStatusFontFamily={adminRoomStatusFontFamily}/>  
                            <IconWithText iconSrc={white} topTextLine={topTextLineUnrentedVacant} bottomText={roomStateNumber[4]} roomNumber={roomNumber} opacity={opacityUnrentedVacant} onClick={handleClickUnrentedVacantFilter} adminRoomStatusFontFamily={adminRoomStatusFontFamily}/>  
                            </>
                        )}
                        <IconWithText iconSrc={onlyRed} topTextLine={topTextLineMalfunctionAlarms} bottomText={roomStateNumber[5]} roomNumber={roomNumber} opacity={opacityMalfunction} onClick={handleClickMalfunctionFilter} adminRoomStatusFontFamily={adminRoomStatusFontFamily}/>  
                        <LogoComponent/>
                    </Stack>
                </Grid>
            </Grid>

        {/* HVAC modal */}
        <MekanikModal selectedHVACOda = {selectedHVACOda} show = {isHVACModalOpen} setShow = {setIsHVACModalOpen} blokNumarasi = {blokNumarasi} katNumarasi = {katNumarasi} onClickLighting = {openLightingModal}/>
        {/* Lighting modal */}
        <LightingModal selectedLightingOda = {selectedLightingOda} isLightingModalOpen = {isLightingModalOpen} setIsLightingModalOpen = {setIsLightingModalOpen} blokNumarasi = {blokNumarasi} katNumarasi = {katNumarasi} onClickHVAC={openHVACModal} />
        {/* HK modal */}
        <HKModal selectedHKOda = {selectedHKOda} show = {isHKModalOpen} setShow = {setIsHKModalOpen} blokNumarasi = {blokNumarasi} katNumarasi = {katNumarasi} roomNumberForHK = {roomNumberForHK}/>
      </div>
    );
}
export default RoomStatus;