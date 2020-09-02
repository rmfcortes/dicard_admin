export interface Product {
    code?: string;
    description: string;
    id: string;
    name: string;
    section: string;
    price: number;
    unit?: string;
    url: string;
}

export interface Section {
    name: string;
    priority: number;
    products: Product[];
    edit?: boolean;
}
