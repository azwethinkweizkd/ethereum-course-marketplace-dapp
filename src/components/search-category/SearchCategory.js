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
			color="white"
			style={{ position: "relative" }}
			_before={{
				content: '""',
				position: "absolute",
				width: "100%",
				height: "4px",
				borderRadius: "4px",
				backgroundColor: "white",
				bottom: -1,
				left: 0,
				transformOrigin: "right",
				transform: "scaleX(0)",
				transition: "transform .3s ease-in-out",
			}}
			_hover={{
				"&::before": { transformOrigin: "left", transform: "scaleX(1)" },
			}}>
			{category}
		</Text>
	);
};

SearchCategory.propTypes = {
	category: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default SearchCategory;
