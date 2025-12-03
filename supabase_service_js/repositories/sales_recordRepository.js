import supabase from "../database/supabase_con.js";


export async function insertSalesRecord(salesRecord) {
    const { data, error } = await supabase
        .from('sales_records')
        .insert([salesRecord])
        .select();

    if (error) {
        console.error('Error inserting sales record:', error);
        throw error;
    }

    return data;
}

export async function selectSalesRecords(oldestDate) {
    const { data, error } = await supabase
        .from('sales_records')
        .select()
        .or(`created_at.gte.${oldestDate},updated_at.gte.${oldestDate}`);

    if (error) {
        console.error('Error selecting sales records:', error);
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

