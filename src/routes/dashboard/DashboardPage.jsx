import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, Input, InputRightElement } from "@chakra-ui/input";
import { SearchIcon } from "@chakra-ui/icons";
import SearchCategory from "./SearchCategory";
import { Center, Heading, VStack } from "@chakra-ui/layout";

const DashboardPage = () => {
	const navigate = useNavigate();
	const [searchCriteria, setSearchCriteria] = useState("");

	function onSubmitSearch() {
		navigate(`service-providers?search=${searchCriteria}`);
	}

	function onSearchCategoryClick(category) {
		if (category === "All") return navigate(`/service-providers`);
		navigate(`/service-providers?category=${category}`);
	}

	function onSearchInputChange(e, data) {
		setSearchCriteria(data.value);
	}

	return (
		<Center>
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
			<div>
				<div>
					<SearchCategory
						category={"All"}
						key={0}
						onClick={onSearchCategoryClick}
					/>
				</div>
			</div>
		</Center>
	);
};

export default DashboardPage;
