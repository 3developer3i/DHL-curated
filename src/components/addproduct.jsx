
import React, { useState, useContext, useRef, useCallback, useEffect } from 'react';
import {
    Page,
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Thumbnail,
    Button,
    Collapsible,
    TextContainer,
    Link,Grid, Badge,
    Pagination,
    Popover, Icon
} from '@shopify/polaris';
import {
    ReceiptMajor,
    LegalMajor,
    DeleteMajor,
    DropdownMinor,
} from "@shopify/polaris-icons";
import TrackModalExample from './trackmodal';
import { ModalContext } from '../context/modalContext';
import DeletePopup from './popopdelete';
import axios from 'axios';

function AddproductTable({ countproductlists, ordernumber, customer, d }) {

    // const Ids = id;
    const modalcontext = useContext(ModalContext);
    const { setTrackingId, setBabyorderlists, order_list, setMotherOrder, orderlength, opentable, callApiParentBaby, parentBabyOrder, babyOrderIDs, setBabyOrderIDs, babyIDs, setBabyIDs } = modalcontext;

    const newData = order_list && order_list;
    const dateString = "";
    const dateParts = dateString && dateString.split(" ");
    const month = dateParts && dateParts[0];
    const day = dateParts && dateParts[1];
    const [selectedproduct, setselectedproduct] = useState([]);

    const [motherData, setMotherData] = useState([{
        baby_total: "$25:00",
        baby_order_number: "DHL1",
        baby_date: "2023-10-05T11:08:19.803Z",
        baby_title: "Airboy mini pop"
    }]);

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    // useEffect(() => {
    //     if (remainsproducts === 0 && !messageDisplayedRef.current) {
    //         const elementToHide = document.querySelector(
    //             ".Polaris-ResourceList__HeaderWrapper.Polaris-ResourceList__HeaderWrapper--hasSelect.Polaris-ResourceList__HeaderWrapper--inSelectMode"
    //         );
    //         if (elementToHide) {
    //             elementToHide.style.display = "none";
    //         }

    //         const elementToHide1 = document.querySelector(
    //             ".Polaris-ResourceList__ResourceListWrapper"
    //         );

    //         if (elementToHide1) {
    //             elementToHide1.style.display = "none";
    //             const messageDiv = document.createElement("div");
    //             messageDiv.textContent = "All Items Is Added In Baby Order.";
    //             messageDiv.style.color = "blue";
    //             messageDiv.style.fontWeight = "bold";
    //             elementToHide1.parentElement.appendChild(messageDiv);

    //             // Set the messageDisplayedRef to true to prevent it from displaying again
    //             messageDisplayedRef.current = true;
    //         }
    //     }
    // }, [remainsproducts]);

    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(order_list);
    const { } = useIndexResourceState(parentBabyOrder);

    useEffect(() => {
        if (selectedResources.length > 0) {
            setTrackingId(selectedResources[0]);
            if (orderlength === selectedResources.length) {
                setMotherOrder(true);
            } else {
                setMotherOrder(false);
            };
        };
        // const hideele = document.getElementById("testhideid");
        // if (hideele) {
        //     const elel = document.querySelector(".Polaris-IndexTable .Polaris-IndexTable-ScrollContainer .Polaris-IndexTable__Table Polaris-IndexTable__Table--sticky .Polaris-IndexTable__TableHeading Polaris-IndexTable__TableHeading--first");
        //     if (elel) {
        //         elel.style.display = "none"
        //     };
        // };
        if (selectedResources.length !== 0) {
            setBabyorderlists(false);
        } else {
            setBabyorderlists(true);
        };
    }, [selectedResources, orderlength]);

    const handleTrackModalClick = async (e, index) => {
        e.stopPropagation();
    };

    const [toggle, setToggle] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const paginatedData = order_list && order_list.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalItems = order_list && order_list.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // items
    const [active2, setActive2] = useState(false);

    const [openCardIndex, setOpenCardIndex] = useState(null);

    const handleCardClick = (index) => {
        if (openCardIndex === index) {
            // Clicking the same card should close it
            setOpenCardIndex(null);
        } else {
            setOpenCardIndex(index);
        }
        handleSelectionChange()
    };
    const toggleActive2 = useCallback(() => {
        setActive2((prevActive) => !prevActive);
    }, []);

    const rowMarkup = order_list && order_list.map(
        ({ baby_total, baby_order_number, baby_date, baby_title, line_items }, index) => (
            <>
                <IndexTable.Row
                    id={index + 10}
                    key={index + 10}
                    selected={selectedResources.includes(index + 10)}
                    position={index}
                    onClick={() => setToggle(!toggle)}
                >
                    <IndexTable.Cell> &nbsp;&nbsp;#{baby_order_number}</IndexTable.Cell>
                    {/* <IndexTable.Cell> &nbsp;&nbsp;{`#${index > 3 ? 1007   : 1005}`} </IndexTable.Cell> */}
                    <IndexTable.Cell>{baby_title}</IndexTable.Cell>
                    <IndexTable.Cell>{baby_date}</IndexTable.Cell>
                    <IndexTable.Cell>
                        <div onClick={(e) => handleTrackModalClick(e, index)}>
                            <TrackModalExample trackingId={index} sub_order={order_list} />
                        </div>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <div onClick={handleTrackModalClick}>
                            <DeletePopup baby_order_number={baby_order_number} />
                        </div>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <div>
                            <Popover active={openCardIndex === index} activator={<div
                                onClick={(e) => { e.stopPropagation(); handleCardClick(index); toggleActive2(); }}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            >
                                {Object.keys(line_items).length} items
                                <Icon source={DropdownMinor} color="base" />
                            </div>} onClose={toggleActive2}>
                                {openCardIndex === index && <Grid>
                                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 12 }}>
                                        <LegacyCard sectioned style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            <Badge progress="complete">Item List</Badge>
                                            {line_items.map((item, i) => (
                                                <div key={i}>
                                                    <div style={{ display: 'flex', marginTop: '15px', alignItems: 'center' }}>
                                                        <div style={{ marginLeft: '8px' }}>
                                                            <Thumbnail
                                                                source={item.product_images}
                                                                alt="Black choker necklace"
                                                            />
                                                        </div>
                                                        <div style={{ marginLeft: '8px', whiteSpace: 'normal' }}>
                                                            <Text style={{ whiteSpace: 'normal' }}>
                                                                {item.name} <br /><Text>price: {item.quantity} x {item.price}</Text>
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </LegacyCard>
                                    </Grid.Cell>
                                </Grid>}
                            </Popover>
                        </div>
                    </IndexTable.Cell>
                </IndexTable.Row>
            </>
        ),
    );

    const [motherTrue, setMotherTrue] = useState(false);

    const rowMarkups = parentBabyOrder.length > 0 && parentBabyOrder.map(
        ({ price, mother_order_id
            , mother_order_date, mother_order_number
        }, index) => (
            <IndexTable.Row
                id={index + 100}
                key={index + 100}
                selected={motherTrue}
                position={index}
            >
                <IndexTable.Cell>{mother_order_id} </IndexTable.Cell>
                <IndexTable.Cell>{mother_order_number}</IndexTable.Cell>
                <IndexTable.Cell>{mother_order_date}</IndexTable.Cell>
                <IndexTable.Cell>${price}</IndexTable.Cell>
                <IndexTable.Cell>
                    <div onClick={(e) => handleTrackModalClick(e, index)}>
                        <TrackModalExample trackingId={index} sub_order={parentBabyOrder} />
                    </div>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <div onClick={handleTrackModalClick}>
                        <DeletePopup mother_order_number={mother_order_id} />
                    </div>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    // Use useEffect to update the babyIDs state
    useEffect(() => {
        // Extract all the baby_ID values from the order_list and store them in an array
        const extractedBabyIDs = order_list.map(item => item.baby_ID);
        const extractedBabyOrderIDs = order_list.map(item => item.baby_order_id);
        // Set the extracted baby_IDs in the state
        setBabyIDs(extractedBabyIDs);
        setBabyOrderIDs(extractedBabyOrderIDs)
    }, [order_list]);

    return (
        <>
            <div>
                <LegacyCard title="Baby Order Lists">
                    <div id='testhideid'>
                        <IndexTable
                            resourceName={resourceName}
                            itemCount={order_list.length}
                            selectedItemsCount={
                                allResourcesSelected ? 'All' : selectedResources.length
                            }
                            selectable
                            onSelectionChange={handleSelectionChange}
                            headings={[
                                { title: 'Order Number' },
                                { title: 'Products Details' },
                                { title: 'Date' },
                                { title: 'Options' },
                                // { title: 'Action' },
                            ]}
                        >
                            {rowMarkup}
                        </IndexTable>
                        {order_list.length > 9 && <>
                            <div className="Polaris-IndexTable__TableRow"></div>
                            <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px", paddingTop: "10px" }}>
                                <Pagination
                                    hasPrevious={currentPage > 1}
                                    hasNext={currentPage < totalPages}
                                    label={`${paginatedData.length} of ${order_list.length}`}
                                    onPrevious={() => handlePageChange(currentPage - 1)}
                                    onNext={() => handlePageChange(currentPage + 1)}
                                />
                            </div>
                        </>}
                    </div>
                </LegacyCard>
            </div>


            <div style={{ marginTop: "10px" }}>
                <LegacyCard title="Parent Baby Order Lists">
                    <div id='testhideid'>
                        <IndexTable
                            resourceName={resourceName}
                            itemCount={1}
                            selectedItemsCount={1}
                            selectable
                            onSelectionChange={() => { }}
                            headings={[
                                { title: 'Order Number' },
                                { title: 'Products Details' },
                                { title: 'Date' },
                                { title: 'Total' },
                                { title: 'Add Tracking' },
                                { title: 'Action' },
                            ]}
                        >
                            {rowMarkups}
                        </IndexTable>
                    </div>
                </LegacyCard>
            </div>
        </>
    );
}

export default AddproductTable;
