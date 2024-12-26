import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

import staricon from '../../icons/dashboard/SleepScore/staricon.png';
import sleepscoreicon from '../../icons/dashboard/SleepScore/sleepscoreicon.png';

import UISettingsData from '../../jsonFiles/UISettingsData.json'; // JSON dosyasını import ettik

const SleepScore = () => {

  // admin
  const adminSleepScoreText = UISettingsData.adminSleepScoreText; // "Uykus Uykus Uykus"
  const adminSleepScoreFontSize = UISettingsData.adminSleepScoreFontSize; // 18
  const adminSleepScoreFontFamily = UISettingsData.adminSleepScoreFontFamily; // "Poppins"
  const adminSleepScoreStarIconSize = UISettingsData.adminSleepScoreStarIconSize; // 100

  const score_payda = 5;
  const [value, setValue] = useState(0);

  useEffect(() => {
    // JSON dosyasındaki sleepScore değerini okuma
    const sleepScore = 4.8;
    setValue(sleepScore);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 1,
        width: 220,
        height: 110,
      }}
    >
      {/* Sol tarafta yıldız */}
      <img
        src={staricon}
        alt="star icon"
        style={{
          width: adminSleepScoreStarIconSize,
          height: adminSleepScoreStarIconSize,
          marginRight: 10,
        }}
      />
  
      {/* Sağ tarafta alt alta sıralanan bileşenler */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column', // İçerik alt alta hizalanır
          alignItems: 'left',
          justifyContent: 'center',
        }}
      >
        {/* Yıldızlar (Rating Bileşeni) */}
        <Rating
          max={score_payda}
          name="text-feedback"
          value={value}
          readOnly
          precision={0.1}
          emptyIcon={<StarIcon style={{ opacity: 1 }} fontSize="inherit" />}
          sx={{
            '& .MuiRating-iconFilled': {
              color: '#FFD55B',
            },
            '& .MuiRating-iconHover': {
              color: '#FFD55B',
            },
          }}
        />
  
        {/* Sleepscoreicon ve değer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center', // İkon ve değer yatay hizalanır
            mt: 1, // Üstten margin
          }}
        >
          <img
            src={sleepscoreicon}
            alt="sleep score icon"
            style={{
              width: 30,
              height: 20,
              marginRight: 5,
              color: '#FFD55B',
            }}
          />
          <span
            style={{
              color: '#FFD55B',
              fontFamily: adminSleepScoreFontFamily,
              fontSize: adminSleepScoreFontSize,
            }}
          >
            {value}
          </span>
          <span
            style={{
              color: '#FFFFFF',
              fontFamily: adminSleepScoreFontFamily,
              fontSize: adminSleepScoreFontSize,
            }}
          >
            /{score_payda}
          </span>
        </Box>
  
        {/* adminSleepScoreText */}
        <span
          style={{
            color: '#FFFFFF',
            fontFamily: adminSleepScoreFontFamily,
            fontSize: adminSleepScoreFontSize,
            marginTop: 5,
            whiteSpace: 'nowrap', // Tek satır olmasını sağlar
          }}
        >
          {adminSleepScoreText}
        </span>
      </Box>
    </Box>
  );
  
};

export default SleepScore;
