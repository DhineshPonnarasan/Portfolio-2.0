'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutMe = () => {
    const container = React.useRef<HTMLDivElement>(null);
    const [imgError, setImgError] = React.useState(false);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-in',
                    trigger: container.current,
                    start: 'top 70%',
                    end: 'bottom bottom',
                    scrub: 0.5,
                },
            });

            tl.from('.slide-up-and-fade', {
                y: 150,
                opacity: 0,
                stagger: 0.05,
            });
        },
        { scope: container },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-out',
                    trigger: container.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 0.5,
                },
            });

            tl.to('.slide-up-and-fade', {
                y: -150,
                opacity: 0,
                stagger: 0.02,
            });
        },
        { scope: container },
    );

    return (
        <section className="pb-section" id="about-me">
            <div className="container" ref={container}>
                <h2 className="text-4xl md:text-6xl font-thin mb-10 slide-up-and-fade">
                    I&apos;m{' '}
                    <span className="font-anton text-primary">DHINESH</span>
                </h2>

                <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-5 slide-up-and-fade">
                        <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/10 group">
                            <div className={`relative w-full h-full transition-opacity duration-300 ${imgError ? 'opacity-0 hidden' : 'opacity-100'}`}>
                                <Image
                                    src="/projects/images/Dhinesh.jpg"
                                    alt="Dhinesh Sadhu Subramaniam Ponnarasan"
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    onError={() => setImgError(true)}
                                    priority
                                />
                            </div>
                            {imgError && (
                                <div className="text-9xl font-anton text-white/5 select-none absolute inset-0 flex items-center justify-center">
                                    DP
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-7 flex flex-col justify-between gap-10">
                        <div className="space-y-6 slide-up-and-fade">
                            <p className="text-xl md:text-2xl font-light leading-relaxed">
                                I believe in a user centered design approach, ensuring that
                                the products I build are not only functional but also
                                intuitive and enjoyable to use.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                With a strong foundation in both frontend and backend
                                development, I have the ability to work across the
                                entire stack, from designing user interfaces to
                                architecting database schemas. I am passionate about
                                learning new technologies and staying up-to-date with
                                the latest industry trends.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-10 slide-up-and-fade">
                            <div>
                                <h3 className="text-xl font-anton mb-4 text-primary">
                                    DESIGN
                                </h3>
                                <p className="text-muted-foreground">
                                    I start by understanding the user&apos;s needs and
                                    goals, then I create wireframes and prototypes to
                                    visualize the solution. I focus on creating clean
                                    and modern designs that are easy to navigate and
                                    visually appealing.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-anton mb-4 text-primary">
                                    DEVELOPMENT
                                </h3>
                                <p className="text-muted-foreground">
                                    I use the latest technologies and best practices to
                                    build robust and scalable applications. I write
                                    clean and maintainable code, and I always test my
                                    work to ensure that it meets the highest quality
                                    standards.
                                </p>
                            </div>
                        </div>

                        <div className="slide-up-and-fade">
                            <p className="text-xl font-medium">
                                I strive to deliver experiences that not only
                                engage users but also drive tangible results.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
