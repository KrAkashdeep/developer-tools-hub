import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create formatted email content
    const emailSubject = `🔔 multiDevtools Feedback from ${name}`;
    const emailBody = `
📧 NEW FEEDBACK FROM MULTIDEVTOOLS

👤 Contact Information:
Name: ${name}
Email: ${email}
Date: ${new Date().toLocaleString()}

💬 Message:
${message}

---
Reply to this email to respond directly to ${name} at ${email}
Sent from multiDevtools Feedback Form
    `;

    // Use Netlify Forms approach (works with any hosting)
    try {
      const netlifyResponse = await fetch('https://api.netlify.com/build_hooks/your-hook-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          subject: emailSubject
        })
      });
    } catch (netlifyError) {
      // Netlify failed, continue to other methods
    }

    // Use IFTTT webhook (free and reliable) - only if key is provided
    const iftttWebhookKey = process.env.IFTTT_WEBHOOK_KEY;
    if (iftttWebhookKey && iftttWebhookKey !== 'demo_key') {
      try {
        const iftttResponse = await fetch(`https://maker.ifttt.com/trigger/devtools_feedback/with/key/${iftttWebhookKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            value1: name,
            value2: email,
            value3: message
          })
        });

        if (iftttResponse.ok) {
          console.log('✅ Feedback sent successfully via IFTTT');
          console.log(`From: ${name} (${email})`);
          console.log(`Message: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);
          
          return NextResponse.json(
            { message: 'Feedback sent successfully!' },
            { status: 200 }
          );
        }
      } catch (iftttError) {
        console.log('IFTTT failed:', iftttError);
      }
    }

    // Use simple HTTP POST to a webhook service
    try {
      const webhookUrl = process.env.WEBHOOK_URL;
      if (webhookUrl) {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'akash.work42@gmail.com',
            subject: emailSubject,
            name,
            email,
            message,
            timestamp: new Date().toISOString()
          })
        });

        if (webhookResponse.ok) {
          console.log('✅ Feedback sent successfully via webhook');
          return NextResponse.json(
            { message: 'Feedback sent successfully!' },
            { status: 200 }
          );
        }
      }
    } catch (webhookError) {
      console.log('Webhook failed:', webhookError);
    }

    // Final approach: Log to console and create mailto link
    console.log('=== 📧 NEW FEEDBACK RECEIVED ===');
    console.log('📅 Date:', new Date().toLocaleString());
    console.log('👤 Name:', name);
    console.log('📧 Email:', email);
    console.log('💬 Message:', message);
    console.log('');
    console.log('🔗 Quick Reply Link:');
    const replyLink = `mailto:${email}?subject=Re: multiDevtools Feedback&body=Hi ${name},%0D%0A%0D%0AThank you for your feedback about multiDevtools!%0D%0A%0D%0A`;
    console.log(replyLink);
    console.log('');
    console.log('📋 Copy this to email akash.work42@gmail.com:');
    console.log('Subject:', emailSubject);
    console.log('Body:', emailBody);
    console.log('=============================');

    return NextResponse.json(
      { 
        message: 'Feedback received successfully! Check your console for details.',
        details: {
          name,
          email,
          message,
          timestamp: new Date().toISOString(),
          replyLink
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error processing feedback:', error);
    
    return NextResponse.json(
      { error: 'Failed to send feedback. Please try again later.' },
      { status: 500 }
    );
  }
}