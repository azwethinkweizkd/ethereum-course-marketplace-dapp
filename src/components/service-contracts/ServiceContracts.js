import { useEffect, useState } from "react";
import {
	Box,
	Button,
	Divider,
	HStack,
	Heading,
	Card,
	Center,
	CardBody,
	Flex,
	Grid,
	GridItem,
	Spinner,
	Text,
	Tag,
	VStack,
	useToast,
	ButtonGroup,
	IconButton,
} from "@chakra-ui/react";
import { Icon, PhoneIcon, AtSignIcon } from "@chakra-ui/icons";
import { FaEthereum, FaStar } from "react-icons/fa";
import { GoThumbsup, GoThumbsdown } from "react-icons/go";
import { uniqueId } from "lodash";
import {
	CLIENT_APPROVED,
	CLIENT_UNAPPROVED,
	agreementStatusColors,
} from "../../common/constants";

const ServiceContract = ({
	agreement,
	onApproval,
	onRating,
	onDeposit,
	onRefund,
}) => {
	const {
		provider,
		agreementAddress,
		clientRating,
		agreementStatus,
		clientApprovalStatusKey,
		agreementFulfilledOrNullified,
		contractBalance,
		agreementStatusKey,
	} = agreement;

	const { companyName, email, phone, serviceCategory, serviceCost } = provider;

	const [currentRating, setCurrentRating] = useState(clientRating);
	const [hover, setHover] = useState(0);
	const [submitting, setSubmitting] = useState(false);
	const [, setApproval] = useState(clientApprovalStatusKey);
	const [contractStatusLabelColor, setContractStatusLabelColor] =
		useState("grey");

	const toast = useToast();

	useEffect(() => {
		setApproval(clientApprovalStatusKey);
		const statusColor = agreementStatusColors[agreementStatusKey];
		console.log(statusColor);
		setContractStatusLabelColor(statusColor);
	}, [agreementStatusKey, clientApprovalStatusKey]);

	async function onHandlingApproval() {
		setSubmitting(true);
		try {
			const tx = await onApproval(agreementAddress, CLIENT_APPROVED);
			const receipt = await tx.wait();

			if (receipt.status) setApproval(CLIENT_APPROVED);
		} catch (error) {
			toast({
				title: null,
				description:
					"There was an error approving your service contract agreement",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		} finally {
			setSubmitting(false);
		}
	}

	async function onHandlingDisapproval() {
		setSubmitting(true);
		try {
			const tx = await onApproval(agreementAddress, CLIENT_UNAPPROVED);
			const receipt = await tx.wait();

			if (receipt.status) setApproval(CLIENT_UNAPPROVED);
		} catch (error) {
			toast({
				title: null,
				description:
					"There was an error approving your service contract agreement",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		} finally {
			setSubmitting(false);
		}
	}

	async function onHandlingRating(rating) {
		setSubmitting(true);
		try {
			const tx = await onRating(agreementAddress, rating);
			const receipt = await tx.wait();

			if (receipt.status) setCurrentRating(rating);
		} catch (error) {
			toast({
				title: null,
				description: "There was an error rating provider service",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		} finally {
			setSubmitting(false);
		}
	}

	async function onHandlingDeposit() {
		setSubmitting(true);

		try {
			await onDeposit(agreementAddress, serviceCost);
		} catch (error) {
			toast({
				title: null,
				description: "There was an error attempting to deposit funds",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		} finally {
			setSubmitting(false);
		}
	}

	async function onHandlingRefund() {
		setSubmitting(true);

		try {
			await onRefund(agreementAddress);
		} catch (error) {
			toast({
				title: null,
				description: "There was an error refunding the balance",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<>
			{submitting ? (
				<Center>
					<HStack
						alignContent="center"
						backgroundColor="white"
						p={12}
						rounded="2xl"
						border="2px solid black">
						<Spinner
							thickness="4px"
							speed="0.65s"
							emptyColor="gray.200"
							color="blue.500"
							size="xl"
						/>
						<Heading>
							Updating contract, please confirm change in MetaMask wallet
						</Heading>
					</HStack>
				</Center>
			) : (
				<Box mb={4}>
					<Card border="4px solid black">
						<CardBody>
							<Grid
								templateColumns="repeat(12, 1fr)"
								alignItems="center"
								gap={4}
								mx="auto">
								<GridItem colSpan={3}>
									<VStack textAlign="center">
										<Heading as="h4" size="md">
											{companyName}
										</Heading>
										<Text>{serviceCategory}</Text>
									</VStack>
								</GridItem>
								<GridItem colSpan={3}>
									<VStack textAlign="center">
										<HStack alignContent="center">
											<AtSignIcon />
											<Text>{email}</Text>
										</HStack>
										<Divider />
										<HStack alignContent="center">
											<PhoneIcon />
											<Text>{phone}</Text>
										</HStack>
									</VStack>
								</GridItem>
								<GridItem colSpan={2}>
									<VStack textAlign="center">
										<Heading as="h4" size="lg">
											Service Status
										</Heading>
										<Tag
											colorScheme={contractStatusLabelColor}
											px={6}
											py={2}
											fontWeight="700">
											{agreementStatus}
										</Tag>
									</VStack>
								</GridItem>
								<GridItem colSpan={2}>
									<VStack textAlign="center">
										<Heading as="h4" size="lg">
											Service Cost
										</Heading>
										<Tag>
											<Icon as={FaEthereum} />
											{serviceCost}
										</Tag>
									</VStack>
								</GridItem>
								<GridItem colSpan={1}>
									<VStack textAlign="center">
										<Heading as="h4" size="lg">
											Balance
										</Heading>
										<Tag>
											<Icon as={FaEthereum} />
											{contractBalance}
										</Tag>
									</VStack>
								</GridItem>

								{!agreementFulfilledOrNullified && agreementStatus !== 3 && (
									<GridItem colSpan={1}>
										<Center textAlign="center">
											<Button
												colorScheme="cyan"
												variant="solid"
												onClick={onHandlingDeposit}
												disabled={
													agreementFulfilledOrNullified ||
													contractBalance === serviceCost
												}>
												Deposit
											</Button>
										</Center>
									</GridItem>
								)}

								{!agreementFulfilledOrNullified && agreementStatus === 3 && (
									<GridItem colSpan={1}>
										<Center textAlign="center" colorScheme="pink">
											<Button
												onClick={onHandlingRefund}
												disabled={agreementFulfilledOrNullified}>
												Refund
											</Button>
										</Center>
									</GridItem>
								)}
							</Grid>
							{agreementStatus === "Completed" &&
								!agreementFulfilledOrNullified && (
									<Flex pt={4}>
										<HStack>
											<Text>Was the service by {companyName} completed?</Text>
											<ButtonGroup>
												<IconButton
													icon={<GoThumbsup />}
													isRound={true}
													colorScheme="green"
													color="white"
													onClick={() => onHandlingApproval()}
												/>
												<IconButton
													icon={<GoThumbsdown />}
													isRound={true}
													colorScheme="red"
													color="white"
													onClick={() => onHandlingDisapproval()}
												/>
											</ButtonGroup>
										</HStack>
										<Center flex="1">
											<VStack>
												<Text>Rating</Text>
												<HStack spacing="2px">
													{[...Array(5)].map((_, index) => {
														const ratingValue = index + 1;
														const uniqueIdKey = uniqueId();
														return (
															<Box
																key={uniqueIdKey}
																color={
																	ratingValue <= (hover || currentRating)
																		? "#ffc107"
																		: "#e4e5e9"
																}
																onMouseEnter={() => setHover(ratingValue)}
																onMouseLeave={() => setHover(0)}
																onClick={() => onHandlingRating(ratingValue)}>
																<FaStar
																	key={uniqueIdKey}
																	cursor="pointer"
																	size={20}
																	transition="color 200ms"
																/>
															</Box>
														);
													})}
												</HStack>
											</VStack>
										</Center>
									</Flex>
								)}
						</CardBody>
					</Card>
				</Box>
			)}
		</>
	);
};

export default ServiceContract;
