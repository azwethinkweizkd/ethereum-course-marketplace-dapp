import { useState, useEffect, useRef, useCallback } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import {
	Link as ChakraLink,
	HStack,
	useToast,
	Button,
	Text,
	Box,
} from "@chakra-ui/react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {
	METAMASK_REQUEST_ACCOUNTS,
	METAMASK_ON_ACCOUNTS_CHANGE,
	INSTALL_METAMASK_TEXT,
	CONNECT_METAMASK_TEXT,
	METAMASK_CONNECTED_TEXT,
} from "../../common/constants";
import { useWallet } from "../../common/context/walletProvider";
import useEthereum from "../../routes/shared/hooks/useEthereum";

export default function Header() {
	const [metamaskButtonDetails, setMetamaskButtonDetails] = useState({
		buttonDisabled: false,
		buttonText: INSTALL_METAMASK_TEXT,
	});
	const [existingServiceProvider, setExistingServiceProvider] = useState(null);
	const { wallet, setWallet } = useWallet();
	const ethereumApi = useEthereum();
	const onboarding = useRef();
	const toast = useToast();

	const displayMetamaskErrorNotification = useCallback(
		(err) => {
			const display = {
				4001: toast({
					title: "Error",
					description: "Please connect with Metamask.",
					status: "error",
					duration: 9000,
					isClosable: true,
				}),
				"-32002": toast({
					title: "Info",
					description:
						"Request to connect with Metamask already exist. Please check the browser extension to complete the request.",
					status: "info",
					duration: 9000,
					isClosable: true,
				}),
			};
			if (!display[err.code])
				return toast({
					title: "Error",
					description: err.message,
					status: "error",
					duration: 9000,
					isClosable: true,
				});

			return display[err.code];
		},
		[toast]
	);

	useEffect(() => {
		if (!onboarding.current) {
			onboarding.current = new MetaMaskOnboarding();
		}
	});

	useEffect(() => {
		if (MetaMaskOnboarding.isMetaMaskInstalled()) {
			const handleAccountsChange = (accounts) => {
				setWallet({ accounts });
			};

			window.ethereum
				.request({ method: METAMASK_REQUEST_ACCOUNTS })
				.then((accounts) => setWallet({ accounts }))
				.catch((err) => displayMetamaskErrorNotification(err));

			window.ethereum.on(METAMASK_ON_ACCOUNTS_CHANGE, handleAccountsChange);

			return () => {
				window.ethereum.off(METAMASK_ON_ACCOUNTS_CHANGE, handleAccountsChange);
			};
		}
	}, [setWallet, displayMetamaskErrorNotification]);

	useEffect(() => {
		if (MetaMaskOnboarding.isMetaMaskInstalled()) {
			if (wallet && wallet?.accounts && wallet?.accounts.length > 0) {
				setMetamaskButtonDetails({
					buttonDisabled: true,
					buttonText: METAMASK_CONNECTED_TEXT,
				});

				onboarding.current.stopOnboarding();
			} else {
				setMetamaskButtonDetails({
					buttonDisabled: false,
					buttonText: CONNECT_METAMASK_TEXT,
				});
			}
		}
	}, [wallet]);

	useEffect(() => {
		async function getServiceProvider(api) {
			return await api.current.getServiceProvider(wallet?.accounts[0]);
		}
		if (wallet?.accounts && wallet?.accounts.length) {
			getServiceProvider(ethereumApi)
				.then((serviceProvider) => {
					setExistingServiceProvider(serviceProvider);
				})
				.catch(() => {
					setExistingServiceProvider(null);
				});
		}
	}, [wallet?.accounts, ethereumApi]);

	const onMetamaskButtonClick = async () => {
		if (!MetaMaskOnboarding.isMetaMaskInstalled())
			return onboarding.current.startOnboarding();

		try {
			const { ethereum } = window;
			const accounts = await ethereum.request({
				method: METAMASK_REQUEST_ACCOUNTS,
			});

			setWallet({ accounts });
		} catch (err) {
			displayMetamaskErrorNotification(err);
		}
	};

	return (
		<Box
			as="header"
			boxShadow="dark-lg"
			backgroundColor="white"
			width="fit-content"
			pr={6}
			pl={4}
			py={2}
			borderBottomRightRadius={36}
			borderRight="solid"
			borderRightColor="black">
			<HStack as="nav">
				<ChakraLink
					as={ReactRouterLink}
					to="/"
					fontWeight="600"
					fontSize="1.25rem"
					style={{ position: "relative" }}
					_before={{
						content: '""',
						position: "absolute",
						width: "100%",
						height: "4px",
						borderRadius: "4px",
						backgroundColor: "#18272F",
						bottom: -1,
						left: 0,
						transformOrigin: "right",
						transform: "scaleX(0)",
						transition: "transform .3s ease-in-out",
					}}
					_hover={{
						"&::before": { transformOrigin: "left", transform: "scaleX(1)" },
					}}>
					Home
				</ChakraLink>
				<ChakraLink
					as={ReactRouterLink}
					to="/service-contracts"
					fontWeight="600"
					fontSize="1.25rem"
					style={{ position: "relative" }}
					_before={{
						content: '""',
						position: "absolute",
						width: "100%",
						height: "4px",
						borderRadius: "4px",
						backgroundColor: "#18272F",
						bottom: -1,
						left: 0,
						transformOrigin: "right",
						transform: "scaleX(0)",
						transition: "transform .3s ease-in-out",
					}}
					_hover={{
						_before: { transformOrigin: "left", transform: "scaleX(1)" },
					}}>
					Contracts
				</ChakraLink>
				{existingServiceProvider && (
					<>
						<ChakraLink
							as={ReactRouterLink}
							to="/service-agreements"
							fontWeight="600"
							fontSize="1.25rem"
							style={{ position: "relative" }}
							_before={{
								content: '""',
								position: "absolute",
								width: "100%",
								height: "4px",
								borderRadius: "4px",
								backgroundColor: "#18272F",
								bottom: -1,
								left: 0,
								transformOrigin: "right",
								transform: "scaleX(0)",
								transition: "transform .3s ease-in-out",
							}}
							_hover={{
								"&::before": {
									transformOrigin: "left",
									transform: "scaleX(1)",
								},
							}}>
							Agreements
						</ChakraLink>
						<ChakraLink
							as={ReactRouterLink}
							to="/my-services"
							fontWeight="600"
							fontSize="1.25rem"
							style={{ position: "relative" }}
							_before={{
								content: '""',
								position: "absolute",
								width: "100%",
								height: "4px",
								borderRadius: "4px",
								backgroundColor: "#18272F",
								bottom: -1,
								left: 0,
								transformOrigin: "right",
								transform: "scaleX(0)",
								transition: "transform .3s ease-in-out",
							}}
							_hover={{
								"&::before": {
									transformOrigin: "left",
									transform: "scaleX(1)",
								},
							}}>
							Services
						</ChakraLink>
					</>
				)}

				{!existingServiceProvider && (
					<ChakraLink
						as={ReactRouterLink}
						to="/pro"
						fontWeight="600"
						fontSize="1.25rem"
						style={{ position: "relative" }}
						_before={{
							content: '""',
							position: "absolute",
							width: "100%",
							height: "4px",
							borderRadius: "4px",
							backgroundColor: "#18272F",
							bottom: -1,
							left: 0,
							transformOrigin: "right",
							transform: "scaleX(0)",
							transition: "transform .3s ease-in-out",
						}}
						_hover={{
							"&::before": { transformOrigin: "left", transform: "scaleX(1)" },
						}}>
						Become a Pro
					</ChakraLink>
				)}

				{metamaskButtonDetails.buttonText === METAMASK_CONNECTED_TEXT ? (
					<Text as="em" color="green" fontWeight="600" fontSize="1.25rem">
						{metamaskButtonDetails.buttonText}
					</Text>
				) : (
					<Button
						variant="link"
						fontWeight="600"
						fontSize="1.25rem"
						style={{ position: "relative" }}
						_before={{
							content: '""',
							position: "absolute",
							width: "100%",
							height: "4px",
							borderRadius: "4px",
							backgroundColor: "#18272F",
							bottom: -1,
							left: 0,
							transformOrigin: "right",
							transform: "scaleX(0)",
							transition: "transform .3s ease-in-out",
						}}
						_hover={{
							"&::before": { transformOrigin: "left", transform: "scaleX(1)" },
						}}
						onClick={onMetamaskButtonClick}
						isDisabled={metamaskButtonDetails.buttonDisabled}>
						{metamaskButtonDetails.buttonText}
					</Button>
				)}
			</HStack>
		</Box>
	);
}
