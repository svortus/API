import supabase from "../database/supabase_con.js";


export async function insertSalesRecord(salesRecord) {
    const { data, error } = await supabase
        .from('sales_record')
        .insert([salesRecord])
        .select();

    if (error) {
        console.error('Error inserting sales record:', error);
        throw error;
    }

    return data;
}

export async function selectSalesRecords(oldestDate, ids = []) {
    const iso = new Date(oldestDate).toISOString();


    const idFilter = ids.length > 0
        ? `sale_id.in.(${ids.join(',')})`
        : null;

    const orFilters = [
        idFilter,
        `created_at.gte.${iso}`,
        `updated_at.gte.${iso}`
    ].filter(Boolean).join(',');

    const { data, error } = await supabase
        .from('sales_records')
        .select()
        .or(orFilters)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting sales records:', error);
        throw error;
    }

    return data;
}

export async function selectSalesRecordsGreaterId(sales_record_id, oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('sales_records')
        .select()
        .gte('sales_record_id', sales_record_id)
        .gte('created_at', iso)
        .order('updated_at', { ascending: true });
    if (error) {
        console.error('Error selecting sales record by id:', error);
        throw error;
    }
    return data;
}

export async function updateSalesRecord(salesRecord) {
    const { data, error } = await supabase
        .from('sales_records')
        .update(salesRecord)
        .eq('sales_record_id', salesRecord.sales_record_id); // Ajusta el nombre de la PK si es diferente

    if (error) {
        console.error('Error updating sales record:', error);
        throw error;
    }

    return data;
}

