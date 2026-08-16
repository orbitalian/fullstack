console.log('\n=== #1 sumArray ===');
function sumArray(numbers) {
    return numbers.reduce((acc, num) => acc + num, 0);
}
console.log(sumArray([1, 2, 3, 4])); // 10
console.log(sumArray([])); // 0
console.log('\n=== #2 createUser ===');
function createUser(name, age, isActive = true) {
    return { name, age, isActive };
}
const newUser = createUser('Анна', 25, true);
console.log(newUser); // { name: 'Анна', age: 25, isActive: true }
const defaultUser = createUser('Іван', 30);
console.log(defaultUser); // { name: 'Іван', age: 30, isActive: true }
console.log('\n=== #3 getOrderStatus ===');
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "Pending";
    OrderStatus["Shipped"] = "Shipped";
    OrderStatus["Delivered"] = "Delivered";
    OrderStatus["Cancelled"] = "Cancelled";
})(OrderStatus || (OrderStatus = {}));
function getOrderStatus(status) {
    switch (status) {
        case OrderStatus.Pending: return 'Замовлення очікує на обробку';
        case OrderStatus.Shipped: return 'Замовлення було відправлено';
        case OrderStatus.Delivered: return 'Замовлення доставлено';
        case OrderStatus.Cancelled: return 'Замовлення скасовано';
        default: throw new Error('Невідомий статус замовлення');
    }
}
console.log(getOrderStatus(OrderStatus.Pending));
console.log(getOrderStatus(OrderStatus.Shipped));
console.log(getOrderStatus(OrderStatus.Delivered));
console.log(getOrderStatus(OrderStatus.Cancelled));
export { sumArray, createUser, OrderStatus, getOrderStatus };
