'use client';

import { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import OutputBox from '@/components/common/OutputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CreditCardValidatorTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [cardInfo, setCardInfo] = useState<any>(null);

  const validateCreditCard = (cardNumber: string) => {
    if (!cardNumber.trim()) {
      setOutput('');
      setIsValid(null);
      setCardInfo(null);
      return;
    }

    // Remove spaces and dashes
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');
    
    // Check if it contains only digits
    if (!/^\d+$/.test(cleanNumber)) {
      setIsValid(false);
      setOutput('✗ Invalid format - must contain only digits');
      setCardInfo(null);
      return;
    }

    // Check length (most cards are 13-19 digits)
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      setIsValid(false);
      setOutput('✗ Invalid length - must be 13-19 digits');
      setCardInfo(null);
      return;
    }

    // Luhn algorithm validation
    const luhnValid = validateLuhn(cleanNumber);
    const cardType = detectCardType(cleanNumber);
    
    setIsValid(luhnValid);
    setCardInfo({
      type: cardType,
      length: cleanNumber.length,
      formatted: formatCardNumber(cleanNumber),
      luhnValid
    });
    
    if (luhnValid) {
      setOutput(`✓ Valid ${cardType} card number`);
    } else {
      setOutput('✗ Invalid card number (fails Luhn check)');
    }
  };

  const validateLuhn = (cardNumber: string): boolean => {
    let sum = 0;
    let isEven = false;
    
    // Process digits from right to left
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const detectCardType = (cardNumber: string): string => {
    // Visa: starts with 4
    if (/^4/.test(cardNumber)) {
      return 'Visa';
    }
    
    // Mastercard: starts with 5 or 2221-2720
    if (/^5[1-5]/.test(cardNumber) || /^2[2-7]/.test(cardNumber)) {
      return 'Mastercard';
    }
    
    // American Express: starts with 34 or 37
    if (/^3[47]/.test(cardNumber)) {
      return 'American Express';
    }
    
    // Discover: starts with 6011, 622126-622925, 644-649, or 65
    if (/^6011|^622[1-9]|^64[4-9]|^65/.test(cardNumber)) {
      return 'Discover';
    }
    
    // Diners Club: starts with 300-305, 36, or 38
    if (/^30[0-5]|^36|^38/.test(cardNumber)) {
      return 'Diners Club';
    }
    
    // JCB: starts with 35 or 2131/1800
    if (/^35|^2131|^1800/.test(cardNumber)) {
      return 'JCB';
    }
    
    return 'Unknown';
  };

  const formatCardNumber = (cardNumber: string): string => {
    // Format based on card type
    const type = detectCardType(cardNumber);
    
    if (type === 'American Express') {
      // Amex: 4-6-5 format
      return cardNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    } else {
      // Most cards: 4-4-4-4 format
      return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    validateCreditCard(value);
  };

  const handleExample = () => {
    const examples = [
      '4532015112830366', // Visa
      '5555555555554444', // Mastercard
      '378282246310005',  // American Express
      '6011111111111117', // Discover
      '30569309025904'    // Diners Club
    ];
    const example = examples[Math.floor(Math.random() * examples.length)];
    setInput(example);
    validateCreditCard(example);
  };

  return (
    <div className="space-y-6">
      <ToolLayout>
        <InputBox
          title="Credit Card Number"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter credit card number (spaces and dashes will be ignored)..."
          type="input"
          example="Load test card number"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Validation Result</h3>
            {isValid !== null && (
              <Badge variant={isValid ? 'secondary' : 'destructive'}>
                {isValid ? 'Valid' : 'Invalid'}
              </Badge>
            )}
          </div>
          
          <OutputBox
            title="Result"
            value={output}
            placeholder="Validation result will appear here..."
          />

          {cardInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Card Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Card Type:</span>
                  <span className="font-mono">{cardInfo.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Length:</span>
                  <span className="font-mono">{cardInfo.length} digits</span>
                </div>
                <div className="flex justify-between">
                  <span>Formatted:</span>
                  <span className="font-mono">{cardInfo.formatted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Luhn Check:</span>
                  <Badge variant={cardInfo.luhnValid ? 'secondary' : 'destructive'}>
                    {cardInfo.luhnValid ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Card Validator Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What it validates:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Card number format and length</li>
              <li>Luhn algorithm checksum</li>
              <li>Card type identification</li>
              <li>Industry standard compliance</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Supported card types:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Visa:</strong> Starts with 4 (13, 16, or 19 digits)</li>
              <li><strong>Mastercard:</strong> Starts with 5 or 2221-2720 (16 digits)</li>
              <li><strong>American Express:</strong> Starts with 34 or 37 (15 digits)</li>
              <li><strong>Discover:</strong> Starts with 6011, 622126-622925, 644-649, or 65</li>
              <li><strong>Diners Club:</strong> Starts with 300-305, 36, or 38 (14 digits)</li>
              <li><strong>JCB:</strong> Starts with 35 or 2131/1800</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Luhn algorithm:</h4>
            <CardDescription className="text-sm">
              The Luhn algorithm is a checksum formula used to validate credit card numbers. 
              It detects simple errors in typing or transmission of card numbers.
            </CardDescription>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Important note:</h4>
            <CardDescription className="text-sm text-amber-600">
              This tool only validates the format and checksum of card numbers. 
              It does not verify if the card is active, has sufficient funds, or belongs to a real account.
              Never use real credit card numbers for testing.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}