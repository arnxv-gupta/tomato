import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });
    

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2, 
    };

    try {
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      let response = await axios.post(
        `${url}/api/order/place`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response)

      if (response.data.success) {
        const session_url = response.data.session_url;
        window.location.replace(session_url); // Redirect to Stripe checkout page
      } 
      else {
        console.error('Payment initiation failed:', response);
      }
    } catch (error) {
      console.error('Error placing order:', error.message);
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" required />
          <input name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Second Name" required />
        </div>
        <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Type Email" required />
        <input name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" required />
        <div className="multi-fields">
          <input name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" required />
          <input name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" required />
        </div>
        <div className="multi-fields">
          <input name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="ZIP Code" required />
          <input name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" required />
        </div>
        <input name="phone" onChange={onChangeHandler} value={data.phone} type="number" placeholder="Phone" required />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
            <button type="submit">PROCEED TO PAYMENT</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
