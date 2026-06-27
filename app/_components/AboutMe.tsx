'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

import Image from 'next/image';
import { ABOUT_ME_BLUR_DATA_URL } from '@/lib/blur-data-urls';

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
                        <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/10 group mx-auto lg:mx-0">
                            <div className={`relative w-full h-full transition-opacity duration-300 ${imgError ? 'opacity-0 hidden' : 'opacity-100'}`}>
                                <Image
                                    src="/projects/images/Dhinesh.jpg"
                                    alt="Dhinesh Sadhu Subramaniam Ponnarasan"
                                    fill
                                    sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    onError={() => setImgError(true)}
                                    priority
                                    placeholder="blur"
                                    blurDataURL={ABOUT_ME_BLUR_DATA_URL}
                                />
                            </div>
                            {imgError && (
                                <div
                                    role="img"
                                    aria-label="Profile initials: DP"
                                    className="text-9xl font-anton text-white/5 select-none absolute inset-0 flex items-center justify-center"
                                >
                                    DP
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-7 flex flex-col justify-between gap-10">
                        <div className="space-y-6 slide-up-and-fade">
                            <p className="text-xl md:text-2xl font-light leading-relaxed">
                                I&apos;m Dhinesh — an AI/ML engineer currently interning at
                                <span className="text-primary"> Uplifty AI</span> in Austin and
                                pursuing my MS in Information Systems (Applied Data Science) at
                                <span className="text-primary"> SUNY Binghamton</span>.
                                I build production systems at the seam where research meets
                                infrastructure: gradient-boosted ensembles, transformer-powered
                                NLP, streaming data pipelines, and the FastAPI services that
                                put them in front of users.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Outside of work I contribute upstream to
                                <span className="text-primary"> Microsoft</span>,
                                <span className="text-primary"> NVIDIA Megatron-LM</span>,
                                <span className="text-primary"> NVIDIA TensorRT-LLM</span>,
                                <span className="text-primary"> CodeGraphContext</span>,
                                <span className="text-primary"> Scanapi</span>, and
                                <span className="text-primary"> OLake</span> — adding regression
                                tests, hardening protocol validation, pinning supply chains
                                to immutable SHAs, and shipping the kind of fixes that compound
                                across releases.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                What I care about most: clean abstractions, observable systems,
                                reproducible experiments, and writing code that the next person
                                on the team can actually maintain.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-10 slide-up-and-fade">
                            <div>
                                <h3 className="text-xl font-anton mb-4 text-primary">
                                    AI/ML + SYSTEMS
                                </h3>
                                <p className="text-muted-foreground">
                                    Comfortable going from a notebook prototype to a
                                    containerised inference service — feature stores,
                                    SHAP-driven explainability, Airflow retraining loops,
                                    and p99 latency budgets that someone will actually
                                    enforce.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-anton mb-4 text-primary">
                                    OPEN SOURCE
                                </h3>
                                <p className="text-muted-foreground">
                                    I treat upstream contributions like production
                                    work: regression tests, clear commit messages, supply
                                    chain pinning, and PRs that respect the maintainers&apos;
                                    review bandwidth.
                                </p>
                            </div>
                        </div>

                        <div className="slide-up-and-fade">
                            <p className="text-xl font-medium">
                                I&apos;m at my best when the problem is ambiguous,
                                the data is messy, and the answer has to ship next week.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
