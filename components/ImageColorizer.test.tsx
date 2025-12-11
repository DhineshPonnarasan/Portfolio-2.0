import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageColorizer from '../ImageColorizer';

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');

describe('ImageColorizer Component', () => {
    it('renders correctly', () => {
        render(<ImageColorizer />);
        expect(screen.getByText('AI Image Colorizer')).toBeInTheDocument();
        expect(screen.getByText('Click or drag image here')).toBeInTheDocument();
    });

    it('validates file type', async () => {
        render(<ImageColorizer />);
        const input = screen.getByLabelText(/Click or drag image here/i, { selector: 'input' });
        
        const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText('Please upload a valid JPG or PNG image.')).toBeInTheDocument();
        });
    });

    it('updates intensity slider', () => {
        render(<ImageColorizer />);
        const slider = screen.getByRole('slider', { name: /intensity/i }); // Note: Requires aria-label on input
        fireEvent.change(slider, { target: { value: '80' } });
        expect(slider).toHaveValue('80');
    });

    // More tests would be implemented here for color conversion logic
    // verifying that canvas operations are called correctly
});
