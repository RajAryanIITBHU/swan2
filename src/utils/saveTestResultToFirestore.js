import { supabase } from '@/lib/supabase';

export async function saveTestResultToSupabase({
  email,
  testId,
  batch,
  userAnswers,
  resultSummary,
  questionData,
}) {
  console.log("Saving result with params:", {
    email,
    testId,
    batch,
    userAnswers,
    resultSummary,
    questionData,
  });

  if (!email || !testId || !batch) {
    console.error("Missing required parameters (email, testId, or batch)");
    return;
  }

  try {
    // Get user by email
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !users) {
      console.error('❌ No user found with email:', email);
      return;
    }

    const userId = users.id;
    const testDocId = `${batch}-${testId}`;

    // Get existing test attempts
    const { data: existingTest } = await supabase
      .from('user_tests')
      .select('attempts_count')
      .eq('user_id', userId)
      .eq('test_id', testDocId)
      .single();

    const attempts = (existingTest?.attempts_count || 0) + 1;

    const resultPayload = {
      user_id: userId,
      test_id: testDocId,
      batch,
      timestamp: new Date().toISOString(),
      attempts_count: attempts,
      user_answers: userAnswers,
      result_summary: resultSummary,
      question_structure: questionData,
    };

    // Save result to Supabase
    const { error: saveError } = await supabase
      .from('user_tests')
      .upsert(resultPayload);

    if (saveError) {
      throw saveError;
    }

    console.log("✅ Result saved to Supabase at:", testDocId);

    // Store in localStorage
    localStorage.setItem("result", JSON.stringify(resultPayload));
    console.log("✅ Result saved in localStorage");

  } catch (error) {
    console.error("❌ Error saving result to Supabase:", error);
  }
}