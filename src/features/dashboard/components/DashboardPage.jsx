import { React, useState } from "react";
import SearchCategory from "./SearchCategory";
import { useNavigate } from "react-router-dom";
import { Icon, Input } from "semantic-ui-react";

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

    return (
        <div className="service-search-criteria">
            <div>
                <Input
                    fluid
                    icon={
                        <Icon
                            name="search"
                            inverted
                            circular
                            link
                            onClick={onSubmitSearch}
                        />
                    }
                    placeholder="Search..."
                    onChange={onSearchCategoryClick}
                />
            </div>
        </div>
    );
};

export default DashboardPage;
