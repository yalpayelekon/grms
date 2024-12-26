import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
// components
import NavBar from './components/MainComponents/Navbar.js';
import AnaSayfa from './components/AnaSayfa/AnaSayfa.js';
import Alarms from './components/Alarms/Alarms';
import Dashboard from './components/Dashboard/Dashboard';
import RoomStatus from './components/RoomStatus/RoomStatus';
import RoomServices from './components/RoomServices/RoomServices';
import Reports from './components/Reports/Reports';
import Login from './components/MainComponents/Login';

import UISettingsData from './jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

function App() {

  //admin
  const adminBackgroundColor = UISettingsData.adminAppBackgroundColor; // "#006400"
  const adminAppNavbar = UISettingsData.adminAppNavbar; // ["dashboard", "roomStatus", "alarms", "roomServices", ""]

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [dateData, setDateData] = useState({}); // date
  const [temperatureData, setTemperatureData] = useState({"temperature":25}); // temperature
  const [seaTemperatureData, setSeaTemperatureData] = useState({"seaTemperature":25}); // sea temperature
  const [weatherData, setWeatherData] = useState({}); // combined weather data
  const [roomServiceData, setRoomServiceData] = useState([]); // room service
  const [roomServiceAlarmNumber, setRoomServiceAlarmNumber] = useState(); // room service alarm number
  const [blokKatDelayedRoomServiceNumberData, setBlokKatDelayedRoomServiceNumberData] = useState(); // room service blok ve kata gore geciken service number
  const [activeLink, setActiveLink] = useState("home"); // Varsayılan olarak home aktif olsun

  const [serviceRequestData, setServiceRequestData] = useState(null); // dashboard service request data
  const [averageResponseTimeGauge, setAverageResponseTimeGauge] = useState(0); //  dashboard service request ve room services icin averageResponseTimeGauge
  const [averageResponseTime, setAverageResponseTime] = useState(0); // dashboard service request ve room services icin averageResponseTime
  const [averageServiceTimeGauge, setAverageServiceTimeGauge] = useState(0); //  dashboard service request ve room services icin averageServiceTimeGauge
  const [averageServiceTime, setAverageServiceTime] = useState(0); // dashboard service request ve room services icin averageServiceTime

  const [alarmStatustData, setAlarmStatustData] = useState(null); // dashboard alarm status data

  const [alarmsData, setAlarmsData] = useState([]); // navbar alarms
  const [totalAlarmsNumber, setTotalAlarmsNumber] = useState(); // navbar alarm numbers of alarms 
  const [blokKatAlarmNumberData, setBlokKatAlarmNumberData] = useState(); // bloklar ve katlarda ki alarm sayisini gosterir

  const getTemperatureData = () => { 
    const url = `http://localhost:8000/getTemperatureData/`;
    fetch(url)
        .then(res => {
        return res.json();
        })
        .then(temperatureData => {
            if (temperatureData) {
                console.log("FROM DB temperatureData", temperatureData)
                const temperature = temperatureData.temperature
                setTemperatureData({temperature})
            }
        })
        .catch(error => {
            // Hata durumunda burada işlem yapabilirsiniz
            console.error("getTemperatureData Veri alinamadi:", error);
    }); 
  };

  const getSeaTemperatureData = () => { 
    const url = `http://localhost:8000/getSeaTemperatureData/`;
    fetch(url)
        .then(res => {
        return res.json();
        })
        .then(seaTemperatureData => {
            if (seaTemperatureData) {
                console.log("FROM DB seaTemperatureData", seaTemperatureData)
                const seaTemperature = seaTemperatureData.seaTemperature
                setSeaTemperatureData({seaTemperature})
            }
        })
        .catch(error => {
            // Hata durumunda burada işlem yapabilirsiniz
            console.error("getTemperatureData Veri alinamadi:", error);
    }); 
  };

  const updateDateData = () => {
    const newDate = new Date();
    // Tarihi formatlama
    const formattedDate = newDate.toLocaleDateString('en-US', {
      month: 'long',   // Tam ay adı (July)
      day: 'numeric',  // Gün (25)
      year: 'numeric'  // Yıl (2024)
    });
    let hours = newDate.getHours();
    const minutes = newDate.getMinutes().toString().padStart(2, '0');
    let period = 'AM';

    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) {
        hours -= 12;
      }
    } else if (hours === 0) {
      hours = 12; // Gece yarısı 12 olarak ayarla
    }

    const formattedTime = `${hours}:${minutes} ${period}`;
    setDateData({ formattedDate, formattedTime });
  };

  const fetchRoomServiceData = () => {
    fetch("http://localhost:8000/getRoomServicesData")
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data && data.roomService) {
          // console.log("getRoomServicesData", data)
          console.log("getRoomServicesData.roomService", data.roomService)
          console.log("getRoomServicesData.roomServiceAlarmNumber", data.roomServiceAlarmNumber)
          console.log("getRoomServicesData.blokKatDelayedRoomServiceNumberData", data.blokKatDelayedRoomServiceNumberData)
          setRoomServiceData(data.roomService)  
          setRoomServiceAlarmNumber(data.roomServiceAlarmNumber)
          setBlokKatDelayedRoomServiceNumberData(data.blokKatDelayedRoomServiceNumberData)
      }
      })
      .catch(error => {
        console.error("Veri alinamadi:", error);
      });
  };

  const fetchDashboardServiceRequestData = () => {
    fetch("http://localhost:8000/getDashboardServiceRequestData")
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data && data.serviceRequest) {
          // console.log("getDashboardServiceRequestData", data)
          console.log("getDashboardServiceRequestData.serviceRequest", data.serviceRequest[0])
          setServiceRequestData(data.serviceRequest[0])
          // console.log("getDashboardServiceRequestData data.serviceRequest.averageResponceTime", data.serviceRequest[0].averageResponceTime)
          // averageResponceTime değerini al ve uygun formata dönüştür
          let average_responce_time = parseInt(data.serviceRequest[0].averageResponceTime) // dakika olarak gelen veri
          const responceTimeGaugeUpperLimit = data.serviceRequest[0].dashboardReqResponceTimeUpperLimit // dakika
          if (average_responce_time >= responceTimeGaugeUpperLimit) {
            average_responce_time = responceTimeGaugeUpperLimit
            setAverageResponseTime(average_responce_time);
          }
          else{
            setAverageResponseTime(average_responce_time);
          }
          const percent_request_time = average_responce_time/responceTimeGaugeUpperLimit // 0-1 arasina sikistir
          setAverageResponseTimeGauge(percent_request_time);

          let average_service_time = parseInt(data.serviceRequest[0].averageServiceTime) // dakika olarak gelen veri
          const serviceTimeGaugeUpperLimit = data.serviceRequest[0].dashboardServiceResponceTimeUpperLimit // dakika
          if (average_service_time >= serviceTimeGaugeUpperLimit) {
            average_service_time = serviceTimeGaugeUpperLimit
            setAverageServiceTime(average_service_time);
          }
          else{
            setAverageServiceTime(average_service_time);
          }
          const percent_service_time = average_service_time/serviceTimeGaugeUpperLimit // 0-1 arasina sikistir
          setAverageServiceTimeGauge(percent_service_time);
      }
      })
      .catch(error => {
        console.error("Veri alinamadi:", error);
      });
    };

  const fetchDashboardAlarmStatusData = () => {
    fetch("http://localhost:8000/getDashboardAlarmStatusData")
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data && data.alarmStatus) {
          // console.log("getDashboardAlarmStatusData", data)
          console.log("getDashboardAlarmStatusData.alarmStatus", data.alarmStatus)
          setAlarmStatustData(data.alarmStatus)
      }
      })
      .catch(error => {
        console.error("Veri alinamadi:", error);
      });
  };

  const fetchAlarmsData = () => {
    fetch("http://localhost:8000/getAlarmsData")
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data && data.alarms) {
          // console.log("getAlarmsData", data)
          console.log("getAlarmsData.alarms", data.alarms)
          console.log("getAlarmsData.totalAlarmsNumber", data.totalAlarmsNumber)
          console.log("getAlarmsData.blokKatAlarmNumberData", data.blokKatAlarmNumberData)
          setAlarmsData(data.alarms)  
          setTotalAlarmsNumber(data.totalAlarmsNumber)
          setBlokKatAlarmNumberData(data.blokKatAlarmNumberData)
      }
      })
      .catch(error => {
        console.error("Veri alinamadi:", error);
      });
  };
  useEffect(() => {

    // Date data
    updateDateData();
    const dateIntervalId = setInterval(updateDateData, 60000); 

    // Temperature data
    getTemperatureData();
    const temperatureIntervalId = setInterval(getTemperatureData, 3600000);  // 1 hours

    // Sea Temperature data
    getSeaTemperatureData();
    const seaTemperatureIntervalId = setInterval(getSeaTemperatureData, 3600000);  // 1 hours
    
    // room service data
    fetchRoomServiceData();
    const roomServiceIntervalId = setInterval(fetchRoomServiceData, 60000);    // kcy 5000 olsun
    
    // dashboard service request data
    fetchDashboardServiceRequestData();
    const dashboardServiceRequestIntervalId = setInterval(fetchDashboardServiceRequestData, 60000); // kcy 5000 olsun
    
    // dashboard alarm status data
    fetchDashboardAlarmStatusData();
    const dashboardAlarmStatusIntervalId = setInterval(fetchDashboardAlarmStatusData, 60000); // kcy 5000 olsun 

    // navbar alarms
    fetchAlarmsData();
    const alarmsIntervalId = setInterval(fetchAlarmsData, 60000); // kcy 5000 olsun 

    // Cleanup on unmount
    return () => {
        clearInterval(dateIntervalId);
        clearInterval(temperatureIntervalId);
        clearInterval(seaTemperatureIntervalId);
        clearInterval(roomServiceIntervalId);
        clearInterval(dashboardServiceRequestIntervalId);
        clearInterval(dashboardAlarmStatusIntervalId);
        clearInterval(alarmsIntervalId);
    };
  }, []);

  useEffect(() => {
    setWeatherData({
      ...temperatureData,
      ...seaTemperatureData
    });
  }, [temperatureData, seaTemperatureData]);

  // A utility function to check if a route is allowed
  const isRouteAllowed = (route) => {
    // Extract the route name from the path
    const routeName = route.split('/')[1]; // e.g., "/dashboard" becomes "dashboard"
    return adminAppNavbar.includes(routeName);
  };

  const [loading, setLoading] = useState(true); // Yükleniyor durumunu kontrol edeceğiz
  const [userData, setUserData] = useState({ 
    dashboardAccess: 'NONACCESS', 
    roomStatusAccess: 'NONACCESS', 
    roomServicesAccess: 'NONACCESS', 
    alarmsAccess: 'NONACCESS', 
    reportsAccess: 'NONACCESS',
    username:"", 
  }); // Default to 'NONACCESS'

