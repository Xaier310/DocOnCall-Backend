const router = require("express").Router();
const stripe = require('stripe')('sk_test_51MqZkeSEJpQKk4far3zxYhEeU61QcS3gm4NRciK6OmJRZZPlYyjXwUVdJlk0WzLzuEyjwfn5su4bA6wyJePqlAPg00bsif63IZ');
const express = require('express');
const app = express();


router.post('/', async (req, res) => {
  console.log("mdsbdh");
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data:{
          currency:'inr',
          product_data:{
            name:'Doctor XYZ'
          },
          unit_amount:1000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.BackendAPI}?success=true`,
    cancel_url: `${process.env.BackendAPI}?canceled=true`,
  });

  res.redirect(303, session.url);
});

module.exports = router;