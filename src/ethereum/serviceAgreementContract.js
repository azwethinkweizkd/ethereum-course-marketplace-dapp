const abi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_client",
				type: "address",
			},
			{
				internalType: "address",
				name: "_provider",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_termsAmount",
				type: "uint256",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "agreementAddress",
				type: "address",
			},
			{
				indexed: false,
				internalType: "enum ServiceAgreement.Rating",
				name: "clientRating",
				type: "uint8",
			},
			{
				indexed: false,
				internalType: "enum ServiceAgreement.ClientApprovalStatus",
				name: "clientApprovalStatus",
				type: "uint8",
			},
			{
				indexed: false,
				internalType: "enum ServiceAgreement.WorkStatus",
				name: "agreementStatus",
				type: "uint8",
			},
		],
		name: "AgreementFulfilled",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "agreementAddress",
				type: "address",
			},
			{
				indexed: false,
				internalType: "enum ServiceAgreement.WorkStatus",
				name: "agreementStatus",
				type: "uint8",
			},
		],
		name: "ServiceStatusUpdate",
		type: "event",
	},
	{
		inputs: [],
		name: "agreementStatus",
		outputs: [
			{
				internalType: "enum ServiceAgreement.WorkStatus",
				name: "",
				type: "uint8",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "clientApprovalStatus",
		outputs: [
			{
				internalType: "enum ServiceAgreement.ClientApprovalStatus",
				name: "",
				type: "uint8",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "clientRating",
		outputs: [
			{
				internalType: "enum ServiceAgreement.Rating",
				name: "",
				type: "uint8",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "deposit",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "getAgreementDetails",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
			{
				internalType: "address",
				name: "",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
			{
				internalType: "enum ServiceAgreement.WorkStatus",
				name: "",
				type: "uint8",
			},
			{
				internalType: "enum ServiceAgreement.ClientApprovalStatus",
				name: "",
				type: "uint8",
			},
			{
				internalType: "enum ServiceAgreement.Rating",
				name: "",
				type: "uint8",
			},
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "enum ServiceAgreement.Rating",
				name: "_rating",
				type: "uint8",
			},
		],
		name: "rateServiceProvider",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "refund",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "transferFundsToProvider",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "enum ServiceAgreement.ClientApprovalStatus",
				name: "_approve",
				type: "uint8",
			},
		],
		name: "updateClientApprovalStatus",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "enum ServiceAgreement.WorkStatus",
				name: "_status",
				type: "uint8",
			},
		],
		name: "updateServiceState",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];

export { abi };
