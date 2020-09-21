import { Font } from 'ngx-font-picker/lib/font-picker.interfaces';

export interface MainProfile {
    colors: Colors;
    font: Fonts;
    contact: Contact[];
    email: string;
    company: string;
    photo: string;
    name: string;
    template: string;
    cover: string;
    vertical_cover: string;
    employment: string;
    phone: string;
    address: Address[];
    view: string;
    whatsApp: string;
    web?: string;
    social_net?: Social[];
    addContact?: boolean;
    description: string;
    type: string;
}

export interface Fonts {
    name: Font;
    emplyment: Font;
    contactLabel: Font;
    follow: Font;
    header: Font;
    product_name: Font;
    product_price: Font;
    product_description: Font;
    location: Font;
    address: Font;
}

export interface Colors {
    address: string;
    background: string;
    backgroundGradient?: string;
    backgroundGradientValue?: string;
    name: string;
    employment: string;
    fillButtons: string;
    textButtons: string;
    iconsText: string;
    contactTitle: string;
    followTitle: string;
    locationTitle: string;
    navigateIcon: string;
    iconsTabs: string;
    iconsTabsFocused: string;
    iconHomeTab: string;
    segmentButton: string;
    segmentButtonFocused: string;
    nameProduct: string;
    descriptionProduct: string;
    priceProduct: string;
    backgroundCard: string;
}

export interface Contact {
    action: string;
    icon: string;
}

export interface Address {
    address: string;
    lat: number;
    lng: number;
    pin?: string;
    poi?: string;
    dark?: boolean;
    name: string;
}

export interface Social {
    icon: string;
    page: string;
}

export interface Sucursal {
    name: string
    location: Address
}