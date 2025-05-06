import React, { useState, useEffect,useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { Provider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../store/useAuthStore';
import { getNotificationsByParentId,deleteNotificationsByParentId } from '../../services/NotificationService';
import { ThemeContext } from '../../components/ThemeContext';

const formatDate = (dateObj) => {
    if (!dateObj) return '';
    if (typeof dateObj === 'string') {
        return dateObj;
    }
    if (typeof dateObj === 'object' && dateObj._seconds) {
        const milliseconds = dateObj._seconds * 1000;
        const date = new Date(milliseconds);
        const dateStr = date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const timeStr = date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${dateStr}, ${timeStr}`;
    }
    return '';
};

const NotificationItem = ({ item, isDarkMode }) => {
    const styles = getStyles(isDarkMode);
    return (
        <View style={styles.notificationCard}>
            <Text style={styles.notificationTitle}>{item.type}</Text>
            <Text style={styles.notificationBody}>{item.message}</Text>
            <Text style={styles.notificationDate}>
                {formatDate(item.date)}
            </Text>
        </View>
    );
};

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const scaleAnim = useState(new Animated.Value(1))[0];
    const navigation = useNavigation();
    const { user } = useAuthStore();
    const { isDarkMode } = useContext(ThemeContext);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (user?.id) {
                    const fetchedNotifications = await getNotificationsByParentId(user.id);
                    setNotifications(fetchedNotifications);
                }
            } catch (error) {
                //console.error('Erreur lors de la récupération des notifications:', error);
            }
        };

        fetchNotifications();
    }, [user]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const handleClearNotifications =async () => {
        setNotifications([]);
        try {
            await deleteNotificationsByParentId(user.id);
            console.log("Notifications supprimées avec succès !");
    } catch (error) {
            console.warn("Erreur suppression notifications (ignorée) :", error.message);
            }
    };

    const styles = getStyles(isDarkMode);

    return (
        <Provider>
            <View style={styles.container}>
                <StatusBar backgroundColor={isDarkMode ? '#121212' : '#FFF0F5'} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <Text style={styles.title}>🔔 Notifications</Text>

                {notifications.length === 0 ? (
                    <Text style={styles.emptyText}>Aucune notification trouvée</Text>
                ) : (
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item.id?.toString()}
                        renderItem={({ item }) => <NotificationItem item={item} isDarkMode={isDarkMode} />}
                        style={styles.list}
                    />
                )}

                {notifications.length > 0 && (
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={handleClearNotifications}
                        >
                            <Text style={styles.clearButtonText}>Tout effacer</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </Provider>
    );
};

const getStyles = (isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? '#121212' : '#FFF0F5',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: isDarkMode ? '#fff' : '#FF69B4',
        marginVertical: 10,
    },
    list: {
        flex: 1,
    },
    notificationCard: {
        backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
    notificationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: isDarkMode ? '#fff' : '#333',
    },
    notificationBody: {
        fontSize: 16,
        color: isDarkMode ? '#ccc' : '#666',
        marginTop: 5,
    },
    notificationDate: {
        fontSize: 14,
        color: isDarkMode ? '#999' : '#999',
        marginTop: 8,
        textAlign: 'right',
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        color: isDarkMode ? '#ccc' : '#999',
        marginTop: 50,
    },
    clearButton: {
        backgroundColor: '#FF69B4',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: "#4B0082",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default NotificationScreen;
