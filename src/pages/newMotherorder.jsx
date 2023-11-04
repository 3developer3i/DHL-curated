import { ButtonGroup, Tooltip, Page, Icon, Button, Banner, Modal, FormLayout, TextField, TextContainer, Frame, Toast, Pagination } from '@shopify/polaris';
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import {
    ReceiptMajor, LegalMajor, PrintMajor, LocationsMinor,
    ChevronDownMinor, ChevronUpMinor, DeleteMajor
} from '@shopify/polaris-icons';
import DeletePopup from '../components/popopdelete';
import { BaseURl, shop } from '../contant'
import ActionListInPopoverExample from '../components/items';

const MotherOrderIndexTable = () => {

    const [loading, setLoading] = useState(false);
    const [motherorder, setMotherOrder] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addTracking, setAddTracking] = useState("");
    const [shipmenttrackingnumber, setShipmenttrackingnumber] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [toastmessage, setToastMessage] = useState(false);
    const [popoverActive, setPopoverActive] = useState(false);
    const [APIMessage, setAPIMessage] = useState("");

    const toggleActive = useCallback(() => setToastMessage((toastmessage) => !toastmessage), []);
    const toastMarkup = toastmessage ? (
        <Toast content={APIMessage} onDismiss={toggleActive} />
    ) : null;

    const fetchAllBabyOrderlist = (checkIt, name) => {
        if (checkIt !== 'yes') {
            setLoading(true);
        }
        axios.get(`https://${BaseURl}/all_mother_order?shop_name=${shop}`)
            .then((res) => {
                console.log(res, "mother order.");
                setMotherOrder(res.data.mother_order_list);
                if (name === 'mother-delete') {
                    toggleActive();
                };
                setLoading(false)
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchAllBabyOrderlist();
    }, []);

    const [collapsibleStates, setCollapsibleStates] = useState(
        motherorder.map(() => false)
    );

    const toggleCollapsible = (index) => {
        const newCollapsibleStates = [...collapsibleStates];
        newCollapsibleStates[index] = !newCollapsibleStates[index];
        setCollapsibleStates(newCollapsibleStates);
    };
    // setLoading(true);
    const DeleteSpecificMother = async (mother_order_id) => {
        const formData = new FormData();
        formData.append("shop_name", shop);
        formData.append("mother_order_id", mother_order_id)
        setLoading(true);
        const response = await axios.post(`https://${BaseURl}/delete_specific_mother_order`, new URLSearchParams(formData));
        if (response.status === 200) {
            if (response.data.success === "Mother order is deleted") {
                setAPIMessage("Mother order is deleted");
                setIsDeleteModalOpen(false);
                fetchAllBabyOrderlist('yes', 'mother-delete');
            }
        };
    };

    const [mothernumber, setMotherNumber] = useState("");

    const closeModal = () => {
        setIsModalOpen(!isModalOpen)
    };

    function renderNames(names) {
        const namesArray = names.split(',');

        return namesArray.map((name, index) => {
            const shouldAddLineBreak = (index + 1) % 4 === 0;
            return (
                <React.Fragment key={index}>
                    {namesArray.length > 1 ? `${name},` : `${name}`}&nbsp;
                    {shouldAddLineBreak && <br />}
                </React.Fragment>
            );
        });
    }

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const paginatedData = motherorder.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalItems = motherorder.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <Page>
            {loading && (

                <div className="spinner">
                    <div className="spinner-inner"></div>
                </div>
            )}
            {motherorder.length === 0 && (

                <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
                    <Banner title="Mother Order Lists">
                        <p>no mother order created yet ...!!</p>
                    </Banner>
                </div>
            )}
            {paginatedData.length > 0 && !loading && (
                <div className="Polaris-LegacyCard" style={{ width: "110%" }}>
                    <div className="Polaris-LegacyCard__Header" ><h2 className="Polaris-Text--root Polaris-Text--headingMd">Mother Order Lists</h2></div>
                    <div className="Polaris-IndexTable">
                        <div className="Polaris-IndexTable__IndexTableWrapper Polaris-IndexTable__IndexTableWrapper--scrollBarHidden">
                            <div className="Polaris-IndexTable-ScrollContainer">
                                <table className="Polaris-IndexTable__Table Polaris-IndexTable__Table--sticky">
                                    <thead>
                                        <tr>
                                            <th className="Polaris-IndexTable__TableHeading Polaris-IndexTable__TableHeading--first" data-index-table-heading="true">
                                                {/* Add header content */}
                                            </th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Order Number</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Babies Details</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Date</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Total</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Add Tracking</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Action</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData && paginatedData.map((datas, index) => {
                                            return (
                                                <>
                                                    <tr id={index} className="Polaris-IndexTable__TableRow">
                                                        <td className="Polaris-IndexTable__TableCell Polaris-IndexTable__TableHeading--first">
                                                            {/* Add row content */}
                                                        </td>
                                                        <td className="Polaris-IndexTable__TableCell">{datas.mother_order_id}</td>
                                                        <td className="Polaris-IndexTable__TableCell">{renderNames(datas.mother_order_number)}</td>
                                                        <td className="Polaris-IndexTable__TableCell">{datas.mother_order_date}</td>
                                                        <td className="Polaris-IndexTable__TableCell">{datas.price === null ? "0$" : datas.price}</td>
                                                        <td className="Polaris-IndexTable__TableCell">
                                                            <ButtonGroup>
                                                                {/* <Tooltip content="Print Invoice">
                                                                    <div>
                                                                        <Icon
                                                                            source={PrintMajor}
                                                                            tone="base"
                                                                            color='success'
                                                                        />
                                                                    </div>
                                                                </Tooltip> */}
                                                                <Tooltip content="Package Slip">
                                                                    <div onClick={() => {
                                                                        window.open(datas.filePath, "_blank")
                                                                    }}>
                                                                        <Icon
                                                                            source={ReceiptMajor}
                                                                            tone="base"
                                                                            color='base'
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                                <Tooltip content="Commercial Invoice">
                                                                    <div onClick={() => {
                                                                        window.open(datas.comercial_mother_pdf, "_blank")
                                                                    }}>
                                                                        <Icon
                                                                            source={LegalMajor}
                                                                            tone="base"
                                                                            color='subdued'
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                                <Tooltip content="Add Tracking">
                                                                    <div onClick={() => {
                                                                        setIsModalOpen(true);
                                                                        setAddTracking(datas.trackingnumber);
                                                                        setShipmenttrackingnumber(datas.shipmenttrackingnumber);
                                                                    }}>
                                                                        <Icon
                                                                            source={LocationsMinor}
                                                                            tone="base"
                                                                            color='success'
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                            </ButtonGroup></td>
                                                        <td className="Polaris-IndexTable__TableCell">
                                                            <Tooltip content="delete">
                                                                <Button onClick={() => {
                                                                    // console.log(datas.mother_order_id);
                                                                    setMotherNumber(datas.mother_order_id);
                                                                    setIsDeleteModalOpen(!isDeleteModalOpen)
                                                                }} destructive size='micro' accessibilityLabel='Delete' icon={DeleteMajor}></Button>
                                                            </Tooltip>
                                                        </td>
                                                        <td onClick={() => toggleCollapsible(index)} className="Polaris-IndexTable__TableCell">
                                                            {collapsibleStates[index] ? <Icon
                                                                source={ChevronUpMinor}
                                                                tone="base"
                                                            /> : <Icon
                                                                source={ChevronDownMinor}
                                                                tone="base"
                                                            />}
                                                        </td>
                                                    </tr>
                                                    <Modal
                                                        open={isModalOpen}
                                                        onClose={() => setIsModalOpen(false)}
                                                        title="Add Tracking"
                                                        secondaryActions={[
                                                            {
                                                                content: 'Close',
                                                                onAction: closeModal,
                                                            },
                                                        ]}
                                                    >
                                                        <Modal.Section>
                                                            <FormLayout>
                                                                <FormLayout.Group>
                                                                    <TextField
                                                                        type="text"
                                                                        label="Tracking number"
                                                                        autoComplete="off"
                                                                        value={shipmenttrackingnumber}
                                                                    />
                                                                    <TextField
                                                                        type="text"
                                                                        label="Shipping carrier"
                                                                        autoComplete="off"
                                                                        value={addTracking}
                                                                    />
                                                                </FormLayout.Group>
                                                            </FormLayout>
                                                        </Modal.Section>
                                                    </Modal>
                                                    {collapsibleStates[index] &&
                                                        <tr className={`Polaris-IndexTable__TableRow ${collapsibleStates[index] ? 'collapsible-open' : ''
                                                            }`} style={{ height: datas.baby_order_data.length < 4 ? `${datas.baby_order_data.length * 70.4285714286}px` : `${datas.baby_order_data.length * 42.4285714286}px` }}>
                                                            <div className="Polaris-LegacyCard" style={{ display: "contents" }}>
                                                                <table style={{ position: "absolute" }} className="Polaris-IndexTable__Table Polaris-IndexTable__Table--sticky">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="Polaris-IndexTable__TableHeading Polaris-IndexTable__TableHeading--first" data-index-table-heading="true">
                                                                                {/* Add header content */}
                                                                            </th>
                                                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Baby Number</th>
                                                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Title</th>
                                                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Date</th>
                                                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Total</th>
                                                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Items</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {datas.baby_order_data.map((data1, indexs) =>
                                                                            <tr style={{ backgroundColor: "#ebebeb" }} id={indexs} className="Polaris-IndexTable__TableRow">
                                                                                <td className="Polaris-IndexTable__TableCell  Polaris-IndexTable__TableHeading--first">
                                                                                    {/* Add row content */}
                                                                                </td>
                                                                                <td className="Polaris-IndexTable__TableCell">#{data1.baby_ID}</td>
                                                                                <td className="Polaris-IndexTable__TableCell">{data1.baby_title}</td>
                                                                                <td className="Polaris-IndexTable__TableCell">{data1.baby_date}</td>
                                                                                <td className="Polaris-IndexTable__TableCell">{data1.baby_total}</td>
                                                                                <td className="clasPolaris-IndexTable__TableCell">
                                                                                    <ActionListInPopoverExample fulfillmentStatus={[]}
                                                                                        itemsdata={data1.line_items}
                                                                                        Item='ITEMS' />
                                                                                </td>
                                                                            </tr>)}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </tr>
                                                    }
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <div className="Polaris-IndexTable__TableRow"></div>
                                <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px", paddingTop:"10px" }}>
                                    <Pagination
                                        hasPrevious={currentPage > 1}
                                        hasNext={currentPage < totalPages}
                                        label={`${paginatedData.length} of ${motherorder.length}`}
                                        onPrevious={() => handlePageChange(currentPage - 1)}
                                        onNext={() => handlePageChange(currentPage + 1)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Modal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
                title="Delete Confirmation"
                primaryAction={{
                    content: 'Delete',
                    onAction: () => DeleteSpecificMother(mothernumber),
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => setIsDeleteModalOpen(!isDeleteModalOpen),
                    },
                ]}
                size="small"
            >
                <Modal.Section>
                    <TextContainer>
                        <p style={{ fontSize: '15px', fontWeight: 'bold' }}>Are you sure you want to delete the mother_order_date order #{mothernumber}?</p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
            <div id="toast-message">
                <Frame>
                    {toastMarkup}
                </Frame>
            </div>
        </Page>
    );
};

export default MotherOrderIndexTable;
