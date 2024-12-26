import seaWaterIcon from '../../icons/tempDate/seaWater.png';
import locationIcon from '../../icons/tempDate/location.png';
import temperatureIcon from '../../icons/tempDate/temperature.png';

import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

export default function TemperatureDate({formattedDate, formattedTime, temperature, seaTemperature}) {

  // admin icon
  const adminTemperatureDateIconSize = UISettingsData.adminTemperatureDateIconSize || 32; // icon size
  // Admin
  const adminTemperatureDateFontFamily = UISettingsData.adminTemperatureDateFontFamily; // "Ariel"
  const adminTemperatureDateFontSize = UISettingsData.adminTemperatureDateFontSize; // 25
  const adminTemperatureDateKonum = UISettingsData.adminTemperatureDateKonum; // "Ankara"
  const adminTemperatureDateKonumColor = UISettingsData.adminTemperatureDateKonumColor; // "#FFC0CB"
  const adminTemperatureDateHideLocation = UISettingsData.adminTemperatureDateHideLocation; // false
  const adminTemperatureDateTimeDateColor = UISettingsData.adminTemperatureDateTimeDateColor; // "#FFC0CB"
  const adminTemperatureDateHideDateTime = UISettingsData.adminTemperatureDateHideDateTime; // false
  const adminTemperatureDateTemperatureColor = UISettingsData.adminTemperatureDateTemperatureColor; // "#FFC0CB"
  const adminTemperatureDateHideTemperature = UISettingsData.adminTemperatureDateHideTemperature; // false
  const adminTemperatureDateSeaTemperatureColor = UISettingsData.adminTemperatureDateSeaTemperatureColor; // "#FFC0CB"
  const adminTemperatureDateHideSeaTemperature = UISettingsData.adminTemperatureDateHideSeaTemperature; // true

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'right', // Saat ve tarih görünürse sağa yaslanacak
        fontSize: adminTemperatureDateFontSize,
        fontWeight: 'normal',
        letterSpacing: "0.5px", // Harf aralığı için kullanılan değer
        fontFamily: adminTemperatureDateFontFamily,
        justifyContent: 'flex-end', // Her zaman sağa yaslama
      }}
    >
      {/* Konum (Koşullu Gösterim) */}
      {!adminTemperatureDateHideLocation && (
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px', color: adminTemperatureDateKonumColor }}>
          <img src={locationIcon} alt="Location Icon" style={{ marginRight: '10px', height: adminTemperatureDateIconSize, width: adminTemperatureDateIconSize }} />
          {adminTemperatureDateKonum}
        </div>
      )}

      {/* Tarih ve Saat (Koşullu Gösterim) */}
      {!adminTemperatureDateHideDateTime && (
        <div style={{ marginRight: '20px', color: 'white', textAlign: 'center', color: adminTemperatureDateTimeDateColor }}>
          <span style={{ fontWeight: 600, display: 'block' }}>{formattedTime}</span>
          <span style={{ display: 'block', marginTop: '5px', whiteSpace: 'nowrap' }}>{formattedDate}</span>
        </div>
      )}

      {/* Sıcaklık ve Deniz Sıcaklığı */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        {!adminTemperatureDateHideTemperature && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', color: adminTemperatureDateTemperatureColor }}>
            <img
                src={temperatureIcon}
                alt="Temperature Icon"
                style={{ marginRight: '10px', height: adminTemperatureDateIconSize, width: adminTemperatureDateIconSize }}
            />
            {temperature}°C
            </div>
        )}
        {!adminTemperatureDateHideSeaTemperature && (
            <div style={{ display: 'flex', alignItems: 'center', color: adminTemperatureDateSeaTemperatureColor }}>
            <img
                src={seaWaterIcon}
                alt="Sea Water Icon"
                style={{ marginRight: '10px', height: adminTemperatureDateIconSize, width: adminTemperatureDateIconSize }}
            />
            {seaTemperature}°C
            </div>
        )}
      </div>
    </div>
  );
}
