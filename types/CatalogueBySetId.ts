export interface CatalogInfo {
    err_code: number;
    err_msg: string;
    data: CatalogueInfoData;
}

interface CatalogueInfoData {
    total: number;
    has_more: boolean;
    name: string;
    items: CatalogueInfoItem[];
}

export interface CatalogueInfoItem {
    item_id: number;
    shop_id: number;
    name: string;
    image: string;
    currency: string;
    discount: number;
    price: string;
    price_before_discount: string;
    price_min: string;
    price_min_before_discount: string;
    price_max: string;
    price_max_before_discount: string;
    item_type: number;
    reference_item_id: string;
    id: number;
    sp_flag: boolean;
    is_del: boolean;
    comm_rate: number;
    label: Label;
    sold: number;
    sp_end_time: number;
    sp_min_stock: number;
    item_promotion: Itempromotion;
    normal_stock: number;
    sp_total_stock: number;
    affiliate: Affiliate;
    logo_img?: string;
    display_total_stock: number;
    has_upcoming_promotion: boolean;
    show_discount_label: boolean;
    is_prohibited: boolean;
    scenario: number;
    has_in_fulfillment_free_sample: boolean;
    is_cheapest_price: boolean;
}

interface Affiliate {
    comm_rate: number;
    is_ams_affiliate: boolean;
}

interface Itempromotion {
    display_promotions: Displaypromotion[];
    psp_promotion?: Psppromotion;
    rn_compatible_sp?: Psppromotion[];
}

interface Psppromotion {
    promotion_id: number;
    promotion_type: number;
    stock: number;
    start_time: number;
    end_time: number;
    model_ids: number[];
    models: Model2[];
    enable_set_timeslot: boolean;
    has_set_timeslot: boolean;
    status: number;
    valid: boolean;
}

interface Model2 {
    model_id: number;
    stock: number;
    price: string;
    display_price: string;
    has_timeslot: boolean;
    sp_reverse_stock: number;
    has_set_timeslot: boolean;
    purchase_limit: number;
}

interface Displaypromotion {
    promotion_id: number;
    promotion_type: number;
    stock: number;
    start_time: number;
    end_time: number;
    model_ids?: number[];
    models: Model[];
}

interface Model {
    model_id?: number;
    stock?: number;
    price?: string;
    display_price?: string;
    has_timeslot?: boolean;
    sp_reverse_stock?: number;
}

interface Label {
    popularity_labels: Popularitylabel[];
    promotion_labels?: Promotionlabel[];
    promotion_labels_v2?: Promotionlabel[];
    voucher_label?: Voucherlabel[];
}

interface Promotionlabel {
    type: number;
    type_name: string;
    voucher_label?: Voucherlabel;
    start_time?: number;
    end_time?: number;
    stock?: number;
    text?: string;
    promotion_id?: number;
    img?: string;
    has_stock_time_slot?: boolean;
    has_set_time_slot?: boolean;
}

interface Voucherlabel {
    promotion_id: number;
    voucher_code: string;
    reward_type: number;
    discount_value: string;
    discount_percentage: number;
    coin_percentage_real: number;
    live_xtra: boolean;
    shop_id: number;
    has_streamer_rule: boolean;
}

interface Popularitylabel {
    type: number;
    type_name: string;
    star_count: number;
}
