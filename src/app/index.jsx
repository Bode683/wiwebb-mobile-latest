import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const HomeScreen = () => {
    const router = useRouter();
    const { t, i18n } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('Home:homepage.welcome')}</Text>

            <Text style={styles.currentLang}>
                Current language: {i18n.language}
            </Text>

            <View style={styles.buttonContainer}>
                <Button
                    title={`Switch to ${t('common:language.french')}`}
                    onPress={() => i18n.changeLanguage('fr')}
                />

                <Button
                    title={`Switch to ${t('common:language.english')}`}
                    onPress={() => i18n.changeLanguage('en')}
                />

                <Button
                    title="Go to Welcome Page"
                    onPress={() => router.push('/(auth)/welcome')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    currentLang: {
        fontSize: 14,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    buttonContainer: {
        gap: 10,
        width: '100%',
        maxWidth: 300,
    },
});

export default HomeScreen;