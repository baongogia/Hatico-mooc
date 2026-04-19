const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://aguwrkigctsbvirwtyew.supabase.co';
const supabaseAnonKey = 'sb_publishable_qEmf9XpnJkj1BxJAl-YKwQ_mx_9HYZh';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sampleTrailers = [
  {
    category: 'Moóc Ben',
    name: 'Moóc Ben Hatico 3 Trục - 31 Tấn (Tiêu chuẩn)',
    dimensions: '9,250 x 2,500 x 3,365 mm',
    gross_weight: 39500,
    curb_weight: 8500,
    payload_capacity: 31000,
    wheelbase: '4,520 + 1,310 + 1,310 mm',
    tire_specs: '11.00R20 / 12.00R20',
    axle_specs: 'FUWA 13 Tấn x 3 Trục',
    side_height: 1200
  },
  {
    category: 'Moóc Ben',
    name: 'Moóc Ben Hatico 3 Trục - Thùng Vát Siêu Nhẹ (28.5 Tấn)',
    dimensions: '8,500 x 2,500 x 3,200 mm',
    gross_weight: 37000,
    curb_weight: 8500,
    payload_capacity: 28500,
    wheelbase: '4,100 + 1,310 + 1,310 mm',
    tire_specs: '11.00R20',
    axle_specs: 'FUWA 13 Tấn x 3 Trục',
    side_height: 1000
  },
  {
    category: 'Moóc Xương',
    name: 'Moóc Xương 40 Feet - 3 Trục (Tiêu chuẩn)',
    dimensions: '12,400 x 2,500 x 1,530 mm',
    gross_weight: 39000,
    curb_weight: 5800,
    payload_capacity: 33200,
    wheelbase: '7,500 + 1,310 + 1,310 mm',
    tire_specs: '12R22.5',
    axle_specs: 'FUWA 13 Tấn x 3 Trục'
  }
];

async function seedData() {
  console.log('Inserting sample trailers with numeric values...');
  const { data, error } = await supabase
    .from('trailers')
    .insert(sampleTrailers);

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('Seed successful!');
  }
}

seedData();
