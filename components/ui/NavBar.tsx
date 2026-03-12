import { navLinksRight } from "@/data/portfolio"


const NavBar = () => {
    return (
        <nav aria-label="Primary">
            <div>
                {/* <a href="#" className="flex items-center gap-2">
                    <Image
                        src="/images/gamoventure_logo.png"
                        alt="Gamoventure logo"
                        width={320}
                        height={320}
                        className="size-18"
                        priority
                    />
                    <p>Gaurav</p>
                </a> */}
                <ul className="">
                    {navLinksRight.map(({ id, title }) => (
                        <li key={id}>
                            <a href={`#${id}`}>{title}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar
