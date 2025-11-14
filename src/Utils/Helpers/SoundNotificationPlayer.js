import { Vibration } from 'react-native';

var Sound = require('react-native-sound');


Sound.setCategory('Playback');

export default class SoundNotificationPlayer {

    static alarmSong = undefined;
    static isPlayingWhile = false;

    static playAlarmSong(numberOfLoops) {
        if (SoundNotificationPlayer.alarmSong == undefined)
            SoundNotificationPlayer.alarmSong = new Sound('samsung_galaxy.mp3', Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    SoundNotificationPlayer.alarmSong = undefined;
                    SoundNotificationPlayer.isPlayingWhile = false
                    return;
                }

                if (numberOfLoops == undefined) {
                    SoundNotificationPlayer.isPlayingWhile = true;
                }
                // loaded successfully
                console.log('duration in seconds: ' + SoundNotificationPlayer.alarmSong?.getDuration() + 'number of channels: ' + SoundNotificationPlayer.alarmSong?.getNumberOfChannels());

                // Play the sound with an onEnd callback
                // Vibration.vibrate([0, 600, 400, 600, 400, 600], true);
                SoundNotificationPlayer.alarmSong?.setVolume(9)
                SoundNotificationPlayer.alarmSong?.setNumberOfLoops(numberOfLoops != undefined ? numberOfLoops : -1)
                SoundNotificationPlayer.alarmSong?.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            });

    }

    static stopAlarmSong(force) {
        if (SoundNotificationPlayer.alarmSong != undefined) {
            if (SoundNotificationPlayer.isPlayingWhile == true && force == undefined)
                return;
            // Vibration.cancel()
            SoundNotificationPlayer.alarmSong.stop();
            SoundNotificationPlayer.alarmSong = undefined;
            SoundNotificationPlayer.isPlayingWhile = false
        }
    }

}