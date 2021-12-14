import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';

/**
 * @param {String} appID Your dojah application ID, go to your dashboard at https://app.dojah.io/dashboard to retrieve it
 * @param {String} publicKey Your dojah public key, go to your dashboard at https://app.dojah.io/dashboard to retrieve it
 * @param {String} type The dojah widget type to load, go to your dashboard at https://app.dojah.io/dashboard to configure it
 * @param {func}   response callback called when a message is available:
 *                  first parameter is type of message: one of loading, begin, success, error, and close
 *                  second paramater is the data,
 * @param {StyleProp} outerContainerStyle The style of the outermost view
 * @param {StyleProp} style The style of the middle view
 * @param {StyleProp} innerContainerStyle The style of the innermost view
 */
const Dojah = ({
  appID,
  publicKey,
  type,
  response,
  outerContainerStyle,
  style,
  innerContainerStyle,
}) => {
  const {uri, defaultStyle, injectJavaScript} = Dojah.config;
  return (
    <View style={[defaultStyle, outerContainerStyle]}>
      <WebView
        originWhiteList={['*']}
        source={{
          baseUrl: 'https://widget.dojah.io',
          html: `
            <html>
              <head>
                <script type="application/javascript" src="${uri}"></script>
                <meta name="viewport" content="width=device-width">
              </head>
              <body>
              </body>
            </html>
          `,
        }}
        style={style}
        containerStyle={innerContainerStyle}
        onMessage={(e) => {
          const data = JSON.parse(e.nativeEvent.data);
          response(data.type, data);
        }}
        injectedJavaScript={injectJavaScript(appID, publicKey, type)}
        injectedJavaScriptBeforeContentLoadedForMainFrameOnly={true}
        javaScriptEnabled={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        cacheEnabled={false}
        mediaPlaybackRequiresUserAction={false}
        useWebkit={true}
        startInLoadingState={true}
      />
    </View>
  );
};

Dojah.config = {
  uri: 'https://widget.dojah.io/widget.js',
  defaultStyle: {
    width: '100%',
    height: '100%',
  },
  injectJavaScript: function (appID, publicKey, type) {
    return `
      const options = {
        app_id: "${appID}",
        p_key: "${publicKey}",
        type: "${type}",
        onSuccess: function (response) {
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'success', data: response}));
        },
        onError: function (err) {
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', data: err}));
        },
        onClose: function (err) {
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'close', data: err}));
        }
      };

      const connect = new window.Connect(options);
      connect.setup();
      connect.open();
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'loading'}));
      document.getElementsByTagName('iframe')[0].onload = function(){
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'begin'}));
      };
      true;
    `;
  },
};

Dojah.propTypes = {
  appID: PropTypes.string.isRequired,
  publicKey: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  response: PropTypes.func.isRequired,
};

export default Dojah;