useEffect(() => {
  const storedAuthStatus = localStorage.getItem('isAuthenticated');
  const storedUserData = JSON.parse(localStorage.getItem('userData'));

  if (storedAuthStatus === 'true') {
    setIsAuthenticated(true);
    setUserData(storedUserData || {
      dashboardAccess: 'NONACCESS',
      roomStatusAccess: 'NONACCESS',
      roomServicesAccess: 'NONACCESS',
      alarmsAccess: 'NONACCESS',
      reportsAccess: 'NONACCESS',
      username:"", 
    });
  } else {
    setIsAuthenticated(false);
    setUserData({ 
      dashboardAccess: 'NONACCESS', 
      roomStatusAccess: 'NONACCESS', 
      roomServicesAccess: 'NONACCESS', 
      alarmsAccess: 'NONACCESS', 
      reportsAccess: 'NONACCESS',
      username:"",  
    });
  }

  setLoading(false); // Set loading to false after authentication check
}, []);

const handleLogin = (inputUserData) => {
  console.log("handleLogin inputUserData", inputUserData);

  // Set userData with all access properties
  setUserData({ 
    dashboardAccess: inputUserData.dashboardAccess,
    roomStatusAccess: inputUserData.roomStatusAccess,
    roomServicesAccess: inputUserData.roomServicesAccess,
    alarmsAccess: inputUserData.alarmsAccess,
    reportsAccess: inputUserData.reportsAccess,
    username: inputUserData.username
  });

  setIsAuthenticated(true);
  localStorage.setItem('isAuthenticated', 'true');
  
  // Store the entire user data object in localStorage
  localStorage.setItem('userData', JSON.stringify(inputUserData));
};

