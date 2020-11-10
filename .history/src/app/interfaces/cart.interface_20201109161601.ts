import { Address } from './profile.interface';

export interface Payments {
    id: string;
    src: string;
    vendor: string;
}

export interface DeliverDetails {
    deliver_cost: number;
    deliver_free: number;
    deliver_cost_fixed: boolean;
    payments: AcceptedPayments;
    cost_by_distance: CostByDistance;
    payment_comision: SourceComision;
}

export interface SourceComision {
    terminal: PaymentComision
    card: PaymentComision
}

export interface PaymentComision {
    fix: number
    percent: number
}

export interface CostByDistance {
    initial: number;
    km: number
}

export interface AcceptedPayments {
    cash: boolean
    card: boolean
    terminal: boolean
}

export interface Customer {
    direccion: Address
    telefono: string
}

export interface Order {
    accepted: boolean
    branch: Address
    customer: Customer
    comision: number
    createdAt: number
    delivery_cost: number,
    tip: number,
    products: OrderProduct[],
    total: number,
    progress: Progress[],
    payment: Payments,
    id?: string,
    idTrack: string,
    idPaymente?: string
}

export interface Progress {
    date: number;
    concept: string;
}

export interface OrderProduct {
    code?: string;
    description: string;
    id: string;
    name: string;
    section: string;
    price: number;
    unit?: string;
    url: string;
    extras?: SelectedExtras[];
    has_extras: boolean;
    new: boolean;
    stock: boolean;
    qty: number;
    total: number;
    comments: string;
    added?: number;
    idAsCart?: string;
}

export interface SelectedExtras {
    header: string;
    products: Extra[];
    radioSelected?: number;
}

export interface Extra {
    name: string;
    price: number;
    isChecked?: boolean;
    unavailable?: boolean;
}
