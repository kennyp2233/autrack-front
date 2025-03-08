import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    // Estados para preferencias
    const [notifications, setNotifications] = useState({
        email: true,
        push: true
    });

    const [currency, setCurrency] = useState('MXN');
    const [units, setUnits] = useState('km');
    const [theme, setTheme] = useState('light');
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

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Configuración</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Profile Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Perfil</Text>

                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => router.push('/profile')}
                    >
                        <View style={styles.profileInfo}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {user?.fullName?.charAt(0) || 'U'}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.profileName}>{user?.fullName || 'Usuario'}</Text>
                                <Text style={styles.profileEmail}>{user?.email || 'usuario@ejemplo.com'}</Text>
                            </View>
                        </View>
                        <Feather name="chevron-right" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Notifications Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notificaciones</Text>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Correo electrónico</Text>
                        <Switch
                            value={notifications.email}
                            onValueChange={(value) => setNotifications({ ...notifications, email: value })}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Push</Text>
                        <Switch
                            value={notifications.push}
                            onValueChange={(value) => setNotifications({ ...notifications, push: value })}
                        />
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferencias</Text>

                    {/* Currency */}
                    <View>
                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => setShowCurrencyOptions(!showCurrencyOptions)}
                        >
                            <Text style={styles.settingLabel}>Moneda</Text>
                            <View style={styles.settingValue}>
                                <Text>{getCurrencyName(currency)}</Text>
                                <Feather
                                    name={showCurrencyOptions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color="#999"
                                    style={{ marginLeft: 4 }}
                                />
                            </View>
                        </TouchableOpacity>

                        {showCurrencyOptions && (
                            <View style={styles.optionsContainer}>
                                {currencies.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[styles.option, currency === option && styles.selectedOption]}
                                        onPress={() => {
                                            setCurrency(option);
                                            setShowCurrencyOptions(false);
                                        }}
                                    >
                                        <Text>{getCurrencyName(option)}</Text>
                                        {currency === option && (
                                            <Feather name="check" size={16} color="#3B82F6" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Units */}
                    <View>
                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => setShowUnitsOptions(!showUnitsOptions)}
                        >
                            <Text style={styles.settingLabel}>Unidad de kilometraje</Text>
                            <View style={styles.settingValue}>
                                <Text>{getUnitName(units)}</Text>
                                <Feather
                                    name={showUnitsOptions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color="#999"
                                    style={{ marginLeft: 4 }}
                                />
                            </View>
                        </TouchableOpacity>

                        {showUnitsOptions && (
                            <View style={styles.optionsContainer}>
                                {unitOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[styles.option, units === option && styles.selectedOption]}
                                        onPress={() => {
                                            setUnits(option);
                                            setShowUnitsOptions(false);
                                        }}
                                    >
                                        <Text>{getUnitName(option)}</Text>
                                        {units === option && (
                                            <Feather name="check" size={16} color="#3B82F6" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Theme */}
                    <View>
                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => setShowThemeOptions(!showThemeOptions)}
                        >
                            <Text style={styles.settingLabel}>Tema</Text>
                            <View style={styles.settingValue}>
                                <Text>{getThemeName(theme)}</Text>
                                <Feather
                                    name={showThemeOptions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color="#999"
                                    style={{ marginLeft: 4 }}
                                />
                            </View>
                        </TouchableOpacity>

                        {showThemeOptions && (
                            <View style={styles.optionsContainer}>
                                {themeOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[styles.option, theme === option && styles.selectedOption]}
                                        onPress={() => {
                                            setTheme(option);
                                            setShowThemeOptions(false);
                                        }}
                                    >
                                        <Text>{getThemeName(option)}</Text>
                                        {theme === option && (
                                            <Feather name="check" size={16} color="#3B82F6" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Language */}
                    <View>
                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => setShowLanguageOptions(!showLanguageOptions)}
                        >
                            <Text style={styles.settingLabel}>Idioma</Text>
                            <View style={styles.settingValue}>
                                <Text>{languageOptions.find(opt => opt.code === language)?.name || language}</Text>
                                <Feather
                                    name={showLanguageOptions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color="#999"
                                    style={{ marginLeft: 4 }}
                                />
                            </View>
                        </TouchableOpacity>

                        {showLanguageOptions && (
                            <View style={styles.optionsContainer}>
                                {languageOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.code}
                                        style={[styles.option, language === option.code && styles.selectedOption]}
                                        onPress={() => {
                                            setLanguage(option.code);
                                            setShowLanguageOptions(false);
                                        }}
                                    >
                                        <Text>{option.name}</Text>
                                        {language === option.code && (
                                            <Feather name="check" size={16} color="#3B82F6" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cuenta</Text>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Feather name="log-out" size={18} color="#666" />
                        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteAccountButton}
                        onPress={handleDeleteAccount}
                    >
                        <Feather name="trash-2" size={18} color="#EF4444" />
                        <Text style={styles.deleteAccountButtonText}>Eliminar cuenta</Text>
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Acerca de</Text>

                    <TouchableOpacity style={styles.aboutItem}>
                        <Text style={styles.aboutLabel}>Versión</Text>
                        <Text style={styles.aboutValue}>1.0.0</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.aboutItem}>
                        <Text style={styles.aboutLabel}>Términos y condiciones</Text>
                        <Feather name="chevron-right" size={16} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.aboutItem}>
                        <Text style={styles.aboutLabel}>Política de privacidad</Text>
                        <Feather name="chevron-right" size={16} color="#999" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: 'white',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
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
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileName: {
        fontWeight: 'bold',
    },
    profileEmail: {
        color: '#666',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
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
        borderTopColor: '#eee',
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingLeft: 32,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    selectedOption: {
        backgroundColor: '#f0f9ff',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    logoutButtonText: {
        marginLeft: 12,
        color: '#666',
        fontWeight: '500',
    },
    deleteAccountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
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
        borderTopColor: '#eee',
    },
    aboutLabel: {
        fontWeight: '500',
    },
    aboutValue: {
        color: '#666',
    },
});