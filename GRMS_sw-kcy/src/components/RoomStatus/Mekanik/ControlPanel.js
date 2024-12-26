// ModalContent.js
import React, { useState} from 'react';
import { Form, ButtonGroup, Button, Row, Col, ToggleButton, InputGroup } from 'react-bootstrap';
import { tridiumBackend2Fronend } from './mekanikDataConversion.js';

function ControlPanel({ selectedHVACOda, updateRoomData }) {

  const oda = selectedHVACOda.roomStatusHVACData

  const [onOf, setOnOf] = useState(tridiumBackend2Fronend["onOf"]["num2str"][oda.onOf]);
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
          fontFamily: "Poppins"
        }}
      >
        On Off:
      </Form.Label>
      </Col>
      <Col sm={3} className="d-flex justify-content-end">
        <ButtonGroup>
          <Button 
            style={{
              backgroundColor: onOf === tridiumBackend2Fronend["onOf"]["num2str"][1] ? '#49796B' : '#FFFFFF', 
              color: onOf === tridiumBackend2Fronend["onOf"]["num2str"][1] ? '#FFFFFF' : '#49796B', 
              borderColor: '#49796B', // Border color matching background color
              fontFamily: "Poppins",
              fontWeight: "bold",
              fontSize: "14px"
            }}
            onClick={() => handleOnOfChange(tridiumBackend2Fronend["onOf"]["num2str"][1])}>
            ON
          </Button>
          <Button 
            style={{
              backgroundColor: onOf === tridiumBackend2Fronend["onOf"]["num2str"][0] ? '#C75861' : '#FFFFFF', 
              color: onOf === tridiumBackend2Fronend["onOf"]["num2str"][0] ? '#FFFFFF' : '#C75861', 
              borderColor: '#C75861', // Border color matching background color
              fontFamily: "Poppins",
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
              fontFamily: "Poppins"
            }}
          >
            Set Point:
          </Form.Label>
          <InputGroup>
            <Form.Control 
              type="number"
              value={setPoint}
              onChange={handleSetTemperatureChange}
              style={{ width: '15px', borderColor: "#535356" }} 
            />
            <InputGroup.Text
              style={{
                backgroundColor: '#535356',  // Sets the background color to blue
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
                fontFamily: "Poppins"
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
              borderColor: "#535356"
            }}
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
                fontFamily: "Poppins"
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
                style={{
                  backgroundColor: mode === option
                    ? option === 'Heat'
                      ? '#E72636' // Kırmızı
                      : option === 'Cool'
                      ? '#027AD4' // Mavi
                      : '#535356' // Diğer modlar için varsayılan renk
                    : '#FFFFFF',
                  color: mode === option ? '#FFFFFF' : '#535356', 
                  borderColor: '#535356', // Border color matching background color
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
                fontFamily: "Poppins"
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
                style={{
                  backgroundColor: fanMode === option ? '#535356' : '#FFFFFF', 
                  color: fanMode === option ? '#FFFFFF' : '#535356', 
                  borderColor: '#535356', // Border color matching background color
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
          fontFamily: "Poppins"
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
          style={{ width: '15px', borderColor: "#535356" }} 
        />
        <InputGroup.Text
              style={{
                backgroundColor: '#535356',  // Sets the background color to blue
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
          fontFamily: "Poppins"
        }}
      >
        Lower/Upper Set Points:
      </Form.Label>
        </Col>
        <Col sm={6}>
          <InputGroup>
            <InputGroup.Text
              style={{
                backgroundColor: '#535356',  // Sets the background color to blue
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
            />
            <InputGroup.Text
              style={{
                backgroundColor: '#535356',  // Sets the background color to blue
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
                backgroundColor: '#535356',  // Sets the background color to blue
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
            />
            <InputGroup.Text
              style={{
                backgroundColor: '#535356',  // Sets the background color to blue
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
                fontFamily: "Poppins"
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
          style={{
            backgroundColor: keylockFunction === value ? '#535356' : '#FFFFFF', 
            color: keylockFunction === value ? '#FFFFFF' : '#535356', 
            borderColor: '#535356', // Border color matching background color
            fontFamily: "Poppins",
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
                fontFamily: "Poppins"
              }}
            >
             Door/Window Contact:
            </Form.Label>
  </Col>
  <Col sm={3} className="d-flex justify-content-end">
    <ButtonGroup>
      <Button 
        style={{
          backgroundColor: occupancyInput === tridiumBackend2Fronend["occupancyInput"]["num2str"][0] ? '#49796B' : '#FFFFFF', 
          color: occupancyInput === tridiumBackend2Fronend["occupancyInput"]["num2str"][0] ? '#FFFFFF' : '#49796B', 
          borderColor: '#49796B', // Border color matching background color
          fontFamily: "Poppins",
          fontWeight: "bold",
          fontSize: "14px"
        }}
        onClick={() => handleDoorWindowContactChange(tridiumBackend2Fronend["occupancyInput"]["num2str"]["0"])}>
        ON
      </Button>
      <Button 
        style={{
          backgroundColor: occupancyInput === tridiumBackend2Fronend["occupancyInput"]["num2str"][2] ? '#C75861' : '#FFFFFF', 
          color: occupancyInput === tridiumBackend2Fronend["occupancyInput"]["num2str"][2] ? '#FFFFFF' : '#C75861', 
          borderColor: '#C75861', // Border color matching background color
          fontFamily: "Poppins",
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
                fontFamily: "Poppins"
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
