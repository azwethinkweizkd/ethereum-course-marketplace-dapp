const contractAddress1 = "0x8a98AAFc118A429B6b7E7011eF09E04f5b8A9aAE";

const abi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "string",
				name: "message",
				type: "string",
			},
		],
		name: "ErrorNotice",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "bytes",
				name: "data",
				type: "bytes",
			},
		],
		name: "ErrorNoticeBytes",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "client",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "provider",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "agreementAddress",
				type: "address",
			},
		],
		name: "NewAgreement",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address",
			},
		],
		name: "RegisteredServiceProvider",
		type: "event",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_companyName",
				type: "string",
			},
			{
				internalType: "string",
				name: "_email",
				type: "string",
			},
			{
				internalType: "string",
				name: "_phone",
				type: "string",
			},
			{
				internalType: "uint256",
				name: "_serviceAmount",
				type: "uint256",
			},
			{
				internalType: "enum ServiceManager.ServiceCategory",
				name: "_serviceCategory",
				type: "uint8",
			},
		],
		name: "createNewServiceProvider",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_provider",
				type: "address",
			},
		],
		name: "createServiceAgreement",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_clientAddress",
				type: "address",
			},
		],
		name: "getClientServiceAgreements",
		outputs: [
			{
				internalType: "address[]",
				name: "",
				type: "address[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_providerAddress",
				type: "address",
			},
		],
		name: "getProviderServiceAgreements",
		outputs: [
			{
				internalType: "address[]",
				name: "",
				type: "address[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_address",
				type: "address",
			},
		],
		name: "getServiceProvider",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "owner",
						type: "address",
					},
					{
						internalType: "string",
						name: "companyName",
						type: "string",
					},
					{
						internalType: "string",
						name: "email",
						type: "string",
					},
					{
						internalType: "string",
						name: "phone",
						type: "string",
					},
					{
						internalType: "uint256",
						name: "serviceAmount",
						type: "uint256",
					},
					{
						internalType: "enum ServiceManager.ServiceCategory",
						name: "serviceCategory",
						type: "uint8",
					},
					{
						internalType: "uint256",
						name: "index",
						type: "uint256",
					},
				],
				internalType: "struct ServiceManager.ServiceProvider",
				name: "",
				type: "tuple",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getServiceProviders",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "owner",
						type: "address",
					},
					{
						internalType: "string",
						name: "companyName",
						type: "string",
					},
					{
						internalType: "string",
						name: "email",
						type: "string",
					},
					{
						internalType: "string",
						name: "phone",
						type: "string",
					},
					{
						internalType: "uint256",
						name: "serviceAmount",
						type: "uint256",
					},
					{
						internalType: "enum ServiceManager.ServiceCategory",
						name: "serviceCategory",
						type: "uint8",
					},
					{
						internalType: "uint256",
						name: "index",
						type: "uint256",
					},
				],
				internalType: "struct ServiceManager.ServiceProvider[]",
				name: "",
				type: "tuple[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
];

export { contractAddress1, abi };
