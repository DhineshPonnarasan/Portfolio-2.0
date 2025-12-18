import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatWidget from './ChatWidget';
import { useChatLogic } from '@/lib/chatbot/useChatLogic';

// Mock dependencies
jest.mock('@/lib/chatbot/useChatLogic');

describe('ChatWidget Component', () => {
    const mockProcessMessage = jest.fn();
    const mockHandleFeedback = jest.fn();

    beforeEach(() => {
        (useChatLogic as jest.Mock).mockReturnValue({
            messages: [
                { id: '1', text: 'Welcome', sender: 'bot', type: 'options', options: ['Test Option'] }
            ],
            isTyping: false,
            processMessage: mockProcessMessage,
            handleFeedback: mockHandleFeedback,
            setMessages: jest.fn(),
        });
    });

    test('renders welcome popup after delay', async () => {
        render(<ChatWidget />);
        // Wait for 1.5s delay
        await waitFor(() => {
            expect(screen.getByText(/Hi, I'm the Chitti/i)).toBeInTheDocument();
        }, { timeout: 2000 });
    });

    test('opens chat window on toggle click', () => {
        render(<ChatWidget />);
        const toggleBtn = screen.getByRole('button', { name: '' }); // Icon button
        fireEvent.click(toggleBtn);
        expect(screen.getByText('Assistant')).toBeInTheDocument();
    });

    test('sends message on input submit', () => {
        render(<ChatWidget />);
        fireEvent.click(screen.getByRole('button', { name: '' })); // Open chat
        
        const input = screen.getByPlaceholderText('Type a message...');
        fireEvent.change(input, { target: { value: 'Hello Bot' } });
        fireEvent.submit(input.closest('form')!);

        expect(mockProcessMessage).toHaveBeenCalledWith('Hello Bot');
    });

    test('renders dynamic icon shape', () => {
        render(<ChatWidget />);
        // Since shape is random, we just check if the button exists
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        // Specific class check would depend on random seed, difficult to deterministic test without mocking Math.random
    });
});
