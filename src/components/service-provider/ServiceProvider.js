import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
    Card,
    CardBody,
    Button,
    List,
    ListItem,
    ListIcon,
    WrapItem,
    VStack,
    Box,
    Text,
    useDisclosure,
    Center
} from "@chakra-ui/react";
import { PhoneIcon, AtSignIcon } from "@chakra-ui/icons";
import { IoBusiness } from "react-icons/io5";
import { FaEthereum, FaBusinessTime } from "react-icons/fa";
import useEthereum from "../../routes/shared/hooks/useEthereum";
import StarRatingDisplay from "../star-rating-display/StarRatingDisplay";
import YesNoModal from "./YesNoModal";

const ServiceProvider = ({ provider, handleContractAgreement, loading }) => {
    const [averageRating, setAverageRating] = useState(null);
    const {
        ownerAddress,
        companyName,
        email,
        phone,
        serviceCategory,
        serviceCategoryKey,
        serviceCost
    } = provider;

    const { isOpen, onOpen, onClose } = useDisclosure();

    const onContractAgreement = async () => {
        onClose();
        await handleContractAgreement(provider);
    };

    const ethereumApi = useEthereum();

    const getAverageRating = useCallback(async () => {
        return await ethereumApi.current.getAverageRatingFunc(ownerAddress);
    }, [ownerAddress, ethereumApi]);

    useEffect(() => {
        getAverageRating()
            .then((res) => setAverageRating(res))
            .catch((err) => console.log(err));
    });

    return (
        <WrapItem>
            <Card
                boxShadow="2xl"
                rounded="2xl"
                minW="500px"
                border="2px solid black"
            >
                <CardBody pt={12} pb={8} px={12}>
                    <VStack>
                        <List spacing={2}>
                            <ListItem>
                                <ListIcon as={IoBusiness} fontSize="2xl" />
                                <Text as="b" fontSize="2xl">
                                    {companyName}
                                </Text>
                            </ListItem>
                            <ListItem>
                                <ListIcon as={PhoneIcon} fontSize="2xl" />
                                <Text as="b" fontSize="2xl">
                                    {phone}
                                </Text>
                            </ListItem>
                            <ListItem>
                                <ListIcon as={AtSignIcon} fontSize="2xl" />
                                <Text as="b" fontSize="2xl">
                                    {email}
                                </Text>
                            </ListItem>
                            <ListItem>
                                <ListIcon as={FaEthereum} fontSize="2xl" />
                                <Text as="b" fontSize="2xl">
                                    {serviceCost}
                                </Text>
                            </ListItem>
                            <ListItem value={serviceCategoryKey}>
                                <ListIcon as={FaBusinessTime} fontSize="2xl" />
                                <Text as="b" fontSize="2xl">
                                    {serviceCategory}
                                </Text>
                            </ListItem>
                        </List>
                        <Center>
                            <StarRatingDisplay rating={averageRating || 0} />
                        </Center>
                        <Box py={4} width="100%">
                            <Button
                                width="100%"
                                colorScheme="yellow"
                                fontSize="xl"
                                onClick={onOpen}
                                isDisabled={loading}
                            >
                                Contract
                            </Button>

                            <YesNoModal
                                open={isOpen}
                                onClose={onClose}
                                onYesClick={onContractAgreement}
                                headerText="Confirm contract agreement"
                                bodyText={`Are you sure you want to contract 
											${companyName} for the amount of ${serviceCost} (Wei)? 
											You will have a chance to fund the contract from the contracts page after accepting.`}
                            />
                        </Box>
                    </VStack>
                </CardBody>
            </Card>
        </WrapItem>
    );
};

ServiceProvider.propTypes = {
    provider: PropTypes.object.isRequired,
    handleContractAgreement: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
};

export default ServiceProvider;
