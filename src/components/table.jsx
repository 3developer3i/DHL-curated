
import React, { useState, useEffect, useCallback } from 'react';
import {
    Page,
    IndexTable,
    LegacyCard,
    Text,
    Badge,
    Pagination,
    Banner,
    Button,
    Toast,
    Frame, Icon, Popover,
} from '@shopify/polaris';
import OpenModal from './openmodal';
import ActionListInPopoverExample from './items';
import './loader.css';
import { conditionPath, shop } from '../contant';
import { BaseURl } from '../contant';
import { useContext } from 'react';
import { ModalContext } from '../context/modalContext';
import {
    DropdownMinor
} from '@shopify/polaris-icons';
import axios from 'axios';

function Table() {

    const { setNewPage_Order_Number, setUniqOrderId, setOrder_List, order_list, setSelectedItems, setMotherOrderData, setShowtable, setParentBabyOrder, setLineItemsData, lineItemsData, setTableData, setIdentifiersData, setNewPage_Order_NumberOrginal } = useContext(ModalContext);

    const currentPath = window.location.pathname;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoading1, setIsLoading1] = useState(false);
    const [active, setActive] = useState(false);
    const [genrateIdentifierMessage, setGenrateIdentifiersMessage] = useState('Message sent');
    const [identifierDataList, setIdentifiersList] = useState([]);


    const [toastactive, setToastActive] = useState(false);
    const toggleActive = useCallback(() => setToastActive((active) => !active), []);
    const toastMarkup = toastactive ? (
        <Toast content={genrateIdentifierMessage} onDismiss={toggleActive} />
    ) : null;

    const fetchSaveLineItemsApproved = async (orderId) => {
        setIsLoading(true);
        setIsLoading1(true);
        setNewPage_Order_Number(orderId)
        const apiUrl = `https://${BaseURl}/save_lineitem`;
        const formData = new FormData();
        formData.append("shop", shop);
        formData.append("order_number", orderId);
        try {
            const response = await axios.post(apiUrl, new URLSearchParams(formData));
            // console.log("new page.....46", response.data);
            if (response.data.status == 200) {
                // console.log("data created");
                setIsModalOpen(true);
                setIsLoading(false);
                setIsLoading1(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchGetOrderList = () => {
        fetch(`https://${BaseURl}/${currentPath == conditionPath ? 'Get_temp_order_list' : 'Get_order_list'}?shop_name=${shop}`)
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                setOrders(data.order_list);
                setIdentifiersList(data.identifierList);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(true);
            });
    };

    // main approval order APIs
    const mainOrderApprovedAPIs = async (order) => {
        setIsLoading(true);
        setIsLoading1(true);
        // setNewPage_Order_Number(orderId)
        const apiUrl = `https://${BaseURl}/main_order_approval`;
        const formData = new FormData();
        formData.append("shop", shop);
        formData.append("order_id", order.order_id);
        formData.append("order_number", order.order_number);
        try {
            const response = await axios.post(apiUrl, new URLSearchParams(formData));
            // console.log("new page.....76", response.data);
            if (response.data.status == 200) {
                // console.log("data created");
                setGenrateIdentifiersMessage(response.data.msg);
                toggleActive();
                fetchGetOrderList();
            }
        } catch (error) {
            console.log(error);
        }
    };
    // main approval order APIs
    const mainOrderRemoveAPIs = async (order) => {
        setIsLoading(true);
        setIsLoading1(true);
        // setNewPage_Order_Number(orderId)
        const apiUrl = `https://${BaseURl}/main_order_remove`;
        const formData = new FormData();
        formData.append("shop", shop);
        formData.append("order_id", order.order_id);
        formData.append("order_number", order.order_number);
        try {
            const response = await axios.post(apiUrl, new URLSearchParams(formData));
            // console.log("new page.....121", response.data);
            if (response.data.status == 200) {
                setGenrateIdentifiersMessage(response.data.msg);
                toggleActive();
                // ("data created");
                fetchGetOrderList();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleToggle = (order) => {
        const updatedItems = orders.map((lineItem) => {
            if (lineItem.order_number === order.order_number) {
                // Toggle the is_accepted property for the clicked item
                return { ...lineItem, is_accepted: !lineItem.is_accepted };
            }
            return lineItem;
        });

        // Update the state with the modified items
        setOrders(updatedItems);

        // Call your API function here with the updated item
        if (!order.is_accepted) {
            mainOrderApprovedAPIs(order);
        } else {
            mainOrderRemoveAPIs(order);
        }
    };

    // babyorder available

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    // Function to fetch line items data

    const fetchLineItems = async (orderId) => {
        setIsLoading(true);
        setIsLoading1(true);

        // if (currentPath == conditionPath) {
        //     const checkit = await fetchSaveLineItemsApproved(orderId);
        //     if (checkit == 200) {
        //         console.log("data created");
        //         setIsModalOpen(true);
        //         setIsLoading(false);
        //         setIsLoading1(false);
        //         return
        //     }
        // }

        // Define your API endpoint
        const apiUrl = `https://${BaseURl}/get_baby_order?shop_name=${shop}&order_id=${orderId}`;

        // Use Axios to make the HTTP request
        const response = await axios.get(apiUrl)
        try {
            const data = response.data;
            // console.log(data, "get baby order");
            if (data.status == 500) {
                setIsLoading(false);
                setIsLoading1(false);
                setGenrateIdentifiersMessage(data.msg);
                return toggleActive();
            }
            if (data.parent_baby_order_list) {
                setParentBabyOrder(data.parent_baby_order_list);
            }
            if (data.order_list) {
                setOrder_List(data.order_list);
            }
            if (data.order_list_extra[0].line_items) {
                // Function to replicate items based on quantity
                const replicateItems = (array) => {
                    return array.reduce((result, item) => {
                        // Replicate the item based on quantity
                        for (let i = 0; i < item.quantity; i++) {
                            result.push({ ...item });
                        }
                        return result;
                    }, []);
                };
                setTableData(data.order_list_extra[0].line_items);
            }
            // console.log(data, "line items ..");
            setIdentifiersData(data.identifier_Data);
            setLineItemsData(data);
            setIsModalOpen(true);
            setIsLoading(false);
            setIsLoading1(false);
            setShowtable(true);
        } catch {
            console.error('Error fetching line items data:');
        }
    };

    const openModal = (order) => {
        setSelectedOrder(order);
        setUniqOrderId(order.order_id);
        fetchLineItems(order.order_id);
        setActive(!active);
        setSelectedItems([]);
        // setTimeout(() => {
        //     setIsModalOpen(true);
        // }, 1000);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (BaseURl && shop) {
            fetchGetOrderList(BaseURl, shop)
        }
    }, [BaseURl, shop]);

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const paginatedData = orders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalItems = orders.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const rowMarkup = paginatedData.map((order) => (
        <IndexTable.Row key={order.order_id}>
            <IndexTable.Cell>
                <Text variant="bodyMd" fontWeight="bold" as="span">
                    <a
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            if (currentPath == conditionPath) {
                                setNewPage_Order_NumberOrginal(order.order_number)
                                // return mainOrderApprovedAPIs(order)
                            } else {
                                openModal(order);
                            }
                        }}
                    >
                        #{order.order_number}
                    </a>
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{order.created_at}</IndexTable.Cell>
            <IndexTable.Cell>
                {order.customer ? (
                    `${order.customer.first_name} ${order.customer.last_name}`
                ) : (
                    'No customer'
                )}
            </IndexTable.Cell>
            <IndexTable.Cell>${order.total_price}</IndexTable.Cell>
            <IndexTable.Cell>
                <Badge status={order.financial_status === 'paid' ? 'success' : 'warning'}>
                    {order.financial_status === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Badge status={order.fulfillment_status == "partial" ? 'warning' : order.fulfillment_status == null ? 'critical' : 'success'}>
                    {order.fulfillment_status == null ? 'UnFulfilled' : order.fulfillment_status == 'partial' ? order.fulfillment_status : order.fulfillment_status}
                </Badge>
            </IndexTable.Cell>
            <IndexTable.Cell>
                {currentPath != conditionPath ? <ActionListInPopoverExample
                    fulfillmentStatus={order.fulfillment_status}
                    itemsdata={order.line_items}
                    Item='ITEMS'
                /> :
                    <label className="switch">
                        <input
                            id={order.order_number}
                            type="checkbox"
                            checked={order.is_accepted}
                            onChange={(e) => handleToggle(order)}
                        />
                        <span className="slider round"></span>
                    </label>
                }
            </IndexTable.Cell>
        </IndexTable.Row>
    ));

    let trueData = true;

    useEffect(() => {
        if (trueData) {
            setIsLoading1(true);
            trueData = false
        } else {
            setIsLoading1(false)
        }
        return () => {
            trueData = false
        }
    }, []);

    const fetchGenrateIdentifiersData = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("shop", shop);
        // Define your API endpoint
        const apiUrl = `https://${BaseURl}/generate_identifier`;

        // Use Axios to make the HTTP request
        const response = await axios.post(apiUrl, formData);
        // console.log(response.data, "get identifiers");
        if (response.status == 200) {
            setGenrateIdentifiersMessage(response.data.msg);
            fetchGetOrderList()
            setIsLoading(false);
            setTimeout(() => {
                toggleActive()
            }, 2000);
        } else {
            setIsLoading(false);
        }
    };

    const [activeIdentifierModal, setActiveIdentifierModal] = useState(false);
    const Identifiers = ({ identifierData }) => {

        const toggleActive = useCallback(() => {
            setActiveIdentifierModal((prevActive) => !prevActive);
        }, []);

        const activator = (
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >

            </div>
        );
        return (
            <div>
                <Popover active={activeIdentifierModal} activator={activator} onClose={toggleActive}>
                    <LegacyCard sectioned style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {identifierData.map((item, i) => (
                            <div key={i}>
                                <div style={{ display: '', marginTop: '15px', alignItems: 'center' }}>
                                    <div style={{ marginLeft: '8px', whiteSpace: 'normal' }}>
                                        <Text style={{ whiteSpace: 'normal' }}>
                                            <Text fontWeight='bold'>{`Mother ${item.ID} (${item.created_parcel}/15)`}</Text>
                                            <Text>PID : {item.PID}</Text>
                                            <Text>SID : {item.SID}</Text>
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </LegacyCard>
                </Popover>
            </div>
        );
    };

    return (
        <>
            {isLoading &&
                <div className="spinner">
                    <img src="https://i.stack.imgur.com/hzk6C.gif" id='loader' alt="Loading..." />
                </div>
            }
            {isModalOpen ? (
                <OpenModal
                    order={selectedOrder}
                    lineItemsData={lineItemsData}
                    active={active}
                    setIsLoading1={setIsLoading1}
                    isLoading1={isLoading1}
                    setActive={setActive}
                    setIsModalOpen={setIsModalOpen}
                    alreadybabyorder={order_list}
                />
            ) : (
                <div id='align-identi'>
                    <Page title={
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>Orders Lists</div>
                            {currentPath != conditionPath && <div>
                                <Button onClick={() => fetchGenrateIdentifiersData()} pressed><span style={{ display: "flex", alignItems: 'center' }}> <p>Generate Identifiers ({`${identifierDataList.length}`})</p>
                                    <p onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveIdentifierModal(!activeIdentifierModal)

                                    }}><Icon source={DropdownMinor} /></p></span></Button>
                                {activeIdentifierModal && <Identifiers
                                    identifierData={identifierDataList}
                                    Item='ITEMS' />}
                            </div>}
                        </div>}>
                        {orders.length === 0 && (

                            <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
                                <Banner title="Order Lists">
                                    <p>no order created yet ...!!</p>
                                </Banner>
                            </div>
                        )}
                        {orders.length > 0 && <LegacyCard>
                            {/* {isLoading ? (
                            <div className="spinner">
                                <div className="spinner-inner"></div>
                            </div>
                        ) : ( */}
                            <>
                                <IndexTable
                                    selectable={false}
                                    resourceName={resourceName}
                                    itemCount={orders.length}
                                    headings={[
                                        { title: 'Order Number' },
                                        { title: 'Date' },
                                        { title: 'Customer' },
                                        { title: 'Total' },
                                        { title: 'Payment status' },
                                        { title: 'Fulfillment status' },
                                        { title:  currentPath == conditionPath ?  '' : 'Items' },
                                    ]}
                                >
                                    {rowMarkup}
                                </IndexTable>
                                <div className="Polaris-IndexTable__TableRow"></div>
                                <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px", paddingTop: "10px" }}>
                                    <Pagination
                                        hasPrevious={currentPage > 1}
                                        hasNext={currentPage < totalPages}
                                        label={`${paginatedData.length} of ${orders.length}`}
                                        onPrevious={() => handlePageChange(currentPage - 1)}
                                        onNext={() => handlePageChange(currentPage + 1)}
                                    />
                                </div>
                            </>
                            {/* )} */}
                        </LegacyCard>}
                    </Page>
                </div>
            )}
            <div>
                <Frame>
                    {toastMarkup}
                </Frame>
            </div>
        </>
    );

}

export default Table;
