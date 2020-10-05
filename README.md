# react-native-dojah

> https://github.com/cjayprime/react-native-dojah

[![NPM](https://img.shields.io/npm/v/react-native-dojah.svg)](https://www.npmjs.com/package/react-native-dojah) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```sh
npm install react-native-dojah --save
```

or with `yarn`

```sh
yarn add react-native-dojah
```

## Usage

```jsx
import React from 'react'
import Dojah from 'react-native-dojah'

const App = () => {
  /**
   *  This is your app ID
   * (go to your dashboard at
   * https://dojah.io/dashboard
   * to create an app and retrieve it)
   */
  const appID = "5f772c87d30341003e0c8523";
  /**
   *  This is your account public key
   *  (go to your dashboard at
   *  https://dojah.io/dashboard to
   *  retrieve it. You can also regenerate one)
   */
  const publicKey = "test_pk_OvAQ5aAhwATSKPzOX5vB1Fbv8";
  /**
   * @param {String} type
   * This method receives the type
   * The type can only be one of:
   * loading, begin, success, error, close
   * @param {String} data
   * This is the data from doja
   */
  const response = (type, data) => {
    console.log(type, data);
    if(type === 'success'){
    }else if(type === 'error'){
    }else if(type === 'close'){
    }else if(type === 'begin'){
    }else if(type === 'loading'){
    }
  }
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
    <Dojah
      response={response}
      appID={appID}
      publicKey={publicKey}
      outerContainerStyle={outerContainerStyle}
      style={style}
      innerContainerStyle={innerContainerStyle}
    />
  );
}

export default App

```

See the `example` folder for an implementation

## Deployment

**`REMEMBER TO CHANGE THE APP ID and PUBLIC KEY WHEN DEPLOYING TO A LIVE (PRODUCTION) ENVIRONMENT`**

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b feature/feature-name`
3. Commit your changes: `git commit -am 'Some commit message'`
4. Push to the branch: `git push origin feature/feature-name`
5. Submit a pull request 😉😉

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
