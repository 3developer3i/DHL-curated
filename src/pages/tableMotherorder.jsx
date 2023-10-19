import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Badge,
    Page,
} from '@shopify/polaris';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import TrackModalExample from '../components/trackmodal';
import DeletePopup from '../components/popopdelete';
import {
    ChevronDownMinor
} from '@shopify/polaris-icons';

import { Button, Modal, FormLayout, TextField, Icon, ButtonGroup, Tooltip } from '@shopify/polaris';
import {
    ReceiptMajor, LegalMajor, PrintMajor, LocationsMinor
} from '@shopify/polaris-icons';

export default function MotherOrderList() {

    const [datas, setDatas] = useState([]);
    const [active, setActive] = useState(false);
    const [trackingNumbers, setTrackingNumbers] = useState(['']);
    const [shippingCarriers, setShippingCarriers] = useState(['']);
    const [isAdditionalFieldsDisabled, setIsAdditionalFieldsDisabled] = useState(true);

    const handleChange = useCallback(() => setActive(!active), [active]);


    const orders = [
        {
            id: '1020',
            order: '#1020',
            date: 'Jul 20 at 4:34pm',
            customer: 'Jaydon Stanton',
            total: '$969.44',
            paymentStatus: <Badge progress="complete">Paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
        {
            id: '1019',
            order: '#1019',
            date: 'Jul 20 at 3:46pm',
            customer: 'Ruben Westerfelt',
            total: '$701.19',
            paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
        {
            id: '1018',
            order: '#1018',
            date: 'Jul 20 at 3.44pm',
            customer: 'Leo Carder',
            total: '$798.24',
            paymentStatus: <Badge progress="complete">Paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
    ];

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };
    const [expandedRows, setExpandedRows] = useState({});


    const fetchAllBabyOrderlist = () => {
        axios
            .get("http://3itesth18.pagekite.me/all_baby_order?shop_name=user-action.myshopify.com")
            .then((res) => {
                console.log(res);
                setDatas(res.data.order_list);
            })
            .catch((err) => console.log(err));
    };
    const CustomTableHeader = () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon
                source={ChevronDownMinor}
                tone="base"
            />
        </div>
    );

    useEffect(() => {
        fetchAllBabyOrderlist();
    }, []);

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(datas);

    const handleRowToggle = (index) => {
        setExpandedRows((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };


    const rowMarkup = datas.slice(0, 5).map(
        (
            { id, baby_order_number, baby_title, baby_total, baby_date, customer, total, paymentStatus, fulfillmentStatus },
            index,
        ) => (
            <>
                <IndexTable.Row
                    id={id}
                    key={id}
                    // selected={selectedResources.includes(id)}
                    position={index}
                >
                    <IndexTable.Cell>
                        <Text variant="bodyMd" fontWeight="bold" as="span">
                            #M{baby_order_number}
                        </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell><Text variant="bodyMd" fontWeight="bold" as="span">{`${index === 2 ? "#DHL2, #DHL3, #DHL4" : index === 4 ? "#DHL6, #DHL7" : index === 1 ? "#DHL9, #DHL10" : index === 3 ? "#DHL11" : "#DHL12"}`}</Text></IndexTable.Cell>
                    <IndexTable.Cell>{baby_date}</IndexTable.Cell>
                    <IndexTable.Cell>{baby_total}</IndexTable.Cell>
                    <IndexTable.Cell>
                        <Modal
                            // activator={activator}
                            open={active}
                            onClose={handleChange}
                            title="Add Tracking"
                            secondaryActions={{
                                content: 'Close',
                                onAction: handleChange,
                            }}
                        >
                            <Modal.Section>
                                <FormLayout>
                                    <FormLayout.Group>
                                        <TextField
                                            type="text"
                                            label={`Tracking number`}
                                            // onChange={handleTrackingNumberChange(index)}
                                            // value={newDatas.trackingnumber}
                                            autoComplete="off"
                                        />
                                        <TextField
                                            type="text"
                                            label={`Shipping carrier`}
                                            // onChange={handleShippingCarrierChange(index)}
                                            // value={newDatas.shipmenttrackingnumber}
                                            // disabled={index === 0 ? false : isAdditionalFieldsDisabled}
                                            autoComplete="off"
                                        />
                                    </FormLayout.Group>
                                </FormLayout>
                            </Modal.Section>
                        </Modal>
                        <ButtonGroup>
                            <Tooltip content="Print Invoice">
                                <div>
                                    <Icon
                                        source={PrintMajor}
                                        tone="base"
                                        color='success'
                                    />
                                </div>
                            </Tooltip>
                            <Tooltip content="Package Slip">
                                <Icon
                                    source={ReceiptMajor}
                                    tone="base"
                                    color='base'
                                />
                            </Tooltip>
                            <Tooltip content="Commercial Invoice">
                                <Icon
                                    source={LegalMajor}
                                    tone="base"
                                    color='subdued'
                                />
                            </Tooltip>
                            <Tooltip content="Add Tracking">
                                <div onClick={handleChange}>
                                    <Icon
                                        source={LocationsMinor}
                                        tone="base"
                                        color='success'
                                    />
                                </div>
                            </Tooltip>
                        </ButtonGroup>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <DeletePopup />
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <>
                            <div onClick={() => handleRowToggle(index)}>
                                <Icon
                                    source={ChevronDownMinor}
                                    color="inkLightest"
                                />
                            </div>
                        </>
                    </IndexTable.Cell>
                </IndexTable.Row>
                {/* {expandedRows[index] && (
                    <IndexTable.Row>    
                        <div className='collpse'>
                        <IndexTable.Cell>
                            Additional details go here
                        </IndexTable.Cell>
                        </div>
                    </IndexTable.Row>
                )} */}
            </>
        ),
    );

    return (
        <Page><br/>
        <div id='mother-order'>
            <LegacyCard title="Mother Order Lists"><br />
                <IndexTable
                    resourceName={resourceName}
                    itemCount={orders.length}
                    selectedItemsCount={
                        allResourcesSelected ? 'All' : selectedResources.length
                    }
                    onSelectionChange={handleSelectionChange}
                    headings={[
                        { title: 'Order Number' },
                        { title: 'Babies Details    ' },
                        { title: 'Date' },
                        { title: 'Total' },
                        { title: 'Add Tracking' },
                        { title: 'Action' },
                        { title: "" },
                    ]}
                >
                    {rowMarkup}
                </IndexTable>
            </LegacyCard>
            </div>
        </Page>
    );
};