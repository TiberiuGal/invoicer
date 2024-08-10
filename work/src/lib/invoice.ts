
export interface Invoice {
    id: string;
    series: string;
    num: string;
    status: string;
    date: Date;
    dueDate: string;
    customerId: string;
    customerName: string;
    customerAddress: string;
    customerCity: string;
    customerCountry: string;
    customerCui: string;
    customerRegcom: string;
    customerPhone: string;
    customerEmail: string;
    customerBank: string;
    customerIban: string;
    items: InvoiceItem[];
    total: number;
    notes: string;
    periodStart: Date;
    periodEnd: Date;
    dirty: number;
    template:string;
    currency: string;
    currencyConversionRate: number;
    totalRon: number;
}

export interface InvoiceItem {
    id: string;
    invoiceId: string;
    name: string;
    price: number;
    quantity: number;
    um: string;
    amount: number;
}


