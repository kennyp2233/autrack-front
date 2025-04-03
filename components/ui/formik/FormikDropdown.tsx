import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    Animated,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useField } from 'formik';
import { useTheme } from '@/contexts/ThemeContext';

export interface DropdownItem {
    id: string | number;
    label: string;
    value: any;
}

interface FormikDropdownProps {
    name: string;
    label: string;
    items: DropdownItem[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    loading?: boolean;
    showAddNew?: boolean;
    onAddNew?: () => void;
    addNewLabel?: string;
    emptyListMessage?: string;
    onSelect?: (item: DropdownItem) => void; // Custom onSelect for additional logic
}

const FormikDropdown: React.FC<FormikDropdownProps> = ({
    name,
    label,
    items,
    placeholder = 'Seleccionar',
    required = false,
    disabled = false,
    loading = false,
    showAddNew = false,
    onAddNew,
    addNewLabel = 'Agregar nuevo',
    emptyListMessage = 'No hay opciones disponibles',
    onSelect
}) => {
    const [field, meta, helpers] = useField(name);
    const { theme } = useTheme();

    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = useRef<any>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const screenHeight = Dimensions.get('window').height;

    const textColor = theme.text;
    const secondaryTextColor = theme.secondaryText;
    const borderColor = theme.border;
    const dangerColor = theme.danger;
    const primaryColor = theme.primary;
    const backgroundColor = theme.card;
    const selectedBgColor = `${theme.primary}15`;

    // Encuentra el ítem seleccionado
    const selectedItem = items.find(item => item.value === field.value);
    const hasError = meta.touched && meta.error;

    // Controla la animación de apertura y cierre
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: isOpen ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isOpen, fadeAnim]);

    // Medir la posición del dropdown para colocar el popup
    const measureDropdown = () => {
        if (dropdownRef.current) {
            dropdownRef.current.measure((fx: any, fy: any, width: any, height: any, px: any, py: any) => {
                setPosition({
                    top: py + height,
                    left: px,
                    width: width,
                });
            });
        }
    };

    // Alternar apertura/cierre del dropdown
    const toggleDropdown = () => {
        if (disabled) return;

        if (!isOpen) {
            measureDropdown();
        }
        setIsOpen(!isOpen);
    };

    // Seleccionar un ítem
    const handleSelect = (item: DropdownItem) => {
        helpers.setValue(item.value);
        helpers.setTouched(true);

        if (onSelect) {
            onSelect(item);
        }

        setIsOpen(false);
    };

    // Manejar agregar nuevo
    const handleAddNew = () => {
        setIsOpen(false);
        if (onAddNew) {
            onAddNew();
        }
    };

    // Calcular la posición óptima de la lista (arriba o abajo)
    const listMaxHeight = 200;
    const showAbove = position.top + listMaxHeight > screenHeight - 100;
    const dropdownTop = showAbove ? undefined : position.top;
    const dropdownBottom = showAbove ? screenHeight - position.top + 10 : undefined;

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: textColor }]}>
                {label}
                {required && <Text style={[styles.required, { color: dangerColor }]}>*</Text>}
            </Text>

            <TouchableOpacity
                ref={dropdownRef}
                style={[
                    styles.dropdownButton,
                    { borderColor: hasError ? dangerColor : borderColor, backgroundColor },
                    disabled && styles.dropdownDisabled
                ]}
                onPress={toggleDropdown}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        selectedItem ? styles.selectedText : styles.placeholderText,
                        { color: selectedItem ? textColor : secondaryTextColor }
                    ]}
                    numberOfLines={1}
                >
                    {selectedItem ? selectedItem.label : placeholder}
                </Text>

                {loading ? (
                    <ActivityIndicator size="small" color={primaryColor} />
                ) : (
                    <Feather
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={secondaryTextColor}
                    />
                )}
            </TouchableOpacity>

            {hasError && <Text style={[styles.errorText, { color: dangerColor }]}>{meta.error}</Text>}

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="none"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <Animated.View
                        style={[
                            styles.dropdownList,
                            {
                                top: dropdownTop,
                                bottom: dropdownBottom,
                                left: position.left,
                                width: position.width,
                                backgroundColor,
                                borderColor,
                                opacity: fadeAnim,
                                transform: [{
                                    translateY: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [showAbove ? -10 : 10, 0]
                                    })
                                }]
                            }
                        ]}
                    >
                        <ScrollView style={[styles.scrollContainer, { maxHeight: listMaxHeight }]}>
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <TouchableOpacity
                                        key={item.id.toString()}
                                        style={[
                                            styles.item,
                                            item.value === field.value && { backgroundColor: selectedBgColor },
                                            { borderBottomColor: borderColor }
                                        ]}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <Text style={{ color: textColor }}>{item.label}</Text>
                                        {item.value === field.value && (
                                            <Feather name="check" size={16} color={primaryColor} />
                                        )}
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={[styles.emptyMessage, { color: secondaryTextColor }]}>
                                    {emptyListMessage}
                                </Text>
                            )}

                            {showAddNew && (
                                <TouchableOpacity
                                    style={[styles.addNewItem, { borderTopColor: borderColor }]}
                                    onPress={handleAddNew}
                                >
                                    <Feather name="plus" size={16} color={primaryColor} />
                                    <Text style={[styles.addNewText, { color: primaryColor }]}>
                                        {addNewLabel}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    required: {
        fontWeight: '600',
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    dropdownDisabled: {
        opacity: 0.6,
    },
    selectedText: {
        fontSize: 16,
        flex: 1,
    },
    placeholderText: {
        fontSize: 16,
        flex: 1,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdownList: {
        position: 'absolute',
        borderWidth: 1,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },
    scrollContainer: {
        borderRadius: 8,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 0.5,
    },
    emptyMessage: {
        padding: 16,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    addNewItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderTopWidth: 1,
    },
    addNewText: {
        marginLeft: 8,
        fontWeight: '500',
    },
});

export default FormikDropdown;