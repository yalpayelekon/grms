import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

function CheckBoxFilter({ name, checkboxName, onChange }) {
    return (
        <FormControlLabel 
            control={<Checkbox name={name} defaultChecked onChange={onChange} sx={{'&:not(.Mui-checked)': {color: "#A8C5DA"}, '&.Mui-checked': {color: "#A8C5DA"}}} />} 
            label={<span style={{ color: 'white' ,  fontSize: 20, fontFamily: 'Poppins', marginLeft:-5}}>{checkboxName}</span>}
        />
    );
}

export default CheckBoxFilter;