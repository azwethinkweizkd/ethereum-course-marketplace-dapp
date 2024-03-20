import { useEffect, useState } from "react";
import {
	AbsoluteCenter,
	Box,
	Button,
	HStack,
	Heading,
	Card,
	CardBody,
	Grid,
	GridItem,
	Icon,
	Spinner,
	Select,
	Text,
	Tag,
	VStack,
	useToast,
} from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa6";
import {
	CLIENT_APPROVED,
	agreementStatuses,
	clientApprovalStatuses,
	clientApprovalStatusColor,
} from "../../common/constants";
// import {
// 	clientApprovalButtonColor,
// 	contractStatusColor,
// } from "../../../lib/utilities";

const ServiceAgreement = ({ agreement, onStatusChange, onPaymentRequest }) => {
	const {
		clientAddress,
		termsAmount,
		agreementAddress,
		clientApprovalStatusKey,
		agreementStatusKey,
		contractBalance,
		agreementFulfilledOrNullified,
	} = agreement;

	const [approvalLabelColor, setApprovalLabelColor] = useState("grey");
	const [submitting, setSubmitting] = useState(false);
	const [agreementCompleted, setAgreementCompleted] = useState(false);
	const [selectedAgreementStatus, setSelectedAgreementStatus] = useState({
		value: agreementStatusKey,
		label: agreementStatuses[agreementStatusKey],
	});

	const toast = useToast();

	useEffect(() => {
		const approvalColor = clientApprovalStatusColor[clientApprovalStatusKey];
		setApprovalLabelColor(approvalColor);
	}, [agreementStatusKey, clientApprovalStatusKey]);

	useEffect(() => {
		const agreementComplete =
			clientApprovalStatusKey === CLIENT_APPROVED &&
			selectedAgreementStatus.value === agreementStatusKey;

		setAgreementCompleted(agreementComplete);
	}, [selectedAgreementStatus, agreementStatusKey, clientApprovalStatusKey]);

	async function onHandlingStatusChange(selection) {
		setSubmitting(true);

		try {
			const tx = await onStatusChange(agreementAddress, selection.target.value);
			const results = await tx.wait();

			console.log(tx, results);

			if (results.status === 1) {
				setSelectedAgreementStatus(selection);
			} else {
				toast({
					title: null,
					description: "Status not changed, please try again",
					status: "warning",
					duration: 9000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: null,
				description: "There was an error changing the service status",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		} finally {
			setSubmitting(false);
		}
	}

	async function onHandlingPaymentRequest() {
		setSubmitting(true);

		try {
			await onPaymentRequest(agreementAddress);
		} catch (error) {
			toast({
				title: null,
				description: "There was an error requesting for payment",
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
				<AbsoluteCenter>
					<HStack alignContent="center">
						<Spinner
							thickness="4px"
							speed="0.65s"
							emptyColor="gray.200"
							color="blue.500"
							size="xl"
						/>
						<Heading>Creating contract</Heading>
					</HStack>
				</AbsoluteCenter>
			) : (
				<Box>
					<Card>
						<CardBody>
							<Grid templateRows="repeat(2, 1fr)" gap={6}>
								<GridItem textAlign="center">
									<Grid
										templateColumns="repeat(10, 1fr)"
										gap={4}
										alignItems="center">
										<GridItem colSpan={2}>
											<Heading as="h5" size="md">
												Client Address
											</Heading>
										</GridItem>

										<GridItem colSpan={2}>
											<Heading as="h5" size="md">
												Service Cost
											</Heading>
										</GridItem>

										<GridItem colSpan={2}>
											<Heading as="h5" size="md">
												Agreement Balance
											</Heading>
										</GridItem>

										<GridItem colSpan={2}>
											<Heading as="h5" size="md">
												Agreement Status
											</Heading>
										</GridItem>

										<GridItem colSpan={2}>
											<Heading as="h5" size="md">
												Client Approval Status
											</Heading>
										</GridItem>
									</Grid>
								</GridItem>
								<GridItem textAlign="center">
									<Grid
										templateColumns="repeat(10, 1fr)"
										gap={4}
										alignItems="center">
										<GridItem colSpan={2}>
											<Text>{clientAddress}</Text>
										</GridItem>

										<GridItem colSpan={2}>
											<Text>
												<Icon as={FaEthereum} />
												{termsAmount}
											</Text>
										</GridItem>

										<GridItem colSpan={2}>
											<Tag>
												<Icon as={FaEthereum} />
												{contractBalance}
											</Tag>
										</GridItem>

										<GridItem colSpan={2}>
											<Select
												value={selectedAgreementStatus.value}
												onChange={onHandlingStatusChange}
												isDisabled={agreementFulfilledOrNullified}>
												{Object.entries(agreementStatuses).map(
													([key, value]) => (
														<option value={parseInt(key)} key={key}>
															{value}
														</option>
													)
												)}
											</Select>
										</GridItem>

										<GridItem colSpan={2}>
											<Tag
												backgroundColor={approvalLabelColor}
												color="white"
												p={3}
												fontSize="16px"
												fontWeight="700">
												{clientApprovalStatuses[clientApprovalStatusKey]}
											</Tag>
										</GridItem>
									</Grid>
								</GridItem>
							</Grid>
							{(!!agreementCompleted || agreementFulfilledOrNullified) && (
								<Box pt={4}>
									<Button
										colorScheme="cyan"
										isDisabled={
											!agreementCompleted || agreementFulfilledOrNullified
										}
										onClick={onHandlingPaymentRequest}>
										Request Payment
									</Button>
								</Box>
							)}
						</CardBody>
					</Card>
				</Box>
			)}
		</>
	);
};

export default ServiceAgreement;
