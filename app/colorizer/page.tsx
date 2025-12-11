import ImageColorizer from '@/components/ImageColorizer';
import SectionTitle from '@/components/SectionTitle';

export default function ColorizerPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 container">
            <div className="mb-12 text-center">
                <SectionTitle title="Colorizer Tool" />
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
                    Experience our advanced image processing capabilities. Upload your black and white photos and watch them come to life with vibrant colors.
                </p>
            </div>
            
            <ImageColorizer />
        </main>
    );
}
