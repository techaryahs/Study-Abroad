const axios = require('axios');

async function testAddToCart() {
  try {
    // 1. Login
    console.log("Logging in...");
    const loginRes = await axios.post('http://127.0.0.1:5011/api/auth/login', {
      email: 'amit.aryahsworld@gmail.com',
      password: 'Amit@123'
    });
    
    const token = loginRes.data.token;
    console.log("Got token:", token.substring(0, 20) + '...');

    // 2. Add to cart
    console.log("Adding to cart...");
    const cartRes = await axios.post('http://127.0.0.1:5011/api/user/add-to-cart', {
      serviceId: 'quiz',
      cartData: {
        price: '100',
        quantity: 1
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Add to cart response:", cartRes.data);

    // 3. Get cart
    console.log("Getting cart...");
    const getCartRes = await axios.get('http://127.0.0.1:5011/api/user/get-cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Get cart response:", getCartRes.data);

  } catch (error) {
    if (error.response) {
      console.error("HTTP Error:", error.response.status, error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
  }
}

testAddToCart();
