import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://lypsyzbnmvvxlwhkzftv.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5cHN5emJubXZ2eGx3aGt6ZnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3OTk2ODAsImV4cCI6MjEwMTM3NTY4MH0.Y87qLP0IoeNBvrJ4n8Gu5igLSsD2OSAYslBFuUyv5iE',
  },
};

export default nextConfig;
