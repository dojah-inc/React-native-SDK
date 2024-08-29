import React, {useEffect} from 'react';
import Dojah from 'react-native-dojah';

const App = () => {
  /**
   *  This is your app ID
   * (go to your dashboard at
   * https://dojah.io/dashboard
   * to create an app and retrieve it)
   */
  const appID = '';

  /**
   *  This is your account public key
   *  (go to your dashboard at
   *  https://dojah.io/dashboard to
   *  retrieve it. You can also regenerate one)
   */
  const publicKey = '';

  /**
   *  This is the widget type you'd like to load
   *  (go to your dashboard at
   *  https://dojah.io/dashboard to enable different
   *  widget types)
   */
  const type = 'custom';

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
    widget_id: '651eb3c61228c100401ac67e',
    pages: [],
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


  const govData = {
                  bvn: "",
                  nin: "",
                  dl: "",
                  mobile: ""
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
    console.log('Response:', responseType, JSON.stringify(data));
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

  useEffect(() => {
    Dojah.hydrate(appID, publicKey);
  }, [appID, publicKey]);

  return (
    <Dojah
      appID={appID}
      publicKey={publicKey}
      type={type}
      userData={userData}
      govData={govData}
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
