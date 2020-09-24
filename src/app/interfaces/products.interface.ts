export interface Product {
    code?: string;
    description: Paragraph[];
    id: string;
    name: string;
    section: string;
    price: number;
    unit?: string;
    url: string;
    url_desktop: string;
    extras?: Extra[];
    has_extras: boolean;
    new: boolean;
    stock: boolean;
}

export interface Paragraph {
    subHeader: string;
    text: string[];
}

export interface Section {
    name: string;
    priority: number;
    products: Product[];
    edit?: boolean;
}

export interface ExtraList {
    qty: number;
    header: string;
    required: boolean;
    products: ProductExtra[];
}

export interface Extra {
    header: string;
    extras: ProductExtra[];
}

export interface ProductExtra {
    name: string;
    price: any;
}