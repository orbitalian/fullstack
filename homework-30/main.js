function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

function isValidUrl(url) {
  const regex = /^(https?:\/\/)([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
  return regex.test(url);
}

console.log(isValidEmail('example@example.com')); // true
console.log(isValidEmail('invalid-email'));        // false
console.log(isValidUrl('https://www.example.com')); // true
console.log(isValidUrl('invalid-url'));              // false

export { isValidEmail, isValidUrl };
