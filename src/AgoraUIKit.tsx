/**
 * @module AgoraUIKit
 */
import React from 'react';
import { View } from 'react-native';
import LocalUserContext from './Contexts/LocalUserContext';
import {
  AgoraUIKitProps,
  Layout,
  PropsInterface,
  PropsProvider,
} from './Contexts/PropsContext';
import LocalControls from './Controls/LocalControls';
import PopUp from './Controls/Remote/RemoteMutePopUp';
import RtcConfigure from './RtcConfigure';
import RtmConfigure from './RtmConfigure';
import GridVideo from './Views/GridVideo';
import PinnedVideo from './Views/PinnedVideo';

/**
 * Agora UIKit component following the v3 props
 * @returns Renders the UIKit
 */
const AgoraUIKitv3: React.FC<PropsInterface> = (props) => {
  const {layout} = props.rtcProps;
  return (
    <PropsProvider value={props}>
      <View style={[containerStyle, props.styleProps?.UIKitContainer]}>
        <RtcConfigure key={props.rtcProps.channel}>
          <LocalUserContext>
            {props.rtcProps.disableRtm ? (
              <>
                {layout === Layout.Grid ? <GridVideo /> : <PinnedVideo />}
                <LocalControls />
              </>
            ) : (
              <RtmConfigure>
                {layout === Layout.Grid ? <GridVideo /> : <PinnedVideo />}
                <LocalControls />
                <PopUp />
              </RtmConfigure>
            )}
          </LocalUserContext>
        </RtcConfigure>
      </View>
    </PropsProvider>
  );
};

/**
 * Agora UIKit component
 * @returns Renders the UIKit
 */
const AgoraUIKit: React.FC<AgoraUIKitProps> = (props) => {
  const {rtcUid, rtcToken, rtmToken, rtmUid, ...restConnectonData} =
    props.connectionData;
  const adaptedProps: PropsInterface = {
    rtcProps: {
      uid: rtcUid,
      token: rtcToken,
      ...restConnectonData,
      ...props.settings,
      callActive: true,
    },
    rtmProps: {
      token: rtmToken,
      uid: rtmUid,
      ...restConnectonData,
      ...props.settings,
    },
  };

  return (
    <AgoraUIKitv3
      rtcProps={adaptedProps.rtcProps}
      rtmProps={adaptedProps.rtmProps}
      callbacks={props.rtcCallbacks}
      rtmCallbacks={props.rtmCallbacks}
      styleProps={props.styleProps}
      enableBlurBackground={props.connectionData.enableBlurBackground}
    />
  );
};

const containerStyle = {backgroundColor: '#000', flex: 1};

export default AgoraUIKit;
