"use server";

import { cache } from "react";
import { supabase } from './supabase';

export const getUserTests = cache(async (userId) => {
  console.log(`⏳ Fetching test data from Supabase for user: ${userId}`);

  const { data: tests, error } = await supabase
    .from('user_tests')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching tests:', error);
    return [];
  }

  return tests;
});