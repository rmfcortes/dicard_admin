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
    template_desktop;
    cover: string;
    cover_desktop: string;
    vertical_cover: string;
    employment: string;
    phone: string;
    address: Address[];
    view: string;
    whatsApp: string;
    web?: string;
    social_net?: Social[];
    addContact?: boolean;
    description: string[];
    type: string;
    about: string;
}

export interface Fonts {
    aboutTitle: Font;
    aboutDesc: Font;

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
    light: string;
    primary: string;
    contrast: string;

    aboutDesc: string;
    aboutTitle: string;

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
    segmentButtonFocusedText: string;
    nameProduct: string;
    descriptionProduct: string;
    priceProduct: string;
    backgroundCard: string;
}

export interface Contact {
    action: string;
    icon: string;
    label: string;
    value: string;
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

export interface Restricted {
    coverage: string[]
    master: string
}
