import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
    DeviceEventEmitter, // android
    NativeModules,
    requireNativeComponent,
    View,
} from 'react-native';

var iface = {
    name: 'DocumentScanner',
    propTypes: {
      documentAnimation : PropTypes.bool,
      detectionCountBeforeCapture : PropTypes.number,
      enableTorch : PropTypes.bool,
      manualOnly: PropTypes.bool,
      overlayColor: PropTypes.string,
      contrast: PropTypes.number,
      brightness: PropTypes.number,
      noGrayScale: PropTypes.bool,
      ...View.propTypes // include the default view properties
    },
  };

const DocumentScanner = requireNativeComponent('DocumentScanner', iface);
const CameraManager = NativeModules.DocumentScannerManager || {};

class Scanner extends PureComponent{

  static defaultProps = {
    onPictureTaken: ()=>{},
    onProcessing: ()=>{},
    onDetectionCount: ()=>{}
  }

  componentWillMount(){
    const { onPictureTaken, onProcessing, onDetectionCount } = this.props;
    DeviceEventEmitter.addListener('onPictureTaken', onPictureTaken);
    DeviceEventEmitter.addListener('onProcessingChange', onProcessing);
    DeviceEventEmitter.addListener('onDetectionCount', onDetectionCount);
  }

  componentWillUnmount(){
    const { onPictureTaken, onProcessing, onDetectionCount } = this.props;
    DeviceEventEmitter.removeListener('onPictureTaken', onPictureTaken);
    DeviceEventEmitter.removeListener('onProcessingChange', onProcessing);
    DeviceEventEmitter.removeListener('onDetectionCount', onDetectionCount);
  }

  capture = ()=>{
    CameraManager.capture();
  }

  render() {
    return <DocumentScanner {...this.props} />;
  }
}

export default Scanner;
