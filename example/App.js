import React, {useState, useCallback} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Dojah from 'react-native-dojah';
import {
  check,
  requestMultiple,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

const App = () => {
  /**
   *  This is your app ID
   * (go to your dashboard at
   * https://dojah.io/dashboard
   * to create an app and retrieve it)
   */
  const appID = '6000604fb87ea60035ef41bb';

  /**
   *  This is your account public key
   *  (go to your dashboard at
   *  https://dojah.io/dashboard to
   *  retrieve it. You can also regenerate one)
   */
  const publicKey = 'test_pk_TO6a57RT0v5QyhZmhbuLG8nZI';

  /**
   *  This is the widget type you'd like to load
   *  (go to your dashboard at
   *  https://dojah.io/dashboard to enable different
   *  widget types)
   */
  const type = 'liveness';

  /**
   *  These are the configuration options
   *  available to you are:
   *  {debug: BOOL, pages: ARRAY[page: STRING, config: OBJECT]}
   *
   *  The config object is as defined below
   *
   *  NOTE: The otp and selfie options are only
   *  available to the `verification` widget
   */
  const config = {
    debug: true,
    pages: [
      {
        page: 'government-data',
        config: {
          bvn: true,
          nin: false,
          dl: false,
          mobile: false,
          otp: false,
          selfie: false,
        },
      },
      {page: 'selfie'},
      {page: 'id', config: {passport: false, dl: true}},
    ],
  };

  /**
   *  These are the user's data to verify, options
   *  available to you possible options are:
   *  {first_name: STRING, last_name: STRING, dob: DATE STRING}
   *
   *  NOTE: Passing all the values will automatically skip
   *  the user-data page (thus the commented out `last_name`)
   */
  const userData = {
    first_name: 'Chijioke',
    last_name: '', // 'Nna'
    dob: '2022-05-01',
  };

  /**
   *  These are the metadata options
   *  You can pass any values within the object
   */
  const metadata = {
    user_id: '121',
  };

  /**
   * @param {String} responseType
   * This method receives the type
   * The type can only be one of:
   * loading, begin, success, error, close
   * @param {String} data
   * This is the data from doja
   */
  const response = (responseType, data) => {
    console.log(responseType, data);
    if (responseType === 'success') {
    } else if (responseType === 'error') {
    } else if (responseType === 'close') {
    } else if (responseType === 'begin') {
    } else if (responseType === 'loading') {
    }
  };

  /**
   *  The `ViewStyle` of the outermost `View` wrapping the Dojah container
   *  defaults to {width: '100%', height: '100%'}
   */
  const outerContainerStyle = {width: '100%', height: '100%'};

  /**
   *  The `ViewStyle` of the `WebView` containing the Dojah connection
   *  This prop is passed to the WebView `style` prop
   */
  const style = {};

  /**
   *  The `ViewStyle` of the innermost `View` within the WebView
   *  This prop is passed to the WebView `containerStyle` prop
   */
  const innerContainerStyle = {};

  const [granted, setGranted] = useState(false);

  const requestPermission = useCallback(() => {
    check(PERMISSIONS.ANDROID.CAMERA || PERMISSIONS.IOS.CAMERA)
      .then((result) => {
        switch (result) {
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            setGranted(true);
            break;
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            openSettings().catch(() => console.warn('cannot open settings'));
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            makeRequest();
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            makeRequest();
            break;
        }
      })
      .catch((e) => {
        console.log('Error when checking for permissions', e);
      });
  }, [makeRequest]);

  const makeRequest = useCallback(() => {
    requestMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.IOS.CAMERA]).then(
      (statuses) => {
        console.log('ANDROID Camera', statuses[PERMISSIONS.ANDROID.CAMERA]);
        console.log('IOS Camera', statuses[PERMISSIONS.IOS.CAMERA]);
        setGranted(
          statuses[PERMISSIONS.ANDROID.CAMERA] === 'granted' ||
            statuses[PERMISSIONS.IOS.CAMERA] === 'granted',
        );
      },
    );
  }, []);

  if (
    !granted &&
    ['liveness', 'verification', 'identitfication'].includes(type)
  ) {
    const buttonStyle = {
      width: '50%',
      height: 100,
      marginTop: '50%',
      marginLeft: '25%',
      backgroundColor: 'blue',
      elevation: 10,
      justifyContent: 'center',
      borderRadius: 30,
    };

    const textStyle = {
      color: '#FFF',
      fontSize: 20,
      textAlign: 'center',
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={buttonStyle}
        onPress={requestPermission}>
        <Text style={textStyle}>Request Permissions</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Dojah
      appID={appID}
      publicKey={publicKey}
      type={type}
      userData={userData}
      metadata={metadata}
      config={config}
      response={response}
      outerContainerStyle={outerContainerStyle}
      style={style}
      innerContainerStyle={innerContainerStyle}
    />
  );
};

export default App;
