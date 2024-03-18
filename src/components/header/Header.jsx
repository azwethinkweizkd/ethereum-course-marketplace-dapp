import { useState, useEffect, useRef, useCallback } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import {
	Link as ChakraLink,
	HStack,
	useToast,
	Button,
	Text,
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

export default function Header() {
	const [metamaskButtonDetails, setMetamaskButtonDetails] = useState({
		buttonDisabled: false,
		buttonText: INSTALL_METAMASK_TEXT,
	});
	const { wallet, setWallet } = useWallet();
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
			if (wallet && wallet.accounts && wallet.accounts.length > 0) {
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
		<header>
			<HStack as="nav">
				<ChakraLink as={ReactRouterLink} to="/">
					Home
				</ChakraLink>
				<ChakraLink as={ReactRouterLink} to="/service-contracts">
					Contracts
				</ChakraLink>
				<ChakraLink as={ReactRouterLink} to="/service-agreements">
					Agreements
				</ChakraLink>
				<ChakraLink as={ReactRouterLink} to="/my-services">
					Services
				</ChakraLink>
				<ChakraLink as={ReactRouterLink} to="/pro">
					Become a Pro
				</ChakraLink>
				{metamaskButtonDetails.buttonText === METAMASK_CONNECTED_TEXT ? (
					<Text as="em" color="green">
						{metamaskButtonDetails.buttonText}
					</Text>
				) : (
					<Button
						variant="link"
						onClick={onMetamaskButtonClick}
						isDisabled={metamaskButtonDetails.buttonDisabled}>
						{metamaskButtonDetails.buttonText}
					</Button>
				)}
			</HStack>
		</header>
	);
}