const handleLogout = () => {
  setIsAuthenticated(false);
  localStorage.removeItem('isAuthenticated'); // Remove the stored authentication status on logout
  console.log("Çıkış yapıldı");
};

  if (loading) {
    return <div>Loading...</div>; // Yükleniyor ekranı
  }

  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login handleLogin={handleLogin} />} />
      <Route 
          path="/*" 
          element={
            isAuthenticated ? (
            <div style={{ backgroundColor: adminBackgroundColor, minHeight: window.innerHeight > 1200 ? '110vh' : '120vh', paddingTop: '10px' }}>
              <NavBar activeLink={activeLink} setActiveLink={setActiveLink} roomServiceAlarmNumber={roomServiceAlarmNumber} totalAlarmsNumber={totalAlarmsNumber} adminNavbar={adminAppNavbar} handleLogout={handleLogout} userData={userData}/>
              <Routes>
                <Route path="/home" element={<AnaSayfa weatherData={weatherData} dateData={dateData} setActiveLink={setActiveLink} blokKatAlarmNumberData={blokKatAlarmNumberData} fetchAlarmsData={fetchAlarmsData} blokKatDelayedRoomServiceNumberData={blokKatDelayedRoomServiceNumberData} fetchRoomServiceData={fetchRoomServiceData} username={userData.username}/>} />
                {isRouteAllowed("/dashboard") && userData.dashboardAccess === 'ACCESS' &&(
                  <Route path="/dashboard" element={<Dashboard weatherData={weatherData} dateData={dateData} setActiveLink={setActiveLink} averageResponseTimeGauge={averageResponseTimeGauge} averageResponseTime={averageResponseTime} averageServiceTimeGauge={averageServiceTimeGauge} averageServiceTime={averageServiceTime} serviceRequestData={serviceRequestData} fetchDashboardServiceRequestData={fetchDashboardServiceRequestData} alarmStatustData={alarmStatustData} fetchDashboardAlarmStatusData={fetchDashboardAlarmStatusData} alarmsAccessInfo={userData.alarmsAccess} username={userData.username}/>} />
                )}
                {isRouteAllowed("/roomStatus") && userData.roomStatusAccess === 'ACCESS' && (
                  <Route path="/roomStatus" element={<RoomStatus setActiveLink={setActiveLink} blokKatAlarmNumberData={blokKatAlarmNumberData}/>} />
                )}
                {isRouteAllowed("/alarms") && (
                  <Route path="/alarms" element={<Alarms weatherData={weatherData} dateData={dateData} setActiveLink={setActiveLink} alarmsData={alarmsData} fetchAlarmsData={fetchAlarmsData}/>} />
                )}
                {isRouteAllowed("/roomServices") && (
                  <Route path="/roomServices" element={<RoomServices weatherData={weatherData} dateData={dateData} setActiveLink={setActiveLink} roomServiceData={roomServiceData} fetchRoomServiceData={fetchRoomServiceData} averageResponseTimeGauge={averageResponseTimeGauge} averageResponseTime={averageResponseTime} averageServiceTimeGauge={averageServiceTimeGauge} averageServiceTime={averageServiceTime} serviceRequestData={serviceRequestData} fetchDashboardServiceRequestData={fetchDashboardServiceRequestData}/>} />
                )}
                {isRouteAllowed("/reports") && (
                  <Route path="/reports" element={<Reports weatherData={weatherData} dateData={dateData} setActiveLink={setActiveLink}/>} />
                )}
                {/* Geçersiz Rotayı Ana Sayfaya Yönlendir */}
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </div>  
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;