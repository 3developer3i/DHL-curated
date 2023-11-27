
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
    Link, Grid, Badge,
    Pagination,
    Popover, Icon, Tooltip, Modal
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
import { BaseURl, shop } from '../contant';

function AddproductTable({ number }) {

    // const Ids = id;
    const modalcontext = useContext(ModalContext);
    const { setTrackingId, setBabyorderlists, order_list, setMotherOrder, orderlength, uniqOrderId, setTableData, parentBabyOrder, setOrder_List, setBabyOrderIDs, setParentBabyOrder, setBabyIDs, setIsLoading } = modalcontext;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    // baby order pagination
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

    // parent baby order pagination
    const [toggle1, setToggle1] = useState(false);
    const [currentPage1, setCurrentPage1] = useState(1);
    const ITEMS_PER_PAGE1 = 10;

    const paginatedData1 = parentBabyOrder && parentBabyOrder.slice(
        (currentPage1 - 1) * ITEMS_PER_PAGE1,
        currentPage1 * ITEMS_PER_PAGE1
    );

    const totalItems1 = parentBabyOrder && parentBabyOrder.length;
    const totalPages1 = Math.ceil(totalItems1 / ITEMS_PER_PAGE1);

    const handlePageChange1 = (newPage) => {
        setCurrentPage1(newPage);
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

    const fetchLineItems = async () => {
        fetch(`https://${BaseURl}/get_baby_order?shop_name=${shop}&order_id=${uniqOrderId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data, "test...");
                setTableData(data.order_list_extra[0].line_items);
                setOrder_List(data.order_list);
                setParentBabyOrder(data.parent_baby_order_list);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching line items data:', error);
            });
    };

    const rowMarkup = paginatedData && paginatedData.map(
        ({ baby_ID, baby_date, item_quantity, line_items }, index) => (
            <>
                <IndexTable.Row
                    id={index + 10}
                    key={index + 10}
                    selected={selectedResources.includes(index + 10)}
                    position={index}
                    onClick={() => setToggle(!toggle)}
                >
                    <IndexTable.Cell>#{number}</IndexTable.Cell>
                    <IndexTable.Cell>#{baby_ID}</IndexTable.Cell>
                    {/* <IndexTable.Cell>{baby_title}</IndexTable.Cell> */}
                    <IndexTable.Cell>{baby_date}</IndexTable.Cell>
                    <IndexTable.Cell>
                        <div onClick={(e) => handleTrackModalClick(e, index)}>
                            <TrackModalExample trackingId={index} sub_order={order_list} />
                        </div>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <div onClick={handleTrackModalClick}>
                            <DeletePopup baby_order_number={baby_ID} />
                        </div>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <div>
                            <Popover active={openCardIndex === index} activator={<div
                                onClick={(e) => { e.stopPropagation(); handleCardClick(index); toggleActive2(); }}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            >
                                {item_quantity} items
                                <Icon source={DropdownMinor} color="base" />
                            </div>} onClose={toggleActive2}>
                                
                                    {openCardIndex === index &&
                                        <div>
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
                                        </div>
                                    }
                            </Popover>
                        </div>
                    </IndexTable.Cell>
                </IndexTable.Row>
            </>
        ),
    );

    const [motherTrue, setMotherTrue] = useState(false);

    const rowMarkups = paginatedData1.length > 0 && paginatedData1.map(
        ({ price, mother_order_id
            , mother_order_date, mother_order_number
        }, index) => (
            <IndexTable.Row
                id={index + 100}
                key={index + 100}
                selected={motherTrue}
                position={index}
            >
                <IndexTable.Cell>#{mother_order_id} </IndexTable.Cell>
                <IndexTable.Cell>{mother_order_number}</IndexTable.Cell>
                <IndexTable.Cell>{mother_order_date}</IndexTable.Cell>
                <IndexTable.Cell>${price}</IndexTable.Cell>
                <IndexTable.Cell>
                    <div onClick={(e) => handleTrackModalClick(e, index)}>
                        <TrackModalExample trackingId={index} sub_order={parentBabyOrder} />
                    </div>
                </IndexTable.Cell>
                {/* <IndexTable.Cell>
                    <div>
                        <Tooltip content="delete">
                            <Button destructive onClick={() => setIsDeleteModalOpen(true)} size='micro' accessibilityLabel='Delete' icon={DeleteMajor}></Button>
                        </Tooltip>
                        {isDeleteModalOpen && <Modal
                            open={isDeleteModalOpen}
                            onClose={() => setIsDeleteModalOpen(false)}
                            title="Delete Confirmation"
                            primaryAction={{
                                content: 'Delete',
                                onAction: () => deleteParentBabyorder(mother_order_id),
                            }}
                            secondaryActions={[
                                {
                                    content: 'Cancel',
                                    onAction: () => setIsDeleteModalOpen(false),
                                },
                            ]}
                            size="small"
                        >
                            <Modal.Section>
                                <TextContainer>
                                    <p style={{ fontSize: '15px', fontWeight: 'bold' }}>Are you sure you want to delete the baby order #{mother_order_id}?</p>
                                </TextContainer>
                            </Modal.Section>
                        </Modal>}
                    </div>
                </IndexTable.Cell> */}
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

            {order_list.length > 0 && <div>
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
                                { title: 'Baby Id' },
                                // { title: 'Products Details' },
                                { title: 'Date' },
                                { title: 'Options' },
                                { title: 'action' },
                                { title: 'items' }
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
            </div>}

            {parentBabyOrder.length > 0 && <div style={{ marginTop: "10px" }}>
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
                                { title: 'Options' }
                            ]}
                        >
                            {rowMarkups}
                        </IndexTable>
                        {parentBabyOrder.length > 9 &&
                            <>
                                <div className="Polaris-IndexTable__TableRow"></div>
                                <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px", paddingTop: "10px" }}>
                                    <Pagination
                                        hasPrevious={currentPage1 > 1}
                                        hasNext={currentPage1 < totalPages1}
                                        label={`${paginatedData1.length} of ${parentBabyOrder.length}`}
                                        onPrevious={() => handlePageChange1(currentPage1 - 1)}
                                        onNext={() => handlePageChange1(currentPage1 + 1)}
                                    />
                                </div>
                            </>
                        }
                    </div>
                </LegacyCard>
            </div>}
            <br/><br/><br/>

        </>
    );
}

export default AddproductTable;
