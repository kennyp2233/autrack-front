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

    // Definir colores con valores por defecto que garantizan buen contraste
    const textColor = appTheme?.text || '#333333';
    const secondaryTextColor = appTheme?.secondaryText || '#555555'; // Mejorado para contraste
    const borderColor = appTheme?.border || '#E0E0E0'; // Más visible
    const primaryColor = appTheme?.primary || '#333333';
    const cardBgColor = appTheme?.card || '#FFFFFF';
    const dangerColor = '#DC2626'; // Rojo más oscuro para mejor contraste

    // Color de fondo para opciones seleccionadas
    const selectedBgColor = isDark
        ? `${primaryColor}33` // Añadir transparencia al color primario en modo oscuro 
        : '#EBF5FF'; // Azul muy claro para tema claro

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
                <View style={[styles.section, { backgroundColor: cardBgColor }]}>
                    <Text style={[styles.sectionTitle, { color: secondaryTextColor }]}>Perfil</Text>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => router.push('/profile')}
                    >
                        <View style={styles.profileInfo}>
                            <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
                                <Text style={[styles.avatarText, { color: '#FFFFFF' }]}>
                                    {user?.fullName?.charAt(0) || 'U'}
                                </Text>
                            </View>
                            <View>
                                <Text style={[styles.profileName, { color: textColor }]}>
                                    {user?.fullName || 'Usuario'}
                                </Text>
                                <Text style={[styles.profileEmail, { color: secondaryTextColor }]}>
                                    {user?.email || 'usuario@ejemplo.com'}
                                </Text>
                            </View>
                        </View>
                        <Feather name="chevron-right" size={20} color={secondaryTextColor} />
                    </TouchableOpacity>
                </View>

                {/* Notifications Section */}
                <View style={[styles.section, { backgroundColor: cardBgColor }]}>
                    <Text style={[styles.sectionTitle, { color: secondaryTextColor }]}>Notificaciones</Text>
                    <View style={[styles.settingItem, { borderTopColor: borderColor }]}>
                        <Text style={[styles.settingLabel, { color: textColor }]}>Correo electrónico</Text>
                        <Switch
                            value={notifications.email}
                            onValueChange={(value) => setNotifications({ ...notifications, email: value })}
                            trackColor={{ false: '#767577', true: appTheme.tabBarActive || '#3B82F6' }}
                            thumbColor={notifications.email ? primaryColor : '#f4f3f4'}
                        />
                    </View>
                    <View style={[styles.settingItem, { borderTopColor: borderColor }]}>
                        <Text style={[styles.settingLabel, { color: textColor }]}>Push</Text>
                        <Switch
                            value={notifications.push}
                            onValueChange={(value) => setNotifications({ ...notifications, push: value })}
                            trackColor={{ false: '#767577', true: appTheme.tabBarActive || '#3B82F6' }}
                            thumbColor={notifications.push ? primaryColor : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={[styles.section, { backgroundColor: cardBgColor }]}>
                    <Text style={[styles.sectionTitle, { color: secondaryTextColor }]}>Preferencias</Text>

                    {/* Currency */}
                    <View>
                        <TouchableOpacity
                            style={[styles.settingItem, { borderTopColor: borderColor }]}
                            onPress={() => setShowCurrencyOptions(!showCurrencyOptions)}
                        >
                            <Text style={[styles.settingLabel, { color: textColor }]}>Moneda</Text>
                            <View style={styles.settingValue}>
                                <Text style={{ color: textColor }}>{getCurrencyName(currency)}</Text>
                                <Feather
                                    name={showCurrencyOptions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color={secondaryTextColor}
                                    style={{ marginLeft: 8 }}
                                />
                            </View>
                        </TouchableOpacity>
                        {showCurrencyOptions && (
                            <View style={[styles.optionsContainer, { borderTopColor: borderColor }]}>
                                {currencies.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.option,
                                            { borderTopColor: borderColor },
                                            currency === option && [
                                                styles.selectedOption,
                                                { backgroundColor: selectedBgColor }
                                            ]
                                        ]}
                                        onPress={() => {
                                            setCurrency(option);
                                            setShowCurrencyOptions(false);
                                        }}
                                    >
                                        <Text style={{ color: textColor }}>{getCurrencyName(option)}</Text>
                                        {currency === option && (
                                            <Feather name="check" size={16} color={primaryColor} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Units */}
                    <View>
                        <TouchableOpacity
                            style={[styles.settingItem, { borderTopColor: borderColor }]}
                            onPress={() => setShowUnitsOptions(!showUnitsOptions)}
                        >
                            <Text style={[styles.settingLabel, { color: textColor }]}>Unidad de kilometraje</Text>
                            <View style={styles.settingValue}>
                                <Text style={{ color: textColor }}>{getUnitName(units)}</Text>
                                <Feather
                                    name={showUnitsOptions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color={secondaryTextColor}
                                    style={{ marginLeft: 8 }}
                                />
                            </View>
                        </TouchableOpacity>
                        {showUnitsOptions && (
                            <View style={[styles.optionsContainer, { borderTopColor: borderColor }]}>
                                {unitOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.option,
                                            { borderTopColor: borderColor },
                                            units === option && [
                                                styles.selectedOption,
                                                { backgroundColor: selectedBgColor }
                                            ]
                                        ]}
                                        onPress={() => {
                                            setUnits(option);
                                            setShowUnitsOptions(false);
                                        }}
                                    >
                                        <Text style={{ color: textColor }}>{getUnitName(option)}</Text>
                                        {units === option && (
                                            <Feather name="check" size={16} color={primaryColor} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Theme */}
                    <View>
                        <TouchableOpacity
                            style={[styles.settingItem, { borderTopColor: borderColor }]}
                            onPress={() => setShowThemeOptions(!showThemeOptions)}
                        >
                            <Text style={[styles.settingLabel, { color: textColor }]}>Tema</Text>
                            <View style={styles.settingValue}>
                                <Text style={{ color: textColor }}>{getThemeName(themeMode)}</Text>
                                <Feather
                                    name={showThemeOptions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color={secondaryTextColor}
                                    style={{ marginLeft: 8 }}
                                />
                            </View>
                        </TouchableOpacity>
                        {showThemeOptions && (
                            <View style={[styles.optionsContainer, { borderTopColor: borderColor }]}>
                                {themeOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.option,
                                            { borderTopColor: borderColor },
                                            themeMode === option && [
                                                styles.selectedOption,
                                                { backgroundColor: selectedBgColor }
                                            ]
                                        ]}
                                        onPress={() => handleThemeChange(option)}
                                    >
                                        <Text style={{ color: textColor }}>{getThemeName(option)}</Text>
                                        {themeMode === option && (
                                            <Feather name="check" size={16} color={primaryColor} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Language */}
                    <View>
                        <TouchableOpacity
                            style={[styles.settingItem, { borderTopColor: borderColor }]}
                            onPress={() => setShowLanguageOptions(!showLanguageOptions)}
                        >
                            <Text style={[styles.settingLabel, { color: textColor }]}>Idioma</Text>
                            <View style={styles.settingValue}>
                                <Text style={{ color: textColor }}>
                                    {languageOptions.find(opt => opt.code === language)?.name || language}
                                </Text>
                                <Feather
                                    name={showLanguageOptions ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color={secondaryTextColor}
                                    style={{ marginLeft: 8 }}
                                />
                            </View>
                        </TouchableOpacity>
                        {showLanguageOptions && (
                            <View style={[styles.optionsContainer, { borderTopColor: borderColor }]}>
                                {languageOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.code}
                                        style={[
                                            styles.option,
                                            { borderTopColor: borderColor },
                                            language === option.code && [
                                                styles.selectedOption,
                                                { backgroundColor: selectedBgColor }
                                            ]
                                        ]}
                                        onPress={() => {
                                            setLanguage(option.code);
                                            setShowLanguageOptions(false);
                                        }}
                                    >
                                        <Text style={{ color: textColor }}>{option.name}</Text>
                                        {language === option.code && (
                                            <Feather name="check" size={16} color={primaryColor} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* Account Section */}
                <View style={[styles.section, { backgroundColor: cardBgColor }]}>
                    <Text style={[styles.sectionTitle, { color: secondaryTextColor }]}>Cuenta</Text>
                    <TouchableOpacity
                        style={[styles.logoutButton, { borderTopColor: borderColor }]}
                        onPress={handleLogout}
                    >
                        <Feather name="log-out" size={18} color={isDark ? "#999999" : "#666666"} />
                        <Text style={[styles.logoutButtonText, { color: isDark ? "#999999" : "#666666" }]}>
                            Cerrar sesión
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.deleteAccountButton, { borderTopColor: borderColor }]}
                        onPress={handleDeleteAccount}
                    >
                        <Feather name="trash-2" size={18} color={dangerColor} />
                        <Text style={[styles.deleteAccountButtonText, { color: dangerColor }]}>
                            Eliminar cuenta
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View style={[styles.section, { backgroundColor: cardBgColor }]}>
                    <Text style={[styles.sectionTitle, { color: secondaryTextColor }]}>Acerca de</Text>
                    <TouchableOpacity style={[styles.aboutItem, { borderTopColor: borderColor }]}>
                        <Text style={[styles.aboutLabel, { color: textColor }]}>Versión</Text>
                        <Text style={[styles.aboutValue, { color: secondaryTextColor }]}>1.0.0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.aboutItem, { borderTopColor: borderColor }]}>
                        <Text style={[styles.aboutLabel, { color: textColor }]}>Términos y condiciones</Text>
                        <Feather name="chevron-right" size={16} color={secondaryTextColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.aboutItem, { borderTopColor: borderColor }]}>
                        <Text style={[styles.aboutLabel, { color: textColor }]}>Política de privacidad</Text>
                        <Feather name="chevron-right" size={16} color={secondaryTextColor} />
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
        paddingHorizontal: 16,
    },
    section: {
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        // Añadimos sombra sutil para mejor separación visual
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
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
        marginTop: 2,
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
        // El fondo se establece dinámicamente
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