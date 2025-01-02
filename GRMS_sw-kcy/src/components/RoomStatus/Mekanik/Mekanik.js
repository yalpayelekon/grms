import React, { useState, useEffect } from 'react';
import MekanikRoomCard from './MekanikRoomCard';
import MekanikModal from './MekanikModal';
import config from "../../../config/config.json"

function Mekanik({}) {

  const [bloklar, setBloklar] = useState([]);
  const [activeBlokNo, setActiveBlokNo] = useState(null);
  const [activeKatNo, setActiveKatNo] = useState(null);
  const [tridiumData, setTridiumData] = useState(null);
  // Modal Parameters
  const [show, setShow] = useState(false);
  const [selectedOda, setSelectedOda] = useState(null);

  useEffect(() => {

    setActiveBlokNo("1");
    setActiveKatNo("1");

    const fetchData = () => {
      const url = `${config.apiBaseUrl}${config.endpoints.getHVACDataForFrontend}`;
      fetch(url)
      .then(res => {
        return res.json();
      })
      .then(tridiumData => {
        // setTridiumData(tridiumData)
        // console.log("Mekanik done")
        // console.log("tridiumData", tridiumData)

        if (tridiumData && tridiumData.bloklar) {
          setBloklar(tridiumData.bloklar);
          // const initialBlok = tridiumData.bloklar[0];
          // setActiveBlokNo(initialBlok.blok_no);
          // setActiveKatNo(initialBlok.katlar[0].kat_no);
        }
      })
      .catch(error => {
        // Hata durumunda burada işlem yapabilirsiniz
        console.error("Veri alınamadı:", error);
      });
    };

    // İlk başlangıçta fetch işlemini yap
    fetchData();

    // Her 5 saniyede bir fetch işlemini tekrar et
    const intervalId = setInterval(fetchData, config.intervalTimes.getHVACDataForFrontend);
    //console.log("setInterval")
    
    // Bileşen unmount edildiğinde interval'i temizle
    return () => clearInterval(intervalId);

  }, []);

  const handleBlokChange = (blokNo) => {
    setActiveBlokNo(blokNo);
    const selectedBlok = bloklar.find(blok => blok.blok_no === blokNo);
    if (selectedBlok && selectedBlok.katlar.length > 0) {
      setActiveKatNo(selectedBlok.katlar[0].kat_no);
    }
  };

  const handleKatChange = (katNo) => {
    setActiveKatNo(katNo);
  };

  const handleShow = (oda) => {
    setSelectedOda(oda)
    setShow(true);
  };

  console.log()

  return (
    <div>
      <ul className="nav nav-tabs border justify-content-center">
        {bloklar.map((blok) => (
          <li key={blok.blok_no} className="nav-item">
            <button
              className={`nav-link ${activeBlokNo === blok.blok_no ? 'active' : ''}`}
              onClick={() => handleBlokChange(blok.blok_no)}
            >
              <span><strong>Blok {blok.blok_no}</strong> </span>
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginBottom: '10px' }}></div> 
      
      {bloklar.map((blok) => (
        blok.blok_no === activeBlokNo && (
          <div key={blok.blok_no}>
            <ul className="nav nav-tabs border justify-content-center">
              {blok.katlar.map((kat) => (
                <li key={kat.kat_no} className="nav-item">
                  <button
                    className={`nav-link ${activeKatNo === kat.kat_no ? 'active' : ''}`}
                    onClick={() => handleKatChange(kat.kat_no)}
                  >
                    <span><strong>Kat {kat.kat_no}</strong> </span>
                  </button>
                </li>
              ))}
            </ul>
            {blok.katlar.map((kat) => (
              kat.kat_no === activeKatNo && (
                <div className="tab-content mt-3 border" id="myTabContent">
                  <div className="row">
                    {kat.odalar.map((oda) => (
                      <MekanikRoomCard oda={oda} handleShow={handleShow}/>
                    ))}    
                  </div>
                <MekanikModal selectedOda = {selectedOda} show = {show} setShow = {setShow}/>
                </div>
              )
            ))}
          </div>
        )
      ))}
    </div>
  );

}

export default Mekanik;
