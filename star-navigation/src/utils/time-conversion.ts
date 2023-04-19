
// These utils are based on: https://greenbankobservatory.org/education/great-resources/lst-clock/

export const toLocalSiderealTime = (tDate: Date, longitude: number) => {
  const utSeconds = tDate.getUTCSeconds();
  const utMinutes = tDate.getUTCMinutes();
  const utHours = tDate.getUTCHours();
  const utDay = tDate.getUTCDate();
  const utMonth = tDate.getUTCMonth() + 1;
  const utYear = tDate.getUTCFullYear();
  const UT = utHours + utMinutes / 60 + utSeconds / 3600;
  return LM_Sidereal_Time(JulDay(utDay, utMonth, utYear, UT), longitude);
};

const LM_Sidereal_Time = (jd: number, longitude: number) => {
  const GMST = GM_Sidereal_Time(jd);
  const LMST = 24.0 * frac((GMST + longitude / 15.0) / 24.0);
  return LMST;
};

const GM_Sidereal_Time = (jd: number) => {
  const MJD = jd - 2400000.5;
  const MJD0 = Math.floor(MJD);
  const ut = (MJD - MJD0) * 24.0;
  const t_eph = (MJD0 - 51544.5) / 36525.0;
  return 6.697374558 + 1.0027379093 * ut + (8640184.812866 + (0.093104 - 0.0000062 * t_eph) * t_eph) * t_eph / 3600.0;
};

const JulDay = (date: number, month: number, year: number, UT: number) => {
  if (year < 1900) {
    year = year + 1900;
  }
  if (month <= 2) {
    month = month + 12;
    year = year - 1;
  }
  const B = -13;
  const JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + date + B - 1524.5 + UT / 24.0;
  return JD;
};

const frac = (X: number) => {
  X = X - Math.floor(X);
  if (X < 0) {
    X = X + 1.0;
  }
  return X;
};
