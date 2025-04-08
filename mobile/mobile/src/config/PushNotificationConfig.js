import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

PushNotification.configure({
    onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
    },
    requestPermissions: Platform.OS === 'ios',
});

// Crée un canal de notification (obligatoire sur Android)
PushNotification.createChannel(
    {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
    },
    (created) => console.log(`Channel created: ${created}`)
);
