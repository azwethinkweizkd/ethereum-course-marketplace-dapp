import { Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

const SearchCategory = ({ category, onClick }) => {
	function onSelectedCategory() {
		onClick(category);
	}

	return (
		<Text
			onClick={onSelectedCategory}
			cursor="pointer"
			fontWeight="bold"
			fontSize={18}
			_hover={{ textDecoration: "underline" }}>
			{category}
		</Text>
	);
};

SearchCategory.propTypes = {
	category: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default SearchCategory;
