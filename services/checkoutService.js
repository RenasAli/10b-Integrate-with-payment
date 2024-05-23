import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeService = {
    async createPaymentCheckout() {
        try {
    
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: "Iphone 15 pr",
                            metadata: {
                                product_id: 1,
                                product_name: "Iphone 15 pr",
                            },
                        },
                        unit_amount: 1200 * 100,
                    },
                    quantity: 2,
                }],
                mode: 'payment',
                success_url: 'http://localhost:8080/success.html',
                cancel_url: 'http://localhost:8080/cancel.html',
                metadata: {
                    firstName: "Renas",
                    lastName: "Ali",
                    email: "rena0506@stud.kea.dk",
                    city: "Køge",
                    address: "Gymnasievej",
                    postalCode: "4600"
                }
            });
            console.log(session)
            return session.url
        } catch (error) {
            throw new Error('Error creating payment checkout: ' + error.message);
        }
    }
};

export default stripeService;