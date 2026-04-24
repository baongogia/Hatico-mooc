import * as dotenv from "dotenv";
dotenv.config();
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkInventory() {
  const { data, error } = await supabase.from("inventory").select("*");
  if (error) {
    console.error(error);
    return;
  }
  console.log("Current Inventory Records:");
  console.table(data);
  
  const total = data.reduce((acc, curr: any) => acc + (curr.value || 0), 0);
  console.log("Total Value in DB:", total);
}

checkInventory();
