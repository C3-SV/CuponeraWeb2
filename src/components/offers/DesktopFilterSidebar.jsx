import React from "react";
import { FilterSection } from "./FilterSection";

export const DesktopFilterSidebar = ({ sections }) => {
    return (
        <form className="hidden lg:block">
            {sections.map((s) => (
                <FilterSection
                    key={s.id}
                    title={s.name}
                    options={s.options}
                    defaultOpen={false}
                />
            ))}
        </form>
    );
};
