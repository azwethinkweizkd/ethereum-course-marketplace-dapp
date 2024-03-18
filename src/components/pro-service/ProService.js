import {
	Box,
	Card,
	CardBody,
	Grid,
	GridItem,
	Heading,
	Text,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";

const ProService = ({ service }) => {
	const {
		companyName,
		serviceCost,
		serviceCategory,
		phone,
		email,
		ownerAddress,
	} = service;

	return (
		<Box px={24}>
			<Card>
				<CardBody>
					<Grid templateRows="repeat(2, 1fr)" gap={6}>
						<GridItem>
							<Grid templateColumns="repeat(12, 1fr)" gap={4}>
								<GridItem colSpan={2}>
									<Heading as="h4" textAlign="center">
										Company Name
									</Heading>
								</GridItem>
								<GridItem colSpan={2}>
									<Heading as="h4" textAlign="center">
										Service Cost
									</Heading>
								</GridItem>
								<GridItem colSpan={2}>
									<Heading as="h4" textAlign="center">
										Service Category
									</Heading>
								</GridItem>
								<GridItem colSpan={2}>
									<Heading as="h4" textAlign="center">
										Phone
									</Heading>
								</GridItem>
								<GridItem colSpan={2}>
									<Heading as="h4" textAlign="center">
										Email
									</Heading>
								</GridItem>
								<GridItem colSpan={2}>
									<Heading as="h4" textAlign="center">
										0xAddress
									</Heading>
								</GridItem>
							</Grid>
						</GridItem>
						<GridItem>
							<Grid templateColumns="repeat(12, 1fr)" gap={4}>
								<GridItem colSpan={2}>
									<Text textAlign="center">{companyName}</Text>
								</GridItem>
								<GridItem colSpan={2}>
									<Text textAlign="center">{serviceCost}</Text>
								</GridItem>
								<GridItem colSpan={2}>
									<Text textAlign="center">{serviceCategory}</Text>
								</GridItem>
								<GridItem colSpan={2}>
									<Text textAlign="center">
										<PhoneIcon />
										{phone}
									</Text>
								</GridItem>
								<GridItem colSpan={2}>
									<Text textAlign="center">{email}</Text>
								</GridItem>
								<GridItem colSpan={2}>
									<Text textAlign="center">{ownerAddress}</Text>
								</GridItem>
							</Grid>
						</GridItem>
					</Grid>
				</CardBody>
			</Card>
		</Box>
	);
};

export default ProService;
