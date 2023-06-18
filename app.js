const express = require('express'); 
const dotenv = require('dotenv');
const { MessagingResponse  } = require('twilio').twiml;
const {callApi} = require('./utils')

dotenv.config()

const app = express(); app.use(express.urlencoded({ extended: true }));

app.post('/handle-response', async(req, res) => {
  const response = new MessagingResponse();
  const message = req.body.Body.toLowerCase();

  switch (message) {
    case 'help':
      response.message('Welcome To Our Whatsapp Experience\nUse the following prompts\nGet Order: This prompt will get a list of active orders\nDelete Order: This prompt will delete all orders\nYes or Confirm: This prompt will confirm your order\nNo or Do not Confirm: This prompt will delete the order');
      break;
    case 'get orders':
      let data = await callApi('orders/myorders', 'get', `+${req.body.WaId}`);
      for (let order of data) {
        const delivered = 'Yes' ? order.isDelivered : 'No';
        const paid = 'Yes' ? order.isPaid : 'No';
        response.message(`Content Of Order of Id ${order._id} includes`)
        for (let item of order.orderItems) {
          response.message(`Orders is shown as seen\n\nProduct Name: ${item.name}\n\nPrice: ${item.price}\n\nQuantity: ${item.qty}\n\nDelivered: ${delivered}\n\nPaid: ${paid}`).media(`https://res.cloudinary.com/daudj5isi/image/upload/v1686445331${item.image}`)
        }
      }
      break;
    case 'clear orders':
    case 'delete orders':
      response.message('Orders have been deleted. Thanks for using our Whatsapp experience')
      break;
    case 'confirm':
    case 'yes':
      response.message('Order has been confirm. Thanks for using our Whatsapp experience')
      break;
    case 'do not confirm':
    case 'no':
      response.message('Order have been deleted. Thanks for using our Whatsapp experience')
      break;
    default:
      response.message('Incorrect Prompt. Type Help to get a list of suitable prompts')
      break;
  }

  res.type('text/xml');
  res.send(response.toString());
});


const PORT = 4000; app.listen(PORT, 
  () => { console.log(`Server running on port ${PORT}`); });