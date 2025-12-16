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

    // Get Formspree endpoint from environment
    const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;
    
    if (!formspreeEndpoint) {
      return NextResponse.json(
        { error: 'Formspree endpoint not configured' },
        { status: 500 }
      );
    }

    // Send to Formspree
    try {
      const formspreeResponse = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: `${message}`,
          _replyto: '',
          _subject: `Feedback from ${name}`
        })
      });

      const formspreeData = await formspreeResponse.json();

      if (formspreeResponse.ok) {
        console.log('✅ Feedback sent successfully via Formspree');
        console.log(`From: ${name} (${email})`);
        console.log(`Message: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);
        
        return NextResponse.json(
          { message: 'Feedback submitted successfully. Thank you for taking the time.' },
          { status: 200 }
        );
      } else {
        console.error('Formspree error:', formspreeData);
        throw new Error(`Formspree error: ${formspreeData.error || 'Unknown error'}`);
      }
    } catch (formspreeError) {
      console.error('❌ Formspree failed:', formspreeError);
      
      // Fallback: Log to console for manual processing
      console.log('=== 📧 NEW FEEDBACK RECEIVED (FALLBACK) ===');
      console.log('📅 Date:', new Date().toLocaleString());
      console.log('👤 Name:', name);
      console.log('📧 Email:', email);
      console.log('💬 Message:', message);
      console.log('=============================');

      return NextResponse.json(
        { 
          message: 'Feedback received! There was an issue with the email service, but your message has been logged.',
          fallback: true
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('❌ Error processing feedback:', error);
    
    return NextResponse.json(
      { error: 'Failed to send feedback. Please try again later.' },
      { status: 500 }
    );
  }
}