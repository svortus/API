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
        .from('sales_record')
        .select()
        .or(orFilters)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting sales records:', error);
        throw error;
    }

    return data;
}

export async function selectSalesRecordsGreaterId(sale_id, oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('sales_record')
        .select()
        .gte('sale_id', sale_id)
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
        .from('sales_record')
        .update(salesRecord)
        .eq('sale_id', salesRecord.sale_id); // Ajusta el nombre de la PK si es diferente

    if (error) {
        console.error('Error updating sales record:', error);
        throw error;
    }

    return data;
}

