import PropTypes from "prop-types";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	ButtonGroup,
} from "@chakra-ui/react";

const YesNoModal = ({ open, onClose, headerText, bodyText, onYesClick }) => {
	return (
		<Modal
			closeOnOverlayClick={true}
			blockScrollOnMount={true}
			isOpen={open}
			onClose={onClose}
			isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{headerText}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>{bodyText}</ModalBody>
				<ModalFooter>
					<ButtonGroup>
						<Button onClick={onClose} variant="outline" colorScheme="red">
							No
						</Button>
						<Button onClick={onYesClick} colorScheme="yellow">
							Yes
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

YesNoModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	headerText: PropTypes.string,
	bodyText: PropTypes.string.isRequired,
	onYesClick: PropTypes.func.isRequired,
};

export default YesNoModal;
