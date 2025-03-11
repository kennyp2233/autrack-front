import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import StaticHeader from '@/components/StaticHeader';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { theme: appTheme, toggleTheme, isDark } = useTheme();

    // Estados para preferencias
    const [notifications, setNotifications] = useState({
        email: true,
        push: true
    });
    const [currency, setCurrency] = useState('MXN');
    const [units, setUnits] = useState('km');
    const [themeMode, setThemeMode] = useState(isDark ? 'dark' : 'light');
    const [language, setLanguage] = useState('es');

    // Mostrar opciones
    const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
    const [showUnitsOptions, setShowUnitsOptions] = useState(false);
    const [showThemeOptions, setShowThemeOptions] = useState(false);
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);

    // Opciones disponibles
    const currencies = ['MXN', 'USD', 'EUR', 'CAD'];
    const unitOptions = ['km', 'mi'];
    const themeOptions = ['light', 'dark', 'system'];
    const languageOptions = [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'English' }
    ];

    // Formatear el nombre de las opciones
    const getThemeName = (value: string) => {
        switch (value) {
            case 'light': return 'Claro';
            case 'dark': return 'Oscuro';
            case 'system': return 'Sistema';
            default: return value;
        }
    };

    const getUnitName = (value: string) => {
        switch (value) {
            case 'km': return 'Kilómetros';
            case 'mi': return 'Millas';
            default: return value;
        }
    };

    const getCurrencyName = (value: string) => {
        switch (value) {
            case 'MXN': return 'Peso Mexicano (MXN)';
            case 'USD': return 'Dólar Estadounidense (USD)';
            case 'EUR': return 'Euro (EUR)';
            case 'CAD': return 'Dólar Canadiense (CAD)';
            default: return value;
        }
    };

    // Manejar cierre de sesión
    const handleLogout = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que deseas cerrar la sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar sesión', style: 'destructive', onPress: logout }
            ]
        );
    };

    // Manejar borrado de cuenta
    const handleDeleteAccount = () => {
        Alert.alert(
            'Eliminar cuenta',
            '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar cuenta',
                    style: 'destructive',
                    onPress: () => {
                        // Aquí iría la lógica para eliminar la cuenta
                        Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente');
                        logout();
                    }
                }
            ]
        );
    };

    // Manejar cambio de tema
    const handleThemeChange = (newTheme: string) => {
        setThemeMode(newTheme);
        setShowThemeOptions(false);

        // Si el tema actual no coincide con el seleccionado, cambiar el tema de la app
        if ((newTheme === 'dark' && !isDark) || (newTheme === 'light' && isDark)) {
            toggleTheme();
        }
        // Para el tema 'system', podríamos añadir lógica para seguir el tema del sistema
    };

    return (
        <View style={[styles.container, { backgroundColor: appTheme.background }]}>
            {/* Static Header */}
            <StaticHeader
                title="Configuración"
                showBackButton={false}
                theme={appTheme}
            />

            <ScrollView style={styles.content}>
                {/* Profile Section */}
                <View style={[styles.section, { backgroundColor: appTheme.card }]}>
                    <Text style={[styles.sectionTitle, { color: appTheme.secondaryText }]}>Perfil</Text>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => router.push('/profile')}
                    >
                        <View style={styles.profileInfo}>
                            <View style={[styles.avatar, { backgroundColor: appTheme.primary }]}>
                                <Text style={[styles.avatarText, { color: appTheme.navbarText }]}>
                                    {user?.fullName?.charAt(0) || 'U'}
                                </Text>
                            </View>
                            <View>
                                <Text style={[styles.profileName, { color: appTheme.text }]}>
                                    {user?.fullName || 'Usuario'}
                                </Text>
                                <Text style={[styles.profileEmail, { color: appTheme.secondaryText }]}>
                                    {user?.email || 'usuario@ejemplo.com'}
                                </Text>
                            </View>
                        </View>
                        <Feather name="chevron-right" size={20} color={appTheme.secondaryText} />
                    </TouchableOpacity>
                </View>

                {/* Notifications Section */}
                <View style={[styles.section, { backgroundColor: appTheme.card }]}>
                    <Text style={[styles.sectionTitle, { color: appTheme.secondaryText }]}>Notificaciones</Text>
                    <View style={[styles.settingItem, { borderTopColor: appTheme.border }]}>
                        <Text style={[styles.settingLabel, { color: appTheme.text }]}>Correo electrónico</Text>
                        <Switch
                            value={notifications.email}
                            onValueChange={(value) => setNotifications({ ...notifications, email: value })}
                            trackColor={{ false: '#767577', true: appTheme.tabBarActive }}
                            thumbColor={notifications.email ? appTheme.primary : '#f4f3f4'}
                        />
                    </View>
                    <View style={[styles.settingItem, { borderTopColor: appTheme.border }]}>
                        <Text style={[styles.settingLabel, { color: appTheme.text }]}>Push</Text>
                        <Switch
                            value={notifications.push}
                            onValueChange={(value) => setNotifications({ ...notifications, push: value })}
                            trackColor={{ false: '#767577', true: appTheme.tabBarActive }}
                            thumbColor={notifications.push ? appTheme.primary : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={[styles.section, { backgroundColor: appTheme.card }]}>
                    <Text style={[styles.sectionTitle, { color: appTheme.secondaryText }]}>Preferencias</Text>

                    {/* Currency */}
                    <View>
                        <TouchableOpacity
                            style={[styles.settingItem, { borderTopColor: appTheme.border }]}
                            onPress={() => setShowCurrencyOptions(!showCurrencyOptions)}
                        >
                            <Text style={[styles.settingLabel, { color: appTheme.text }]}>Moneda</Text>
                            <View style={styles.settingValue}>
                                <Text style={{ color: appTheme.text }}>{getCurrencyName(currency)}</Text>
                                <Feather
                                    name={showCurrencyOptions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color={appTheme.secondaryText}
                                    style={{ marginLeft: 4 }}
                                />
                            </View>
                        </TouchableOpacity>
                        {showCurrencyOptions && (
                            <View style={[styles.optionsContainer, { borderTopColor: appTheme.border }]}>
                                {currencies.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.option,
                                            { borderTopColor: appTheme.border },
                                            currency === option && [
                                                styles.selectedOption,
                                                { backgroundColor: isDark ? appTheme.card : '#f0f9ff' }
                                            ]
                                        ]}
                                        onPress={() => {
                                            setCurrency(option);
                                            setShowCurrencyOptions(false);
                                        }}
                                    >
                                        <Text style={{ color: appTheme.text }}>{getCurrencyName(option)}</Text>
                                        {currency === option && (
                                            <Feather name="check" size={16} color={appTheme.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Units */}
                    <View>
                        <TouchableOpacity
                            style={[styles.settingItem, { borderTopColor: appTheme.border }]}
                            onPress={() => setShowUnitsOptions(!showUnitsOptions)}
                        >
                            <Text style={[styles.settingLabel, { color: appTheme.text }]}>Unidad de kilometraje</Text>
                            <View style={styles.settingValue}>
                                <Text style={{ color: appTheme.text }}>{getUnitName(units)}</Text>
                                <Feather
                                    name={showUnitsOptions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color={appTheme.secondaryText}
                                    style={{ marginLeft: 4 }}
                                />
                            </View>
                        </TouchableOpacity>
                        {showUnitsOptions && (
                            <View style={[styles.optionsContainer, { borderTopColor: appTheme.border }]}>
                                {unitOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.option,
                                            { borderTopColor: appTheme.border },
                                            units === option && [
                                                styles.selectedOption,
                                                { backgroundColor: isDark ? appTheme.card : '#f0f9ff' }
                                            ]
                                        ]}
                                        onPress={() => {
                                            setUnits(option);
                                            setShowUnitsOptions(false);
                                        }}
                                    >
                                        <Text style={{ color: appTheme.text }}>{getUnitName(option)}</Text>
                                        {units === option && (
                                            <Feather name="check" size={16} color={appTheme.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Theme */}
                    <View>
                        <TouchableOpacity
                            style={[styles.settingItem, { borderTopColor: appTheme.border }]}
                            onPress={() => setShowThemeOptions(!showThemeOptions)}
                        >
                            <Text style={[styles.settingLabel, { color: appTheme.text }]}>Tema</Text>
                            <View style={styles.settingValue}>
                                <Text style={{ color: appTheme.text }}>{getThemeName(themeMode)}</Text>
                                <Feather
                                    name={showThemeOptions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color={appTheme.secondaryText}
                                    style={{ marginLeft: 4 }}
                                />
                            </View>
                        </TouchableOpacity>
                        {showThemeOptions && (
                            <View style={[styles.optionsContainer, { borderTopColor: appTheme.border }]}>
                                {themeOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.option,
                                            { borderTopColor: appTheme.border },
                                            themeMode === option && [
                                                styles.selectedOption,
                                                { backgroundColor: isDark ? appTheme.card : '#f0f9ff' }
                                            ]
                                        ]}
                                        onPress={() => handleThemeChange(option)}
                                    >
                                        <Text style={{ color: appTheme.text }}>{getThemeName(option)}</Text>
                                        {themeMode === option && (
                                            <Feather name="check" size={16} color={appTheme.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Language */}
                    <View>
                        <TouchableOpacity
                            style={[styles.settingItem, { borderTopColor: appTheme.border }]}
                            onPress={() => setShowLanguageOptions(!showLanguageOptions)}
                        >
                            <Text style={[styles.settingLabel, { color: appTheme.text }]}>Idioma</Text>
                            <View style={styles.settingValue}>
                                <Text style={{ color: appTheme.text }}>
                                    {languageOptions.find(opt => opt.code === language)?.name || language}
                                </Text>
                                <Feather
                                    name={showLanguageOptions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color={appTheme.secondaryText}
                                    style={{ marginLeft: 4 }}
                                />
                            </View>
                        </TouchableOpacity>
                        {showLanguageOptions && (
                            <View style={[styles.optionsContainer, { borderTopColor: appTheme.border }]}>
                                {languageOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.code}
                                        style={[
                                            styles.option,
                                            { borderTopColor: appTheme.border },
                                            language === option.code && [
                                                styles.selectedOption,
                                                { backgroundColor: isDark ? appTheme.card : '#f0f9ff' }
                                            ]
                                        ]}
                                        onPress={() => {
                                            setLanguage(option.code);
                                            setShowLanguageOptions(false);
                                        }}
                                    >
                                        <Text style={{ color: appTheme.text }}>{option.name}</Text>
                                        {language === option.code && (
                                            <Feather name="check" size={16} color={appTheme.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* Account Section */}
                <View style={[styles.section, { backgroundColor: appTheme.card }]}>
                    <Text style={[styles.sectionTitle, { color: appTheme.secondaryText }]}>Cuenta</Text>
                    <TouchableOpacity
                        style={[styles.logoutButton, { borderTopColor: appTheme.border }]}
                        onPress={handleLogout}
                    >
                        <Feather name="log-out" size={18} color={appTheme.secondaryText} />
                        <Text style={[styles.logoutButtonText, { color: appTheme.secondaryText }]}>Cerrar sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.deleteAccountButton, { borderTopColor: appTheme.border }]}
                        onPress={handleDeleteAccount}
                    >
                        <Feather name="trash-2" size={18} color="#EF4444" />
                        <Text style={styles.deleteAccountButtonText}>Eliminar cuenta</Text>
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View style={[styles.section, { backgroundColor: appTheme.card }]}>
                    <Text style={[styles.sectionTitle, { color: appTheme.secondaryText }]}>Acerca de</Text>
                    <TouchableOpacity style={[styles.aboutItem, { borderTopColor: appTheme.border }]}>
                        <Text style={[styles.aboutLabel, { color: appTheme.text }]}>Versión</Text>
                        <Text style={[styles.aboutValue, { color: appTheme.secondaryText }]}>1.0.0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.aboutItem, { borderTopColor: appTheme.border }]}>
                        <Text style={[styles.aboutLabel, { color: appTheme.text }]}>Términos y condiciones</Text>
                        <Feather name="chevron-right" size={16} color={appTheme.secondaryText} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.aboutItem, { borderTopColor: appTheme.border }]}>
                        <Text style={[styles.aboutLabel, { color: appTheme.text }]}>Política de privacidad</Text>
                        <Feather name="chevron-right" size={16} color={appTheme.secondaryText} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingTop: 16,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        padding: 16,
        paddingBottom: 8,
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 8,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileName: {
        fontWeight: 'bold',
    },
    profileEmail: {
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
    },
    settingLabel: {
        fontWeight: '500',
    },
    settingValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionsContainer: {
        borderTopWidth: 1,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingLeft: 32,
        borderTopWidth: 1,
    },
    selectedOption: {
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
    },
    logoutButtonText: {
        marginLeft: 12,
        fontWeight: '500',
    },
    deleteAccountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
    },
    deleteAccountButtonText: {
        marginLeft: 12,
        color: '#EF4444',
        fontWeight: '500',
    },
    aboutItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
    },
    aboutLabel: {
        fontWeight: '500',
    },
    aboutValue: {
    },
});