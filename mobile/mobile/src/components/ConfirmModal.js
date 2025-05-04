import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ConfirmModal({ visible, onConfirm, onCancel, berceauName }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Confirmation</Text>
                    <Text style={styles.message}>
                        Voulez-vous vraiment supprimer le "{berceauName}" et tous les bébés associés ?
                    </Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.confirmText}>Supprimer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
        color: '#4B0082',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: '#ccc',
        borderRadius: 30,
        width: '45%',
        alignItems: 'center',
    },
    cancelText: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    },
    confirmButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: '#FF69B4',
        borderRadius: 30,
        width: '45%',
        alignItems: 'center',
    },
    confirmText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
