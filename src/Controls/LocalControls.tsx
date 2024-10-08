import React, { useContext } from 'react';
import { View } from 'react-native';
import { ClientRoleType } from 'react-native-agora';
import { MaxUidConsumer } from '../Contexts/MaxUidContext';
import PropsContext, { Layout } from '../Contexts/PropsContext';
import styles from '../Style';
import EndCall from './Local/EndCall';
import FullScreen from './Local/FullScreen';
import LocalAudioMute from './Local/LocalAudioMute';
import LocalVideoMute from './Local/LocalVideoMute';
import SwitchCamera from './Local/SwitchCamera';
import Timer from './Local/Timer';
import RemoteControls from './RemoteControls';

interface ControlsPropsInterface {
  showButton?: boolean;
}

const Controls: React.FC<ControlsPropsInterface> = (props) => {
  const {styleProps, rtcProps} = useContext(PropsContext);
  const {localBtnContainer} = styleProps || {};
  const showButton = props.showButton !== undefined ? props.showButton : true;
  return (
    <>
      <View style={[styles.Controls, localBtnContainer as object]}>
        {rtcProps.role !== ClientRoleType.ClientRoleAudience && (
          <View style={{flexDirection: 'row', justifyContent:'space-between', flex: 1, alignContent: 'center'}}>
            <Timer />
            <View style={{  flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <LocalAudioMute />
            <LocalVideoMute />
            <SwitchCamera />
            <FullScreen />
            </View>
          </View>
        )}
        <EndCall />
      </View>
      {showButton ? (
        <MaxUidConsumer>
          {(users) => (
            <View
              style={{
                ...styles.Controls,
                bottom: styles.Controls.bottom + 70,
              }}>
              {rtcProps.layout !== Layout.Grid && (
                <RemoteControls user={users[0]} showRemoteSwap={false} />
              )}
            </View>
          )}
        </MaxUidConsumer>
      ) : (
        <></>
      )}
    </>
  );
};

export default Controls;
