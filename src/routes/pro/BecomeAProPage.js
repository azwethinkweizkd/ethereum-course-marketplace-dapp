import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import {
	Box,
	HStack,
	VStack,
	Heading,
	FormControl,
	InputGroup,
	InputLeftElement,
	Input,
	Button,
	InputRightAddon,
	Center,
	FormErrorMessage,
	Select,
	Spinner,
	useToast,
	AbsoluteCenter,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { PhoneIcon } from "@chakra-ui/icons";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { TiBusinessCard } from "react-icons/ti";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import ethereumApiFactory from "../../ethereum/ethereumApiFactory";
import { serviceCategories } from "../../common/constants";
import { contractAddress1, abi } from "../../ethereum/serviceManagerContract";
import { useWallet } from "../../common/context/walletProvider";

const validationSchema = Yup.object().shape({
	companyName: Yup.string().required("Company name is required"),
	phone: Yup.string().required("Phone number is required"),
	email: Yup.string()
		.email("Invalid email address")
		.required("Email address is required"),
	service: Yup.number().required(
		"Please select a service from the list of options"
	),
	serviceCost: Yup.string().required("Service cost is required"),
});

const BecomeAProPage = () => {
	const [submittingServiceContract, setSubmittingServiceContract] =
		useState(false);
	const { wallet } = useWallet();
	const navigate = useNavigate();
	const ethereumApi = useRef();
	const currentBlockNumber = useRef(null);

	const toast = useToast();

	const handleSubmit = async (values, actions) => {
		try {
			setSubmittingServiceContract(true);
			await ethereumApi.current.createNewServiceProvider(
				values.companyName,
				values.email,
				values.phone,
				ethereumApi.current.parseUints(values.serviceCost, "wei"),
				values.service
			);

			actions.resetForm();
			toast({
				title: "Success",
				description: "Much SUCCESS",
				status: "success",
				duration: 9000,
				isClosable: true,
			});
		} catch (error) {
			setSubmittingServiceContract(false);
			toast({
				title: "Error submitting new service provider",
				description: "There was an error submitting your new service",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		} finally {
			actions.setSubmitting(false);
			setSubmittingServiceContract(actions.isSubmitting);
		}
	};

	const emitRegistrationInfo = useCallback(
		(address, e) => {
			if (e.blockNumber > currentBlockNumber.current) {
				setSubmittingServiceContract(false);
				navigate("/my-services");
			}
		},
		[navigate]
	);

	useEffect(() => {
		if (!window || !window.ethereum) return;
		ethereumApi.current = ethereumApiFactory(window.ethereum);
	});

	useEffect(() => {
		const getBlockNumber = async () => {
			const provider = ethereumApi.current?.provider;
			return await provider.getBlockNumber();
		};

		if (wallet && wallet?.accounts.length > 0) {
			const contract = ethereumApi.current.getContractReader(
				contractAddress1,
				abi
			);

			const filter = contract?.filters.RegisteredServiceProvider(
				wallet?.accounts[0]
			);

			getBlockNumber().then((blockNumber) => {
				return (currentBlockNumber.current = blockNumber);
			});

			contract?.on(filter, emitRegistrationInfo);

			return () => contract?.off(filter, emitRegistrationInfo);
		}
	}, [wallet, emitRegistrationInfo]);

	const serviceCategoriesOptions = Object.entries(serviceCategories).map(
		([k, v]) => ({ value: parseInt(k), label: v })
	);

	return (
		<>
			{submittingServiceContract ? (
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
				<Center mt={10}>
					<Box
						py={16}
						px={24}
						rounded="2xl"
						boxShadow="dark-lg"
						backdropFilter="auto"
						backdropBlur="8px">
						<HStack
							alignContent="center"
							color="#ECC94B"
							bg="black"
							mb={6}
							p={4}
							rounded="md">
							<Icon as={HiOutlineUserCircle} boxSize={12} />
							<Heading>Become a Pro</Heading>
						</HStack>
						<Formik
							initialValues={{
								companyName: "",
								phone: "",
								email: "",
								serviceCost: "",
							}}
							validationSchema={validationSchema}
							onSubmit={handleSubmit}>
							{(props) => (
								<Form>
									<VStack spacing={6}>
										<Field name="companyName">
											{({ field, form }) => (
												<FormControl
													isInvalid={
														form.errors.companyName && form.touched.companyName
													}>
													<InputGroup>
														<InputLeftElement pointerEvents="none">
															<Icon as={TiBusinessCard} color="white" />
														</InputLeftElement>
														<Input
															{...field}
															type="text"
															placeholder="Company name"
															bgColor="black"
															color="white"
															_placeholder={{ color: "white" }}
															required
														/>
													</InputGroup>
													<FormErrorMessage my={0} mb={-4}>
														{form.errors.companyName}
													</FormErrorMessage>
												</FormControl>
											)}
										</Field>

										<Field name="phone">
											{({ field, form }) => (
												<FormControl
													isInvalid={form.errors.phone && form.touched.phone}>
													<InputGroup>
														<InputLeftElement pointerEvents="none">
															<PhoneIcon color="white" />
														</InputLeftElement>
														<Input
															{...field}
															type="tel"
															placeholder="555-555-5555"
															required
															_placeholder={{ color: "white" }}
															color="white"
															bgColor="black"
														/>
													</InputGroup>
													<FormErrorMessage my={0} mb={-4}>
														{form.errors.phone}
													</FormErrorMessage>
												</FormControl>
											)}
										</Field>

										<Field name="email">
											{({ field, form }) => (
												<FormControl
													isInvalid={form.errors.email && form.touched.email}>
													<InputGroup>
														<InputLeftElement pointerEvents="none">
															<Icon
																as={MdOutlineAlternateEmail}
																color="white"
															/>
														</InputLeftElement>
														<Input
															{...field}
															type="email"
															placeholder="Email address"
															color="white"
															bgColor="black"
															_placeholder={{ color: "white" }}
															required
														/>
													</InputGroup>
													<FormErrorMessage my={0} mb={-4}>
														{form.errors.email}
													</FormErrorMessage>
												</FormControl>
											)}
										</Field>

										<Field name="service">
											{({ field, form }) => (
												<FormControl
													isInvalid={
														form.errors.service && form.touched.service
													}>
													<Select
														{...field}
														bg="black"
														color="white"
														placeholder="Select service provided"
														_placeholder={{ color: "white" }}>
														<optgroup style={{ backgroundColor: "black" }}>
															<option value="">
																--Please choose an option--
															</option>
															{serviceCategoriesOptions.map(
																({ value, label, index }) => (
																	<option key={uuidv4()} value={value}>
																		{label}
																	</option>
																)
															)}
														</optgroup>
													</Select>
													<FormErrorMessage my={0} mb={-4}>
														{form.errors.service}
													</FormErrorMessage>
												</FormControl>
											)}
										</Field>

										<Field name="serviceCost">
											{({ field, form }) => (
												<FormControl
													isInvalid={
														form.errors.serviceCost && form.touched.serviceCost
													}>
													<InputGroup>
														<Input
															{...field}
															placeholder="Service Cost (Wei)"
															_placeholder={{ color: "white" }}
															color="white"
															bgColor="black"
															required
															borderRight="none"
														/>
														<InputRightAddon bg="black" color="#ECC94B">
															Wei
														</InputRightAddon>
													</InputGroup>
													<FormErrorMessage my={0} mb={-4}>
														{form.errors.serviceCost}
													</FormErrorMessage>
												</FormControl>
											)}
										</Field>

										<Button
											bg="#ECC94B"
											color="black"
											type="submit"
											isLoading={props.isSubmitting}>
											Become a Pro
										</Button>
									</VStack>
								</Form>
							)}
						</Formik>
					</Box>
				</Center>
			)}
		</>
	);
};

export default BecomeAProPage;
