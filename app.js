import express from 'express';
import Stripe from 'stripe';
import stripeService from './services/checkoutService.js';
import SmeeClient from 'smee-client';

const app = express();
app.use(express.static("public"));

const smee = new SmeeClient({
    source: "https://smee.io/checkout-webhook",
    target: "http://localhost:8080/checkout-webhook",
    logger: console
})
  
smee.start()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2020-08-27",
})

app.post('/checkout', async (req, res) => {
    try {
      const paymentIntent = await stripeService.createPaymentCheckout();
  
      res.status(200).json(paymentIntent);
      
    } catch (error) {
      console.error('Error creating payment checkout:', error);
      res.status(500).json({ error: 'Failed to create payment checkout' });
    }
  });


app.post('/checkout-webhook', express.json(), async  (request, response) => {
  
    let event;

    try {
      event = request.body;
    } catch (err) {
      console.log(err)
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  console.log('the event is: ',event)

    switch (event.type) {
      case 'checkout.session.completed':
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
            event.data.object.id,
            {
              expand: ['line_items'],
            }
          );
          const line_items = await stripe.checkout.sessions.listLineItems(event.data.object.id, {
            expand: ['data.price.product'],
          });

          const orderLineItems = line_items.data.map(item => {
            const id = parseInt(item.price.product.metadata.product_id, 10);
            return {
                productId: id,
                productName: item.price.product.metadata.product_name,
                quantity: item.quantity,
                totalPrice: item.amount_total / 100,
            }
          })
          

          console.log('The Session With Line Items:\n',sessionWithLineItems)
          console.log('***********************')
          console.log('The Order Line Items:\n',orderLineItems)

        break;
 
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });

 
const PORT = 8080;

app.listen(PORT, () => console.log('Server is listening on port', PORT))