export interface Product {
    code?: string;
    description: string;
    id: string;
    name: string;
    section: string;
    price: number;
    unit?: string;
    url: string;
    extras?: Extra[];
    has_extras: boolean;
    new: boolean;
    stock: boolean;
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