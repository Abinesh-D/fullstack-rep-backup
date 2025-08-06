export const appendixSectionsConfig = ({
    handlers,
    values,
    columns,
    projectTypeId
}) => [
        {
            sectionTitle: "1. Base Search Terms",
            show: true,
            fields: [
                {
                    label: "Key Word",
                    type: "input",
                    value: values.baseSearchTerm,
                    onChange: (e) => handlers.setBaseSearchTerm(e.target.value),
                    id: "base-search-terms",
                    placeholder: "Enter Key Word",
                    col: 4,
                },
                {
                    label: "Relevant Words",
                    type: "textarea",
                    value: values.relevantWords,
                    onChange: (e) => handlers.setRelevantWords(e.target.value),
                    id: "relevantapiword",
                    placeholder: "Relevant Words.",
                    col: 8,
                    rows: 4,
                },
            ],
            buttons: [
                {
                    label: "Find",
                    onClick: handlers.handleFindRelevantWord,
                    color: "success",
                    loading: values.findLoading,
                },
                {
                    label: "+ Add Search Terms",
                    onClick: handlers.handleAddSearchTerms,
                    color: "primary",
                },
            ],
            table: {
                data: values.relevantWordsList,
                columns: columns.baseSearchTermsColumns,
            },
        },

        {
            sectionTitle: "2. Search Strings",
            show: true,
            fields: [
                {
                    label: "Key Strings (Patents/Patent Applications)",
                    type: "textarea",
                    value: values.keyString,
                    onChange: (e) => handlers.setKeyString(e.target.value),
                    id: "key-strings",
                    placeholder: "Enter key strings for patent",
                    col: 12,
                    rows: 3,
                },
            ],
            buttons: [
                {
                    label: "+ Strings(patent)",
                    onClick: handlers.handleSaveKeyString,
                    color: "info",
                    col: 2,
                },
            ],
            table: {
                data: values.keyStringsList,
                columns: columns.keyStringsColumns,
            },
        },

        {
            sectionTitle: "Key Strings (Non-Patent Literatures)",
            show: projectTypeId === "0001",
            fields: [
                {
                    label: "Key Strings (Non-Patent Literatures)",
                    type: "textarea",
                    value: values.keyStringNpl,
                    onChange: (e) => handlers.setKeyStringNpl(e.target.value),
                    id: "key-strings-npl",
                    placeholder: "Enter key strings for (Npl)",
                    col: 12,
                    rows: 3,
                },
            ],
            buttons: [
                {
                    label: "+ Strings(NPL)",
                    onClick: handlers.handleSaveKeyStringNpl,
                    color: "info",
                    col: 2,
                },
            ],
            table: {
                data: values.keyStringsNplList,
                columns: columns.keyStringsNplColumns,
            },
        },

        {
            sectionTitle: "Additional Search",
            show: projectTypeId === "0001",
            fields: [
                {
                    label: "Additional Search",
                    type: "textarea",
                    value: values.keyStringAdditional,
                    onChange: (e) => handlers.setKeyStringAdditional(e.target.value),
                    id: "additional-key-strings",
                    placeholder: "Enter Additional Search",
                    col: 12,
                    rows: 3,
                },
            ],
            buttons: [
                {
                    label: "+ Additional",
                    onClick: handlers.handleSaveKeyStringAdditional,
                    color: "info",
                    col: 2,
                    icon: "bx bx-search-alt-2",
                },
            ],
            table: {
                data: values.keyStringsAdditionalList,
                columns: columns.keyStringsAdditionalColumns,
            },
        },

        {
            sectionTitle: "3. Data Availability",
            show: true,
            fields: [
                {
                    label: "Value",
                    type: "textarea",
                    value: values.dataAvailability,
                    onChange: (e) => handlers.setDataAvailability(e.target.value),
                    id: "data-availability-value",
                    placeholder: "Enter value",
                    col: 12,
                    rows: 3,
                },
            ],
            buttons: [
                {
                    label: "+ Add Value",
                    onClick: handlers.handleSaveDataAvailability,
                    color: "info",
                    col: 2,
                },
            ],
            table: {
                data: values.dataAvailabilityValue,
                columns: columns.availabilityColumns,
            },
        },
    ];
