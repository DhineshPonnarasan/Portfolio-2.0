import { notFound } from 'next/navigation';
import ContributionDetails from './_components/ContributionDetails';
import { MY_CONTRIBUTIONS } from '@/lib/data';
import { Metadata } from 'next';

export const generateStaticParams = async () => {
    return MY_CONTRIBUTIONS.map((contribution) => ({ slug: contribution.slug }));
};

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}) => {
    const { slug } = await params;
    const contribution = MY_CONTRIBUTIONS.find((c) => c.slug === slug);

    return {
        title: `${contribution?.title} - Open Source Contribution`,
        description: contribution?.description,
    } as Metadata;
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const contribution = MY_CONTRIBUTIONS.find((c) => c.slug === slug);

    if (!contribution) {
        return notFound();
    }

    return <ContributionDetails contribution={contribution} />;
};

export default Page;
