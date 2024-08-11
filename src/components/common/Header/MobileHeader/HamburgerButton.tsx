interface HamburgerButtonProps {
  toggleMenu: () => void;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ toggleMenu }) => {
  return (
    <button className="text-[#ffffff] focus:outline-none" onClick={toggleMenu}>
      <span className="text-2xl">&#9776;</span>
    </button>
  );
};

export default HamburgerButton;
