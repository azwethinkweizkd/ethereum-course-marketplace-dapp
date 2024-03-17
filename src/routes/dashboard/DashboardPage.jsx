import { React } from "react";
// import { useNavigate } from "react-router-dom";
import { InputGroup, Input, InputRightElement } from "@chakra-ui/input";
import { SearchIcon } from "@chakra-ui/icons";
// import SearchCategory from "./SearchCategory";

const DashboardPage = () => {
	// const navigate = useNavigate();
	// const [searchCriteria, setSearchCriteria] = useState("");

	// function onSubmitSearch() {
	// 	navigate(`service-providers?search=${searchCriteria}`);
	// }

	// function onSearchCategoryClick(category) {
	// 	if (category === "All") return navigate(`/service-providers`);
	// 	navigate(`/service-providers?category=${category}`);
	// }

	return (
		<div>
			<div>
				<InputGroup>
					<Input placeholder="Enter amount" />
					<InputRightElement>
						<SearchIcon color="green.500" />
					</InputRightElement>
				</InputGroup>
			</div>
		</div>
	);
};

export default DashboardPage;
