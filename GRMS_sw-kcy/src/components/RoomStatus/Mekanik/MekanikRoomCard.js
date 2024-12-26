import React from 'react';
import { list_view_pixel_width } from '../CommonComponents/componentStyles.js';
import { tridiumBackend2Fronend } from './mekanikDataConversion.js';

const MekanikRoomCard = ({oda, handleShow }) => {

    // console.log("MekanikRoomCard")
    const hasError = oda.mekanik.some(m => m.comError === "1");
    // hasError true ise başlık rengini kırmızı yap, değilse yeşil yap
    const cardHeaderColor = hasError ? 'bg-danger' : 'bg-success';
    
    
    return (
      <div key={oda.odaNumarasi} className="col-md-3 mb-3" style={{ paddingLeft: '30px', paddingTop: '10px', paddingRight: '30px'}}>  
        <div className="card text-center" onClick={() => handleShow(oda)} style={{ cursor: 'pointer' }}>
          <div className={`card-header ${cardHeaderColor}`}> <span className={"text-white"}><strong>ODA {oda.odaNumarasi}</strong></span> </div>
            <ul className="list-group list-group-flush">
              {oda.mekanik.map((m) => (
                Object.entries(m).map(([key_, value], index2) => (
                  key_ !== "comError" &&
                    // <li key={index2} className={`list-group-item ${list_view_pixel_width}`}><strong>{tridiumBackend2Fronend[key_][key_]}:</strong> {value}</li>

                    <li key={index2} className={`list-group-item ${list_view_pixel_width}`}>
                      <strong>
                      {tridiumBackend2Fronend[key_][key_]}:
                      </strong>
                      { key_ === "onOf" ? " " + tridiumBackend2Fronend[key_]["num2str"][value] :
                        key_ === "roomTemperature" ? " "+ value + " °C" :
                        key_ === "setPoint" ? " "+ value + " °C" :
                        key_ === "mode" ? " " + tridiumBackend2Fronend[key_]["num2str"][value] :
                        key_ === "fanMode" ? " " + tridiumBackend2Fronend[key_]["num2str"][value] :
                        key_ === "confortTemperature" ? " "+ value + " °C" :
                        key_ === "lowerSetpoint" ? " "+ value + " °C" :
                        key_ === "upperSetpoint" ? " "+ value + " °C" :
                        key_ === "keylockFunction" ? " " + tridiumBackend2Fronend[key_]["num2str"][value] :
                        key_ === "occupancyInput" ? " " + tridiumBackend2Fronend[key_]["num2str"][value] :
                        key_ === "runningstatus" ? " " + tridiumBackend2Fronend[key_]["num2str"][value] :
                        " "+ value
                      }
                    </li>
                ))
              ))}
            </ul>
        </div>
      </div>
   
  );
};

export default MekanikRoomCard;