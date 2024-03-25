import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { HStack, Text } from "@chakra-ui/react";

import "./shine.css";

const StarRatingDisplay = ({ rating }) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;

	if (rating === 0) {
		return <Text as="b">Not rated yet</Text>;
	}

	return (
		<HStack className="shine">
			{[...Array(fullStars)].map((star, index) => (
				<FaStar key={index} color="#ffc107" />
			))}
			{hasHalfStar && <FaStarHalfAlt color="#ffc107" />}
			{[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((star, index) => (
				<FaStar
					key={index + fullStars + (hasHalfStar ? 1 : 0)}
					color="#e4e5e9"
				/>
			))}
		</HStack>
	);
};

export default StarRatingDisplay;
