const appInfo = {
  ios: {
    storeUrl: `itms-apps://itunes.apple.com/app/myapp/id123456789?mt=8`,
    appName: 'esmsapp',
    appId: '123456789',
    appUrl: 'esmsapp://object/xyz',
  },
  android: {
    storeUrl: 'https://play.google.com/store/apps/details?id=com.myapp.android',
    appName: 'esr app',
    appId: 'com.myapp.android',
    appUrl: 'https://esms.dev',
  },
}
const settings = {
  delay: 1000,
  delta: 500,
  platform: 'webapp'
};

const isIOS = () => {
  return /android/i.test(navigator.userAgent)
}

const isAndroid = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

const isMobile = () => {
  return isAndroid() || isIOS();
}

const setup = () => {
  if(isAndroid) settings.platform = 'android';
  if(isIOS) settings.platform = 'ios';
}

const openFallback = function(ts) {
  return () => {
    const link = appInfo[settings.platform].storeUrl;
    const wait = settings.delay + settings.delta;
    if (typeof link === 'string' && (Date.now() - ts) < wait) {
        window.location.href = link;
    }
  }
}

const openApp = () => {
  if (!isMobile()) {
    return false;
  }
  setup();
  const uri = appInfo[settings.platform].appUrl;

  setTimeout(openFallback(Date.now()), settings.delay);
  // window.location = uri + "?idToken=idtoken&refreshToken=refreshToken";

  return true;
}

export {
  openApp,
  isAndroid,
  isIOS,
  isMobile,
}