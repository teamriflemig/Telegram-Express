'use client';

import { useState, useRef, useEffect } from 'react';
import { countries, Country } from '../data/countries';
import dynamic from 'next/dynamic';

// Dynamically import EmojiPicker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });
import { Theme } from 'emoji-picker-react';

export default function Home() {
  // --- States ---
  // phoneNumber: Stores the user input for the phone number
  const [phoneNumber, setPhoneNumber] = useState('');

  // message: Stores the text message the user wants to send
  const [message, setMessage] = useState('');

  // selectedCountry: Stores the currently selected country object (flag, dial code, etc.)
  // Default is Malaysia ('MY') if found, otherwise the first country in the list
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find(c => c.code === 'MY') || countries[0]
  );

  // isModalOpen: Controls the visibility of the country selection modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // showEmojiPicker: Toggle for the emoji selection popup
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // emojiPickerRef: Used to detect clicks outside the emoji picker to close it automatically
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  // This effect listens for click events on the whole document.
  // If a click is detected outside the emoji picker, it closes the picker.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Functions ---

  /**
   * handleSend: Processes the inputs and opens the Telegram chat.
   * 1. Cleans the phone number (removes non-digits and leading zeros).
   * 2. Combines dial code and number.
   * 3. Encodes the message for URL usage.
   * 4. Constructs the official Telegram link (t.me).
   * 5. Opens the link in a new browser tab.
   */
  const handleSend = () => {
    // Remove all non-numeric characters from the input
    let cleanNumber = phoneNumber.replace(/\D/g, '');

    // Most dial codes replace the leading '0', so we remove it if present
    if (cleanNumber.startsWith('0')) {
      cleanNumber = cleanNumber.substring(1);
    }

    // If the user entered the dial code themselves, strip it so we don't double up
    // We check if the cleanNumber starts with the dial code digits (e.g., '60')
    const dialCodeDigits = selectedCountry.dial_code.replace('+', '');
    if (cleanNumber.startsWith(dialCodeDigits)) {
      cleanNumber = cleanNumber.substring(dialCodeDigits.length);
    }

    // Combine the country dial code (e.g., +60) with the cleaned number
    const fullNumber = selectedCountry.dial_code + cleanNumber;

    // Convert the text message into a URL-safe format
    const encodedMessage = encodeURIComponent(message);

    // Construct the final URL: https://t.me/+PHONE_NUMBER?text=MESSAGE
    // Telegram phone links MUST start with '+'
    const telegramUrl = `https://t.me/${fullNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;

    // Open the generated link in a new window/tab
    window.open(telegramUrl, '_blank');
  };

  /**
   * onEmojiClick: Triggered when an emoji is picked.
   * It appends the selected emoji to the current message state.
   */
  const onEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  return (
    <main>
      <div className="card">
        <h1>Telegram Express 🚀</h1>
        <p className="subtitle">Send Telegram messages without saving contacts.</p>

        {/* --- Phone Number Section --- */}
        <div className="form-group">
          <label>Phone Number</label>
          <div className="input-container">
            {/* Country Selector Button: Opens the modal on click */}
            <button
              className="country-select"
              onClick={() => setIsModalOpen(true)}
              type="button"
            >
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.dial_code}</span>
              <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>▼</span>
            </button>
            <input
              type="tel"
              placeholder="123456789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        {/* --- Message Section --- */}
        <div className="form-group">
          <label>Message (Optional)</label>
          <div className="input-container" style={{ flexDirection: 'column' }}>
            <textarea
              placeholder="Say something nice..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {/* Action Bar for Message: Clear button and Emoji selector */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px', gap: '10px' }}>
              <button
                className="clear-btn"
                onClick={() => setMessage('')}
                type="button"
                title="Clear Message"
                disabled={!message} // Button is greyed out if there's no text
              >
                Clear
              </button>
              <button
                className="emoji-btn"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                type="button"
              >
                😊
              </button>
              {/* Conditional rendering of the Emoji Picker */}
              {showEmojiPicker && (
                <div className="emoji-picker-container" ref={emojiPickerRef}>
                  <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.DARK} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Primary Action Button --- */}
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!phoneNumber} // Disabled until a phone number is entered
        >
          Send to Telegram
        </button>

        {/* Helpful User Tip */}
        <div className="file-reminder">
          💡 <strong>File Tip:</strong> Telegram links only support text.
          To send files, just click Send and then drag your files
          into the chat that opens!
        </div>
      </div>

      {/* Footer Area */}
      <footer>
        <a href="https://github.com/teamriflemig/Telegram-Express" target="_blank" rel="noopener noreferrer">Github Project Page</a> by teamriflemig &copy; 2026
      </footer>

      {/* --- Country Selection Modal --- */}
      {/* Renders only when isModalOpen is true */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Country</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
            </div>
            <div className="modal-body">
              {/* Map through the countries array to generate the list items */}
              {countries.map((country) => (
                <div
                  key={country.code}
                  className="country-item"
                  onClick={() => {
                    setSelectedCountry(country);
                    setIsModalOpen(false);
                  }}
                >
                  <span className="flag">{country.flag}</span>
                  <span className="name">{country.name}</span>
                  <span className="dial">{country.dial_code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Visitor Counter */}
      <div className="visitor-counter" title="Total Visitors">
        <span className="visitor-label">Visitors:</span>
        <img
          src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fteamriflemig%2Ftele-express&count_bg=%2324A1DE&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false"
          alt="Visitor Counter"
        />
      </div>
    </main>
  );
}
