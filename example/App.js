import React from 'react';
import Dojah from 'react-native-dojah';

const App = () => {
  /**
   *  This is your app ID
   * (go to your dashboard at
   * https://dojah.io/dashboard
   * to create an app and retrieve it)
   */
  const appID = '5f772c87d30341003e0c8523';

  /**
   *  This is your account public key
   *  (go to your dashboard at
   *  https://dojah.io/dashboard to
   *  retrieve it. You can also regenerate one)
   */
  const publicKey = 'test_pk_OvAQ5aAhwATSKPzOX5vB1Fbv8';

  /**
   *  This is the widget type you'd like to load
   *  (go to your dashboard at
   *  https://dojah.io/dashboard to enable different
   *  widget types)
   */
  const type = 'link';

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

  // The Doja library accepts 3 props and
  // initiliazes the doja widget and connect process
  return (
    <>
      <Dojah
        appID={appID}
        publicKey={publicKey}
        type={type}
        response={response}
        outerContainerStyle={outerContainerStyle}
        style={style}
        innerContainerStyle={innerContainerStyle}
      />
    </>
  );
};

export default App;
