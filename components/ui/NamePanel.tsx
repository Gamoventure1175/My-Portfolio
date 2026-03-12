import Image from "next/image"


const NamePanel = () => {
    return (
        <div className="name-panel">
            <a href="#" aria-label="Home">
                <Image
                    src="/images/gamoventure_logo.png"
                    alt="Gamoventure logo"
                    width={320}
                    height={320}
                    className="logo-image"
                    priority
                />
            </a>
            <span className="sr-only">Gaurav Mahajan</span>
            <div className="name-stack" aria-hidden="true">
                <p>G</p>
                <p>A</p>
                <p>U</p>
                <p>R</p>
                <p>A</p>
                <p>V</p>
                <span className="name-break"></span>
                {/* <p>A</p>
                <p>B</p>
                <p>H</p>
                <p>I</p>
                <p>M</p>
                <p>A</p>
                <p>N</p>
                <span className="name-break"></span> */}
                <p>M</p>
                <p>A</p>
                <p>H</p>
                <p>A</p>
                <p>J</p>
                <p>A</p>
                <p>N</p>
            </div>
        </div>
    )
}

export default NamePanel
