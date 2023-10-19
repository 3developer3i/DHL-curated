
import React, { useState, useEffect } from 'react';
import {
    Page,
    IndexTable,
    LegacyCard,
    Text,
    Badge,
} from '@shopify/polaris';
import OpenModal from './openmodal';
import ActionListInPopoverExample from './items';
import './loader.css';
import { shop } from '../contant';
import { BaseURl } from '../contant';
import { useContext } from 'react';
import { ModalContext } from '../context/modalContext';

function Table() {

    const { setUniqOrderId, setOrder_List, order_list, setSelectedItems, setMotherOrderData, setShowtable, setLineItemsData, lineItemsData, setTableData } = useContext(ModalContext);

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
    // https://3itesth18.pagekite.me/Get_line_items?shop_name=user-action.myshopify.com&order_id=5141685371061

    const fetchLineItems = (orderId) => {
        setIsLoading(true);
        setIsLoading1(true);
        fetch(`https://${BaseURl}/get_baby_order?shop_name=${shop}&order_id=${orderId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data, "line items ..");
                setLineItemsData(data); // Set the line items data in state
                setShowtable(true);
                setIsLoading(false);
                setIsLoading1(false);
                if (data.order_list_extra[0].line_items) {
                    setTableData(data.order_list_extra[0].line_items);
                };
                if (data.mother_order_list.length > 0) {
                    setMotherOrderData(data.mother_order_list);
                };
                if (data.order_list.length > 0) {
                    setOrder_List(data.order_list);
                } else {
                    setOrder_List([]);
                };
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
    }, []);

    const rowMarkup = orders.map((order) => (
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
                <Badge status={order.fulfillment_status ? 'success' : 'critical'}>
                    {order.fulfillment_status ? 'Fulfilled' : 'Unfulfilled'}
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
                    lineItemsData={lineItemsData} // Pass line items data to OpenModal
                    onClose={closeModal}
                    active={active}
                    setIsLoading1={setIsLoading1}
                    isLoading1={isLoading1}
                    setActive={setActive}
                    setIsModalOpen={setIsModalOpen}
                    alreadybabyorder={order_list}
                />
            ) : (
                <Page title='Orders Lists'>
                    <LegacyCard>
                        {isLoading ? (
                            <div className="spinner">
                                <div className="spinner-inner"></div>
                            </div>
                        ) : (
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
                        )}
                    </LegacyCard>
                </Page>
            )}
        </>
    );
}

export default Table;
