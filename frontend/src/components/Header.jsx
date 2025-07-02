import LogoutButton from "./LogoutButton";
import '../styles/Header.css';

function Header() {
    const user = JSON.parse(localStorage.getItem('user'));

    return(
        <header>
            <div className="acc">
                <img src="src/images/acc.png" />
                <p>{user.name}</p>
            </div>

            <LogoutButton />
        </header>
    )
}

export default Header;