import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// EXPO_PUBLIC due to dotenv error — fix in production.
const supabaseUrl = 'https://pvnjcutrostgoxzxjieg.supabase.co'
const supabaseAnonKey = 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bmpjdXRyb3N0Z294enhqaWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAwNjMzMjcsImV4cCI6MjAzNTYzOTMyN30.Rf_tSdNupMwCExJQAo3SZpH74n_oI0NV6llmSAemSyA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})