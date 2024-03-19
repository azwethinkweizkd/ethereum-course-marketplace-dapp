import { Container, Heading, Icon } from "@chakra-ui/react";
import { FaFileArchive } from "react-icons/fa";
import PropTypes from "prop-types";

const Placeholder = ({ state }) => {
	return (
		<Container>
			<Heading>
				<Icon as={FaFileArchive} />
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
