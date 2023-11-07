
import React, { useState, useEffect } from 'react';
import {
    Page,
    IndexTable,
    LegacyCard,
    Text,
    Badge,
    Pagination,
    Banner,
} from '@shopify/polaris';
import OpenModal from './openmodal';
import ActionListInPopoverExample from './items';
import './loader.css';
import { shop } from '../contant';
import { BaseURl } from '../contant';
import { useContext } from 'react';
import { ModalContext } from '../context/modalContext';
import axios from 'axios';

function Table() {

    const { setUniqOrderId, setOrder_List, order_list, setSelectedItems, setMotherOrderData, setShowtable, setParentBabyOrder, setLineItemsData, lineItemsData, setTableData } = useContext(ModalContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoading1, setIsLoading1] = useState(false);
    const [active, setActive] = useState(false);

    // babyorder available

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    // Function to fetch line items data

    const fetchLineItems = (orderId) => {
        setIsLoading(true);
        setIsLoading1(true);

        // Define your API endpoint
        const apiUrl = `https://${BaseURl}/get_baby_order?shop_name=${shop}&order_id=${orderId}`;

        // Use Axios to make the HTTP request
        axios.get(apiUrl)
            .then((response) => {
                const data = response.data;
                if (data.parent_baby_order_list) {
                    setParentBabyOrder(data.parent_baby_order_list);
                }
                if (data.order_list) {
                    setOrder_List(data.order_list);
                }
                if (data.order_list_extra[0].line_items) {
                    setTableData(data.order_list_extra[0].line_items);
                }
                console.log(data, "line items ..");
                setLineItemsData(data);
                setShowtable(true);
                setIsLoading(false);
                setIsLoading1(false);
            })
            .catch((error) => {
                console.error('Error fetching line items data:', error);
            });
    };

    const openModal = (order) => {
        setSelectedOrder(order);
        setUniqOrderId(order.order_id);
        fetchLineItems(order.order_id);
        setIsModalOpen(true);
        setActive(!active);
        setSelectedItems([]);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (BaseURl && shop) {
            // Fetch data from your API
            fetch(`https://${BaseURl}/Get_order_list?shop_name=${shop}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setOrders(data.order_list);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setIsLoading(true);
                });
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
                        onClick={() => openModal(order)}
                    >
                        {order.order_number}
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
            <IndexTable.Cell>$ {order.total_price}</IndexTable.Cell>
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
                <ActionListInPopoverExample
                    fulfillmentStatus={order.fulfillment_status}
                    itemsdata={order.line_items}
                    Item='ITEMS'
                />
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

    return (
        <>
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
                <Page title='Orders Lists'>
                    {orders.length === 0 && (

                        <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
                            <Banner title="Order Lists">
                                <p>no order created yet ...!!</p>
                            </Banner>
                        </div>
                    )}
                    <LegacyCard>
                        {isLoading ? (
                            <div className="spinner">
                                <div className="spinner-inner"></div>
                            </div>
                        ) : (
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
                                        { title: 'Items' },
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
                        )}
                    </LegacyCard>
                </Page>
            )}
        </>
    );
}

export default Table;
