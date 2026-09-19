"use server";

// Codice di accesso richiesto per creare un nuovo account. Non è una vera
// misura di sicurezza (è un'app privata già protetta da Supabase Auth), è
// solo un modo semplice per evitare registrazioni casuali di sconosciuti.
const SIGNUP_ACCESS_CODE = "FUTURI MILIONARI";

export async function verifySignupCode(code: string): Promise<boolean> {
  return code.trim().toUpperCase() === SIGNUP_ACCESS_CODE;
}
