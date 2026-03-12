import Image from 'next/image'

const Hero = () => {
    return (
        <section id="hero" className="hero">
            <div className="tag-line" aria-label="Tag line">
                <span>Learn</span>
                <span className="circle" aria-hidden="true"></span>
                <span>Build</span>
                <span className="circle" aria-hidden="true"></span>
                <span>Inspire</span>
            </div>

            <div className="profile">
                <div className="profile-image">
                    <Image
                        src="/images/profile.png"
                        alt="profile picture"
                        width={360}
                        height={360}
                        priority
                        className="image-fix"
                    />
                </div>
                <div className="profile-text">
                    <h1>
                        Building high-performance systems and scalable data architecture.
                        Crafting experiences that leave a mark.
                    </h1>
                </div>
            </div>

            <ul className="other-profiles">
                <li>
                    <a href="" aria-label="LinkedIn">
                        <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                fill="currentColor"
                                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
                            />
                        </svg>
                    </a>
                </li>
                <li>
                    <a href="" aria-label="GitHub">
                        <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                fill="currentColor"
                                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                            />
                        </svg>
                    </a>
                </li>
                <li>
                    <a href="" aria-label="LeetCode">
                        <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <g
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.6"
                            >
                                <path d="M13.851 3L4.63 12a2.06 2.06 0 0 0 0 2.965l5.555 5.421c.84.819 2.2.819 3.038 0L16 17.676" />
                                <path d="m6.332 10.338l3.852-3.76a2.186 2.186 0 0 1 3.038 0l2.777 2.711M11 13h9" />
                            </g>
                        </svg>
                    </a>
                </li>
            </ul>
        </section>
    )
}

export default Hero
