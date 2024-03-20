import { Container, Heading, Icon } from "@chakra-ui/react";
import { FaFileContract } from "react-icons/fa6";
import PropTypes from "prop-types";

const Placeholder = ({ state }) => {
	return (
		<Container>
			<Heading>
				<Icon as={FaFileContract} />
				<br />
				You have not {state} at this time.
			</Heading>
		</Container>
	);
};

Placeholder.propTypes = {
	state: PropTypes.string.isRequired,
};

export default Placeholder;
