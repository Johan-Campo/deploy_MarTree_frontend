import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to={"/"}>
            <img src="/logo_MarTree.svg" alt="logotipo MarTree" className="block justify-center" />
        </Link>
    );
}