import PropTypes from "prop-types";
import {
	Card,
	CardBody,
	Button,
	List,
	ListItem,
	ListIcon,
	WrapItem,
	VStack,
	Box,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { PhoneIcon, AtSignIcon } from "@chakra-ui/icons";
import { IoBusiness } from "react-icons/io5";
import { FaEthereum, FaBusinessTime } from "react-icons/fa";
import YesNoModal from "./YesNoModal";

const ServiceProvider = ({ provider }) => {
	const {
		companyName,
		email,
		phone,
		serviceCategory,
		serviceCategoryKey,
		serviceCost,
	} = provider;

	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<WrapItem>
			<Card boxShadow="2xl" rounded="2xl" minW="500px" border="2px solid black">
				<CardBody pt={12} pb={8} px={12}>
					<VStack>
						<List spacing={2}>
							<ListItem>
								<ListIcon as={IoBusiness} fontSize="2xl" />
								<Text as="b" fontSize="2xl">
									{companyName}
								</Text>
							</ListItem>
							<ListItem>
								<ListIcon as={PhoneIcon} fontSize="2xl" />
								<Text as="b" fontSize="2xl">
									{phone}
								</Text>
							</ListItem>
							<ListItem>
								<ListIcon as={AtSignIcon} fontSize="2xl" />
								<Text as="b" fontSize="2xl">
									{email}
								</Text>
							</ListItem>
							<ListItem>
								<ListIcon as={FaEthereum} fontSize="2xl" />
								<Text as="b" fontSize="2xl">
									{serviceCost}
								</Text>
							</ListItem>
							<ListItem value={serviceCategoryKey}>
								<ListIcon as={FaBusinessTime} fontSize="2xl" />
								<Text as="b" fontSize="2xl">
									{serviceCategory}
								</Text>
							</ListItem>
						</List>
						<Box py={4} width="100%">
							<Button
								width="100%"
								colorScheme="yellow"
								fontSize="xl"
								onClick={onOpen}>
								Contract
							</Button>

							<YesNoModal
								open={isOpen}
								onClose={onClose}
								headerText="Confirm contract agreement"
								bodyText={`Are you sure you want to contract 
											${companyName} for the amount of ${serviceCost} (Wei)? 
											ou will have a change to fund the contract from the contracts page.`}
							/>
						</Box>
					</VStack>
				</CardBody>
			</Card>
		</WrapItem>
	);
};

ServiceProvider.propTypes = {
	provider: PropTypes.object.isRequired,
};

export default ServiceProvider;