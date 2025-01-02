// ModalContent.js
import React, { useState} from 'react';
import { Form, ButtonGroup, Button, Row, Col, ToggleButton, InputGroup } from 'react-bootstrap';
import { tridiumBackend2Fronend } from './mekanikDataConversion.js';
import UISettingsData from '../../../assets/jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

function ControlPanel({ selectedHVACOda, updateRoomData }) {

  const adminControlPanelFontFamily = UISettingsData.adminControlPanelFontFamily || "Poppins";
  const adminControlPanelOnColor = UISettingsData.adminControlPanelOnColor || '#49796Bff';
  const adminControlPanelOffColor = UISettingsData.adminControlPanelOffColor || "#C75861ff";
  const adminControlPanelGeneralColor = UISettingsData.adminControlPanelGeneralColor || "#535356ff"
  const adminControlPanelHeatColor = UISettingsData.adminControlPanelHeatColor || "#E72636ff"
  const adminControlPanelCoolColor = UISettingsData.adminControlPanelCoolColor || "#027AD4ff"

  const oda = selectedHVACOda.roomStatusHVACData
  
  const [onOf, setOnOf] = useState(tridiumBackend2Fronend["onOf"]["num2str"][oda.onOf]);
  const [isEditable, setIsEditable] = useState(onOf === tridiumBackend2Fronend["onOf"]["num2str"][1]); // If "onOf" is 1 (on), set editable to true, otherwise false
  
  const [setPoint, setSetTemperature] = useState(oda.setPoint);
  const [roomTemperature, setRoomTemperature] = useState(oda.roomTemperature);
  const [mode, setMode] = useState(tridiumBackend2Fronend["mode"]["num2str"][oda.mode]);
  const [fanMode, setFanSpeed] = useState(tridiumBackend2Fronend["fanMode"]["num2str"][oda.fanMode]);
  const [confortTemperature, setConfortTemperature] = useState(oda.confortTemperature);
  const [lowerSetpoint, setMinSetLimit] = useState(oda.lowerSetpoint);
  const [upperSetpoint, setMaxSetLimit] = useState(oda.upperSetpoint);
  const [keylockFunction, setKeyLock] = useState(tridiumBackend2Fronend["keylockFunction"]["num2str"][oda.keylockFunction]);
  const [occupancyInput, setDoorWindowContact] = useState(tridiumBackend2Fronend["occupancyInput"]["num2str"][oda.occupancyInput]);
  const [runningstatus, setRunningstatus] = useState(tridiumBackend2Fronend["runningstatus"]["num2str"][oda.runningstatus]);
  const handleOnOfChange = (state) => {
    setOnOf(state);
    const data = tridiumBackend2Fronend["onOf"]["num2str"]
    const anahtar = Object.keys(data).find(key => data[key] === state);
    console.log("onOf state:",state)
    console.log("onOf anahtar:",anahtar)
    updateRoomData({ onOf: anahtar });
  };
  const handleSetTemperatureChange = (e) => {
    const temperature = e.target.value;
    setSetTemperature(temperature);
    console.log("setPoint state:",temperature)
    updateRoomData({ setPoint: temperature });
  };
  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    const data = tridiumBackend2Fronend["mode"]["num2str"]
    const anahtar = Object.keys(data).find(key => data[key] === selectedMode);
    console.log("mode state:",selectedMode)
    console.log("mode anahtar:",anahtar)
    updateRoomData({ mode: anahtar });
  };
  const handleFanSpeedChange = (selectedSpeed) => {
    setFanSpeed(selectedSpeed);
    const data = tridiumBackend2Fronend["fanMode"]["num2str"]
    const anahtar = Object.keys(data).find(key => data[key] === selectedSpeed);
    console.log("fanMode state:", selectedSpeed)
    console.log("fanMode anahtar:",anahtar)
    updateRoomData({ fanMode: anahtar });
  };
  
  const handleConfortTemperatureChange = (e) => {
    const newConfortTemp = e.target.value;
    setConfortTemperature(newConfortTemp);
    console.log("confortTemperature state:",newConfortTemp)
    updateRoomData({ confortTemperature: newConfortTemp });
  };

  const handleMinSetLimitChange = (e) => {
    const newMinSetLimit = e.target.value;
    setMinSetLimit(newMinSetLimit);
    console.log("lowerSetpoint state:",newMinSetLimit)
    updateRoomData({ lowerSetpoint: newMinSetLimit });
  };

  const handleMaxSetLimitChange = (e) => {
    const newMaxSetLimit = e.target.value;
    setMaxSetLimit(newMaxSetLimit);
    console.log("upperSetpoint state:",newMaxSetLimit)
    updateRoomData({ upperSetpoint: newMaxSetLimit });
  };
  
    const handleKeyLockChange = (selectedKeyLock) => {
    setKeyLock(selectedKeyLock);
    const data = tridiumBackend2Fronend["keylockFunction"]["num2str"]
    const anahtar = Object.keys(data).find(key => data[key] === selectedKeyLock);
    console.log("keylockFunction state:", selectedKeyLock)
    console.log("keylockFunction anahtar:",anahtar)
    updateRoomData({ keylockFunction: anahtar });
  };

  const handleDoorWindowContactChange = (state) => {
    setDoorWindowContact(state);
    const data = tridiumBackend2Fronend["occupancyInput"]["num2str"]
    const anahtar = Object.keys(data).find(key => data[key] === state);
    console.log("handleDoorWindowContactChange state:",state)
    console.log("handleDoorWindowContactChange anahtar:",anahtar)
    updateRoomData({ occupancyInput: anahtar });
  };
  
  return (
    <Form>
    <Row className="mb-3 align-items-center">
      <Col sm={9}>
      <Form.Label
        style={{
          fontWeight: '600',
          fontSize: '16px',
          fontFamily: adminControlPanelFontFamily
        }}
      >
        On Off:
      </Form.Label>
      </Col>
      <Col sm={3} className="d-flex justify-content-end">
        <ButtonGroup>
          <Button 
            style={{
              backgroundColor: onOf === tridiumBackend2Fronend["onOf"]["num2str"][1] ? adminControlPanelOnColor : '#FFFFFF', 
              color: onOf === tridiumBackend2Fronend["onOf"]["num2str"][1] ? '#FFFFFF' : adminControlPanelOnColor, 
              borderColor: adminControlPanelOnColor, // Border color matching background color
              fontFamily: adminControlPanelFontFamily,
              fontWeight: "bold",
              fontSize: "14px"
            }}
            onClick={() => handleOnOfChange(tridiumBackend2Fronend["onOf"]["num2str"][1])}>
            ON
          </Button>
          <Button 
            style={{
              backgroundColor: onOf === tridiumBackend2Fronend["onOf"]["num2str"][0] ? adminControlPanelOffColor : '#FFFFFF', 
              color: onOf === tridiumBackend2Fronend["onOf"]["num2str"][0] ? '#FFFFFF' : adminControlPanelOffColor, 
              borderColor: adminControlPanelOffColor, // Border color matching background color
              fontFamily: adminControlPanelFontFamily,
              fontWeight: "bold",
              fontSize: "14px"
            }}
            onClick={() => handleOnOfChange(tridiumBackend2Fronend["onOf"]["num2str"][0])}>
            OFF
          </Button>
        </ButtonGroup>
      </Col>
    </Row>

    <Row className="mb-3">
      <Col sm={6}>
        <Form.Group controlId="setTemperatureControl">
          <Form.Label
            style={{
              fontWeight: '600',
              fontSize: '16px',
              fontFamily: adminControlPanelFontFamily
            }}
          >
            Set Point:
          </Form.Label>
          <InputGroup>
            <Form.Control 
              type="number"
              value={setPoint}
              onChange={handleSetTemperatureChange}
              style={{ width: '15px', borderColor: adminControlPanelGeneralColor }}
              disabled={!isEditable} 
            />
            <InputGroup.Text
              style={{
                backgroundColor: adminControlPanelGeneralColor,  // Sets the background color to blue
                color: 'white',           // Sets the text color to white
                border: 'none',          // Optional: Removes the border
              }}
            >
              °C
            </InputGroup.Text>
          </InputGroup>          
        </Form.Group>
        
      </Col>

      <Col sm={6}>
        <Form.Group controlId="roomTemperatureControl">
          <Form.Label
              style={{
                fontWeight: '600',
                fontSize: '16px',
                fontFamily: adminControlPanelFontFamily
                
              }}
            >
              Room Temperature:
            </Form.Label>
          <Form.Control 
            type="text"
            readOnly 
            value={`${roomTemperature} °C`}
            style={{
              color: 'gray' , 
              pointerEvents: 'none',
              boxShadow: "none",
              borderColor: adminControlPanelGeneralColor
            }}
            disabled={true} 
          />
        </Form.Group>
      </Col>
    </Row>

    <Row className="mb-3">
      <Col sm={6}>
        <Form.Group>
        <Form.Label
              style={{
                fontWeight: '600',
                fontSize: '16px',
                fontFamily: adminControlPanelFontFamily
              }}
            >
              Mode:
            </Form.Label>
          <ButtonGroup>
            
            {['Heat', 'Cool', 'Fan', 'Auto'].map((option) => (
              <ToggleButton
                key={option}
                id={`mode-${option}`}
                type="radio"
                disabled={!isEditable} 
                style={{
                  backgroundColor: mode === option
                    ? option === 'Heat'
                      ? adminControlPanelHeatColor // Kırmızı
                      : option === 'Cool'
                      ? adminControlPanelCoolColor // Mavi
                      : adminControlPanelGeneralColor // Diğer modlar için varsayılan renk
                    : '#FFFFFF',
                  color: mode === option ? '#FFFFFF' : adminControlPanelGeneralColor, 
                  borderColor: adminControlPanelGeneralColor, // Border color matching background color
                  width: "56px"
                }}
                name="mode"
                value={option}
                checked={mode === option}
                onChange={(e) => handleModeChange(e.currentTarget.value)}
              >
                {option}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Form.Group>
      </Col>

      <Col sm={6}>
        <Form.Group>
          <Form.Label
              style={{
                fontWeight: '600',
                fontSize: '16px',
                fontFamily: adminControlPanelFontFamily
              }}
            >
              Fan Speed:
          </Form.Label>
          <ButtonGroup>
            {['Low', 'Med', 'High', 'Auto'].map((option) => (
              <ToggleButton
                key={option}
                id={`fanMode-${option}`}
                type="radio"
                disabled={!isEditable} 
                style={{
                  backgroundColor: fanMode === option ? adminControlPanelGeneralColor : '#FFFFFF', 
                  color: fanMode === option ? '#FFFFFF' : adminControlPanelGeneralColor, 
                  borderColor: adminControlPanelGeneralColor, // Border color matching background color
                  width: "56px"
                }}
                name="fanMode"
                value={option}
                checked={fanMode === option}
                onChange={(e) => handleFanSpeedChange(e.currentTarget.value)}
              >
                {option}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Form.Group>
      </Col>
    </Row>
  <Row className="mb-3 align-items-center">
    <Col sm={6}>
      <Form.Label
        style={{
          fontWeight: '600',
          fontSize: '16px',
          fontFamily: adminControlPanelFontFamily
        }}
      >
        Confort Temperature:
      </Form.Label>
    </Col>
    <Col sm={6}>
      <InputGroup>
        <Form.Control 
          type="number"
          value={confortTemperature}
          min="0"
          onChange={handleConfortTemperatureChange}
          style={{ width: '15px', borderColor: adminControlPanelGeneralColor }} 
          disabled={!isEditable} 
        />
        <InputGroup.Text
              style={{
                backgroundColor: adminControlPanelGeneralColor,  // Sets the background color to blue
                color: 'white',           // Sets the text color to white
                border: 'none',          // Optional: Removes the border
              }}
            >
              °C
            </InputGroup.Text>
      </InputGroup>
      </Col>
  </Row>
    <Row className="mb-3">
        <Col sm={14}>
          <Form.Label
        style={{
          fontWeight: '600',
          fontSize: '16px',
          fontFamily: adminControlPanelFontFamily
        }}
      >
        Lower/Upper Set Points:
      </Form.Label>
        </Col>
        <Col sm={6}>
          <InputGroup>
            <InputGroup.Text
              style={{
                backgroundColor: adminControlPanelGeneralColor,  // Sets the background color to blue
                color: 'white',           // Sets the text color to white
                border: 'none',          // Optional: Removes the border
              }}
            >
              Lower (0-36):
            </InputGroup.Text>
            <Form.Control 
              type="number"
              value={lowerSetpoint}
              min="0"
              max="36"
              onChange={handleMinSetLimitChange}
              disabled={!isEditable} 
            />
            <InputGroup.Text
              style={{
                backgroundColor: adminControlPanelGeneralColor,  // Sets the background color to blue
                color: 'white',           // Sets the text color to white
                border: 'none',          // Optional: Removes the border
              }}
            >
              °C
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col sm={6}>
          <InputGroup>
            <InputGroup.Text
              style={{
                backgroundColor: adminControlPanelGeneralColor,  // Sets the background color to blue
                color: 'white',           // Sets the text color to white
                border: 'none',          // Optional: Removes the border
              }}
            >
              Upper (2-37):
            </InputGroup.Text>
            
            <Form.Control 
              type="number"
              value={upperSetpoint}
              min="2"
              max="37"
              onChange={handleMaxSetLimitChange}
              disabled={!isEditable} 
            />
            <InputGroup.Text
              style={{
                backgroundColor: adminControlPanelGeneralColor,  // Sets the background color to blue
                color: 'white',           // Sets the text color to white
                border: 'none',          // Optional: Removes the border
              }}
            >
              °C
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      <Row className="mb-3">
  <Col xs={12}>
      <Form.Label
              style={{
                fontWeight: '600',
                fontSize: '16px',
                fontFamily: adminControlPanelFontFamily
              }}
            >
              Key Lock:
            </Form.Label>
    
    <ButtonGroup vertical className="w-100">
      {Object.entries(tridiumBackend2Fronend["keylockFunction"]["num2str"]).map(([key, value]) => (
        <ToggleButton
          key={value}
          id={`key-lock-${value}`}
          type="radio"
          disabled={!isEditable} 
          style={{
            backgroundColor: keylockFunction === value ? adminControlPanelGeneralColor : '#FFFFFF', 
            color: keylockFunction === value ? '#FFFFFF' : adminControlPanelGeneralColor, 
            borderColor: adminControlPanelGeneralColor, // Border color matching background color
            fontFamily: adminControlPanelFontFamily,
            fontSize: "14px"
          }}
          name="keylockFunction"
          value={value}
          checked={keylockFunction === value}
          onChange={(e) => handleKeyLockChange(e.currentTarget.value)}
          className="text-truncate mb-2" 
        >
          {value}
        </ToggleButton>
      ))}
    </ButtonGroup>
  </Col>
</Row>
<Row className="mb-3 align-items-center">
  <Col sm={9}>
    <Form.Label
              style={{
                fontWeight: '600',
                fontSize: '16px',
                fontFamily: adminControlPanelFontFamily
              }}
            >
             Door/Window Contact:
            </Form.Label>
  </Col>
  <Col sm={3} className="d-flex justify-content-end">
    <ButtonGroup>
      
      <Button 
      disabled={!isEditable} 
        style={{
          backgroundColor: occupancyInput === tridiumBackend2Fronend["occupancyInput"]["num2str"][0] ? adminControlPanelOnColor : '#FFFFFF', 
          color: occupancyInput === tridiumBackend2Fronend["occupancyInput"]["num2str"][0] ? '#FFFFFF' : adminControlPanelOnColor, 
          borderColor: adminControlPanelOnColor, // Border color matching background color
          fontFamily: adminControlPanelFontFamily,
          fontWeight: "bold",
          fontSize: "14px"
        }}
        onClick={() => handleDoorWindowContactChange(tridiumBackend2Fronend["occupancyInput"]["num2str"]["0"])}>
        ON
      </Button>
      <Button 
      disabled={!isEditable} 
        style={{
          backgroundColor: occupancyInput === tridiumBackend2Fronend["occupancyInput"]["num2str"][2] ? adminControlPanelOffColor : '#FFFFFF', 
          color: occupancyInput === tridiumBackend2Fronend["occupancyInput"]["num2str"][2] ? '#FFFFFF' : adminControlPanelOffColor, 
          borderColor: adminControlPanelOffColor, // Border color matching background color
          fontFamily: adminControlPanelFontFamily,
          fontWeight: "bold",
          fontSize: "14px"
        }}
        onClick={() => handleDoorWindowContactChange(tridiumBackend2Fronend["occupancyInput"]["num2str"]["2"])}>
        OFF
      </Button>
    </ButtonGroup>
  </Col>
</Row>
<Row className="mb-3 align-items-center">
  <Col sm={9}>
    <Form.Label
              style={{
                fontWeight: '600',
                fontSize: '16px',
                fontFamily: adminControlPanelFontFamily
              }}
            >
             Running Status: {`${runningstatus}`}
            </Form.Label>
  </Col>
  {/* <Col sm={3} className="d-flex justify-content-end">
      <Form.Group controlId="runningStatusControl">
        <Form.Control 
          type="text"
          readOnly 
          style={{ color: 'gray' , pointerEvents: 'none'}}
          value={`${runningstatus}`}
        />
      </Form.Group>
  </Col> */}
</Row>
    </Form>
  );
}

export default ControlPanel;
