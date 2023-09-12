export function generateOTP(numDigits: number): number {
  if (numDigits < 1) {
    throw new Error('Number of digits must be greater than or equal to 1');
  }

  const min = 10 ** (numDigits - 1);
  const max = 10 ** numDigits - 1;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp;
}
