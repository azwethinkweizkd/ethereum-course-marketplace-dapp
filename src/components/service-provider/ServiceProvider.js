import PropTypes from "prop-types";

const ServiceProvider = ({ provider }) => {
	console.log(provider);
};

ServiceProvider.propTypes = {
	provider: PropTypes.object.isRequired,
};

export default ServiceProvider;
