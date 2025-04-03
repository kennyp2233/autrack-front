import * as Yup from 'yup';

// Validaciones comunes
export const emailSchema = Yup.string()
    .email('Ingrese un correo electrónico válido')
    .required('El correo electrónico es requerido');

export const passwordSchema = Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida');

export const nameSchema = Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no debe exceder los 50 caracteres')
    .required('El nombre es requerido');

export const yearSchema = Yup.number()
    .typeError('Debe ser un número')
    .min(1900, 'El año no puede ser anterior a 1900')
    .max(new Date().getFullYear() + 1, `El año no puede ser posterior a ${new Date().getFullYear() + 1}`)
    .required('El año es requerido');

export const mileageSchema = Yup.number()
    .typeError('Debe ser un número')
    .min(0, 'El kilometraje no puede ser negativo')
    .required('El kilometraje es requerido');

export const plateSchema = Yup.string()
    .max(10, 'La placa no debe exceder los 10 caracteres');

export const moneySchema = Yup.number()
    .typeError('Debe ser un número')
    .min(0, 'El valor no puede ser negativo');

export const dateSchema = Yup.date()
    .typeError('Fecha inválida')
    .required('La fecha es requerida');

// Esquemas completos para formularios comunes

// Auth schemas
export const loginSchema = Yup.object().shape({
    email: emailSchema,
    password: passwordSchema,
    rememberMe: Yup.boolean()
});

export const registerSchema = Yup.object().shape({
    fullName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Confirme su contraseña'),
    acceptTerms: Yup.boolean()
        .oneOf([true], 'Debe aceptar los términos y condiciones')
        .required('Debe aceptar los términos y condiciones')
});

export const recoverySchema = Yup.object().shape({
    email: emailSchema
});

// Vehicle schemas
export const vehicleSchema = Yup.object().shape({
    id_marca: Yup.number()
        .required('Seleccione una marca')
        .min(1, 'Seleccione una marca'),
    id_modelo: Yup.number()
        .required('Seleccione un modelo')
        .min(1, 'Seleccione un modelo'),
    anio: yearSchema,
    kilometraje_actual: mileageSchema,
    placa: plateSchema
});

// Maintenance schemas
export const maintenanceSchema = Yup.object().shape({
    vehicleId: Yup.number().required('ID de vehículo requerido'),
    type: Yup.string().required('El tipo de mantenimiento es requerido'),
    date: dateSchema,
    mileage: mileageSchema,
    cost: moneySchema,
    location: Yup.string(),
    notes: Yup.string(),
    photos: Yup.array()
});

// Helper function to format Yup validation errors
export const formatYupErrors = (err: any) => {
    const errors: Record<string, string> = {};

    if (err.inner) {
        err.inner.forEach((error: any) => {
            if (!errors[error.path]) {
                errors[error.path] = error.message;
            }
        });
    }

    return errors;
};