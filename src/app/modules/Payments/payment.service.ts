import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { readFileSync } from 'fs';
import { verifyPayment } from './payment.utils';

const prisma = new PrismaClient();

const confirmationService = async (transactionId: string) => {
 
  const verifyResponse = await verifyPayment(transactionId);

  let result;
  let message = '';

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
  
    result = await prisma.order.updateMany({
      where: { transactionId },
      data: { paymentStatus: 'PAID' },
    });

    

    if (result.count > 0) {
     
      const updatedOrder = await prisma.order.findFirst({
        where: { transactionId },
        select: { userId: true },
      });

   

      message = `Payment Successful! Transaction ID: ${transactionId}`;
    } else {
      message = 'Order not found or already updated.';
    }
  } else {
    message = 'Payment Failed!';
  }

  // Load and replace the confirmation template
  const filePath = join(__dirname, '../../../views/confirmation.html'); 
 
  
  let template = readFileSync(filePath, 'utf-8');
  template = template.replace('{{message}}', message);

  return template;
};

export const payServices = { confirmationService };
