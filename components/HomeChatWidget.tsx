'use client';

import { usePathname } from 'next/navigation';
import ChatWidget from './ChatWidget';

const HomeChatWidget = () => {
    const pathname = usePathname();

    if (!pathname || pathname !== '/') {
        return null;
    }

    return <ChatWidget />;
};

export default HomeChatWidget;
