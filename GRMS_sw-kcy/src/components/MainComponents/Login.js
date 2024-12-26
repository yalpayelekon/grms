import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const Login = ({ handleLogin  }) => {

    // admin
    const adminLoginBackgroundColor = UISettingsData.adminLoginBackgroundColor;
    const adminLoginTitleText = UISettingsData.adminLoginTitleText;
    const adminLoginTitleFontSize = UISettingsData.adminLoginTitleFontSize;
    const adminLoginTitleFontColor = UISettingsData.adminLoginTitleFontColor;
    const adminLoginFontFamily = UISettingsData.adminLoginFontFamily;
    const adminLoginFontSize = UISettingsData.adminLoginFontSize;
    const adminLoginButtonLabel = UISettingsData.adminLoginButtonLabel;
    const adminLoginButtonColor = UISettingsData.adminLoginButtonColor;
    const adminUserNameText = UISettingsData.adminUserNameText;
    const adminPasswordText = UISettingsData.adminPasswordText;
    const adminLoginTextFieldTextColor = UISettingsData.adminLoginTextFieldTextColor;
    const adminLoginTextFieldBorderColor = UISettingsData.adminLoginTextFieldBorderColor;
    
    const commonTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
        borderColor: adminLoginTextFieldBorderColor,
        },
        '&:hover fieldset': {
        borderColor: adminLoginTextFieldBorderColor, 
        },
        '&.Mui-focused fieldset': {
        borderColor: adminLoginTextFieldBorderColor,
        },
    },
    '& .MuiInputLabel-root': {
        color: adminLoginTextFieldTextColor, 
    },
    };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Yönlendirme için useNavigate hook'u


  const handleLoginClick = () => {
    if (!username || !password) {
      alert("Kullanıcı adı ve şifre boş olamaz!");
      return;
    }

    // API'ye POST isteği gönder
    fetch("http://localhost:8000/login/", { // Backend URL'ini güncelleyin
      method: "POST",
      headers: {
        "Content-Type": "application/json", // JSON formatında veri gönderiyoruz
      },
      body: JSON.stringify({ username, password }), // JSON formatında kullanıcı adı ve şifreyi gönderiyoruz
    })
      .then((response) => response.json())  // Yanıtı JSON formatına çevir
      .then((data) => {
        if (data.message === true) {
          console.log("Giriş başarılı:", data);
          handleLogin(data)
          navigate('/home'); // Giriş başarılıysa /home sayfasına yönlendir
        } else {
          alert(data.message || 'Hatalı giriş'); // Hata mesajını backend'den alıyoruz
        }
      })
      .catch((error) => {
        console.error("Giriş isteği sırasında bir hata oluştu", error);
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
      });
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: adminLoginBackgroundColor,
        fontFamily: adminLoginFontFamily,
      }}
    >
      <Box sx={{ width: { xs: '100%', sm: 400 }, textAlign:"center"}}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            marginBottom: 2,
            fontFamily: adminLoginFontFamily,
            fontSize: adminLoginTitleFontSize,
            color: adminLoginTitleFontColor,
            whiteSpace: 'nowrap', 
          }}
        >
          {adminLoginTitleText}
        </Typography>
        
        {/* Kullanıcı Adı TextField */}
        <TextField
          label={adminUserNameText}
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Kullanıcı adını yönet
          InputProps={{
            style: {
              fontFamily: adminLoginFontFamily,
              fontSize: adminLoginFontSize,
              color: adminLoginTextFieldTextColor,
            },
          }}
          InputLabelProps={{
            style: {
              fontFamily: adminLoginFontFamily,
              fontSize: adminLoginFontSize,
              color: adminLoginTextFieldTextColor,
            },
          }}
          sx={commonTextFieldStyles}
        />
        
        {/* Şifre TextField */}
        <TextField
          label={adminPasswordText}
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Şifreyi yönet
          InputProps={{
            style: {
              fontFamily: adminLoginFontFamily,
              fontSize: adminLoginFontSize,
              color: adminLoginTextFieldTextColor,
            },
          }}
          InputLabelProps={{
            style: {
              fontFamily: adminLoginFontFamily,
              fontSize: adminLoginFontSize,
              color: adminLoginTextFieldTextColor,
            },
          }}
          sx={commonTextFieldStyles}
        />

        {/* Giriş Yap Butonu */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleLoginClick}
          sx={{
            marginTop: 2,
            backgroundColor: adminLoginButtonColor,
            fontFamily: adminLoginFontFamily,
            fontSize: adminLoginFontSize,
            boxShadow: 'none',
            ':hover': {
              backgroundColor: adminLoginButtonColor,
              boxShadow: 'none',
            },
            ':active': {
              backgroundColor: adminLoginButtonColor,
              boxShadow: 'none',
            },
          }}
        >
          {adminLoginButtonLabel}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
