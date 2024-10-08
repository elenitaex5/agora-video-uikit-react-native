import React, { useContext } from 'react';
import { IRtcEngine } from 'react-native-agora';
import { LocalContext } from '../../Contexts/LocalUserContext';
import PropsContext, {
  ToggleState,
  UidInterface,
} from '../../Contexts/PropsContext';
import RtcContext, { DispatchType } from '../../Contexts/RtcContext';
import styles from '../../Style';
import BtnTemplate from '../BtnTemplate';

interface LocalVideoMuteProps {
  btnText?: string;
  variant?: 'outlined' | 'text';
}

const LocalVideoMute: React.FC<LocalVideoMuteProps> = (props) => {
  const {btnText = 'Video', variant = 'outlined'} = props;
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles, remoteBtnStyles} = styleProps || {};
  const {muteLocalVideo, unmuteLocalVideo} = localBtnStyles || {};
  const {muteRemoteVideo} = remoteBtnStyles || {};
  const {RtcEngine, dispatch} = useContext(RtcContext);
  const local = useContext(LocalContext);

  const customStyle = local.video === ToggleState.disabled && unmuteLocalVideo ? unmuteLocalVideo : muteLocalVideo;

  return (
    <BtnTemplate
      name={local.video === ToggleState.enabled ? 'videocam' : 'videocamOff'}
      btnText={btnText}
      style={{
        ...styles.localBtn,
        ...(variant === 'outlined'
          ? (customStyle as object)
          : (muteRemoteVideo as object)),
      }}
      onPress={() => muteVideo(local, dispatch, RtcEngine)}
    />
  );
};

export const muteVideo = async (
  local: UidInterface,
  dispatch: DispatchType,
  RtcEngine: IRtcEngine,
) => {
  const localState = local.video;
  // Don't do anything if it is in a transitional state
  if (
    localState === ToggleState.enabled ||
    localState === ToggleState.disabled
  ) {
    // Disable UI
    dispatch({
      type: 'LocalMuteVideo',
      value: [
        localState === ToggleState.enabled
          ? ToggleState.disabling
          : ToggleState.enabling,
      ],
    });

    try {
      await RtcEngine.muteLocalVideoStream(localState === ToggleState.enabled);
      // Enable UI
      dispatch({
        type: 'LocalMuteVideo',
        value: [
          localState === ToggleState.enabled
            ? ToggleState.disabled
            : ToggleState.enabled,
        ],
      });
    } catch (e) {
      console.error(e);
      dispatch({
        type: 'LocalMuteVideo',
        value: [localState],
      });
    }
  } else {
    console.log('LocalMuteVideo in transition', local, ToggleState);
  }
};

export default LocalVideoMute;
