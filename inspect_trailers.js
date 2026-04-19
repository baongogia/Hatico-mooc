const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://aguwrkigctsbvirwtyew.supabase.co';
const supabaseAnonKey = 'sb_publishable_qEmf9XpnJkj1BxJAl-YKwQ_mx_9HYZh';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectTable() {
  console.log('Inspecting trailers table columns...');
  // Try to select everything with a limit of 0 just to see metadata if possible
  // Or just try to select from a non-existent column to see the error message with valid columns? 
  // No, let's try to fetch any one row.
  const { data, error } = await supabase.from('trailers').select('*').limit(1);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Columns found:', data.length > 0 ? Object.keys(data[0]) : 'Table is empty, cannot determine columns directly.');
  }
}

inspectTable();
