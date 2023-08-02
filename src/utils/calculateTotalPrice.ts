export const calculateTotalPrice = (formData: any) => {
  let totalPrice = 0;
  for (const key in formData) {
    if (formData.hasOwnProperty(key) && formData[key].price) {
      totalPrice += formData[key].price;
    }
  }
  return totalPrice;
};
