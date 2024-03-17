import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
export default function Header() {
    return (
        <header>
            <div className="menu">
                <Menu pointing secondary>
                    <Menu.Menu>
                        <Menu.Item as={Link} name="home" to="/" />
                    </Menu.Menu>
                </Menu>
            </div>
        </header>
    );
}
