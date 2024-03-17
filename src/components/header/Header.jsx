import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";

export default function Header() {
	return (
		<header>
			<div>
				<ChakraLink as={ReactRouterLink} to="/">
					Home
				</ChakraLink>
			</div>
		</header>
	);
}
