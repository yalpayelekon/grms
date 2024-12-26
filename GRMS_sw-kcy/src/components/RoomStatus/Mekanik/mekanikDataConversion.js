const tridiumBackend2Fronend = {
    "onOf": 
    {
        "onOf": 'On-Off',
        "num2str": 
        {
            "0": 'Shutdown',
            "1": 'Enable',
        },
    },
    "roomTemperature": 
    {
        "roomTemperature": "Room Temperature",
    },
    "setPoint": 
    {
        "setPoint": "Set Point",
    },
    "mode": 
    {
        "mode": "Mode",
        "num2str": 
        {
            "0": 'Heat',
            "1": 'Cool',
            "2": 'Fan',
            "3": 'Auto'
        },
    },
    "fanMode":
    {
        "fanMode": "Fan Mode",
        "num2str": 
        {
            "1": 'Low',
            "2": 'Med',
            "3": 'High',
            "4": 'Auto'
        },
    }, 
    "confortTemperature": 
    {
        "confortTemperature": "Confort Temperature",
    },
    "lowerSetpoint": 
    {
        "lowerSetpoint": "Lower Set Point",
    },
    "upperSetpoint": 
    {
        "upperSetpoint": "Upper Set Point",
    },
    "keylockFunction": 
    {
        "keylockFunction": "Key Lock Function",
        "num2str": 
        {
            "0": 'No Lockout',
            "1": 'Lock all keys',
            "2": 'Lock the keys except Fan Speed and Temp Adjustment keys',
            "3": 'Lock the ON/OFF and Clock keys',
            "4": 'Lock the keys except ON/OFF key',
        },
    }, 
    "occupancyInput": 
    {
        "occupancyInput": "Occupancy Input",
        "num2str": 
        {
            "0": 'Aktif',
            "2": 'Pasif'
        },
        "str2num": 
        {
            "Aktif": '0',
            "Pasif": '2'
        },

    },
    "runningstatus": 
    {
        "runningstatus": "Running Status",
        "num2str": 
        {
            "0": 'Off',
            "1": 'Cooling',
            "2": 'Heating',
            "3": 'Ventilating',
            "4": 'Idle',
            "5": 'Frost Protecting',
            "6": 'Warning'
        },
    }

}    

export { tridiumBackend2Fronend };