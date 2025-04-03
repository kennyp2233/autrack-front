import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import FormikButton from './FormikButton';
import { useTheme } from '@/contexts/ThemeContext';

interface FormikButtonGroupProps {
    submitLabel?: string;
    cancelLabel?: string;
    onCancel: () => void;
    submitVariant?: 'primary' | 'secondary' | 'danger';
    cancelVariant?: 'outline' | 'primary' | 'secondary' | 'danger';
    externalLoading?: boolean;
    reversed?: boolean;
    sticky?: boolean;
    submitIcon?: string;
    cancelIcon?: string;
}

const FormikButtonGroup: React.FC<FormikButtonGroupProps> = ({
    submitLabel = 'Guardar',
    cancelLabel = 'Cancelar',
    onCancel,
    submitVariant = 'primary',
    cancelVariant = 'outline',
    externalLoading = false,
    reversed = false,
    sticky = false,
    submitIcon,
    cancelIcon,
}) => {
    const { theme } = useTheme();

    // Use the sticky style
    if (sticky) {
        return (
            <View style={[
                styles.stickyContainer,
                {
                    backgroundColor: theme.card,
                    borderTopColor: theme.border,
                }
            ]}>
                <View style={styles.buttonsContainer}>
                    {!reversed ? (
                        <>
                            <View style={styles.buttonWrapper}>
                                <FormikButton
                                    title={cancelLabel}
                                    type="button"
                                    onPress={onCancel}
                                    variant={cancelVariant}
                                    iconLeft={cancelIcon}
                                    style={styles.button}
                                />
                            </View>
                            <View style={styles.buttonWrapper}>
                                <FormikButton
                                    title={submitLabel}
                                    type="submit"
                                    variant={submitVariant}
                                    loading={externalLoading}
                                    iconRight={submitIcon}
                                    style={styles.button}
                                />
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.buttonWrapper}>
                                <FormikButton
                                    title={submitLabel}
                                    type="submit"
                                    variant={submitVariant}
                                    loading={externalLoading}
                                    iconRight={submitIcon}
                                    style={styles.button}
                                />
                            </View>
                            <View style={styles.buttonWrapper}>
                                <FormikButton
                                    title={cancelLabel}
                                    type="button"
                                    onPress={onCancel}
                                    variant={cancelVariant}
                                    iconLeft={cancelIcon}
                                    style={styles.button}
                                />
                            </View>
                        </>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.buttonsContainer}>
            {!reversed ? (
                <>
                    <View style={styles.buttonWrapper}>
                        <FormikButton
                            title={cancelLabel}
                            type="button"
                            onPress={onCancel}
                            variant={cancelVariant}
                            iconLeft={cancelIcon}
                            style={styles.button}
                        />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <FormikButton
                            title={submitLabel}
                            type="submit"
                            variant={submitVariant}
                            loading={externalLoading}
                            iconRight={submitIcon}
                            style={styles.button}
                        />
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.buttonWrapper}>
                        <FormikButton
                            title={submitLabel}
                            type="submit"
                            variant={submitVariant}
                            loading={externalLoading}
                            iconRight={submitIcon}
                            style={styles.button}
                        />
                    </View>
                    <View style={styles.buttonWrapper}>
                        <FormikButton
                            title={cancelLabel}
                            type="button"
                            onPress={onCancel}
                            variant={cancelVariant}
                            iconLeft={cancelIcon}
                            style={styles.button}
                        />
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: 24,
        marginBottom: 16,
    },
    buttonWrapper: {
        flex: 1,
        paddingHorizontal: 6,
    },
    button: {
        width: '100%',
    },
    stickyContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        borderTopWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    }
});

export default FormikButtonGroup;