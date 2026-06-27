import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContributionDetails from './_components/ContributionDetails';
import { MY_CONTRIBUTIONS } from '@/lib/data';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { buildContributionJsonLd, buildBreadcrumbJsonLd } from '@/lib/jsonld';

export const generateStaticParams = async () => {
    return MY_CONTRIBUTIONS.map((contribution) => ({ slug: contribution.slug }));
};

const slugToOrgIcon = (slug: string) => {
    const c = MY_CONTRIBUTIONS.find((entry) => entry.slug === slug);
    if (!c) return `${SITE_URL}/logo/og-image.png`;
    // Map to the actual brand icon if one exists in /logo/.
    const org = c.org.toLowerCase();
    if (/codegraphcontext/.test(org)) return `${SITE_URL}/logo/codegraphcontext.svg`;
    if (/olake|datazip/.test(org)) return `${SITE_URL}/logo/olake.svg`;
    if (/microsoft/.test(org)) return `${SITE_URL}/logo/microsoft.svg`;
    if (/nvidia|megatron|tensorrt/.test(org)) return `${SITE_URL}/logo/nvidia.png`;
    if (/scanapi/.test(org)) return `${SITE_URL}/logo/scanapi.svg`;
    return `${SITE_URL}/logo/og-image.png`;
};

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
    const { slug } = await params;
    const contribution = MY_CONTRIBUTIONS.find((c) => c.slug === slug);

    if (!contribution) {
        return {
            title: 'Contribution not found',
            robots: { index: false, follow: false },
        };
    }

    const pageUrl = `${SITE_URL}/opensource/${contribution.slug}`;
    const title = `${contribution.title} · Open Source Contribution`;
    const description = contribution.description;

    return {
        title,
        description,
        alternates: { canonical: pageUrl },
        openGraph: {
            type: 'article',
            url: pageUrl,
            title: `${title} · ${SITE_NAME}`,
            description,
            images: [{ url: slugToOrgIcon(contribution.slug), alt: contribution.org }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} · ${SITE_NAME}`,
            description,
            images: [slugToOrgIcon(contribution.slug)],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const contribution = MY_CONTRIBUTIONS.find((c) => c.slug === slug);

    if (!contribution) {
        return notFound();
    }

    const jsonLd = buildContributionJsonLd(contribution.slug);
    const pageUrl = `${SITE_URL}/opensource/${contribution.slug}`;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: jsonLd }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: buildBreadcrumbJsonLd([
                        { name: 'Home', url: SITE_URL },
                        { name: 'Open Source', url: `${SITE_URL}/#open-source` },
                        { name: contribution.org, url: pageUrl },
                    ]),
                }}
            />
            <ContributionDetails contribution={contribution} />
        </>
    );
};

export default Page;
