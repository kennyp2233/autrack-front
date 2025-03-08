import React from 'react';
import { Feather } from '@expo/vector-icons';

// Interfaz para las props de los iconos
interface IconProps {
    size?: number;
    color?: string;
}

// Componentes de iconos usando Feather de @expo/vector-icons
export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="home" size={size} color={color} />;
};

export const CarIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="truck" size={size} color={color} />;
};

export const WrenchIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="tool" size={size} color={color} />;
};

export const BarChartIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="bar-chart-2" size={size} color={color} />;
};

export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="settings" size={size} color={color} />;
};

export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="plus" size={size} color={color} />;
};

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="arrow-left" size={size} color={color} />;
};

export const CalendarIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="calendar" size={size} color={color} />;
};

export const ClockIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="clock" size={size} color={color} />;
};

export const DollarSignIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="dollar-sign" size={size} color={color} />;
};

export const MapPinIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="map-pin" size={size} color={color} />;
};

export const EditIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="edit-2" size={size} color={color} />;
};

export const TrashIcon: React.FC<IconProps> = ({ size = 24, color = 'black' }) => {
    return <Feather name="trash-2" size={size} color={color} />;
};