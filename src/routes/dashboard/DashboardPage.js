import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, Input, InputRightElement } from "@chakra-ui/input";
import { SearchIcon } from "@chakra-ui/icons";
import SearchCategory from "../../components/search-category/SearchCategory";
import { Center, Heading, VStack, Box, HStack } from "@chakra-ui/layout";
import { serviceCategories } from "../../common/constants/objects";

const DashboardPage = () => {
	const navigate = useNavigate();
	const [searchCriteria, setSearchCriteria] = useState("");

	function onSubmitSearch() {
		navigate(`service-providers?search=${searchCriteria}`);
	}

	function onSearchCategoryClick(category) {
		if (category === "All") return navigate(`/service-providers`);
		navigate(
			`/service-providers?category=${encodeURIComponent(category).replace(
				/%20/g,
				"+"
			)}`
		);
	}

	function onSearchInputChange(e) {
		setSearchCriteria(e.target.value);
	}

	return (
		<Center>
			<VStack>
				<VStack
					backgroundColor="#1A365D"
					gap={4}
					pt={8}
					px={24}
					pb={12}
					mt={24}
					rounded="2xl"
					boxShadow="dark-lg"
					backdropFilter="auto"
					justifyItems="center">
					<Heading as="h3" color="white">
						Search for providers
					</Heading>
					<InputGroup>
						<Input
							placeholder="Search..."
							variant="filled"
							onChange={onSearchInputChange}
							_focus={{ backgroundColor: "white" }}
						/>
						<InputRightElement>
							<SearchIcon color="green.500" onClick={onSubmitSearch} />
						</InputRightElement>
					</InputGroup>
				</VStack>
				<Box pt={8}>
					<HStack>
						<SearchCategory
							category={"All"}
							key={0}
							onClick={onSearchCategoryClick}
						/>
						{Object.entries(serviceCategories).map(([key, value]) => (
							<SearchCategory
								category={value}
								key={key}
								onClick={onSearchCategoryClick}
							/>
						))}
					</HStack>
				</Box>
			</VStack>
		</Center>
	);
};

export default DashboardPage;
