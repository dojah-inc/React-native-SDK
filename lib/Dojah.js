import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Platform,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  checkMultiple,
  requestMultiple,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

/**
 * @param {String} appID Your dojah application ID, go to your dashboard at https://app.dojah.io/dashboard to retrieve it
 * @param {String} publicKey Your dojah public key, go to your dashboard at https://app.dojah.io/dashboard to retrieve it
 * @param {String} type The dojah widget type to load, go to your dashboard at https://app.dojah.io/dashboard to configure it
 * @param {func}   response callback called when a message is available:
 *                  first parameter is type of message: one of loading, begin, success, error, and close
 *                  second paramater is the data,
 * @param {Object} config These are the configuration options available to you possible options are:
 *                  {debug: BOOL, otp: BOOL, selfie: BOOL}
 *                  NOTE: The otp and selfie options are only
 *                available to the `verification` widget
 * @param {Object} userData Pass in the user's data in the following keys: `first_name` for the first name,
 *                  `last_name` for the last name and `dob` for the date of birth
 * @param {Object} metadata Pass in any data you choose to tag the response when passed to you, this will be
 *                   returned to you in the `kyc_widget` webhook or passed as a parameter to the onSuccess function
 * @param {StyleProp} outerContainerStyle The style of the outermost view
 * @param {StyleProp} outerContainerStyle The style of the outermost view
 * @param {StyleProp} style The style of the middle view
 * @param {StyleProp} innerContainerStyle The style of the innermost view
 */
const PLATFORM_CAMERA =
  Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.CAMERA
    : PERMISSIONS.IOS.CAMERA;
const PLATFORM_LOCATION =
  Platform.OS === 'android'
    ? [
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]
    : PERMISSIONS.IOS.LOCATION_ALWAYS;
const Dojah = ({
  appID,
  publicKey,
  type,
  response,
  config,
  userData,
  metadata,
  outerContainerStyle,
  style,
  innerContainerStyle,
}) => {
  const {uri, defaultStyle, injectJavaScript} = Dojah.config;

  const [granted, setGranted] = useState({
    location: null,
    camera: null,
  });
  const [location, setLocation] = useState('');

  useEffect(() => {
    const pages = !config.pages ? [] : config.pages.map((page) => page.page);
    const needsCamera =
      ['liveness', 'verification'].includes(type) ||
      ['selfie', 'id', 'face-id'].includes(pages);
    const needsLocation = ['address'].includes(pages);
    if (needsCamera || needsLocation) {
      requestPermission(needsCamera, needsLocation);
    }
  }, [config.pages, requestPermission, type]);

  const log = (...args) => {
    __DEV__ && console.log(...args);
  };

  const requestPermission = useCallback(
    (needsCamera, needsLocation) => {
      const permissions = [
        needsCamera ? PLATFORM_CAMERA : null,
        needsLocation ? PLATFORM_LOCATION : null,
      ]
        .filter((perm) => !!perm)
        .flatMap((item) => item);

      checkMultiple(permissions)
        .then((statuses) => {
          let request = false;
          permissions.every((permission) => {
            const check =
              permission === PLATFORM_CAMERA ? 'camera' : 'location';

            switch (statuses[permission]) {
              case RESULTS.GRANTED:
                log('The permission is granted');
                setGranted({...granted, [check]: true});
                break;
              case RESULTS.UNAVAILABLE:
                log(
                  'This feature is not available (on this device / in this context)',
                );
                setGranted({...granted, [check]: false});
                return false;
              case RESULTS.BLOCKED:
                log('The permission is denied and not requestable anymore');
                openSettings().catch(() => log('We cannot open settings'));
                setGranted({...granted, [check]: false});
                return false;
              case RESULTS.DENIED:
                log(
                  'The permission has not been requested / is denied but requestable',
                );
                request = true;
                break;
              case RESULTS.LIMITED:
                log('The permission is limited: some actions are possible');
                request = true;
                break;
            }
          });

          if (request) {
            makeRequest(permissions);
          }
        })
        .catch((e) => {
          log('Error when checking for permissions', e);
        });
    },
    [granted, makeRequest],
  );

  const makeRequest = useCallback((permissions) => {
    log('Dojah Requesting:', permissions);

    requestMultiple(permissions).then((statuses) => {
      log('ANDROID Camera', statuses[PERMISSIONS.ANDROID.CAMERA]);
      log('IOS Camera', statuses[PERMISSIONS.IOS.CAMERA]);
      log(
        'ANDROID Location',
        statuses[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION],
      );
      log('IOS Location', statuses[PERMISSIONS.LOCATION_ALWAYS]);

      setGranted({
        camera:
          statuses[PERMISSIONS.ANDROID.CAMERA] === 'granted' ||
          statuses[PERMISSIONS.IOS.CAMERA] === 'granted',
        location:
          statuses[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION] ===
            'granted' || statuses[PERMISSIONS.LOCATION_ALWAYS] === 'granted',
      });
    });
  }, []);

  if (Object.values(granted).includes(null)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3977de" />
      </View>
    );
  }

  if (Object.values(granted).includes(false)) {
    return (
      <Text>
        You need to grant all necessary permissions. You denied the the
        following permissions{' '}
        {Object.keys(granted).map((permission) =>
          !granted[permission] ? permission : null,
        )}
      </Text>
    );
  }

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
        injectedJavaScript={injectJavaScript(
          appID,
          publicKey,
          type,
          config,
          userData,
          metadata,
          location,
        )}
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
  injectJavaScript: function (
    appID,
    publicKey,
    type,
    config,
    userData,
    metadata,
    location,
  ) {
    return `
      const options = {
        app_id: "${appID}",
        p_key: "${publicKey}",
        type: "${type}",
        config: JSON.parse("${config ? JSON.stringify(config) : null}"),
        user_data: JSON.parse("${userData ? JSON.stringify(userData) : null}"),
        metadata: JSON.parse("${metadata ? JSON.stringify(metadata) : null}"),
        _getLocation: function () {
          return JSON.parse(${JSON.stringify(location)});
        },
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

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

Dojah.propTypes = {
  appID: PropTypes.string.isRequired,
  publicKey: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  response: PropTypes.func.isRequired,
};

export default Dojah;
