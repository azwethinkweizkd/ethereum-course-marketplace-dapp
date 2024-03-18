import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, Input, InputRightElement } from "@chakra-ui/input";
import { SearchIcon } from "@chakra-ui/icons";
import SearchCategory from "./SearchCategory";

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
		<div>
			<div>
				<InputGroup>
					<Input placeholder="Search..." onChange={onSearchInputChange} />
					<InputRightElement>
						<SearchIcon color="green.500" onClick={onSubmitSearch} />
					</InputRightElement>
				</InputGroup>
			</div>
			<div>
				<div>
					<SearchCategory
						category={"All"}
						key={0}
						onClick={onSearchCategoryClick}
					/>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
