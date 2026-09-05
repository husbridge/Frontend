import logo from "@assets/icons/logo.svg"

// Single source of the Husridge logo markup — previously duplicated between
// sidebar.tsx (desktop) and layout.tsx (mobile Drawer), which could drift.
const Logo = ({ className = "w-fit" }: { className?: string }) => (
    <img src={logo} alt="Husridge" className={className} />
)

export default Logo
