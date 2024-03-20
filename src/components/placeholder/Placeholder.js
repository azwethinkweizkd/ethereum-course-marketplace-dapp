import { Container, Heading, Icon, VStack } from "@chakra-ui/react";
import { FaFileContract } from "react-icons/fa6";
import PropTypes from "prop-types";

const Placeholder = ({ state }) => {
	return (
		<Container backgroundColor="white" p={4} rounded="2xl">
			<VStack textAlign="center">
				<Heading>
					<Icon as={FaFileContract} />
					<br />
					You have no {state} contracts at this time.
				</Heading>
			</VStack>
		</Container>
	);
};

Placeholder.propTypes = {
	state: PropTypes.string.isRequired,
};

export default Placeholder;
