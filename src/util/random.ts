export function tempPasswordGenerator() {
  let newPassword = "";
  const seed =
    "1234567890!@#$%^&*()abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i <= 10; i++) {
    const pos = (Math.random() * 100) % seed.length;
    newPassword += seed.charAt(pos);
  }

  return newPassword;
}
