import type { Metadata, Viewport } from 'next';
import { Anton, Roboto_Flex } from 'next/font/google';
import { ReactLenis } from 'lenis/react';

import 'lenis/dist/lenis.css';
import './globals.css';

import Navbar from '@/components/Navbar';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import ClientMounts from '@/components/ClientMounts';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { LoadingProvider } from './context/LoadingContext';
import { AudioProvider } from '@/components/AudioProvider';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_LOCALE, SITE_TWITTER, OG_IMAGE } from '@/lib/site';

const antonFont = Anton({
    weight: '400',
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-anton',
    display: 'swap',
});

const robotoFlex = Roboto_Flex({
    weight: '400',
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-roboto-flex',
    display: 'swap',
});

export const viewport: Viewport = {
    themeColor: '#00FF66',
    colorScheme: 'dark',
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} — AI/ML Engineer`,
        template: `%s · ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: [
        'Dhinesh Ponnarasan',
        'AI Engineer',
        'Machine Learning',
        'Portfolio',
        'Software Engineer',
        'Next.js',
        'Groq',
    ],
    authors: [{ name: 'Dhinesh Ponnarasan', url: SITE_URL }],
    creator: 'Dhinesh Ponnarasan',
    openGraph: {
        type: 'website',
        locale: SITE_LOCALE,
        url: SITE_URL,
        siteName: SITE_NAME,
        title: `${SITE_NAME} — AI/ML Engineer`,
        description: SITE_DESCRIPTION,
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: 'Dhinesh Ponnarasan — Portfolio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} — AI/ML Engineer`,
        description: SITE_DESCRIPTION,
        images: [OG_IMAGE],
        creator: SITE_TWITTER,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/logo/favicon.ico',
    },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-MHLY1LNGY5';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
            <Script id="hotjar" strategy="afterInteractive">
                {`(function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6380611,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
            </Script>
            <body
                className={`${antonFont.variable} ${robotoFlex.variable} antialiased min-h-screen overflow-y-auto overflow-x-hidden relative`}
                suppressHydrationWarning
            >
                <ReactLenis
                    root
                    options={{
                        lerp: 0.1,
                        duration: 1.4,
                    }}
                >
                    <LoadingProvider>
                        <AudioProvider>
                            <ClientMounts />
                            <Navbar />
                            <ScrollProgressIndicator />
                            {children}
                        </AudioProvider>
                    </LoadingProvider>
                </ReactLenis>
            </body>
        </html>
    );
}